
const mapKey = '';
const connectFirebase = (token) => new Promise((resolve, reject) => {
 if(!token) {
   return reject('No valid token found')
 }
 try {
  const config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
  };
   firebase.initializeApp(config);
   resolve(firebase.database());
 } catch (err) {
   reject(err)
 }
})

const updateSigned = function (eventData, token, dbRef) {
  const newRecord = dbRef.ref(`${token}/recentActivities`).push()
  newRecord.set(eventData.value)
  dbRef.ref(`${token}/totalSigned`).transaction(val => (val || 0) + 1);
}

const getQueryParam = (key = 'token') => {
  key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
  var match = location.search.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)"));
  return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

const attachEventListeners = (firebaseRef, token) => new Promise((resolve, reject) => {
  const dbRef = firebaseRef.database();
  const storageRef = firebaseRef.storage();
  window.addEventListener('message', event => {
    console.log('Write Event Triggered by Origin: ', event.origin)
    // TODO: Verify origin
    // if (event.origin !== 'http://www.enkode.com') {
    //   return reject('Unauthorised origin');
    // }
    try {
      if (typeof event.data !== 'string') {
        return
      }
      let eventData = JSON.parse(event.data);
      switch (eventData.type) {
        case 'SUBMIT':
          if (!eventData.value.loc) {
            eventData.value['mapUrl'] = './images/image3.jpg';
            updateSigned(eventData, token, dbRef);
          } else {
            let file = `https://maps.googleapis.com/maps/api/staticmap?key=${mapKey}&color=gray&zoom=6&size=100x100&style=feature:landscape%7Celement:geometry%7Cvisibility:on&center=${eventData.value.loc}&format=png`
            let xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = () => {
              const blob = xhr.response;
              const imageName = new Date()
              storageRef.ref(token).child(`images/${imageName}.png`).put(blob).then(() => {
                storageRef.ref(token).child(`images/${imageName}.png`).getDownloadURL().then((url) => {
                  eventData.value['mapUrl'] = url;
                  updateSigned(eventData, token, dbRef)
                });
              });
            };
            xhr.open('GET', file);
            xhr.send();
          }
          break;
        case 'VISIT_TIME':
          const customData2 = JSON.parse(event.data)
          // TODO: Call Backend API to resolve other info from IP
          const newRecord2 = dbRef.ref(`${token}/recentVisits`).push()
          newRecord2.set(customData2.value)
          dbRef.ref(`${token}/totalVisited`).transaction(val => (val || 0) + 1);
          break;
        case 'PAGE_VISIT':
          dbRef.ref(`${token}/liveVisiting`).transaction(val => (val || 0) + 1);
          break;
        case 'PAGE_LEAVE':
          dbRef.ref(`${token}/liveVisiting`).transaction(val => Math.max(0, (val || 0) - 1));
          break;
        default:
          console.log('UPSUPPORTED EVENT TYPE: ' + eventData.type)
          break;
      }
    } catch (err) {
      console.log(err)
    }
  }, false)
  resolve()
})

const attachEventEmitters = (dbRef, token) => new Promise((resolve, reject) => {
  try {
    dbRef.database().ref().child(token).on("value", data => emitEvent(data.val()))
    return resolve(dbRef)
  } catch (err) {
    reject(err)
  }
})

const emitEvent = (data) => {
  window.parent.postMessage(JSON.stringify({
    type: 'CUSTOMIZABLE_PARAMS',
    value: data
  }), "*")
}

window.onload = () => {
  console.log('Initiated!!!')
  const token = getQueryParam('token')
  connectFirebase(token)
    .then(dbRef => attachEventEmitters(dbRef, token))
    .then(dbRef => attachEventListeners(dbRef, token))
    .catch(console.error)
}

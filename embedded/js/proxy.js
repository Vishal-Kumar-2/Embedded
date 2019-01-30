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

const getQueryParam = (key = 'token') => {
 key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
 var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
 return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

const attachEventListeners = (dbRef, token) => new Promise((resolve, reject) => {
 window.addEventListener('message', event => {
    console.log('Write Event Triggered by Origin: ', event.origin)
    // TODO: Verify origin
    // if (event.origin !== 'http://www.enkode.com') {
    //   return reject('Unauthorised origin');
    // }
    try {
      if(typeof event.data !== 'string') {
        return
      }
      let eventData = JSON.parse(event.data);
      switch (eventData.type) {
        case 'SUBMIT':
          const customData = JSON.parse(event.data)
          // TODO: Call Backend API to resolve other info from IP
          const newRecord = dbRef.ref(`${token}/recentActivities`).push()
          newRecord.set(customData.value)
          dbRef.ref(`${token}/totalSigned`).transaction(val => (val || 0) + 1);
          break;
        case 'PAGE_VISIT':
          dbRef.ref(`${token}/liveVisiting`).transaction(val => (val || 0) + 1);
          break;
        default:
          console.log('UPSUPPORTED EVENT TYPE: ' + eventData.type)
          break;
      }

      if (eventData.type === 'SUBMIT') {
        const { totalVisited, liveVisiting, totalSigned } = eventData.value
        recentActivities = eventData.value.activities
        data = { totalVisited, liveVisiting, totalSigned }
      }
    } catch(err) {
      console.log(err)
    }
 }, false)
 resolve()
})

const attachEventEmitters = (dbRef, token) => new Promise((resolve, reject) => {
 try {
   dbRef.ref().child(token).on("value", data => emitEvent(data.val()))
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

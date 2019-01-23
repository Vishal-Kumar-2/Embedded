const connectFirebase = (token) => new Promise((resolve, reject) => {
 debugger;
 if(!token) {
   return reject('No valid token found')
 }
 try {
   const config = {
     apiKey: "AIzaSyAi_KUN3O8Q7n0qKtQ74uXui_gpFclMbu0",
     authDomain: "my-dummy-project-465dd.firebaseapp.com",
     databaseURL: "https://my-dummy-project-465dd.firebaseio.com",
     projectId: "my-dummy-project-465dd",
     storageBucket: "my-dummy-project-465dd.appspot.com",
     messagingSenderId: "900909035618"
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
    if(event.type === 'SUBMIT') {
     const customData = JSON.parse(event.data)
     console.log(customData, '=====customData====')
    }
//    dbRef.ref(token).set(customData)
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

  let eventData = {
    type: 'CUSTOMIZABLE_PARAMS',
    value: JSON.parse(data.replace(/(^")|("$)/g, ''))
  }
  debugger;
  window.parent.postMessage(JSON.stringify(eventData), "*")
}

$(() => {
 //Gets custom field using token
 // getDataUsingToken()
 //   .then(data => addWidget(data))
 //   .catch((err) => {
 //     // console.error(`Backend server is off! ${err}`);
 //     addWidget();
 //   });
 console.log('Initiated!!!')
 const token = getQueryParam('token')
 connectFirebase(token)
   .then(dbRef => attachEventEmitters(dbRef, token))
   .then(dbRef => attachEventListeners(dbRef, token))
   .catch(console.error)
});

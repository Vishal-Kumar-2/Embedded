import config from 'config';
import * as firebase from 'firebase';

const firebaseApp = firebase.initializeApp(config.firebase.config);

export default firebaseApp;
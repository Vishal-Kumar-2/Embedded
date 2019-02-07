import config from 'config';
import * as firebase from 'firebase';

const firebaseApp = firebase.initializeApp(config.firebase.config);

export const updateReference = (ref, dataToUpdate) => {
  ref.set(dataToUpdate);
}

export const getReference = (path) => firebaseApp.database().ref(`${path}`);
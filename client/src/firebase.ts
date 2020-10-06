import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAr1pZQIeCDL6A0SAoZnSlqPc_gGu_HMz4",
    authDomain: "chat-app-b7a6a.firebaseapp.com",
    databaseURL: "https://chat-app-b7a6a.firebaseio.com",
    projectId: "chat-app-b7a6a",
    storageBucket: "chat-app-b7a6a.appspot.com",
    messagingSenderId: "392704589385",
    appId: "1:392704589385:web:534d397642d9ff05ba4998",
    measurementId: "G-5DRLHGW9Z9"
};

firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export const storage = firebase.storage();

export default firebase;
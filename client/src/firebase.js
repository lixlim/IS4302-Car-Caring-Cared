import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';

var firebaseConfig = {
  apiKey: "AIzaSyAN_u2iHxqXw6-TaLlZEFApLudv0_6b1T8",
  authDomain: "is4302-car-caring-cared.firebaseapp.com",
  projectId: "is4302-car-caring-cared",
  storageBucket: "is4302-car-caring-cared.appspot.com",
  messagingSenderId: "477149495037",
  appId: "1:477149495037:web:6d435b35caaaa4e834c894"
};

firebase.initializeApp(firebaseConfig);

// using the emulator

// if (window.location.hostname.includes('localhost')) {
//   firebase.database().useEmulator("localhost", 9000);
// }

export default firebase.database();
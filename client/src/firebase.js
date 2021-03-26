import firebase from "firebase/app";

var firebaseConfig = {
    apiKey: "AIzaSyAN_u2iHxqXw6-TaLlZEFApLudv0_6b1T8",
    authDomain: "is4302-car-caring-cared.firebaseapp.com",
    projectId: "is4302-car-caring-cared",
    storageBucket: "is4302-car-caring-cared.appspot.com",
    messagingSenderId: "477149495037",
    appId: "1:477149495037:web:6d435b35caaaa4e834c894"
};

firebase.initializeApp(firebaseConfig);

// eslint-disable-next-line no-restricted-globals
if (location.hostname === 'localhost') {
    db.useEmulator('localhost', 8080);
    auth().useEmulator('http://localhost:9099/', { disableWarnings: true });
}


if (location.hostname === "localhost") {
  // Point to the RTDB emulator running on localhost.
  firebase.database().useEmulator("localhost", 9000);
  firebase.auth.useEmulator('http://localhost:9099/', { disableWarnings: true });
} 

export default firebase;
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

try {
  const firebaseConfig = {
    apiKey: "AIzaSyBY6W4R-um6DDynmX9nIZlwpAngFVDalzM",
    authDomain: "wms-demo-4478e.firebaseapp.com",
    projectId: "wms-demo-4478e",
    storageBucket: "wms-demo-4478e.appspot.com",
    messagingSenderId: "530564375885",
    appId: "1:530564375885:web:6cc0c64264d39f8f9fc304",
    measurementId: "G-MKWXDX63HQ"
  };

  firebase.initializeApp(firebaseConfig);
} catch (err) { }

export const firebaseAuth = firebase.auth();
export const firestoreDB = firebase.firestore();

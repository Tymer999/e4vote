// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQ5vkgPITPBTG0dFHI-eV3GaKGMFTaKHM",
  authDomain: "evote-ad7f4.firebaseapp.com",
  projectId: "evote-ad7f4",
  storageBucket: "evote-ad7f4.firebasestorage.app",
  messagingSenderId: "621687692562",
  appId: "1:621687692562:web:56051b53ee96400d9ee7cb"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export {app, auth, db}
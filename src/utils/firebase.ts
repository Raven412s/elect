// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC6bsRU2_JFinEldFCZ8o87RTSQJ18q6IQ",
    authDomain: "elect-d8c1c.firebaseapp.com",
    projectId: "elect-d8c1c",
    storageBucket: "elect-d8c1c.firebasestorage.app",
    messagingSenderId: "474162364199",
    appId: "1:474162364199:web:c350bc67709a38f7243302",
    measurementId: "G-HYSND61C4K"
  };

// Initialize Firebase
const app = getApps.length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage()
const db = getDatabase(app);

export {auth, db}

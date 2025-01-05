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
    apiKey: "AIzaSyCdgCJYgLyGaJmoieFrD3hR3lSH2ZpD_ck",
    authDomain: "elect-88d2f.firebaseapp.com",
    databaseURL: "https://elect-88d2f-default-rtdb.firebaseio.com",
    projectId: "elect-88d2f",
    storageBucket: "elect-88d2f.firebasestorage.app",
    messagingSenderId: "880369124588",
    appId: "1:880369124588:web:cda5402cd7fb424d5011c9",
    measurementId: "G-SKGSBYG741"
  };


// Initialize Firebase
const app = getApps.length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage()
const db = getDatabase(app);

export {auth, db}

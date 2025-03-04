// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCX1tnBfwkFs2rsgN0eyc1ztFy1QG0NFI4",
  authDomain: "buko-aba59.firebaseapp.com",
  projectId: "buko-aba59",
  storageBucket: "buko-aba59.firebasestorage.app",
  messagingSenderId: "959539291084",
  appId: "1:959539291084:web:cd05953861cf491f43b369",
  measurementId: "G-1RTS0RMC47",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
const auth = getAuth(app);
const db = getFirestore(app);

export { auth,db };
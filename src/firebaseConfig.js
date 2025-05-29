// Import the functions you need from the Firebase SDKs
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
// ✅ Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCX1tnBfwkFs2rsgN0eyc1ztFy1QG0NFI4",
  authDomain: "buko-aba59.firebaseapp.com",
  projectId: "buko-aba59",
  databaseURL: "https://buko-aba59-default-rtdb.firebaseio.com",
  storageBucket: "buko-aba59.appspot.com",
  messagingSenderId: "959539291084",
  appId: "1:959539291084:web:cd05953861cf491f43b369",
  measurementId: "G-1RTS0RMC47",
};

// ✅ Safe initialize
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export services
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

export { auth, db, database };

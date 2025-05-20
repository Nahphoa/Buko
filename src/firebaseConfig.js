// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Optional for future file uploads

// Firebase configuration (same as yours)
const firebaseConfig = {
  apiKey: "AIzaSyCcwasrNUgkN0EOc6aG_oMSvzaDhai1PQo",
  authDomain: "buko-418c4.firebaseapp.com",
  projectId: "buko-418c4",
  storageBucket: "buko-418c4.appspot.com", // Changed to standard format
  messagingSenderId: "925086713745",
  appId: "1:925086713745:web:016065c6e0be11ae3cbc30",
  measurementId: "G-BRMKY64TFH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Optional for future use

// Enable offline persistence (recommended for mobile apps)
enableFirestoreOffline();

async function enableFirestoreOffline() {
  try {
    await enableIndexedDbPersistence(db, {
      forceOwnership: true
    });
    console.log("Firestore offline persistence enabled");
  } catch (err) {
    if (err.code === 'failed-precondition') {
      console.warn(
        "Offline persistence can only be enabled in one tab at a time."
      );
    } else if (err.code === 'unimplemented') {
      console.warn(
        "The current browser does not support offline persistence."
      );
    }
  }
}

// Export services
export { auth, db, storage };
export default app;
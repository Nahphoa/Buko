// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcwasrNUgkN0EOc6aG_oMSvzaDhai1PQo",
  authDomain: "buko-418c4.firebaseapp.com",
  projectId: "buko-418c4",
  storageBucket: "buko-418c4.appspot.com",
  messagingSenderId: "925086713745",
  appId: "1:925086713745:web:016065c6e0be11ae3cbc30",
  measurementId: "G-BRMKY64TFH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firestore with settings
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

// Export the initialized services
export { auth, db, storage };
export default app;
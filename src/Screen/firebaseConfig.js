// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcwasrNUgkN0EOc6aG_oMSvzaDhai1PQo",
  authDomain: "buko-418c4.firebaseapp.com",
  projectId: "buko-418c4",
  storageBucket: "buko-418c4.firebasestorage.app",
  messagingSenderId: "925086713745",
  appId: "1:925086713745:web:016065c6e0be11ae3cbc30",
  measurementId: "G-BRMKY64TFH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export {auth,db};
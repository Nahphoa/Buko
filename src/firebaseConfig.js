// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCcwasrNUgkN0EOc6aG_oMSvzaDhai1PQo",
  authDomain: "buko-418c4.firebaseapp.com",
  projectId: "buko-418c4",
  storageBucket: "buko-418c4.appspot.com",
  messagingSenderId: "925086713745",
  appId: "1:925086713745:web:016065c6e0be11ae3cbc30",
  measurementId: "G-BRMKY64TFH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;

// firebaseConfig.js

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase config object
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

// Initialize Firebase app or get existing
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);


const saveProfileData = async (data) => {
  try {
    await AsyncStorage.setItem('profileData', JSON.stringify(data));
  } catch (error) {
    console.log('AsyncStorage save error:', error);
  }
};

const loadProfileData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('profileData');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.log('AsyncStorage load error:', error);
    return null;
  }
};

const clearProfileData = async () => {
  try {
    await AsyncStorage.removeItem('profileData');
  } catch (error) {
    console.log('AsyncStorage clear error:', error);
  }
};

export {
  auth,
  db,
  database,
  saveProfileData,
  loadProfileData,
  clearProfileData,
};

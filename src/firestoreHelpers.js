// src/utils/firestoreHelpers.js
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const savePassengerData = async (passenger) => {
  try {
    const docRef = await addDoc(collection(db, 'passengers'), passenger);
    console.log('Passenger saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving passenger data:', error);
    throw error;
  }
};

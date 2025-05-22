// setAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = 'REPLACE_WITH_USER_UID'; // Replace with the actual user UID

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`Admin claim set for user ${uid}`);
  })
  .catch(error => {
    console.error('Error setting admin claim:', error);
  });
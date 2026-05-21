const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// In a real production app, you would download the service account JSON 
// and set the GOOGLE_APPLICATION_CREDENTIALS env var or initialize like this:
// const serviceAccount = require('./path-to-serviceAccountKey.json');

// For this demo/setup, we'll use env variables for sensitive info
// OR expect the user to provide the service account JSON path

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    // Fallback for development if only using the SDK for client-side
    // This will error if you try to use auth() features without proper init
    console.warn('Firebase Service Account not provided. Auth verification may fail.');
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
}

module.exports = admin;

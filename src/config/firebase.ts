// Import the functions you need from the SDKs you need

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import config from "./config";
const firebaseConfig = {
  apiKey: config.firebaseApiKey,
  authDomain: "vidscribe-9123.firebaseapp.com",
  projectId: "vidscribe-9123",
  storageBucket: "vidscribe-9123.firebasestorage.app",
  messagingSenderId: config.firebaseMessagingSenderId,
  appId: config.firebaseAppId,
  measurementId: config.firebaseMeasurementId
};

// Initialize Firebase
export {firebaseConfig};
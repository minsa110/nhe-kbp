// Copy this file to js/config.js and fill in your Firebase project values.
// Find these in: Firebase Console → Project Settings → Your apps → SDK setup
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// The email that gets site admin access automatically on first login.
const SITE_ADMIN_EMAIL = "you@example.com";

const SCHOOL_NAME = "Newport Heights Elementary";
const PROGRAM_NAME = "Korean Bilingual Program";
const GRADES = ["Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade"];

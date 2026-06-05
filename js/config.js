const firebaseConfig = {
  apiKey: "AIzaSyBbEJXmsiqhcMRpuaBioet1GQ_RbwTUpKQ",
  authDomain: "nhe-kbp.firebaseapp.com",
  projectId: "nhe-kbp",
  storageBucket: "nhe-kbp.firebasestorage.app",
  messagingSenderId: "1091559881316",
  appId: "1:1091559881316:web:d2fc559977f7d0baf7fd71"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// This email always gets site admin access on first login. Change to your email.
const SITE_ADMIN_EMAIL = "minsa110@gmail.com";

const SCHOOL_NAME = "Newport Heights Elementary";
const PROGRAM_NAME = "Korean Bilingual Program";
const GRADES = ["Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade"];

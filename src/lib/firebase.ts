// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJcjuTaQsaPhRfTVE4q8lID_ciQWFHPYs",
  authDomain: "minha-receita-digital.firebaseapp.com",
  projectId: "minha-receita-digital",
  storageBucket: "minha-receita-digital.appspot.com",
  messagingSenderId: "910220190645",
  appId: "1:910220190645:web:28824986ededdfe4b56ffc"
};

// Initialize Firebase for client-side usage
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

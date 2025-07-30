
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// =================================================================
// PROJETO ATUALMENTE CONECTADO: conisopay
// Este é o projeto que o seu site (Netlify) está usando.
// Tanto o webhook quanto o cadastro de receitas devem funcionar aqui.
// =================================================================
const firebaseConfig = {
  "projectId": "conisopay",
  "appId": "1:36928452779:web:dcac5f4747d97f98b49fee",
  "storageBucket": "conisopay.firebasestorage.app",
  "apiKey": "AIzaSyCTjIAmZnlCHCUWzTO3anjkP5gvnRdfS_E",
  "authDomain": "conisopay.firebaseapp.com",
  "messagingSenderId": "36928452779"
};

// Initialize Firebase for client-side usage
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


export { app, auth, db, storage };




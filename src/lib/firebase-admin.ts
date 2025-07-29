
import * as admin from 'firebase-admin';

// Corrige a formatação da chave privada lida das variáveis de ambiente
const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

if (!admin.apps.length) {
  try {
    // Verifica se as variáveis de ambiente essenciais estão presentes
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
        console.error('Firebase admin initialization error: Missing environment variables. Make sure NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set.');
    } else {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
          }),
          databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`
        });
    }
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

const auth = admin.auth();
const db = admin.firestore();

export { auth, db };

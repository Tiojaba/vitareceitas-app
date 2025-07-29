
import * as admin from 'firebase-admin';

const serviceAccountString = process.env.FIREBASE_ADMIN_SDK_CONFIG;

if (!admin.apps.length) {
  if (serviceAccountString) {
    try {
      const serviceAccount = JSON.parse(serviceAccountString);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("Firebase Admin SDK inicializado com sucesso.");
    } catch (e) {
      console.error('Falha CRÍTICA ao parsear ou inicializar o Firebase Admin SDK:', e);
    }
  } else {
    console.warn('A variável de ambiente FIREBASE_ADMIN_SDK_CONFIG não está definida. A API de Admin não funcionará.');
  }
}

export const auth = admin.auth();
export const db = admin.firestore();


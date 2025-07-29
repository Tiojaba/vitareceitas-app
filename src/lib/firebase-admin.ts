
import * as admin from 'firebase-admin';

// Variável que conterá o JSON de configuração completo
const serviceAccountString = process.env.FIREBASE_ADMIN_SDK_CONFIG;

if (!admin.apps.length) {
  try {
    if (!serviceAccountString) {
      console.error('Firebase admin initialization error: Missing environment variable FIREBASE_ADMIN_SDK_CONFIG. This should be the JSON content of your service account key.');
    } else {
      // Parse a string JSON para um objeto
      const serviceAccount = JSON.parse(serviceAccountString);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
      });
    }
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

const auth = admin.auth();
const db = admin.firestore();

export { auth, db };

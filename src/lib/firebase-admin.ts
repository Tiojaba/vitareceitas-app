
import * as admin from 'firebase-admin';

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

const hasAdminConfig = privateKey && clientEmail && projectId;

function initializeAdmin() {
  if (hasAdminConfig && !admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        databaseURL: `https://${projectId}.firebaseio.com`
      });
    } catch (error: any) {
      console.error('Falha ao inicializar o Firebase Admin SDK:', error.message);
    }
  }
}

initializeAdmin();

const auth = admin.auth();
const db = admin.firestore();

export { auth, db };

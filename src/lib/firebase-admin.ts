
import * as admin from 'firebase-admin';

// Variável para armazenar a promessa de inicialização e garantir que ela seja executada apenas uma vez.
let adminApp: admin.app.App | null = null;

function initializeAdmin() {
  if (admin.apps.length > 0) {
    if (!adminApp) {
        adminApp = admin.app();
    }
    return adminApp;
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    throw new Error('As variáveis de ambiente do Firebase Admin não foram definidas corretamente.');
  }

  try {
    adminApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      databaseURL: `https://${projectId}.firebaseio.com`
    });
    return adminApp;
  } catch (error: any) {
    console.error('Falha ao inicializar o Firebase Admin SDK:', error.message);
    throw error;
  }
}

// Garante que a inicialização ocorra
initializeAdmin();

const auth = admin.auth();
const db = admin.firestore();

export { auth, db };

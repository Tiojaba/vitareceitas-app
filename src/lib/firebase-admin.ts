
import * as admin from 'firebase-admin';

// Variáveis de ambiente para as credenciais do Firebase Admin
// No seu ambiente local, você pode usar um arquivo .env.local
// Em produção (Firebase Hosting/Functions), essas variáveis são definidas automaticamente
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

const hasAdminConfig = privateKey && clientEmail && projectId;

// Inicializa o app do Firebase Admin somente se não tiver sido inicializado antes
if (!admin.apps.length && hasAdminConfig) {
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
} else if (!hasAdminConfig) {
    console.warn('As credenciais do Firebase Admin não estão completas. Funcionalidades do lado do servidor podem não funcionar.');
}

const auth = admin.auth();
const db = admin.firestore();

export { auth, db };

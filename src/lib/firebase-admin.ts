
import * as admin from 'firebase-admin';

const serviceAccountString = process.env.FIREBASE_ADMIN_SDK_CONFIG;

// Garante que a inicialização não ocorra múltiplas vezes
if (!admin.apps.length) {
  // Verifica se a variável de ambiente existe
  if (serviceAccountString) {
    try {
      const serviceAccount = JSON.parse(serviceAccountString);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
      });
    } catch (e) {
      console.error('Falha ao parsear ou inicializar o Firebase Admin SDK:', e);
    }
  } else {
    console.error('A variável de ambiente FIREBASE_ADMIN_SDK_CONFIG não está definida.');
  }
}

// Exporta as instâncias de auth e db
// Se a inicialização falhar, estas chamadas vão gerar um erro, o que é esperado.
const auth = admin.auth();
const db = admin.firestore();

export { auth, db };

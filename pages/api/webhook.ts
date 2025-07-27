import type { NextApiRequest, NextApiResponse } from 'next';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import admin from 'firebase-admin';

// ===================================================================
// INICIALIZAÇÃO DO FIREBASE ADMIN
// ===================================================================

// Verifica se a chave do SDK de Admin do Firebase está no ambiente
if (!process.env.FIREBASE_ADMIN_SDK_CONFIG) {
  throw new Error('A variável de ambiente FIREBASE_ADMIN_SDK_CONFIG não está definida.');
}

// Parse da chave de configuração do Firebase
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_CONFIG);

// Inicializa o app do Firebase Admin se ainda não foi inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const auth = admin.auth();
const db = admin.firestore();

// ===================================================================
// MANIPULADOR DO WEBHOOK
// ===================================================================

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { body } = req;
    const topic = body.topic || body.type;
    const paymentId = body.data?.id;

    if (topic === 'payment' && paymentId) {
      console.log(`Recebida notificação de pagamento: ${paymentId}`);
      
      const payment = new Payment(client);
      const paymentDetails = await payment.get({ id: paymentId });
      
      console.log('Detalhes do pagamento:', paymentDetails);

      // 1. VERIFICA SE O PAGAMENTO FOI APROVADO
      if (paymentDetails.status === 'approved') {
        console.log(`Pagamento ${paymentId} foi aprovado.`);
        
        const payerEmail = paymentDetails.payer?.email;
        const payerName = paymentDetails.payer?.first_name || 'Novo Usuário';

        if (!payerEmail) {
          console.error("Não foi possível obter o email do pagador.");
          return res.status(400).json({ error: 'Email do pagador não encontrado.' });
        }
        
        console.log(`Email do pagador: ${payerEmail}. Iniciando processo de criação de usuário.`);

        // 2. CRIA O USUÁRIO NO FIREBASE
        try {
          // Verifica se o usuário já existe
          let userRecord;
          try {
            userRecord = await auth.getUserByEmail(payerEmail);
            console.log('Usuário já existe no Firebase Auth:', userRecord.uid);
          } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
              // Cria o usuário se ele não existir
              userRecord = await auth.createUser({
                email: payerEmail,
                emailVerified: true, // O pagamento confirma o email
                displayName: payerName,
                disabled: false,
              });
              console.log('Novo usuário criado no Firebase Auth:', userRecord.uid);
            } else {
              // Propaga outros erros do Firebase Auth
              throw error;
            }
          }

          // 3. SALVA OS DADOS NO FIRESTORE
          const userDocRef = db.collection('users').doc(userRecord.uid);
          await userDocRef.set({
            name: payerName,
            email: payerEmail,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            lastPaymentId: paymentId,
            hasAccess: true // Concede acesso ao conteúdo
          }, { merge: true }); // 'merge: true' atualiza o documento sem sobrescrever campos existentes
          
          console.log(`Informações do usuário salvas no Firestore: ${userRecord.uid}`);

          // 4. ENVIA E-MAIL PARA DEFINIR A SENHA
          const passwordResetLink = await auth.generatePasswordResetLink(payerEmail);
          
          // ===================================================================
          // AQUI VOCÊ DEVE INTEGRAR UM SERVIÇO DE E-MAIL (ex: SendGrid, Nodemailer)
          // PARA ENVIAR O LINK DE BOAS-VINDAS E DEFINIÇÃO DE SENHA.
          // Por simplicidade, estamos apenas logando o link no console.
          // ===================================================================
          console.log(`
            ******************************************************************
            E-MAIL DE BOAS-VINDAS (SIMULADO)
            ******************************************************************
            Para: ${payerEmail}
            Assunto: Bem-vindo! Acesse seu conteúdo.

            Olá ${payerName},

            Seu pagamento foi confirmado!

            Para acessar sua área de membros, por favor, defina sua senha clicando no link abaixo:
            ${passwordResetLink}

            Obrigado!
            ******************************************************************
          `);

        } catch (firebaseError) {
          console.error("Erro ao processar usuário no Firebase:", firebaseError);
          // Mesmo com erro no Firebase, retornamos 200 para o Mercado Pago
          // para evitar que ele reenvie a notificação. O erro já foi logado.
        }
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error("Erro no webhook do Mercado Pago:", error);
    res.status(500).json({ error: 'Falha ao processar notificação.' });
  }
}

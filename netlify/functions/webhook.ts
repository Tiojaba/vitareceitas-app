import type { Handler } from "@netlify/functions";
import { auth } from "../../src/lib/firebase-admin";

// Função para gerar uma senha aleatória forte
const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-12);
};

export const handler: Handler = async (event) => {
  // 1. Validação Básica do Webhook
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if (!event.body) {
    return { statusCode: 400, body: 'Bad Request: No body found.' };
  }

  // 2. Processamento do Payload
  try {
    const payload = JSON.parse(event.body);
    console.log('[Webhook] Kirvano notification received:', JSON.stringify(payload, null, 2));

    const customerEmail = payload.customer?.email;
    const customerName = payload.customer?.name;
    const purchaseStatus = payload.status;

    // 3. Lógica de Criação do Usuário
    // Verificamos o status (ignorando maiúsculas/minúsculas) e se o email existe.
    if (purchaseStatus && purchaseStatus.toLowerCase() === 'approved' && customerEmail) {
      console.log(`[Webhook] Processing approved sale for email: ${customerEmail}`);
      
      try {
        // Verifica se o usuário já existe
        let userRecord = await auth.getUserByEmail(customerEmail).catch(() => null);

        if (userRecord) {
          console.log(`[Webhook] User ${customerEmail} already exists. No action taken.`);
        } else {
          // Se não existe, cria o novo usuário
          console.log(`[Webhook] User ${customerEmail} not found. Creating new user...`);
          const randomPassword = generateRandomPassword();
          
          userRecord = await auth.createUser({
            email: customerEmail,
            emailVerified: true,
            password: randomPassword,
            displayName: customerName || 'Novo Aluno',
            disabled: false,
          });
          
          console.log(`[Webhook] Successfully created new user: ${userRecord.uid} for email: ${customerEmail}`);
        }
        
        // Se tudo deu certo até aqui
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, message: `User processed successfully for ${customerEmail}` }),
        };

      } catch (error: any) {
        console.error('[Webhook] Firebase user creation failed:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ success: false, message: 'Internal Server Error: Could not create user.', error: error.message }),
        };
      }

    } else {
      console.log(`[Webhook] Payload ignored. Status: ${purchaseStatus}, Email: ${customerEmail}`);
      return {
        statusCode: 200, // Retorna 200 para a Kirvano não ficar reenviando
        body: JSON.stringify({ success: true, message: 'Webhook received but no action required.' }),
      };
    }

  } catch (error: any) {
    console.error('[Webhook] Error parsing request body:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'Bad Request: Invalid JSON.' }),
    };
  }
};

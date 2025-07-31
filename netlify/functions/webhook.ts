
import type { Handler } from "@netlify/functions";
import { auth } from "../../src/lib/firebase-admin";
import sgMail from "@sendgrid/mail";

// Função para gerar uma senha aleatória forte (usada na criação do usuário)
const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-12);
};

// Função para enviar o e-mail de boas-vindas
const sendWelcomeEmail = async (email: string, name: string, passwordResetLink: string) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('[SendGrid] A chave da API do SendGrid não está configurada.');
    throw new Error('SENDGRID_API_KEY not configured.');
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const appUrl = 'https://helpful-dusk-fee471.netlify.app/login';
  
  const msg = {
    to: email,
    from: {
      name: 'VitaReceitas',
      email: 'vitareceitasoficial@gmail.com' // IMPORTANTE: Use o mesmo e-mail que você verificou no SendGrid
    },
    subject: `Bem-vindo(a) ao VitaReceitas, ${name}!`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Olá, ${name}!</h2>
        <p>Sua compra foi aprovada e seu acesso à nossa área de membros foi liberado!</p>
        <p>Estamos muito felizes em ter você com a gente.</p>
        <p><strong>Seu email de acesso é:</strong> ${email}</p>
        <p>Para sua segurança, você precisa criar sua própria senha. Clique no botão abaixo para defini-la agora mesmo:</p>
        <p style="text-align: center;">
          <a href="${passwordResetLink}" style="background-color: #10B981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Criar Minha Senha</a>
        </p>
        <p>Após criar sua senha, você pode acessar a área de membros a qualquer momento pelo link:</p>
        <p><a href="${appUrl}">${appUrl}</a></p>
        <br>
        <p>Atenciosamente,</p>
        <p>Equipe VitaReceitas</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`[SendGrid] E-mail de boas-vindas enviado para ${email}.`);
  } catch (error: any) {
    console.error('[SendGrid] Falha ao enviar e-mail. Resposta da API:', JSON.stringify(error, null, 2));
    if (error.response) {
      console.error('[SendGrid] Detalhes do erro:', error.response.body);
    }
    // Re-lança o erro para ser pego pelo handler principal
    throw new Error(`SendGrid failed to send email: ${error.message}`);
  }
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
    const customerName = payload.customer?.name || 'Novo Aluno';
    const purchaseStatus = payload.status;

    // 3. Lógica de Criação do Usuário e Envio de Email
    if (purchaseStatus && purchaseStatus.toLowerCase() === 'approved' && customerEmail) {
      console.log(`[Webhook] Processing approved sale for email: ${customerEmail}`);
      
      try {
        let userRecord = await auth.getUserByEmail(customerEmail).catch(() => null);

        if (userRecord) {
          console.log(`[Webhook] User ${customerEmail} already exists. No action taken.`);
          // Opcional: Futuramente, podemos reenviar o email de boas-vindas se o usuário já existir.
        } else {
          // Se não existe, cria o novo usuário
          console.log(`[Webhook] User ${customerEmail} not found. Creating new user...`);
          const randomPassword = generateRandomPassword();
          
          userRecord = await auth.createUser({
            email: customerEmail,
            emailVerified: true, // Consideramos verificado, pois o email da compra é válido
            password: randomPassword,
            displayName: customerName,
            disabled: false,
          });
          
          console.log(`[Webhook] Successfully created new user: ${userRecord.uid} for email: ${customerEmail}`);

          // Gera o link de redefinição de senha
          const passwordResetLink = await auth.generatePasswordResetLink(customerEmail);
          
          // Envia o e-mail de boas-vindas
          await sendWelcomeEmail(customerEmail, customerName, passwordResetLink);
        }
        
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, message: `User processed successfully for ${customerEmail}` }),
        };

      } catch (error: any) {
        console.error('[Webhook] Firebase/SendGrid process failed:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ success: false, message: 'Internal Server Error.', error: error.message }),
        };
      }

    } else {
      console.log(`[Webhook] Payload ignored. Status: ${purchaseStatus}, Email: ${customerEmail}`);
      return {
        statusCode: 200, 
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

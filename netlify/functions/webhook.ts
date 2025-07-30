
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { auth } from '../../src/lib/firebase-admin';
import sgMail from '@sendgrid/mail';

// Configuração do SendGrid
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
    console.error("[SendGrid] CRITICAL ERROR: SENDGRID_API_KEY environment variable is not set.");
}

async function sendWelcomeEmail(email: string, name: string) {
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    if (!fromEmail) {
        console.error("[SendGrid] CRITICAL ERROR: SENDGRID_FROM_EMAIL environment variable is not set.");
        throw new Error("Sender email is not configured.");
    }

    try {
        console.log(`[SendGrid] Generating password reset link for ${email}...`);
        const actionLink = await auth.generatePasswordResetLink(email);
        const loginUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://helpful-dusk-fee471.netlify.app/login';
        console.log(`[SendGrid] Password reset link generated. Login URL is ${loginUrl}.`);

        const msg = {
            to: email,
            from: {
              name: 'VitaReceitas',
              email: fromEmail,
            },
            subject: `Seu acesso chegou! Bem-vindo(a) à VitaReceitas, ${name}!`,
            html: `
              <p>Olá, ${name}!</p>
              <p>Sua compra foi aprovada com sucesso e seu acesso à nossa área de membros foi criado!</p>
              <p><strong>Passo 1: Crie sua senha pessoal</strong><br>Clique no link abaixo para definir sua senha de acesso:</p>
              <p><a href='${actionLink}'>CRIAR MINHA SENHA AGORA</a></p>
              <p><strong>Passo 2: Acesse a Área de Membros</strong><br>Depois de criar sua senha, você pode acessar a área de membros a qualquer momento pelo link abaixo. Salve-o nos seus favoritos!</p>
              <p><a href='${loginUrl}'>${loginUrl}</a></p>
              <p>Lembre-se: seu login é o seu e-mail (${email}).</p>
              <p>Seja muito bem-vindo(a)!</p>
              <p>Atenciosamente,<br>Equipe VitaReceitas</p>
            `,
        };

        await sgMail.send(msg);
        console.log(`[SendGrid] Welcome email sent successfully to ${email}.`);
    } catch (error: any) {
        console.error(`[SendGrid] Failed to send welcome email to ${email}:`, error.response?.body || error.message);
        // O mais importante é que o usuário tenha acesso. Ele pode usar o "Esqueci a senha" se o email não chegar.
        // Não vamos lançar um erro aqui para não falhar o processo inteiro.
    }
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    console.log(`[Webhook] Method not allowed: ${event.httpMethod}`);
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  console.log('[Webhook] Kirvano notification received.');

  try {
    if (!event.body) {
      console.error('[Webhook] Error: Request body is empty.');
      return { statusCode: 400, body: 'Request body is empty.' };
    }
    
    const body = JSON.parse(event.body);
    console.log('[Webhook] Body received from Kirvano:', JSON.stringify(body, null, 2));

    const customerEmail = body.customer?.email;
    const customerName = body.customer?.name || 'Novo Membro';
    const purchaseStatus = body.status;

    if (!purchaseStatus || purchaseStatus.toLowerCase() !== 'approved' || !customerEmail) {
      console.log(`[Webhook] Payload ignored: status is not 'approved' or email is missing. Status: ${purchaseStatus}, Email: ${customerEmail}`);
      return { 
          statusCode: 200,
          body: JSON.stringify({ message: "Payload ignored, not an approved purchase." })
      };
    }
    
    console.log(`[Webhook] Processing approved purchase for: Email: ${customerEmail}, Name: ${customerName}`);
    
    // Verifica se o usuário já existe
    try {
        const existingUser = await auth.getUserByEmail(customerEmail);
        console.log(`[Firebase] User with email ${customerEmail} already exists. UID: ${existingUser.uid}. No action needed.`);
        return { statusCode: 200, body: 'User already exists.' };
    } catch (error: any) {
        if (error.code !== 'auth/user-not-found') {
            // Se o erro for qualquer coisa diferente de "usuário não encontrado", algo deu errado na consulta.
            console.error('[Firebase] Unexpected error while checking for user:', error);
            throw error; 
        }
        // Se o erro for 'auth/user-not-found', ótimo, podemos continuar para criar o usuário.
        console.log(`[Firebase] User with email ${customerEmail} not found. Proceeding to create user.`);
    }
      
    // Tenta criar o usuário e, se conseguir, envia o e-mail.
    try {
        console.log(`[Firebase] Creating new user for ${customerEmail}...`);
        const newUser = await auth.createUser({
          email: customerEmail,
          emailVerified: true,
          displayName: customerName,
          disabled: false,
        });
        console.log(`[Firebase] User created successfully! UID: ${newUser.uid}.`);

        console.log(`[Webhook] User created, now attempting to send welcome email to ${customerEmail}.`);
        await sendWelcomeEmail(customerEmail, customerName);
        
    } catch (creationError: any) {
        console.error(`[Webhook] CRITICAL: Failed to create user or send email for ${customerEmail}. Error:`, creationError);
        // Retorna um erro 500 para que a Kirvano talvez possa tentar novamente.
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to create user or send welcome email.', details: creationError.message })
        };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Webhook processed successfully, user created and email sent.' })
    };

  } catch (error: any) {
    console.error("[Webhook] CRITICAL HANDLER ERROR:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Critical failure while processing notification.', details: error.message })
    };
  }
};

export { handler };

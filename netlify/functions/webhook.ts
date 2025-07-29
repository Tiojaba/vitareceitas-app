
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { auth } from '../../src/lib/firebase-admin';
import sgMail from '@sendgrid/mail';

// Configure SendGrid API Key
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log("[SendGrid] API Key configured.");
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
        const actionLink = await auth.generatePasswordResetLink(email);
        const loginUrl = process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/login` : 'https://helpful-dusk-fee471.netlify.app/login';

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
        console.error(`[SendGrid] Failed to send email to ${email}:`, error.response?.body || error.message);
        throw new Error("Failed to send the welcome email.");
    }
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST' },
      body: 'Method Not Allowed',
    };
  }

  console.log('[Webhook] Kirvano notification received.');

  let body;
  try {
    if (!event.body) {
        console.error('[Webhook] Error: Request body is empty.');
        return { statusCode: 400, body: JSON.stringify({ error: 'Request body is empty.' }) };
    }
    body = JSON.parse(event.body);
    // Log para depuração
    console.log('[Webhook] Raw Body Received from Kirvano:', JSON.stringify(body, null, 2));
  } catch (e) {
    console.error('[Webhook] Error parsing JSON body:', e);
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON format.' }) };
  }

  try {
    // Acessando os dados diretamente do corpo, conforme o log da Kirvano
    const customerEmail = body.customer?.email;
    const customerName = body.customer?.name || 'Novo Membro';
    const purchaseStatus = body.status;

    if (purchaseStatus !== 'APPROVED' || !customerEmail) {
        const errorMsg = `Could not process notification: payment not approved or customer email not found. Status: ${purchaseStatus}, Email: ${customerEmail}`;
        console.error(`[Webhook] Error: ${errorMsg}`);
        return { 
            statusCode: 400,
            body: JSON.stringify({ error: errorMsg, receivedBody: body })
        };
    }
    
    console.log(`[Webhook] Processing for: Email: ${customerEmail}, Name: ${customerName}, Status: ${purchaseStatus}`);
    
    try {
      const existingUser = await auth.getUserByEmail(customerEmail).catch((error) => {
        if (error.code === 'auth/user-not-found') return null;
        throw error;
      });

      if (existingUser) {
        console.log(`[Webhook] User with email ${customerEmail} already exists. UID: ${existingUser.uid}. No action needed.`);
        return { statusCode: 200, body: JSON.stringify({ message: 'User already exists. No new action was taken.' }) };
      } 
        
      console.log(`[Webhook] User with email ${customerEmail} not found. Creating user in Firebase...`);
      
      const newUser = await auth.createUser({
        email: customerEmail,
        emailVerified: true,
        displayName: customerName,
        disabled: false,
      });

      console.log(`[Webhook] User created successfully in Firebase! UID: ${newUser.uid}. Now sending welcome email.`);
      
      await sendWelcomeEmail(customerEmail, customerName);

    } catch (userError: any) {
      console.error(`[Webhook] CRITICAL Firebase or SendGrid error for ${customerEmail}:`, userError);
      return { statusCode: 500, body: JSON.stringify({ error: 'Internal error while processing user or sending email.', details: userError.message }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Webhook processed successfully.' })
    };

  } catch (error: any)
{
    console.error("[Webhook] CRITICAL error in handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Critical failure to process notification.', details: error.message })
    };
  }
};

export { handler };

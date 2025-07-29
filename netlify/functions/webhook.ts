
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { auth } from '../../src/lib/firebase-admin';
import sgMail from '@sendgrid/mail';

// Helper function to find customer data from various potential fields in the request body
// Now more generic to help us find the data from Kirvano
const findCustomerInBody = (body: any): { email: string | null; name: string } => {
    if (!body || typeof body !== 'object') {
        return { email: null, name: 'Novo Membro' };
    }

    let email: string | null = null;
    let name: string = 'Novo Membro';

    // Generic search for email and name keys, common in many webhooks.
    // We are looking for the exact structure Kirvano sends.
    const possibleEmailKeys = ['email', 'customer_email', 'payer_email', 'buyer_email', 'client_email', 'customer.email'];
    const possibleNameKeys = ['name', 'customer_name', 'buyer_name', 'client_name', 'customer.name'];

    for (const key of possibleEmailKeys) {
        if (body[key] && typeof body[key] === 'string') {
            email = body[key];
            break;
        }
    }
    // Specific check for nested customer object
    if (!email && body.customer && typeof body.customer.email === 'string') {
        email = body.customer.email;
    }


    for (const key of possibleNameKeys) {
        if (body[key] && typeof body[key] === 'string') {
            name = body[key];
            break;
        }
    }
    if (name === 'Novo Membro' && body.customer && typeof body.customer.name === 'string') {
        name = body.customer.name;
    }
    
    return { email, name: name.trim() };
}

// Configure SendGrid API Key
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
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Request body is empty.' })
        };
    }
    // !! IMPORTANTE: Logando o corpo bruto da requisição para diagnóstico !!
    console.log('[Webhook] Raw Body Received from Kirvano:', event.body);
    body = JSON.parse(event.body);
    console.log('[Webhook] Parsed Body:', JSON.stringify(body, null, 2));
  } catch (e) {
    console.error('[Webhook] Error parsing JSON body:', e);
    return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON format.' })
    };
  }

  try {
    let customerEmail: string | null = null;
    let customerName: string = 'Novo Membro';
    let purchaseStatus: string = 'unknown';

    // Logic to find customer data from Kirvano payload
    const { email, name } = findCustomerInBody(body);
    customerEmail = email;
    customerName = name;
    
    // Status check for Kirvano (this is a guess, we need logs to confirm)
    // Common status values are 'paid', 'approved', 'completed', 'billet_paid', 'refunded', 'chargeback'
    const status = body.status || body.sale_status || body.event;
    console.log(`[Webhook] Detected status field: ${status}`);

    const approvedStatus = ['paid', 'approved', 'completed', 'billet_paid', 'aprovada'];
    
    purchaseStatus = approvedStatus.includes(String(status).toLowerCase()) ? 'approved' : 'not_approved';


    if (purchaseStatus !== 'approved' || !customerEmail) {
        const errorMsg = 'Could not process notification: payment not approved or customer email not found in Kirvano payload.';
        console.error(`[Webhook] Error: ${errorMsg}. Email found: ${customerEmail}, Status found: ${status}`);
        return { 
            statusCode: 400,
            body: JSON.stringify({ 
                error: errorMsg,
                receivedBody: body 
            })
        };
    }
    
    console.log(`[Webhook] Processing for: Email: ${customerEmail}, Name: ${customerName}`);
    
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
        emailVerified: true, // User is considered verified because they paid
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

  } catch (error: any) {
    console.error("[Webhook] CRITICAL error in handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Critical failure to process notification.', details: error.message })
    };
  }
};

export { handler };

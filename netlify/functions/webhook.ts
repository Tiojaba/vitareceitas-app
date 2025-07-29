import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { auth } from '../../src/lib/firebase-admin';
import sgMail from '@sendgrid/mail';
import { MercadoPagoConfig, Payment } from 'mercadopago';

// Helper function to find customer data from various potential fields in the request body
const findCustomerInBody = (body: any): { email: string | null; name: string } => {
    if (!body || typeof body !== 'object') {
        return { email: null, name: 'Novo Membro' };
    }

    let email: string | null = null;
    let name: string = 'Novo Membro';

    // Structure for Kiwify, Hotmart etc.
    if (body.customer && typeof body.customer === 'object') {
        email = body.customer.email || null;
        name = body.customer.name || name;
    }

    // Mercado Pago structure (if not handled by payment details fetch)
    if (!email && body.payer) {
        email = body.payer.email || null;
        const firstName = body.payer.first_name || '';
        const lastName = body.payer.last_name || '';
        name = `${firstName} ${lastName}`.trim() || name;
    }

    // Fallback for other common keys
    if (!email) {
      const possibleEmailKeys = ['email', 'customer_email', 'payer_email', 'buyer_email'];
      for (const key of possibleEmailKeys) {
          if (typeof body[key] === 'string') {
              email = body[key];
              break;
          }
      }
    }
    
    if (name === 'Novo Membro') {
        const possibleNameKeys = ['customer_name', 'name', 'buyer_name'];
         for (const key of possibleNameKeys) {
            if (typeof body[key] === 'string') {
                name = body[key];
                break;
            }
        }
    }
    
    return { email, name: name.trim() };
}

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
        console.log(`[SendGrid] Generating password creation link for ${email}...`);
        const actionLink = await auth.generatePasswordResetLink(email);
        const loginUrl = process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/login` : 'https://helpful-dusk-fee471.netlify.app/login';

        console.log(`[SendGrid] Assembling email for ${email}...`);
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

async function getPaymentDetails(paymentId: string) {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
        console.error('[MercadoPago] Access token not found.');
        throw new Error("Mercado Pago credentials are not configured.");
    }
    const client = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(client);
    
    console.log(`[MercadoPago] Fetching details for payment ID: ${paymentId}`);
    try {
        const paymentInfo = await payment.get({ id: paymentId });
        console.log(`[MercadoPago] Details received for payment ${paymentId}.`);
        return paymentInfo;
    } catch (error) {
        console.error(`[MercadoPago] Error fetching payment details for ID ${paymentId}:`, error);
        throw new Error("Could not fetch payment details from Mercado Pago.");
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

  console.log('[Webhook] Notification received.');

  let body;
  try {
    if (!event.body) {
        console.error('[Webhook] Error: Request body is empty.');
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Request body is empty.' })
        };
    }
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

    // Specific logic for Mercado Pago notifications
    if (body.action === 'payment.updated' || body.type === 'payment') {
        const paymentId = body.data?.id;
        if (paymentId) {
            console.log(`[Webhook] Mercado Pago notification detected for payment ${paymentId}.`);
            const paymentDetails = await getPaymentDetails(paymentId);
            purchaseStatus = paymentDetails.status || 'unknown';
            if (purchaseStatus === 'approved') {
                 customerEmail = paymentDetails.payer?.email || null;
                 const firstName = paymentDetails.payer?.first_name || '';
                 const lastName = paymentDetails.payer?.last_name || '';
                 customerName = `${firstName} ${lastName}`.trim() || 'Novo Membro';
                 console.log(`[Webhook] Payment ${paymentId} APPROVED. Customer: ${customerName} <${customerEmail}>`);
            } else {
                 console.log(`[Webhook] Payment ${paymentId} has status: ${purchaseStatus}. Ignoring.`);
                 return { statusCode: 200, body: JSON.stringify({ message: 'Notification received but not processed (status not approved).' }) };
            }
        } else {
             console.log('[Webhook] Mercado Pago notification without data ID. Ignoring.');
             return { statusCode: 200, body: JSON.stringify({ message: 'MP notification ignored (no data ID).' }) };
        }
    } else {
        // General logic for other providers (Kiwify, Hotmart, etc.)
        console.log('[Webhook] Notification is not from Mercado Pago, using general logic.');
        const { email, name } = findCustomerInBody(body);
        customerEmail = email;
        customerName = name;
        // Simple status check, adjust if your platform uses different values
        const status = body.status || body.event;
        purchaseStatus = (status === 'paid' || status === 'approved' || status === 'purchase_approved') ? 'approved' : 'not_approved';
    }

    if (purchaseStatus !== 'approved' || !customerEmail) {
        const errorMsg = 'Could not process notification: payment not approved or customer email not found.';
        console.error(`[Webhook] Error: ${errorMsg}. Email: ${customerEmail}, Status: ${purchaseStatus}`);
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

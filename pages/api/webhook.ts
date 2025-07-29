
import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/firebase-admin';
import sgMail from '@sendgrid/mail';
import { MercadoPagoConfig, Payment } from 'mercadopago';

// Função para extrair dados do cliente de diferentes possíveis campos no corpo da requisição
const findCustomerInBody = (body: any): { email: string | null; name: string } => {
    if (!body || typeof body !== 'object') {
        return { email: null, name: 'Novo Membro' };
    }

    let email: string | null = null;
    let name: string = 'Novo Membro';

    // Estrutura para Kiwify, Hotmart etc.
    if (body.customer && typeof body.customer === 'object') {
        email = body.customer.email || null;
        name = body.customer.name || name;
    }

    if (!email && body.data && typeof body.data === 'object' && body.data.payer) {
        email = body.data.payer.email || null;
        name = `${body.data.payer.first_name || ''} ${body.data.payer.last_name || ''}`.trim() || name;
    } else if (!email && body.payer) {
        email = body.payer.email || null;
        name = `${body.payer.first_name || ''} ${body.payer.last_name || ''}`.trim() || name;
    }

    // Estruturas legadas
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
        const possibleNameKeys = ['customer_name', 'name'];
         for (const key of possibleNameKeys) {
            if (typeof body[key] === 'string') {
                name = body[key];
                break;
            }
        }
    }
    
    return { email, name: name.trim() };
}

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log("[SendGrid] Chave da API configurada.");
} else {
    console.error("[SendGrid] ERRO: Variável de ambiente SENDGRID_API_KEY não está definida.");
}

async function sendWelcomeEmail(email: string, name: string) {
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    if (!fromEmail) {
        console.error("[SendGrid] ERRO: Variável de ambiente SENDGRID_FROM_EMAIL não está definida.");
        throw new Error("O e-mail do remetente não está configurado.");
    }

    try {
        console.log(`[SendGrid] Gerando link de criação de senha para ${email}...`);
        const actionLink = await auth.generatePasswordResetLink(email);
        const loginUrl = process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/login` : 'https://helpful-dusk-fee471.netlify.app/login';

        console.log(`[SendGrid] Montando e-mail para ${email}...`);
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
        console.log(`[SendGrid] E-mail de boas-vindas enviado com sucesso para ${email}.`);
    } catch (error: any) {
        console.error(`[SendGrid] Falha ao enviar e-mail para ${email}:`, error.response?.body || error.message);
        throw new Error("Falha ao enviar o e-mail de boas-vindas.");
    }
}

async function getPaymentDetails(paymentId: string) {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
        console.error('[MercadoPago] Access token não encontrado.');
        throw new Error("Credenciais do Mercado Pago não configuradas.");
    }
    const client = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(client);
    
    console.log(`[MercadoPago] Buscando detalhes do pagamento ID: ${paymentId}`);
    const paymentInfo = await payment.get({ id: paymentId });
    console.log(`[MercadoPago] Detalhes recebidos.`);
    return paymentInfo;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  console.log('[Webhook] Notificação recebida. Corpo:', JSON.stringify(req.body, null, 2));

  try {
    let customerEmail: string | null = null;
    let customerName: string = 'Novo Membro';
    
    // Verifica se é notificação do Mercado Pago
    if (req.body.action === 'payment.updated' || req.body.type === 'payment') {
        const paymentId = req.body.data?.id;
        if (paymentId) {
            console.log(`[Webhook] Notificação do Mercado Pago detectada para o pagamento ${paymentId}.`);
            const paymentDetails = await getPaymentDetails(paymentId);
            if (paymentDetails.status === 'approved') {
                 customerEmail = paymentDetails.payer?.email || null;
                 customerName = `${paymentDetails.payer?.first_name || ''} ${paymentDetails.payer?.last_name || ''}`.trim() || 'Novo Membro';
                 console.log(`[Webhook] Pagamento ${paymentId} APROVADO. Cliente: ${customerName} &lt;${customerEmail}&gt;`);
            } else {
                 console.log(`[Webhook] Pagamento ${paymentId} com status: ${paymentDetails.status}. Ignorando.`);
                 return res.status(200).json({ message: 'Notificação recebida mas não processada (status não aprovado).' });
            }
        } else {
             console.log('[Webhook] Notificação do Mercado Pago sem ID de dados. Ignorando.');
             return res.status(200).json({ message: 'Notificação do MP sem ID. Ignorada.' });
        }
    } else {
        // Lógica antiga para outros provedores
        console.log('[Webhook] Notificação não parece ser do Mercado Pago, usando lógica antiga.');
        const { email, name } = findCustomerInBody(req.body);
        customerEmail = email;
        customerName = name;
    }


    if (!customerEmail) {
        const errorMsg = 'E-mail do comprador não foi encontrado no corpo da requisição. Verifique os logs para ver a estrutura recebida.';
        console.error(`[Webhook] Erro: ${errorMsg}`);
        return res.status(400).json({ 
            error: errorMsg, 
            message: "O formato dos dados recebidos não continha um campo de e-mail reconhecível.",
            receivedBody: req.body 
        });
    }
    
    console.log(`[Webhook] Processando para: E-mail: ${customerEmail}, Nome: ${customerName}`);
    
    try {
      const existingUser = await auth.getUserByEmail(customerEmail).catch((error) => {
        if (error.code === 'auth/user-not-found') return null;
        throw error;
      });

      if (existingUser) {
        console.log(`[Webhook] Usuário com e-mail ${customerEmail} já existe. UID: ${existingUser.uid}. Nenhuma ação necessária.`);
        return res.status(200).json({ message: 'Usuário já existente. Nenhuma nova ação foi necessária.' });
      } 
        
      console.log(`[Webhook] Usuário com e-mail ${customerEmail} não encontrado. Criando...`);
      
      const newUser = await auth.createUser({
        email: customerEmail,
        emailVerified: true,
        displayName: customerName,
        disabled: false,
      });

      console.log(`[Webhook] Usuário criado com sucesso no Firebase! UID: ${newUser.uid}`);
      
      await sendWelcomeEmail(customerEmail, customerName);

    } catch (userError: any) {
      console.error(`[Webhook] Erro CRÍTICO no Firebase ou SendGrid para ${customerEmail}:`, userError);
      return res.status(500).json({ error: 'Erro interno ao processar o usuário ou enviar o e-mail.', details: userError.message });
    }

    res.status(200).json({ message: 'Webhook processado com sucesso.' });

  } catch (error: any) {
    console.error("[Webhook] Erro CRÍTICO no handler:", error);
    res.status(500).json({ error: 'Falha crítica ao processar notificação.', details: error.message });
  }
}

    
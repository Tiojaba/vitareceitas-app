
import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/firebase-admin';
import sgMail from '@sendgrid/mail';

// Função para extrair o e-mail de diferentes possíveis campos no corpo da requisição
const findEmailInBody = (body: any): string | null => {
    if (!body || typeof body !== 'object') {
        return null;
    }

    // Estrutura nova (Kiwify, etc.)
    if (body.customer && typeof body.customer.email === 'string') {
        return body.customer.email;
    }

    // Estruturas legadas (Hotmart, etc.)
    const possibleKeys = [
        'email', 
        'customer_email', 
        'payer_email', 
        'buyer_email'
    ];

    for (const key of possibleKeys) {
        if (typeof body[key] === 'string') {
            return body[key];
        }
    }

    // Lógica para objetos aninhados (comuns em outras plataformas)
    if (body.data && typeof body.data === 'object') {
        if (body.data.customer && typeof body.data.customer.email === 'string') {
            return body.data.customer.email;
        }
        if (body.data.buyer && typeof body.data.buyer.email === 'string') {
            return body.data.buyer.email;
        }
    }
    
    if (body.buyer && typeof body.buyer.email === 'string') {
        return body.buyer.email;
    }

    return null;
}

// Configura a chave da API do SendGrid
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
        // Gera o link de criação de senha
        const actionLink = await auth.generatePasswordResetLink(email);

        const loginUrl = 'https://helpful-dusk-fee471.netlify.app/login';

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


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  console.log('[Webhook] Notificação recebida. Corpo completo:', JSON.stringify(req.body, null, 2));

  try {
    const userEmail = findEmailInBody(req.body);

    if (!userEmail) {
        const errorMsg = 'E-mail do comprador não foi encontrado no corpo da requisição. Verifique os logs para ver a estrutura recebida.';
        console.error(`[Webhook] Erro: ${errorMsg}`);
        return res.status(400).json({ 
            error: errorMsg, 
            message: "O formato dos dados recebidos não continha um campo de e-mail reconhecível.",
            receivedBody: req.body 
        });
    }
    
    console.log(`[Webhook] E-mail extraído com sucesso: ${userEmail}`);
    
    try {
      const existingUser = await auth.getUserByEmail(userEmail).catch((error) => {
        if (error.code === 'auth/user-not-found') {
          return null; // Usuário não existe, o que é o cenário esperado para uma nova compra.
        }
        throw error;
      });

      if (existingUser) {
        console.log(`[Webhook] Usuário com e-mail ${userEmail} já existe. UID: ${existingUser.uid}. Nenhuma ação necessária.`);
        return res.status(200).json({ message: 'Usuário já existente. Nenhuma nova ação foi necessária.' });
      } 
        
      console.log(`[Webhook] Usuário com e-mail ${userEmail} não encontrado. Prosseguindo para criação...`);

      const customerName = req.body?.customer?.name || req.body?.customer_name || req.body?.buyer?.name || 'Novo Membro';
      
      const newUser = await auth.createUser({
        email: userEmail,
        emailVerified: true,
        displayName: customerName,
        disabled: false,
      });

      console.log(`[Webhook] Usuário criado com sucesso no Firebase! UID: ${newUser.uid}`);
      
      // Envia o e-mail de boas-vindas usando o SendGrid
      await sendWelcomeEmail(userEmail, customerName);
      

    } catch (userError: any) {
      console.error(`[Webhook] Erro CRÍTICO no Firebase ou SendGrid ao processar para ${userEmail}:`, userError);
      return res.status(500).json({ error: 'Erro interno ao processar o usuário ou enviar o e-mail.', details: userError.message });
    }

    res.status(200).json({ message: 'Webhook processado com sucesso.' });

  } catch (error: any) {
    console.error("[Webhook] Erro CRÍTICO e inesperado no handler:", error);
    res.status(500).json({ error: 'Falha crítica ao processar notificação.', details: error.message });
  }
}

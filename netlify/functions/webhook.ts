
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { auth } from '../../src/lib/firebase-admin';
import sgMail from '@sendgrid/mail';

// Configuração do SendGrid
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log("[SendGrid] API Key configurada com sucesso.");
} else {
    console.error("[SendGrid] ERRO CRÍTICO: A variável de ambiente SENDGRID_API_KEY não está definida.");
}

async function sendWelcomeEmail(email: string, name: string) {
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    if (!fromEmail) {
        console.error("[SendGrid] ERRO CRÍTICO: A variável de ambiente SENDGRID_FROM_EMAIL não está definida.");
        throw new Error("E-mail do remetente não configurado.");
    }

    try {
        // Gera um link para o usuário criar sua senha
        const actionLink = await auth.generatePasswordResetLink(email);
        const loginUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://helpful-dusk-fee471.netlify.app/login';

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

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método não permitido' };
  }

  console.log('[Webhook] Notificação da Kirvano recebida.');

  try {
    if (!event.body) {
      console.error('[Webhook] Erro: Corpo da requisição está vazio.');
      return { statusCode: 400, body: 'Corpo da requisição está vazio.' };
    }
    
    const body = JSON.parse(event.body);
    console.log('[Webhook] Corpo recebido da Kirvano:', JSON.stringify(body, null, 2));

    const customerEmail = body.customer?.email;
    const customerName = body.customer?.name || 'Novo Membro';
    const purchaseStatus = body.status;

    // A notificação de "approved" é o gatilho para criar o usuário.
    if (purchaseStatus !== 'approved' || !customerEmail) {
      console.log(`[Webhook] Payload ignorado: status não é 'approved' ou e-mail está ausente. Status: ${purchaseStatus}, Email: ${customerEmail}`);
      return { 
          statusCode: 200, // Retorna 200 para a Kirvano não reenviar a notificação
          body: JSON.stringify({ message: "Payload ignorado, não é uma compra aprovada." })
      };
    }
    
    console.log(`[Webhook] Processando compra aprovada para: Email: ${customerEmail}, Nome: ${customerName}`);
    
    // Verifica se o usuário já existe no Firebase
    try {
        const existingUser = await auth.getUserByEmail(customerEmail);
        console.log(`[Webhook] Usuário com e-mail ${customerEmail} já existe. UID: ${existingUser.uid}. Nenhuma ação necessária.`);
        return { statusCode: 200, body: 'Usuário já existe.' };
    } catch (error: any) {
        // Se o erro for 'auth/user-not-found', significa que o usuário não existe e podemos criá-lo.
        if (error.code !== 'auth/user-not-found') {
            console.error('[Firebase] Erro inesperado ao verificar usuário:', error);
            throw error; // Lança o erro para ser capturado pelo catch principal
        }
        // Se o erro for 'auth/user-not-found', o código continua para criar o usuário.
        console.log(`[Webhook] Usuário com e-mail ${customerEmail} não encontrado. Prosseguindo para criação.`);
    }
      
    // Se o usuário não existe, cria um novo
    console.log(`[Webhook] Criando novo usuário no Firebase para ${customerEmail}...`);
    
    const newUser = await auth.createUser({
      email: customerEmail,
      emailVerified: true, // O e-mail da Kirvano é verificado
      displayName: customerName,
      disabled: false,
    });

    console.log(`[Webhook] Usuário criado com sucesso! UID: ${newUser.uid}. Enviando e-mail de boas-vindas...`);
    
    // Envia o e-mail de boas-vindas com o link para definir a senha
    await sendWelcomeEmail(customerEmail, customerName);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Webhook processado com sucesso.' })
    };

  } catch (error: any) {
    console.error("[Webhook] ERRO CRÍTICO no handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Falha crítica ao processar a notificação.', details: error.message })
    };
  }
};

export { handler };

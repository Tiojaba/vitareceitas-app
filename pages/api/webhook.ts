
import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const userEmail = req.body?.email;

    if (!userEmail || typeof userEmail !== 'string') {
        const errorMsg = 'Email do comprador não encontrado ou inválido no corpo da requisição.';
        console.error(`[Webhook] Erro: ${errorMsg}`, { body: req.body });
        return res.status(400).json({ error: errorMsg, receivedBody: req.body });
    }
    
    console.log(`[Webhook] Notificação recebida para o email: ${userEmail}`);
    
    try {
      const existingUser = await auth.getUserByEmail(userEmail).catch((error) => {
        if (error.code === 'auth/user-not-found') {
          return null;
        }
        throw error;
      });

      if (existingUser) {
        console.log(`[Webhook] Usuário com email ${userEmail} já existe. UID: ${existingUser.uid}. Enviando link de login.`);
        // Opcional: Se o usuário já existe, você pode enviar um e-mail de "acesse sua conta" aqui se desejar.
        return res.status(200).json({ message: 'Usuário já existe.' });
      } 
        
      console.log(`[Webhook] Usuário com email ${userEmail} não encontrado. Prosseguindo para criação.`);
      const newUser = await auth.createUser({
        email: userEmail,
        emailVerified: true, // Opcional: Marcar e-mail como verificado
        displayName: req.body?.customer_name || 'Novo Membro',
        disabled: false,
      });

      console.log(`[Webhook] Usuário criado com sucesso no Firebase! UID: ${newUser.uid}`);

      // Passo 2: Gerar o link de redefinição de senha (que servirá como "crie sua senha")
      const link = await auth.generatePasswordResetLink(userEmail);
      
      // A partir daqui, você usaria um serviço de e-mail (SendGrid, Nodemailer, etc.)
      // para enviar o 'link' para o 'userEmail'.
      // Como não temos um serviço de e-mail configurado, vamos apenas logar o link
      // para confirmar que ele foi gerado. Em um projeto real, a linha abaixo seria
      // substituída pela lógica de envio de e-mail.
      
      console.log(`[Webhook] E-mail de configuração de senha para ${userEmail} pronto para ser enviado. Link (para fins de teste): ${link}`);
      console.log(`[Webhook] IMPORTANTE: Para o envio de e-mail funcionar, você deve configurar o template de 'Redefinição de Senha' no Console do Firebase > Autenticação > Templates de Email.`);

    } catch (userError: any) {
      console.error(`[Webhook] Erro CRÍTICO no Firebase ao processar para ${userEmail}:`, userError);
      console.error(`[Webhook] Detalhes do erro: Code: ${userError.code}, Message: ${userError.message}`);
      return res.status(500).json({ error: 'Erro interno ao processar o usuário no Firebase.', details: userError.message });
    }

    res.status(200).json({ message: 'Webhook processado com sucesso. Link de configuração de senha gerado.' });

  } catch (error: any)
  {
    console.error("[Webhook] Erro CRÍTICO e inesperado no handler:", error);
    res.status(500).json({ error: 'Falha crítica ao processar notificação.', details: error.message });
  }
}

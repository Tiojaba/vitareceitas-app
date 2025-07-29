
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
        // Se o erro for outro, relance para ser pego pelo catch externo
        throw error;
      });

      if (existingUser) {
        console.log(`[Webhook] Usuário com email ${userEmail} já existe. UID: ${existingUser.uid}. Nenhuma ação necessária.`);
        return res.status(200).json({ message: 'Usuário já existe.' });
      } 
        
      console.log(`[Webhook] Usuário com email ${userEmail} não encontrado. Prosseguindo para criação.`);
      const newUser = await auth.createUser({
        email: userEmail,
        emailVerified: true,
        password: `senha-provisoria-${Math.random().toString(36).slice(-8)}`,
        displayName: req.body?.customer_name || 'Novo Membro',
        disabled: false,
      });

      console.log(`[Webhook] Usuário criado com sucesso no Firebase! UID: ${newUser.uid}`);
      

    } catch (userError: any) {
      console.error(`[Webhook] Erro CRÍTICO no Firebase ao processar para ${userEmail}:`, userError);
      console.error(`[Webhook] Detalhes do erro: Code: ${userError.code}, Message: ${userError.message}`);
      return res.status(500).json({ error: 'Erro interno ao processar o usuário no Firebase.', details: userError.message });
    }

    res.status(200).json({ message: 'Webhook processado com sucesso.' });

  } catch (error: any) {
    console.error("[Webhook] Erro CRÍTICO e inesperado no handler:", error);
    res.status(500).json({ error: 'Falha crítica ao processar notificação.', details: error.message });
  }
}

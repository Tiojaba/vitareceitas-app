
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
        return res.status(400).json({ error: errorMsg });
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
        console.log(`[Webhook] Usuário com email ${userEmail} já existe. Nenhuma ação necessária.`);
      } else {
        const newUser = await auth.createUser({
          email: userEmail,
          emailVerified: true,
          password: `senha-provisoria-${Math.random().toString(36).slice(-8)}`,
          displayName: req.body?.customer_name || 'Novo Membro',
          disabled: false,
        });

        console.log(`[Webhook] Usuário criado com sucesso no Firebase! UID: ${newUser.uid}`);
      }

    } catch (userError: any) {
      console.error(`[Webhook] Erro CRÍTICO no Firebase ao processar para ${userEmail}:`, userError.message, userError.stack);
      // Retornamos 500 aqui porque é um erro inesperado no nosso lado.
      return res.status(500).json({ error: 'Erro interno ao processar o usuário no Firebase.', details: userError.message });
    }

    // Responda 200 OK para a plataforma de pagamento.
    res.status(200).json({ message: 'Webhook processado com sucesso.' });

  } catch (error: any) {
    console.error("[Webhook] Erro CRÍTICO e inesperado no handler:", error.message, error.stack);
    res.status(500).json({ error: 'Falha crítica ao processar notificação.' });
  }
}

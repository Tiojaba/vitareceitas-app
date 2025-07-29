
import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/firebase-admin';

// ===================================================================
// MANIPULADOR DE WEBHOOK PARA CRIAÇÃO DE USUÁRIO (VERSÃO GENÉRICA)
// ===================================================================

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  console.log('[Webhook] Notificação recebida:', req.body);

  try {
    // Tenta extrair o email do corpo da requisição.
    // Plataformas diferentes enviam dados com nomes diferentes.
    // Ex: 'email', 'customer_email', 'payer.email', 'data.buyer.email', etc.
    // Adicione ou modifique estes caminhos conforme a documentação da sua plataforma (Cakto).
    const userEmail = req.body?.email || req.body?.customer_email || req.body?.payer?.email || req.body?.data?.buyer?.email;

    if (!userEmail || typeof userEmail !== 'string') {
        console.error('[Webhook] Email não encontrado no corpo da requisição:', req.body);
        // Responde 400 (Bad Request) porque o dado esperado não veio.
        return res.status(400).json({ error: 'Email do comprador não encontrado na notificação.' });
    }
    
    // Supondo que o webhook só é chamado em caso de compra aprovada,
    // conforme configurado na plataforma de pagamento.
    console.log(`[Webhook] Processando criação de usuário para o email: ${userEmail}`);
    
    try {
      // 1. Verifica se o usuário já existe
      const existingUser = await auth.getUserByEmail(userEmail).catch(() => null);

      if (existingUser) {
        console.log(`[Webhook] Usuário com email ${userEmail} já existe. Nenhuma ação necessária.`);
      } else {
        // 2. Cria o novo usuário no Firebase Auth
        const newUser = await auth.createUser({
          email: userEmail,
          emailVerified: true, // Considera o email como verificado, pois a compra foi feita
          password: `senha-provisoria-${Math.random().toString(36).slice(-8)}`, // Gera uma senha aleatória
          displayName: req.body?.customer_name || 'Novo Membro', // Tenta pegar o nome, se não houver usa um genérico
          disabled: false,
        });

        console.log(`[Webhook] Usuário criado com sucesso no Firebase! UID: ${newUser.uid}`);
        
        // Opcional: Futuramente, você pode adicionar um envio de email de boas-vindas
        // com um link para o usuário definir a própria senha.
      }

    } catch (userError) {
      console.error(`[Webhook] Erro ao criar/gerenciar usuário ${userError} no Firebase:`, userError);
      // Mesmo com erro na criação, retornamos 200 para a plataforma de pagamento
      // não ficar reenviando a notificação. O erro fica logado para ação manual.
    }

    // Responda 200 OK para a plataforma de pagamento.
    res.status(200).send('OK');

  } catch (error) {
    console.error("[Webhook] Erro CRÍTICO ao processar notificação:", error);
    // Mesmo em caso de erro, respondemos 200 para evitar retentativas.
    res.status(500).json({ error: 'Falha ao processar notificação.' });
  }
}

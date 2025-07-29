
import type { NextApiRequest, NextApiResponse } from 'next';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { auth } from '@/lib/firebase-admin';

// ===================================================================
// MANIPULADOR DO WEBHOOK PARA CRIAÇÃO DE USUÁRIO
// ===================================================================

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  console.log('[Webhook] Notificação recebida:', req.body);

  try {
    const { body } = req;
    const topic = body.topic || body.type;
    const paymentId = body.data?.id;

    if (topic === 'payment' && paymentId) {
      console.log(`[Webhook] Notificação de pagamento recebida para o ID: ${paymentId}`);
      
      const payment = new Payment(client);
      const paymentDetails = await payment.get({ id: paymentId });
      
      console.log('[Webhook] Detalhes do pagamento obtidos:', paymentDetails);

      const userEmail = paymentDetails.payer?.email;

      if (paymentDetails.status === 'approved' && userEmail) {
        console.log(`[Webhook] Pagamento ${paymentId} para o email ${userEmail} foi APROVADO.`);
        
        try {
          // 1. Verifica se o usuário já existe
          const existingUser = await auth.getUserByEmail(userEmail).catch(() => null);

          if (existingUser) {
            console.log(`[Webhook] Usuário com email ${userEmail} já existe. Nenhuma ação necessária.`);
            // Opcional: Liberar acesso ou enviar notificação para usuário existente.
          } else {
            // 2. Cria o novo usuário no Firebase Auth
            const newUser = await auth.createUser({
              email: userEmail,
              emailVerified: true, // Opcional: Considerar o email como verificado
              password: `senha-provisoria-${Math.random().toString(36).slice(-8)}`, // Senha aleatória e forte
              displayName: paymentDetails.payer?.first_name || 'Novo Membro',
              disabled: false,
            });

            console.log(`[Webhook] Usuário criado com sucesso no Firebase! UID: ${newUser.uid}`);
            
            // Opcional: Enviar email de boas-vindas com link para redefinir a senha
            // const link = await auth.generatePasswordResetLink(userEmail);
            // await sendWelcomeEmail(userEmail, link);
          }

        } catch (userError) {
          console.error(`[Webhook] Erro ao criar/gerenciar usuário ${userEmail} no Firebase:`, userError);
          // Mesmo com erro na criação do usuário, retornamos 200 para não receber a notificação novamente.
          // O erro fica logado para ação manual.
        }

      } else {
        console.log(`[Webhook] Status do pagamento: ${paymentDetails.status}. Nenhuma ação de criação de usuário será executada.`);
      }
    }

    // Responda 200 OK para o Mercado Pago para que ele não reenvie a notificação.
    res.status(200).send('OK');

  } catch (error) {
    console.error("[Webhook] Erro CRÍTICO ao processar notificação do Mercado Pago:", error);
    // Mesmo em caso de erro, respondemos 200 para evitar retentativas do Mercado Pago.
    res.status(500).json({ error: 'Falha ao processar notificação.' });
  }
}

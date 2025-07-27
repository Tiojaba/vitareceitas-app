
import type { NextApiRequest, NextApiResponse } from 'next';
import { MercadoPagoConfig, Payment } from 'mercadopago';

// ===================================================================
// MANIPULADOR DO WEBHOOK (VERSÃO SIMPLIFICADA PARA DIAGNÓSTICO)
// ===================================================================

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { body } = req;
    const topic = body.topic || body.type;
    const paymentId = body.data?.id;

    if (topic === 'payment' && paymentId) {
      console.log(`[Webhook Simples] Notificação de pagamento recebida para o ID: ${paymentId}`);
      
      const payment = new Payment(client);
      const paymentDetails = await payment.get({ id: paymentId });
      
      console.log('[Webhook Simples] Detalhes do pagamento:', paymentDetails);

      if (paymentDetails.status === 'approved') {
        console.log(`[Webhook Simples] Pagamento ${paymentId} foi APROVADO.`);
        // A lógica de criação de usuário no Firebase foi removida temporariamente para diagnóstico.
        // Se esta mensagem aparecer no log, a comunicação com o Mercado Pago está funcionando.
      }
    }

    // Responda 200 OK para o Mercado Pago para que ele não reenvie a notificação.
    res.status(200).send('OK');

  } catch (error) {
    console.error("[Webhook Simples] Erro ao processar notificação do Mercado Pago:", error);
    // Mesmo em caso de erro, respondemos 200 para evitar retentativas do Mercado Pago.
    // O erro já foi logado para análise.
    res.status(500).json({ error: 'Falha ao processar notificação.' });
  }
}

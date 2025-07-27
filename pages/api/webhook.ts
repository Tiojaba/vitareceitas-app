import type { NextApiRequest, NextApiResponse } from 'next';
import { MercadoPagoConfig, Payment } from 'mercadopago';

// Inicializa o cliente do Mercado Pago com o Access Token do Vendedor
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
      console.log(`Recebida notificação de pagamento: ${paymentId}`);
      
      const payment = new Payment(client);
      const paymentDetails = await payment.get({ id: paymentId });
      
      console.log('Detalhes do pagamento:', paymentDetails);

      if (paymentDetails.status === 'approved') {
        console.log(`Pagamento ${paymentId} foi aprovado.`);
        
        const payerEmail = paymentDetails.payer?.email;
        const payerName = paymentDetails.payer?.first_name || 'Novo Usuário';

        if (payerEmail) {
          console.log(`Email do pagador: ${payerEmail}. Iniciando processo de criação de usuário.`);
          
          // ===================================================================
          // PRÓXIMO PASSO: LÓGICA PARA CRIAR USUÁRIO NO FIREBASE
          // ===================================================================
          // 1. Inicializar o Firebase Admin SDK (requer credenciais de serviço)
          // 2. Verificar se o usuário já existe no Firebase Auth
          // 3. Se não existir, criar um novo usuário com o email e uma senha aleatória
          // 4. Salvar os detalhes do usuário (nome, etc.) no Firestore
          // 5. Enviar um email de boas-vindas com a senha gerada
          // ===================================================================

        } else {
          console.error("Não foi possível obter o email do pagador.");
        }
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error("Erro no webhook do Mercado Pago:", error);
    res.status(500).json({ error: 'Falha ao processar notificação.' });
  }
}

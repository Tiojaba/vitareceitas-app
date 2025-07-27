"use server";

import { checkoutFormSchema, type CheckoutFormSchema } from '@/lib/schemas';
import { MercadoPagoConfig, Payment } from 'mercadopago';

// 1. Valida os dados no servidor
export async function processPayment(data: CheckoutFormSchema) {
  const validationResult = checkoutFormSchema.safeParse(data);
  if (!validationResult.success) {
    // Retorna um erro detalhado em caso de falha na validação
    const errorMessages = validationResult.error.issues.map(issue => issue.message).join(', ');
    throw new Error(`Dados inválidos: ${errorMessages}`);
  }

  const { 
    amount, 
    customerName, 
    customerEmail, 
    orderInfo,
    creditCardHolder,
    creditCardNumber,
    creditCardExpiration,
    creditCardCvv
  } = validationResult.data;

  // 2. Configura o cliente do Mercado Pago com o token de acesso
  const client = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    options: { timeout: 5000 }
  });

  try {
    const payment = new Payment(client);
    
    // O ideal aqui seria usar o SDK JS do Mercado Pago no frontend para gerar um token de cartão
    // e enviar o token para o backend, em vez dos dados brutos do cartão.
    // Por simplicidade e para manter o foco no backend, estamos passando os dados,
    // mas isso NÃO é recomendado para produção real sem a tokenização do lado do cliente.
    
    const [expirationMonth, expirationYear] = creditCardExpiration.split('/');

    const paymentResult = await payment.create({
      body: {
        transaction_amount: amount,
        description: orderInfo,
        payment_method_id: 'master', // Nota: Isso deve ser dinâmico com base no cartão
        payer: {
          email: customerEmail,
          first_name: customerName,
        },
        token: 'CARD_TOKEN_GENERATED_BY_MERCADOPAGOJS', // Placeholder - isso será implementado no frontend
        installments: 1,
        notification_url: `${process.env.NEXT_PUBLIC_URL}/api/webhook`,
      }
    });

    console.log('Payment Result:', paymentResult);

    // 3. Retorna o resultado do pagamento para o frontend
    return paymentResult;

  } catch (error: any) {
    console.error("Payment creation failed:", error.cause ?? error);
    // Transmite uma mensagem de erro mais clara para o frontend
    const errorMessage = error.cause?.error?.message || "Não foi possível processar o pagamento neste momento. Verifique os dados do cartão ou tente novamente mais tarde.";
    throw new Error(errorMessage);
  }
}
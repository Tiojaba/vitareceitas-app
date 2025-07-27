
"use server";

import { checkoutFormSchema, type CheckoutFormSchema } from '@/lib/schemas';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function processPixPayment(data: CheckoutFormSchema) {
  const validationResult = checkoutFormSchema.safeParse(data);
  if (!validationResult.success) {
    const errorMessages = validationResult.error.issues.map(issue => issue.message).join(', ');
    throw new Error(`Dados inválidos: ${errorMessages}`);
  }

  const { 
    amount, 
    customerName, 
    customerEmail, 
    orderInfo,
  } = validationResult.data;

  const client = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    options: { timeout: 5000 }
  });

  try {
    const payment = new Payment(client);
    
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 30);
    
    const paymentResult = await payment.create({
      body: {
        transaction_amount: amount,
        description: orderInfo,
        payment_method_id: 'pix',
        payer: {
          email: customerEmail,
          first_name: customerName.split(' ')[0], 
          last_name: customerName.split(' ').slice(1).join(' '), 
        },
        notification_url: `${process.env.NEXT_PUBLIC_URL}/api/webhook`,
        date_of_expiration: expirationDate.toISOString().replace('.000Z', '-03:00'),
      }
    });

    console.log('PIX Payment Result:', paymentResult);

    const qrCode = paymentResult.point_of_interaction?.transaction_data?.qr_code;
    const qrCodeBase64 = paymentResult.point_of_interaction?.transaction_data?.qr_code_base64;
    const paymentId = paymentResult.id;

    if (!qrCode || !qrCodeBase64 || !paymentId) {
      throw new Error("Não foi possível gerar os dados do PIX.");
    }
    
    return {
      qrCode,
      qrCodeBase64,
      paymentId
    };

  } catch (error: any) {
    console.error("PIX creation failed:", error.cause ?? error);
    const errorMessage = error.cause?.error?.message || "Não foi possível gerar o PIX neste momento. Tente novamente mais tarde.";
    throw new Error(errorMessage);
  }
}

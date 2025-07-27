
"use server";

import { checkoutFormSchema, type CheckoutFormSchema } from '@/lib/schemas';
import { MercadoPagoConfig, Payment } from 'mercadopago';

// ATENÇÃO: O Mercado Pago exige um CPF para gerar um PIX.
// Substitua o valor abaixo por um CPF válido ou implemente a lógica para capturar o CPF do usuário.
const DEFAULT_CPF = "54394630042"; // SUBSTITUA POR UM CPF VÁLIDO

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
    customerPhone,
    orderInfo,
  } = validationResult.data;
  
  const customerDocument = DEFAULT_CPF;
  
  const nameParts = customerName.trim().split(/\s+/);
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '.';


  const client = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    options: { timeout: 5000 }
  });

  try {
    const payment = new Payment(client);
    
    // A data de expiração deve estar no formato ISO 8601
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 30);
    
    const paymentResult = await payment.create({
      body: {
        transaction_amount: amount,
        description: orderInfo,
        payment_method_id: 'pix',
        payer: {
          email: customerEmail,
          first_name: firstName, 
          last_name: lastName,
          identification: {
            type: 'CPF',
            number: customerDocument,
          },
          phone: {
            area_code: customerPhone.substring(0, 2),
            number: customerPhone.substring(2),
          }
        },
        notification_url: `${process.env.NEXT_PUBLIC_URL}/api/webhook`,
        date_of_expiration: expirationDate.toISOString().replace(/\.\d{3}Z$/, 'Z'),
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
    console.error("PIX creation failed:", error);
    // Extrai a mensagem de erro específica do Mercado Pago, se disponível
    const errorMessage = 
        error?.cause?.data?.message || 
        "Não foi possível gerar o PIX neste momento. Verifique os dados e tente novamente.";
    throw new Error(errorMessage);
  }
}

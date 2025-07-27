"use server";

import { redirect } from 'next/navigation';
import { checkoutFormSchema, type CheckoutFormSchema } from '@/lib/schemas';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// 1. Valida os dados no servidor
export async function processPayment(data: CheckoutFormSchema) {
  const validationResult = checkoutFormSchema.safeParse(data);
  if (!validationResult.success) {
    throw new Error('Invalid data provided. Please check your inputs.');
  }

  const { amount, customerName, customerEmail, orderInfo } = validationResult.data;

  // 2. Configura o cliente do Mercado Pago com o token de acesso
  const client = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    options: { timeout: 5000, idempotencyKey: 'abc' }
  });

  try {
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [
          {
            id: 'prod-001',
            title: orderInfo,
            quantity: 1,
            unit_price: amount
          }
        ],
        payer: {
          name: customerName,
          email: customerEmail,
        },
        back_urls: {
            success: `${process.env.NEXT_PUBLIC_URL}/confirmation`,
            failure: `${process.env.NEXT_PUBLIC_URL}/confirmation`,
            pending: `${process.env.NEXT_PUBLIC_URL}/confirmation`,
        },
        auto_return: "approved",
      }
    });
    
    // 3. Redireciona para o checkout do Mercado Pago
    redirect(result.init_point!);

  } catch (error) {
    console.error("Payment creation failed:", error);
    throw new Error("Could not create payment preference at this time. Please try again later.");
  }
}
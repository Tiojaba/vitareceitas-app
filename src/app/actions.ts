
"use server";

import 'dotenv/config'; // Garante que as variáveis de ambiente sejam carregadas
import { checkoutFormSchema, type CheckoutFormSchema, recipeSchema, type RecipeFormValues } from '@/lib/schemas';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { auth, db } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

// Helper para extrair a mensagem de erro do Mercado Pago
function getMercadoPagoErrorMessage(error: any): string {
    console.error("Mercado Pago Full Error:", JSON.stringify(error, null, 2));

    const defaultMessage = "Não foi possível gerar o PIX. Verifique os dados e tente novamente.";

    if (error && typeof error === 'object') {
        // A API do mercadopago-sdk-js v2 encapsula o erro em 'cause.data'
        if (error.cause && error.cause.data && error.cause.data.message) {
            return error.cause.data.message;
        }
        // Erros diretos da API às vezes vêm na propriedade 'message'
        if (error.message) {
            return error.message;
        }
    }
    
    return defaultMessage;
}


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
    customerDocument,
    orderInfo,
  } = validationResult.data;
  
  const nameParts = customerName.trim().split(/\s+/);
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '.';


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
    const errorMessage = getMercadoPagoErrorMessage(error);
    throw new Error(errorMessage);
  }
}

export async function submitRecipe(userId: string, data: RecipeFormValues) {
  const validation = recipeSchema.safeParse(data);
  if (!validation.success) {
    throw new Error('Dados do formulário inválidos.');
  }

  if (!userId) {
    throw new Error('Usuário não autenticado.');
  }
  
  const user = await auth.getUser(userId);

  if (!user) {
    throw new Error('Usuário não encontrado.');
  }

  try {
    const recipeRef = db.collection('recipes').doc();
    await recipeRef.set({
      ...validation.data,
      authorId: userId,
      authorName: user.displayName || user.email,
      authorAvatar: user.photoURL || `https://placehold.co/40x40.png?text=${(user.email || 'A').charAt(0).toUpperCase()}`,
      createdAt: new Date(),
    });

    revalidatePath('/profile');
    revalidatePath('/dashboard');

    return { success: true, recipeId: recipeRef.id };

  } catch (error) {
    console.error('Erro ao salvar receita:', error);
    throw new Error('Não foi possível salvar a receita. Tente novamente mais tarde.');
  }
}

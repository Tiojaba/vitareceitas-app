

"use server";

import 'dotenv/config'; // Garante que as variáveis de ambiente sejam carregadas
import { checkoutFormSchema, type CheckoutFormSchema, recipeSchema, type RecipeSchema } from '@/lib/schemas';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { auth, db } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { randomUUID } from 'crypto';

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

export async function submitRecipe(formData: FormData) {
  // 1. Get current user
  const headersList = headers();
  const idToken = headersList.get('Authorization')?.split('Bearer ')[1];
  if (!idToken) {
    throw new Error('Usuário não autenticado.');
  }
  const decodedToken = await auth.verifyIdToken(idToken);
  const userId = decodedToken.uid;
  const userName = decodedToken.name || decodedToken.email || 'Anônimo';

  // 2. Coleta e processa os dados do formulário
  const data = {
    title: formData.get('title'),
    description: formData.get('description'),
    prepTime: formData.get('prepTime'),
    servings: formData.get('servings'),
    category: formData.get('category'),
    ingredients: formData.getAll('ingredients').map(val => ({ value: val })),
    instructions: formData.getAll('instructions').map(val => ({ value: val })),
  };

  // 3. Validate form data
  const validationResult = recipeSchema.safeParse({
    ...data,
    prepTime: data.prepTime ? Number(data.prepTime) : undefined,
    servings: data.servings ? Number(data.servings) : undefined,
  });

  if (!validationResult.success) {
    const errorMessages = validationResult.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('; ');
    console.error("Validation Errors:", validationResult.error.issues);
    throw new Error(`Dados inválidos: ${errorMessages}`);
  }

  const recipeData = validationResult.data;
  const recipeId = randomUUID();
  
  // 5. Save recipe data to Firestore
  const recipeDocRef = db.collection('recipes').doc(recipeId);
  await recipeDocRef.set({
    ...recipeData,
    authorId: userId,
    authorName: userName,
    imageUrl: `https://placehold.co/1200x600.png?text=${encodeURIComponent(recipeData.title)}`, // Placeholder image
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // 6. Revalidate paths and return result
  revalidatePath('/dashboard');
  revalidatePath('/profile'); 
  
  return {
    success: true,
    recipeId: recipeId
  };
}

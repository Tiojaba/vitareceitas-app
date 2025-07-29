

"use server";

import 'dotenv/config'; 
import { recipeSchema, type RecipeSchema } from '@/lib/schemas';
import { auth, db } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { randomUUID } from 'crypto';
import type { CheckoutFormSchema } from "@/lib/schemas";
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function processPixPayment(formData: CheckoutFormSchema) {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("As credenciais do Mercado Pago não estão configuradas no servidor.");
  }
  
  const client = new MercadoPagoConfig({ accessToken });
  const payment = new Payment(client);

  const paymentData = {
    transaction_amount: formData.amount,
    description: formData.orderInfo,
    payment_method_id: 'pix',
    payer: {
      email: formData.customerEmail,
      first_name: formData.customerName.split(' ')[0],
      last_name: formData.customerName.split(' ').slice(1).join(' '),
      identification: {
        type: 'CPF',
        number: formData.customerDocument
      },
      phone: {
        area_code: formData.customerPhone.substring(0, 2),
        number: formData.customerPhone.substring(2)
      },
    },
    notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook`,
  };

  try {
    const result = await payment.create({ body: paymentData });
    
    if (!result.id || !result.point_of_interaction?.transaction_data) {
        throw new Error("Resposta inesperada do Mercado Pago ao criar pagamento.");
    }

    return {
      paymentId: result.id,
      qrCode: result.point_of_interaction.transaction_data.qr_code,
      qrCodeBase64: result.point_of_interaction.transaction_data.qr_code_base64,
    };
  } catch (error: any) {
    console.error("Erro ao criar pagamento PIX:", error.cause ?? error);
    throw new Error("Falha ao comunicar com o Mercado Pago.");
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

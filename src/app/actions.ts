

"use server";

import 'dotenv/config'; 
import { recipeSchema, type RecipeSchema } from '@/lib/schemas';
import { auth, db } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { randomUUID } from 'crypto';

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

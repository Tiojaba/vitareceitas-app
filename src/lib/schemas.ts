
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


export const recipeSchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres."),
  description: z.string().min(20, "A descrição deve ter pelo menos 20 caracteres.").max(300, "A descrição não pode ter mais de 300 caracteres."),
  ingredients: z.array(z.object({ value: z.string().min(3, "O ingrediente deve ter pelo menos 3 caracteres.") })).min(1, "Adicione pelo menos um ingrediente."),
  instructions: z.array(z.object({ value: z.string().min(10, "O passo deve ter pelo menos 10 caracteres.") })).min(1, "Adicione pelo menos um passo."),
  category: z.string().min(1, "Você deve selecionar uma categoria."),
  prepTime: z.coerce.number().int().positive("O tempo de preparo deve ser um número positivo."),
  servings: z.coerce.number().int().positive("O rendimento deve ser um número positivo."),
});

export type RecipeSchema = z.infer<typeof recipeSchema>;

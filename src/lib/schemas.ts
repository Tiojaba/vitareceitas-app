
import { z } from "zod";

export const checkoutFormSchema = z.object({
  amount: z.coerce.number().positive({ message: "O valor deve ser um número positivo." }).min(0.01, { message: "O valor deve ser de pelo menos 0.01." }),
  customerName: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  customerEmail: z.string().email({ message: "Por favor, insira um endereço de e-mail válido." }),
  customerPhone: z.string().min(10, { message: "O telefone deve ter pelo menos 10 dígitos." }),
  customerDocument: z.string().min(11, { message: "O CPF deve ter 11 dígitos." }).max(11, { message: "O CPF deve ter 11 dígitos." }),
  orderInfo: z.string().min(10, { message: "A informação do pedido deve ter pelo menos 10 caracteres." }),
});

export type CheckoutFormSchema = z.infer<typeof checkoutFormSchema>;


export const recipeSchema = z.object({
  title: z.string().min(5, 'O título deve ter pelo menos 5 caracteres.'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
  ingredients: z.string().min(10, 'Os ingredientes devem ter pelo menos 10 caracteres.'),
  instructions: z.string().min(20, 'O modo de preparo deve ter pelo menos 20 caracteres.'),
  category: z.string({ required_error: 'Por favor, selecione uma categoria.' }),
  photoUrl: z.string().url('Por favor, forneça uma URL de imagem válida.').optional().or(z.literal('')),
});

export type RecipeFormValues = z.infer<typeof recipeSchema>;
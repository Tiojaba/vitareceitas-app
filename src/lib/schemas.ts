
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


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
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres."),
  description: z.string().min(20, "A descrição deve ter pelo menos 20 caracteres.").max(300, "A descrição não pode ter mais de 300 caracteres."),
  ingredients: z.string().min(20, "A lista de ingredientes deve ter pelo menos 20 caracteres."),
  instructions: z.string().min(50, "O modo de preparo deve ter pelo menos 50 caracteres."),
  category: z.string().min(1, "Você deve selecionar uma categoria."),
  prepTime: z.coerce.number().int().positive("O tempo de preparo deve ser um número positivo."),
  servings: z.coerce.number().int().positive("O rendimento deve ser um número positivo."),
  image: z
    .any()
    .refine((file) => file instanceof File, "Uma imagem é obrigatória.")
    .refine((file) => file?.size <= MAX_FILE_SIZE, `O tamanho máximo da imagem é de 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Apenas os formatos .jpg, .jpeg, .png e .webp são aceitos."
    ),
});

export type RecipeSchema = z.infer<typeof recipeSchema>;


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

import { z } from "zod";

// Schema for PIX payment, simplified to only include customer data.
export const checkoutFormSchema = z.object({
  amount: z.coerce.number().positive({ message: "Amount must be a positive number." }).min(0.01, { message: "Amount must be at least 0.01." }),
  customerName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  customerEmail: z.string().email({ message: "Please enter a valid email address." }),
  orderInfo: z.string().min(10, { message: "Order information must be at least 10 characters long." }),
});

export type CheckoutFormSchema = z.infer<typeof checkoutFormSchema>;

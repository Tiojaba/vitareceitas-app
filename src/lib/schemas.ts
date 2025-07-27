import { z } from "zod";

export const checkoutFormSchema = z.object({
  amount: z.coerce.number().positive({ message: "Amount must be a positive number." }).min(0.01, { message: "Amount must be at least 0.01." }),
  customerName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  customerEmail: z.string().email({ message: "Please enter a valid email address." }),
  orderInfo: z.string().min(10, { message: "Order information must be at least 10 characters long." }),
  creditCardNumber: z.string().min(13, "Invalid card number.").max(19, "Invalid card number."),
  creditCardHolder: z.string().min(2, "Invalid card holder name."),
  creditCardExpiration: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiration date (MM/YY)."),
  creditCardCvv: z.string().min(3, "Invalid CVV.").max(4, "Invalid CVV."),
});

export type CheckoutFormSchema = z.infer<typeof checkoutFormSchema>;
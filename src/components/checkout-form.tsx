"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, User, Mail, ShoppingBag, CreditCard, CalendarIcon, Lock } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';
import Script from "next/script";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { checkoutFormSchema, type CheckoutFormSchema } from "@/lib/schemas";
import { processPayment } from "@/app/actions";

declare global {
  interface Window {
    MercadoPago: any;
  }
}

export function CheckoutForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isMercadoPagoReady, setIsMercadoPagoReady] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<CheckoutFormSchema>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      amount: 49.99,
      customerName: searchParams.get('name') || "João da Silva",
      customerEmail: searchParams.get('email') || "joao.silva@example.com",
      orderInfo: "Ebook de Culinária Avançada",
      creditCardHolder: "",
      creditCardNumber: "",
      creditCardExpiration: "",
      creditCardCvv: "",
    },
  });

  const onSubmit = async (values: CheckoutFormSchema) => {
    setIsSubmitting(true);
    try {
      // The server action now returns a result instead of redirecting
      const result = await processPayment(values);
      
      if (result.status === 'approved') {
        router.push(`/confirmation?status=approved&payment_id=${result.id}`);
      } else {
        router.push(`/confirmation?status=${result.status}&payment_id=${result.id}`);
      }

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Falha no Pagamento",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido. Por favor, tente novamente.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-6 h-6" /> Seus Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <div className="relative">
                           <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="ex: João da Silva" {...field} className="pl-8"/>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço de Email</FormLabel>
                      <FormControl>
                         <div className="relative">
                           <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="email" placeholder="ex: joao.silva@email.com" {...field} className="pl-8"/>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-6 h-6" /> Dados do Pagamento
              </CardTitle>
              <CardDescription>Insira os dados do seu cartão de crédito.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <FormField
                  control={form.control}
                  name="creditCardNumber"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Número do Cartão</FormLabel>
                      <FormControl>
                        <div className="relative">
                           <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="0000 0000 0000 0000" {...field} className="pl-8"/>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="creditCardHolder"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Nome no Cartão</FormLabel>
                      <FormControl>
                        <div className="relative">
                           <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Como aparece no cartão" {...field} className="pl-8"/>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="creditCardExpiration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Validade (MM/AA)</FormLabel>
                      <FormControl>
                         <div className="relative">
                           <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="MM/AA" {...field} className="pl-8"/>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                control={form.control}
                name="creditCardCvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="123" {...field} className="pl-8"/>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processando...
              </>
            ) : (
              `Pagar R$ ${form.getValues('amount')}`
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
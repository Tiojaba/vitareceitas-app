"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, User, Mail, Phone } from "lucide-react";
import { useRouter } from 'next/navigation';

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
import { processPixPayment } from "@/app/actions";

export function CheckoutForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<CheckoutFormSchema>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      amount: 49.99,
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      orderInfo: "Ebook de Culinária Avançada",
    },
  });

  const onSubmit = async (values: CheckoutFormSchema) => {
    setIsSubmitting(true);
    try {
      const result = await processPixPayment(values);
      
      const params = new URLSearchParams({
        qrCode: result.qrCode,
        qrCodeBase64: result.qrCodeBase64,
        paymentId: result.paymentId.toString(),
      });
      router.push(`/pix?${params.toString()}`);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Falha ao gerar PIX",
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
              <CardDescription>
                Informe seus dados para gerar o pagamento PIX.
              </CardDescription>
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
                 <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone (com DDD)</FormLabel>
                      <FormControl>
                         <div className="relative">
                           <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="tel" placeholder="ex: 11987654321" {...field} className="pl-8"/>
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
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Gerando PIX...
              </>
            ) : (
              `Pagar R$ ${form.getValues('amount')} com PIX`
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}

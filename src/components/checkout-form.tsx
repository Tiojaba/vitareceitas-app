"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, User, Mail, DollarSign, Info, Link as LinkIcon, ShoppingBag, Webhook } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { checkoutFormSchema, type CheckoutFormSchema } from "@/lib/schemas";
import { processPayment } from "@/app/actions";

export function CheckoutForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<CheckoutFormSchema>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      amount: 19.99,
      customerName: "Alex Doe",
      customerEmail: "alex.doe@example.com",
      orderInfo: "1x Assinatura Premium, 1x Pacote de Add-on",
      webhookUrl: "https://webhook.site/sample",
    },
  });

  const watchedValues = form.watch();

  const onSubmit = async (values: CheckoutFormSchema) => {
    setIsSubmitting(true);
    try {
      await processPayment(values);
      // Redirect is handled by the server action on success.
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Pagamento com PIX
              </CardTitle>
              <CardDescription>Insira os detalhes para a transação simulada.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (BRL)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">R$</span>
                        <Input type="number" step="0.01" placeholder="ex: 49,99" {...field} className="pl-8"/>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                name="orderInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Informações do Pedido</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descreva os itens ou serviços que estão sendo comprados..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="webhookUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do Webhook</FormLabel>
                    <FormControl>
                      <div className="relative">
                         <Webhook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="https://seu-endpoint.com/webhook" {...field} className="pl-8"/>
                      </div>
                    </FormControl>
                     <FormDescription>
                        Enviaremos uma requisição POST aqui após o pagamento.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShoppingBag className="w-6 h-6" /> Resumo do Pedido</CardTitle>
                <CardDescription>Revise os detalhes do seu pedido antes de pagar.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Valor a Pagar:</span>
                  <span className="font-semibold text-lg">
                    R$ {(watchedValues.amount || 0).toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Cobrado de:</span>
                  <span className="font-medium text-right">{watchedValues.customerName || "..."}<br/>{watchedValues.customerEmail || "..."}</span>
                </div>
                 <div className="space-y-1 pt-2">
                  <span className="text-muted-foreground">Pedido:</span>
                  <p className="font-mono text-xs bg-muted/50 p-2 rounded-md whitespace-pre-wrap break-words">
                    {watchedValues.orderInfo || "..."}
                  </p>
                </div>
              </CardContent>
            </Card>
             <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processando...
                </>
              ) : (
                `Pagar R$ ${(watchedValues.amount || 0).toFixed(2).replace('.', ',')} com PIX`
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

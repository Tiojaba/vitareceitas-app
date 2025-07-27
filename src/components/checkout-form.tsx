"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, User, Mail, DollarSign, Info, Link as LinkIcon, CreditCard, ShoppingBag, Webhook } from "lucide-react";

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
      orderInfo: "1x Premium Subscription, 1x Add-on Pack",
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
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred. Please try again.",
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
              <CardTitle className="flex items-center gap-2"><CreditCard className="w-6 h-6" /> Payment Information</CardTitle>
              <CardDescription>Enter the details for this simulated transaction.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (USD)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="number" step="0.01" placeholder="e.g., 49.99" {...field} className="pl-8"/>
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
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                         <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="e.g., Jane Smith" {...field} className="pl-8"/>
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
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                       <div className="relative">
                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="email" placeholder="e.g., jane.smith@email.com" {...field} className="pl-8"/>
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
                    <FormLabel>Order Information</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the items or services being purchased..." {...field} />
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
                    <FormLabel>Webhook URL</FormLabel>
                    <FormControl>
                      <div className="relative">
                         <Webhook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="https://your-endpoint.com/webhook" {...field} className="pl-8"/>
                      </div>
                    </FormControl>
                     <FormDescription>
                        We'll send a POST request here after the payment.
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
                <CardTitle className="flex items-center gap-2"><ShoppingBag className="w-6 h-6" /> Order Summary</CardTitle>
                <CardDescription>Review your order details before paying.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Amount Due:</span>
                  <span className="font-semibold text-lg">
                    ${(watchedValues.amount || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Billed To:</span>
                  <span className="font-medium text-right">{watchedValues.customerName || "..."}<br/>{watchedValues.customerEmail || "..."}</span>
                </div>
                 <div className="space-y-1 pt-2">
                  <span className="text-muted-foreground">Order:</span>
                  <p className="font-mono text-xs bg-muted/50 p-2 rounded-md whitespace-pre-wrap break-words">
                    {watchedValues.orderInfo || "..."}
                  </p>
                </div>
              </CardContent>
            </Card>
             <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                </>
              ) : (
                `Pay $${(watchedValues.amount || 0).toFixed(2)} Now`
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

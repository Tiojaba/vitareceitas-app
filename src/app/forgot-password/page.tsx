
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
});

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  const { resetPassword } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>>) => {
    setIsSubmitting(true);
    try {
      await resetPassword(values.email);
      toast({
        title: 'Email Enviado!',
        description: 'Verifique sua caixa de entrada para o link de redefinição de senha.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Falha ao enviar email',
        description: error.message || 'Ocorreu um erro desconhecido.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight font-headline text-center">Esqueceu a senha?</CardTitle>
          <CardDescription className="text-center">
            Sem problemas. Insira seu e-mail e enviaremos um link para você resetar sua senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="email" placeholder="seu@email.com" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar Link de Redefinição
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center">
            <Button variant="ghost" asChild>
                <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para o Login
                </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
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
import { Loader2, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});

type FormValues = z.infer<typeof formSchema>;

type AuthFormProps = {
  mode: 'login' | 'signup';
};

export function AuthForm({ mode }: AuthFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { login, signup } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await login(values.email, values.password);
      } else {
        await signup(values.email, values.password);
      }
      toast({
        title: mode === 'login' ? 'Login bem-sucedido!' : 'Conta criada com sucesso!',
        description: 'Você será redirecionado em breve.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: `Falha no ${mode === 'login' ? 'Login' : 'Cadastro'}`,
        description: error.message || 'Ocorreu um erro desconhecido.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const title = mode === 'login' ? 'Acesse sua conta' : 'Crie sua conta';
  const description = mode === 'login' 
    ? 'Bem-vindo de volta! Insira seus dados para continuar.'
    : 'Vamos começar! Preencha os campos abaixo para se registrar.';
  const buttonText = mode === 'login' ? 'Entrar' : 'Criar Conta';
  const linkText = mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?';
  const linkHref = mode === 'login' ? '/signup' : '/login';

  return (
    <Card className="w-full max-w-md">
       <CardHeader className="items-center text-center">
        <Logo className="h-12 w-12 mb-4 text-primary" />
        <CardTitle className="text-3xl font-bold tracking-tight font-headline">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  {mode === 'login' && (
                      <div className="text-right text-sm mt-2">
                          <Link href="/forgot-password" className="text-primary hover:underline">
                              Esqueceu a senha?
                          </Link>
                      </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {buttonText}
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {linkText}{' '}
            <Link href={linkHref} className="font-semibold text-primary hover:underline">
              clique aqui
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

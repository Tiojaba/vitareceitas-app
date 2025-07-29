
'use client';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wheat, Carrot, UtensilsCrossed, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Carregando...
      </div>
    );
  }

  const name = user.displayName || user.email?.split('@')[0] || 'Membro';

  return (
    <div className="container mx-auto py-10 px-4">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
          Bem-vindo(a), <span className="text-primary">{name}</span>!
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Explore um mundo de sabores sem lactose. O que vamos cozinhar hoje?
        </p>
      </header>
      
      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UtensilsCrossed className="text-primary" />
                        Pratos Principais
                    </CardTitle>
                    <CardDescription>Refeições completas e saborosas.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Encontre o prato perfeito para seu almoço ou jantar.</p>
                </CardContent>
            </Card>
             <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wheat className="text-primary" />
                        Lanches e Sobremesas
                    </CardTitle>
                    <CardDescription>Delícias para qualquer hora do dia.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Bolos, tortas e lanches rápidos para adoçar a vida.</p>
                </CardContent>
            </Card>
             <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Carrot className="text-primary" />
                        Saladas e Entradas
                    </CardTitle>
                    <CardDescription>Opções leves para começar bem.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Combinações criativas e refrescantes.</p>
                </CardContent>
            </Card>
             <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="text-primary" />
                        Receitas da Comunidade
                    </CardTitle>
                    <CardDescription>Criações enviadas por membros.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Inspire-se com as receitas de outros apaixonados por culinária.</p>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}

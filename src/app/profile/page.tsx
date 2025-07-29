'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Award, BookOpen, Edit, PlusCircle } from 'lucide-react';
import { Header } from '@/components/header';

export default function ProfilePage() {
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
  const userInitials = (user.displayName || user.email || 'M').substring(0, 2).toUpperCase();

  const achievements = [
    { title: "Pioneiro Culinário", description: "Enviou sua primeira receita", unlocked: false },
    { title: "Mestre dos Sabores", description: "Enviou 5 receitas", unlocked: false },
    { title: "Explorador de Categorias", description: "Enviou receitas em 3 categorias diferentes", unlocked: false },
  ];

  const hasRecipes = false; // Placeholder

  return (
    <>
      <Header />
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-4xl">
        <header className="flex flex-col sm:flex-row items-center gap-6 mb-10">
          <Avatar className="h-24 w-24 text-3xl">
            <AvatarImage src={user.photoURL || ''} alt={name} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
              {name}
            </h1>
            <p className="mt-1 text-lg text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="outline" className="sm:ml-auto">
            <Edit className="mr-2 h-4 w-4" />
            Editar Perfil
          </Button>
        </header>

        <main className="space-y-12">
          {/* Minhas Receitas */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <BookOpen className="h-6 w-6 text-primary" />
                  Minhas Receitas
                </CardTitle>
                <CardDescription>
                  As receitas que você compartilhou com a comunidade.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasRecipes ? (
                  <div>
                    {/* Recipe list will go here */}
                  </div>
                ) : (
                  <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <h3 className="text-lg font-semibold text-muted-foreground">Você ainda não compartilhou nenhuma receita</h3>
                    <Button className="mt-4" asChild>
                      <a href="/submit-recipe">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Compartilhe sua primeira receita!
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Conquistas */}
          <section>
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <Award className="h-6 w-6 text-primary" />
                  Conquistas
                </CardTitle>
                <CardDescription>
                  Seus títulos e progresso na comunidade.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-3">
                 {achievements.map((ach) => (
                    <Card key={ach.title} className={`p-4 ${ach.unlocked ? 'bg-accent/50' : 'bg-muted/50'}`}>
                      <h4 className="font-semibold">{ach.title}</h4>
                      <p className="text-sm text-muted-foreground">{ach.description}</p>
                    </Card>
                  ))}
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </>
  );
}

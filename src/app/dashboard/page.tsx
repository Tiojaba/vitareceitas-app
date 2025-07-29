
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Cookie, IceCream, Pizza, Wheat, Sprout, Soup, Fish, Drumstick, Star } from 'lucide-react';
import Image from 'next/image';

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
  
  const categories = [
    { title: "Zero Lactose", icon: <Wheat className="w-8 h-8" /> },
    { title: "Sem Glúten", icon: <Sprout className="w-8 h-8" /> },
    { title: "Sobremesas", icon: <IceCream className="w-8 h-8" /> },
    { title: "Lanches", icon: <Pizza className="w-8 h-8" /> },
    { title: "Prato Principal", icon: <Drumstick className="w-8 h-8" /> },
    { title: "Sopas e Caldos", icon: <Soup className="w-8 h-8" /> },
    { title: "Frutos do Mar", icon: <Fish className="w-8 h-8" /> },
    { title: "Básicos", icon: <Cookie className="w-8 h-8" /> },
  ];

  const highlights = [
    { title: "Bolo de Cenoura Fofinho", image: "https://placehold.co/600x400.png", dataAiHint: "carrot cake" },
    { title: "Pão de Queijo Vegano", image: "https://placehold.co/600x400.png", dataAiHint: "vegan cheese bread" },
    { title: "Moqueca de Banana da Terra", image: "https://placehold.co/600x400.png", dataAiHint: "banana moqueca" },
    { title: "Mousse de Chocolate com Abacate", image: "https://placehold.co/600x400.png", dataAiHint: "avocado chocolate mousse" },
  ];

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
          Bem-vindo(a), <span className="text-primary">{name}</span>!
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Vamos cozinhar algo delicioso hoje?
        </p>
      </header>

      <main className="space-y-12">
        {/* Banner Desafio */}
        <section className="relative bg-primary text-primary-foreground rounded-xl p-8 flex flex-col md:flex-row items-center justify-between overflow-hidden">
             <div className="absolute -bottom-12 -right-12 opacity-10">
                <Wheat size={200} />
            </div>
            <div className="relative z-10 md:w-2/3">
                <h2 className="text-3xl font-bold font-headline">Desafio 7 Dias Sem Lactose</h2>
                <p className="mt-2 text-primary-foreground/90">
                    Junte-se a nós em uma jornada de uma semana com receitas incríveis e dicas para uma vida mais leve e saborosa.
                </p>
                <Button variant="secondary" className="mt-6">
                    Quero Participar <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </section>

        {/* Categorias */}
        <section>
          <h2 className="text-2xl font-bold font-headline mb-6">Categorias</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card key={category.title} className="flex flex-col items-center justify-center p-6 text-center hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                <div className="text-primary mb-3">{category.icon}</div>
                <h3 className="font-semibold">{category.title}</h3>
              </Card>
            ))}
          </div>
        </section>

        {/* Melhores da Semana */}
        <section>
          <h2 className="text-2xl font-bold font-headline mb-6">Melhores da Semana</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {highlights.map((item) => (
              <Card key={item.title} className="overflow-hidden group hover:shadow-xl transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    data-ai-hint={item.dataAiHint}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

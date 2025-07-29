
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Cookie, IceCream, Pizza, Wheat, Sprout, Soup, Fish, Drumstick, User, Timer, Users, BarChart3, Tag, BookOpen, ShieldCheck, MessageSquare, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

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
    { title: "Zero Lactose", icon: <Wheat className="w-8 h-8" />, href: "/recipe/moqueca-de-banana-da-terra" },
    { title: "Sem Glúten", icon: <Sprout className="w-8 h-8" />, href: "/recipe/pao-de-queijo-vegano" },
    { title: "Sobremesas", icon: <IceCream className="w-8 h-8" />, href: "/recipe/mousse-de-chocolate-com-abacate" },
    { title: "Lanches", icon: <Pizza className="w-8 h-8" />, href: "/recipe/pao-de-queijo-vegano" },
    { title: "Prato Principal", icon: <Drumstick className="w-8 h-8" />, href: "#" },
    { title: "Sopas e Caldos", icon: <Soup className="w-8 h-8" />, href: "#" },
    { title: "Frutos do Mar", icon: <Fish className="w-8 h-8" />, href: "#" },
    { title: "Básicos", icon: <Cookie className="w-8 h-8" />, href: "#" },
  ];

  const highlights = [
    { 
      title: "Moqueca de Banana-da-Terra", 
      href: "/recipe/moqueca-de-banana-da-terra",
      author: "Ana G.",
      prepTime: "45 min",
      difficulty: "Médio",
      servings: "4 porções",
      tags: ["Zero Lactose", "Vegano"]
    },
    { 
      title: "Bolo de Cenoura Fofinho", 
      href: "/recipe/bolo-de-cenoura-fofinho",
      author: "Mariana S.",
      prepTime: "60 min",
      difficulty: "Fácil",
      servings: "8 porções",
      tags: ["Sobremesa", "Zero Lactose"]
    },
    { 
      title: "Pão de Queijo Vegano", 
      href: "/recipe/pao-de-queijo-vegano",
      author: "Carlos L.",
      prepTime: "40 min",
      difficulty: "Fácil",
      servings: "16 unidades",
      tags: ["Lanche", "Sem Glúten"]
    },
    { 
      title: "Mousse de Chocolate com Abacate", 
      href: "/recipe/mousse-de-chocolate-com-abacate",
      author: "Juliana P.",
      prepTime: "15 min",
      difficulty: "Fácil",
      servings: "4 porções",
      tags: ["Sobremesa", "Vegano"]
    },
  ];

  const bonuses = [
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "E-book 'Técnicas Culinárias'",
      description: "Domine as substituições para garantir sabor e textura perfeitos em suas receitas.",
      actionText: "Baixar E-book",
      href: "/ebook-tecnicas-zero-lactose.pdf",
      isDownload: true,
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: "Guia 'Desvendando Rótulos'",
      description: "Aprenda a identificar lactose disfarçada e compre com total segurança.",
      actionText: "Acessar Conteúdo",
      href: "#",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-primary" />,
      title: "Comunidade VIP (30 dias)",
      description: "Conecte-se, tire dúvidas com especialistas e receba apoio em um grupo exclusivo.",
      actionText: "Entrar no Grupo",
      href: "#",
    },
    {
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      title: "Módulo 'Zero Lactose & Sem Glúten'",
      description: "Um guia rápido e 5 receitas essenciais para quem tem múltiplas restrições.",
      actionText: "Ver Receitas",
      href: "#",
    }
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

        {/* Bônus Exclusivos */}
        <section>
          <h2 className="text-2xl font-bold font-headline mb-6">Bônus Exclusivos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bonuses.map((bonus) => (
              <Card key={bonus.title} className="flex flex-col">
                <CardHeader className="flex-row items-start gap-4 space-y-0">
                  {bonus.icon}
                  <div className="flex-1">
                    <CardTitle>{bonus.title}</CardTitle>
                    <CardDescription>{bonus.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardFooter className="mt-auto">
                   <Button asChild className="w-full">
                    {bonus.isDownload ? (
                      <a href={bonus.href} download>
                        {bonus.actionText}
                      </a>
                    ) : (
                      <Link href={bonus.href}>{bonus.actionText}</Link>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Categorias */}
        <section>
          <h2 className="text-2xl font-bold font-headline mb-6">Categorias</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link href={category.href} key={category.title}>
                <Card className="flex flex-col items-center justify-center p-6 text-center hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer h-full">
                  <div className="text-primary mb-3">{category.icon}</div>
                  <h3 className="font-semibold">{category.title}</h3>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Melhores da Semana */}
        <section>
          <h2 className="text-2xl font-bold font-headline mb-6">Melhores da Semana</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {highlights.map((item) => (
              <Link href={item.href} key={item.title} className="group">
                <Card className="overflow-hidden group-hover:shadow-xl transition-shadow h-full flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      {item.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="w-4 h-4 mr-2 text-primary" />
                      Postado por: <span className="font-medium ml-1 text-foreground">{item.author}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Timer className="w-4 h-4 mr-2 text-primary" />
                      Tempo de preparo: <span className="font-medium ml-1 text-foreground">{item.prepTime}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between bg-muted/50 p-4">
                      <div className="flex items-center text-sm">
                          <BarChart3 className="w-4 h-4 mr-2 text-primary" />
                          Dificuldade: <span className="font-medium ml-1">{item.difficulty}</span>
                      </div>
                       <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 mr-2 text-primary" />
                          Serve: <span className="font-medium ml-1">{item.servings}</span>
                      </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

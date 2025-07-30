
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Cookie, IceCream, Pizza, Wheat, Sprout, Soup, Fish, Drumstick, User, Timer, Users, BarChart3, BookOpen, ShieldCheck, MessageSquare, ListChecks } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { getRecipes } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';

type Recipe = {
    id: string;
    slug: string;
    title: string;
    author: string;
    difficulty: string;
    description: string;
    prepTime: number;
    cookTime: number;
    servings: number;
    category: string;
    tags: string[];
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchRecipes() {
        if(user) {
            setLoading(true);
            const fetchedRecipes = await getRecipes();
            setRecipes(fetchedRecipes as Recipe[]);
            setLoading(false);
        }
    }
    fetchRecipes();
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Carregando...
      </div>
    );
  }

  const name = user.displayName || user.email?.split('@')[0] || 'Membro';
  
  const categories = [
    { title: "Zero Lactose", icon: <Wheat className="w-8 h-8" />, href: "/recipes?category=Zero Lactose" },
    { title: "Sem Glúten", icon: <Sprout className="w-8 h-8" />, href: "/recipes?category=Sem Glúten" },
    { title: "Sobremesas", icon: <IceCream className="w-8 h-8" />, href: "/recipes?category=Sobremesas" },
    { title: "Lanches", icon: <Pizza className="w-8 h-8" />, href: "/recipes?category=Lanches" },
    { title: "Prato Principal", icon: <Drumstick className="w-8 h-8" />, href: "/recipes?category=Prato Principal" },
    { title: "Sopas e Caldos", icon: <Soup className="w-8 h-8" />, href: "/recipes?category=Sopas e Caldos" },
    { title: "Frutos do Mar", icon: <Fish className="w-8 h-8" />, href: "/recipes?category=Frutos do Mar" },
    { title: "Básicos", icon: <Cookie className="w-8 h-8" />, href: "/recipes?category=Básicos" },
  ];

  const highlights = recipes.slice(0, 4);
  const totalRecipes = recipes.length;

  const bonuses = [
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "E-book 'Técnicas Culinárias'",
      description: "Domine as substituições para garantir sabor e textura perfeitos em suas receitas.",
      actionText: "Acessar Conteúdo",
      href: "/bonus/ebook-tecnicas",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: "Guia 'Desvendando Rótulos'",
      description: "Aprenda a identificar lactose disfarçada e compre com total segurança.",
      actionText: "Acessar Conteúdo",
      href: "/bonus/desvendando-rotulos",
    },
    {
      icon: <ListChecks className="w-8 h-8 text-primary" />,
      title: "Lista de Compras Otimizada",
      description: "Planeje sua semana e gere uma lista de compras a partir das receitas da comunidade.",
      actionText: "Criar Lista",
      href: "/bonus/shopping-list",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-primary" />,
      title: "Comunidade VIP (30 dias)",
      description: "Conecte-se, tire dúvidas com especialistas e receba apoio em um grupo exclusivo.",
      actionText: "Entrar no Grupo",
      href: "https://chat.whatsapp.com/SEU_GRUPO_AQUI",
      isExternal: true,
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
                <Button variant="secondary" className="mt-6" asChild>
                    <Link href="/challenge">
                        Quero Participar <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
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
                    {bonus.isExternal ? (
                       <a href={bonus.href ?? "#"} target="_blank" rel="noopener noreferrer">
                        {bonus.actionText}
                      </a>
                    ) : (
                      <Link href={bonus.href ?? "#"}>{bonus.actionText}</Link>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Categorias */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-headline">
              Receitas <span className="text-lg font-normal text-muted-foreground">({totalRecipes} no total)</span>
            </h2>
             <Button variant="outline" asChild>
                <Link href="/recipes">Ver todas <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
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
          <h2 className="text-2xl font-bold font-headline mb-6">Destaques</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
             {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                   <Card key={index} className="overflow-hidden h-full flex flex-col justify-between">
                     <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                     </CardHeader>
                     <CardContent className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                     </CardContent>
                     <CardFooter className="flex justify-between bg-muted/50 p-4">
                       <Skeleton className="h-5 w-24" />
                       <Skeleton className="h-5 w-20" />
                     </CardFooter>
                   </Card>
                ))
            ) : highlights.map((item) => (
              <Link href={`/recipe/${item.slug}`} key={item.id} className="group">
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
                      Tempo de preparo: <span className="font-medium ml-1 text-foreground">{item.prepTime + item.cookTime} min</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between bg-muted/50 p-4">
                      <div className="flex items-center text-sm">
                          <BarChart3 className="w-4 h-4 mr-2 text-primary" />
                          Dificuldade: <span className="font-medium ml-1">{item.difficulty}</span>
                      </div>
                       <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 mr-2 text-primary" />
                          Serve: <span className="font-medium ml-1">{item.servings} porções</span>
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


'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Utensils, IceCream, WheatOff, Soup, Salad, Cookie, Coffee, Sandwich } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const categories: { name: string; icon: LucideIcon; href: string }[] = [
  { name: 'Pratos Principais', icon: Utensils, href: '/recipes/pratos-principais' },
  { name: 'Sobremesas', icon: IceCream, href: '/recipes/sobremesas' },
  { name: 'Sem Glúten', icon: WheatOff, href: '/recipes/sem-gluten' },
  { name: 'Sopas e Caldos', icon: Soup, href: '/recipes/sopas' },
  { name: 'Saladas', icon: Salad, href: '/recipes/saladas' },
  { name: 'Lanches', icon: Sandwich, href: '/recipes/lanches' },
  { name: 'Biscoitos & Bolos', icon: Cookie, href: '/recipes/biscoitos-bolos' },
  { name: 'Café da Manhã', icon: Coffee, href: '/recipes/cafe-da-manha' },
];

const highlights: { title: string; description: string; imgSrc: string; href: string; dataAiHint: string }[] = [
    { 
        title: 'Top 5 Receitas da Semana', 
        description: 'As receitas mais amadas pela nossa comunidade.', 
        imgSrc: 'https://placehold.co/600x400.png', 
        href: '/ranking/top-recipes',
        dataAiHint: 'top recipes'
    },
    { 
        title: 'Novo Artigo no Blog', 
        description: 'Dicas para uma vida sem lactose mais fácil.', 
        imgSrc: 'https://placehold.co/600x400.png', 
        href: '/blog/new-post',
        dataAiHint: 'healthy food blog'
    },
    { 
        title: 'Chef em Destaque', 
        description: 'Conheça o membro que mais contribuiu este mês.', 
        imgSrc: 'https://placehold.co/600x400.png', 
        href: '/community/chef-highlight',
        dataAiHint: 'professional chef'
    },
    { 
        title: 'Ingrediente do Mês', 
        description: 'Descubra a versatilidade do leite de amêndoas.', 
        imgSrc: 'https://placehold.co/600x400.png', 
        href: '/ingredients/almond-milk',
        dataAiHint: 'almond milk'
    },
];


export default function DashboardPage() {
  const { user } = useAuth();
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Membro';

  return (
    <div className="p-4 sm:p-6 space-y-8">
      {/* Welcome Message */}
      <section>
        <h1 className="text-2xl font-bold text-foreground">
          Bem-vindo(a), {userName}!
        </h1>
        <p className="text-muted-foreground">O que vamos cozinhar hoje?</p>
      </section>

      {/* Challenge Banner */}
      <section>
        <Card className="bg-primary text-primary-foreground overflow-hidden shadow-lg rounded-2xl">
          <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold">Desafio 7 Dias Sem Lactose</h2>
              <p className="mt-1 opacity-90 max-w-lg">
                Aceite o desafio e descubra novas receitas deliciosas e saudáveis para sua rotina.
              </p>
            </div>
            <Button variant="secondary" asChild className="flex-shrink-0 rounded-xl">
              <Link href="/challenge">
                Começar Agora <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </section>

      {/* Categories Section */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Explorar Categorias</h3>
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {categories.map((category) => (
            <Link href={category.href} key={category.name} className="no-underline">
              <div className="flex flex-col items-center justify-center text-center space-y-2 p-2 group">
                <div className="p-4 bg-secondary rounded-full group-hover:bg-accent transition-colors duration-300">
                  <category.icon className="h-6 w-6 sm:h-8 sm:w-8 text-secondary-foreground group-hover:text-accent-foreground" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Highlights Section */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Melhores da Semana</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {highlights.map((highlight) => (
             <Link href={highlight.href} key={highlight.title} className="no-underline">
                <Card className="overflow-hidden group relative h-48 rounded-2xl">
                    <Image
                        src={highlight.imgSrc}
                        alt={highlight.title}
                        fill
                        data-ai-hint={highlight.dataAiHint}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                        <h4 className="text-lg font-bold text-white">{highlight.title}</h4>
                        <p className="text-sm text-white/80">{highlight.description}</p>
                    </div>
                </Card>
             </Link>
          ))}
        </div>
      </section>
    </div>
  );
}


'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { allRecipes } from '@/lib/recipes-data';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { User, Timer, Users, BarChart3, ListFilter } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

type Recipe = {
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

const allCategories = [
    "Todas", "Zero Lactose", "Sem Glúten", "Sobremesas", "Lanches", 
    "Prato Principal", "Sopas e Caldos", "Frutos do Mar", "Básicos"
];

function RecipesPageComponent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category') || 'Todas';
    const [activeFilter, setActiveFilter] = useState<string>(initialCategory);

    const filteredRecipes = useMemo(() => {
        const recipes: Recipe[] = Object.entries(allRecipes).map(([slug, recipe]) => ({
            slug,
            ...recipe,
        }));
        
        if (activeFilter === 'Todas') {
            return recipes;
        }
        return recipes.filter(recipe => 
            recipe.category === activeFilter || recipe.tags.includes(activeFilter)
        );
    }, [activeFilter]);
    
    return (
        <div className="container mx-auto py-8 px-4">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
                    Nossas Receitas
                </h1>
                <p className="mt-4 text-xl text-muted-foreground">
                    Explore um universo de sabores. Filtre por categoria para encontrar o que você ama.
                </p>
            </header>

            <div className="flex flex-col gap-8 md:flex-row">
                <aside className="w-full md:w-1/4 lg:w-1/5">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ListFilter className="h-5 w-5"/>
                                Categorias
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-start space-y-2">
                           {allCategories.map(category => (
                                <Button
                                    key={category}
                                    variant={activeFilter === category ? 'default' : 'ghost'}
                                    onClick={() => setActiveFilter(category)}
                                    className="w-full justify-start"
                                >
                                    {category}
                                </Button>
                           ))}
                        </CardContent>
                    </Card>
                </aside>

                <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                     {filteredRecipes.length > 0 ? (
                        filteredRecipes.map((item) => (
                        <Link href={`/recipe/${item.slug}`} key={item.title} className="group">
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
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10">
                            <h3 className="text-lg font-semibold text-muted-foreground">Nenhuma receita encontrada para esta categoria.</h3>
                            <p className="text-sm text-muted-foreground">Tente selecionar outra categoria.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default function RecipesPage() {
    return (
        <Suspense fallback={<div>Carregando receitas...</div>}>
            <RecipesPageComponent />
        </Suspense>
    )
}

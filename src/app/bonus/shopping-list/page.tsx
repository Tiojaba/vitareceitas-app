
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { ListChecks, ShoppingCart, Sparkles, CheckCircle, Wheat, Sprout, Soup, Fish, Drumstick, Cookie, IceCream, Pizza, ClipboardList } from "lucide-react";
import { allRecipes } from '@/lib/recipes-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

type Recipe = {
    title: string;
    ingredients: { value: string }[];
    category: string;
    tags: string[];
};

type RecipeData = {
    [key: string]: Recipe;
}

type GeneratedList = {
    [key: string]: string[];
}

type FilterType = 'all' | string;

const categories = [
    { name: "Zero Lactose", icon: <Wheat className="mr-2 h-4 w-4" /> },
    { name: "Sem Glúten", icon: <Sprout className="mr-2 h-4 w-4" /> },
    { name: "Sobremesas", icon: <IceCream className="mr-2 h-4 w-4" /> },
    { name: "Lanches", icon: <Pizza className="mr-2 h-4 w-4" /> },
    { name: "Prato Principal", icon: <Drumstick className="mr-2 h-4 w-4" /> },
    { name: "Sopas e Caldos", icon: <Soup className="mr-2 h-4 w-4" /> },
    { name: "Frutos do Mar", icon: <Fish className="mr-2 h-4 w-4" /> },
    { name: "Básicos", icon: <Cookie className="mr-2 h-4 w-4" /> },
];

export default function ShoppingListPage() {
    const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
    const [generatedList, setGeneratedList] = useState<GeneratedList>({});
    const [consolidatedList, setConsolidatedList] = useState<string[]>([]);
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    
    const recipes: RecipeData = allRecipes;
    
    const filteredRecipeKeys = useMemo(() => {
        if (activeFilter === 'all') {
            return Object.keys(recipes);
        }
        return Object.keys(recipes).filter(key => {
            const recipe = recipes[key];
            return recipe.category === activeFilter || recipe.tags.includes(activeFilter as string);
        });
    }, [activeFilter, recipes]);

    const handleCheckboxChange = (recipeKey: string) => {
        setSelectedRecipes(prev => 
            prev.includes(recipeKey)
                ? prev.filter(r => r !== recipeKey)
                : [...prev, recipeKey]
        );
    };

    const generateShoppingList = () => {
        const list: GeneratedList = {};
        const allIngredients = new Set<string>();

        selectedRecipes.forEach(key => {
            const recipe = recipes[key];
            if (recipe) {
                const ingredients = recipe.ingredients.map(ing => ing.value);
                list[recipe.title] = ingredients;
                ingredients.forEach(item => {
                    // Ignora títulos como "Massa:" ou "Cobertura:"
                    if (!item.endsWith(':')) {
                        allIngredients.add(item);
                    }
                });
            }
        });

        setGeneratedList(list);
        setConsolidatedList(Array.from(allIngredients).sort());
    };
    
    const handleFilterChange = (filter: FilterType) => {
        setActiveFilter(filter);
        setSelectedRecipes([]);
    }

    return (
        <div className="container mx-auto max-w-4xl py-8 sm:py-12 px-4">
            <header className="mb-10 text-center">
                <ListChecks className="h-20 w-20 text-primary mx-auto mb-4" />
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
                    Lista de Compras Otimizada
                </h1>
                <p className="mt-4 text-xl text-muted-foreground">
                    Planeje sua semana! Selecione as receitas e gere uma lista de compras consolidada.
                </p>
            </header>

            <main className="space-y-12">
                <Card>
                    <CardHeader>
                        <CardTitle>Passo 1: Selecione suas Receitas</CardTitle>
                        <CardDescription>Filtre por categoria e depois marque as que você planeja cozinhar.</CardDescription>
                         <div className="flex flex-wrap gap-2 pt-4">
                            <Button
                                variant={activeFilter === 'all' ? 'default' : 'outline'}
                                onClick={() => handleFilterChange('all')}
                            >
                                Todas as Receitas
                            </Button>
                            {categories.map((cat) => (
                                <Button
                                    key={cat.name}
                                    variant={activeFilter === cat.name ? 'default' : 'outline'}
                                    onClick={() => handleFilterChange(cat.name)}
                                >
                                    {cat.icon} {cat.name}
                                </Button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredRecipeKeys.length > 0 ? (
                            filteredRecipeKeys.map(key => (
                                <div key={key} className="flex items-center space-x-3 rounded-md border p-4 hover:bg-accent/50 transition-colors">
                                    <Checkbox
                                        id={key}
                                        checked={selectedRecipes.includes(key)}
                                        onCheckedChange={() => handleCheckboxChange(key)}
                                    />
                                    <label
                                        htmlFor={key}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        <Link href={`/recipe/${key}`} className="hover:underline" target="_blank">
                                            {recipes[key].title}
                                        </Link>
                                    </label>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-foreground col-span-full text-center">Nenhuma receita encontrada para esta categoria.</p>
                        )}
                    </CardContent>
                </Card>

                <div className="text-center">
                    <Button
                        size="lg"
                        onClick={generateShoppingList}
                        disabled={selectedRecipes.length === 0}
                    >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Gerar Lista de Compras
                    </Button>
                </div>

                {Object.keys(generatedList).length > 0 && (
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <ShoppingCart className="text-primary h-8 w-8" />
                                Sua Lista de Compras
                            </CardTitle>
                            <CardDescription>
                                Aqui estão os ingredientes que você precisa, organizados por receita e também em uma lista única.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Alert>
                                <AlertTitle>Dica!</AlertTitle>
                                <AlertDescription>
                                    Tire um print ou anote esta lista antes de ir ao supermercado.
                                </AlertDescription>
                            </Alert>
                            <div className="mt-6 space-y-6">
                                {Object.entries(generatedList).map(([recipeTitle, ingredients]) => (
                                    <div key={recipeTitle}>
                                        <h3 className="font-headline text-lg font-semibold text-primary">{recipeTitle}</h3>
                                        <Separator className="my-2" />
                                        <ul className="space-y-2 columns-1 sm:columns-2">
                                            {ingredients.map((item, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <CheckCircle className="h-5 w-5 mt-1 text-green-500 flex-shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                            <Separator className="my-8" />
                            <div>
                                <h3 className="font-headline text-2xl font-semibold text-primary flex items-center gap-3 mb-4">
                                     <ClipboardList className="h-7 w-7" />
                                    Lista Consolidada
                                </h3>
                                <Card className="bg-muted/50 p-4">
                                    <ul className="space-y-2 columns-1 sm:columns-2">
                                        {consolidatedList.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <CheckCircle className="h-5 w-5 mt-1 text-green-500 flex-shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}

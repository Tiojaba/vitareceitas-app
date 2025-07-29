
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { ListChecks, ShoppingCart, Sparkles, CheckCircle } from "lucide-react";
import { allRecipes } from '@/lib/recipes-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

type Recipe = {
    title: string;
    ingredients: { value: string }[];
};

type RecipeData = {
    [key: string]: Recipe;
}

export default function ShoppingListPage() {
    const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
    const [generatedList, setGeneratedList] = useState<string[]>([]);
    
    const recipes: RecipeData = allRecipes;
    const recipeKeys = Object.keys(recipes);

    const handleCheckboxChange = (recipeKey: string) => {
        setSelectedRecipes(prev => 
            prev.includes(recipeKey)
                ? prev.filter(r => r !== recipeKey)
                : [...prev, recipeKey]
        );
    };

    const generateShoppingList = () => {
        const allIngredients = selectedRecipes.flatMap(key => 
            recipes[key].ingredients.map(ing => ing.value)
        );

        // Processar para remover títulos e extrair nomes
        const cleanedIngredients = allIngredients
            .filter(ing => !ing.endsWith(':')) // Remove títulos como "Massa:"
            .map(ing => {
                // Tenta extrair apenas o nome do ingrediente, escapando a barra corretamente
                const match = ing.match(/^((\d+[\s\\/]*\w*[\s\w]*)|(a gosto))\s(de\s)?(.*)/i);
                 if (match && match[5]) {
                    // Capitaliza a primeira letra para agrupar melhor
                    return match[5].charAt(0).toUpperCase() + match[5].slice(1).toLowerCase().trim();
                }
                // Se não conseguir extrair, retorna o original (melhor que nada)
                 return ing.charAt(0).toUpperCase() + ing.slice(1).toLowerCase().trim();
            });

        // Remove duplicatas
        const uniqueIngredients = [...new Set(cleanedIngredients)];
        
        // Ordena alfabeticamente
        uniqueIngredients.sort((a, b) => a.localeCompare(b));

        setGeneratedList(uniqueIngredients);
    };

    return (
        <div className="container mx-auto max-w-4xl py-8 sm:py-12 px-4">
            <header className="mb-10 text-center">
                <ListChecks className="h-20 w-20 text-primary mx-auto mb-4" />
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
                    Lista de Compras Otimizada
                </h1>
                <p className="mt-4 text-xl text-muted-foreground">
                    Planeje sua semana! Selecione as receitas que deseja fazer e gere uma lista de compras consolidada.
                </p>
            </header>

            <main className="space-y-12">
                <Card>
                    <CardHeader>
                        <CardTitle>Passo 1: Selecione suas Receitas</CardTitle>
                        <CardDescription>Marque todas as receitas que você planeja cozinhar.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recipeKeys.map(key => (
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
                        ))}
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

                {generatedList.length > 0 && (
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <ShoppingCart className="text-primary h-8 w-8" />
                                Sua Lista de Compras
                            </CardTitle>
                            <CardDescription>
                                Aqui estão todos os ingredientes que você precisa, organizados e sem duplicatas.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Alert>
                                <AlertTitle>Dica!</AlertTitle>
                                <AlertDescription>
                                    Tire um print ou anote esta lista antes de ir ao supermercado.
                                </AlertDescription>
                            </Alert>
                            <ul className="mt-6 space-y-3 columns-1 sm:columns-2 md:columns-3">
                                {generatedList.map((item, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}

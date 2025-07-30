

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Utensils, Timer, Users, Heart, Lightbulb, CheckCircle, ChefHat } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getRecipeBySlug } from '@/app/actions';

// Tipo para os dados da receita, para garantir consistência
type RecipeData = {
  category: string;
  title: string;
  author: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: { value: string }[];
  instructions: { value: string }[];
  substitutions: string[];
  chefTip: string;
};


export default async function RecipePage({ params }: { params: { slug: string } }) {
  const recipeData = await getRecipeBySlug(params.slug) as RecipeData | null;

  if (!recipeData) {
      notFound();
  }

  // Função simples para extrair quantidade e nome do ingrediente
  const parseIngredient = (ingredient: string) => {
    const match = ingredient.match(/^((\d+[\s\/]*\w*[\s\w]*)|(a gosto))\s(de\s)?(.*)/i);
    if (match) {
      return { amount: match[1] || '', name: match[5] || ingredient };
    }
    return { amount: '', name: ingredient };
  };

  return (
    <div className="container mx-auto max-w-5xl py-8 sm:py-12 px-4">
        <article>
            <header className="mb-8 text-center">
                <Badge variant="secondary" className="mb-4">{recipeData.category}</Badge>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
                    {recipeData.title}
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Uma receita cheia de afeto, por <span className="font-semibold text-primary">{recipeData.author}</span>
                </p>
            </header>
            
             <Card className="mb-8">
                <CardContent className="p-6 text-center text-lg text-muted-foreground italic border-l-4 border-primary bg-muted/30">
                    "{recipeData.description}"
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-8 mb-8 text-center">
                <div className="flex flex-col items-center">
                    <Timer className="w-8 h-8 mb-2 text-primary"/>
                    <h3 className="font-semibold">Tempo de Preparo</h3>
                    <p className="text-muted-foreground">{recipeData.prepTime} minutos</p>
                </div>
                <div className="flex flex-col items-center">
                    <Utensils className="w-8 h-8 mb-2 text-primary"/>
                    <h3 className="font-semibold">Tempo de Cozimento</h3>
                    <p className="text-muted-foreground">{recipeData.cookTime > 0 ? `${recipeData.cookTime} minutos` : 'N/A'}</p>
                </div>
                 <div className="flex flex-col items-center">
                    <Users className="w-8 h-8 mb-2 text-primary"/>
                    <h3 className="font-semibold">Rendimento</h3>
                    <p className="text-muted-foreground">{recipeData.servings} porções</p>
                </div>
            </div>

            <Separator className="my-8" />
            
            <div className="grid lg:grid-cols-3 lg:gap-12">
                <div className="lg:col-span-1 mb-8 lg:mb-0">
                    <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2"><Heart className="text-primary"/>Ingredientes</h2>
                    <ul className="space-y-2">
                        {recipeData.ingredients && recipeData.ingredients.map((ing: { value: string }, index: number) => {
                           // Regra para não processar títulos como "Massa:"
                           if (ing.value.endsWith(':')) {
                                return <li key={index}><strong className="text-primary font-headline mt-2 block">{ing.value}</strong></li>
                           }
                           const { amount, name } = parseIngredient(ing.value);
                           return (
                             <li key={index} className="flex">
                                <CheckCircle className="w-5 h-5 mr-3 mt-1 text-primary flex-shrink-0" />
                                <span><span className="font-semibold">{amount}</span> {name}</span>
                            </li>
                           )
                        })}
                    </ul>
                </div>
                <div className="lg:col-span-2">
                     <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2"><Utensils className="text-primary"/>Modo de Preparo</h2>
                     <ol className="space-y-6">
                        {recipeData.instructions && recipeData.instructions.map((step: { value: string }, index: number) => (
                            <li key={index} className="flex">
                                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0">{index + 1}</div>
                                <p className="flex-1 text-muted-foreground">{step.value}</p>
                            </li>
                        ))}
                     </ol>
                </div>
            </div>

            <Separator className="my-8" />

            <div className="grid md:grid-cols-2 gap-8">
                {recipeData.substitutions && recipeData.substitutions.length > 0 && (
                    <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle className="font-headline">Dicas de Substituição</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                {recipeData.substitutions.map((sub: string, index: number) => <li key={index} dangerouslySetInnerHTML={{ __html: sub.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />)}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}
                 {recipeData.chefTip && (
                    <Alert variant="destructive" className="bg-primary/10 border-primary/40 text-primary">
                        <ChefHat className="h-4 w-4 !text-primary" />
                        <AlertTitle className="font-headline !text-primary">Dica do(a) Chef {recipeData.author}</AlertTitle>
                        <AlertDescription className="!text-primary/80">
                        {recipeData.chefTip}
                        </AlertDescription>
                    </Alert>
                 )}
            </div>
        </article>
    </div>
  );
}

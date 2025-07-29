
import { RecipeForm } from "@/components/recipe-form";
import { Logo } from "@/components/logo";
import { ChefHat } from "lucide-react";


export default function SubmitRecipePage() {
  return (
    <div className="container mx-auto max-w-3xl py-8 sm:py-12 px-4">
      <header className="flex flex-col items-center text-center mb-10">
        <ChefHat className="h-16 w-16 mb-4 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
          Compartilhar Receita
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          Preencha os campos abaixo para adicionar sua receita à nossa comunidade.
        </p>
      </header>
       <RecipeForm />
    </div>
  );
}

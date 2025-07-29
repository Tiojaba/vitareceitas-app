import { SubmitRecipeForm } from "@/components/submit-recipe-form";
import { Suspense } from "react";
import { BookUp } from "lucide-react";

function SubmitRecipeFallback() {
  return <div>Carregando formulário...</div>
}

export default function SubmitRecipePage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 sm:py-12 px-4">
      <header className="flex flex-col items-center text-center mb-10">
        <BookUp className="h-16 w-16 mb-4 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
          Compartilhe sua Receita
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          Preencha os campos abaixo para adicionar sua receita à nossa comunidade. Ajude-nos a crescer!
        </p>
      </header>
       <Suspense fallback={<SubmitRecipeFallback />}>
        <SubmitRecipeForm />
      </Suspense>
    </div>
  );
}
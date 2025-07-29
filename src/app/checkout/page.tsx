
import { CheckoutForm } from "@/components/checkout-form";
import { Suspense } from "react";
import { Leaf } from "lucide-react";

function CheckoutFormFallback() {
  return <div>Carregando formulário...</div>
}

export default function CheckoutPage() {
  return (
    <div className="container mx-auto max-w-2xl py-8 sm:py-12 px-4">
      <header className="flex flex-col items-center text-center mb-10">
        <Leaf className="h-16 w-16 mb-4 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
          Finalizar Compra com PIX
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          Complete os dados abaixo para gerar o código PIX para pagamento.
        </p>
      </header>
       <Suspense fallback={<CheckoutFormFallback />}>
        <CheckoutForm />
      </Suspense>
    </div>
  );
}

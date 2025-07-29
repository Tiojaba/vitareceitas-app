
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogIn, ShoppingCart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center p-8">
        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl font-headline mb-6">
          Bem-vindo ao ConisoPay
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          Acesse sua conta ou realize um pagamento de forma rápida e segura.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild>
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" /> Entrar
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/checkout">
              <ShoppingCart className="mr-2 h-4 w-4" /> Fazer Pagamento
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

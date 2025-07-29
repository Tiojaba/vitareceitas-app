
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogIn, Leaf } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center p-8">
        <Leaf className="h-20 w-20 text-primary mx-auto mb-6" />
        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl font-headline mb-6">
          VitaReceitas
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          Descubra e compartilhe receitas deliciosas, saudáveis e cheias de sabor. Junte-se a nós!
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href="/login">
              <LogIn className="mr-2 h-5 w-5" /> Acessar Comunidade
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

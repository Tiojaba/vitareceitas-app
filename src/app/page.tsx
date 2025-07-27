import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const includedFeatures = [
  'Acesso vitalício ao conteúdo',
  'Suporte prioritário por e-mail',
  'Acesso a comunidade exclusiva',
  'Certificado de conclusão',
]

export default function HomePage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto max-w-6xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="order-2 md:order-1">
            <Card className="shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold font-headline tracking-tight">Ebook de Culinária Avançada</CardTitle>
                <CardDescription>Domine as técnicas dos grandes chefs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-4xl font-bold text-center">
                    R$ 49,99
                    <span className="text-base font-normal text-muted-foreground"> / pagamento único</span>
                  </p>
                </div>
                <ul className="space-y-3 text-sm">
                  {includedFeatures.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-accent shrink-0 mr-2" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full text-lg py-6">
                  <Link href="/checkout">Comprar Agora</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="order-1 md:order-2 space-y-4">
            <div className="aspect-video overflow-hidden rounded-xl shadow-2xl">
                <Image
                    data-ai-hint="ebook cover kitchen"
                    alt="Capa do Ebook de Culinária"
                    className="w-full h-full object-cover"
                    src="https://placehold.co/600x400.png"
                    width={600}
                    height={400}
                />
            </div>
            <div className="text-center md:text-left">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl font-headline">
                    Transforme sua Cozinha.
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Este não é apenas um livro de receitas. É um curso completo que o levará do básico ao avançado, ensinando os segredos da culinária profissional no conforto da sua casa.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

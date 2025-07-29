import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ShieldCheck, Search, Info, CheckCircle, Wheat, MilkOff, LifeBuoy, Vegan, Pill } from "lucide-react"

export default function LabelsGuidePage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 sm:py-12 px-4">
      <header className="mb-10 text-center">
        <ShieldCheck className="h-20 w-20 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
          Guia Definitivo: Desvendando Rótulos e Ingredientes
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Sua bússola para compras seguras, sem ansiedade e com total confiança.
        </p>
      </header>

      <article className="prose prose-lg max-w-none dark:prose-invert">
        <section className="mb-12">
          <p className="lead text-lg">
            "Será que posso comer isso?" — Se você já se fez essa pergunta segurando um produto no supermercado, este guia é para você. A lactose e os derivados do leite se escondem nos lugares mais inesperados. Vamos aprender a encontrá-los e a fazer escolhas com total segurança.
          </p>
        </section>

        <Card className="mb-12">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Search className="h-6 w-6"/> As Palavras-Chave do Detetive
                </CardTitle>
                <CardDescription>
                    O primeiro passo é saber o que procurar. Além de "leite", fique de olho nestes termos na lista de ingredientes:
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md"><MilkOff className="h-5 w-5 text-primary flex-shrink-0" /><span>Lactose</span></div>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md"><MilkOff className="h-5 w-5 text-primary flex-shrink-0" /><span>Soro de leite</span></div>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md"><MilkOff className="h-5 w-5 text-primary flex-shrink-0" /><span>Caseína</span></div>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md"><MilkOff className="h-5 w-5 text-primary flex-shrink-0" /><span>Caseinato</span></div>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md"><MilkOff className="h-5 w-5 text-primary flex-shrink-0" /><span>Lactoglobulina</span></div>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md"><MilkOff className="h-5 w-5 text-primary flex-shrink-0" /><span>Gordura de leite</span></div>
            </CardContent>
        </Card>

        <section className="mb-12">
          <h2 className="font-headline text-3xl mb-4">Atenção à Declaração de Alergênicos</h2>
          <p>Por lei, no Brasil, os rótulos precisam destacar os principais alergênicos. Esta é sua maior aliada. Procure sempre por uma frase em negrito, geralmente após a lista de ingredientes.</p>
          
          <div className="space-y-4 mt-6">
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/40 text-destructive">
              <Info className="h-4 w-4 !text-destructive" />
              <AlertTitle className="font-headline !text-destructive">"ALÉRGICOS: CONTÉM LEITE E DERIVADOS."</AlertTitle>
              <AlertDescription className="!text-destructive/80">
                <p>Se encontrar esta frase, o produto **não é seguro**. Ele contém ingredientes à base de leite.</p>
              </AlertDescription>
            </Alert>
             <Alert className="bg-primary/10 border-primary/40 text-primary">
              <CheckCircle className="h-4 w-4 !text-primary" />
              <AlertTitle className="font-headline !text-primary">"ALÉRGICOS: PODE CONTER LEITE."</AlertTitle>
              <AlertDescription className="!text-primary/80">
                <p>Isso indica **risco de contaminação cruzada**. O produto não tem leite como ingrediente, mas é fabricado em equipamentos que também processam produtos com leite.</p>
                <p className="mt-2 font-semibold">**Diferença Crucial:**</p>
                <ul className="list-disc pl-5">
                    <li>**Para Intolerantes à Lactose:** Geralmente é seguro, pois a quantidade de lactose por contaminação é mínima.</li>
                    <li>**Para Alérgicos à Proteína do Leite (APLV):** **NÃO É SEGURO!** A alergia é uma reação do sistema imunológico a proteínas, e mesmo traços podem ser perigosos.</li>
                </ul>
              </AlertDescription>
            </Alert>
             <Alert className="bg-green-600/10 border-green-600/40 text-green-700">
              <ShieldCheck className="h-4 w-4 !text-green-700" />
              <AlertTitle className="font-headline !text-green-700">"NÃO CONTÉM LACTOSE" ou "ZERO LACTOSE"</AlertTitle>
              <AlertDescription className="!text-green-700/80">
                <p>Este é o selo de segurança máximo para intolerantes. Significa que o produto é seguro ou que a enzima lactase foi adicionada para quebrar a lactose. **Atenção APLV:** Mesmo "zero lactose", o produto pode conter as proteínas do leite, então sempre verifique se ele também diz "não contém derivados de leite".</p>
              </AlertDescription>
            </Alert>
          </div>
        </section>

        <Separator className="my-12" />

        <section className="mb-12">
            <h2 className="font-headline text-3xl mb-4">Ingredientes "Pega-Ratinha" (Que São Seguros!)</h2>
            <p>Alguns ingredientes têm nomes que assustam, mas não têm relação com o leite. Não precisa temê-los!</p>
            <Card className="mt-6">
                 <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="font-semibold">Ácido Lático</h4>
                            <p className="text-sm text-muted-foreground">Apesar do nome, não vem do leite. É obtido pela fermentação de açúcares (como os de milho ou beterraba) e é seguro.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="font-semibold">Lactato de Sódio</h4>
                            <p className="text-sm text-muted-foreground">É um sal derivado do ácido lático. Também é seguro e não contém lactose.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="font-semibold">Manteiga de Cacau</h4>
                            <p className="text-sm text-muted-foreground">É a gordura natural da semente de cacau. Totalmente vegetal e segura. Cuidado apenas com chocolates que adicionam leite à fórmula (verifique sempre o rótulo!).</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <Wheat className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="font-semibold">E o glúten?</h4>
                            <p className="text-sm text-muted-foreground">Glúten e lactose são coisas diferentes. Um produto pode ser "Sem Glúten", mas conter lactose, e vice-versa. Sempre verifique os dois se tiver ambas as restrições.</p>
                        </div>
                    </div>
                 </CardContent>
            </Card>
        </section>

        <Separator className="my-12" />

         <section>
            <h2 className="font-headline text-3xl mb-4">Dicas Práticas do Detetive</h2>
            <p>Com o tempo, você se tornará um(a) expert. Aqui estão alguns atalhos e pontos de atenção para o dia a dia:</p>
            <div className="space-y-6 mt-6">
                 <Card>
                    <CardHeader className="flex-row items-center gap-4 space-y-0">
                        <LifeBuoy className="h-10 w-10 text-primary flex-shrink-0" />
                        <div>
                            <CardTitle>Lactose Onde Você Menos Espera</CardTitle>
                            <CardDescription>Fique atento a presunto, peito de peru, salsichas, molhos prontos, sopas instantâneas e até mesmo alguns pães de forma. O soro de leite é frequentemente usado como um aditivo para dar liga e textura.</CardDescription>
                        </div>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="flex-row items-center gap-4 space-y-0">
                        <Vegan className="h-10 w-10 text-green-600 flex-shrink-0" />
                        <div>
                            <CardTitle>O Atalho Vegano</CardTitle>
                            <CardDescription>Se um produto tem um selo de certificação "Vegano", pode comprar com tranquilidade. Produtos veganos, por definição, não contêm nenhum ingrediente de origem animal, incluindo leite e seus derivados.</CardDescription>
                        </div>
                    </CardHeader>
                </Card>
                 <Card>
                    <CardHeader className="flex-row items-center gap-4 space-y-0">
                        <Pill className="h-10 w-10 text-destructive flex-shrink-0" />
                        <div>
                            <CardTitle>Atenção aos Medicamentos</CardTitle>
                            <CardDescription>Sim, até remédios podem conter lactose! Ela é usada como excipiente (um ingrediente inativo) em muitos comprimidos e cápsulas. Sempre verifique a bula na seção "Composição" ou pergunte ao seu médico ou farmacêutico.</CardDescription>
                        </div>
                    </CardHeader>
                </Card>
            </div>
        </section>

      </article>
    </div>
  )
}

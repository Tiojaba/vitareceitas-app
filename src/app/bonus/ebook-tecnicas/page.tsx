
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BookOpen, ChevronsRight, GitCommit, Lightbulb, MilkOff } from "lucide-react"

export default function EbookPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 sm:py-12 px-4">
      <header className="mb-10 text-center">
        <BookOpen className="h-20 w-20 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
          E-book: Técnicas Culinárias Zero Lactose
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          O Segredo do Sabor e Textura
        </p>
      </header>

      <article className="prose prose-lg max-w-none dark:prose-invert">
        <section className="mb-12">
          <p className="lead text-lg">
            Bem-vindo(a) ao seu guia definitivo para uma cozinha zero lactose sem sacrifícios! Sabemos que o medo de receitas que "desandam" ou a frustração de perder o sabor e a textura originais são os maiores desafios. Este e-book foi criado para atacar exatamente essas dores, transformando você em um(a) mestre das substituições.
          </p>
        </section>

        <Card className="mb-12">
            <CardHeader>
                <CardTitle className="font-headline">Os 3 Pilares da Culinária Zero Lactose</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                    <MilkOff className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold">1. Entender a Função do Laticínio</h3>
                        <p className="text-muted-foreground">O leite não é só líquido. Ele adiciona gordura, proteína e açúcar (lactose). Entender isso é o primeiro passo para encontrar o substituto perfeito.</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <ChevronsRight className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold">2. Combinar Ingredientes</h3>
                        <p className="text-muted-foreground">Raramente um único substituto resolve tudo. Aprenda a combinar bebidas vegetais, gorduras e espessantes para replicar a cremosidade e a estrutura dos laticínios.</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <GitCommit className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold">3. Ajustar a Receita</h3>
                        <p className="text-muted-foreground">Ao substituir, às vezes é preciso ajustar a quantidade de líquidos, o tempo de forno ou a acidez. Não tenha medo de testar!</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <section className="mb-12">
          <h2 className="font-headline text-3xl mb-4">Capítulo 1: O Desafio do Queijo</h2>
          <p>Ah, o queijo! O ingrediente que mais causa saudades. Aquele queijo derretido, o sabor salgadinho, a textura... como replicar? O segredo está na combinação de um 'corpo' (a base), um 'sabor' (umami) e uma 'gordura'.</p>
          
          <div className="space-y-4 mt-6">
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle className="font-headline">A Base Perfeita</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 mt-2">
                  <li><strong>Castanha de Caju:</strong> Deixada de molho e batida, cria uma base incrivelmente cremosa, ideal para "requeijão" ou "cheddar" cremoso.</li>
                  <li><strong>Batata e Mandioquinha:</strong> Cozidas e amassadas, formam a base elástica para queijos que derretem, como o de um pão de queijo ou pizza.</li>
                  <li><strong>Tofu:</strong> Prensado e bem temperado, é uma base firme excelente para queijos fatiados ou esfarelados, como "minas frescal" ou "feta".</li>
                </ul>
              </AlertDescription>
            </Alert>
            <Alert variant="destructive" className="bg-primary/10 border-primary/40 text-primary">
              <Lightbulb className="h-4 w-4 !text-primary" />
              <AlertTitle className="font-headline !text-primary">O Sabor Umami</AlertTitle>
              <AlertDescription className="!text-primary/80">
                <p>Para dar aquele "gostinho de queijo", use <strong>levedura nutricional</strong>. Ela é rica em vitaminas do complexo B e tem um sabor que lembra queijo parmesão. Outros aliados são missô (pasta de soja), alho em pó e uma gota de fumaça líquida.</p>
              </AlertDescription>
            </Alert>
          </div>
        </section>

        <Separator className="my-12" />

        <section className="mb-12">
            <h2 className="font-headline text-3xl mb-4">Capítulo 2: Bolos e Sobremesas Fofinhas</h2>
            <p>O pesadelo de todo confeiteiro iniciante na cozinha zero lactose é um bolo solado ou um creme que não engrossa. A função dos laticínios aqui é crucial para a estrutura e umidade. Mas tudo tem solução!</p>

             <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Tabela Rápida de Substituições para Confeitaria</CardTitle>
                    <CardDescription>Use como ponto de partida para suas receitas doces.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-2 text-left font-semibold">Laticínio Original</th>
                                    <th className="p-2 text-left font-semibold">Melhor Substituto Zero Lactose</th>
                                    <th className="p-2 text-left font-semibold">Dica de Ouro</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="p-2">Leite de Vaca</td>
                                    <td className="p-2">Bebida de Aveia ou Amêndoas</td>
                                    <td className="p-2">Para bolos, adicione 1 colher de chá de vinagre de maçã ao leite vegetal para simular o "buttermilk". Deixa a massa mais fofa!</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="p-2">Manteiga</td>
                                    <td className="p-2">Margarina vegetal de boa qualidade (em tablete) ou Óleo de Coco</td>
                                    <td className="p-2">Para massas que precisam de aeração (como bolos), a margarina é melhor. Para biscoitos, o óleo de coco gelado funciona bem.</td>
                                </tr>
                                <tr>
                                    <td className="p-2">Creme de Leite</td>
                                    <td className="p-2">Leite de coco (de latinha, a parte sólida) ou Creme de Castanha de Caju</td>
                                    <td className="p-2">Para mousses e ganaches, o leite de coco de latinha gelado é imbatível. Deixe a lata na geladeira e use apenas a parte cremosa de cima.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </section>

        <Separator className="my-12" />

         <section>
          <h2 className="font-headline text-3xl mb-4">Dúvidas Frequentes (FAQ)</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Minha receita ficou com gosto de coco/castanha. Como evitar?</AccordionTrigger>
                <AccordionContent>
                  Isso acontece quando o sabor do substituto se sobressai. Para o leite de coco, prefira os de latinha e use em receitas com sabores fortes (como chocolate ou curry). Para as castanhas, deixe-as de molho por pelo menos 8 horas em água quente e descarte a água. Isso neutraliza muito o sabor. Bebidas vegetais como a de aveia são mais neutras.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Posso usar qualquer bebida vegetal para substituir o leite na mesma proporção?</AccordionTrigger>
                <AccordionContent>
                  Em 90% dos casos, sim (1:1). A exceção são as bebidas muito ralas (como algumas de arroz) ou muito doces. Dê preferência às versões "barista" ou "original" sem adição de açúcar para ter mais controle sobre o resultado final.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Como faço para um molho branco ficar cremoso sem creme de leite ou queijo?</AccordionTrigger>
                <AccordionContent>
                  O segredo é um bom "roux" e um espessante. Faça uma base refogando alho e cebola em azeite ou margarina vegetal. Adicione farinha de trigo (ou amido de milho) e cozinhe por um minuto. Aos poucos, adicione uma bebida vegetal (a de castanha de caju é perfeita aqui!), mexendo sem parar com um fouet. Tempere com sal, pimenta, noz-moscada e, para o toque final, uma colher de levedura nutricional. Fica divino!
                </AccordionContent>
              </AccordionItem>
            </Accordion>
         </section>
      </article>
    </div>
  )
}

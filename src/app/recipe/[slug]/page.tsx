
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Utensils, Timer, Users, Heart, Lightbulb, CheckCircle, ChefHat } from 'lucide-react';

// No futuro, estes dados virão do Firestore.
// Por enquanto, são um exemplo estático.
const recipeData = {
    title: "Moqueca de Banana-da-Terra (Vegana e Aconchegante)",
    author: "Ana G.",
    description: "Essa receita tem um lugar especial no meu coração. É a minha versão vegana da moqueca que minha avó baiana fazia. O cheiro do azeite de dendê e do leite de coco cozinhando me transporta direto para a cozinha dela. É um prato que abraça, perfeito para um almoço de domingo em família ou para aquecer a alma num dia chuvoso. Espero que vocês sintam o mesmo carinho que eu coloco em cada panela!",
    image: {
        src: "https://placehold.co/1200x600.png",
        dataAiHint: "banana moqueca",
    },
    prepTime: "20 minutos",
    cookTime: "25 minutos",
    servings: "4 pessoas",
    category: "Zero Lactose",
    tags: ["Vegano", "Sem Glúten", "Prato Principal", "Confort Food"],
    ingredients: [
        { amount: "2 colheres de sopa", name: "de azeite de oliva" },
        { amount: "1", name: "cebola grande, picada" },
        { amount: "1", name: "pimentão vermelho, sem sementes, em tiras" },
        { amount: "1", name: "pimentão amarelo, sem sementes, em tiras" },
        { amount: "3 dentes", name: "de alho, picados" },
        { amount: "1", name: "pimenta dedo-de-moça, sem sementes, picadinha (opcional)" },
        { amount: "2", name: "tomates maduros, sem pele e sementes, picados" },
        { amount: "4", name: "bananas-da-terra não muito maduras, em rodelas grossas" },
        { amount: "400ml", name: "de leite de coco (de garrafinha, se possível)" },
        { amount: "2 colheres de sopa", name: "de azeite de dendê" },
        { amount: "1/2 xícara", name: "de coentro fresco picado" },
        { amount: "1/2 xícara", name: "de cebolinha fresca picada" },
        { amount: "", name: "Sal e pimenta do reino a gosto" },
    ],
    instructions: [
        "Em uma panela de barro ou uma panela grande e funda, aqueça o azeite de oliva em fogo médio. Refogue a cebola e o alho até ficarem translúcidos e perfumados.",
        "Adicione os pimentões e a pimenta dedo-de-moça (se estiver usando). Cozinhe por cerca de 5 minutos, até que comecem a amaciar.",
        "Acrescente os tomates picados e refogue por mais alguns minutos, até que comecem a desmanchar e formar um molho.",
        "Com cuidado, arrume as rodelas de banana-da-terra sobre o refogado, formando uma camada única. Tempere com sal e pimenta do reino.",
        "Despeje o leite de coco sobre as bananas, garantindo que todas fiquem submersas. Reduza o fogo para o mínimo, tampe a panela e cozinhe por cerca de 15 a 20 minutos, ou até que as bananas estejam bem macias, mas sem desmanchar.",
        "Nos últimos 5 minutos, regue com o azeite de dendê, misturando delicadamente para incorporar a cor e o sabor. Tenha cuidado para não quebrar as bananas.",
        "Desligue o fogo, salpique o coentro e a cebolinha por cima. Sirva imediatamente, bem quentinho.",
    ],
    substitutions: [
        "**Banana-da-terra:** Se não encontrar, você pode usar palmito pupunha em rodelas. O sabor muda, mas a textura fica incrível!",
        "**Azeite de dendê:** É o coração da moqueca, mas se você não gostar ou não encontrar, pode omitir ou usar uma colher de chá de colorau para dar cor.",
        "**Coentro:** Eu amo, mas sei que é polêmico! Pode substituir por salsinha, sem problemas.",
    ],
    chefTip: "O segredo para uma banana-da-terra perfeita na moqueca é o ponto de maturação. Escolha bananas que estejam firmes, com a casca amarela e algumas manchas pretas, mas não completamente preta. Se estiver muito verde, ficará dura; se estiver muito madura, vai desmanchar e deixar o caldo doce demais. O equilíbrio é a chave!",
}


export default function RecipePage() {
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

            <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden mb-8 shadow-lg">
                <Image
                    src={recipeData.image.src}
                    alt={recipeData.title}
                    data-ai-hint={recipeData.image.dataAiHint}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            
             <Card className="mb-8">
                <CardContent className="p-6 text-center text-lg text-muted-foreground italic border-l-4 border-primary bg-muted/30">
                    "{recipeData.description}"
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-8 mb-8 text-center">
                <div className="flex flex-col items-center">
                    <Timer className="w-8 h-8 mb-2 text-primary"/>
                    <h3 className="font-semibold">Tempo de Preparo</h3>
                    <p className="text-muted-foreground">{recipeData.prepTime}</p>
                </div>
                <div className="flex flex-col items-center">
                    <Utensils className="w-8 h-8 mb-2 text-primary"/>
                    <h3 className="font-semibold">Tempo de Cozimento</h3>
                    <p className="text-muted-foreground">{recipeData.cookTime}</p>
                </div>
                 <div className="flex flex-col items-center">
                    <Users className="w-8 h-8 mb-2 text-primary"/>
                    <h3 className="font-semibold">Rendimento</h3>
                    <p className="text-muted-foreground">{recipeData.servings}</p>
                </div>
            </div>

            <Separator className="my-8" />
            
            <div className="grid lg:grid-cols-3 lg:gap-12">
                <div className="lg:col-span-1 mb-8 lg:mb-0">
                    <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2"><Heart className="text-primary"/>Ingredientes</h2>
                    <ul className="space-y-2">
                        {recipeData.ingredients.map((ing, index) => (
                            <li key={index} className="flex">
                                <CheckCircle className="w-5 h-5 mr-3 mt-1 text-primary flex-shrink-0" />
                                <span><span className="font-semibold">{ing.amount}</span> {ing.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="lg:col-span-2">
                     <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2"><Utensils className="text-primary"/>Modo de Preparo</h2>
                     <ol className="space-y-6">
                        {recipeData.instructions.map((step, index) => (
                            <li key={index} className="flex">
                                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0">{index + 1}</div>
                                <p className="flex-1 text-muted-foreground">{step}</p>
                            </li>
                        ))}
                     </ol>
                </div>
            </div>

            <Separator className="my-8" />

            <div className="grid md:grid-cols-2 gap-8">
                <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle className="font-headline">Dicas de Substituição</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            {recipeData.substitutions.map((sub, index) => <li key={index}>{sub}</li>)}
                        </ul>
                    </AlertDescription>
                </Alert>
                 <Alert variant="destructive" className="bg-primary/10 border-primary/40 text-primary">
                    <ChefHat className="h-4 w-4 !text-primary" />
                    <AlertTitle className="font-headline !text-primary">Dica da Chef {recipeData.author}</AlertTitle>
                    <AlertDescription className="!text-primary/80">
                       {recipeData.chefTip}
                    </AlertDescription>
                </Alert>
            </div>
        </article>
    </div>
  );
}

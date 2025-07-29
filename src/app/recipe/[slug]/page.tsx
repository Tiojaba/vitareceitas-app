

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Utensils, Timer, Users, Heart, Lightbulb, CheckCircle, ChefHat } from 'lucide-react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase-admin';

// No futuro, estes dados virão do Firestore.
// Por enquanto, são um exemplo estático.
const allRecipes: { [key: string]: any } = {
  'moqueca-de-banana-da-terra': {
    title: "Moqueca de Banana-da-Terra (Vegana e Aconchegante)",
    author: "Ana G.",
    description: "Essa receita tem um lugar especial no meu coração. É a minha versão vegana da moqueca que minha avó baiana fazia. O cheiro do azeite de dendê e do leite de coco cozinhando me transporta direto para a cozinha dela. É um prato que abraça, perfeito para um almoço de domingo em família ou para aquecer a alma num dia chuvoso. Espero que vocês sintam o mesmo carinho que eu coloco em cada panela!",
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    category: "Zero Lactose",
    tags: ["Vegano", "Sem Glúten", "Prato Principal", "Confort Food"],
    ingredients: [
        { value: "2 colheres de sopa de azeite de oliva" },
        { value: "1 cebola grande, picada" },
        { value: "1 pimentão vermelho, sem sementes, em tiras" },
        { value: "1 pimentão amarelo, sem sementes, em tiras" },
        { value: "3 dentes de alho, picados" },
        { value: "1 pimenta dedo-de-moça, sem sementes, picadinha (opcional)" },
        { value: "2 tomates maduros, sem pele e sementes, picados" },
        { value: "4 bananas-da-terra não muito maduras, em rodelas grossas" },
        { value: "400ml de leite de coco (de garrafinha, se possível)" },
        { value: "2 colheres de sopa de azeite de dendê" },
        { value: "1/2 xícara de coentro fresco picado" },
        { value: "1/2 xícara de cebolinha fresca picada" },
        { value: "Sal e pimenta do reino a gosto" },
    ],
    instructions: [
        { value: "Em uma panela de barro ou uma panela grande e funda, aqueça o azeite de oliva em fogo médio. Refogue a cebola e o alho até ficarem translúcidos e perfumados." },
        { value: "Adicione os pimentões e a pimenta dedo-de-moça (se estiver usando). Cozinhe por cerca de 5 minutos, até que comecem a amaciar." },
        { value: "Acrescente os tomates picados e refogue por mais alguns minutos, até que comecem a desmanchar e formar um molho." },
        { value: "Com cuidado, arrume as rodelas de banana-da-terra sobre o refogado, formando uma camada única. Tempere com sal e pimenta do reino." },
        { value: "Despeje o leite de coco sobre as bananas, garantindo que todas fiquem submersas. Reduza o fogo para o mínimo, tampe a panela e cozinhe por cerca de 15 a 20 minutos, ou até que as bananas estejam bem macias, mas sem desmanchar." },
        { value: "Nos últimos 5 minutos, regue com o azeite de dendê, misturando delicadamente para incorporar a cor e o sabor. Tenha cuidado para não quebrar as bananas." },
        { value: "Desligue o fogo, salpique o coentro e a cebolinha por cima. Sirva imediatamente, bem quentinho." },
    ],
    substitutions: [
        "**Banana-da-terra:** Se não encontrar, você pode usar palmito pupunha em rodelas. O sabor muda, mas a textura fica incrível!",
        "**Azeite de dendê:** É o coração da moqueca, mas se você não gostar ou não encontrar, pode omitir ou usar uma colher de chá de colorau para dar cor.",
        "**Coentro:** Eu amo, mas sei que é polêmico! Pode substituir por salsinha, sem problemas.",
    ],
    chefTip: "O segredo para uma banana-da-terra perfeita na moqueca é o ponto de maturação. Escolha bananas que estejam firmes, com a casca amarela e algumas manchas pretas, mas não completamente preta. Se estiver muito verde, ficará dura; se estiver muito madura, vai desmanchar e deixar o caldo doce demais. O equilíbrio é a chave!",
  },
  'bolo-de-cenoura-fofinho': {
    title: "Bolo de Cenoura Fofinho (Zero Lactose)",
    author: "Mariana S.",
    description: "Quem disse que bolo de cenoura precisa de leite? Essa receita é a prova de que é possível ter um bolo super fofinho, molhadinho e com uma cobertura de chocolate cremosa sem usar nenhum laticínio. É a receita que faço para todos os aniversários aqui em casa e ninguém nunca diz que é 'diferente'. É simplesmente... o melhor bolo de cenoura!",
    prepTime: 20,
    cookTime: 40,
    servings: 8,
    category: "Sobremesa",
    tags: ["Zero Lactose", "Sobremesa", "Bolo"],
    ingredients: [
        { value: "Massa:" },
        { value: "3 cenouras médias, descascadas e picadas" },
        { value: "3 ovos" },
        { value: "1 xícara de óleo vegetal (girassol, canola)" },
        { value: "2 xícaras de açúcar" },
        { value: "2 xícaras de farinha de trigo" },
        { value: "1 colher de sopa de fermento em pó" },
        { value: "Cobertura:" },
        { value: "1 xícara de bebida vegetal (aveia ou amêndoas)" },
        { value: "4 colheres de sopa de chocolate em pó (50% cacau)" },
        { value: "2 colheres de sopa de açúcar" },
        { value: "1 colher de sopa de margarina vegetal sem leite" },
    ],
    instructions: [
        { value: "Pré-aqueça o forno a 180°C. Unte e enfarinhe uma forma de buraco no meio." },
        { value: "No liquidificador, bata as cenouras, os ovos e o óleo até obter uma mistura homogênea e cremosa." },
        { value: "Em uma tigela grande, misture a farinha e o açúcar. Despeje a mistura do liquidificador sobre os secos e mexa bem com um fouet ou espátula até incorporar. Não bata demais." },
        { value: "Adicione o fermento em pó e misture delicadamente." },
        { value: "Despeje a massa na forma preparada e leve ao forno por cerca de 35-40 minutos, ou até que, ao espetar um palito, ele saia limpo." },
        { value: "Enquanto o bolo assa, prepare a cobertura. Em uma panela, misture a bebida vegetal, o chocolate em pó, o açúcar e a margarina." },
        { value: "Leve ao fogo médio, mexendo sempre, até a calda engrossar um pouco (cerca de 5-8 minutos). Ela vai encorpar mais depois de fria." },
        { value: "Desenforme o bolo ainda morno e despeje a cobertura quente por cima. Deixe esfriar antes de servir." },
    ],
    substitutions: [
        "**Ovos:** Para uma versão vegana, substitua os 3 ovos por 3 'ovos de linhaça' (3 colheres de sopa de farinha de linhaça + 9 colheres de sopa de água, deixar descansar 10 min).",
        "**Farinha de Trigo:** Pode usar uma mistura de farinha sem glúten na mesma proporção, mas a textura pode mudar um pouco.",
        "**Açúcar:** Pode ser substituído por açúcar demerara ou mascavo, o que deixará o bolo um pouco mais escuro e úmido.",
    ],
    chefTip: "O grande segredo para um bolo de cenoura fofinho é não bater a farinha no liquidificador. A farinha deve ser incorporada à mão, delicadamente. Isso evita que o glúten se desenvolva em excesso, o que deixaria o bolo pesado e 'borrachudo'. Mexa apenas o suficiente para a massa ficar homogênea!",
  },
  'pao-de-queijo-vegano': {
    title: "Pão de Queijo Vegano (com Batata!)",
    author: "Carlos L.",
    description: "Sempre fui louco por pão de queijo, e quando descobri a intolerância à lactose, achei que nunca mais comeria. Depois de muitos testes, cheguei a essa receita que, para mim, é perfeita! A batata entra para dar a maciez e a 'puxa-puxa' que o queijo daria, e o polvilho faz toda a mágica do sabor. É ótimo para o café da tarde ou para receber amigos.",
    prepTime: 20,
    cookTime: 20,
    servings: 16,
    category: "Lanche",
    tags: ["Sem Glúten", "Vegano", "Lanche"],
    ingredients: [
        { value: "2 xícaras de polvilho doce" },
        { value: "1 xícara de polvilho azedo" },
        { value: "1/2 xícara de óleo vegetal" },
        { value: "1 xícara de água fervente" },
        { value: "1 e 1/2 xícara de batata cozida e amassada (tipo purê)" },
        { value: "1/2 xícara de levedura nutricional (para sabor de queijo, opcional)" },
        { value: "1 colher de chá de sal (ou a gosto)" },
    ],
    instructions: [
        { value: "Cozinhe as batatas em água até ficarem bem macias. Escorra e amasse bem, como um purê. Reserve." },
        { value: "Em uma tigela grande, misture os dois tipos de polvilho e o sal." },
        { value: "Em uma panela, aqueça o óleo e a água até levantar fervura. Despeje essa mistura quente sobre os polvilhos e mexa rapidamente com uma colher. Isso vai 'escaldar' o polvilho, o que é crucial para a textura." },
        { value: "A massa ficará um pouco empelotada. Deixe amornar por uns 10 minutos." },
        { value: "Adicione a batata amassada e a levedura nutricional (se usar) à massa morna." },
        { value: "Agora, com as mãos, sove a massa até que todos os ingredientes estejam bem incorporados e ela fique lisa e homogênea. Se estiver muito grudenta, adicione um pouco mais de polvilho doce." },
        { value: "Pré-aqueça o forno a 200°C. Faça bolinhas com a massa e distribua em uma assadeira (não precisa untar)." },
        { value: "Asse por cerca de 20-25 minutos, ou até que estejam douradinhos por fora e macios por dentro." },
    ],
    substitutions: [
        "**Batata:** Batata baroa (mandioquinha) fica incrível e deixa o pão de queijo mais amarelinho e saboroso.",
        "**Levedura Nutricional:** Se não tiver, o pão de queijo ainda fica delicioso, mas com um sabor mais suave. Você pode adicionar temperos como alho em pó ou orégano à massa.",
    ],
    chefTip: "O pulo do gato é escaldar o polvilho com a mistura de água e óleo bem quente. Isso pré-cozinha o amido e garante que o pão de queijo cresça, fique aerado por dentro e com aquela casquinha crocante por fora. Não pule essa etapa!",
  },
  'mousse-de-chocolate-com-abacate': {
    title: "Mousse de Chocolate Secreto com Abacate",
    author: "Juliana P.",
    description: "Essa é minha receita 'coringa' para jantares! Uma sobremesa super cremosa, intensa e deliciosa que ninguém acredita quando eu conto o ingrediente secreto: abacate! Ele dá a cremosidade perfeita sem deixar nenhum sabor residual. É saudável, fácil de fazer e agrada a todos, até as crianças. Prepare-se para os elogios!",
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    category: "Sobremesa",
    tags: ["Vegano", "Sem Glúten", "Sobremesa Rápida"],
    ingredients: [
        { value: "1 abacate grande e maduro (ou 2 pequenos)" },
        { value: "1/2 xícara de cacau em pó 100%" },
        { value: "1/2 xícara de melado de cana ou agave (ou a gosto)" },
        { value: "1/4 xícara de bebida vegetal (amêndoas, coco)" },
        { value: "1 colher de chá de extrato de baunilha" },
        { value: "1 pitada de sal" },
    ],
    instructions: [
        { value: "Corte o abacate ao meio, remova o caroço e retire toda a polpa com uma colher." },
        { value: "Coloque a polpa do abacate, o cacau em pó, o melado, a bebida vegetal, a baunilha e o sal em um processador de alimentos ou liquidificador potente." },
        { value: "Bata em velocidade alta por cerca de 2-3 minutos, parando para raspar as laterais se necessário, até a mistura ficar completamente lisa, cremosa e sem nenhum pedacinho de abacate." },
        { value: "Prove e ajuste a doçura se necessário, adicionando mais melado a gosto." },
        { value: "Divida a mousse em 4 potinhos ou taças." },
        { value: "Leve à geladeira por pelo menos 30 minutos para firmar um pouco mais. Sirva gelado." },
    ],
    substitutions: [
        "**Abacate:** Use abacates do tipo 'avocado' (o menor e de casca escura), pois eles são mais cremosos e têm sabor mais neutro.",
        "**Melado/Agave:** Pode ser substituído por tâmaras sem caroço (cerca de 6-8, hidratadas em água morna por 10 min) para um adoçante mais natural. Nesse caso, adicione as tâmaras junto com os outros ingredientes no processador.",
        "**Para um toque especial:** Adicione uma colher de sopa de pasta de amendoim ou 1/2 colher de chá de canela em pó à mistura.",
    ],
    chefTip: "A chave para uma mousse perfeita é a maturação do abacate. Ele precisa estar maduro e macio ao toque, mas sem partes escuras ou fibrosas. Um abacate 'passado' pode deixar um gosto amargo. Se o seu abacate estiver perfeito, o sabor dele some completamente, deixando só a cremosidade e o brilho do chocolate.",
  }
};

// Futuramente, esta função buscará os dados do Firestore
async function getRecipeData(slug: string) {
    const recipe = allRecipes[slug];
    if (recipe) {
        return recipe;
    }
    
    // Lógica para buscar do Firestore (a ser implementada)
    // const docRef = db.collection('recipes').doc(slug);
    // const doc = await docRef.get();
    // if (!doc.exists) {
    //     return null;
    // }
    // return doc.data();

    return null;
}

export default async function RecipePage({ params }: { params: { slug: string } }) {
  const recipeData = await getRecipeData(params.slug);

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
                        {recipeData.ingredients.map((ing: { value: string }, index: number) => {
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
                        {recipeData.instructions.map((step: { value: string }, index: number) => (
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
                <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle className="font-headline">Dicas de Substituição</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            {recipeData.substitutions.map((sub: string, index: number) => <li key={index} dangerouslySetInnerHTML={{ __html: sub.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />)}
                        </ul>
                    </AlertDescription>
                </Alert>
                 <Alert variant="destructive" className="bg-primary/10 border-primary/40 text-primary">
                    <ChefHat className="h-4 w-4 !text-primary" />
                    <AlertTitle className="font-headline !text-primary">Dica do(a) Chef {recipeData.author}</AlertTitle>
                    <AlertDescription className="!text-primary/80">
                       {recipeData.chefTip}
                    </AlertDescription>
                </Alert>
            </div>
        </article>
    </div>
  );
}

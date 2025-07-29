
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { LogOut, BookOpen, PlusCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, setDoc, doc, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface Article {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  createdAt: Timestamp;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      if (user) {
        try {
          const articlesCollection = collection(db, 'articles');
          const articlesSnapshot = await getDocs(articlesCollection);
          const articlesList = articlesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Article));
          setArticles(articlesList);
        } catch (error) {
          console.error("Erro ao buscar artigos: ", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchArticles();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const seedDatabase = async () => {
    setIsSeeding(true);
    const sampleArticles = [
      { id: '1', title: 'Desvendando os Segredos do Universo', summary: 'Uma jornada fascinante pelas estrelas, planetas e galáxias distantes.', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'galaxy universe' },
      { id: '2', title: 'A Arte da Culinária Molecular', summary: 'Técnicas inovadoras que transformam a cozinha em um laboratório de sabores.', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'molecular gastronomy' },
      { id: '3', title: 'História Perdida das Civilizações Antigas', summary: 'Explore as ruínas e os mistérios de sociedades que moldaram o mundo.', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'ancient ruins' },
    ];

    try {
      for (const article of sampleArticles) {
        await setDoc(doc(db, "articles", article.id), {
          title: article.title,
          summary: article.summary,
          imageUrl: article.imageUrl,
          dataAiHint: article.dataAiHint,
          createdAt: Timestamp.now(),
        });
      }
      // Refresh articles after seeding
      const articlesCollection = collection(db, 'articles');
      const articlesSnapshot = await getDocs(articlesCollection);
      const articlesList = articlesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
      setArticles(articlesList);

    } catch (error) {
      console.error("Erro ao popular o banco de dados: ", error);
    } finally {
      setIsSeeding(false);
    }
  };


  return (
    <div className="container mx-auto max-w-7xl py-12 px-4">
       <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold font-headline">Painel de Controle</CardTitle>
            <CardDescription>Bem-vindo(a), <span className="font-semibold">{user?.email}</span>!</CardDescription>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2" />
            Sair
          </Button>
        </CardHeader>
      </Card>

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center"><BookOpen className="mr-3" /> Conteúdo Exclusivo</h2>
        <Button onClick={seedDatabase} disabled={isSeeding}>
          <PlusCircle className="mr-2" />
          {isSeeding ? 'Adicionando...' : 'Adicionar Conteúdo de Exemplo'}
        </Button>
      </div>

       {loading ? (
        <p>Carregando artigos...</p>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Card key={article.id} className="flex flex-col">
              <CardHeader>
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                   <img
                      src={article.imageUrl}
                      alt={article.title}
                      data-ai-hint={article.dataAiHint}
                      className="w-full h-full object-cover"
                    />
                </div>
                <CardTitle className="pt-4">{article.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{article.summary}</CardDescription>
              </CardContent>
               <CardFooter>
                 <Button variant="outline" className="w-full">Ler Artigo</Button>
               </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">Nenhum artigo encontrado.</p>
          <p className="text-muted-foreground mt-2">Clique no botão acima para adicionar conteúdo de exemplo.</p>
        </div>
      )}
    </div>
  );
}

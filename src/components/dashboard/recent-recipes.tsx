import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface Recipe {
  id: string;
  title: string;
  category: string;
  authorName: string;
  authorAvatarUrl: string;
}

async function getRecentRecipes(): Promise<Recipe[]> {
  const recipesCol = collection(db, 'recipes');
  const q = query(recipesCol, orderBy('createdAt', 'desc'), limit(6));
  const snapshot = await getDocs(q);
  
  // Artificial delay to demonstrate skeleton loading
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Recipe));
}

export async function RecentRecipes() {
  const recipes = await getRecentRecipes();

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Nenhuma receita encontrada ainda.</p>
        <p className="text-sm text-muted-foreground mt-2">Clique no botão no canto inferior direito para adicionar dados de exemplo.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <Link href={`/recipe/${recipe.id}`} key={recipe.id} className="block">
          <Card className="h-full flex flex-col hover:border-primary transition-colors">
            <CardHeader>
              <Badge variant="secondary" className="self-start">{recipe.category}</Badge>
            </CardHeader>
            <CardContent className="flex-grow">
              <h3 className="font-semibold text-lg leading-tight">{recipe.title}</h3>
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={recipe.authorAvatarUrl} alt={recipe.authorName} />
                  <AvatarFallback>{recipe.authorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{recipe.authorName}</span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export function RecentRecipesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
           <CardHeader>
              <Skeleton className="h-5 w-16" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-5/6" />
            </CardContent>
            <CardFooter>
               <div className="flex items-center gap-2 w-full">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
            </CardFooter>
        </Card>
      ))}
    </div>
  );
}

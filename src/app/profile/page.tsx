
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { LogOut, Edit3, Award, BookOpen, ChefHat } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

interface Recipe {
  id: string;
  title: string;
  category: string;
  photoUrl?: string;
  createdAt: Timestamp;
}

function RecipeListSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
        </div>
    )
}


export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, 'recipes'), where('authorId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const userRecipes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Recipe));
        setRecipes(userRecipes);
      } catch (error) {
        console.error("Error fetching recipes: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const userName = user?.displayName || user?.email?.split('@')[0] || 'Membro';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6">
      <Card className="overflow-hidden shadow-lg rounded-2xl">
        <CardHeader className="bg-muted/30 p-6 border-b">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
              <AvatarImage src={user?.photoURL ?? ''} alt={userName} />
              <AvatarFallback className="text-4xl bg-primary/20 text-primary font-bold">{userInitial}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <CardTitle className="text-3xl font-bold font-headline">{userName}</CardTitle>
              <CardDescription className="text-md text-muted-foreground mt-1">{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-10">
          <div className="flex items-center justify-end space-x-2">
            <Button variant="outline" size="sm">
              <Edit3 className="mr-2 h-4 w-4" />
              Editar Perfil
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
          
          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center text-foreground">
                <BookOpen className="mr-3 h-5 w-5 text-primary" />
                Minhas Receitas
            </h3>
             {loading ? (
                <RecipeListSkeleton />
             ) : recipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recipes.map(recipe => (
                    <Link href={`/recipes/${recipe.id}`} key={recipe.id}>
                        <Card className="overflow-hidden group relative h-48 rounded-lg">
                            <Image
                                src={recipe.photoUrl || `https://placehold.co/600x400.png`}
                                alt={recipe.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint="recipe food"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-3">
                                <span className="text-xs font-semibold uppercase text-white/90 bg-black/50 px-2 py-1 rounded-full">{recipe.category}</span>
                                <h4 className="text-md font-bold text-white mt-1 truncate">{recipe.title}</h4>
                            </div>
                        </Card>
                    </Link>
                  ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg bg-secondary/30">
                    <p className='mb-4'>Você ainda não compartilhou nenhuma receita. Que tal começar agora?</p>
                    <Button asChild>
                        <Link href="/submit-recipe">
                        <ChefHat className="mr-2 h-4 w-4"/>
                        Compartilhe sua primeira receita!
                        </Link>
                    </Button>
                </div>
            )}
          </div>

           <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center text-foreground">
                <Award className="mr-3 h-5 w-5 text-primary" />
                Minhas Conquistas
            </h3>
            <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg bg-secondary/30">
              <p>Em breve: Envie receitas para ganhar pontos e títulos!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { LogOut, Edit3, Award, BookOpen, ChefHat } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const userName = user?.displayName || user?.email?.split('@')[0] || 'Membro';
  const userInitial = userName.charAt(0).toUpperCase();

  // TODO: Fetch user's recipes and achievements from Firestore
  const hasRecipes = false; // Placeholder

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
            <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg bg-secondary/30">
              {hasRecipes ? (
                <p>Exibir lista de receitas aqui...</p>
              ) : (
                <>
                  <p className='mb-4'>Você ainda não compartilhou nenhuma receita. Que tal começar agora?</p>
                  <Button asChild>
                    <Link href="/submit-recipe">
                      <ChefHat className="mr-2 h-4 w-4"/>
                      Compartilhe sua primeira receita!
                    </Link>
                  </Button>
                </>
              )}
            </div>
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


'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Award, BookOpen, Edit, PlusCircle, Loader2, Camera } from 'lucide-react';
import { Header } from '@/components/header';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditProfileForm } from '@/components/edit-profile-form';


export default function ProfilePage() {
  const { user, loading, updateUserProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) { // Limite de 2MB
        toast({
            variant: 'destructive',
            title: 'Arquivo muito grande',
            description: 'Por favor, escolha uma imagem com menos de 2MB.',
        });
        return;
    }

    setIsUploading(true);
    try {
      await updateUserProfile({ photoFile: file });
      toast({
        title: 'Sucesso!',
        description: 'Sua foto de perfil foi atualizada.',
      });
    } catch (error) {
      // A notificação de erro já é tratada dentro de useAuth
      console.error("Error uploading profile picture:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Carregando...
      </div>
    );
  }

  const name = user.displayName || user.email?.split('@')[0] || 'Membro';
  const userInitials = (user.displayName || user.email || 'M').substring(0, 2).toUpperCase();

  const achievements = [
    { title: "Pioneiro Culinário", description: "Enviou sua primeira receita", unlocked: false },
    { title: "Mestre dos Sabores", description: "Enviou 5 receitas", unlocked: false },
    { title: "Explorador de Categorias", description: "Enviou receitas em 3 categorias diferentes", unlocked: false },
  ];

  const hasRecipes = false; // Placeholder

  return (
    <>
      <Header />
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-4xl">
        <header className="flex flex-col sm:flex-row items-center gap-6 mb-10">
          <div className="relative group">
            <Avatar className="h-24 w-24 text-3xl cursor-pointer" onClick={handleAvatarClick}>
              <AvatarImage src={user.photoURL || ''} alt={name} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={handleAvatarClick}>
              {isUploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
              ) : (
                  <Camera className="h-8 w-8 text-white" />
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg"
              className="hidden"
              disabled={isUploading}
            />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
              {name}
            </h1>
            <p className="mt-1 text-lg text-muted-foreground">{user.email}</p>
          </div>
          <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
            <DialogTrigger asChild>
               <Button variant="outline" className="sm:ml-auto">
                <Edit className="mr-2 h-4 w-4" />
                Editar Perfil
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Perfil</DialogTitle>
                <DialogDescription>
                  Faça alterações no seu perfil aqui. Clique em salvar quando terminar.
                </DialogDescription>
              </DialogHeader>
              <EditProfileForm onSave={() => setIsProfileDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </header>

        <main className="space-y-12">
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <BookOpen className="h-6 w-6 text-primary" />
                  Minhas Receitas
                </CardTitle>
                <CardDescription>
                  As receitas que você compartilhou com a comunidade.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasRecipes ? (
                  <div>
                  </div>
                ) : (
                   <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <h3 className="text-lg font-semibold text-muted-foreground">Você ainda não compartilhou nenhuma receita</h3>
                    <Button className="mt-4">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Compartilhe sua primeira receita!
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          <section>
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <Award className="h-6 w-6 text-primary" />
                  Conquistas
                </CardTitle>
                <CardDescription>
                  Seus títulos e progresso na comunidade.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-3">
                 {achievements.map((ach) => (
                    <Card key={ach.title} className={`p-4 ${ach.unlocked ? 'bg-accent/50' : 'bg-muted/50'}`}>
                      <h4 className="font-semibold">{ach.title}</h4>
                      <p className="text-sm text-muted-foreground">{ach.description}</p>
                    </Card>
                  ))}
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </>
  );
}

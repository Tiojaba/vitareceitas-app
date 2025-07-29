
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Bell } from 'lucide-react';
import { Logo } from '@/components/logo';
import Link from 'next/link';

function DashboardHeader() {
   const { logout } = useAuth();
   const router = useRouter();

   const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-4 border-b bg-background/95 backdrop-blur-sm">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="flex flex-col space-y-4 p-4">
            <Link href="/dashboard" className="font-semibold text-lg">Início</Link>
            <Link href="/recipes" className="text-muted-foreground hover:text-foreground">Receitas</Link>
            <Link href="/profile" className="text-muted-foreground hover:text-foreground">Meu Perfil</Link>
            <Link href="/favorites" className="text-muted-foreground hover:text-foreground">Favoritos</Link>
             <Button onClick={handleLogout} variant="outline" className="mt-auto">Sair</Button>
          </nav>
        </SheetContent>
      </Sheet>
      
      <Logo className="h-8 w-8" />
      
      <Button variant="ghost" size="icon">
        <Bell className="h-6 w-6" />
        <span className="sr-only">Ver notificações</span>
      </Button>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    // Você pode substituir isso por um componente de esqueleto de página inteira
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main>{children}</main>
    </div>
  );
}


'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
       <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">Painel de Controle</CardTitle>
          <CardDescription>Bem-vindo(a) à sua área exclusiva!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Olá, <span className="font-semibold">{user?.email}</span>!</p>
          <p>Este é o seu painel de controle. Aqui você pode acessar seu conteúdo exclusivo.</p>
          <Button onClick={handleLogout} variant="destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

import { AuthForm } from '@/components/auth-form';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <AuthForm mode="login" />
      <p className="text-center text-sm text-muted-foreground mt-6">
        Não tem uma conta?{' '}
        <Link href="/signup" className="underline hover:text-primary">
          Crie uma agora
        </Link>
      </p>
    </div>
  );
}

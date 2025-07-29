import { AuthForm } from '@/components/auth-form';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <AuthForm mode="signup" />
       <p className="text-center text-sm text-muted-foreground mt-6">
        Já tem uma conta?{' '}
        <Link href="/login" className="underline hover:text-primary">
          Faça login
        </Link>
      </p>
    </div>
  );
}

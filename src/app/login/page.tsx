import { AuthForm } from '@/components/auth-form';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <AuthForm mode="login" />
    </div>
  );
}

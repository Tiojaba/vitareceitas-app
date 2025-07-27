import { CheckCircle2, AlertTriangle } from "lucide-react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator";

interface ConfirmationPageProps {
  searchParams: {
    amount?: string;
    name?: string;
    email?: string;
    isHighRisk?: string;
    reason?: string;
  };
}

export default function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { amount, name, email, isHighRisk, reason } = searchParams;
  const isHighRiskBool = isHighRisk === 'true';

  if (!amount || !name) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <Card className="max-w-md w-full">
            <CardHeader>
                <CardTitle className="text-destructive flex items-center justify-center gap-2"><AlertTriangle/> Erro</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Os detalhes do pagamento estão faltando. Por favor, tente o processo de pagamento novamente.</p>
            </CardContent>
            <CardFooter>
                 <Button asChild className="w-full">
                    <Link href="/">Voltar para o Checkout</Link>
                </Button>
            </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Card className="max-w-lg w-full text-center shadow-lg">
        <CardHeader className="items-center">
            <CheckCircle2 className="h-20 w-20 text-accent mb-4" />
            <CardTitle className="text-3xl font-bold font-headline">Pagamento bem-sucedido!</CardTitle>
            <CardDescription>Seu pagamento simulado foi processado.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-left">
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor Pago:</span>
                    <span className="font-semibold text-foreground">R$ {parseFloat(amount).toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Cobrado de:</span>
                    <span className="font-medium text-foreground">{name}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium text-foreground">{email}</span>
                </div>
            </div>
             <Separator />
            <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                    {isHighRiskBool ? (
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                    ) : (
                        <CheckCircle2 className="h-5 w-5 text-accent" />
                    )}
                    Análise de Risco por IA
                </h3>
                <p className={`text-sm ${isHighRiskBool ? 'text-destructive' : 'text-accent-foreground'}`}>
                    <span className="font-bold">Nível de Risco:</span> {isHighRiskBool ? 'Alto' : 'Baixo'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                   <span className="font-semibold">Motivo:</span> {reason}
                </p>
            </div>
        </CardContent>
        <CardFooter>
            <Button asChild className="w-full">
                <Link href="/">Fazer Outro Pagamento</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

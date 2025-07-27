import { CheckCircle2, AlertTriangle, Info } from "lucide-react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ConfirmationPageProps {
  searchParams: {
    collection_id?: string;
    collection_status?: string;
    payment_id?: string;
    status?: string;
    external_reference?: string;
    payment_type?: string;
    merchant_order_id?: string;
    preference_id?: string;
    site_id?: string;
    processing_mode?: string;
    merchant_account_id?: string;
  };
}

export default function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { status } = searchParams;
  const isSuccess = status === 'approved';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Card className="max-w-lg w-full text-center shadow-lg">
        <CardHeader className="items-center">
          {isSuccess ? (
            <CheckCircle2 className="h-20 w-20 text-accent mb-4" />
          ) : (
            <AlertTriangle className="h-20 w-20 text-destructive mb-4" />
          )}
          <CardTitle className="text-3xl font-bold font-headline">
            {isSuccess ? 'Pagamento Aprovado!' : 'Pagamento Falhou'}
          </CardTitle>
          <CardDescription>
            {isSuccess 
              ? 'Obrigado pela sua compra. Seu pagamento foi processado com sucesso.'
              : 'Houve um problema ao processar seu pagamento. Por favor, tente novamente.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Alert variant={isSuccess ? "default" : "destructive"}>
              <Info className="h-4 w-4" />
              <AlertTitle>Status do Pagamento</AlertTitle>
              <AlertDescription>
                Seu status de pagamento do Mercado Pago é: <span className="font-semibold capitalize">{status || 'Indisponível'}</span>
              </AlertDescription>
            </Alert>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/">Voltar para a Página Inicial</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Copy, QrCode } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function PixPaymentComponent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const qrCode = searchParams.get('qrCode');
  const qrCodeBase64 = searchParams.get('qrCodeBase64');
  const paymentId = searchParams.get('paymentId');

  if (!qrCode || !qrCodeBase64 || !paymentId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Card className="max-w-lg w-full text-center shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold font-headline">Erro ao Gerar PIX</CardTitle>
            <CardDescription>
              Não foi possível carregar os dados do pagamento. Por favor, volte e tente novamente.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  const handleCopy = () => {
    navigator.clipboard.writeText(qrCode);
    toast({
      title: "Copiado!",
      description: "O código PIX foi copiado para a área de transferência.",
    });
  };

  return (
    <div className="container mx-auto max-w-md py-8 sm:py-12 px-4">
      <Card className="shadow-2xl">
        <CardHeader className="text-center items-center">
            <QrCode className="h-16 w-16 mb-4 text-primary" />
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground font-headline">
                Pague com PIX
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
                Escaneie o QR Code ou copie o código abaixo.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
            <div className="p-4 border rounded-lg bg-card">
                 <Image
                    src={`data:image/png;base64,${qrCodeBase64}`}
                    alt="PIX QR Code"
                    width={256}
                    height={256}
                    className="rounded-md"
                />
            </div>
           
            <div className="w-full space-y-2">
                <label htmlFor="pix-code" className="text-sm font-medium text-muted-foreground">PIX Copia e Cola</label>
                <div className="relative">
                    <Input id="pix-code" readOnly value={qrCode} className="pr-10 text-xs tracking-tighter bg-muted"/>
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={handleCopy}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>

             <Alert>
              <AlertTitle>Aguardando Pagamento</AlertTitle>
              <AlertDescription>
                Após a confirmação do pagamento, você receberá um e-mail com as instruções de acesso à sua área de membros.
              </AlertDescription>
            </Alert>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground text-center w-full">
                O QR Code expira em 30 minutos. ID do Pagamento: {paymentId}
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function PixPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <PixPaymentComponent />
        </Suspense>
    )
}

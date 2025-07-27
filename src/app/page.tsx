import { Logo } from "@/components/logo";
import { CheckoutForm } from "@/components/checkout-form";

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-6xl py-8 sm:py-12 px-4">
      <header className="flex flex-col items-center text-center mb-10">
        <Logo className="h-16 w-16 mb-4 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
          ConisoPay Checkout
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          Complete your payment securely. Enter your details below to proceed with our simulated payment process and see our AI risk analysis in action.
        </p>
      </header>
      <CheckoutForm />
    </div>
  );
}

'use client';

import { Header } from "@/components/header";

export default function BonusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}

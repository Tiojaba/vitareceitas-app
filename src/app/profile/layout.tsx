import { Header } from "@/components/header";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">{children}</main>
    </div>
  );
}

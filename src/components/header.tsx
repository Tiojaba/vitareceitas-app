
'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Bell, Home, User, Settings, LogOut, UtensilsCrossed } from "lucide-react"
import { Logo } from "@/components/logo";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";


export function Header() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }

  const navItems = [
    { href: "/dashboard", icon: <Home />, label: "Início" },
    { href: "/profile", icon: <User />, label: "Meu Perfil" },
    { href: "/submit-recipe", icon: <UtensilsCrossed />, label: "Enviar Receita" },
    { href: "/settings", icon: <Settings />, label: "Configurações" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Logo className="h-6 w-6" />
                <span className="font-bold">Zero Lactose</span>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-full py-4">
              <nav className="flex flex-col gap-2 flex-1">
                {navItems.map((item) => (
                   <Button key={item.label} variant="ghost" className="justify-start gap-2" asChild>
                    <Link href={item.href}>
                      {item.icon} {item.label}
                    </Link>
                  </Button>
                ))}
              </nav>
               <Button onClick={handleLogout} variant="ghost" className="justify-start gap-2">
                  <LogOut /> Sair
                </Button>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="hidden md:flex items-center gap-2 mr-4">
           <Link href="/dashboard" className="flex items-center gap-2">
              <Logo className="h-6 w-6" />
              <span className="font-bold hidden sm:inline-block">Comunidade Zero Lactose</span>
            </Link>
        </div>


        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                  <Link href="/profile">Meu Perfil</Link>
              </Button>
              <Button variant="ghost" asChild>
                  <Link href="/submit-recipe">Enviar Receita</Link>
              </Button>
          </nav>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notificações</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AdminLoginForm } from "@/components/auth/admin-login-form";
import { cn } from "@/lib/utils";

const links = [
  { name: "O Espaço", href: "#features" },
  { name: "Galeria", href: "#gallery" },
  { name: "Pacotes", href: "#marketing" },
  { name: "Contato", href: "#contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex items-center border-b border-white/20",
        isScrolled
          ? "bg-white backdrop-blur-md shadow-sm h-[60px] md:h-[90px]"
          : "bg-transparent h-[90px]"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-heading font-bold flex items-center gap-2">
          <span className={cn("transition-colors", isScrolled ? "text-[#08d4e0e6]" : "text-white drop-shadow-md")}>
            Espaço Castro
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-secondary",
                isScrolled ? "text-[#08d4e0e6]" : "text-white/90"
              )}
            >
              {link.name}
            </a>
          ))}
          
          <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost"
                className={cn(
                  "font-medium transition-colors hover:text-secondary",
                  isScrolled ? "text-[#08d4e0e6]" : "text-white/90"
                )}
              >
                <Lock className="w-4 h-4 mr-2" />
                Administrador
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Acesso Administrativo</DialogTitle>
              </DialogHeader>
              <AdminLoginForm />
            </DialogContent>
          </Dialog>

          </div>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className={cn("md:hidden", isScrolled ? "text-[#08d4e0e6]" : "text-white")}>
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-6 mt-10">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium hover:text-secondary transition-colors"
                >
                  {link.name}
                </a>
              ))}
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Lock className="w-4 h-4 mr-2" />
                    Administrador
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Acesso Administrativo</DialogTitle>
                  </DialogHeader>
                  <AdminLoginForm />
                </DialogContent>
              </Dialog>

              </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

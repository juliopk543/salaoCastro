import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AdminLoginForm } from "@/components/auth/admin-login-form";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { LogOut } from "lucide-react";

const links = [
  { name: "O Espaço", href: "#features" },
  { name: "Galeria", href: "#gallery" },
  { name: "Pacotes", href: "#marketing" },
  { name: "Contato", href: "#contact" },
];

export function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
          
          <div className="relative">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <img src={user?.profileImageUrl || ""} alt={user?.email || "user"} className="w-8 h-8 rounded-full border-2 border-white/20" />
                  <span className={cn("text-sm font-bold", isScrolled ? "text-[#1a1f36]" : "text-white")}>
                    {user?.firstName || user?.email?.split('@')[0]}
                  </span>
                </div>
                <Button 
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "font-medium transition-colors hover:text-secondary",
                    isScrolled ? "text-[#08d4e0e6]" : "text-white/90"
                  )}
                  onClick={() => window.location.href = "/api/logout"}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost"
                  className={cn(
                    "font-medium transition-colors hover:text-secondary",
                    isScrolled ? "text-[#08d4e0e6]" : "text-white/90"
                  )}
                  onClick={() => setIsLoginOpen(!isLoginOpen)}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Administrador
                </Button>

                {isLoginOpen && (
                  <div className="absolute right-0 mt-4 p-6 w-[320px] rounded-[2rem] bg-white shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                    <h3 className="text-lg font-black text-[#1a1f36] mb-4 tracking-tight">Acesso Restrito</h3>
                    <AdminLoginForm onSuccess={() => setIsLoginOpen(false)} />
                  </div>
                )}
              </>
            )}
          </div>

          </div>

        {/* Mobile Nav */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
                  onClick={() => setIsSheetOpen(false)}
                  className="text-lg font-medium hover:text-secondary transition-colors text-center"
                >
                  {link.name}
                </a>
              ))}
              
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-2xl font-bold border-slate-200"
                  onClick={() => setIsLoginOpen(!isLoginOpen)}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Administrador
                </Button>
                
                {isLoginOpen && (
                  <div className="mt-2 p-5 rounded-[2rem] border border-slate-100 bg-slate-50/50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="text-sm font-black text-[#1a1f36] mb-4 tracking-tight uppercase opacity-60">Acesso Administrativo</h3>
                    <AdminLoginForm onSuccess={() => {
                      setIsLoginOpen(false);
                      setIsSheetOpen(false);
                    }} />
                  </div>
                )}
              </div>

              </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

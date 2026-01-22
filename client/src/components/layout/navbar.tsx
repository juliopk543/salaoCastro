import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { name: "O Espaço", href: "#features" },
  { name: "Galeria", href: "#gallery" },
  { name: "Pacotes", href: "#marketing" },
  { name: "Contato", href: "#contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex items-center h-[90px] border-b border-white/20",
        isScrolled
          ? "backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
          <span className={cn("transition-colors", !isScrolled && "text-white drop-shadow-md")}>
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
                "text-sm font-medium hover:text-secondary transition-colors",
                !isScrolled ? "text-white/90" : "text-foreground"
              )}
            >
              {link.name}
            </a>
          ))}
          <Button 
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold rounded-full"
            asChild
          >
            <a href="#contact">
              <Phone className="w-4 h-4 mr-2" />
              Agendar Visita
            </a>
          </Button>
        </div>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-primary">
              <Menu className={cn("w-6 h-6", !isScrolled && "text-white")} />
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
              <Button className="w-full bg-secondary text-secondary-foreground font-bold">
                Agendar Visita
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

import { Facebook, Instagram, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-heading font-bold mb-4">Espaço Castro</h3>
            <p className="text-primary-foreground/80 max-w-md">
              O lugar perfeito para celebrar momentos inesquecíveis. 
              Infraestrutura completa para casamentos, aniversários e eventos corporativos.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Redes Sociais</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-secondary transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                <MessageCircle className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/10 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Espaço Castro. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

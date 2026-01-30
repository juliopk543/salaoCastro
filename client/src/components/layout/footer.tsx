import microSertaoLogo from "@assets/ChatGPT_Image_27_de_jan._de_2026,_00_16_37_1769788193813.png";
import { Instagram } from "lucide-react";

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
            <div className="flex items-center gap-3">
              <a 
                href="https://www.instagram.com/espacocastrocrp/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-secondary transition-colors flex items-center gap-2 group"
              >
                <Instagram className="w-6 h-6" />
                <span className="text-sm font-medium group-hover:underline">Visite nosso insta.</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end justify-center">
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-2">Desenvolvido por:</span>
            <img 
              src={microSertaoLogo} 
              alt="Micro Sertão Software Company" 
              className="h-12 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/10 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Espaço Castro. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

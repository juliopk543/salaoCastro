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

          <div className="flex flex-col items-center md:items-end justify-center md:col-span-1">
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 w-full max-w-[280px] hover:bg-white/10 transition-colors group">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-secondary mb-4 block text-center md:text-left">
                Tecnologia & Inovação
              </span>
              <img 
                src={microSertaoLogo} 
                alt="Micro Sertão Software Company" 
                className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div className="mt-4 pt-4 border-t border-white/5 text-center md:text-right">
                <span className="text-[9px] uppercase font-medium opacity-40">Software House Parceira</span>
              </div>
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

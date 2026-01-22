import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import logoImage from "@assets/491438179_695315012983652_6840206379754210205_n_1769044482549.jpg";
import heroBg from "@assets/Captura_de_tela_2026-01-21_221233_1769044948211.png";

export function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Espaço Castro Pool Area" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background/90" />
      </div>

      <div className="container relative z-10 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Logo Container */}
          <div className="mb-8 w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl bg-white/10 backdrop-blur-sm p-4">
            <img 
              src={logoImage} 
              alt="Espaço Castro Logo" 
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 drop-shadow-lg max-w-4xl leading-tight">
            Celebre seus melhores <span className="text-secondary">momentos</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl font-light">
            Salão de festas completo com piscina, área de lazer e churrasqueira em Campo Limpo Paulista. 
            O cenário perfeito para criar memórias inesquecíveis.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg px-8 rounded-full h-14" asChild>
              <a href="#contact">Reservar Agora</a>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/40 text-white hover:bg-white/20 font-bold text-lg px-8 rounded-full h-14 backdrop-blur-sm" asChild>
              <a href="#features">Conhecer o Espaço</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoImage from "@assets/491438179_695315012983652_6840206379754210205_n_1769044482549.jpg";
import heroBg from "@assets/ChatGPT_Image_21_de_jan._de_2026,_22_39_08_1769045964191.png";

export function Hero() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Fixed Booking Button */}
      <div 
        className={cn(
          "fixed left-0 right-0 z-40 md:hidden flex justify-center transition-all duration-300",
          isScrolled ? "top-[60px]" : "top-[90px]"
        )}
      >
        <Button 
          size="lg" 
          className={cn(
            "w-full bg-[#08D4E0] hover:bg-[#08D4E0]/90 text-white font-bold text-lg px-8 h-14 shadow-lg transition-all duration-300",
            isScrolled ? "my-0 rounded-none" : "my-[10px] rounded-md"
          )}
          onClick={() => {
            const marketingSection = document.getElementById('marketing');
            if (marketingSection) {
              marketingSection.scrollIntoView({ behavior: 'smooth' });
              setTimeout(() => {
                const firstBudgetButton = marketingSection.querySelector('button');
                if (firstBudgetButton instanceof HTMLElement) {
                  firstBudgetButton.click();
                }
              }, 800);
            }
          }}
        >
          FAÇA SUA RESERVA
        </Button>
      </div>

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
          <div className="mb-8 w-48 h-48 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl bg-white/10 backdrop-blur-sm relative">
            <img 
              src={logoImage} 
              alt="Espaço Castro Logo" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div className="hidden md:flex justify-center w-full mb-12">
            <Button size="lg" className="bg-[#08D4E0] hover:bg-[#08D4E0]/90 text-white font-bold text-lg px-8 rounded-md h-14" onClick={() => {
              const marketingSection = document.getElementById('marketing');
              if (marketingSection) {
                marketingSection.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                  const firstBudgetButton = marketingSection.querySelector('button');
                  if (firstBudgetButton instanceof HTMLElement) {
                    firstBudgetButton.click();
                  }
                }, 800);
              }
            }}>
              FAÇA SUA RESERVA
            </Button>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 drop-shadow-lg max-w-4xl leading-tight">
            Celebre seus melhores <span className="text-secondary">momentos</span>
          </h1>

        </motion.div>
      </div>
    </section>
  );
}

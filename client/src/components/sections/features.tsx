import { motion } from "framer-motion";
import { Waves, Flame, Gamepad2, BedDouble, PartyPopper, UtensilsCrossed } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import bbqImg from "@assets/generated_images/outdoor_bbq_area.png";
import kidsImg from "@assets/generated_images/kids_playground_area.png";
import bedroomImg from "@assets/generated_images/bedroom_with_two_double_beds.png";
import hallImg from "@assets/generated_images/party_hall_interior.png";

const features = [
  {
    icon: Waves,
    title: "Piscina Tropical",
    description: "Ampla piscina com área rasa para crianças e deck para banho de sol.",
    image: null, // Using generated hero for pool context usually
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Flame,
    title: "Área Gourmet",
    description: "Churrasqueira completa com equipamentos, balcão e freezer inclusos.",
    image: bbqImg,
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: Gamepad2,
    title: "Espaço Kids",
    description: "Área de lazer segura e divertida para as crianças brincarem livremente.",
    image: kidsImg,
    color: "bg-green-100 text-green-600",
  },
  {
    icon: BedDouble,
    title: "Acomodações",
    description: "Quarto confortável com duas camas de casal para descanso durante o evento.",
    image: bedroomImg,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: PartyPopper,
    title: "Salão de Festas",
    description: "Espaço coberto versátil para casamentos, aniversários e confraternizações.",
    image: hallImg,
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: UtensilsCrossed,
    title: "Estrutura Completa",
    description: "Mesas e cadeiras inclusas no aluguel para sua comodidade.",
    image: null,
    color: "bg-red-100 text-red-600",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">
            Nossa Estrutura
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            Tudo o que você precisa
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pensamos em cada detalhe para que seu evento seja perfeito. 
            Do lazer ao descanso, nossa estrutura está pronta para receber você.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group h-full bg-white">
                <CardContent className="p-0 h-full flex flex-col">
                  {feature.image && (
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  
                  <div className="p-6 flex-1 flex flex-col items-start">
                    <div className={cn("p-3 rounded-xl mb-4", feature.color)}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

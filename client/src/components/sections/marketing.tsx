import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const packages = [
  {
    name: "Day Use",
    description: "Perfeito para curtir um dia de sol com a família.",
    price: "Consulte",
    features: [
      "Acesso das 9h às 18h",
      "Piscina liberada",
      "Área de churrasco",
      "Até 15 pessoas"
    ],
    highlight: false
  },
  {
    name: "Fim de Semana",
    description: "Pacote completo de Sexta a Domingo.",
    price: "Especial",
    features: [
      "Check-in Sexta 18h",
      "Check-out Domingo 18h",
      "Pernoite incluso (Quarto)",
      "Uso total das instalações",
      "Ideal para retiro familiar"
    ],
    highlight: true
  },
  {
    name: "Eventos",
    description: "Para casamentos, aniversários e grandes festas.",
    price: "Personalizado",
    features: [
      "Período de 8h a 12h",
      "Mesas e cadeiras inclusas",
      "Limpeza pré e pós evento",
      "Indicação de parceiros",
      "Capacidade ampliada"
    ],
    highlight: false
  }
];

export function Marketing() {
  return (
    <section id="marketing" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">
            Possibilidades
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            Escolha seu Pacote
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Temos opções flexíveis para atender desde pequenos encontros familiares 
            até grandes celebrações.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg, i) => (
            <Card 
              key={i} 
              className={`relative border-none flex flex-col ${
                pkg.highlight 
                  ? "shadow-2xl scale-105 z-10 bg-primary text-white" 
                  : "shadow-lg bg-white"
              }`}
            >
              {pkg.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground text-sm font-bold px-4 py-1 rounded-full shadow-md">
                  Mais Popular
                </div>
              )}
              
              <CardHeader className="p-8 text-center pb-2">
                <h3 className={`text-2xl font-heading font-bold mb-2 ${pkg.highlight ? "text-white" : "text-primary"}`}>
                  {pkg.name}
                </h3>
                <p className={`text-sm ${pkg.highlight ? "text-white/80" : "text-muted-foreground"}`}>
                  {pkg.description}
                </p>
              </CardHeader>
              
              <CardContent className="p-8 pt-4 flex-1">
                <div className="flex justify-center items-baseline mb-8">
                  <span className={`text-3xl font-bold ${pkg.highlight ? "text-secondary" : "text-foreground"}`}>
                    {pkg.price}
                  </span>
                </div>
                
                <ul className="space-y-4">
                  {pkg.features.map((feature, f) => (
                    <li key={f} className="flex items-center gap-3">
                      <div className={`rounded-full p-1 ${pkg.highlight ? "bg-white/20" : "bg-primary/10"}`}>
                        <Check className={`w-3 h-3 ${pkg.highlight ? "text-secondary" : "text-primary"}`} />
                      </div>
                      <span className={`text-sm ${pkg.highlight ? "text-white/90" : "text-muted-foreground"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="p-8 pt-0">
                <Button 
                  className={`w-full font-bold rounded-full py-6 ${
                    pkg.highlight 
                      ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground" 
                      : "bg-primary hover:bg-primary/90 text-white"
                  }`}
                >
                  Solicitar Orçamento
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Extra Marketing Highlight */}
        <div className="mt-20 bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-primary/10 flex flex-col md:flex-row items-center gap-8 max-w-5xl mx-auto">
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-4">
              Parcerias Exclusivas
            </h3>
            <p className="text-muted-foreground mb-6">
              Quer facilitar seu evento? Temos parcerias com os melhores fornecedores da região: 
              buffets, decoradores e animadores com descontos especiais para clientes do Espaço Castro.
            </p>
            <Button variant="link" className="text-secondary font-bold p-0 h-auto">
              Ver lista de parceiros &rarr;
            </Button>
          </div>
          <div className="flex-1 w-full h-48 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-primary/20">
             <span className="text-muted-foreground font-medium">Logos dos Parceiros</span>
          </div>
        </div>
      </div>
    </section>
  );
}

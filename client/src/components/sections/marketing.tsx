import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import useEmblaCarousel from 'embla-carousel-react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { SiGoogle } from "react-icons/si";

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

const states = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", 
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", 
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", 
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", 
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
];

export function Marketing() {
  const { user, isAuthenticated } = useAuth();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'center',
    containScroll: 'trimSnaps',
    startIndex: 1,
    breakpoints: {
      '(min-width: 768px)': { active: false }
    }
  });

  const { toast } = useToast();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    eventType: "",
    state: "",
    checkIn: "",
    checkOut: "",
    guests: "",
    whatsapp: "",
    message: ""
  });

  const handleWhatsAppRedirect = async (pkgName: string) => {
    try {
      await apiRequest("POST", "/api/inquiries", {
        ...formData,
        packageName: pkgName,
        guests: formData.guests.toString(), // Garantir que seja string
      });

      const text = `Olá! Gostaria de solicitar um orçamento para o *Espaço Castro*.\n\n` +
        `*Pacote:* ${pkgName}\n` +
        `*Nome:* ${formData.name}\n` +
        `*De onde:* ${formData.state}\n` +
        `*Evento:* ${formData.eventType || pkgName}\n` +
        `*WhatsApp:* ${formData.whatsapp}\n` +
        `*Convidados:* ${formData.guests}\n` +
        `*Entrada:* ${formData.checkIn}\n` +
        `*Saída:* ${formData.checkOut}\n` +
        `*Mensagem:* ${formData.message}`;
      
      const encodedText = encodeURIComponent(text);
      window.open(`https://wa.me/55082993385163?text=${encodedText}`, '_blank');
      
      toast({
        title: "Solicitação enviada!",
        description: "Seus dados foram salvos e você será redirecionado para o WhatsApp.",
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível salvar sua solicitação no sistema, mas você ainda pode nos contatar pelo WhatsApp.",
        variant: "destructive",
      });
      // Mesmo com erro no banco, permite o redirecionamento para não perder a venda
      const text = `Olá! Gostaria de solicitar um orçamento para o *Espaço Castro*.\n\n` +
        `*Pacote:* ${pkgName}\n` +
        `*Nome:* ${formData.name}\n` +
        `*De onde:* ${formData.state}\n` +
        `*Evento:* ${formData.eventType || pkgName}\n` +
        `*WhatsApp:* ${formData.whatsapp}\n` +
        `*Convidados:* ${formData.guests}\n` +
        `*Entrada:* ${formData.checkIn}\n` +
        `*Saída:* ${formData.checkOut}\n` +
        `*Mensagem:* ${formData.message}`;
      window.open(`https://wa.me/55082993385163?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  useEffect(() => {
    if (!emblaApi || hasAnimated) return;

    const onScroll = () => {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) return;

      const timer = setTimeout(() => {
        // sequence: card 3 (index 2) -> card 1 (index 0) -> card 2 (index 1)
        setTimeout(() => emblaApi.scrollTo(2), 0);
        setTimeout(() => emblaApi.scrollTo(0), 1000);
        setTimeout(() => emblaApi.scrollTo(1), 2000);
        setHasAnimated(true);
      }, 500);

      return () => clearTimeout(timer);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onScroll();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    const section = document.getElementById("marketing");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, [emblaApi, hasAnimated]);

  return (
    <section id="marketing" className="py-20 bg-muted/30 overflow-hidden">
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

        {/* Desktop Grid / Mobile Carousel */}
        <div className="max-w-5xl mx-auto" ref={emblaRef}>
          <div className="flex md:grid md:grid-cols-3 md:gap-8">
            {packages.map((pkg, i) => (
              <div key={i} className="flex-[0_0_85%] min-w-0 px-4 md:px-0 md:flex-1">
                <Card 
                  className={`relative border-none h-full flex flex-col transition-all duration-300 ${
                    pkg.highlight 
                      ? "shadow-2xl md:scale-105 z-10 bg-primary text-white" 
                      : "shadow-lg bg-white"
                  }`}
                >
                  {pkg.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground text-sm font-bold px-4 py-1 rounded-full shadow-md z-20">
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
                  
                  <CardFooter className="p-8 pt-0 mt-auto">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className={`w-full font-bold rounded-full py-6 ${
                            pkg.highlight 
                              ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground" 
                              : "bg-primary hover:bg-primary/90 text-white"
                          }`}
                        >
                          Solicitar Orçamento
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px] border-none bg-transparent p-0 shadow-none overflow-visible sm:top-[auto] sm:bottom-0 sm:translate-y-0 fixed bottom-0 top-[auto] translate-y-0">
                        <motion.div 
                          initial={{ opacity: 0, y: "100%" }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: "100%" }}
                          transition={{ type: "spring", damping: 30, stiffness: 300 }}
                          className="bg-white rounded-t-[2.5rem] rounded-b-none p-8 md:p-10 shadow-[0_-16px_48px_-12px_rgba(0,0,0,0.2)] relative overflow-hidden border-t border-primary/5 w-full"
                        >
                          {/* Decorative elements */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full -ml-16 -mb-16 blur-2xl" />

                          <DialogHeader className="relative z-10">
                            <DialogTitle className="text-3xl font-heading text-primary leading-tight">
                              Solicitar Orçamento <br/>
                              <span className="text-secondary text-xl font-medium">— {pkg.name}</span>
                            </DialogTitle>
                          </DialogHeader>

                          <form 
                            className="space-y-5 pt-6 relative z-10" 
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleWhatsAppRedirect(pkg.name);
                            }}
                          >
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nome</label>
                              <Input 
                                required
                                placeholder="Seu nome" 
                                className="rounded-2xl border-muted bg-muted/30 focus:bg-white transition-all h-12 px-4"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">De onde você está é?</label>
                              <Select 
                                onValueChange={(value) => setFormData({ ...formData, state: value })}
                              >
                                <SelectTrigger className="rounded-2xl border-muted bg-muted/30 focus:bg-white transition-all h-12 px-4">
                                  <SelectValue placeholder="Selecione o estado..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-muted shadow-xl h-[250px]">
                                  {states.map((state) => (
                                    <SelectItem key={state} value={state}>{state}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">WhatsApp</label>
                              <Input 
                                required
                                type="tel"
                                placeholder="(00) 00000-0000" 
                                className="rounded-2xl border-muted bg-muted/30 focus:bg-white transition-all h-12 px-4"
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Tipo de Evento</label>
                              <Select 
                                defaultValue={pkg.name.toLowerCase().replace(/\s/g, '')}
                                onValueChange={(value) => setFormData({ ...formData, eventType: value })}
                              >
                                <SelectTrigger className="rounded-2xl border-muted bg-muted/30 focus:bg-white transition-all h-12 px-4">
                                  <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-muted shadow-xl">
                                  <SelectItem value="aniversario">Aniversário</SelectItem>
                                  <SelectItem value="casamento">Casamento</SelectItem>
                                  <SelectItem value="churrasco">Churrasco/Confraternização</SelectItem>
                                  <SelectItem value="dayuse">Day Use (Lazer)</SelectItem>
                                  <SelectItem value="fimdesemana">Fim de Semana</SelectItem>
                                  <SelectItem value="corporativo">Evento Corporativo</SelectItem>
                                  <SelectItem value="outro">Outro</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Data de Entrada</label>
                                <Input 
                                  required
                                  type="date" 
                                  className="rounded-2xl border-muted bg-muted/30 focus:bg-white transition-all h-12 px-4"
                                  value={formData.checkIn}
                                  onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Data de Saída</label>
                                <Input 
                                  required
                                  type="date" 
                                  className="rounded-2xl border-muted bg-muted/30 focus:bg-white transition-all h-12 px-4"
                                  value={formData.checkOut}
                                  onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Quantidade de Convidados</label>
                              <Input 
                                required
                                type="number"
                                placeholder="Ex: 50" 
                                className="rounded-2xl border-muted bg-muted/30 focus:bg-white transition-all h-12 px-4"
                                value={formData.guests}
                                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Mensagem (Opcional)</label>
                              <Textarea 
                                placeholder="Quantas pessoas? Alguma dúvida específica?" 
                                className="rounded-2xl border-muted bg-muted/30 focus:bg-white transition-all min-h-[100px] p-4 resize-none"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                              />
                            </div>

                            {isAuthenticated ? (
                              <Button 
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-7 text-lg rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-0.98"
                              >
                                Enviar Solicitação
                              </Button>
                            ) : (
                              <Button 
                                type="button"
                                onClick={() => window.location.href = "/api/login"}
                                className="w-full bg-white border-2 border-slate-200 hover:bg-slate-50 text-[#1a1f36] font-bold py-7 text-lg rounded-2xl shadow-sm transition-all hover:scale-[1.02] active:scale-0.98 flex items-center justify-center gap-3"
                              >
                                <SiGoogle className="size-5 text-[#4285F4]" />
                                Continuar com Google
                              </Button>
                            )}
                          </form>
                        </motion.div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
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

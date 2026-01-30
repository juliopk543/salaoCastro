import { useState, useEffect, useMemo } from "react";
import tonyLogo from "@assets/Captura_de_tela_2026-01-30_120008_1769785297691.png";
import { Check, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, isBefore, startOfDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

const packages = [
  {
    name: "Regras",
    description: "Proibido som que incomode os vizinhos.",
    price: "Consulte",
    features: [
      "Cuidar do ambiente como se fosse seu.",
      "Não sujar as paredes.",
      "Usar o chuveiro antes de entrar na piscina.",
      "Os brinquedos são infantis.",
    ],
    highlight: false,
  },
  {
    name: "Fim de Semana",
    description: "Aqui sua alegria é garantida.",
    price: "Especial",
    features: [
      "Check-in no horário combinado.",
      "Check-out no horário combinado.",
      "Pernoite incluso (Quarto).",
      "Uso total das instalações.",
      "Ideal para retiro familiar.",
    ],
    highlight: true,
  },
  {
    name: "Eventos",
    description: "Para casamentos, aniversários e grandes festas.",
    price: "Detalhes",
    features: [
      "Período de 08:00h ás 20:00h",
      "Mesas e cadeiras inclusas.",
      "Limpeza pré e pós evento.",
      "Indicação de parceiros.",
      "(Quarto) não incluso.",
    ],
    highlight: false,
  },
];

const states = [
  "Acre",
  "Alagoas",
  "Amapá",
  "Amazonas",
  "Bahia",
  "Ceará",
  "Distrito Federal",
  "Espírito Santo",
  "Goiás",
  "Maranhão",
  "Mato Grosso",
  "Mato Grosso do Sul",
  "Minas Gerais",
  "Pará",
  "Paraíba",
  "Paraná",
  "Pernambuco",
  "Piauí",
  "Rio de Janeiro",
  "Rio Grande do Norte",
  "Rio Grande do Sul",
  "Rondônia",
  "Roraima",
  "Santa Catarina",
  "São Paulo",
  "Sergipe",
  "Tocantins",
];

export function Marketing() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
    startIndex: 1,
    breakpoints: {
      "(min-width: 768px)": { active: false },
    },
  });

  const { toast } = useToast();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [, setLocation] = useLocation();

  const { data: unavailableDates = [] } = useQuery<
    { start: string; end: string }[]
  >({
    queryKey: ["/api/unavailable-dates"],
  });

  const isDateUnavailable = (date: Date) => {
    const todayDate = startOfDay(new Date());
    if (isBefore(date, todayDate)) return true;

    return unavailableDates.some((range) => {
      const start = startOfDay(parseISO(range.start));
      const end = startOfDay(parseISO(range.end));
      return date >= start && date <= end;
    });
  };

  const unavailableDateObjects = useMemo(() => {
    return unavailableDates.map((range) => ({
      from: startOfDay(parseISO(range.start)),
      to: startOfDay(parseISO(range.end)),
    }));
  }, [unavailableDates]);

  useEffect(() => {
    // Bloqueia visualmente datas no calendário nativo (não é mais necessário com o novo componente,
    // mas mantemos para evitar erros se sobrar algum input nativo)
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    eventType: "",
    state: "",
    checkIn: "",
    checkOut: "",
    guests: "",
    whatsapp: "",
    message: "",
  });

  const today = new Date().toISOString().split("T")[0];

  const handleWhatsAppRedirect = async (pkgName: string) => {
    try {
      const inquiryData = {
        ...formData,
        packageName: pkgName,
        guests: formData.guests.toString(),
      };

      const response = await apiRequest("POST", "/api/inquiries", inquiryData);

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Aviso",
          description: errorData.error || "Erro ao enviar solicitação.",
          variant: "destructive",
        });
        return;
      }

      const text =
        `Olá! Gostaria de solicitar um orçamento para o *Espaço Castro*.\n\n` +
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
      window.open(`https://wa.me/55082993385163?text=${encodedText}`, "_blank");

      toast({
        title: "Solicitação enviada!",
        description:
          "Seus dados foram salvos e você será redirecionado para o WhatsApp.",
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description:
          "Não foi possível enviar sua solicitação. Tente novamente mais tarde.",
        variant: "destructive",
      });
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
      { threshold: 0.5 },
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
            Temos opções flexíveis para atender desde pequenos encontros
            familiares até grandes celebrações.
          </p>
        </div>

        {/* Desktop Grid / Mobile Carousel */}
        <div className="max-w-5xl mx-auto" ref={emblaRef}>
          <div className="flex md:grid md:grid-cols-3 md:gap-8">
            {packages.map((pkg, i) => (
              <div
                key={i}
                className="flex-[0_0_85%] min-w-0 px-4 md:px-0 md:flex-1"
              >
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
                    <h3
                      className={`text-2xl font-heading font-bold mb-2 ${pkg.highlight ? "text-white" : "text-primary"}`}
                    >
                      {pkg.name}
                    </h3>
                    <p
                      className={`text-sm ${pkg.highlight ? "text-white/80" : "text-muted-foreground"}`}
                    >
                      {pkg.description}
                    </p>
                  </CardHeader>

                  <CardContent className="p-8 pt-4 flex-1">
                    <div className="flex justify-center items-baseline mb-8">
                      <span
                        className={`text-3xl font-bold ${pkg.highlight ? "text-secondary" : "text-foreground"}`}
                      >
                        {pkg.price}
                      </span>
                    </div>

                    <ul className="space-y-4">
                      {pkg.features.map((feature, f) => (
                        <li key={f} className="flex items-center gap-3">
                          <div
                            className={`rounded-full p-1 ${pkg.highlight ? "bg-white/20" : "bg-primary/10"}`}
                          >
                            <Check
                              className={`w-3 h-3 ${pkg.highlight ? "text-secondary" : "text-primary"}`}
                            />
                          </div>
                          <span
                            className={`text-sm ${pkg.highlight ? "text-white/90" : "text-muted-foreground"}`}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="p-8 pt-0 mt-auto">
                    <Button
                      className={`w-full font-bold rounded-full py-6 ${
                        pkg.highlight
                          ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                          : "bg-primary hover:bg-primary/90 text-white"
                      }`}
                      onClick={() =>
                        setLocation(
                          `/orcamento?package=${encodeURIComponent(pkg.name)}`,
                        )
                      }
                    >
                      Solicitar Orçamento
                    </Button>
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
              Parceria de Confiança.
            </h3>
            <p className="text-muted-foreground mb-6">
              Quer facilitar seu evento? Temos Som - pequeno, médio e grande
              porte Painel de Led P3 de alta resolução 4x2 Piso Paris 4x4
              Iluminação cênica ambiente festas e eventos Iluminação cênica,
              shows, palcos, bandas, Geradores.
            </p>
            <Button
              variant="link"
              className="text-secondary font-bold p-0 h-auto"
              onClick={() => {
                const text = "Olá! Gostaria de consultar um orçamento para os serviços da Tony Eventos (Som, Luz, Imagem). Recomendação: Espaço Castro.";
                const encodedText = encodeURIComponent(text);
                window.open(`https://wa.me/5582999227241?text=${encodedText}`, "_blank");
              }}
            >
              Consultar orçamento &rarr;
            </Button>
          </div>
          <div className="flex-1 w-full h-48 bg-white rounded-2xl flex items-center justify-center p-4">
            <img
              src={tonyLogo}
              alt="Tony Eventos"
              className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

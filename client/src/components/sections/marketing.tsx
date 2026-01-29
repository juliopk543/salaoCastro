import { useState, useEffect, useMemo } from "react";
import { Check } from "lucide-react";
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
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

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

  const { data: unavailableDates = [] } = useQuery<
    { start: string; end: string }[]
  >({
    queryKey: ["/api/unavailable-dates"],
  });

  const isDateUnavailable = (dateStr: string) => {
    if (!dateStr) return false;
    const date = new Date(dateStr + "T00:00:00");
    return unavailableDates.some((range) => {
      const start = new Date(range.start + "T00:00:00");
      const end = new Date(range.end + "T00:00:00");
      return date >= start && date <= end;
    });
  };

  const unavailableDateStrings = useMemo(() => {
    const dates: string[] = [];
    unavailableDates.forEach((range) => {
      let current = new Date(range.start + "T00:00:00");
      const end = new Date(range.end + "T00:00:00");
      while (current <= end) {
        dates.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }
    });
    return dates;
  }, [unavailableDates]);

  useEffect(() => {
    const styleId = "disable-dates-style";
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    const selectors = unavailableDateStrings
      .map(
        (date) =>
          `input[type="date"]::-webkit-calendar-picker-indicator[value="${date}"]`,
      )
      .join(", ");

    // Note: Standard HTML date inputs don't support disabling specific days via CSS easily.
    // The most reliable way is to handle it via the onChange as we are already doing,
    // but we can try to provide a visual hint if the browser supports it or use a custom picker.
    // Since we must use standard Input (type="date"), we'll stick to the current validation
    // and ensure the user understands why it's blocked via the toast.
  }, [unavailableDateStrings]);

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
                      <DialogContent className="sm:max-w-[500px] border-none bg-transparent p-0 shadow-none overflow-visible sm:top-[auto] sm:bottom-0 sm:translate-y-0 fixed bottom-0 top-[auto] translate-y-0 h-[90vh] flex flex-col justify-end [&>button]:hidden">
                        <motion.div
                          initial={{ opacity: 0, y: "100%" }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: "100%" }}
                          transition={{
                            type: "spring",
                            damping: 30,
                            stiffness: 300,
                          }}
                          className="bg-white rounded-t-[2.5rem] rounded-b-none p-8 md:p-10 shadow-[0_-16px_48px_-12px_rgba(0,0,0,0.2)] relative border-t border-primary/5 w-full max-h-full overflow-y-auto custom-scrollbar"
                        >
                          <div className="absolute top-4 right-4 z-50">
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-full backdrop-blur-sm shadow-md hover:bg-white transition-all text-[#ffffff] bg-[#124da1]"
                              >
                                <span className="text-xl">×</span>
                              </Button>
                            </DialogTrigger>
                          </div>
                          {/* Decorative elements */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full -ml-16 -mb-16 blur-2xl" />

                          <DialogHeader className="relative z-10">
                            <DialogTitle className="text-3xl font-heading text-primary leading-tight">
                              Solicitar Orçamento
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
                              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                Nome
                              </label>
                              <Input
                                required
                                placeholder="Seu nome"
                                className="rounded-2xl border-muted bg-muted/30 focus:bg-white transition-all h-12 px-4"
                                value={formData.name}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                De onde você está é?
                              </label>
                              <Select
                                onValueChange={(value) =>
                                  setFormData({ ...formData, state: value })
                                }
                              >
                                <SelectTrigger className="rounded-2xl border-muted bg-muted/30 focus:bg-white transition-all h-12 px-4">
                                  <SelectValue placeholder="Selecione o estado..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-muted shadow-xl h-[250px]">
                                  {states.map((state) => (
                                    <SelectItem key={state} value={state}>
                                      {state}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                WhatsApp
                              </label>
                              <Input
                                required
                                type="tel"
                                placeholder="(00) 00000-0000"
                                className="rounded-2xl border-muted bg-muted/30 focus:bg-white transition-all h-12 px-4"
                                value={formData.whatsapp}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, "");
                                  if (val.length <= 11) {
                                    setFormData({ ...formData, whatsapp: val });
                                  }
                                }}
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                Tipo de Evento
                              </label>
                              <Select
                                defaultValue={pkg.name
                                  .toLowerCase()
                                  .replace(/\s/g, "")}
                                onValueChange={(value) =>
                                  setFormData({ ...formData, eventType: value })
                                }
                              >
                                <SelectTrigger className="rounded-2xl border-muted bg-muted/30 focus:bg-white transition-all h-12 px-4">
                                  <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-muted shadow-xl">
                                  <SelectItem value="aniversario">
                                    Aniversário
                                  </SelectItem>
                                  <SelectItem value="casamento">
                                    Casamento
                                  </SelectItem>
                                  <SelectItem value="churrasco">
                                    Churrasco/Confraternização
                                  </SelectItem>
                                  <SelectItem value="dayuse">
                                    Day Use (Lazer)
                                  </SelectItem>
                                  <SelectItem value="fimdesemana">
                                    Fim de Semana
                                  </SelectItem>
                                  <SelectItem value="corporativo">
                                    Evento Corporativo
                                  </SelectItem>
                                  <SelectItem value="outro">Outro</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                  Data de Entrada
                                </label>
                                <Input
                                  required
                                  type="date"
                                  min={today}
                                  className={`rounded-2xl border-muted bg-muted/30 focus:bg-white transition-all h-12 px-4 ${isDateUnavailable(formData.checkIn) ? "border-red-500 text-red-500" : ""}`}
                                  value={formData.checkIn}
                                  onKeyDown={(e) => {
                                    if (e.key !== "Tab") e.preventDefault();
                                  }}
                                  onChange={(e) => {
                                    if (isDateUnavailable(e.target.value)) {
                                      toast({
                                        title: "Data Indisponível",
                                        description:
                                          "Este período já está reservado. Por favor, escolha outra data.",
                                        variant: "destructive",
                                      });
                                      return;
                                    }
                                    setFormData({
                                      ...formData,
                                      checkIn: e.target.value,
                                    });
                                  }}
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                  Data de Saída
                                </label>
                                <Input
                                  required
                                  type="date"
                                  min={formData.checkIn || today}
                                  className={`rounded-2xl border-muted bg-muted/30 focus:bg-white transition-all h-12 px-4 ${isDateUnavailable(formData.checkOut) ? "border-red-500 text-red-500" : ""}`}
                                  value={formData.checkOut}
                                  onKeyDown={(e) => {
                                    if (e.key !== "Tab") e.preventDefault();
                                  }}
                                  onChange={(e) => {
                                    if (isDateUnavailable(e.target.value)) {
                                      toast({
                                        title: "Data Indisponível",
                                        description:
                                          "Este período já está reservado. Por favor, escolha outra data.",
                                        variant: "destructive",
                                      });
                                      return;
                                    }
                                    setFormData({
                                      ...formData,
                                      checkOut: e.target.value,
                                    });
                                  }}
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                Quantidade de Convidados
                              </label>
                              <Input
                                required
                                type="text"
                                inputMode="numeric"
                                placeholder="Ex: 50"
                                className="rounded-2xl border-muted bg-muted/30 focus:bg-white transition-all h-12 px-4"
                                value={formData.guests}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, "");
                                  if (val.length <= 3) {
                                    setFormData({ ...formData, guests: val });
                                  }
                                }}
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                Mensagem (Opcional)
                              </label>
                              <Textarea
                                placeholder="Quantas pessoas? Alguma dúvida específica?"
                                className="rounded-2xl border-muted bg-muted/30 focus:bg-white transition-all min-h-[100px] p-4 resize-none"
                                value={formData.message}
                                maxLength={700}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    message: e.target.value,
                                  })
                                }
                              />
                              <div className="text-[10px] text-right text-muted-foreground mt-1">
                                {formData.message.length}/700 caracteres
                              </div>
                            </div>

                            <Button
                              type="submit"
                              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-7 text-lg rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-0.98"
                            >
                              Enviar Solicitação
                            </Button>
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
              Quer facilitar seu evento? Temos parcerias com os melhores
              fornecedores da região: buffets, decoradores e animadores com
              descontos especiais para clientes do Espaço Castro.
            </p>
            <Button
              variant="link"
              className="text-secondary font-bold p-0 h-auto"
            >
              Ver lista de parceiros &rarr;
            </Button>
          </div>
          <div className="flex-1 w-full h-48 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-primary/20">
            <span className="text-muted-foreground font-medium">
              Logos dos Parceiros
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

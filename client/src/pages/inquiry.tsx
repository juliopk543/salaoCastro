import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { Check, Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format, isBefore, startOfDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

const states = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins",
];

export default function InquiryPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Get package from URL search params or default to "Personalizado"
  const searchParams = new URLSearchParams(window.location.search);
  const pkgName = searchParams.get("package") || "Personalizado";

  const { data: unavailableDates = [] } = useQuery<{ start: string; end: string }[]>({
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

  const [formData, setFormData] = useState({
    name: "",
    eventType: pkgName.toLowerCase().replace(/\s/g, ""),
    state: "",
    checkIn: "",
    checkOut: "",
    guests: "",
    whatsapp: "",
    message: "",
  });

  const handleWhatsAppRedirect = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.checkIn || !formData.checkOut || !formData.state || !formData.eventType) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos do evento, incluindo as datas.",
        variant: "destructive",
      });
      return;
    }

    const checkInDate = format(parseISO(formData.checkIn), "dd/MM/yyyy", { locale: ptBR });
    const checkOutDate = format(parseISO(formData.checkOut), "dd/MM/yyyy", { locale: ptBR });

    const text = 
      `Olá! Gostaria de solicitar um orçamento para o *Espaço Castro*.\n\n` +
      `*Pacote:* ${pkgName}\n` +
      `*Nome:* ${formData.name}\n` +
      `*Estado:* ${formData.state}\n` +
      `*Tipo de Evento:* ${formData.eventType}\n` +
      `*WhatsApp:* ${formData.whatsapp}\n` +
      `*Convidados:* ${formData.guests}\n` +
      `*Entrada:* ${checkInDate}\n` +
      `*Saída:* ${checkOutDate}\n` +
      (formData.message ? `*Mensagem:* ${formData.message}` : "");

    const encodedText = encodeURIComponent(text.trim());
    const whatsappUrl = `https://wa.me/55082993385163?text=${encodedText}`;

    // Abrir imediatamente usando location.href para evitar bloqueadores de pop-up
    window.location.href = whatsappUrl;

    // Salvar no banco em segundo plano
    try {
      const inquiryData = {
        ...formData,
        packageName: pkgName,
        guests: formData.guests.toString(),
      };
      apiRequest("POST", "/api/inquiries", inquiryData);
    } catch (error) {
      console.error("Erro ao salvar consulta:", error);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-primary py-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10 mb-6 p-0 h-auto font-bold"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Início
          </Button>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2">Solicitar Orçamento</h1>
          <p className="text-white/80">Preencha os dados abaixo e entraremos em contato via WhatsApp.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="shadow-2xl border-none overflow-hidden">
            <CardHeader className="bg-white border-b p-6">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                </div>
                Informações do Evento
              </h2>
            </CardHeader>
            <CardContent className="p-6 md:p-10">
              <form className="space-y-6" onSubmit={handleWhatsAppRedirect}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                      Nome Completo
                    </label>
                    <Input
                      required
                      placeholder="Seu nome"
                      className="rounded-xl border-muted bg-muted/20 focus:bg-white transition-all h-12 px-4"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                      WhatsApp
                    </label>
                    <Input
                      required
                      type="tel"
                      placeholder="(00) 00000-0000"
                      className="rounded-xl border-muted bg-muted/20 focus:bg-white transition-all h-12 px-4"
                      value={formData.whatsapp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (val.length <= 11) setFormData({ ...formData, whatsapp: val });
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                      Estado
                    </label>
                    <Select
                      required
                      onValueChange={(value) => setFormData({ ...formData, state: value })}
                    >
                      <SelectTrigger className="rounded-xl border-muted bg-muted/20 focus:bg-white transition-all h-12 px-4">
                        <SelectValue placeholder="Selecione o estado..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-muted shadow-xl max-h-[300px]">
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                      Tipo de Evento
                    </label>
                    <Select
                      required
                      defaultValue={formData.eventType}
                      onValueChange={(value) => setFormData({ ...formData, eventType: value })}
                    >
                      <SelectTrigger className="rounded-xl border-muted bg-muted/20 focus:bg-white transition-all h-12 px-4">
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
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                      Data de Entrada
                    </label>
                    <div className="bg-white border rounded-2xl p-2 shadow-sm relative overflow-hidden flex flex-col min-h-[400px]">
                      <Calendar
                        mode="single"
                        selected={formData.checkIn ? parseISO(formData.checkIn) : undefined}
                        onSelect={(date) => {
                          if (date) setFormData({ ...formData, checkIn: format(date, "yyyy-MM-dd") });
                        }}
                        disabled={isDateUnavailable}
                        initialFocus
                        locale={ptBR}
                        className="w-full border-0 shadow-none p-0 flex-1 h-full"
                      />
                    </div>
                    {formData.checkIn && (
                      <p className="text-sm font-medium text-primary px-2">
                        Entrada: {format(parseISO(formData.checkIn), "PPP", { locale: ptBR })}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                      Data de Saída
                    </label>
                    <div className="bg-white border rounded-2xl p-2 shadow-sm relative overflow-hidden flex flex-col min-h-[400px]">
                      <Calendar
                        mode="single"
                        selected={formData.checkOut ? parseISO(formData.checkOut) : undefined}
                        onSelect={(date) => {
                          if (date) setFormData({ ...formData, checkOut: format(date, "yyyy-MM-dd") });
                        }}
                        disabled={(date) => isDateUnavailable(date) || (formData.checkIn ? isBefore(date, parseISO(formData.checkIn)) : false)}
                        initialFocus
                        locale={ptBR}
                        className="w-full border-0 shadow-none p-0 flex-1 h-full"
                      />
                    </div>
                    {formData.checkOut && (
                      <p className="text-sm font-medium text-primary px-2">
                        Saída: {format(parseISO(formData.checkOut), "PPP", { locale: ptBR })}
                      </p>
                    )}
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
                    className="rounded-xl border-muted bg-muted/20 focus:bg-white h-12 px-4"
                    value={formData.guests}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 4) setFormData({ ...formData, guests: val });
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Mensagem (Opcional)
                  </label>
                  <Textarea
                    placeholder="Alguma observação ou dúvida?"
                    className="rounded-xl border-muted bg-muted/20 focus:bg-white min-h-[120px] p-4 resize-none"
                    value={formData.message}
                    maxLength={1000}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                  <div className="text-[10px] text-right text-muted-foreground mt-1">
                    {formData.message.length}/1000 caracteres
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-8 text-xl rounded-xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-0.99"
                >
                  Enviar para o WhatsApp
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

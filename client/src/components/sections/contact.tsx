import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-20 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <div>
            <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">
              Fale Conosco
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">
              Agende sua Visita
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Venha conhecer pessoalmente nossa estrutura. Preencha o formulário ou entre em contato pelos nossos canais.
              Respondemos rapidamente!
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Telefone / WhatsApp</h4>
                  <p className="text-muted-foreground">82 993385163</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Localização</h4>
                  <p className="text-muted-foreground">Coruripe-AL / Loteamento por trás da pousada São João</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="border-none shadow-2xl bg-white p-2">
            <CardContent className="p-6">
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome</label>
                    <Input placeholder="Seu nome" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">WhatsApp</label>
                    <Input placeholder="(00) 00000-0000" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de Evento</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aniversario">Aniversário</SelectItem>
                      <SelectItem value="casamento">Casamento</SelectItem>
                      <SelectItem value="churrasco">Churrasco/Confraternização</SelectItem>
                      <SelectItem value="dayuse">Day Use (Lazer)</SelectItem>
                      <SelectItem value="corporativo">Evento Corporativo</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Pretendida</label>
                  <Input type="date" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mensagem (Opcional)</label>
                  <Textarea placeholder="Quantas pessoas? Alguma dúvida específica?" className="min-h-[100px]" />
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 font-bold py-6 text-lg rounded-xl shadow-lg shadow-primary/20">
                  Enviar Mensagem
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

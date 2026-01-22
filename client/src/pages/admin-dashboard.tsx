import { LayoutDashboard, Users, LogOut, Building2, Menu } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Inquiry } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function AdminHeader({ handleLogout }: { handleLogout: () => void }) {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between bg-white px-4 md:px-8 border-b border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
        <div className="flex aspect-square size-10 md:size-12 shrink-0 items-center justify-center rounded-xl md:rounded-2xl bg-[#0f52ba] text-white shadow-lg shadow-[#0f52ba]/20">
          <Building2 className="size-6 md:size-7" />
        </div>
        <div className="flex flex-col min-w-0">
          <h1 className="text-lg md:text-2xl font-black text-[#1a1f36] tracking-tight leading-none truncate">Espaço Castro</h1>
          <p className="text-[8px] md:text-[10px] text-[#0f52ba] uppercase tracking-widest font-black mt-0.5 md:mt-1 truncate">Painel Administrativo</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={handleLogout}
          className="h-10 px-4 md:px-6 rounded-[1.8rem] border-2 border-[#cc3333] text-[#cc3333] font-bold text-xs hover:bg-[#cc3333] hover:text-white transition-all active:scale-95 flex items-center gap-2 shrink-0"
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  const { data: inquiries, isLoading } = useQuery<Inquiry[]>({
    queryKey: ["/api/inquiries"],
    refetchInterval: 5000,
  });

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setLocation("/");
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f8f9fc]">
      <AdminHeader handleLogout={handleLogout} />
      
      <main className="flex-1 p-8 md:p-12 lg:p-16 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-black text-[#1a1f36] tracking-tight">Visão Geral</h2>
            <p className="text-[#4f566b] font-medium">Gerencie suas solicitações de eventos e acompanhe o desempenho.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-xl shadow-slate-200/50 border-none bg-white rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-black text-[#4f566b] uppercase tracking-widest">Total de Visitas</CardTitle>
                <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Users className="size-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-[#1a1f36]">{inquiries?.length || 0}</div>
                <p className="text-xs text-[#4f566b] mt-2 font-bold uppercase tracking-tighter opacity-70">Desde o início</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-xl shadow-slate-200/50 border-none bg-white rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-black text-[#4f566b] uppercase tracking-widest">Novos Contatos</CardTitle>
                <div className="p-3 bg-secondary/10 rounded-2xl group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                  <Users className="size-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-[#1a1f36]">{inquiries?.length || 0}</div>
                <p className="text-xs text-[#4f566b] mt-2 font-bold uppercase tracking-tighter opacity-70">Aguardando retorno</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-2xl shadow-slate-200/50 border-none bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="border-b border-slate-100 p-6 md:p-8 flex flex-row items-center justify-between bg-slate-50/30">
              <div>
                <CardTitle className="text-xl md:text-2xl font-black text-[#1a1f36] tracking-tight">Últimas Solicitações</CardTitle>
                <p className="text-xs md:text-sm text-[#4f566b] mt-1 font-medium">Lista detalhada dos últimos contatos recebidos.</p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 md:p-12 space-y-4 md:space-y-6">
                  <Skeleton className="h-16 md:h-20 w-full rounded-2xl md:rounded-3xl" />
                  <Skeleton className="h-16 md:h-20 w-full rounded-2xl md:rounded-3xl" />
                </div>
              ) : !inquiries || inquiries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 md:py-32 px-6 md:px-10 text-center">
                  <div className="p-6 md:p-8 bg-slate-100 rounded-2xl md:rounded-[2.5rem] mb-4 md:mb-6">
                    <Users className="size-10 md:size-12 text-slate-300" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-[#1a1f36]">Nenhuma solicitação</h3>
                  <p className="text-sm md:text-[#4f566b] max-w-sm mt-2 font-medium text-[#4f566b]">
                    Assim que um cliente preencher o formulário no site, os detalhes aparecerão aqui em tempo real.
                  </p>
                </div>
              ) : (
                <div className="relative w-full">
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <th className="h-16 px-8 text-left align-middle font-black text-[#4f566b] uppercase tracking-widest text-[10px]">Nome</th>
                          <th className="h-16 px-8 text-left align-middle font-black text-[#4f566b] uppercase tracking-widest text-[10px]">WhatsApp</th>
                          <th className="h-16 px-8 text-left align-middle font-black text-[#4f566b] uppercase tracking-widest text-[10px]">Estado</th>
                          <th className="h-16 px-8 text-left align-middle font-black text-[#4f566b] uppercase tracking-widest text-[10px]">Evento</th>
                          <th className="h-16 px-8 text-left align-middle font-black text-[#4f566b] uppercase tracking-widest text-[10px]">Datas</th>
                          <th className="h-16 px-8 text-left align-middle font-black text-[#4f566b] uppercase tracking-widest text-[10px]">Convidados</th>
                          <th className="h-16 px-8 text-left align-middle font-black text-[#4f566b] uppercase tracking-widest text-[10px]">Mensagem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {inquiries.map((inquiry) => (
                          <tr key={inquiry.id} className="transition-all hover:bg-slate-50/30 group">
                            <td className="p-8 align-middle font-black text-[#1a1f36] text-base">{inquiry.name}</td>
                            <td className="p-8 align-middle">
                              <a 
                                href={`https://wa.me/${inquiry.whatsapp.replace(/\D/g, '')}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-[#0f52ba] font-black text-sm hover:underline"
                              >
                                <span className="p-2 bg-[#0f52ba]/10 rounded-xl group-hover:bg-[#0f52ba] group-hover:text-white transition-colors duration-300">
                                  <Users className="size-4" />
                                </span>
                                {inquiry.whatsapp}
                              </a>
                            </td>
                            <td className="p-8 align-middle">
                              <span className="font-bold text-[#4f566b] bg-slate-100 px-4 py-1.5 rounded-full text-xs">
                                {inquiry.state}
                              </span>
                            </td>
                            <td className="p-8 align-middle">
                              <span className="inline-flex items-center rounded-2xl bg-primary/10 px-4 py-2 text-xs font-black text-primary border border-primary/20">
                                {inquiry.packageName}
                              </span>
                            </td>
                            <td className="p-8 align-middle">
                              <div className="flex flex-col gap-1 leading-none">
                                <span className="text-[10px] font-black text-[#1a1f36] uppercase tracking-tighter">Entrada: {inquiry.checkIn}</span>
                                <span className="text-[10px] font-bold text-[#4f566b] uppercase tracking-tighter opacity-70">Saída: {inquiry.checkOut}</span>
                              </div>
                            </td>
                            <td className="p-8 align-middle">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-[#1a1f36] text-lg">{inquiry.guests}</span>
                                <Users className="size-4 text-[#4f566b] opacity-40" />
                              </div>
                            </td>
                            <td className="p-8 align-middle max-w-[300px]">
                              <p className="text-[#4f566b] text-sm font-medium leading-relaxed italic line-clamp-2" title={inquiry.message || ""}>
                                {inquiry.message || "Sem mensagem"}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile List View */}
                  <div className="md:hidden divide-y divide-slate-100">
                    {inquiries.map((inquiry) => (
                      <div key={inquiry.id} className="p-6 space-y-4 hover:bg-slate-50/30 transition-all">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex flex-col gap-1">
                            <h4 className="font-black text-[#1a1f36] text-lg leading-tight">{inquiry.name}</h4>
                            <span className="text-[10px] font-black text-[#0f52ba] uppercase tracking-widest">{inquiry.state}</span>
                          </div>
                          <span className="shrink-0 inline-flex items-center rounded-xl bg-primary/10 px-3 py-1.5 text-[10px] font-black text-primary border border-primary/20">
                            {inquiry.packageName}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4">
                          <a 
                            href={`https://wa.me/${inquiry.whatsapp.replace(/\D/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-3 bg-[#0f52ba] text-white p-3 rounded-2xl shadow-lg shadow-[#0f52ba]/20 font-bold text-sm active:scale-95 transition-all"
                          >
                            <Users className="size-4" />
                            {inquiry.whatsapp}
                          </a>
                          
                          <div className="flex-1 min-w-[140px] bg-slate-100 p-3 rounded-2xl flex items-center justify-center gap-2">
                            <Users className="size-4 text-[#4f566b] opacity-40" />
                            <span className="font-black text-[#1a1f36]">{inquiry.guests} Convidados</span>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-100">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[8px] font-black text-[#4f566b] uppercase tracking-widest opacity-60">Check-in</span>
                              <span className="text-xs font-black text-[#1a1f36]">{inquiry.checkIn}</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[8px] font-black text-[#4f566b] uppercase tracking-widest opacity-60">Check-out</span>
                              <span className="text-xs font-black text-[#1a1f36]">{inquiry.checkOut}</span>
                            </div>
                          </div>
                          
                          {inquiry.message && (
                            <div className="pt-2 border-t border-slate-200/50">
                              <span className="text-[8px] font-black text-[#4f566b] uppercase tracking-widest opacity-60">Mensagem</span>
                              <p className="text-xs text-[#4f566b] font-medium leading-relaxed mt-1 italic">{inquiry.message}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

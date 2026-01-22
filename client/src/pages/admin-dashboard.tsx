import { LayoutDashboard, Users, LogOut, Building2, Menu, CalendarDays, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Inquiry } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

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
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const { data: inquiries, isLoading } = useQuery<Inquiry[]>({
    queryKey: ["/api/inquiries"],
    refetchInterval: 5000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      await apiRequest("DELETE", `/api/inquiries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inquiries"] });
      toast({
        title: "Sucesso",
        description: "Solicitação excluída com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a solicitação.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string | number) => {
    if (confirm("Tem certeza que deseja excluir esta solicitação?")) {
      deleteMutation.mutate(id);
    }
  };

  const years = useMemo(() => {
    if (!inquiries) return [];
    // Extract year from YYYY-MM-DD format (checkIn column in DB)
    const uniqueYears = new Set(inquiries.map(i => i.checkIn.split('-')[0]));
    return Array.from(uniqueYears).sort((a, b) => b.localeCompare(a));
  }, [inquiries]);

  const months = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

  const filteredInquiries = useMemo(() => {
    if (!inquiries) return [];
    return inquiries.filter(inquiry => {
      // Inquiry checkIn is stored as YYYY-MM-DD
      const [year, month] = inquiry.checkIn.split('-');
      const yearMatch = selectedYear === "all" || year === selectedYear;
      const monthMatch = selectedMonth === "all" || month === selectedMonth;
      return yearMatch && monthMatch;
    });
  }, [inquiries, selectedYear, selectedMonth]);

  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
  const paginatedInquiries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInquiries.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInquiries, currentPage]);

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
          </div>

          <Card className="shadow-2xl shadow-slate-200/50 border-none bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="border-b border-slate-100 p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50/30 gap-6">
              <div>
                <CardTitle className="text-xl md:text-2xl font-black text-[#1a1f36] tracking-tight">Últimas Solicitações</CardTitle>
                <p className="text-xs md:text-sm text-[#4f566b] mt-1 font-medium">Lista detalhada dos últimos contatos recebidos.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="h-12 w-full sm:w-[140px] rounded-2xl bg-white border-none shadow-sm font-bold text-[#1a1f36]">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-[#0f52ba]" />
                      <SelectValue placeholder="Ano" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-xl">
                    <SelectItem value="all" className="font-bold">Todos os Anos</SelectItem>
                    {years.map(year => (
                      <SelectItem key={year} value={year} className="font-bold">{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="h-12 w-full sm:w-[160px] rounded-2xl bg-white border-none shadow-sm font-bold text-[#1a1f36]">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-[#0f52ba]" />
                      <SelectValue placeholder="Mês" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-xl">
                    <SelectItem value="all" className="font-bold">Todos os Meses</SelectItem>
                    {months.map(month => (
                      <SelectItem key={month.value} value={month.value} className="font-bold">{month.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 md:p-12 space-y-4 md:space-y-6">
                  <Skeleton className="h-16 md:h-20 w-full rounded-2xl md:rounded-3xl" />
                  <Skeleton className="h-16 md:h-20 w-full rounded-2xl md:rounded-3xl" />
                </div>
              ) : !filteredInquiries || filteredInquiries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 md:py-32 px-6 md:px-10 text-center">
                  <div className="p-6 md:p-8 bg-slate-100 rounded-2xl md:rounded-[2.5rem] mb-4 md:mb-6">
                    <Users className="size-10 md:size-12 text-slate-300" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-[#1a1f36]">Nenhuma solicitação</h3>
                  <p className="text-sm md:text-[#4f566b] max-w-sm mt-2 font-medium text-[#4f566b]">
                    {selectedYear !== "all" || selectedMonth !== "all" 
                      ? "Nenhum resultado encontrado para os filtros selecionados."
                      : "Assim que um cliente preencher o formulário no site, os detalhes aparecerão aqui em tempo real."}
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
                          <th className="h-16 px-8 text-right align-middle font-black text-[#4f566b] uppercase tracking-widest text-[10px]">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {paginatedInquiries.map((inquiry) => (
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
                                <span className="text-[10px] font-black text-[#1a1f36] uppercase tracking-tighter">Entrada: {new Date(inquiry.checkIn + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                                <span className="text-[10px] font-bold text-[#4f566b] uppercase tracking-tighter opacity-70">Saída: {new Date(inquiry.checkOut + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
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
                            <td className="p-8 align-middle text-right">
                              <button
                                onClick={() => handleDelete(inquiry.id)}
                                className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                title="Excluir"
                              >
                                <Trash2 className="size-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile List View */}
                  <div className="md:hidden divide-y divide-slate-100">
                    {paginatedInquiries.map((inquiry) => (
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
                              <span className="text-xs font-black text-[#1a1f36]">{new Date(inquiry.checkIn + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[8px] font-black text-[#4f566b] uppercase tracking-widest opacity-60">Check-out</span>
                              <span className="text-xs font-black text-[#1a1f36]">{new Date(inquiry.checkOut + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                          
                          {inquiry.message && (
                            <div className="pt-2 border-t border-slate-200/50">
                              <span className="text-[8px] font-black text-[#4f566b] uppercase tracking-widest opacity-60">Mensagem</span>
                              <p className="text-xs text-[#4f566b] font-medium leading-relaxed mt-1 italic">{inquiry.message}</p>
                            </div>
                          )}

                          <div className="pt-2 border-t border-slate-200/50 flex justify-end">
                            <button
                              onClick={() => handleDelete(inquiry.id)}
                              className="inline-flex items-center gap-2 text-red-500 font-bold text-xs px-3 py-2 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Trash2 className="size-4" />
                              Excluir Registro
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 p-8 border-t border-slate-100 bg-slate-50/30">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-xl border border-slate-200 bg-white text-slate-400 disabled:opacity-50 hover:bg-slate-50 transition-all"
                      >
                        <ChevronLeft className="size-5" />
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`min-w-[40px] h-10 rounded-xl font-black text-sm transition-all ${
                              currentPage === page 
                                ? "bg-[#0f52ba] text-white shadow-lg shadow-[#0f52ba]/20" 
                                : "bg-white border border-slate-200 text-[#4f566b] hover:bg-slate-50"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-xl border border-slate-200 bg-white text-slate-400 disabled:opacity-50 hover:bg-slate-50 transition-all"
                      >
                        <ChevronRight className="size-5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

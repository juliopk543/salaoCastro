import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { LayoutDashboard, Users, LogOut, Building2 } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Inquiry } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

function AppSidebar({ handleLogout }: { handleLogout: () => void }) {
  return (
    <Sidebar collapsible="icon" className="bg-white border-r">
      <SidebarHeader className="h-20 flex items-center px-6 border-b bg-white">
        <div className="flex items-center gap-3">
          <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Building2 className="size-6" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-extrabold text-base text-slate-900 tracking-tight">Espaço Castro</span>
            <span className="text-[10px] text-primary uppercase tracking-widest font-black">Painel Administrativo</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard" isActive className="h-12 px-4 rounded-xl data-[active=true]:bg-primary data-[active=true]:text-white shadow-sm transition-all duration-200">
                  <LayoutDashboard className="size-5" />
                  <span className="font-bold text-sm">Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Solicitações" className="h-12 px-4 rounded-xl hover:bg-slate-100 transition-all duration-200">
                  <Users className="size-5" />
                  <span className="font-bold text-sm text-slate-600">Solicitações</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t bg-slate-50/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout} 
              className="text-destructive hover:text-white hover:bg-destructive h-12 px-4 rounded-xl transition-all duration-200 font-bold group shadow-sm bg-white" 
              tooltip="Sair"
            >
              <LogOut className="size-5 transition-transform group-hover:translate-x-1" />
              <span>Sair da Conta</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
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
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        <AppSidebar handleLogout={handleLogout} />
        <div className="flex flex-col flex-1 min-w-0 bg-white">
          <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center gap-4 border-b bg-white/80 backdrop-blur-xl px-6">
            <div className="flex items-center gap-2 md:hidden">
              <SidebarTrigger className="size-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 transition-all active:scale-95" />
            </div>
            <Separator orientation="vertical" className="hidden md:block h-6" />
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-slate-900 leading-none">Administrador</h1>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mt-1 md:hidden">Espaço Castro</p>
            </div>
          </header>
          
          <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-auto bg-slate-50/30">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <Card className="shadow-sm border-none bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total de Visitas</CardTitle>
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Users className="size-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black text-slate-900">{inquiries?.length || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">Desde o início</p>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm border-none bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Novos Contatos</CardTitle>
                    <div className="p-2 bg-secondary/10 rounded-full">
                      <Users className="size-4 text-secondary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black text-slate-900">{inquiries?.length || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">Aguardando retorno</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-sm border-none bg-white overflow-hidden">
                <CardHeader className="border-b bg-slate-50/50">
                  <CardTitle className="text-lg font-bold text-slate-900">Últimas Solicitações</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-12 w-full rounded-xl" />
                      <Skeleton className="h-12 w-full rounded-xl" />
                      <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                  ) : !inquiries || inquiries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                      <div className="p-4 bg-slate-100 rounded-full mb-4">
                        <Users className="size-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Nenhuma solicitação</h3>
                      <p className="text-sm text-muted-foreground max-w-xs mt-1">
                        Assim que um cliente preencher o formulário, ele aparecerá aqui.
                      </p>
                    </div>
                  ) : (
                    <div className="relative w-full overflow-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50/50">
                          <tr className="border-b transition-colors">
                            <th className="h-12 px-6 text-left align-middle font-bold text-slate-500 uppercase tracking-wider text-[10px]">Nome</th>
                            <th className="h-12 px-6 text-left align-middle font-bold text-slate-500 uppercase tracking-wider text-[10px]">WhatsApp</th>
                            <th className="h-12 px-6 text-left align-middle font-bold text-slate-500 uppercase tracking-wider text-[10px]">Estado</th>
                            <th className="h-12 px-6 text-left align-middle font-bold text-slate-500 uppercase tracking-wider text-[10px]">Evento</th>
                            <th className="h-12 px-6 text-left align-middle font-bold text-slate-500 uppercase tracking-wider text-[10px]">Datas</th>
                            <th className="h-12 px-6 text-left align-middle font-bold text-slate-500 uppercase tracking-wider text-[10px]">Convidados</th>
                            <th className="h-12 px-6 text-left align-middle font-bold text-slate-500 uppercase tracking-wider text-[10px]">Mensagem</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {inquiries.map((inquiry) => (
                            <tr key={inquiry.id} className="transition-colors hover:bg-slate-50/50 group">
                              <td className="p-6 align-middle font-bold text-slate-900">{inquiry.name}</td>
                              <td className="p-6 align-middle">
                                <a 
                                  href={`https://wa.me/${inquiry.whatsapp.replace(/\D/g, '')}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary font-bold hover:underline"
                                >
                                  {inquiry.whatsapp}
                                </a>
                              </td>
                              <td className="p-6 align-middle text-slate-600 font-medium">{inquiry.state}</td>
                              <td className="p-6 align-middle">
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                                  {inquiry.packageName}
                                </span>
                              </td>
                              <td className="p-6 align-middle text-slate-600 text-[11px] leading-tight">
                                <span className="block font-bold">In: {inquiry.checkIn}</span>
                                <span className="block opacity-70">Out: {inquiry.checkOut}</span>
                              </td>
                              <td className="p-6 align-middle font-black text-slate-900">{inquiry.guests}</td>
                              <td className="p-6 align-middle max-w-[250px]">
                                <p className="truncate text-slate-500 text-xs italic" title={inquiry.message || ""}>
                                  {inquiry.message || "Sem mensagem"}
                                </p>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

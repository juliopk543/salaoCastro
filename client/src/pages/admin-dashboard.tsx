import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarHeader } from "@/components/ui/sidebar";
import { LayoutDashboard, Users, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Inquiry } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function AppSidebar({ handleLogout }: { handleLogout: () => void }) {
  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <h1 className="text-xl font-bold text-primary">Espaço Castro</h1>
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Painel Adm</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard" isActive>
                  <LayoutDashboard className="size-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Solicitações">
                  <Users className="size-4" />
                  <span>Solicitações</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:text-destructive" tooltip="Sair">
                  <LogOut className="size-4" />
                  <span>Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
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
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar handleLogout={handleLogout} />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center gap-4 p-4 border-b">
            <SidebarTrigger />
            <h1 className="text-xl md:text-3xl font-bold truncate">Administrador</h1>
          </header>
          <main className="flex-1 p-4 md:p-8 overflow-auto">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Visitas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{inquiries?.length || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Novos Contatos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{inquiries?.length || 0}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Últimas Solicitações</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : !inquiries || inquiries.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Nenhuma solicitação encontrada.</p>
                  ) : (
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50">
                            <th className="h-12 px-4 text-left align-middle font-medium">Nome</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">WhatsApp</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Estado</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Evento</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Entrada</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Saída</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Convidados</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Mensagem</th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {inquiries.map((inquiry) => (
                            <tr key={inquiry.id} className="border-b transition-colors hover:bg-muted/50">
                              <td className="p-4 align-middle font-medium">{inquiry.name}</td>
                              <td className="p-4 align-middle">{inquiry.whatsapp}</td>
                              <td className="p-4 align-middle">{inquiry.state}</td>
                              <td className="p-4 align-middle">{inquiry.packageName}</td>
                              <td className="p-4 align-middle">{inquiry.checkIn}</td>
                              <td className="p-4 align-middle">{inquiry.checkOut}</td>
                              <td className="p-4 align-middle">{inquiry.guests}</td>
                              <td className="p-4 align-middle max-w-[200px] truncate" title={inquiry.message || ""}>
                                {inquiry.message || "-"}
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

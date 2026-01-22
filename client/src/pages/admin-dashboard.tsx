import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LayoutDashboard, Users, Calendar, Settings, LogOut } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setLocation("/");
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <div className="p-4">
                <h1 className="text-xl font-bold text-primary">Espaço Castro</h1>
                <p className="text-sm text-muted-foreground">Painel Administrativo</p>
              </div>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Users className="w-4 h-4 mr-2" />
                      <span>Clientes</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Reservas</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Settings className="w-4 h-4 mr-2" />
                      <span>Configurações</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>Sair</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Bem-vindo, Administrador</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-card rounded-lg border shadow-sm">
                <h3 className="font-semibold mb-2 text-muted-foreground">Total de Visitas</h3>
                <p className="text-3xl font-bold">128</p>
              </div>
              <div className="p-6 bg-card rounded-lg border shadow-sm">
                <h3 className="font-semibold mb-2 text-muted-foreground">Novos Contatos</h3>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="p-6 bg-card rounded-lg border shadow-sm">
                <h3 className="font-semibold mb-2 text-muted-foreground">Eventos este Mês</h3>
                <p className="text-3xl font-bold">8</p>
              </div>
            </div>
            <div className="mt-8 p-6 bg-card rounded-lg border shadow-sm">
              <h2 className="text-xl font-bold mb-4">Últimas Inquirições</h2>
              <p className="text-muted-foreground text-sm">Nenhuma nova mensagem no momento.</p>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

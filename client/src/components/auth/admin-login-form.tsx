import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  username: z.string().min(1, "Usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function AdminLoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues) {
    try {
      const response = await apiRequest("POST", "/api/admin/login", values);
      const data = await response.json();

      if (data.success) {
        localStorage.setItem("isAdmin", "true");
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao painel administrativo.",
        });
        if (onSuccess) onSuccess();
        setTimeout(() => {
          setLocation("/admin");
        }, 100);
      } else {
        toast({
          title: "Erro de autenticação",
          description: data.message || "Usuário ou senha inválidos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro de conexão",
        description: "Não foi possível validar as credenciais.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">Usuário</FormLabel>
              <FormControl>
                <Input placeholder="admin" className="h-9 text-xs rounded-xl border-slate-200" {...field} />
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" className="h-9 text-xs rounded-xl border-slate-200" {...field} />
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full h-9 text-xs font-bold rounded-xl bg-[#0f52ba] hover:bg-[#0f52ba]/90 text-white mt-2">
          Entrar
        </Button>
      </form>
    </Form>
  );
}

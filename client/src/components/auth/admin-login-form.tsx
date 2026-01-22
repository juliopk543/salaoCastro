import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

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

  function onSubmit(values: LoginValues) {
    console.log("Tentativa de login:", values);
    if (values.username.trim() === "Castro123" && values.password.trim() === "123123") {
      localStorage.setItem("isAdmin", "true");
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel administrativo.",
      });
      onSuccess?.();
      // Short delay to allow state changes to settle if needed
      setTimeout(() => {
        setLocation("/admin");
      }, 100);
    } else {
      toast({
        title: "Erro de autenticação",
        description: "Usuário ou senha inválidos.",
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

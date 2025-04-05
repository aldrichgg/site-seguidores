import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const formSchema = z.object({
  name: z.string().min(2, "O nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("Digite um email válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "A confirmação de senha deve ter no mínimo 6 caracteres"),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

const Register = () => {
  const { toast } = useToast();
  
  // Garantir que a página seja exibida do topo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Aqui será implementada a lógica de criação de conta no futuro
    console.log(values);
    toast({
      title: "Conta criada com sucesso!",
      description: "Você será redirecionado para a página de login.",
    });
  };

  return (
    <main className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 pt-24 md:pt-16">
        <div className="absolute top-20 left-4 sm:top-24 sm:left-8">
          <Button 
            variant="ghost" 
            className="gap-2 hover:bg-white/50" 
            asChild
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Voltar para o início
            </Link>
          </Button>
        </div>
        
        <div className="w-full max-w-md">
          <Card className="border-none shadow-lg glass-card fade-in">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto mb-4">
                <span className="inline-block w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent"></span>
              </div>
              <CardTitle className="text-2xl font-bold">Criar nova conta</CardTitle>
              <CardDescription>
                Preencha seus dados para criar sua conta
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input 
                              placeholder="Seu nome completo" 
                              className="pl-10" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input 
                              placeholder="seu@email.com" 
                              className="pl-10" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input 
                              type="password" 
                              placeholder="******" 
                              className="pl-10" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input 
                              type="password" 
                              placeholder="******" 
                              className="pl-10" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full rounded-full hover-lift bg-gradient-to-r from-primary to-accent">
                    Criar conta
                  </Button>
                </form>
              </Form>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-2 text-sm text-muted-foreground">
                    ou
                  </span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full rounded-full hover-lift" asChild>
                <Link to="/login">
                  Já tenho uma conta
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default Register;

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import axios from "axios"
import { useAuth } from "../contexts/AuthContext";
import { getApiBase } from "@/lib/api_base";

const formSchema = z.object({
  email: z.string().email("Digite um email válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

const Login = () => {
  const navigate = useNavigate()
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;
    const URL = getApiBase();
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${URL}/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      login(token);

      toast({
        title: `Bem-vindo, ${user.name}!`,
        description: "Login realizado com sucesso.",
      });
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "Erro ao fazer login";
    
      if (status === 401) {
        toast({
          title: "Credenciais inválidas",
          description: "Verifique seu e-mail e senha e tente novamente.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao fazer login",
          description: message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* <NavBar /> */}
      
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
              <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
              <CardDescription>
                Entre com suas credenciais para acessar sua conta
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full rounded-full hover-lift bg-gradient-to-r from-primary to-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Entrando...
                      </div>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-4 text-center text-sm">
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed" 
                  asChild
                  disabled={isLoading}
                >
                  <Link to="/">
                    Esqueceu sua senha?
                  </Link>
                </Button>
              </div>
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
              
              <Button 
                variant="outline" 
                className="w-full rounded-full hover-lift" 
                asChild
                disabled={isLoading}
              >
                <Link to="/criar-conta">
                  Criar nova conta
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* <Footer /> */}
    </main>
  );
};

export default Login;

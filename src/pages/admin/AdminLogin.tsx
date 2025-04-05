import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LockIcon, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";

const AdminLogin = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se os campos estão preenchidos
    if (!username || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    // Simulação de autenticação - em produção, conectar com API real
    setTimeout(() => {
      // Credenciais de demonstração
      if (username === "admin" && password === "admin123") {
        localStorage.setItem("adminAuth", "true");
        navigate("/admin");
      } else {
        setError("Credenciais inválidas. Tente novamente.");
      }
      setIsLoading(false);
    }, 800);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-primary to-accent relative overflow-hidden mb-4">
            <span className="absolute inset-0 bg-white/20 transform rotate-45 translate-y-2/3"></span>
            <span className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse"></span>
          </div>
          <h1 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            ImpulseGram Admin
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Painel de Gerenciamento
          </p>
        </div>
        
        <Card className="border-slate-200 dark:border-slate-800 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
            <CardDescription>
              Acesse o painel administrativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Nome de usuário</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Seu nome de usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Entrando...
                    </>
                  ) : (
                    <>Entrar</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              <p className="flex items-center justify-center">
                <LockIcon className="h-3 w-3 mr-1" />
                Acesso restrito à administradores
              </p>
            </div>
          </CardFooter>
        </Card>

        <p className="text-xs text-center text-muted-foreground mt-6">
          © {new Date().getFullYear()} ImpulseGram. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin; 
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BadgeCustom } from "@/components/ui/badge-custom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { SearchIcon, Package2Icon, ClockIcon, CheckCircleIcon, AlertCircleIcon, LoaderIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Interface para os dados do pedido
interface OrderData {
  id: string;
  email: string;
  quantity: number;
  category: string;
  platform: string;
  timestamp: string;
  status: "entregue" | "pendente" | "processando";
}

// Mock de dados para simular a consulta de pedidos (em uma aplicação real, isso viria do backend)
const mockOrders: OrderData[] = [
  {
    id: "PED-12345",
    email: "cliente@exemplo.com",
    quantity: 1000,
    category: "Seguidores",
    platform: "Instagram",
    timestamp: "2023-10-15T14:30:00",
    status: "entregue"
  },
  {
    id: "PED-54321",
    email: "maria@exemplo.com",
    quantity: 5000,
    category: "Curtidas",
    platform: "Facebook",
    timestamp: "2023-10-17T09:45:00",
    status: "processando"
  },
  {
    id: "PED-98765",
    email: "carlos@exemplo.com",
    quantity: 2000,
    category: "Visualizações",
    platform: "YouTube",
    timestamp: "2023-10-18T16:20:00",
    status: "pendente"
  }
];

const OrderStatus = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"id" | "email">("id");
  const [orderResult, setOrderResult] = useState<OrderData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  // Garantir que a página seja exibida do topo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para buscar um pedido
  const searchOrder = () => {
    if (!searchTerm.trim()) {
      setError("Por favor, informe o ID do pedido ou email");
      return;
    }
    
    setIsSearching(true);
    setError("");
    
    // Simulação de busca (em uma aplicação real, seria uma chamada API)
    setTimeout(() => {
      let result;
      
      if (searchType === "id") {
        result = mockOrders.find(order => order.id.toLowerCase() === searchTerm.toLowerCase());
      } else {
        result = mockOrders.find(order => order.email.toLowerCase() === searchTerm.toLowerCase());
      }
      
      if (result) {
        setOrderResult(result);
      } else {
        setError("Pedido não encontrado. Verifique as informações e tente novamente.");
      }
      
      setIsSearching(false);
    }, 1500);
  };
  
  // Função para obter a cor do status
  const getStatusColor = (status: OrderData["status"]) => {
    switch (status) {
      case "entregue":
        return "text-green-500";
      case "processando":
        return "text-blue-500";
      case "pendente":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };
  
  // Função para obter o ícone do status
  const getStatusIcon = (status: OrderData["status"]) => {
    switch (status) {
      case "entregue":
        return <CheckCircleIcon className="w-4 h-4" />;
      case "processando":
        return <LoaderIcon className="w-4 h-4 animate-spin" />;
      case "pendente":
        return <ClockIcon className="w-4 h-4" />;
      default:
        return <AlertCircleIcon className="w-4 h-4" />;
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <NavBar />
      
      <section className="pt-24 pb-10 md:pt-32 md:pb-16 bg-white flex-grow">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <BadgeCustom variant="outline" className="mb-3">Acompanhamento</BadgeCustom>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                Consulte seu pedido
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Acompanhe o status do seu pedido informando o ID do pedido ou o email utilizado na compra.
              </p>
            </div>
            
            <Card className="shadow-md mt-8 fade-in">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Rastreamento de pedido</CardTitle>
                <CardDescription>
                  Busque seu pedido pelo ID ou email cadastrado
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <Label htmlFor="searchType" className="mb-2 block">Buscar por</Label>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant={searchType === "id" ? "default" : "outline"}
                          className={cn(
                            "flex-1",
                            searchType === "id" ? "bg-primary text-primary-foreground" : ""
                          )}
                          onClick={() => setSearchType("id")}
                        >
                          ID do Pedido
                        </Button>
                        <Button
                          type="button"
                          variant={searchType === "email" ? "default" : "outline"}
                          className={cn(
                            "flex-1",
                            searchType === "email" ? "bg-primary text-primary-foreground" : ""
                          )}
                          onClick={() => setSearchType("email")}
                        >
                          Email
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="searchTerm" className="mb-2 block">
                        {searchType === "id" ? "Número do pedido" : "Email utilizado na compra"}
                      </Label>
                      <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="searchTerm"
                          type={searchType === "email" ? "email" : "text"}
                          placeholder={searchType === "id" ? "Ex: PED-12345" : "seu@email.com"}
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      {error && <p className="text-destructive text-sm mt-2">{error}</p>}
                    </div>
                    
                    <Button 
                      onClick={searchOrder} 
                      disabled={isSearching}
                      className="w-full sm:w-auto bg-gradient-to-r from-primary to-blue-600 hover:from-primary hover:to-blue-700"
                    >
                      {isSearching ? (
                        <>
                          <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                          Buscando...
                        </>
                      ) : (
                        "Buscar Pedido"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {orderResult && (
              <Card className="mt-8 shadow-md fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package2Icon className="h-5 w-5 text-primary" />
                    Detalhes do Pedido {orderResult.id}
                  </CardTitle>
                  <CardDescription>
                    Pedido realizado em {formatDate(orderResult.timestamp)}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p>{orderResult.email}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Plataforma</p>
                      <p>{orderResult.platform}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Serviço</p>
                      <p>{orderResult.quantity} {orderResult.category}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <p className={`flex items-center gap-1.5 ${getStatusColor(orderResult.status)}`}>
                        {getStatusIcon(orderResult.status)}
                        <span className="capitalize">{orderResult.status}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-center py-4 gap-4 flex-wrap">
                  <Button variant="outline" onClick={() => setOrderResult(null)}>
                    Nova Consulta
                  </Button>
                  <Button>Suporte ao Cliente</Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
};

export default OrderStatus; 
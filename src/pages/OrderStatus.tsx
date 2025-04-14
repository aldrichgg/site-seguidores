// OrderStatus.tsx - Atualizado para exibir info do Fama24h
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BadgeCustom } from "@/components/ui/badge-custom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import {
  SearchIcon,
  Package2Icon,
  ClockIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  LoaderIcon,
} from "lucide-react";

interface OrderData {
  status_message?: string;
  id: string;
  email: string;
  quantity: number;
  order_name: string;
  platform?: string;
  createdAt: string;
  fama?: {
    start_count?: string;
    remains?: string;
    status?: string;
  };
}

const OrderStatus = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"id" | "email">("id");
  const [orderResult, setOrderResult] = useState<OrderData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  /* console.log(orderResult); */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function formatDate(
    date: { _seconds: number; _nanoseconds?: number } | string | undefined | null
  ) {
    if (!date || typeof date === "string") return "Data indisponível";
  
    const seconds = (date as { _seconds: number })._seconds;
  
    if (!seconds || typeof seconds !== "number") return "Data inválida";
  
    const dt = new Date(seconds * 1000);
  
    const formatter = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "America/Sao_Paulo",
      timeZoneName: "short",
    });
  
    return formatter.format(dt).replace(/(\d{2}:\d{2}:\d{2})/, "$1");
  }

  const searchOrder = async () => {
    if (!searchTerm.trim()) {
      setError("Por favor, informe o ID do pedido ou email");
      return;
    }

    setIsSearching(true);
    setError("");

    try {
      const response = await axios.get(`https://new-back-end-phi.vercel.app/orders/find`, {
        params:
          searchType === "id" ? { id: searchTerm } : { email: searchTerm },
      });

      if (response.data) {
        setOrderResult(response.data);
      } else {
        setError(
          "Pedido não encontrado. Verifique as informações e tente novamente."
        );
      }
    } catch (err) {
      setError("Erro ao buscar pedido. Tente novamente mais tarde.");
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "entregue":
        return "text-green-500";
      case "inprogress":
      case "processando":
        return "text-blue-500";
      case "pending":
      case "pendente":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "entregue":
        return <CheckCircleIcon className="w-4 h-4" />;
      case "inprogress":
      case "processando":
        return <LoaderIcon className="w-4 h-4 animate-spin" />;
      case "pending":
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
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <BadgeCustom variant="outline" className="mb-3">
              Acompanhamento
            </BadgeCustom>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Consulte seu pedido
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Acompanhe o status do seu pedido informando o ID do pedido ou o
              email utilizado na compra.
            </p>
          </div>

          <Card className="shadow-md fade-in">
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
                    <Label htmlFor="searchType">Buscar por</Label>
                    <div className="flex space-x-2 mt-2">
                      <Button
                        onClick={() => setSearchType("id")}
                        variant={searchType === "id" ? "default" : "outline"}
                      >
                        ID
                      </Button>
                      <Button
                        onClick={() => setSearchType("email")}
                        variant={searchType === "email" ? "default" : "outline"}
                      >
                        Email
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="searchTerm">
                    {searchType === "id"
                      ? "Número do pedido"
                      : "Email utilizado na compra"}
                  </Label>
                  <div className="relative mt-2">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="searchTerm"
                      type={searchType === "email" ? "email" : "text"}
                      placeholder={
                        searchType === "id" ? "Ex: PED-12345" : "seu@email.com"
                      }
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {error && (
                    <p className="text-destructive text-sm mt-2">{error}</p>
                  )}
                </div>
                <Button
                  onClick={searchOrder}
                  disabled={isSearching}
                  className="w-full sm:w-auto"
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
                  Pedido realizado em {formatDate(orderResult.createdAt)}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{orderResult.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Serviço</p>
                    <p>{orderResult.order_name}</p>
                  </div>
                  {orderResult.status_message === 'Aguardando pagamento para processar o pedido...' ? (
                    ""
                  ) : (
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p
                        className={`flex items-center gap-1.5 ${getStatusColor(
                          orderResult.fama?.status || "desconhecido"
                        )}`}
                      >
                        {getStatusIcon(orderResult.fama?.status || "")}
                        <span className="capitalize">
                          {orderResult.fama?.status || "Desconhecido"}
                        </span>
                      </p>
                    </div>
                  )}

                  {orderResult.status_message === 'Aguardando pagamento para processar o pedido...' ? (
                    ""
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Início contagem
                        </p>
                        <p>{orderResult.fama?.start_count || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Restando
                        </p>
                        <p>{orderResult.fama?.remains || "N/A"}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Mensagem de status do pagamento */}
                {orderResult.status_message && (
                  <div className="mt-6 px-4 py-3 rounded-md bg-yellow-100 text-yellow-800 text-center text-sm font-medium border border-yellow-300">
                    {orderResult.status_message}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-center gap-4 flex-wrap">
                <Button variant="outline" onClick={() => setOrderResult(null)}>
                  Nova Consulta
                </Button>
                <Button
                  variant="default"
                  onClick={() =>
                    window.open("https://wa.me/5512981457975", "_blank")
                  }
                >
                  Falar com Suporte
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default OrderStatus;

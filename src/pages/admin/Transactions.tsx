import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Calendar, 
  Filter, 
  RefreshCw, 
  Download, 
  MoreHorizontal,
  CreditCard,
  DollarSign,
  ArrowUpRight
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Dados de transações fictícias para simulação
const MOCK_TRANSACTIONS = [
  {
    id: "TRX-001",
    customer: "João Silva",
    service: "1000 Seguidores Instagram",
    amount: 29.90,
    method: "Cartão de Crédito",
    status: "Concluído",
    date: "2023-08-22T14:30:00Z"
  },
  {
    id: "TRX-002",
    customer: "Maria Oliveira",
    service: "5000 Curtidas Facebook",
    amount: 89.90,
    method: "PIX",
    status: "Processando",
    date: "2023-08-21T10:15:00Z"
  },
  {
    id: "TRX-003",
    customer: "Pedro Santos",
    service: "3000 Visualizações YouTube",
    amount: 59.90,
    method: "Boleto",
    status: "Pendente",
    date: "2023-08-20T16:45:00Z"
  },
  {
    id: "TRX-004",
    customer: "Ana Costa",
    service: "10000 Seguidores Instagram",
    amount: 159.90,
    method: "Cartão de Crédito",
    status: "Concluído",
    date: "2023-08-19T09:20:00Z"
  },
  {
    id: "TRX-005",
    customer: "Lucas Mendes",
    service: "2000 Likes Instagram",
    amount: 39.90,
    method: "PIX",
    status: "Cancelado",
    date: "2023-08-18T11:10:00Z"
  }
];

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Função para filtrar transações
  const filteredTransactions = MOCK_TRANSACTIONS.filter((transaction) => {
    const matchesSearch = 
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      transaction.status.toLowerCase() === statusFilter.toLowerCase();
    
    const transactionDate = new Date(transaction.date);
    const matchesDateRange = 
      (!startDate || transactionDate >= new Date(startDate)) &&
      (!endDate || transactionDate <= new Date(endDate));
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Função para obter a cor do status da transação
  const getStatusColor = (status) => {
    switch (status) {
      case "Concluído":
        return "bg-green-100 text-green-800";
      case "Processando":
        return "bg-blue-100 text-blue-800";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Função para exportar transações
  const exportTransactions = () => {
    // Lógica de exportação de transações
    /* console.log("Exportando transações..."); */
  };

  // Função para reembolsar transação
  const refundTransaction = (transaction) => {
    // Lógica de reembolso
    /* console.log(`Reembolsando transação ${transaction.id}`); */
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho e Resumo de Transações */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted-foreground">Gerencie e acompanhe todas as transações</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportTransactions}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros e Pesquisa */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="col-span-1 md:col-span-5 relative">
          <Input
            placeholder="Buscar por ID, cliente ou serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="col-span-1 md:col-span-3">
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="concluído">Concluído</SelectItem>
              <SelectItem value="processando">Processando</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="col-span-1 md:col-span-4 flex space-x-2">
          <Input 
            type="date" 
            placeholder="Data Inicial" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input 
            type="date" 
            placeholder="Data Final" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela de Transações */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Transação</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{transaction.customer}</TableCell>
                  <TableCell>{transaction.service}</TableCell>
                  <TableCell>R$ {transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      {transaction.method}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`${getStatusColor(transaction.status)} text-xs`}
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => refundTransaction(transaction)}
                          disabled={transaction.status !== "Concluído"}
                        >
                          <DollarSign className="mr-2 h-4 w-4" />
                          Reembolsar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Resumo de Transações */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Transações
                </p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-2xl font-bold">{filteredTransactions.length}</h3>
                  <span className="text-xs text-green-500 font-medium flex items-center">
                    +12% <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-primary/10">
                <RefreshCw className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Receita Total
                </p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-2xl font-bold">
                    R$ {filteredTransactions.reduce((total, t) => total + t.amount, 0).toFixed(2)}
                  </h3>
                  <span className="text-xs text-green-500 font-medium flex items-center">
                    +8% <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-green-500/10">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Transações Concluídas
                </p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-2xl font-bold">
                    {filteredTransactions.filter(t => t.status === "Concluído").length}
                  </h3>
                  <span className="text-xs text-green-500 font-medium flex items-center">
                    +15% <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-blue-500/10">
                <CreditCard className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Transações Pendentes
                </p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-2xl font-bold">
                    {filteredTransactions.filter(t => t.status === "Pendente").length}
                  </h3>
                  <span className="text-xs text-yellow-500 font-medium flex items-center">
                    +5% <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-yellow-500/10">
                <RefreshCw className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Transactions; 
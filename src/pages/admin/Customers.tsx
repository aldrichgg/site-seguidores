import React, { useState, useEffect } from "react";
import { fetchCustomers, fetchCustomerDetail, encodeEmailId } from '@/services/customers';
import { formatBRL, formatDateTime } from '@/utils/format';
import { 
  Search, 
  Mail, 
  Phone, 
  Clock, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  PlusSquare 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Dados de clientes fictícios para simulação
const MOCK_CUSTOMERS = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 99999-8888",
    profileImage: null,
    totalSpent: 1250.75,
    ordersCount: 8,
    lastOrder: "2023-08-15",
    status: "active",
    registeredDate: "2023-01-10",
  },
  {
    id: "2",
    name: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    phone: "(21) 98765-4321",
    profileImage: null,
    totalSpent: 2780.50,
    ordersCount: 15,
    lastOrder: "2023-08-20",
    status: "active",
    registeredDate: "2022-11-05",
  },
  {
    id: "3",
    name: "Pedro Santos",
    email: "pedro.santos@email.com",
    phone: "(31) 97777-6666",
    profileImage: null,
    totalSpent: 450.25,
    ordersCount: 3,
    lastOrder: "2023-06-28",
    status: "inactive",
    registeredDate: "2023-03-22",
  },
  {
    id: "4",
    name: "Ana Costa",
    email: "ana.costa@email.com",
    phone: "(47) 96543-2109",
    profileImage: null,
    totalSpent: 3200.00,
    ordersCount: 20,
    lastOrder: "2023-08-25",
    status: "active",
    registeredDate: "2022-08-15",
  },
  {
    id: "5",
    name: "Lucas Pereira",
    email: "lucas.pereira@email.com",
    phone: "(85) 99999-0000",
    profileImage: null,
    totalSpent: 780.30,
    ordersCount: 4,
    lastOrder: "2023-07-12",
    status: "active",
    registeredDate: "2023-05-18",
  },
  {
    id: "6",
    name: "Amanda Ferreira",
    email: "amanda.ferreira@email.com",
    phone: "(51) 98888-7777",
    profileImage: null,
    totalSpent: 150.00,
    ordersCount: 1,
    lastOrder: "2023-08-01",
    status: "inactive",
    registeredDate: "2023-07-30",
  },
  {
    id: "7",
    name: "Roberto Almeida",
    email: "roberto.almeida@email.com",
    phone: "(27) 99876-5432",
    profileImage: null,
    totalSpent: 890.45,
    ordersCount: 5,
    lastOrder: "2023-08-10",
    status: "active",
    registeredDate: "2023-02-14",
  },
  {
    id: "8",
    name: "Juliana Lima",
    email: "juliana.lima@email.com",
    phone: "(11) 95555-4444",
    profileImage: null,
    totalSpent: 1890.20,
    ordersCount: 12,
    lastOrder: "2023-08-22",
    status: "active",
    registeredDate: "2022-12-30",
  },
];

// Lista de pedidos fictícios para um cliente específico
const MOCK_CUSTOMER_ORDERS = [
  {
    id: "ORD-001",
    date: "2023-08-22",
    service: "1000 seguidores Instagram",
    status: "completed",
    amount: 120.00
  },
  {
    id: "ORD-002",
    date: "2023-08-15",
    service: "5000 curtidas Instagram",
    status: "completed",
    amount: 150.00
  },
  {
    id: "ORD-003",
    date: "2023-08-05",
    service: "500 comentários Instagram",
    status: "completed",
    amount: 100.00
  },
  {
    id: "ORD-004",
    date: "2023-07-28",
    service: "10000 visualizações TikTok",
    status: "completed",
    amount: 200.00
  },
];


const CustomerDetailsDialog = ({ customerId, isOpen, setIsOpen }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!customerId || !isOpen) return;
    setLoading(true);
    setError(null);
    fetchCustomerDetail(customerId)
      .then((data) => {
        console.log(data)
        setCustomer(data)
      
      })
      .catch(() => setError('Erro ao carregar detalhes do cliente.'))
      .finally(() => setLoading(false));
  }, [customerId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes do Cliente</DialogTitle>
          <DialogDescription>
            Informações completas e histórico do cliente.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Carregando...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : customer ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            <div className="col-span-1">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center mb-4">
                    <Avatar className="h-24 w-24 mb-3">
                      <AvatarFallback className="text-xl">{customer.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold">{customer.fullName}</h3>
                    <Badge variant={customer.status === "active" ? "default" : "secondary"} className="mt-1">
                      {customer.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{customer.phone || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Cliente desde {formatDateTime(customer.createdAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="col-span-1 md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Pedidos</CardTitle>
                  <CardDescription>Lista de pedidos do cliente</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customer.orders.slice(0, 50).map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>
                            <Badge variant={order.status === "completed" ? "default" : order.status === "pending" ? "secondary" : "destructive"}>
                              {order.status === "completed" ? "Concluído" : order.status === "pending" ? "Pendente" : "Cancelado"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatBRL(order.amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchCustomers({
      search: searchTerm,
      page,
      limit,
      sort: 'createdAt_desc',
    })
      .then((res) => {
        let filtered = res.data;
        if (statusFilter !== 'all') {
          filtered = filtered.filter(c => c.status === statusFilter);
        }
        setCustomers(filtered);
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      })
      .catch(() => setError('Erro ao carregar clientes.'))
      .finally(() => setLoading(false));
  }, [searchTerm, statusFilter, page]);

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };

  const handleDeleteCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
      </div>
      
      {/* Filtros e pesquisa */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="col-span-1 md:col-span-7 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="col-span-1 md:col-span-3">
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <Button variant="outline" className="w-full">
            <Filter className="mr-2 h-4 w-4" />
            Mais Filtros
          </Button>
        </div>
      </div>
      
      {/* Tabela de clientes */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Carregando...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pedidos</TableHead>
                  <TableHead>Total Gasto</TableHead>
                  <TableHead>Primeira Compra</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>
                              {customer.fullName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{customer.fullName}</p>
                            <p className="text-xs text-muted-foreground">
                              Desde {customer.createdAt ? formatDateTime(customer.createdAt) : '—'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{customer.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{customer.phone || '—'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={customer.status === "active" ? "default" : "secondary"} className="mt-1">
                          {customer.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>{customer.orders.length}</TableCell>
                      <TableCell>{formatBRL(customer.orders.reduce((acc, o) => acc + o.amount, 0))}</TableCell>
                      <TableCell>{customer.createdAt ? formatDateTime(customer.createdAt) : '—'}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleViewDetails(customer)}>
                              <FileText className="mr-2 h-4 w-4" />
                              Ver detalhes
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <AlertCircle className="h-6 w-6 mb-2" />
                        <p>Nenhum cliente encontrado com os filtros aplicados.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Paginação */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Exibindo <span className="font-medium">{customers.length}</span> de <span className="font-medium">{total}</span> clientes
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {[...Array(totalPages)].map((_, idx) => (
            <Button
              key={idx}
              variant={page === idx + 1 ? "outline" : "ghost"}
              size="icon"
              className={page === idx + 1 ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </Button>
          ))}
          <Button variant="outline" size="icon" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Modal de detalhes do cliente */}
      {selectedCustomer && (
        <CustomerDetailsDialog 
          customerId={selectedCustomer.id} 
          isOpen={isDetailsOpen} 
          setIsOpen={setIsDetailsOpen} 
        />
      )}
      
      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todos os dados do cliente 
              <span className="font-medium"> {selectedCustomer?.name} </span> 
              serão permanentemente removidos dos nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Customers; 
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useServices } from '@/hooks/useServices';
import { useAttendantSales } from '@/hooks/useAttendantSales';
import { getApiBase } from '@/lib/api_base';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus,
  ShoppingCart,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Copy,
  Check,
  Percent,
  Activity,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

interface NewOrder {
  email: string;
  firstName: string;
  lastName: string;
  cpf: string;
  orderType: string;
  platform: string;
  quantity: number;
  amountBRL: string;
  link: string;
  status: string;
  phone: string;
  serviceId: number;
  famaId: string;
  selectedServiceId: number;
  selectedServiceUniqueId: string; // ID único do serviço
}

const AttendantCreateOrder = () => {
  const { user } = useAuth();
  const { services: allServices, loading: servicesLoading } = useServices(undefined, undefined, true);
  const { sales, loading: salesLoading, refetch } = useAttendantSales();
  
  // Estados do formulário
  const [newOrder, setNewOrder] = useState<NewOrder>({
    email: '',
    firstName: '',
    lastName: '',
    cpf: '',
    orderType: 'seguidores',
    platform: 'Instagram',
    quantity: 1000,
    amountBRL: '47.30',
    link: '',
    status: 'approved',
    phone: '',
    serviceId: 0,
    famaId: '',
    selectedServiceId: 0,
    selectedServiceUniqueId: '',
  });

  // Estados de controle
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [generatePix, setGeneratePix] = useState(false);
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [pixData, setPixData] = useState<{
    qrCode: string;
    pixCode: string;
    paymentId: string;
    orderId: string;
  } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>("");

  // Estados do dropdown de serviços
  const [serviceSearchTerm, setServiceSearchTerm] = useState("");
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);

  // Estados para tabela e filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Estados para modal de detalhes
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.service-dropdown-container')) {
        setIsServiceDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Função para calcular preço baseado no serviço selecionado
  const calculatePrice = (serviceId: number) => {
    const service = allServices.find(s => s.serviceId === serviceId);
    if (service) {
      return service.price.toFixed(2);
    }
    return '47.30';
  };

  // Função para buscar serviço por ID único
  const getServiceByUniqueId = (uniqueId: string) => {
    return allServices.find(s => s.id === uniqueId);
  };

  // Função para resetar o formulário
  const resetNewOrder = () => {
    setNewOrder({
      email: '',
      firstName: '',
      lastName: '',
      cpf: '',
      orderType: 'seguidores',
      platform: 'Instagram',
      quantity: 1000,
      amountBRL: '47.30',
      link: '',
      status: 'approved',
      phone: '',
      serviceId: 0,
      famaId: '',
      selectedServiceId: 0,
      selectedServiceUniqueId: '',
    });
    setGeneratePix(false);
    setServiceSearchTerm("");
    setIsServiceDropdownOpen(false);
  };

  // Função para formatar quantidade
  const formatQuantity = (quantity: number) => {
    if (quantity >= 1000) {
      return `${(quantity / 1000).toFixed(quantity % 1000 === 0 ? 0 : 1)}k`;
    }
    return quantity.toString();
  };

  // Função para obter ícone da plataforma
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return '📸';
      case 'tiktok':
        return '🎵';
      case 'youtube':
        return '📺';
      default:
        return '📱';
    }
  };

  // Função para obter ícone do tipo de serviço
  const getServiceTypeIcon = (serviceType: string) => {
    switch (serviceType.toLowerCase()) {
      case 'seguidores':
        return '👥';
      case 'curtidas':
        return '❤️';
      case 'visualizacoes':
        return '👁️';
      case 'inscritos':
        return '📺';
      default:
        return '⭐';
    }
  };

  // Função para filtrar serviços
  const getFilteredServices = () => {
    if (!allServices) return [];
    
    return allServices.filter(service => {
      const searchLower = serviceSearchTerm.toLowerCase();
      return (
        service.name.toLowerCase().includes(searchLower) ||
        service.platform.toLowerCase().includes(searchLower) ||
        service.serviceType.toLowerCase().includes(searchLower) ||
        service.quantity.toString().includes(searchLower)
      );
    });
  };

  // Função para filtrar pedidos
  const getFilteredOrders = () => {
    if (!sales?.orders) return [];
    
    return sales.orders.filter(order => {
      const matchesSearch = searchTerm === "" || 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customer?.email || order.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || (order.order?.status || order.status) === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  // Função para paginar pedidos
  const getPaginatedOrders = () => {
    const filtered = getFilteredOrders();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Função para obter status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para formatar moeda
  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  // Função para abrir modal de detalhes
  const openDetailsModal = (order: any) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  // Função para fechar modal de detalhes
  const closeDetailsModal = () => {
    setSelectedOrder(null);
    setIsDetailsModalOpen(false);
  };

  // Função para verificar o status do pagamento no Firebase
  const checkPaymentStatus = (paymentId: string) => {
    const paymentRef = doc(db, 'orders', paymentId);
    
    const unsubscribe = onSnapshot(paymentRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const status = data.status;
        
        setPaymentStatus(status);
        
        if (status === 'approved') {
          unsubscribe();
          setIsPixModalOpen(false);
          toast({
            title: "Pagamento aprovado!",
            description: "O pedido foi processado com sucesso.",
          });
        }
      }
    }, (error) => {
      console.error("Erro ao verificar status do pagamento:", error);
    });
    
    return unsubscribe;
  };

  // Função para criar pedido
  const handleCreateOrder = async () => {
    try {
      setCreating(true);
      
      // Validação para modo PIX
      if (generatePix && !newOrder.selectedServiceUniqueId) {
        toast({
          title: "Erro",
          description: "Por favor, selecione um serviço antes de criar o pedido.",
          variant: "destructive",
        });
        return;
      }
      
      // Validação básica
      if (!newOrder.email || !newOrder.firstName || !newOrder.lastName) {
        toast({
          title: "Erro",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive",
        });
        return;
      }

      // Se não for gerar PIX, cria pedido normal
      if (!generatePix) {
        const orderPayload = {
          email: newOrder.email.trim().toLowerCase(),
          firstName: newOrder.firstName.trim(),
          lastName: newOrder.lastName.trim(),
          cpf: newOrder.cpf.trim(),
          orderName: newOrder.orderType,
          platform: newOrder.platform,
          quantity: Number(newOrder.quantity) || 0,
          amountCents: Math.round(parseFloat(newOrder.amountBRL) * 100),
          link: newOrder.link || undefined,
          status: newOrder.status,
          phone: newOrder.phone || undefined,
          serviceId: newOrder.serviceId || undefined,
          providerOrderId: newOrder.famaId || undefined,
          attendantId: user?.user_id, // ← VINCULAÇÃO AUTOMÁTICA AO ATENDENTE
        };

        const response = await fetch(`${getApiBase()}/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        });

        if (!response.ok) throw new Error(`POST /orders ${response.status}`);
        const created = await response.json();

        setIsCreateOpen(false);
        resetNewOrder();
        
        // Atualizar lista de pedidos
        refetch();
        
        toast({
          title: "Pedido criado com sucesso!",
          description: "O pedido foi criado e vinculado a você.",
        });
        return;
      }

      // Se for gerar PIX, usa a mesma lógica da página de Payment
      const valueCents = Math.round(parseFloat(newOrder.amountBRL) * 100);
      const quantityFromTitle = Number(newOrder.quantity) || 0;
      
      // Busca o serviço selecionado para obter o nome correto
      const selectedService = getServiceByUniqueId(newOrder.selectedServiceUniqueId);
      const description = selectedService ? selectedService.name : `${newOrder.quantity} ${newOrder.orderType} ${newOrder.platform}`;

      // Formatar número do celular no formato internacional
      const formatPhoneNumber = (phone: string) => {
        const cleanPhone = phone.replace(/\D/g, "");
        if (cleanPhone.length === 11 && cleanPhone.startsWith("11")) {
          return `+55${cleanPhone}`;
        } else if (cleanPhone.length === 10) {
          return `+5511${cleanPhone}`;
        } else if (cleanPhone.startsWith("55")) {
          return `+${cleanPhone}`;
        } else if (cleanPhone.startsWith("+55")) {
          return cleanPhone;
        }
        return "+5511999999999"; // Fallback
      };

      const formattedPhone = formatPhoneNumber(newOrder.phone);


      // Usa exatamente a mesma estrutura da página de Payment
      const body = {
        paymentMethod: "pix",
        value: valueCents,
        description,
        postbackUrl: "https://new-back-end-phi.vercel.app/payments/webhook",
        customer: {
          name: `${newOrder.firstName} ${newOrder.lastName}`.trim(),
          email: newOrder.email.trim().toLowerCase(),
          phone: formattedPhone,
        },
        items: [
          {
            name: description,
            quantity: quantityFromTitle,
            unitAmount: valueCents,
          },
        ],
        metadata: {
          service_id: newOrder.selectedServiceId,
          link: newOrder.link || "",
          quantity: quantityFromTitle,
          email: newOrder.email.trim().toLowerCase(),
          celular: formattedPhone,
          platform: newOrder.platform.toLowerCase(),
          source: "attendant_manual", // Identifica que foi criado por atendente
          attendant_id: user?.user_id, // ← VINCULAÇÃO AUTOMÁTICA AO ATENDENTE
        },
        paymentPlatform: 'manual'
      };


      // Enviando pagamento (mesma lógica da página de Payment)
      const response = await fetch(`${getApiBase()}/payments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      
      if (response.ok) {
        // Exibe modal com PIX (mesma estrutura da página de Payment)
        setPixData({
          qrCode: result.qrcode_image,
          pixCode: result.pixCode,
          paymentId: result.id,
          orderId: result.id, // Usa o ID do pagamento como ID do pedido
        });

        // Iniciar verificação do status do pagamento (mesma lógica da página de Payment)
        if (result.id) {
          checkPaymentStatus(result.id);
        }

        setIsCreateOpen(false);
        setIsPixModalOpen(true);
        resetNewOrder();
        
        // Atualizar lista de pedidos
        refetch();
      } else {
        toast({
          title: "Erro ao criar pedido",
          description: "Tente novamente.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      toast({
        title: "Falha ao criar pedido",
        description: "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Criar Pedido</h1>
          <p className="text-gray-600">Crie um novo pedido para um cliente e visualize todos os seus pedidos</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Pedido
        </Button>
      </div>

      {/* Resumo de Vendas */}
      {sales && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sales.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                Pedidos criados por você
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(sales.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                Valor total das vendas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sua Comissão</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(sales.totalSales)}</div>
              <p className="text-xs text-muted-foreground">
                Comissão calculada
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Meus Pedidos
          </CardTitle>
          <CardDescription>
            Visualize e gerencie todos os pedidos que você criou
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Input
                placeholder="Buscar por ID do pedido ou email do cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Filtrar por Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="approved">Aprovado</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={refetch} variant="outline" className="w-full md:w-auto">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>

          {/* Tabela de Pedidos */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID do Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Carregando pedidos...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : getPaginatedOrders().length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {getFilteredOrders().length === 0 ? (
                        sales?.orders?.length === 0 ? (
                          "Nenhum pedido encontrado. Crie seu primeiro pedido!"
                        ) : (
                          "Nenhum pedido corresponde aos filtros aplicados."
                        )
                      ) : (
                        "Nenhum pedido nesta página."
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  getPaginatedOrders().map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{order.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer?.name || order.customer?.email || order.email}</div>
                          <div className="text-sm text-gray-500">{order.customer?.email || order.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.product?.name || 'Produto não informado'}</div>
                          <div className="text-sm text-gray-500">
                            {order.product?.quantity?.toLocaleString() || 0} {order.product?.platform || ''}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-green-600">
                          {formatCurrency(order.order?.amount || order.amount || 0)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.order?.status || order.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {formatDate(order.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            title="Ver detalhes"
                            onClick={() => openDetailsModal(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          {getFilteredOrders().length > itemsPerPage && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-gray-700">
                Página {currentPage} de {Math.ceil(getFilteredOrders().length / itemsPerPage)}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(getFilteredOrders().length / itemsPerPage), prev + 1))}
                disabled={currentPage === Math.ceil(getFilteredOrders().length / itemsPerPage)}
              >
                Próxima
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal: Novo Pedido */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Novo Pedido</DialogTitle>
            <DialogDescription>
              Crie um pedido para um cliente. O pedido será automaticamente vinculado a você.
            </DialogDescription>
          </DialogHeader>

          {/* Checkbox para gerar PIX - sempre visível no topo */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={generatePix}
                onChange={(e) => {
                  setGeneratePix(e.target.checked);
                  if (e.target.checked) {
                    setNewOrder((o) => ({ ...o, status: "pending" }));
                  }
                }}
                className="rounded"
              />
              <span className="text-sm font-medium text-blue-800">
                Gerar PIX para este pedido
              </span>
            </label>
            <p className="text-xs text-blue-600 mt-1">
              {generatePix
                ? "Formulário simplificado - apenas dados essenciais serão solicitados"
                : "Quando ativado, o pedido será criado com status 'Pendente' e um PIX será gerado para o cliente pagar."
              }
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-1">
            {generatePix ? (
              // Formulário simplificado para PIX
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Email *</label>
                    <input
                      className="w-full p-2 rounded border"
                      value={newOrder.email}
                      onChange={(e) =>
                        setNewOrder((o) => ({ ...o, email: e.target.value }))
                      }
                      placeholder="cliente@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Telefone *</label>
                    <input
                      className="w-full p-2 rounded border"
                      value={newOrder.phone}
                      onChange={(e) =>
                        setNewOrder((o) => ({ ...o, phone: e.target.value }))
                      }
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1">Nome Completo *</label>
                  <input
                    className="w-full p-2 rounded border"
                    value={`${newOrder.firstName} ${newOrder.lastName}`.trim()}
                    onChange={(e) => {
                      const fullName = e.target.value;
                      const nameParts = fullName.split(' ');
                      setNewOrder((o) => ({
                        ...o,
                        firstName: nameParts[0] || '',
                        lastName: nameParts.slice(1).join(' ') || '',
                      }));
                    }}
                    placeholder="João Silva"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative service-dropdown-container">
                    <label className="block text-sm mb-1">Serviço *</label>

                    {/* Campo de busca e seleção */}
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full p-2 rounded border pr-10"
                        placeholder="Buscar serviço (ex: seguidores, instagram, 5000)..."
                        value={serviceSearchTerm}
                        onChange={(e) => {
                          setServiceSearchTerm(e.target.value);
                          setIsServiceDropdownOpen(true);
                        }}
                        onFocus={() => setIsServiceDropdownOpen(true)}
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        {isServiceDropdownOpen ? (
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Dropdown de serviços */}
                    {isServiceDropdownOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                        {getFilteredServices().length === 0 ? (
                          <div className="p-3 text-gray-500 text-center">
                            {serviceSearchTerm ? "Nenhum serviço encontrado" : "Carregando serviços..."}
                          </div>
                        ) : (
                          <div className="py-1">
                            {/* Agrupar por plataforma */}
                            {['instagram', 'tiktok', 'youtube'].map(platform => {
                              const platformServices = getFilteredServices().filter(service =>
                                service.platform.toLowerCase() === platform
                              );

                              if (platformServices.length === 0) return null;

                              return (
                                <div key={platform}>
                                  {/* Cabeçalho da plataforma */}
                                  <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                      <span>{getPlatformIcon(platform)}</span>
                                      <span className="capitalize">{platform}</span>
                                      <span className="text-gray-500">({platformServices.length})</span>
                                    </div>
                                  </div>

                                  {/* Serviços da plataforma */}
                                  {platformServices.map((service) => (
                                    <button
                                      key={service.serviceId}
                                      className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                                      onClick={() => {
                                        setNewOrder((o) => ({
                                          ...o,
                                          selectedServiceId: service.serviceId,
                                          selectedServiceUniqueId: service.id, // ID único
                                          serviceId: service.serviceId,
                                          orderType: service.serviceType as any,
                                          platform: service.platform as any,
                                          quantity: service.quantity,
                                          amountBRL: service.price.toFixed(2), // Usar preço direto
                                        }));
                                        setServiceSearchTerm("");
                                        setIsServiceDropdownOpen(false);
                                      }}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <span>{getServiceTypeIcon(service.serviceType)}</span>
                                          <div>
                                            <div className="font-medium text-sm">
                                              {formatQuantity(service.quantity)} {service.serviceType}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              {service.deliveryTime}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div className="font-semibold text-sm text-green-600">
                                            R$ {service.price.toFixed(2).replace('.', ',')}
                                          </div>
                                          {service.originalPrice > service.price && (
                                            <div className="text-xs text-gray-400 line-through">
                                              R$ {service.originalPrice.toFixed(2).replace('.', ',')}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Serviço selecionado */}
                    {newOrder.selectedServiceUniqueId && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                        {(() => {
                          const service = getServiceByUniqueId(newOrder.selectedServiceUniqueId);
                          
                          if (service) {
                            return (
                              <div className="flex items-center gap-2 text-sm">
                                <span>{getPlatformIcon(service.platform)}</span>
                                <span>{getServiceTypeIcon(service.serviceType)}</span>
                                <span className="font-medium">
                                  {formatQuantity(service.quantity)} {service.serviceType} {service.platform}
                                </span>
                                <span className="text-green-600 font-semibold">
                                  R$ {service.price.toFixed(2).replace('.', ',')}
                                </span>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Valor (R$) *</label>
                    <input
                      className="w-full p-2 rounded border bg-gray-50"
                      value={newOrder.amountBRL}
                      readOnly
                      placeholder="Auto-calculado"
                    />
                  </div>
                </div>

                {/* Informações do serviço selecionado */}
                {newOrder.selectedServiceUniqueId && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Detalhes do Serviço</h4>
                    {(() => {
                      const service = getServiceByUniqueId(newOrder.selectedServiceUniqueId);
                      if (service) {
                        return (
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-blue-600">Plataforma:</span>
                              <span className="ml-2 font-medium">{service.platform}</span>
                            </div>
                            <div>
                              <span className="text-blue-600">Tipo:</span>
                              <span className="ml-2 font-medium">{service.serviceType}</span>
                            </div>
                            <div>
                              <span className="text-blue-600">Quantidade:</span>
                              <span className="ml-2 font-medium">{service.quantity.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-blue-600">Entrega:</span>
                              <span className="ml-2 font-medium">{service.deliveryTime}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}

                <div>
                  <label className="block text-sm mb-1">Link do Perfil *</label>
                  <input
                    className="w-full p-2 rounded border"
                    value={newOrder.link}
                    onChange={(e) =>
                      setNewOrder((o) => ({ ...o, link: e.target.value }))
                    }
                    placeholder="https://instagram.com/usuario"
                  />
                </div>

                {/* Campos ocultos mas necessários */}
                <input type="hidden" value={newOrder.serviceId} />
                <input type="hidden" value={newOrder.status} />
              </div>
            ) : (
              // Formulário completo (modo original)
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Email *</label>
                  <input
                    className="w-full p-2 rounded border"
                    value={newOrder.email}
                    onChange={(e) =>
                      setNewOrder((o) => ({ ...o, email: e.target.value }))
                    }
                    placeholder="cliente@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Telefone</label>
                  <input
                    className="w-full p-2 rounded border"
                    value={newOrder.phone}
                    onChange={(e) =>
                      setNewOrder((o) => ({ ...o, phone: e.target.value }))
                    }
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Nome *</label>
                  <input
                    className="w-full p-2 rounded border"
                    value={newOrder.firstName}
                    onChange={(e) =>
                      setNewOrder((o) => ({ ...o, firstName: e.target.value }))
                    }
                    placeholder="João"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Sobrenome *</label>
                  <input
                    className="w-full p-2 rounded border"
                    value={newOrder.lastName}
                    onChange={(e) =>
                      setNewOrder((o) => ({ ...o, lastName: e.target.value }))
                    }
                    placeholder="Silva"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">CPF</label>
                  <input
                    className="w-full p-2 rounded border"
                    value={newOrder.cpf}
                    onChange={(e) =>
                      setNewOrder((o) => ({ ...o, cpf: e.target.value }))
                    }
                    placeholder="123.456.789-00"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Tipo do Pedido</label>
                  <select
                    className="w-full p-2 rounded border"
                    value={newOrder.orderType}
                    onChange={(e) =>
                      setNewOrder((o) => ({ ...o, orderType: e.target.value }))
                    }
                  >
                    <option value="seguidores">Seguidores</option>
                    <option value="curtidas">Curtidas</option>
                    <option value="visualizacoes">Visualizações</option>
                    <option value="inscritos">Inscritos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Plataforma</label>
                  <select
                    className="w-full p-2 rounded border"
                    value={newOrder.platform}
                    onChange={(e) =>
                      setNewOrder((o) => ({ ...o, platform: e.target.value }))
                    }
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Quantidade</label>
                  <input
                    type="number"
                    className="w-full p-2 rounded border"
                    value={newOrder.quantity}
                    onChange={(e) =>
                      setNewOrder((o) => ({ ...o, quantity: Number(e.target.value) }))
                    }
                    placeholder="1000"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Valor (R$)</label>
                  <input
                    className="w-full p-2 rounded border"
                    value={newOrder.amountBRL}
                    onChange={(e) =>
                      setNewOrder((o) => ({ ...o, amountBRL: e.target.value }))
                    }
                    placeholder="47.30"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Link do Perfil</label>
                  <input
                    className="w-full p-2 rounded border"
                    value={newOrder.link}
                    onChange={(e) =>
                      setNewOrder((o) => ({ ...o, link: e.target.value }))
                    }
                    placeholder="https://instagram.com/usuario"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">ID do Provedor</label>
                  <input
                    className="w-full p-2 rounded border"
                    value={newOrder.famaId}
                    onChange={(e) =>
                      setNewOrder((o) => ({ ...o, famaId: e.target.value }))
                    }
                    placeholder="12345"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Status</label>
                  <select
                    className="w-full p-2 rounded border"
                    value={newOrder.status}
                    onChange={(e) =>
                      setNewOrder((o) => ({ ...o, status: e.target.value }))
                    }
                  >
                    <option value="approved">Aprovado</option>
                    <option value="pending">Pendente</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex-shrink-0 pt-4">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateOrder} disabled={creating}>
              {creating ? "Criando..." : "Criar Pedido"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: PIX Gerado */}
      <Dialog open={isPixModalOpen} onOpenChange={setIsPixModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              PIX Gerado com Sucesso!
            </DialogTitle>
            <DialogDescription>
              O pedido foi criado e o PIX foi gerado. Envie as informações abaixo para o cliente.
            </DialogDescription>
          </DialogHeader>

          {pixData && (
            <div className="flex-1 overflow-y-auto space-y-4 px-1">
              {/* Informações do Pedido */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Informações do Pedido</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="break-all">
                    <span className="text-gray-600">ID do Pedido:</span>
                    <span className="ml-1 font-mono text-xs">{pixData.orderId}</span>
                  </div>
                  <div className="break-all">
                    <span className="text-gray-600">ID do Pagamento:</span>
                    <span className="ml-1 font-mono text-xs">{pixData.paymentId}</span>
                  </div>
                </div>
              </div>

              {/* Indicador de status do pagamento */}
              {paymentStatus && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                    <span className="text-blue-800 font-medium text-sm">
                      Aguardando confirmação do pagamento...
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1 text-center">
                    Status: {paymentStatus}
                  </p>
                </div>
              )}

              {/* QR Code */}
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">QR Code PIX</h3>
                <div className="inline-block p-2 sm:p-3 bg-white border-2 border-gray-200 rounded-lg">
                  <img
                    src={pixData.qrCode}
                    alt="QR Code PIX"
                    className="mx-auto"
                    style={{ maxWidth: "150px", height: "auto" }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  O cliente pode escanear este QR Code com o aplicativo do banco
                </p>
              </div>

              {/* Código PIX */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h3 className="font-semibold text-green-800 mb-2 text-sm">Código PIX</h3>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={pixData.pixCode}
                    readOnly
                    className="flex-1 p-2 border border-green-300 rounded text-xs font-mono bg-white break-all"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(pixData.pixCode);
                      toast({
                        title: "Código PIX copiado!",
                        description: "O código foi copiado para a área de transferência.",
                      });
                    }}
                    className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm whitespace-nowrap"
                  >
                    Copiar
                  </button>
                </div>
                <p className="text-xs text-green-700 mt-2">
                  O cliente pode copiar e colar este código no aplicativo do banco
                </p>
              </div>

              {/* Instruções */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h3 className="font-semibold text-blue-800 mb-2 text-sm">Instruções para o Cliente</h3>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Escaneie o QR Code ou copie o código PIX</li>
                  <li>• Abra o aplicativo do seu banco</li>
                  <li>• Selecione "PIX" e "Pagar com PIX"</li>
                  <li>• Escaneie o QR Code ou cole o código</li>
                  <li>• Confirme o pagamento</li>
                  <li>• O pedido será processado automaticamente após o pagamento</li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter className="flex-shrink-0 pt-4 flex flex-col sm:flex-row gap-2">
            <button
              className="w-full sm:w-auto px-4 py-2 rounded border hover:bg-gray-50 text-sm"
              onClick={() => setIsPixModalOpen(false)}
            >
              Fechar
            </button>
            <button
              className="w-full sm:w-auto px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
              onClick={() => {
                if (pixData) {
                  const message = `PIX Gerado para seu pedido!\n\nQR Code: ${pixData.qrCode}\nCódigo PIX: ${pixData.pixCode}\n\nID do Pedido: ${pixData.orderId}`;
                  navigator.clipboard.writeText(message);
                  toast({
                    title: "Informações do PIX copiadas!",
                    description: "As informações foram copiadas para a área de transferência.",
                  });
                }
              }}
            >
              Copiar Informações
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Detalhes do Pedido */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              Detalhes do Pedido
            </DialogTitle>
            <DialogDescription>
              Informações completas sobre o pedido selecionado
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="flex-1 overflow-y-auto space-y-6 px-1">
              {/* Informações Básicas */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">ID do Pedido:</span>
                    <span className="ml-2 font-mono text-xs bg-gray-200 px-2 py-1 rounded">
                      {selectedOrder.id}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2">{getStatusBadge(selectedOrder.order?.status || selectedOrder.status)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Data de Criação:</span>
                    <span className="ml-2 font-medium">{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Valor:</span>
                    <span className="ml-2 font-semibold text-green-600">
                      {formatCurrency(selectedOrder.order?.amount || selectedOrder.amount || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Informações do Cliente */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3">Informações do Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600">Email:</span>
                    <span className="ml-2 font-medium">{selectedOrder.customer?.email || selectedOrder.email}</span>
                  </div>
                  <div>
                    <span className="text-blue-600">Cliente:</span>
                    <span className="ml-2 font-medium">
                      {selectedOrder.customer?.name || selectedOrder.customer?.firstName + ' ' + selectedOrder.customer?.lastName || 'Nome não informado'}
                    </span>
                  </div>
                  {selectedOrder.customer?.phone && (
                    <div>
                      <span className="text-blue-600">Telefone:</span>
                      <span className="ml-2 font-medium">{selectedOrder.customer.phone}</span>
                    </div>
                  )}
                  {selectedOrder.order?.link && (
                    <div>
                      <span className="text-blue-600">Perfil:</span>
                      <a 
                        href={selectedOrder.order.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 font-medium text-blue-600 hover:underline"
                      >
                        {selectedOrder.order.link}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Informações do Serviço */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-3">Informações do Serviço</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-600">Produto:</span>
                    <span className="ml-2 font-medium">{selectedOrder.product?.name || 'Produto não informado'}</span>
                  </div>
                  <div>
                    <span className="text-green-600">Plataforma:</span>
                    <span className="ml-2 font-medium">{selectedOrder.product?.platform || 'Plataforma não informada'}</span>
                  </div>
                  <div>
                    <span className="text-green-600">Quantidade:</span>
                    <span className="ml-2 font-medium">{selectedOrder.product?.quantity?.toLocaleString() || 'Quantidade não informada'}</span>
                  </div>
                  <div>
                    <span className="text-green-600">Método de Pagamento:</span>
                    <span className="ml-2 font-medium">{selectedOrder.order?.paymentPlatform || 'PIX'}</span>
                  </div>
                </div>
              </div>

              {/* Informações Técnicas */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-3">Informações Técnicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-purple-600">Fonte:</span>
                    <span className="ml-2 font-medium">{selectedOrder.source || 'attendant_manual'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Plataforma de Pagamento:</span>
                    <span className="ml-2 font-medium">{selectedOrder.order?.paymentPlatform || 'manual'}</span>
                  </div>
                  {selectedOrder.product?.serviceId && (
                    <div>
                      <span className="text-purple-600">Service ID:</span>
                      <span className="ml-2 font-mono text-xs bg-purple-200 px-2 py-1 rounded">
                        {selectedOrder.product.serviceId}
                      </span>
                    </div>
                  )}
                  {selectedOrder.order?.paymentId && (
                    <div>
                      <span className="text-purple-600">Payment ID:</span>
                      <span className="ml-2 font-mono text-xs bg-purple-200 px-2 py-1 rounded">
                        {selectedOrder.order.paymentId}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Informações de Pagamento PIX */}
              {(selectedOrder.payment?.pixCode || selectedOrder.payment?.qrcodeImage) && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-900 mb-3">Informações de Pagamento PIX</h3>
                  <div className="space-y-4">
                    {selectedOrder.order?.paymentId && (
                      <div>
                        <span className="text-yellow-600 font-medium">Payment ID:</span>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="font-mono text-sm bg-yellow-200 px-2 py-1 rounded">
                            {selectedOrder.order.paymentId}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(selectedOrder.order.paymentId);
                              toast({
                                title: "Payment ID copiado!",
                                description: "O ID do pagamento foi copiado para a área de transferência.",
                              });
                            }}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copiar
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {selectedOrder.payment?.pixCode && (
                      <div>
                        <span className="text-yellow-600 font-medium">Chave PIX:</span>
                        <div className="mt-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={selectedOrder.payment.pixCode}
                            readOnly
                            className="flex-1 p-2 border border-yellow-300 rounded text-sm font-mono bg-white"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(selectedOrder.payment.pixCode);
                              toast({
                                title: "Chave PIX copiada!",
                                description: "A chave PIX foi copiada para a área de transferência.",
                              });
                            }}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copiar
                          </Button>
                        </div>
                        <p className="text-xs text-yellow-700 mt-1">
                          O cliente pode copiar e colar esta chave no aplicativo do banco
                        </p>
                      </div>
                    )}

                    {selectedOrder.payment?.qrcodeImage && (
                      <div>
                        <span className="text-yellow-600 font-medium">QR Code PIX:</span>
                        <div className="mt-2 text-center">
                          <img
                            src={selectedOrder.payment.qrcodeImage}
                            alt="QR Code PIX"
                            className="mx-auto border border-yellow-300 rounded"
                            style={{ maxWidth: "200px", height: "auto" }}
                          />
                        </div>
                        <p className="text-xs text-yellow-700 mt-1 text-center">
                          O cliente pode escanear este QR Code com o aplicativo do banco
                        </p>
                      </div>
                    )}

                    {selectedOrder.order?.status === 'pending' && (
                      <div className="bg-yellow-100 border border-yellow-300 rounded p-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-600" />
                          <span className="text-yellow-800 font-medium text-sm">
                            Aguardando pagamento
                          </span>
                        </div>
                        <p className="text-xs text-yellow-700 mt-1">
                          O pedido está aguardando a confirmação do pagamento PIX
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

          <DialogFooter className="flex-shrink-0 pt-4 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={closeDetailsModal}>
              Fechar
            </Button>
            
            {selectedOrder?.payment?.pixCode && (
              <Button 
                onClick={() => {
                  const pixInfo = `PIX para Pedido ${selectedOrder.id}\n\nChave PIX: ${selectedOrder.payment.pixCode}\nValor: ${formatCurrency(selectedOrder.order?.amount || selectedOrder.amount || 0)}\nCliente: ${selectedOrder.customer?.name || selectedOrder.customer?.email || 'N/A'}\n\nID do Pedido: ${selectedOrder.id}`;
                  navigator.clipboard.writeText(pixInfo);
                  toast({
                    title: "Informações PIX copiadas!",
                    description: "Todas as informações do PIX foram copiadas para a área de transferência.",
                  });
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar PIX
              </Button>
            )}
            
            {selectedOrder?.order?.link && (
              <Button 
                onClick={() => {
                  window.open(selectedOrder.order.link, '_blank');
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver Perfil
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendantCreateOrder;

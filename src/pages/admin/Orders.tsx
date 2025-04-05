import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Eye,
  Download,
  MessageSquare,
  Calendar,
  Trash2,
  Edit2,
  ChevronDown,
  Loader2,
  FileDown,
  Printer,
  RefreshCw,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from "lucide-react";

// Dados de exemplo para a tabela de pedidos
const orders = [
  {
    id: "PED-1001",
    customer: {
      name: "João Silva",
      email: "joao.silva@gmail.com",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      username: "@joaosilva",
    },
    product: "1000 Seguidores Instagram",
    amount: "R$ 29,90",
    status: "Completo",
    date: "16/04/2023 - 14:30",
    instagramProfile: "@joao.silva",
    paymentMethod: "Cartão de Crédito",
    quantity: "1000",
  },
  {
    id: "PED-1002",
    customer: {
      name: "Maria Oliveira",
      email: "maria.oliveira@gmail.com",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      username: "@mariaoliveira",
    },
    product: "5000 Curtidas Facebook",
    amount: "R$ 89,90",
    status: "Processando",
    date: "16/04/2023 - 11:45",
    instagramProfile: "@maria_oliveira",
    paymentMethod: "PIX",
    quantity: "5000",
  },
  {
    id: "PED-1003",
    customer: {
      name: "Pedro Santos",
      email: "pedro.santos@gmail.com",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      username: "@pedrosantos",
    },
    product: "3000 Visualizações YouTube",
    amount: "R$ 59,90",
    status: "Pendente",
    date: "16/04/2023 - 09:20",
    instagramProfile: "@pedrosantos",
    paymentMethod: "Boleto",
    quantity: "3000",
  },
  {
    id: "PED-1004",
    customer: {
      name: "Ana Costa",
      email: "ana.costa@gmail.com",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      username: "@anacosta",
    },
    product: "10000 Seguidores Instagram",
    amount: "R$ 159,90",
    status: "Completo",
    date: "15/04/2023 - 22:15",
    instagramProfile: "@anacosta",
    paymentMethod: "Cartão de Crédito",
    quantity: "10000",
  },
  {
    id: "PED-1005",
    customer: {
      name: "Lucas Mendes",
      email: "lucas.mendes@gmail.com",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      username: "@lucasmendes",
    },
    product: "2000 Likes Instagram",
    amount: "R$ 39,90",
    status: "Cancelado",
    date: "15/04/2023 - 18:00",
    instagramProfile: "@lucasmendes",
    paymentMethod: "PIX",
    quantity: "2000",
  },
  {
    id: "PED-1006",
    customer: {
      name: "Camila Pereira",
      email: "camila.pereira@gmail.com",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
      username: "@camilapereira",
    },
    product: "500 Seguidores TikTok",
    amount: "R$ 19,90",
    status: "Processando",
    date: "15/04/2023 - 15:30",
    instagramProfile: "@camila_pereira",
    paymentMethod: "Cartão de Crédito",
    quantity: "500",
  },
  {
    id: "PED-1007",
    customer: {
      name: "Rafael Souza",
      email: "rafael.souza@gmail.com",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      username: "@rafaelsouza",
    },
    product: "1000 Visualizações Reels",
    amount: "R$ 24,90",
    status: "Pendente",
    date: "15/04/2023 - 12:10",
    instagramProfile: "@rafael_souza",
    paymentMethod: "PIX",
    quantity: "1000",
  },
  {
    id: "PED-1008",
    customer: {
      name: "Fernanda Lima",
      email: "fernanda.lima@gmail.com",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      username: "@fernandalima",
    },
    product: "2000 Seguidores Instagram",
    amount: "R$ 49,90",
    status: "Completo",
    date: "15/04/2023 - 09:45",
    instagramProfile: "@fernanda_lima",
    paymentMethod: "Cartão de Crédito",
    quantity: "2000",
  },
];

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusChanging, setIsStatusChanging] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Filtros adicionais para o novo design
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");

  // Função para obter cores baseadas no status
  const getStatusColor = (status) => {
    switch (status) {
      case "Completo":
        return "bg-green-100 text-green-700";
      case "Processando":
        return "bg-yellow-100 text-yellow-700";
      case "Pendente":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Limpar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("todos");
    setStartDate("");
    setEndDate("");
    setCustomerFilter("");
  };

  // Filtra os pedidos baseado na busca e filtro de status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.instagramProfile.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "todos" || order.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesCustomer = 
      !customerFilter || 
      order.customer.name.toLowerCase().includes(customerFilter.toLowerCase()) ||
      order.customer.username.toLowerCase().includes(customerFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesCustomer;
  });

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Manipulação de checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(currentItems.map((order) => order.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Abrir detalhes do pedido
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    // Não vamos mais abrir o modal de detalhes, apenas selecionamos o pedido
    // setIsDetailsOpen(true);
  };

  // Simular alteração de status
  const handleChangeStatus = (orderId, newStatus) => {
    setIsStatusChanging(true);
    // Em um ambiente real, aqui seria feita uma chamada à API
    setTimeout(() => {
      // Atualização simulada
      const orderIndex = orders.findIndex((order) => order.id === orderId);
      if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
      }
      setIsStatusChanging(false);
    }, 800);
  };

  return (
    <div id='webcrumbs'>
      <div className='w-full flex justify-center p-2 md:p-0'>
        <div className='w-full md:w-[1200px] bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-4 md:p-6 font-sans'>
          
          <div className='mb-6 bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-bold text-gray-800'>
                Filtros de Pedidos
              </h2>
              <button 
                className='flex items-center gap-1 text-primary-600 hover:text-primary-700 transition-colors'
                onClick={clearFilters}
              >
                <span className='material-symbols-outlined text-sm'>
                  refresh
                </span>
                <span className='text-sm font-medium'>Limpar Filtros</span>
              </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-600 mb-1'>
                  Data Inicial
                </label>
                <input
                  type='date'
                  className='w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-600 mb-1'>
                  Data Final
                </label>
                <input
                  type='date'
                  className='w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-600 mb-1'>
                  Status
                </label>
                <select 
                  className='w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all'
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value='todos'>Todos os Status</option>
                  <option value='pendente'>Pendente</option>
                  <option value='processando'>Processando</option>
                  <option value='completo'>Concluído</option>
                  <option value='cancelado'>Cancelado</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-600 mb-1'>
                  Cliente
                </label>
                <input
                  type='text'
                  placeholder='Nome ou ID do cliente'
                  className='w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all'
                  value={customerFilter}
                  onChange={(e) => setCustomerFilter(e.target.value)}
                />
              </div>
            </div>

            <div className='mt-4 flex justify-end'>
              <button 
                className='bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm hover:shadow flex items-center gap-2'
                onClick={() => {/* Aplicar filtros já está implementado nos estados */}}
              >
                <span className='material-symbols-outlined text-sm'>
                  filter_alt
                </span>
                Aplicar Filtros
              </button>
        </div>
      </div>

          <div className="flex justify-between mt-4">
            <div className="text-sm text-gray-500">
              Mostrando {filteredOrders.length} pedidos no total
            </div>
      <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Itens por página:</span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => {
            setItemsPerPage(parseInt(value));
            setCurrentPage(1);
          }}
        >
                <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="10 por página" />
          </SelectTrigger>
          <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
            </div>
      </div>

      {/* Tabela de pedidos */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0 p-4 md:p-5 border-b border-gray-100'>
              <div>
                <h2 className='text-lg font-bold text-gray-800'>
                  Lista de Pedidos
                </h2>
                <p className='text-xs text-gray-500 mt-1'>
                  Clique em um pedido para ver seus detalhes
                </p>
              </div>
              <div className='flex gap-2'>
                <button className='p-2 rounded-lg hover:bg-gray-100 transition-colors'>
                  <span className='material-symbols-outlined text-gray-500'>
                    file_download
                  </span>
                </button>
                <button className='p-2 rounded-lg hover:bg-gray-100 transition-colors'>
                  <span className='material-symbols-outlined text-gray-500'>
                    print
                  </span>
                </button>
                <button className='p-2 rounded-lg hover:bg-gray-100 transition-colors'>
                  <span className='material-symbols-outlined text-gray-500'>
                    more_vert
                  </span>
                </button>
              </div>
            </div>

            <div className='overflow-x-auto max-w-[calc(100vw-2rem)] md:max-w-none'>
              <table className='w-full text-left'>
              <thead>
                  <tr className='bg-gray-50'>
                    <th className='p-4 font-semibold text-gray-600 text-sm'>
                    ID
                  </th>
                    <th className='p-4 font-semibold text-gray-600 text-sm'>
                    Cliente
                  </th>
                    <th className='p-4 font-semibold text-gray-600 text-sm'>
                      Tipo
                    </th>
                    <th className='p-4 font-semibold text-gray-600 text-sm'>
                      Quantidade
                  </th>
                    <th className='p-4 font-semibold text-gray-600 text-sm'>
                      Data
                  </th>
                    <th className='p-4 font-semibold text-gray-600 text-sm'>
                    Status
                  </th>
                    <th className='p-4 font-semibold text-gray-600 text-sm'>
                    Ações
                  </th>
                </tr>
              </thead>
                <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((order) => (
                    <tr
                      key={order.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${selectedOrder && selectedOrder.id === order.id ? 'bg-primary-50' : ''}`}
                        onClick={() => handleViewDetails(order)}
                      >
                        <td className='p-4 text-gray-800 font-medium'>{order.id}</td>
                        <td className='p-4'>
                          <div className='flex items-center gap-2'>
                            <img
                              src={order.customer.avatar}
                              alt='Cliente'
                              className='w-8 h-8 rounded-full'
                            />
                          <div>
                              <p className='text-gray-800'>{order.customer.name}</p>
                              <p className='text-xs text-gray-500'>{order.customer.username}</p>
                            </div>
                        </div>
                      </td>
                        <td className='p-4 text-gray-600'>{order.product}</td>
                        <td className='p-4 text-gray-600'>{order.quantity}</td>
                        <td className='p-4 text-gray-600'>{order.date}</td>
                        <td className='p-4'>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                      </td>
                        <td className='p-4' onClick={(e) => e.stopPropagation()}>
                          <div className='flex gap-1'>
                            <button 
                              className='p-1.5 rounded hover:bg-gray-100 transition-colors group'
                              onClick={() => {/* Editar pedido */}}
                            >
                              <span className='material-symbols-outlined text-sm text-gray-500 group-hover:text-primary-600'>
                                edit
                              </span>
                            </button>
                            <button 
                              className='p-1.5 rounded hover:bg-gray-100 transition-colors group'
                              onClick={() => handleViewDetails(order)}
                            >
                              <span className='material-symbols-outlined text-sm text-gray-500 group-hover:text-primary-600'>
                                visibility
                              </span>
                            </button>
                            <details className='relative'>
                              <summary className='p-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer list-none group'>
                                <span className='material-symbols-outlined text-sm text-gray-500 group-hover:text-primary-600'>
                                  expand_more
                                </span>
                              </summary>
                              <div className='absolute right-0 mt-1 bg-white shadow-lg rounded-lg border border-gray-100 z-10 w-44 py-1'>
                                <button 
                                  className='w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleChangeStatus(order.id, "Completo");
                                  }}
                              disabled={isStatusChanging || order.status === "Completo"}
                            >
                                  <span className='material-symbols-outlined text-sm'>
                                    check_circle
                                  </span>
                                  Marcar Concluído
                                </button>
                                <button 
                                  className='w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleChangeStatus(order.id, "Pendente");
                                  }}
                              disabled={isStatusChanging || order.status === "Pendente"}
                            >
                                  <span className='material-symbols-outlined text-sm'>
                                    hourglass_empty
                                  </span>
                                  Marcar Pendente
                                </button>
                                <button className='w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-red-500'>
                                  <span className='material-symbols-outlined text-sm'>
                                    delete
                                  </span>
                                  Excluir
                                </button>
                              </div>
                            </details>
                          </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                      <td colSpan={7} className="py-6 text-center text-gray-500">
                      Nenhum pedido encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

            <div className='p-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0'>
              <div className='text-sm text-gray-500'>
            Mostrando {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, filteredOrders.length)} de{" "}
            {filteredOrders.length} pedidos
          </div>
              <div className='flex items-center gap-2'>
                <button
                  className='p-2 rounded hover:bg-gray-100 transition-colors disabled:opacity-50'
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
                  <span className='material-symbols-outlined text-gray-500'>
                    chevron_left
                  </span>
                </button>
                <button className='w-9 h-9 rounded flex items-center justify-center bg-primary-600 text-white font-medium'>
                  {currentPage}
                </button>
                {currentPage < totalPages && (
                  <button 
                    className='w-9 h-9 rounded flex items-center justify-center hover:bg-gray-100 transition-colors'
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    {currentPage + 1}
                  </button>
                )}
                {currentPage + 1 < totalPages && (
                  <button 
                    className='w-9 h-9 rounded flex items-center justify-center hover:bg-gray-100 transition-colors'
                    onClick={() => setCurrentPage(currentPage + 2)}
                  >
                    {currentPage + 2}
                  </button>
                )}
                <button 
                  className='p-2 rounded hover:bg-gray-100 transition-colors'
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
                  <span className='material-symbols-outlined text-gray-500'>
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className='mt-6 bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100'>
            <h2 className='text-lg font-bold text-gray-800 mb-4'>
              Detalhes do Pedido Selecionado
            </h2>

            {selectedOrder ? (
              <div className="grid gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">ID do Pedido</label>
                    <p className="text-gray-800 font-medium">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Cliente</label>
                    <p className="text-gray-800">{selectedOrder.customer.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Produto</label>
                    <p className="text-gray-800">{selectedOrder.product}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Quantidade</label>
                    <p className="text-gray-800">{selectedOrder.quantity}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Valor</label>
                    <p className="text-gray-800 font-medium">{selectedOrder.amount}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Data</label>
                    <p className="text-gray-800">{selectedOrder.date}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Método de Pagamento</label>
                    <p className="text-gray-800">{selectedOrder.paymentMethod}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Perfil</label>
                  <p className="text-gray-800">{selectedOrder.instagramProfile}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Observações</label>
                  <textarea 
                    className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    rows={3}
                    placeholder="Adicione observações sobre este pedido..."
                  ></textarea>
                </div>
                
                <div className="flex justify-end gap-3 mt-2">
                  <button className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                    Cancelar
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors">
                    Salvar Alterações
                  </button>
                </div>
              </div>
            ) : (
              <div className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
                <div className='text-center text-gray-500 p-4'>
                  <span className='material-symbols-outlined text-5xl mb-2'>
                    description
                  </span>
                  <p>Selecione um pedido da lista para visualizar os detalhes</p>
                </div>
              </div>
            )}
          </div>

          {/* Modal de detalhes do pedido - mantido para compatibilidade */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido</DialogTitle>
            <DialogDescription>
              Informações completas sobre o pedido.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">ID do Pedido</h3>
                  <p className="font-semibold">{selectedOrder.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Data</h3>
                  <p>{selectedOrder.date}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Cliente</h3>
                <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-md">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedOrder.customer.avatar} />
                    <AvatarFallback>
                      {selectedOrder.customer.name.split(" ").map(name => name[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedOrder.customer.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Produto</h3>
                  <p>{selectedOrder.product}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Valor</h3>
                  <p className="font-semibold">{selectedOrder.amount}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Método de Pagamento</h3>
                  <p>{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={getStatusColor(selectedOrder.status)}
                      variant="outline"
                    >
                      {selectedOrder.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Perfil do Instagram</h3>
                <p>{selectedOrder.instagramProfile}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Observações</h3>
                <Textarea
                  placeholder="Adicionar observações sobre este pedido..."
                  className="resize-none h-20"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Fechar
            </Button>
            <Button onClick={() => setIsDetailsOpen(false)}>
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Orders; 
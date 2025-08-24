import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { getApiBase } from "@/lib/api_base";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";

const statusMap = {
  approved: "Completo",
  pending: "Pendente",
  processing: "Processando",
  canceled: "Cancelado",
  completed: "Completo",
};



const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusChanging, setIsStatusChanging] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // O campo de busca será usado para nome/email/produto

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
  setStatusFilter("all");
  setStartDate("");
  setEndDate("");
  };

  // Buscar pedidos da API
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          status: statusFilter,
          search: searchTerm,
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
          sort: "date_desc",
        });
        // Adiciona filtro de datas se preenchido
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        const url = `${getApiBase()}/orders?${params.toString()}`;
        const res = await fetch(url);
        const json = await res.json();
        // Mapeia os dados da API para o formato esperado pela UI
        const mappedOrders = (json.data || []).map((order) => ({
          id: order.id,
          status: statusMap[order.status] || statusMap[order.statusGroup] || order.status,
          statusGroup: order.statusGroup,
          product: order.orderName,
          customer: {
            name: order.customer?.fullName || order.customer?.firstName || order.email,
            email: order.email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(order.customer?.fullName || order.customer?.firstName || order.email)}&background=random`,
            username: order.customer?.fullName || order.customer?.firstName || order.email,
            phone: order.metadata?.phone || '',
          },
          quantity: order.quantity,
          amount: order.amount / 100,
          date: new Date(order.createdAt).toLocaleString('pt-BR'),
          instagramProfile: order.metadata?.link || '',
          paymentMethod: order.metadata?.payment_id ? 'PIX' : '',
        }));
  setOrders(mappedOrders);
        setMeta(
          json.meta || { page: 1, limit: itemsPerPage, total: 0, totalPages: 1 }
        );
      } catch (err) {
        setOrders([]);
        setMeta({ page: 1, limit: itemsPerPage, total: 0, totalPages: 1 });
      }
      setLoading(false);
    };
    fetchOrders();
  }, [searchTerm, statusFilter, currentPage, itemsPerPage, startDate, endDate]);

  // Os dados já vêm filtrados e paginados da API
  const currentItems = orders;

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
    <div id="webcrumbs">
      <div className="w-full flex justify-center p-2 md:p-0">
        <div className="w-full md:w-[1200px] bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-4 md:p-6 font-sans">
          <div className="mb-6 bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                Filtros de Pedidos
              </h2>
              <button
                className="flex items-center gap-1 text-primary-600 hover:text-primary-700 transition-colors"
                onClick={clearFilters}
              >
                <span className="material-symbols-outlined text-sm">
                  refresh
                </span>
                <span className="text-sm font-medium">Limpar Filtros</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Data Inicial
                </label>
                <input
                  type="date"
                  className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Data Final
                </label>
                <input
                  type="date"
                  className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Status
                </label>
                <select
                  className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos os Status</option>
                  <option value="pending">Pendente</option>
                  <option value="completed">Concluído</option>
                  <option value="canceled">Cancelado</option>
                </select>
              </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Buscar
                  </label>
                  <input
                    type="text"
                    placeholder="Buscar por nome, email ou produto"
                    className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm hover:shadow flex items-center gap-2"
                onClick={() => {
                  /* Aplicar filtros já está implementado nos estados */
                }}
              >
                <span className="material-symbols-outlined text-sm">
                  filter_alt
                </span>
                Aplicar Filtros
              </button>
            </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm hover:shadow flex items-center gap-2"
                    onClick={() => {
                      setCurrentPage(1); // Garante que busca sempre começa na página 1
                    }}
                  >
                    <span className="material-symbols-outlined text-sm">
                      filter_alt
                    </span>
                    Aplicar Filtros
                  </button>
                </div>
          </div>

          <div className="flex justify-between mt-4">
            <div className="text-sm text-gray-500">
              Mostrando {meta.total} pedidos no total
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0 p-4 md:p-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Lista de Pedidos
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Clique em um pedido para ver seus detalhes
                </p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="material-symbols-outlined text-gray-500">
                    file_download
                  </span>
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="material-symbols-outlined text-gray-500">
                    print
                  </span>
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="material-symbols-outlined text-gray-500">
                    more_vert
                  </span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-w-[calc(100vw-2rem)] md:max-w-none">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-4 font-semibold text-gray-600 text-sm">ID</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">Cliente</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">Tipo</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">Quantidade</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">Valor</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">Data</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((order) => (
                      <tr
                        key={order.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                          selectedOrder && selectedOrder.id === order.id
                            ? "bg-primary-50"
                            : ""
                        }`}
                        onClick={() => handleViewDetails(order)}
                      >
                        <td className="p-4 text-gray-800 font-medium">{order.id}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <img src={order.customer.avatar} alt="Cliente" className="w-8 h-8 rounded-full" />
                            <div>
                              <p className="text-gray-800">{order.customer.name}</p>
                              <p className="text-xs text-gray-500">{order.customer.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">{order.product}</td>
                        <td className="p-4 text-gray-600">{order.quantity}</td>
                        <td className="p-4 text-gray-800 font-medium">{order.amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        <td className="p-4 text-gray-600">{order.date}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <button className="p-1.5 rounded hover:bg-gray-100 transition-colors group" onClick={() => { /* Editar pedido */ }}>
                              <span className="material-symbols-outlined text-sm text-gray-500 group-hover:text-primary-600">edit</span>
                            </button>
                            <button className="p-1.5 rounded hover:bg-gray-100 transition-colors group" onClick={() => handleViewDetails(order)}>
                              <span className="material-symbols-outlined text-sm text-gray-500 group-hover:text-primary-600">visibility</span>
                            </button>
                            <details className="relative">
                              <summary className="p-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer list-none group">
                                <span className="material-symbols-outlined text-sm text-gray-500 group-hover:text-primary-600">expand_more</span>
                              </summary>
                              <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-lg border border-gray-100 z-10 w-44 py-1">
                                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2" onClick={(e) => { e.stopPropagation(); handleChangeStatus(order.id, "Completo"); }} disabled={isStatusChanging || order.status === "Completo"}>
                                  <span className="material-symbols-outlined text-sm">check_circle</span>
                                  Marcar Concluído
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2" onClick={(e) => { e.stopPropagation(); handleChangeStatus(order.id, "Pendente"); }} disabled={isStatusChanging || order.status === "Pendente"}>
                                  <span className="material-symbols-outlined text-sm">hourglass_empty</span>
                                  Marcar Pendente
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-red-500">
                                  <span className="material-symbols-outlined text-sm">delete</span>
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
                      <td
                        colSpan={7}
                        className="py-6 text-center text-gray-500"
                      >
                        Nenhum pedido encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
              <div className="text-sm text-gray-500">
                Página {meta.page} de {meta.totalPages} | Total: {meta.total} pedidos
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={meta.page === 1}
                >
                  <span className="material-symbols-outlined text-gray-500">
                    chevron_left
                  </span>
                </button>
                <span className="w-9 h-9 rounded flex items-center justify-center bg-primary-600 text-white font-medium">
                  {meta.page}
                </span>
                <button
                  className="p-2 rounded hover:bg-gray-100 transition-colors"
                  onClick={() => setCurrentPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={meta.page === meta.totalPages}
                >
                  <span className="material-symbols-outlined text-gray-500">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Detalhes do Pedido Selecionado
            </h2>

            {selectedOrder ? (
              <div className="grid gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      ID do Pedido
                    </label>
                    <p className="text-gray-800 font-medium">
                      {selectedOrder.id}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Cliente
                    </label>
                    <p className="text-gray-800">
                      {selectedOrder.customer.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Telefone
                    </label>
                    <p className="text-gray-800">{selectedOrder.customer.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Produto
                    </label>
                    <p className="text-gray-800">{selectedOrder.product}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Quantidade
                    </label>
                    <p className="text-gray-800">{selectedOrder.quantity}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Valor
                    </label>
                    <p className="text-gray-800 font-medium">
                      {selectedOrder.amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Status
                    </label>
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Data
                    </label>
                    <p className="text-gray-800">{selectedOrder.date}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Método de Pagamento
                    </label>
                    <p className="text-gray-800">
                      {selectedOrder.paymentMethod}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Perfil
                  </label>
                  <p className="text-gray-800">
                    {selectedOrder.instagramProfile}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Observações
                  </label>
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
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="text-center text-gray-500 p-4">
                  <span className="material-symbols-outlined text-5xl mb-2">
                    description
                  </span>
                  <p>
                    Selecione um pedido da lista para visualizar os detalhes
                  </p>
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
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        ID do Pedido
                      </h3>
                      <p className="font-semibold">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Data
                      </h3>
                      <p>{selectedOrder.date}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Cliente
                    </h3>
                    <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-md">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedOrder.customer.avatar} />
                        <AvatarFallback>
                          {selectedOrder.customer.name
                            .split(" ")
                            .map((name) => name[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {selectedOrder.customer.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedOrder.customer.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Produto
                      </h3>
                      <p>{selectedOrder.product}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Valor
                      </h3>
                      <p className="font-semibold">{selectedOrder.amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Método de Pagamento
                      </h3>
                      <p>{selectedOrder.paymentMethod}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Status
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={getStatusColor(selectedOrder.status)}
                        >
                          {selectedOrder.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Perfil do Instagram
                    </h3>
                    <p>{selectedOrder.instagramProfile}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Observações
                    </h3>
                    <Textarea
                      placeholder="Adicionar observações sobre este pedido..."
                      className="resize-none h-20"
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsOpen(false)}
                >
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

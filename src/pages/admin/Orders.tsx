import React, { useEffect, useState } from "react";
import { getApiBase } from "@/lib/api_base";

// shadcn/ui
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select as UiSelect,
  SelectContent as UiSelectContent,
  SelectItem as UiSelectItem,
  SelectTrigger as UiSelectTrigger,
  SelectValue as UiSelectValue,
} from "@/components/ui/select";

type OrderType = "Seguidores" | "Visualizações" | "Curtidas";
type Platform = "Instagram" | "TikTok";

const SERVICE_ID: Record<Platform, Record<OrderType, number>> = {
  Instagram: { Seguidores: 547, Curtidas: 531, Visualizações: 250 },
  TikTok: { Seguidores: 396, Curtidas: 50, Visualizações: 334 },
};
const computeServiceId = (orderType: OrderType, platform: Platform) =>
  SERVICE_ID[platform][orderType];

const statusMap: Record<string, string> = {
  approved: "Pago",
  pending: "Pendente",
  processing: "Processando",
  canceled: "Cancelado",
  cancelled: "Cancelado",
  completed: "Completo",
};

const inferOrderTypeFromName = (name?: string): OrderType => {
  const s = (name || "").toLowerCase();
  if (s.includes("visual")) return "Visualizações";
  if (s.includes("curt")) return "Curtidas";
  return "Seguidores";
};

const parseBRLToCents = (s: string) => {
  if (!s) return 0;
  const n = Number(s.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
};

const toBRLStringFromCents = (cents?: number) => {
  const n = (cents ?? 0) / 100;
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// ------------------------

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);

  // filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // seleção/detalhes
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusChanging, setIsStatusChanging] = useState(false);

  // criar
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newOrder, setNewOrder] = useState({
    email: "",
    firstName: "",
    lastName: "",
    cpf: "",
    orderType: "Seguidores" as OrderType,
    platform: "Instagram" as Platform,
    quantity: 100,
    amountBRL: "0,00",
    link: "",
    status: "approved" as "approved" | "pending" | "cancelled",
    phone: "",
    serviceId: computeServiceId("Seguidores", "Instagram"),
    famaId: "", // <<< novo campo (providerOrderId)
  });

  // editar
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editOrder, setEditOrder] = useState<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    cpf: string;
    orderType: OrderType;
    platform: Platform;
    quantity: number;
    amountBRL: string;
    link: string;
    phone: string;
    status: "approved" | "pending" | "cancelled";
    serviceId: number;
    order_id: string;
  } | null>(null);

  // excluir
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    label: string;
  } | null>(null);

  // ------------------------ helpers

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completo":
      case "Pago":
        return "bg-green-100 text-green-700";
      case "Processando":
      case "Pendente":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const mapApiOrderToUi = (order: any) => {
    const famaId =
      order.order_id ??
      order.provider?.orderId ??
      order.metadata?.order_id ??
      "";

    return {
      id: order.id,
      order_id: famaId,
      famaId,
      status:
        statusMap[order.status] || statusMap[order.statusGroup] || order.status,
      statusGroup: order.statusGroup,
      product: order.orderName,
      customer: {
        name:
          order.customer?.fullName || order.customer?.firstName || order.email,
        email: order.email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          order.customer?.fullName || order.customer?.firstName || order.email
        )}&background=random`,
        phone: order.metadata?.phone || "",
      },
      platform: order.platform || "Instagram",
      quantity: order.quantity,
      amount: (order.amount ?? 0) / 100,
      date: order.createdAt
        ? new Date(order.createdAt).toLocaleString("pt-BR")
        : "",
      instagramProfile: order.metadata?.link || "",
      paymentMethod: order.metadata?.payment_id ? "PIX" : "",
      raw: order,
      paymentPlatform: order.paymentPlatform || "",
    };
  };

  // ------------------------ fetch

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          status: statusFilter,
          search: searchTerm,
          page: String(currentPage),
          limit: String(itemsPerPage),
          sort: "date_desc",
        });
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const url = `${getApiBase()}/orders?${params.toString()}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`GET /orders ${res.status}`);
        const json = await res.json();

        const mapped = (json.data || []).map(mapApiOrderToUi);
        setOrders(mapped);
        setMeta(
          json.meta || { page: 1, limit: itemsPerPage, total: 0, totalPages: 1 }
        );
      } catch {
        setOrders([]);
        setMeta({ page: 1, limit: itemsPerPage, total: 0, totalPages: 1 });
      }
      setLoading(false);
    };
    fetchOrders();
  }, [searchTerm, statusFilter, currentPage, itemsPerPage, startDate, endDate]);

  // ------------------------ detalhes

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  // ------------------------ status quick actions (PATCH)

  const handleChangeStatus = async (
    orderId: string,
    newStatusPtBR: "Completo" | "Pendente"
  ) => {
    const statusApi = newStatusPtBR === "Completo" ? "approved" : "pending";
    try {
      setIsStatusChanging(true);
      const res = await fetch(`${getApiBase()}/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusApi }),
      });
      if (!res.ok) throw new Error(`PATCH /orders/${orderId} ${res.status}`);
      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? mapApiOrderToUi(updated) : o))
      );
    } catch {
      alert("Falha ao atualizar status.");
    } finally {
      setIsStatusChanging(false);
    }
  };

  // ------------------------ criar

  const handleCreateOrder = async () => {
    try {
      setCreating(true);
      const payload = {
        email: newOrder.email.trim().toLowerCase(),
        firstName: newOrder.firstName.trim(),
        lastName: newOrder.lastName.trim(),
        cpf: newOrder.cpf.trim(),
        orderName: newOrder.orderType, // "Seguidores" | "Visualizações" | "Curtidas"
        platform: newOrder.platform, // "Instagram" | "TikTok"
        quantity: Number(newOrder.quantity) || 0,
        amountCents: parseBRLToCents(newOrder.amountBRL),
        link: newOrder.link || undefined,
        status: newOrder.status, // "approved" | "pending" | "cancelled"
        phone: newOrder.phone || undefined,
        serviceId: newOrder.serviceId,
        providerOrderId: newOrder.famaId || undefined, // <<< envia fama id
      };
      const res = await fetch(`${getApiBase()}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`POST /orders ${res.status}`);
      const created = await res.json();

      setOrders((prev) => [mapApiOrderToUi(created), ...prev]);
      setMeta((m) => ({
        ...m,
        total: m.total + 1,
        totalPages: Math.max(1, Math.ceil((m.total + 1) / m.limit)),
      }));

      setIsCreateOpen(false);
      setNewOrder({
        email: "",
        firstName: "",
        lastName: "",
        cpf: "",
        orderType: "Seguidores",
        platform: "Instagram",
        quantity: 100,
        amountBRL: "0,00",
        link: "",
        status: "approved",
        phone: "",
        serviceId: computeServiceId("Seguidores", "Instagram"),
        famaId: "",
      });
    } catch {
      alert("Falha ao criar pedido.");
    } finally {
      setCreating(false);
    }
  };

  // ------------------------ editar

  const openEditModal = (order: any) => {
    const orderType = inferOrderTypeFromName(order.product);
    const platform: Platform =
      order.platform === "TikTok" ? "TikTok" : "Instagram";
    setEditOrder({
      id: order.id,
      email: order.customer?.email || order.raw?.email || "",
      firstName:
        (order.customer?.name || order.raw?.customer?.fullName || "").split(
          " "
        )[0] || "",
      lastName:
        (order.customer?.name || order.raw?.customer?.fullName || "")
          .split(" ")
          .slice(1)
          .join(" ") || "",
      cpf: order.raw?.cpf || "",
      orderType,
      platform,
      quantity: Number(order.quantity) || 0,
      amountBRL: toBRLStringFromCents(Math.round((order.amount ?? 0) * 100)),
      link: order.instagramProfile || "",
      phone: order.customer?.phone || "",
      status:
        order.raw?.status === "approved"
          ? "approved"
          : order.raw?.status === "cancelled" ||
            order.raw?.status === "canceled"
          ? "cancelled"
          : "pending",
      serviceId: computeServiceId(orderType, platform),
      order_id: order.famaId || "",
    });
    setIsEditOpen(true);
  };

  const handleUpdateOrder = async () => {
    if (!editOrder) return;
    try {
      setUpdating(true);
      const payload: any = {
        email: editOrder.email.trim().toLowerCase(),
        firstName: editOrder.firstName.trim(),
        lastName: editOrder.lastName.trim(),
        cpf: editOrder.cpf.trim() || null,
        orderName: editOrder.orderType,
        platform: editOrder.platform,
        quantity: Number(editOrder.quantity) || 0,
        amountCents: parseBRLToCents(editOrder.amountBRL),
        link: editOrder.link || null,
        phone: editOrder.phone || null,
        status: editOrder.status,
        serviceId: editOrder.serviceId,
        providerOrderId: editOrder.order_id || null, // <<< atualiza fama id
      };

      const res = await fetch(`${getApiBase()}/orders/${editOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok)
        throw new Error(`PATCH /orders/${editOrder.id} ${res.status}`);
      const updated = await res.json();

      setOrders((prev) =>
        prev.map((o) => (o.id === editOrder.id ? mapApiOrderToUi(updated) : o))
      );
      setIsEditOpen(false);
      setEditOrder(null);
    } catch {
      alert("Falha ao atualizar pedido.");
    } finally {
      setUpdating(false);
    }
  };

  // ------------------------ excluir

  const openDeleteModal = (order: any) => {
    setDeleteTarget({ id: order.id, label: `${order.id} — ${order.product}` });
    setIsDeleteOpen(true);
  };

  const handleDeleteOrder = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await fetch(`${getApiBase()}/orders/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok)
        throw new Error(`DELETE /orders/${deleteTarget.id} ${res.status}`);

      setOrders((prev) => prev.filter((o) => o.id !== deleteTarget.id));
      setMeta((m) => {
        const newTotal = Math.max(0, m.total - 1);
        const newTotalPages = Math.max(1, Math.ceil(newTotal / m.limit));
        const newPage = Math.min(m.page, newTotalPages);
        return {
          ...m,
          total: newTotal,
          totalPages: newTotalPages,
          page: newPage,
        };
      });

      setIsDeleteOpen(false);
      setDeleteTarget(null);
    } catch {
      alert("Falha ao excluir pedido.");
    } finally {
      setDeleting(false);
    }
  };

  // ------------------------ UI

  return (
    <div id="webcrumbs">
      <div className="w-full flex justify-center p-2 md:p-0">
        <div className="w-full md:w-[1600px] bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-4 md:p-6 font-sans">
          {/* Filtros */}
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
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">Todos os Status</option>
                  <option value="pending">Pendente</option>
                  <option value="completed">Pago</option>
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
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Header & paginação topo */}
          <div className="flex justify-between mt-4">
            <div className="text-sm text-gray-500">
              Mostrando {meta.total} pedidos no total
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Itens por página:</span>
              <UiSelect
                value={String(itemsPerPage)}
                onValueChange={(value) => {
                  setItemsPerPage(parseInt(value));
                  setCurrentPage(1);
                }}
              >
                <UiSelectTrigger className="w-[100px] border rounded px-2 py-2">
                  <UiSelectValue placeholder="10 por página" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem value="5">5</UiSelectItem>
                  <UiSelectItem value="10">10</UiSelectItem>
                  <UiSelectItem value="25">25</UiSelectItem>
                  <UiSelectItem value="50">50</UiSelectItem>
                </UiSelectContent>
              </UiSelect>
            </div>
          </div>

          {/* Tabela */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
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
                <button
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700"
                  onClick={() => setIsCreateOpen(true)}
                >
                  <span className="material-symbols-outlined text-gray-500">
                    add
                  </span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-w-[calc(100vw-2rem)] md:max-w-none">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-4 font-semibold text-gray-600 text-sm">
                      ID
                    </th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">
                      Cliente
                    </th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">
                      Produto
                    </th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">
                      Plataforma
                    </th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">
                      Qtd
                    </th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">
                      Valor
                    </th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">
                      Data
                    </th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">
                      Status
                    </th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="py-6 text-center text-gray-500"
                      >
                        Carregando...
                      </td>
                    </tr>
                  ) : orders.length > 0 ? (
                    orders.map((order: any) => (
                      <tr
                        key={order.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                          selectedOrder && selectedOrder.id === order.id
                            ? "bg-primary-50"
                            : ""
                        }`}
                        onClick={() => handleViewDetails(order)}
                      >
                        <td className="p-4 text-gray-800 font-medium">
                          {order.id}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={order.customer.avatar}
                              alt="Cliente"
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <p className="text-gray-800">
                                {order.customer.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {order.customer.email}
                              </p>
                              {order.famaId && (
                                <p className="text-[11px] text-gray-400">
                                  Fama ID: {order.famaId}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">{order.product}</td>
                        <td className="p-4 text-gray-600">{order.platform}</td>
                        <td className="p-4 text-gray-600">{order.quantity}</td>
                        <td className="p-4 text-gray-800 font-medium">
                          {order.amount?.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </td>
                        <td className="p-4 text-gray-600">{order.date}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div
                            className="flex gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="p-1.5 rounded hover:bg-gray-100 transition-colors group"
                              onClick={() => openEditModal(order)}
                            >
                              <span className="material-symbols-outlined text-sm text-gray-500 group-hover:text-primary-600">
                                edit
                              </span>
                            </button>
                            <button
                              className="p-1.5 rounded hover:bg-gray-100 transition-colors group"
                              onClick={() => handleViewDetails(order)}
                            >
                              <span className="material-symbols-outlined text-sm text-gray-500 group-hover:text-primary-600">
                                visibility
                              </span>
                            </button>
                            <details className="relative">
                              <summary className="p-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer list-none group">
                                <span className="material-symbols-outlined text-sm text-gray-500 group-hover:text-primary-600">
                                  expand_more
                                </span>
                              </summary>
                              <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-lg border border-gray-100 z-10 w-48 py-1">
                                <button
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                                  onClick={() =>
                                    handleChangeStatus(order.id, "Completo")
                                  }
                                  disabled={
                                    isStatusChanging ||
                                    order.status === "Completo"
                                  }
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    check_circle
                                  </span>
                                  Marcar Concluído
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                                  onClick={() =>
                                    handleChangeStatus(order.id, "Pendente")
                                  }
                                  disabled={
                                    isStatusChanging ||
                                    order.status === "Pendente"
                                  }
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    hourglass_empty
                                  </span>
                                  Marcar Pendente
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-red-500"
                                  onClick={() => openDeleteModal(order)}
                                >
                                  <span className="material-symbols-outlined text-sm">
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
                      <td
                        colSpan={9}
                        className="py-6 text-center text-gray-500"
                      >
                        Nenhum pedido encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            <div className="p-4 border-top border-gray-100 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
              <div className="text-sm text-gray-500">
                Página {meta.page} de {meta.totalPages} | Total: {meta.total}{" "}
                pedidos
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
                  onClick={() =>
                    setCurrentPage((p) => Math.min(meta.totalPages, p + 1))
                  }
                  disabled={meta.page === meta.totalPages}
                >
                  <span className="material-symbols-outlined text-gray-500">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Modal: Detalhes */}
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="w-[95vw] sm:max-w-4xl lg:max-w-5xl">
              <DialogHeader>
                <DialogTitle>Detalhes do Pedido</DialogTitle>
                <DialogDescription>
                  Informações completas sobre o pedido.
                </DialogDescription>
              </DialogHeader>

              {selectedOrder && (
                <div className="grid gap-4 py-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        ID do Pedido
                      </h3>
                      <p className="font-semibold">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Fama ID
                      </h3>
                      <p className="font-semibold">
                        {selectedOrder.famaId || "-"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Data
                      </h3>
                      <p>{selectedOrder.date}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Cliente
                    </h3>
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-md">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={selectedOrder.customer.avatar}
                      />
                      <div>
                        <p className="font-medium">
                          {selectedOrder.customer.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedOrder.customer.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Produto
                      </h3>
                      <p>{selectedOrder.product}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Valor
                      </h3>
                      <p className="font-semibold">
                        {selectedOrder.amount?.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Status
                      </h3>
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Plataforma
                      </h3>
                      <p>{selectedOrder.platform}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Local da venda
                    </h3>
                    <p>{selectedOrder.paymentPlatform || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Perfil
                    </h3>
                    <p>{selectedOrder.instagramProfile}</p>
                  </div>
                </div>
              )}

              <DialogFooter>
                <button
                  className="px-4 py-2 rounded border"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Fechar
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Modal: Novo Pedido */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Novo Pedido (manual)</DialogTitle>
                <DialogDescription>
                  Crie um pedido diretamente no sistema.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Email *</label>
                  <input
                    className="w-full p-2 rounded border"
                    value={newOrder.email}
                    onChange={(e) =>
                      setNewOrder((o) => ({ ...o, email: e.target.value }))
                    }
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
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Nome</label>
                  <input
                    className="w-full p-2 rounded border"
                    value={newOrder.firstName}
                    onChange={(e) =>
                      setNewOrder((o) => ({ ...o, firstName: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Sobrenome</label>
                  <input
                    className="w-full p-2 rounded border"
                    value={newOrder.lastName}
                    onChange={(e) =>
                      setNewOrder((o) => ({ ...o, lastName: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Produto / Plano *
                  </label>
                  <select
                    className="w-full p-2 rounded border"
                    value={newOrder.orderType}
                    onChange={(e) => {
                      const orderType = e.target.value as OrderType;
                      setNewOrder((o) => ({
                        ...o,
                        orderType,
                        serviceId: computeServiceId(orderType, o.platform),
                      }));
                    }}
                  >
                    <option value="Seguidores">Seguidores</option>
                    <option value="Visualizações">Visualizações</option>
                    <option value="Curtidas">Curtidas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Plataforma *</label>
                  <select
                    className="w-full p-2 rounded border"
                    value={newOrder.platform}
                    onChange={(e) => {
                      const platform = e.target.value as Platform;
                      setNewOrder((o) => ({
                        ...o,
                        platform,
                        serviceId: computeServiceId(o.orderType, platform),
                      }));
                    }}
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Quantidade *</label>
                  <input
                    type="number"
                    className="w-full p-2 rounded border"
                    value={newOrder.quantity}
                    onChange={(e) =>
                      setNewOrder((o) => ({
                        ...o,
                        quantity: Number(e.target.value),
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Valor (R$) *</label>
                  <input
                    placeholder="0,00"
                    className="w-full p-2 rounded border"
                    value={newOrder.amountBRL}
                    onChange={(e) =>
                      setNewOrder((o) => ({ ...o, amountBRL: e.target.value }))
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">
                    Link (perfil/post)
                  </label>
                  <input
                    className="w-full p-2 rounded border"
                    value={newOrder.link}
                    onChange={(e) =>
                      setNewOrder((o) => ({ ...o, link: e.target.value }))
                    }
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
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Service ID (auto)
                  </label>
                  <div className="w-full p-2 rounded border bg-gray-50 text-gray-700">
                    {newOrder.serviceId}
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Fama ID (opcional)
                  </label>
                  <input
                    className="w-full p-2 rounded border"
                    placeholder="ex.: 123456789"
                    value={newOrder.famaId}
                    onChange={(e) =>
                      setNewOrder((o) => ({ ...o, famaId: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Status *</label>
                  <select
                    className="w-full p-2 rounded border"
                    value={newOrder.status}
                    onChange={(e) =>
                      setNewOrder((o) => ({
                        ...o,
                        status: e.target.value as any,
                      }))
                    }
                  >
                    <option value="approved">Aprovado</option>
                    <option value="pending">Pendente</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>

              <DialogFooter>
                <button
                  className="px-4 py-2 rounded border"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 rounded bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                  onClick={handleCreateOrder}
                  disabled={creating}
                >
                  {creating ? "Criando..." : "Criar Pedido"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Modal: Editar Pedido */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="sm-max-w-2xl">
              <DialogHeader>
                <DialogTitle>Editar Pedido</DialogTitle>
                <DialogDescription>
                  Atualize os dados do pedido selecionado.
                </DialogDescription>
              </DialogHeader>

              {editOrder && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm mb-1">Email *</label>
                    <input
                      className="w-full p-2 rounded border"
                      value={editOrder.email}
                      onChange={(e) =>
                        setEditOrder({ ...editOrder, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">CPF</label>
                    <input
                      className="w-full p-2 rounded border"
                      value={editOrder.cpf}
                      onChange={(e) =>
                        setEditOrder({ ...editOrder, cpf: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Nome</label>
                    <input
                      className="w-full p-2 rounded border"
                      value={editOrder.firstName}
                      onChange={(e) =>
                        setEditOrder({
                          ...editOrder,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Sobrenome</label>
                    <input
                      className="w-full p-2 rounded border"
                      value={editOrder.lastName}
                      onChange={(e) =>
                        setEditOrder({ ...editOrder, lastName: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">
                      Produto / Plano *
                    </label>
                    <select
                      className="w-full p-2 rounded border"
                      value={editOrder.orderType}
                      onChange={(e) => {
                        const orderType = e.target.value as OrderType;
                        setEditOrder((o) =>
                          o
                            ? {
                                ...o,
                                orderType,
                                serviceId: computeServiceId(
                                  orderType,
                                  o.platform
                                ),
                              }
                            : o
                        );
                      }}
                    >
                      <option value="Seguidores">Seguidores</option>
                      <option value="Visualizações">Visualizações</option>
                      <option value="Curtidas">Curtidas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Plataforma *</label>
                    <select
                      className="w-full p-2 rounded border"
                      value={editOrder.platform}
                      onChange={(e) => {
                        const platform = e.target.value as Platform;
                        setEditOrder((o) =>
                          o
                            ? {
                                ...o,
                                platform,
                                serviceId: computeServiceId(
                                  o.orderType,
                                  platform
                                ),
                              }
                            : o
                        );
                      }}
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="TikTok">TikTok</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Quantidade *</label>
                    <input
                      type="number"
                      className="w-full p-2 rounded border"
                      value={editOrder.quantity}
                      onChange={(e) =>
                        setEditOrder({
                          ...editOrder,
                          quantity: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Valor (R$) *</label>
                    <input
                      className="w-full p-2 rounded border"
                      value={editOrder.amountBRL}
                      onChange={(e) =>
                        setEditOrder({
                          ...editOrder,
                          amountBRL: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1">
                      Link (perfil/post)
                    </label>
                    <input
                      className="w-full p-2 rounded border"
                      value={editOrder.link}
                      onChange={(e) =>
                        setEditOrder({ ...editOrder, link: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Telefone</label>
                    <input
                      className="w-full p-2 rounded border"
                      value={editOrder.phone}
                      onChange={(e) =>
                        setEditOrder({ ...editOrder, phone: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">
                      Service ID (auto)
                    </label>
                    <div className="w-full p-2 rounded border bg-gray-50 text-gray-700">
                      {editOrder.serviceId}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Fama ID</label>
                    <input
                      className="w-full p-2 rounded border"
                      value={editOrder.order_id}
                      onChange={(e) =>
                        setEditOrder({ ...editOrder, order_id: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Status *</label>
                    <select
                      className="w-full p-2 rounded border"
                      value={editOrder.status}
                      onChange={(e) =>
                        setEditOrder({
                          ...editOrder,
                          status: e.target.value as any,
                        })
                      }
                    >
                      <option value="approved">Aprovado</option>
                      <option value="pending">Pendente</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>
              )}

              <DialogFooter>
                <button
                  className="px-4 py-2 rounded border"
                  onClick={() => setIsEditOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 rounded bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-gray-500"
                  onClick={handleUpdateOrder}
                  disabled={updating || !editOrder}
                >
                  {updating ? "Salvando..." : "Salvar Alterações"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Modal: Excluir Pedido */}
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Excluir pedido</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir este pedido? Essa ação não pode
                  ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <div className="p-3 rounded bg-red-50 text-red-700 text-sm">
                {deleteTarget?.label}
              </div>
              <DialogFooter>
                <button
                  className="px-4 py-2 rounded border"
                  onClick={() => setIsDeleteOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white"
                  onClick={handleDeleteOrder}
                  disabled={deleting}
                >
                  {deleting ? "Excluindo..." : "Excluir"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Orders;

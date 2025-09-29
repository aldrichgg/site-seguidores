import React, { useEffect, useState } from "react";
import { getApiBase } from "@/lib/api_base";
import { useServices } from "@/hooks/useServices";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from 'firebase/firestore';
import { Copy, Check } from "lucide-react";

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

// Removido: SERVICE_ID hardcoded - agora usa serviços do banco

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

  // Buscar serviços para usar serviceId reais do banco
  const { services: allServices } = useServices(undefined, undefined, true);
  
  // Buscar serviços ativos para o formulário PIX (mesma lógica do index)
  const { services: instagramServices } = useServices('instagram', undefined, false);
  const { services: tiktokServices } = useServices('tiktok', undefined, false);
  const { services: youtubeServices } = useServices('youtube', undefined, false);

  // Função para encontrar serviceId real do banco
  const findServiceId = (orderType: OrderType, platform: Platform): number => {
    const service = allServices.find(s => 
      s.platform.toLowerCase() === platform.toLowerCase() && 
      s.serviceType.toLowerCase() === orderType.toLowerCase()
    );
    return service?.serviceId || 0;
  };

  // Função para calcular preço baseado no serviço selecionado
  const calculatePrice = (serviceId: number): string => {
    const service = allServices.find(s => s.serviceId === serviceId);
    if (service) {
      return service.price.toFixed(2).replace('.', ',');
    }
    return "0,00";
  };

  // Função para obter serviços disponíveis por plataforma
  const getServicesByPlatform = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return instagramServices;
      case 'tiktok':
        return tiktokServices;
      case 'youtube':
        return youtubeServices;
      default:
        return [];
    }
  };

  // Função para agrupar serviços por tipo
  const getServicesByType = (platform: string, serviceType: string) => {
    const services = getServicesByPlatform(platform);
    return services.filter(service => 
      service.serviceType.toLowerCase() === serviceType.toLowerCase()
    );
  };

  // Função para obter todos os serviços filtrados
  const getFilteredServices = () => {
    const allServices = [...instagramServices, ...tiktokServices, ...youtubeServices];
    
    if (!serviceSearchTerm) return allServices;
    
    return allServices.filter(service => 
      service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
      service.platform.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
      service.serviceType.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
      service.quantity.toString().includes(serviceSearchTerm)
    );
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
      case 'inscritos':
        return '👥';
      case 'curtidas':
        return '❤️';
      case 'visualizações':
      case 'visualizacoes':
        return '👁️';
      default:
        return '⭐';
    }
  };

  // Função para formatar quantidade
  const formatQuantity = (quantity: number) => {
    if (quantity >= 1000) {
      return `${(quantity / 1000).toFixed(quantity % 1000 === 0 ? 0 : 1)}k`;
    }
    return quantity.toString();
  };

  // Função para verificar o status do pagamento no Firebase (mesma lógica da página de Payment)
  const checkPaymentStatus = (paymentId: string) => {
    // Referência ao documento no Firebase
    const paymentRef = doc(db, 'orders', paymentId);
    
    // Escutar mudanças no documento
    const unsubscribe = onSnapshot(paymentRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const status = data.status;
        
        setPaymentStatus(status);
        
        // Se o pagamento foi aprovado, atualizar a lista de pedidos
        if (status === 'approved') {
          unsubscribe(); // Parar de escutar mudanças
          
          // Atualizar a lista de pedidos para refletir o status
          setOrders((prev) => prev.map(order => 
            order.id === paymentId 
              ? { ...order, status: 'approved' }
              : order
          ));
          
          // Fechar modal do PIX
          setIsPixModalOpen(false);
          
          // Mostrar mensagem de sucesso
          alert("Pagamento aprovado! O pedido foi processado com sucesso.");
        }
      }
    }, (error) => {
      console.error("Erro ao verificar status do pagamento:", error);
    });
    
    // Cleanup: parar de escutar quando o componente for desmontado
    return unsubscribe;
  };

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
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // criar
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [generatePix, setGeneratePix] = useState(false);
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
    status: "pending" as "approved" | "pending" | "cancelled", // Muda para pending quando gerar PIX
    phone: "",
    serviceId: findServiceId("Seguidores", "Instagram"),
    selectedServiceId: 0, // Para o formulário PIX
    famaId: "", // <<< novo campo (providerOrderId)
  });

  // PIX
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [pixData, setPixData] = useState<{
    qrCode: string;
    pixCode: string;
    paymentId: string;
    orderId: string;
  } | null>(null);

  // Filtro de serviços
  const [serviceSearchTerm, setServiceSearchTerm] = useState("");
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);

  // Status do pagamento PIX
  const [paymentStatus, setPaymentStatus] = useState<string>("");

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.service-dropdown-container')) {
        setIsServiceDropdownOpen(false);
      }
    };

    if (isServiceDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isServiceDropdownOpen]);

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

    // Debug: Log da estrutura completa do order para identificar campos UTM
    console.log('Order structure:', order);
    console.log('Order metadata:', order.metadata);
    console.log('Order UTM object:', order.utm);
    console.log('Order UTM fields:', {
      utm_source: order.utm?.utm_source,
      utm_medium: order.utm?.utm_medium,
      utm_campaign: order.utm?.utm_campaign,
      utm_id: order.utm?.utm_id,
      pageName: order.pageName,
      source: order.source
    });

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
      // Campos UTM
      utmSource: order.utm?.utm_source || order.metadata?.utm_source || "",
      utmMedium: order.utm?.utm_medium || order.metadata?.utm_medium || "",
      utmCampaign: order.utm?.utm_campaign || order.metadata?.utm_campaign || "",
      utmId: order.utm?.utm_id || order.metadata?.utm_id || "",
      pageName: order.pageName || order.metadata?.pageName || "",
      source: order.source || order.metadata?.source || "",
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
      
      // Validação para modo PIX
      if (generatePix && newOrder.selectedServiceId === 0) {
        alert("Por favor, selecione um serviço antes de criar o pedido.");
        return;
      }
      
      // Se não for gerar PIX, cria pedido normalmente
      if (!generatePix) {
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
        resetNewOrder();
        return;
      }

      // Se for gerar PIX, usa a mesma lógica da página de Payment
      const valueCents = parseBRLToCents(newOrder.amountBRL);
      const quantityFromTitle = Number(newOrder.quantity) || 0;
      
      // Busca o serviço selecionado para obter o nome correto
      const selectedService = allServices.find(s => s.serviceId === newOrder.selectedServiceId);
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
          source: "admin_manual", // Identifica que foi criado manualmente no admin
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
        // Cria o pedido na lista imediatamente com a estrutura correta
        const customerName = `${newOrder.firstName.trim()} ${newOrder.lastName.trim()}`.trim();
        const newOrderData = {
          id: result.id,
          order_id: newOrder.famaId || "",
          famaId: newOrder.famaId || "",
          status: "pending",
          statusGroup: "pending",
          product: newOrder.orderType,
          customer: {
            name: customerName,
            email: newOrder.email.trim().toLowerCase(),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=random`,
            phone: formattedPhone,
          },
          platform: newOrder.platform,
          quantity: quantityFromTitle,
          amount: valueCents / 100,
          date: new Date().toLocaleString("pt-BR"),
          instagramProfile: newOrder.link || "",
          paymentMethod: "PIX",
          raw: {
            id: result.id,
            email: newOrder.email.trim().toLowerCase(),
            firstName: newOrder.firstName.trim(),
            lastName: newOrder.lastName.trim(),
            cpf: newOrder.cpf.trim(),
            orderName: newOrder.orderType,
            platform: newOrder.platform,
            quantity: quantityFromTitle,
            amount: valueCents,
            link: newOrder.link || undefined,
            status: "pending",
            phone: newOrder.phone || undefined,
            serviceId: newOrder.selectedServiceId,
            providerOrderId: newOrder.famaId || undefined,
            paymentId: result.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          paymentPlatform: "manual",
          utmSource: "",
          utmMedium: "",
          utmCampaign: "",
          utmId: "",
          pageName: "",
          source: "admin_manual",
        };

        // Adiciona o pedido à lista imediatamente
        setOrders((prev) => [newOrderData, ...prev]);
        setMeta((m) => ({
          ...m,
          total: m.total + 1,
          totalPages: Math.max(1, Math.ceil((m.total + 1) / m.limit)),
        }));

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
      } else {
        alert("Erro ao criar pedido. Tente novamente.");
      }

    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      alert("Falha ao criar pedido. Tente novamente.");
    } finally {
      setCreating(false);
    }
  };

  const resetNewOrder = () => {
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
      status: "pending",
      phone: "",
      serviceId: findServiceId("Seguidores", "Instagram"),
      selectedServiceId: 0,
      famaId: "",
    });
    setGeneratePix(false);
    setServiceSearchTerm("");
    setIsServiceDropdownOpen(false);
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
      serviceId: findServiceId(orderType, platform),
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

  // ------------------------ Exportar CSV

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(link);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (error) {
      console.error('Erro ao copiar link:', error);
    }
  };

  const exportToCSV = () => {
    // Preparar dados para exportação
    const csvData = orders.map(order => ({
      'ID': order.id,
      'Nome': order.customer?.name || '',
      'Email': order.customer?.email || '',
      'Telefone': order.customer?.phone || '',
      'Produto': order.product || '',
      'Plataforma': order.platform || '',
      'Quantidade': order.quantity || 0,
      'Valor': order.amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00',
      'Status': statusMap[order.status] || order.status,
      'Data': new Date(order.createdAt).toLocaleDateString('pt-BR'),
      'Link': order.link || ''
    }));

    // Converter para CSV
    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row];
          // Escapar aspas e vírgulas
          return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    // Criar e baixar arquivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `vendas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
                  onClick={exportToCSV}
                  title="Baixar vendas em CSV"
                >
                  <span className="material-symbols-outlined text-sm">
                    download
                  </span>
                  <span className="text-sm">Baixar CSV</span>
                </button>
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
                        {selectedOrder.customer.phone && (
                          <p className="text-xs text-gray-500">
                            📱 {selectedOrder.customer.phone}
                          </p>
                        )}
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
                    <div className="flex items-center gap-2">
                      <p className="flex-1 break-all">{selectedOrder.instagramProfile}</p>
                      {selectedOrder.instagramProfile && (
                        <button
                          onClick={() => handleCopyLink(selectedOrder.instagramProfile)}
                          className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                          title="Copiar link"
                        >
                          {copiedLink === selectedOrder.instagramProfile ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Seção UTM - Origem da Venda */}
                  {(selectedOrder.pageName || selectedOrder.source || selectedOrder.utmSource || selectedOrder.utmMedium || selectedOrder.utmCampaign || selectedOrder.utmId) && (
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-3">
                        Origem da Venda (UTM)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedOrder.pageName && (
                          <div>
                            <h4 className="text-xs font-medium text-gray-400 mb-1">
                              Página
                            </h4>
                            <p className="text-sm font-medium">{selectedOrder.pageName}</p>
                          </div>
                        )}
                        {selectedOrder.source && (
                          <div>
                            <h4 className="text-xs font-medium text-gray-400 mb-1">
                              Origem
                            </h4>
                            <p className="text-sm font-medium">{selectedOrder.source}</p>
                          </div>
                        )}
                        {selectedOrder.utmSource && (
                          <div>
                            <h4 className="text-xs font-medium text-gray-400 mb-1">
                              UTM Source
                            </h4>
                            <p className="text-sm font-medium">{selectedOrder.utmSource}</p>
                          </div>
                        )}
                        {selectedOrder.utmMedium && (
                          <div>
                            <h4 className="text-xs font-medium text-gray-400 mb-1">
                              UTM Medium
                            </h4>
                            <p className="text-sm font-medium">{selectedOrder.utmMedium}</p>
                          </div>
                        )}
                        {selectedOrder.utmCampaign && (
                          <div>
                            <h4 className="text-xs font-medium text-gray-400 mb-1">
                              UTM Campaign
                            </h4>
                            <p className="text-sm font-medium">{selectedOrder.utmCampaign}</p>
                          </div>
                        )}
                        {selectedOrder.utmId && (
                          <div>
                            <h4 className="text-xs font-medium text-gray-400 mb-1">
                              UTM ID
                            </h4>
                            <p className="text-sm font-medium">{selectedOrder.utmId}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle>Novo Pedido (manual)</DialogTitle>
                <DialogDescription>
                  Crie um pedido diretamente no sistema.
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
                                            serviceId: service.serviceId,
                                            orderType: service.serviceType as OrderType,
                                            platform: service.platform as Platform,
                                            quantity: service.quantity,
                                            amountBRL: calculatePrice(service.serviceId),
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
                      {newOrder.selectedServiceId > 0 && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                          {(() => {
                            const service = allServices.find(s => s.serviceId === newOrder.selectedServiceId);
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
                  {newOrder.selectedServiceId > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Detalhes do Serviço</h4>
                      {(() => {
                        const service = allServices.find(s => s.serviceId === newOrder.selectedServiceId);
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
                          serviceId: findServiceId(orderType, o.platform),
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
                          serviceId: findServiceId(o.orderType, platform),
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
              )}
              </div>

              <DialogFooter className="flex-shrink-0 pt-4">
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
                                serviceId: findServiceId(
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
                                serviceId: findServiceId(
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
                          alert("Código PIX copiado!");
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
                      alert("Informações do PIX copiadas!");
                    }
                  }}
                >
                  Copiar Informações
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

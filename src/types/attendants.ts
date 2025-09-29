export interface Attendant {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: 3;
  percentage: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAttendantData {
  name: string;
  email: string;
  percentage: number;
}

export interface UpdateAttendantData {
  name?: string;
  email?: string;
  percentage?: number;
  isActive?: boolean;
}

export interface AttendantSalesResponse {
  attendantId: string;
  totalSales: number; // Comissão do atendente (em reais)
  totalRevenue: number; // Valor total das vendas aprovadas (em reais)
  totalRevenueAll?: number; // Valor total de todos os pedidos (em reais)
  totalOrders: number;
  approvedOrders?: number;
  pendingOrders?: number;
  cancelledOrders?: number;
  orders: AttendantOrder[];
}

export interface AttendantOrder {
  id: string;
  assignedToMe?: boolean;
  customer?: {
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  product?: {
    name?: string;
    platform?: string;
    quantity?: number;
    serviceId?: number;
  };
  order?: {
    status?: string;
    amount?: number; // Em reais
    currency?: string;
    link?: string;
    paymentId?: string;
    paymentPlatform?: string;
  };
  payment?: {
    pixCode?: string;
    qrcodeImage?: string;
    externalId?: string;
  };
  utm?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_id?: string;
  };
  createdAt: string;
  updatedAt?: string;
  paidAt?: string;
  raw?: any;
  // Campos legados para compatibilidade
  email?: string;
  amount?: number; // Em reais
  status?: string;
}

export interface AttendantSalesQuery {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  sort?: string;
  search?: string;
}

export interface CreateAttendantResponse {
  message: string;
  attendant: Attendant;
  temporaryPassword: string;
  note: string;
}

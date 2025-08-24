export type OrderStatusGroup = 'pending' | 'completed' | 'canceled';

export interface OrderSummary {
  id: string;
  amount: number; // centavos
  status: OrderStatusGroup;
}

export interface CustomerListItem {
  id: string;            // email codificado
  fullName: string;
  email: string;
  phone: string | null;
  createdAt: string | null; // ISO
  status: 'active' | 'inactive';
  orders: OrderSummary[];
}

export interface CustomersListResponse {
  data: CustomerListItem[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export type CustomerDetailResponse = CustomerListItem;

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

export interface AttendantSales {
  attendantId: string;
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
  orders: AttendantOrder[];
}

export interface AttendantOrder {
  id: string;
  email: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface CreateAttendantResponse {
  message: string;
  attendant: Attendant;
  temporaryPassword: string;
  note: string;
}

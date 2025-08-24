import { getApiBase } from '@/lib/api_base';
import type { CustomersListResponse, CustomerDetailResponse } from '@/types/customers';

export type CustomersQuery = {
  search?: string;
  page?: number;
  limit?: number;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  sort?: 'createdAt_desc' | 'createdAt_asc';
};
const API_URL = getApiBase()
export async function fetchCustomers(q: CustomersQuery = {}): Promise<CustomersListResponse> {
  const params = new URLSearchParams();
  if (q.search) params.set('search', q.search);
  if (q.page) params.set('page', String(q.page));
  if (q.limit) params.set('limit', String(q.limit));
  if (q.startDate) params.set('startDate', q.startDate);
  if (q.endDate) params.set('endDate', q.endDate);
  if (q.sort) params.set('sort', q.sort);

  const url = `${API_URL}/customers${params.toString() ? `?${params}` : ''}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`GET /customers ${res.status}`);
  return res.json();
}

export async function fetchCustomerDetail(encodedId: string): Promise<CustomerDetailResponse> {
  const url = `${API_URL}/customers/${encodedId}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`GET /customers/${encodedId} ${res.status}`);
  return res.json();
}

export const encodeEmailId = (email: string) => encodeURIComponent(email.toLowerCase());

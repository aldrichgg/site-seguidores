import { useState, useEffect, useRef } from 'react';
import { getApiBase } from '@/lib/api_base';
import { useAuth } from '@/contexts/AuthContext';
import { AttendantSalesResponse } from '@/types/attendants';

interface AttendantSalesQuery {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  sort?: string;
  search?: string;
}

export const useAttendantSales = (attendantId?: string, query: AttendantSalesQuery = {}) => {
  const [sales, setSales] = useState<AttendantSalesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const API_URL = getApiBase();
  const hasFetched = useRef(false);

  const fetchSales = async () => {
    setLoading(true);
    setError(null);

    const currentUser = user;
    if (!currentUser) {
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }

    let url = '';
    if (attendantId) {
      // Admin viewing specific attendant's sales
      if (currentUser.role !== 1 && currentUser.uid !== attendantId) {
        setError("Acesso negado. Você não tem permissão para ver estas vendas.");
        setLoading(false);
        return;
      }
      url = `${API_URL}/attendants/${attendantId}/sales`;
    } else {
      // Attendant viewing their own sales
      if (currentUser.role !== 3) {
        setError("Acesso negado. Apenas atendentes podem ver suas próprias vendas.");
        setLoading(false);
        return;
      }
      // Tentar primeiro a rota específica de atendentes
      url = `${API_URL}/attendants/my/sales`;
    }

    const params = new URLSearchParams();
    if (query.page) params.append('page', String(query.page));
    if (query.limit) params.append('limit', String(query.limit));
    if (query.startDate) params.append('startDate', query.startDate);
    if (query.endDate) params.append('endDate', query.endDate);
    if (query.sort) params.append('sort', query.sort);
    if (query.search) params.append('search', query.search);

    try {
      let response = await fetch(`${url}?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      // Se a rota específica de atendentes não existir (404), tentar rota de pedidos
      if (!response.ok && response.status === 404 && !attendantId && currentUser?.role === 3) {
        const ordersUrl = `${API_URL}/orders`;
        response = await fetch(`${ordersUrl}?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar pedidos: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Filtrar pedidos por attendant_id
        const attendantOrders = data.orders?.filter((order: any) => 
          order.attendant_id === currentUser.uid || order.attendantId === currentUser.uid
        ) || [];
        
        // Calcular totais - converter de centavos para reais
        const totalRevenue = attendantOrders.reduce((sum: number, order: any) => {
          const amount = order.amount || order.order?.amount || 0;
          return sum + (amount / 100); // Converter de centavos para reais
        }, 0);
        const totalOrders = attendantOrders.length;
        
        // Para comissão, usar percentual padrão (pode ser melhorado buscando do perfil)
        const attendantPercentage = 10; // Valor padrão
        const totalSales = Math.round(totalRevenue * (attendantPercentage / 100));
        
        const salesData: AttendantSalesResponse = {
          attendantId: currentUser.uid,
          totalSales,
          totalRevenue,
          totalOrders,
          orders: attendantOrders.map((order: any) => ({
            id: order.id,
            email: order.email,
            amount: (order.amount || order.order?.amount || 0) / 100, // Converter de centavos para reais
            status: order.status || order.order?.status,
            createdAt: order.createdAt || order.date
          }))
        };
        
        setSales(salesData);
      } else if (!response.ok) {
        throw new Error(`Erro ao buscar vendas: ${response.statusText}`);
      } else {
        // Rota específica funcionou - processar dados da API do atendente
        const data = await response.json();
        
        // A API retorna valores em centavos, converter para reais
        const processedData: AttendantSalesResponse = {
          attendantId: data.attendantId,
          totalSales: data.totalSales / 100, // Converter de centavos para reais
          totalRevenue: data.totalRevenue / 100, // Converter de centavos para reais
          totalRevenueAll: data.totalRevenueAll ? data.totalRevenueAll / 100 : 0, // Converter de centavos para reais
          totalOrders: data.totalOrders,
          approvedOrders: data.approvedOrders,
          pendingOrders: data.pendingOrders,
          cancelledOrders: data.cancelledOrders,
          orders: data.orders?.map((order: any) => ({
            id: order.id,
            assignedToMe: order.assignedToMe,
            customer: order.customer,
            product: order.product,
            order: {
              ...order.order,
              amount: order.order?.amount ? order.order.amount / 100 : 0 // Converter de centavos para reais
            },
            payment: order.payment,
            utm: order.utm,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            paidAt: order.paidAt,
            raw: order.raw
          })) || []
        };
        
        setSales(processedData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao buscar vendas.');
      console.error('Erro ao buscar vendas do atendente:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !hasFetched.current) {
      hasFetched.current = true;
      fetchSales();
    }
  }, [user?.uid]);

  // Função para forçar refetch (usada pelo botão atualizar)
  const refetch = async () => {
    hasFetched.current = false;
    await fetchSales();
  };

  return { sales, loading, error, refetch };
};

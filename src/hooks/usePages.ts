import { useState, useEffect } from 'react';
import { getApiBase } from '@/lib/api_base';

const API_BASE_URL = getApiBase();

export interface UtmLink {
  id: string;
  name: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmId: string;
  fullUrl: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PageMetrics {
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  conversionRate: number;
  lastUpdated: string;
  periodData: {
    day: number;
    week: number;
    month: number;
  };
}

export interface CompanyPage {
  id: string;
  name: string;
  platform: string;
  url: string;
  description?: string;
  category: string;
  isActive: boolean;
  utmSource: string;
  utmLinks: UtmLink[];
  metrics: PageMetrics;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface PageAnalytics {
  pageId: string;
  pageName: string;
  platform: string;
  totalSales: number;
  totalOrders: number;
  conversionRate: number;
  averageOrderValue: number;
  topServices: Array<{
    serviceId: number;
    serviceName: string;
    quantity: number;
    revenue: number;
  }>;
  period: string;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface UtmLinkAnalytics {
  utmLink: {
    id: string;
    name: string;
    utmMedium: string;
    utmCampaign: string;
    utmId: string;
    fullUrl: string;
    createdAt: string;
    updatedAt: string;
  };
  metrics: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    conversionRate: number;
    orders: Array<{
      id: string;
      amount: number;
      status: string;
      utm_source: string;
      utm_medium: string;
      utm_campaign: string;
      utm_id: string;
      createdAt: string;
    }>;
    period: {
      start: string;
      end: string;
    };
  };
}

export interface CreatePageData {
  name: string;
  platform: string;
  url: string;
  description?: string;
  category: string;
  isActive?: boolean;
}

export interface UpdatePageData extends Partial<CreatePageData> {}

export interface CreateUtmLinkData {
  name: string;
  description?: string;
  utmMedium: string;
  utmCampaign: string;
  isActive?: boolean;
}

export interface UpdateUtmLinkData extends Partial<CreateUtmLinkData> {}

export const usePages = () => {
  const [pages, setPages] = useState<CompanyPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/pages`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar páginas: ${response.status}`);
      }

      const data = await response.json();
      setPages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar páginas:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPage = async (pageData: CreatePageData): Promise<CompanyPage> => {
    try {
      const response = await fetch(`${API_BASE_URL}/pages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(pageData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar página: ${response.status}`);
      }

      const result = await response.json();
      await fetchPages(); // Recarregar lista
      return result.page;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar página');
      throw err;
    }
  };

  const updatePage = async (pageId: string, pageData: UpdatePageData): Promise<CompanyPage> => {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/${pageId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(pageData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar página: ${response.status}`);
      }

      const result = await response.json();
      await fetchPages(); // Recarregar lista
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar página');
      throw err;
    }
  };

  const deletePage = async (pageId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/${pageId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao excluir página: ${response.status}`);
      }

      await fetchPages(); // Recarregar lista
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir página');
      throw err;
    }
  };

  const togglePageStatus = async (pageId: string): Promise<CompanyPage> => {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/${pageId}/toggle`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao alterar status da página: ${response.status}`);
      }

      const result = await response.json();
      await fetchPages(); // Recarregar lista
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar status da página');
      throw err;
    }
  };

  const createUtmLink = async (pageId: string, utmData: CreateUtmLinkData): Promise<UtmLink> => {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/${pageId}/utm-links`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(utmData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar link UTM: ${response.status}`);
      }

      const result = await response.json();
      await fetchPages(); // Recarregar lista
      return result.utmLink;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar link UTM');
      throw err;
    }
  };

  const updateUtmLink = async (pageId: string, utmLinkId: string, utmData: UpdateUtmLinkData): Promise<UtmLink> => {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/${pageId}/utm-links/${utmLinkId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(utmData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar link UTM: ${response.status}`);
      }

      const result = await response.json();
      await fetchPages(); // Recarregar lista
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar link UTM');
      throw err;
    }
  };

  const deleteUtmLink = async (pageId: string, utmLinkId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/${pageId}/utm-links/${utmLinkId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao excluir link UTM: ${response.status}`);
      }

      await fetchPages(); // Recarregar lista
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir link UTM');
      throw err;
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return {
    pages,
    loading,
    error,
    refetch: fetchPages,
    createPage,
    updatePage,
    deletePage,
    togglePageStatus,
    createUtmLink,
    updateUtmLink,
    deleteUtmLink,
  };
};

export const usePageAnalytics = (pageId?: string, period: string = 'week') => {
  const [analytics, setAnalytics] = useState<PageAnalytics[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchAnalytics = async () => {
    if (!pageId) return;

    try {
      setLoading(true);
      setError(null);
      
      const url = pageId 
        ? `${API_BASE_URL}/pages/${pageId}/analytics?period=${period}`
        : `${API_BASE_URL}/pages/analytics?period=${period}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar analytics: ${response.status}`);
      }

      const data = await response.json();
      setAnalytics(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [pageId, period]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
};

export const usePageUtmMetrics = (pageId?: string, period: string = 'week') => {
  const [utmMetrics, setUtmMetrics] = useState<UtmLinkAnalytics[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    console.log('🔑 [UTM Metrics] Token encontrado:', token ? 'Sim' : 'Não');
    console.log('🔑 [UTM Metrics] Token completo:', token);
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchUtmMetrics = async () => {
    console.log('🚀 [UTM Metrics] fetchUtmMetrics chamado com pageId:', pageId, 'period:', period);
    
    if (!pageId) {
      console.log('⚠️ [UTM Metrics] pageId não fornecido, cancelando busca');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 [UTM Metrics] Iniciando busca de métricas para página:', pageId);
      
      // Primeiro, buscar a página para obter os links UTM
      const pageUrl = `${API_BASE_URL}/pages/${pageId}`;
      console.log('🌐 [UTM Metrics] Buscando página em:', pageUrl);
      
      const pageResponse = await fetch(pageUrl, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      console.log('📡 [UTM Metrics] Status da resposta da página:', pageResponse.status, pageResponse.statusText);

      if (!pageResponse.ok) {
        const errorText = await pageResponse.text();
        console.error('❌ [UTM Metrics] Erro ao buscar página:', {
          status: pageResponse.status,
          statusText: pageResponse.statusText,
          errorText: errorText
        });
        throw new Error(`Erro ao buscar página: ${pageResponse.status}`);
      }

      const pageData = await pageResponse.json();
      console.log('📄 [UTM Metrics] Dados da página:', pageData);
      
      const utmLinks = pageData.utmLinks || [];
      console.log('🔗 [UTM Metrics] Links UTM encontrados:', utmLinks);
      console.log('🔗 [UTM Metrics] Quantidade de links UTM:', utmLinks.length);

      if (utmLinks.length === 0) {
        console.log('⚠️ [UTM Metrics] Nenhum link UTM encontrado para esta página');
        setUtmMetrics([]);
        return;
      }

      console.log('🚀 [UTM Metrics] Iniciando busca de métricas para', utmLinks.length, 'links UTM');

      // Buscar métricas para cada link UTM
      const metricsPromises = utmLinks.map(async (utmLink: any) => {
        try {
          const url = `${API_BASE_URL}/pages/${pageId}/utm-links/${utmLink.id}/analytics?period=${period}`;
          console.log('🌐 [UTM Metrics] Buscando métricas para:', url);
          
          const headers = getAuthHeaders();
          console.log('🔐 [UTM Metrics] Headers de autenticação:', headers);
          
          const response = await fetch(url, {
            method: 'GET',
            headers: headers,
          });

          console.log('📡 [UTM Metrics] Status da resposta:', response.status, response.statusText);

          if (!response.ok) {
            const errorText = await response.text();
            console.warn(`❌ [UTM Metrics] Erro ao buscar métricas para link ${utmLink.id}:`, {
              status: response.status,
              statusText: response.statusText,
              errorText: errorText
            });
            return null;
          }

          const data = await response.json();
          console.log('✅ [UTM Metrics] Métricas recebidas para link', utmLink.id, ':', data);
          return data;
        } catch (err) {
          console.warn(`❌ [UTM Metrics] Erro ao buscar métricas para link ${utmLink.id}:`, err);
          return null;
        }
      });

      const results = await Promise.all(metricsPromises);
      console.log('📋 [UTM Metrics] Resultados brutos:', results);
      
      const validMetrics = results.filter(result => result !== null);
      console.log('📊 [UTM Metrics] Métricas válidas encontradas:', validMetrics);
      console.log('📊 [UTM Metrics] Quantidade de métricas válidas:', validMetrics.length);
      
      setUtmMetrics(validMetrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('❌ [UTM Metrics] Erro geral ao buscar métricas UTM:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('⚡ [UTM Metrics] useEffect disparado com pageId:', pageId, 'period:', period);
    fetchUtmMetrics();
  }, [pageId, period]);

  return {
    utmMetrics,
    loading,
    error,
    refetch: fetchUtmMetrics,
  };
};

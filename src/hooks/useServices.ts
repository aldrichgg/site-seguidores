import { getApiBase } from '@/lib/api_base';
import { useState, useEffect } from 'react';

const API_BASE_URL_MAIN = getApiBase();
const API_BASE_URL = `${API_BASE_URL_MAIN}/services`; 

export interface Service {
  id: string;
  name: string;
  platform: string;
  serviceType: string;
  quantity: number;
  price: number;
  originalPrice: number;
  features: string[];
  isPopular: boolean;
  isRecommended: boolean;
  isActive: boolean;
  deliveryTime: string;
  serviceId: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const useServices = (platform?: string, serviceType?: string, includeInactive: boolean = false) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Usar rota admin se includeInactive for true
        const baseUrl = includeInactive ? `${API_BASE_URL}/admin` : API_BASE_URL;
        
        const params = new URLSearchParams();
        if (platform) params.append('platform', platform);
        if (serviceType) params.append('serviceType', serviceType);
        
        const response = await fetch(`${baseUrl}?${params}`);
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Se não usar rota admin, filtrar apenas serviços ativos
        const filteredServices = includeInactive 
          ? data 
          : data.filter((service: Service) => service.isActive);
        
        setServices(filteredServices);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        console.error('Erro ao buscar serviços:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [platform, serviceType, includeInactive]);

  return { services, loading, error };
};

// Hook para buscar serviço por serviceId (usado no pagamento)
export const useServiceByServiceId = (serviceId: number) => {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId) {
      setService(null);
      setLoading(false);
      return;
    }

    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/by-service-id/${serviceId}`);
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setService(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        console.error('Erro ao buscar serviço:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  return { service, loading, error };
};

// Hook para gerenciar serviços no admin
export const useServicesAdmin = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Usar rota admin para buscar todos os serviços (ativos e inativos)
      const response = await fetch(`${API_BASE_URL}/admin`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar serviços:', err);
    } finally {
      setLoading(false);
    }
  };

  const createService = async (serviceData: Partial<Service>) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData)
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const newService = await response.json();
      setServices(prev => [...prev, newService]);
      return newService;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      throw err;
    }
  };

  const updateService = async (id: string, updateData: Partial<Service>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const updatedService = await response.json();
      setServices(prev => prev.map(service => 
        service.id === id ? updatedService : service
      ));
      return updatedService;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      throw err;
    }
  };

  const deleteService = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      setServices(prev => prev.filter(service => service.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      throw err;
    }
  };

  const toggleService = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/toggle`, {
        method: 'PATCH',
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const updatedService = await response.json();
      setServices(prev => prev.map(service => 
        service.id === id ? updatedService : service
      ));
      return updatedService;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      throw err;
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    error,
    createService,
    updateService,
    deleteService,
    toggleService,
    refetch: fetchServices
  };
};

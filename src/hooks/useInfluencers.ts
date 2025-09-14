import { getApiBase } from '@/lib/api_base';
import { useState, useEffect } from 'react';

const API_BASE_URL = `${getApiBase()}/influencers`;

export interface ProfilePage {
  id?: string;
  name: string;
  platform: string;
  url?: string;
  utmLink?: string;
  createdAt?: string;
}

export interface Influencer {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: number;
  percentage: number;
  profilePages: ProfilePage[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InfluencerSales {
  influencerId: string;
  profilePageName: string;
  totalSales: number;
  totalOrders: number;
  orders: Array<{
    id: string;
    amount: number;
    email: string;
    first_name: string;
    last_name: string;
    order_name: string;
    platform: string;
    status: string;
    utm_source: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface CreateInfluencerData {
  name: string;
  email: string;
  percentage: number;
  profilePages: Omit<ProfilePage, 'id' | 'createdAt'>[];
}

export interface UpdateInfluencerData {
  name?: string;
  email?: string;
  percentage?: number;
  profilePages?: ProfilePage[];
}

// Hook para buscar todos os influenciadores
export const useInfluencers = () => {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInfluencers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(API_BASE_URL, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setInfluencers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar influenciadores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfluencers();
  }, []);

  return { influencers, loading, error, refetch: fetchInfluencers };
};

// Hook para buscar um influenciador específico
export const useInfluencer = (id: string) => {
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setInfluencer(null);
      setLoading(false);
      return;
    }

    const fetchInfluencer = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setInfluencer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        console.error('Erro ao buscar influenciador:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencer();
  }, [id]);

  return { influencer, loading, error };
};

// Hook para buscar vendas de um influenciador
export const useInfluencerSales = (id: string, pageName?: string) => {
  const [sales, setSales] = useState<InfluencerSales[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setSales([]);
      setLoading(false);
      return;
    }

    const fetchSales = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const url = pageName 
          ? `${API_BASE_URL}/${id}/sales?page=${encodeURIComponent(pageName)}`
          : `${API_BASE_URL}/${id}/sales`;
          
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setSales(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        console.error('Erro ao buscar vendas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [id, pageName]);

  return { sales, loading, error };
};

// Hook para gerenciar influenciadores (CRUD)
export const useInfluencersAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createInfluencer = async (data: CreateInfluencerData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateInfluencer = async (id: string, data: UpdateInfluencerData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteInfluencer = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleInfluencer = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/${id}/reset-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addProfilePage = async (id: string, pageData: Omit<ProfilePage, 'id' | 'createdAt'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/${id}/profile-pages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pageData)
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeProfilePage = async (id: string, pageId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/${id}/profile-pages/${pageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createInfluencer,
    updateInfluencer,
    deleteInfluencer,
    toggleInfluencer,
    resetPassword,
    addProfilePage,
    removeProfilePage
  };
};

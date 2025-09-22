import { useState, useEffect } from 'react';
import { getApiBase } from '@/lib/api_base';
import type { Attendant, CreateAttendantData, UpdateAttendantData, CreateAttendantResponse } from '@/types/attendants';

export const useAttendants = () => {
  const [attendants, setAttendants] = useState<Attendant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendants = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`${getApiBase()}/attendants`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setAttendants(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar atendentes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendants();
  }, []);

  return { attendants, loading, error, refetch: fetchAttendants };
};

export const useAttendantsAdmin = () => {
  const [loading, setLoading] = useState(false);

  const createAttendant = async (data: CreateAttendantData): Promise<CreateAttendantResponse> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${getApiBase()}/attendants`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erro ${response.status}`);
    }

    return response.json();
  };

  const updateAttendant = async (id: string, data: UpdateAttendantData): Promise<Attendant> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${getApiBase()}/attendants/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erro ${response.status}`);
    }

    return response.json();
  };

  const deleteAttendant = async (id: string): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${getApiBase()}/attendants/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erro ${response.status}`);
    }
  };

  const toggleAttendant = async (id: string): Promise<Attendant> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${getApiBase()}/attendants/${id}/toggle`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erro ${response.status}`);
    }

    return response.json();
  };

  const resetPassword = async (id: string): Promise<{ temporaryPassword: string }> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${getApiBase()}/attendants/${id}/reset-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erro ${response.status}`);
    }

    return response.json();
  };

  return {
    createAttendant,
    updateAttendant,
    deleteAttendant,
    toggleAttendant,
    resetPassword,
    loading,
  };
};

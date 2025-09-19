/**
 * Utilitários para validação e fallback de serviceIds
 * Usa a API existente para buscar serviceIds
 */

import { getApiBase } from '@/lib/api_base';

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

/**
 * Busca o serviceId baseado no título do serviço usando a API
 * @param title Título do serviço (ex: "5000 Seguidores Instagram")
 * @param platform Plataforma (ex: "Instagram", "YouTube", "TikTok")
 * @returns Promise<serviceId correspondente ou null se não encontrado>
 */
export async function getServiceIdFromTitle(title: string, platform: string): Promise<number | null> {
  if (!title || !platform) return null;
  
  try {
    // Normalizar o título removendo a plataforma
    const normalizedTitle = title
      .replace(/\s+(Instagram|YouTube|TikTok|Facebook).*$/i, '')
      .trim();
    
    // Normalizar a plataforma
    const normalizedPlatform = platform.toLowerCase();
    
    // Determinar o tipo de serviço baseado no título
    let serviceType = '';
    if (normalizedTitle.toLowerCase().includes('seguidores')) {
      serviceType = 'seguidores';
    } else if (normalizedTitle.toLowerCase().includes('curtidas')) {
      serviceType = 'curtidas';
    } else if (normalizedTitle.toLowerCase().includes('visualizações') || normalizedTitle.toLowerCase().includes('visualizacoes')) {
      serviceType = 'visualizacoes';
    } else if (normalizedTitle.toLowerCase().includes('inscritos')) {
      serviceType = 'inscritos';
    }
    
    if (!serviceType) return null;
    
    // Buscar na API
    const API_BASE_URL = `${getApiBase()}/services`;
    const response = await fetch(`${API_BASE_URL}?platform=${normalizedPlatform}&serviceType=${serviceType}`);
    
    if (!response.ok) {
      return null;
    }
    
    const services: Service[] = await response.json();
    
    // Buscar o serviço que corresponde ao título
    const service = services.find(s => 
      s.name.toLowerCase() === normalizedTitle.toLowerCase() &&
      s.platform.toLowerCase() === normalizedPlatform &&
      s.serviceType.toLowerCase() === serviceType
    );
    
    return service?.serviceId || null;
  } catch (error) {
    return null;
  }
}

/**
 * Busca o serviceId baseado na quantidade e tipo de serviço usando a API
 * @param quantity Quantidade (ex: 5000)
 * @param serviceType Tipo do serviço (ex: "seguidores", "curtidas", "visualizacoes")
 * @param platform Plataforma (ex: "instagram", "youtube", "tiktok")
 * @returns Promise<serviceId correspondente ou null se não encontrado>
 */
export async function getServiceIdFromDetails(quantity: number, serviceType: string, platform: string): Promise<number | null> {
  if (!quantity || !serviceType || !platform) return null;
  
  try {
    const normalizedPlatform = platform.toLowerCase();
    const normalizedServiceType = serviceType.toLowerCase();
    
    // Buscar na API
    const API_BASE_URL = `${getApiBase()}/services`;
    const response = await fetch(`${API_BASE_URL}?platform=${normalizedPlatform}&serviceType=${normalizedServiceType}`);
    
    if (!response.ok) {
      return null;
    }
    
    const services: Service[] = await response.json();
    
    // Buscar o serviço que corresponde à quantidade
    const service = services.find(s => 
      s.quantity === quantity &&
      s.platform.toLowerCase() === normalizedPlatform &&
      s.serviceType.toLowerCase() === normalizedServiceType
    );
    
    return service?.serviceId || null;
  } catch (error) {
    return null;
  }
}

/**
 * Valida se um serviceId é válido
 * @param serviceId ID do serviço
 * @returns true se válido, false caso contrário
 */
export function isValidServiceId(serviceId: number | null | undefined): boolean {
  return serviceId !== null && serviceId !== undefined && serviceId > 0;
}

/**
 * Obtém o serviceId com fallback usando a API
 * @param primaryServiceId ServiceId principal
 * @param title Título do serviço para fallback
 * @param platform Plataforma para fallback
 * @returns Promise<serviceId válido ou null se não conseguir determinar>
 */
export async function getServiceIdWithFallback(
  primaryServiceId: number | null | undefined,
  title: string,
  platform: string
): Promise<number | null> {
  // Se o serviceId principal é válido, usar ele
  if (isValidServiceId(primaryServiceId)) {
    return primaryServiceId!;
  }
  
  // Tentar buscar pelo título usando a API
  const fallbackServiceId = await getServiceIdFromTitle(title, platform);
  if (isValidServiceId(fallbackServiceId)) {
    return fallbackServiceId!;
  }
  
  return null;
}

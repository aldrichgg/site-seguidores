// Tipos de serviços
export type SocialNetwork = "instagram" | "facebook" | "youtube" | "tiktok";
export type ServiceType = "seguidores" | "curtidas" | "visualizacoes" | "inscritos";

// Interface para detalhes do pedido
export interface OrderDetails {
  title: string;
  description: string;
  basePrice: number;
  discountPrice: number;
  deliveryTime: string;
  savePercentage: number;
  features?: string[];
}

// Interface para serviços
export interface ServicePackage {
  icon: React.ReactNode;
  title: string;
  platform: string;
  price: string;
  originalPrice: string;
  features: string[];
  popular: boolean;
  delay: number;
} 
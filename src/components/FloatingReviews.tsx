import { useState, useEffect } from "react";
import { Star, X, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

// Depoimentos de exemplo
const demoReviews = [
  {
    id: 1,
    name: "Juliana S.",
    location: "São Paulo, SP",
    rating: 5,
    message: "Ganhei 1.000 seguidores em menos de 24 horas! Excelente serviço!",
    service: "Instagram Seguidores",
    time: "Há 5 minutos"
  },
  {
    id: 2,
    name: "Rafael M.",
    location: "Rio de Janeiro, RJ",
    rating: 5,
    message: "Melhor plataforma para crescer nas redes sociais. Super recomendo!",
    service: "Facebook Curtidas",
    time: "Há 12 minutos"
  },
  {
    id: 3,
    name: "Camila P.",
    location: "Belo Horizonte, MG",
    rating: 4,
    message: "Visualizações entregues rapidamente, muito satisfeita!",
    service: "YouTube Visualizações",
    time: "Há 23 minutos"
  },
  {
    id: 4,
    name: "Marcos A.",
    location: "Curitiba, PR",
    rating: 5,
    message: "Atendimento de primeira qualidade e entrega super rápida!",
    service: "TikTok Seguidores",
    time: "Há 37 minutos"
  },
  {
    id: 5,
    name: "Fernanda L.",
    location: "Fortaleza, CE",
    rating: 5,
    message: "Meu perfil ganhou muito mais visibilidade, valeu a pena!",
    service: "Instagram Curtidas",
    time: "Há 49 minutos"
  },
];

export default function FloatingReviews() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  
  // Verificar se o componente já foi fechado anteriormente na sessão
  useEffect(() => {
    if (sessionStorage.getItem("floating_reviews_dismissed") === "true") {
      setDismissed(true);
    }
  }, []);
  
  // Alternar entre mostrar e esconder o widget a cada intervalo
  useEffect(() => {
    if (dismissed) return;
    
    // Primeiro aparecer após 15 segundos na página
    const initialTimeout = setTimeout(() => {
      setIsVisible(true);
      
      // Depois esconder após 8 segundos
      const hideTimeout = setTimeout(() => {
        setIsVisible(false);
        
        // Atualizar para o próximo depoimento
        setCurrentReviewIndex((prev) => 
          prev === demoReviews.length - 1 ? 0 : prev + 1
        );
      }, 8000);
      
      return () => clearTimeout(hideTimeout);
    }, 15000);
    
    return () => clearTimeout(initialTimeout);
  }, [currentReviewIndex, dismissed]);
  
  // Rodar o ciclo a cada 30 segundos após o primeiro
  useEffect(() => {
    if (dismissed) return;
    
    const interval = setInterval(() => {
      if (!isVisible) {
        setIsVisible(true);
        
        // Esconder após 8 segundos
        setTimeout(() => {
          setIsVisible(false);
          
          // Atualizar para o próximo depoimento
          setCurrentReviewIndex((prev) => 
            prev === demoReviews.length - 1 ? 0 : prev + 1
          );
        }, 8000);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [isVisible, currentReviewIndex, dismissed]);
  
  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
    sessionStorage.setItem("floating_reviews_dismissed", "true");
  };
  
  if (dismissed) {
    return null;
  }
  
  const currentReview = demoReviews[currentReviewIndex];
  
  return (
    <div 
      className={cn(
        "fixed bottom-4 left-4 md:bottom-8 md:left-8 max-w-xs w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50 transition-all duration-500 transform",
        isVisible 
          ? "translate-y-0 opacity-100" 
          : "translate-y-24 opacity-0 pointer-events-none"
      )}
    >
      <div className="p-4">
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fechar notificação"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-primary" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-1">
              <span className="font-semibold text-sm">{currentReview.name}</span>
              <span className="text-xs text-gray-500">• {currentReview.location}</span>
            </div>
            
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3 h-3",
                    i < currentReview.rating 
                      ? "text-yellow-400 fill-yellow-400" 
                      : "text-gray-300"
                  )}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">{currentReview.time}</span>
            </div>
            
            <p className="text-sm mb-2">{currentReview.message}</p>
            
            <div className="flex items-center text-xs text-primary/80 font-medium">
              <MessageSquare className="w-3 h-3 mr-1" />
              {currentReview.service}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-2 text-xs text-center text-gray-500 rounded-b-lg border-t border-gray-100">
        Avaliações de clientes reais
      </div>
    </div>
  );
} 
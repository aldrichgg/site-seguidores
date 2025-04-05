import { useState, useEffect } from "react";
import { Star, UserPlus, Send, MessageSquare, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface RatingFormProps {
  productId?: string;
  onSubmitSuccess?: () => void;
}

export default function RatingForm({ productId = "default", onSubmitSuccess }: RatingFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [review, setReview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Verificar se o formulário já foi enviado anteriormente
  useEffect(() => {
    const hasSubmittedBefore = localStorage.getItem(`rating_submitted_${productId}`);
    if (hasSubmittedBefore === "true") {
      setIsSubmitted(true);
    }
  }, [productId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (rating === 0) {
      newErrors.rating = "Por favor, selecione uma avaliação.";
    }
    
    if (name.trim() === "") {
      newErrors.name = "Por favor, informe seu nome.";
    }
    
    if (email.trim() === "") {
      newErrors.email = "Por favor, informe seu email.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Por favor, informe um email válido.";
    }
    
    if (review.trim() === "") {
      newErrors.review = "Por favor, escreva sua avaliação.";
    } else if (review.length < 10) {
      newErrors.review = "Sua avaliação deve ter pelo menos 10 caracteres.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulação de envio para API
    setTimeout(() => {
      // Salvar no localStorage para não permitir múltiplos envios
      localStorage.setItem(`rating_submitted_${productId}`, "true");
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Limpar o formulário
      setRating(0);
      setName("");
      setEmail("");
      setReview("");
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    }, 1500);
  };

  // Renderizar mensagem de sucesso caso já tenha enviado
  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100 animate-fade-in">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce-slow">
            <ThumbsUp className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Obrigado pelo seu feedback!</h3>
          <p className="text-muted-foreground mb-4">
            Sua avaliação foi recebida com sucesso e nos ajuda a melhorar nossos serviços.
          </p>
          <Button 
            variant="outline"
            onClick={() => setIsSubmitted(false)}
            className="mt-2"
          >
            Enviar outra avaliação
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100 animate-fade-in">
      <div className="mb-6 text-center">
        <div className="flex justify-center mb-2">
          <MessageSquare className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold">Avalie nosso serviço</h3>
        <p className="text-sm text-muted-foreground">
          Compartilhe sua experiência e ajude outros usuários
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="flex justify-center mb-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-all duration-200 focus:outline-none"
                >
                  <Star
                    className={cn(
                      "w-8 h-8 transition-all duration-200",
                      (hoverRating >= star || (!hoverRating && rating >= star))
                        ? "text-yellow-400 fill-yellow-400 scale-110"
                        : "text-gray-300"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          {errors.rating && (
            <p className="text-red-500 text-xs text-center mt-1">{errors.rating}</p>
          )}
          <p className="text-center text-sm text-muted-foreground mt-1">
            {rating > 0 ? `Você selecionou ${rating} de 5 estrelas` : "Toque para avaliar"}
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(errors.name && "border-red-500")}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          
          <div>
            <Input
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(errors.email && "border-red-500")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          
          <div>
            <Textarea
              placeholder="Escreva sua avaliação aqui..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              className={cn(errors.review && "border-red-500")}
            />
            {errors.review && (
              <p className="text-red-500 text-xs mt-1">{errors.review}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar avaliação
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 
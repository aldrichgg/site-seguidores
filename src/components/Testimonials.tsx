import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: number;
  name: string;
  position: string;
  image: string;
  rating: number;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ana Silva",
    position: "Influenciadora Digital",
    image: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    text: "Desde que comecei a usar este serviço, meu engajamento aumentou em mais de 200%! Os seguidores são reais e interagem com meu conteúdo regularmente."
  },
  {
    id: 2,
    name: "Carlos Mendes",
    position: "Empresário",
    image: "https://i.pravatar.cc/150?img=8",
    rating: 5,
    text: "Aumentei minha presença nas redes sociais e agora recebo muito mais clientes através do Instagram. Serviço excepcional e resultados rápidos!"
  },
  {
    id: 3,
    name: "Bianca Oliveira",
    position: "Artista",
    image: "https://i.pravatar.cc/150?img=5",
    rating: 4,
    text: "Consegui expandir meu alcance e vender mais obras através do meu perfil. O atendimento ao cliente é excelente e sempre respondem rapidamente."
  },
  {
    id: 4,
    name: "Pedro Costa",
    position: "Criador de Conteúdo",
    image: "https://i.pravatar.cc/150?img=3",
    rating: 5,
    text: "Incrivelmente eficaz! Meus vídeos agora têm muito mais visualizações e minha conta cresce organicamente todos os dias."
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Controla o autoplay do carrossel
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay]);

  // Pausa o autoplay quando o usuário interage com o carrossel
  const handleManualNavigation = (index: number) => {
    setAutoplay(false);
    setCurrentIndex(index);
    
    // Retoma o autoplay após 10 segundos de inatividade
    setTimeout(() => setAutoplay(true), 10000);
  };

  const nextSlide = () => {
    handleManualNavigation(
      currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1
    );
  };

  const prevSlide = () => {
    handleManualNavigation(
      currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1
    );
  };

  return (
    <section id="testimonials" className="w-full py-10 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Depoimentos de pessoas que transformaram sua presença digital com nossos serviços
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Carrossel de depoimentos */}
          <div className="overflow-hidden rounded-xl bg-card shadow-lg">
            <div 
              className="transition-all duration-500 ease-in-out flex"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="min-w-full p-6 flex flex-col md:flex-row items-center gap-6 animate-fade-in"
                >
                  <div className="flex-shrink-0 mb-4 md:mb-0">
                    <div className="relative">
                      <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-primary/20">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2">
                        <Quote className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-5 h-5 mr-1",
                            i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    
                    <blockquote className="italic text-lg mb-3 text-foreground">
                      "{testimonial.text}"
                    </blockquote>
                    
                    <div>
                      <h4 className="font-bold text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botões de navegação */}
          <button 
            onClick={prevSlide}
            className="absolute top-1/2 -translate-y-1/2 -left-3 md:-left-5 bg-primary hover:bg-primary/90 text-white rounded-full p-2 shadow-lg transition-all"
            aria-label="Depoimento anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute top-1/2 -translate-y-1/2 -right-3 md:-right-5 bg-primary hover:bg-primary/90 text-white rounded-full p-2 shadow-lg transition-all"
            aria-label="Próximo depoimento"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicadores */}
          <div className="flex justify-center mt-4 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleManualNavigation(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  currentIndex === index 
                    ? "bg-primary w-6" 
                    : "bg-primary/30 hover:bg-primary/50"
                )}
                aria-label={`Ir para depoimento ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 
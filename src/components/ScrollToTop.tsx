import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useLocation } from "react-router-dom";

/**
 * Componente ScrollToTop
 * 
 * 1. Reseta a posição da janela para o topo quando a rota muda
 * 2. Exibe um botão para rolar para o topo da página quando o usuário desce
 *    além de um determinado ponto. O botão é animado para aparecer/desaparecer
 *    suavemente.
 */
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { pathname } = useLocation();

  // Resetar a posição de scroll quando a rota muda
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Função para verificar a posição de rolagem e mostrar/esconder o botão
  const toggleVisibility = () => {
    if (window.scrollY > 500) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Função para rolar para o topo da página
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Adicionar o event listener quando o componente é montado
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    
    // Limpar o event listener quando o componente é desmontado
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-40 p-3 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 hover:shadow-xl group ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      aria-label="Voltar ao topo"
    >
      <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
      
      {/* Efeito pulse */}
      <span className="absolute inset-0 rounded-full bg-white opacity-30 animate-ping"></span>
    </button>
  );
};

export default ScrollToTop; 
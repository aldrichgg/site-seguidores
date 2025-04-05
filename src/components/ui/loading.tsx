import React from "react";
import { cn } from "@/lib/utils";

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "accent" | "white";
}

/**
 * Componente de Loading
 * 
 * Este componente exibe um indicador de carregamento animado com várias opções 
 * de personalização. Útil para indicar estados de carregamento em diferentes
 * partes da aplicação.
 * 
 * @param size - Tamanho do loader (sm, md, lg, xl)
 * @param variant - Cor do loader (primary, secondary, accent, white)
 * @param className - Classes CSS adicionais
 */
export function Loading({
  size = "md",
  variant = "primary",
  className,
  ...props
}: LoadingProps) {
  // Determinar classes de tamanho
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };
  
  // Determinar classes de cor
  const variantClasses = {
    primary: "text-primary",
    secondary: "text-gray-500",
    accent: "text-accent",
    white: "text-white",
  };
  
  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {/* Spinner exterior */}
      <div className="absolute inset-0 border-t-2 border-r-2 border-transparent rounded-full animate-spin" style={{ borderTopColor: "currentColor", borderRightColor: "currentColor" }}></div>
      
      {/* Spinner interior (gira no sentido oposto) */}
      <div 
        className="absolute inset-1 border-b-2 border-l-2 border-transparent rounded-full animate-spin" 
        style={{ 
          borderBottomColor: "currentColor", 
          borderLeftColor: "currentColor",
          animationDirection: "reverse", 
          animationDuration: "0.6s" 
        }}
      ></div>
      
      {/* Ponto central */}
      <div className="absolute w-1.5 h-1.5 rounded-full bg-current"></div>
    </div>
  );
}

/**
 * Componente de página de carregamento
 * 
 * Exibe uma tela de carregamento em tela cheia com o logo e um indicador de loading,
 * útil durante o carregamento inicial da aplicação ou transições entre páginas.
 */
export function LoadingPage() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-950 z-50">
      <div className="h-16 w-16 flex items-center justify-center relative">
        <div className="absolute inset-0 rounded-full border-t-2 border-accent opacity-20 animate-spin"></div>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-accent relative overflow-hidden">
          <span className="absolute inset-0 bg-white/20 transform rotate-45 translate-y-2/3"></span>
          <span className="absolute bottom-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse"></span>
        </div>
      </div>
      <div className="mt-4 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
        ImpulseGram
      </div>
      
      <Loading size="lg" variant="primary" className="mb-3" />
      
      <p className="text-muted-foreground text-sm animate-pulse">Carregando...</p>
    </div>
  );
}

/**
 * Componente de carregamento de seção
 * 
 * Útil para exibir um indicador de carregamento em uma seção específica
 * da página, como quando dados estão sendo carregados.
 * 
 * @param message - Mensagem opcional para exibir abaixo do loader
 * @param className - Classes CSS adicionais
 */
export function SectionLoading({
  message,
  className,
  ...props
}: { message?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "w-full min-h-[200px] flex flex-col items-center justify-center py-10",
        className
      )} 
      {...props}
    >
      <Loading size="md" variant="primary" className="mb-4" />
      {message && (
        <p className="text-muted-foreground text-sm">{message}</p>
      )}
    </div>
  );
}

export default Loading; 
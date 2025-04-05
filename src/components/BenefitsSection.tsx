import React from "react";
import { BadgeCustom } from "./ui/badge-custom";
import { 
  TrendingUpIcon, 
  UsersIcon, 
  ShieldCheckIcon, 
  SparklesIcon, 
  BarChartIcon, 
  ZapIcon, 
  HeartHandshakeIcon, 
  RotateCwIcon 
} from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <TrendingUpIcon className="w-5 h-5" />,
      title: "Crescimento Acelerado",
      description: "Aumente sua base de seguidores de forma rápida e eficiente, acelerando o crescimento da sua presença digital.",
      color: "bg-gradient-to-br from-primary/10 to-accent/10",
      textColor: "text-primary",
      delay: 100
    },
    {
      icon: <UsersIcon className="w-5 h-5" />,
      title: "Seguidores Reais",
      description: "Apenas contas reais e ativas, garantindo engajamento autêntico e resultados de longo prazo para seu perfil.",
      color: "bg-gradient-to-br from-blue-500/10 to-blue-600/10",
      textColor: "text-blue-600",
      delay: 200
    },
    {
      icon: <ShieldCheckIcon className="w-5 h-5" />,
      title: "100% Seguro",
      description: "Métodos de entrega seguros e em conformidade com as diretrizes das plataformas, protegendo sua conta.",
      color: "bg-gradient-to-br from-green-500/10 to-green-600/10",
      textColor: "text-green-600",
      delay: 300
    },
    {
      icon: <SparklesIcon className="w-5 h-5" />,
      title: "Maior Credibilidade",
      description: "Uma base sólida de seguidores aumenta a confiança de potenciais seguidores, clientes e parceiros.",
      color: "bg-gradient-to-br from-amber-500/10 to-amber-600/10",
      textColor: "text-amber-600",
      delay: 400
    },
    {
      icon: <BarChartIcon className="w-5 h-5" />,
      title: "Melhores Resultados",
      description: "Alcance maior visibilidade e melhores resultados nos algoritmos das plataformas sociais.",
      color: "bg-gradient-to-br from-purple-500/10 to-purple-600/10",
      textColor: "text-purple-600",
      delay: 500
    },
    {
      icon: <ZapIcon className="w-5 h-5" />,
      title: "Entrega Rápida",
      description: "Início da entrega em até 24 horas após a confirmação do pagamento, com distribuição gradual e natural.",
      color: "bg-gradient-to-br from-orange-500/10 to-orange-600/10",
      textColor: "text-orange-600",
      delay: 600
    },
    {
      icon: <HeartHandshakeIcon className="w-5 h-5" />,
      title: "Suporte Dedicado",
      description: "Equipe de suporte pronta para ajudar com qualquer questão, disponível 24/7 para garantir sua satisfação.",
      color: "bg-gradient-to-br from-pink-500/10 to-pink-600/10",
      textColor: "text-pink-600",
      delay: 700
    },
    {
      icon: <RotateCwIcon className="w-5 h-5" />,
      title: "Garantia de Reposição",
      description: "Se houver qualquer queda nos números, repomos automaticamente sem custo adicional por até 30 dias.",
      color: "bg-gradient-to-br from-teal-500/10 to-teal-600/10",
      textColor: "text-teal-600",
      delay: 800
    }
  ];

  return (
    <section id="benefits" className="py-10 md:py-16 px-4 lg:px-6 relative overflow-hidden">
      {/* Elementos de fundo */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white pointer-events-none"></div>
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#888_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
      
      {/* Formas decorativas */}
      <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-20 right-[5%] w-80 h-80 rounded-full bg-accent/5 blur-3xl"></div>
      
      {/* Elementos de redes sociais */}
      <div className="absolute right-[15%] top-1/4 hidden lg:block">
        <div className="relative w-16 h-16 rotate-12">
          <div className="absolute inset-0 rounded-md border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm flex items-center justify-center text-blue-500 opacity-70">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M6.135 3H8.5v9.5a3.75 3.75 0 0 1-7.5 0V8.25H3.5V12.5a2.25 2.25 0 0 0 4.5 0V3.75h-2z" />
              <path fillRule="evenodd" d="M9.5 3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V5c0-1.105.895-2 2-2h2zm-2 9V4.75h2V12h-2zm10-9a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V5c0-1.105.895-2 2-2h2zM15.5 12V4.75h2V12h-2z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="absolute left-[10%] bottom-1/3 hidden lg:block">
        <div className="relative w-14 h-14 -rotate-12">
          <div className="absolute inset-0 rounded-full border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm flex items-center justify-center text-pink-500 opacity-70">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </div>
        </div>
    </div>
      
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-10">
          <BadgeCustom
            variant="pill"
            className="mb-2 bg-gradient-to-r from-primary/10 to-accent/20 text-primary border-primary/20 inline-flex items-center gap-1"
          >
            <SparklesIcon className="w-3.5 h-3.5" />
            Benefícios
          </BadgeCustom>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Por que escolher nossos serviços
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Oferecemos uma solução completa para aumentar sua presença nas redes sociais, com serviços de qualidade que realmente fazem a diferença para sua marca online.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 slide-up relative overflow-hidden group"
              style={{ animationDelay: `${benefit.delay}ms` }}
            >
              {/* Efeito de hover */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              {/* Círculo decorativo */}
              <div className={`w-10 h-10 rounded-full ${benefit.color} flex items-center justify-center ${benefit.textColor} mb-3 group-hover:scale-110 transition-transform`}>
                {benefit.icon}
              </div>
              
              <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                {benefit.title}
              </h3>
              
              <p className="text-sm text-muted-foreground">
                {benefit.description}
              </p>
              
              {/* Elemento decorativo no canto */}
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-gray-100/80 to-transparent rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
        
        {/* Banner de métricas */}
        <div className="mt-10 bg-gradient-to-r from-primary to-accent rounded-2xl shadow-lg overflow-hidden relative">
          <div className="absolute inset-0 bg-pattern-overlay mix-blend-soft-light opacity-10"></div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            <div className="p-4 md:p-6 text-center text-white">
              <div className="text-3xl md:text-4xl font-bold mb-1">100%</div>
              <div className="text-sm text-white/80">Seguidores Reais</div>
            </div>
            
            <div className="p-4 md:p-6 text-center text-white">
              <div className="text-3xl md:text-4xl font-bold mb-1">30 dias</div>
              <div className="text-sm text-white/80">Garantia de Reposição</div>
            </div>
          
            <div className="p-4 md:p-6 text-center text-white">
              <div className="text-3xl md:text-4xl font-bold mb-1">24/7</div>
              <div className="text-sm text-white/80">Suporte ao Cliente</div>
            </div>
            
            <div className="p-4 md:p-6 text-center text-white">
              <div className="text-3xl md:text-4xl font-bold mb-1">+15 mil</div>
              <div className="text-sm text-white/80">Clientes Satisfeitos</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;

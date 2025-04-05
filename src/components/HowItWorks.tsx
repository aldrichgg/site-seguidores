import React from "react";
import { BadgeCustom } from "./ui/badge-custom";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Escolha seu plano",
      description: "Selecione o pacote que melhor atende às suas necessidades de crescimento."
    },
    {
      number: "02",
      title: "Forneça seus detalhes",
      description: "Informe sua conta ou URL para que possamos direcionar o serviço corretamente."
    },
    {
      number: "03",
      title: "Processe o pagamento",
      description: "Realize o pagamento de forma segura com qualquer método aceito."
    },
    {
      number: "04",
      title: "Observe os resultados",
      description: "Relaxe e veja seu engajamento e seguidores crescerem progressivamente."
    }
  ];

  return (
    <section id="how-it-works" className="py-10 px-4 relative bg-secondary/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <BadgeCustom
            variant="pill"
            className="mb-3"
          >
            Processo simplificado
          </BadgeCustom>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Como funciona
          </h2>
          
          <p className="text-lg text-muted-foreground">
            Nosso processo é simples e transparente, permitindo que você comece a crescer em poucos minutos.
          </p>
        </div>
        
        <div className="relative mt-10">
          {/* Connection line */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-[calc(100%-5rem)] bg-primary/20 hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`relative glass-card p-6 rounded-xl slide-up hover-lift ${
                  index % 2 !== 0 ? "md:mt-16" : ""
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute -top-8 left-8 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                  {step.number}
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

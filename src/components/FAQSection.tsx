import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BadgeCustom } from "@/components/ui/badge-custom";
import { HelpCircleIcon, MessageCircleIcon, BellRingIcon, HeartIcon, ArrowUpCircleIcon } from "lucide-react";

const FAQSection = () => {
  return (
    <section id="faq" className="py-10 md:py-16 px-4 lg:px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#666_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
      
      {/* Elementos decorativos de redes sociais */}
      <div className="absolute top-24 left-[15%] w-24 h-24 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-xl"></div>
      <div className="absolute bottom-24 right-[15%] w-32 h-32 rounded-full bg-gradient-to-br from-pink-400/10 to-red-400/10 blur-xl"></div>
      
      {/* Ícones de interações sociais */}
      <div className="absolute top-1/4 right-[10%] transform -rotate-12 opacity-10 hidden lg:block">
        <div className="flex items-center gap-2 bg-white p-3 rounded-full shadow-sm">
          <HeartIcon className="w-6 h-6 text-pink-500" />
          <span className="text-sm font-medium text-gray-600">1.2k</span>
        </div>
      </div>
      
      <div className="absolute bottom-1/3 left-[10%] transform rotate-6 opacity-10 hidden lg:block">
        <div className="flex items-center gap-2 bg-white p-3 rounded-full shadow-sm">
          <MessageCircleIcon className="w-6 h-6 text-blue-500" />
          <span className="text-sm font-medium text-gray-600">486</span>
        </div>
      </div>
      
      <div className="absolute top-1/2 left-[5%] transform -rotate-6 opacity-10 hidden lg:block">
        <div className="flex items-center gap-2 bg-white p-3 rounded-full shadow-sm">
          <ArrowUpCircleIcon className="w-6 h-6 text-green-500" />
          <span className="text-sm font-medium text-gray-600">12.3k</span>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-8">
          <BadgeCustom
            variant="pill"
            className="mb-2 bg-gradient-to-r from-primary/10 to-accent/20 text-primary border-primary/20"
          >
            <span className="inline-flex items-center gap-1">
              <HelpCircleIcon className="w-3.5 h-3.5" />
              FAQ
            </span>
          </BadgeCustom>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Perguntas Frequentes</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Confira as dúvidas mais comuns sobre nossos serviços e como podemos ajudar a aumentar sua presença nas redes sociais.
          </p>
        </div>

        <div className="bg-white border border-slate-100 p-4 md:p-6 rounded-2xl shadow-sm relative overflow-hidden">
          {/* Elementos decorativos do card */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
          <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-primary/10 blur-xl"></div>
        
        <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="item-1" className="border-b border-slate-100 last:border-b-0">
              <AccordionTrigger className="text-lg font-medium py-3 hover:text-primary transition-colors">
                <span className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                    <BellRingIcon className="w-4 h-4 text-primary" />
                  </span>
                  Os seguidores são reais?
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-11 pb-3 text-muted-foreground">
                Sim! Trabalhamos apenas com contas reais e autênticas. Não utilizamos bots ou contas falsas, o que garante que o engajamento seja verdadeiro e que sua conta não seja penalizada pelos algoritmos das redes sociais.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b border-slate-100 last:border-b-0">
              <AccordionTrigger className="text-lg font-medium py-3 hover:text-primary transition-colors">
                <span className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                    <BellRingIcon className="w-4 h-4 text-primary" />
                  </span>
                  Quanto tempo leva para receber os seguidores?
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-11 pb-3 text-muted-foreground">
                A entrega começa em até 24 horas após a confirmação do pagamento. Dependendo do pacote escolhido, a entrega total pode levar de 2 a 14 dias. Utilizamos um sistema gradual para simular um crescimento natural e proteger sua conta.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b border-slate-100 last:border-b-0">
              <AccordionTrigger className="text-lg font-medium py-3 hover:text-primary transition-colors">
                <span className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                    <BellRingIcon className="w-4 h-4 text-primary" />
                  </span>
                  Preciso fornecer minha senha?
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-11 pb-3 text-muted-foreground">
                <strong>Absolutamente não!</strong> Nunca solicitamos senhas ou dados de acesso às suas contas. Apenas precisamos do seu nome de usuário ou link público da sua conta para realizar a entrega dos serviços.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-b border-slate-100 last:border-b-0">
              <AccordionTrigger className="text-lg font-medium py-3 hover:text-primary transition-colors">
                <span className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                    <BellRingIcon className="w-4 h-4 text-primary" />
                  </span>
                  Existe garantia de reposição?
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-11 pb-3 text-muted-foreground">
                Sim, oferecemos garantia de reposição por 30 dias. Se houver qualquer queda no número de seguidores entregues durante esse período, faremos a reposição automaticamente sem custo adicional.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-b border-slate-100 last:border-b-0">
              <AccordionTrigger className="text-lg font-medium py-3 hover:text-primary transition-colors">
                <span className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                    <BellRingIcon className="w-4 h-4 text-primary" />
                  </span>
                  É seguro para minha conta?
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-11 pb-3 text-muted-foreground">
                Completamente seguro. Nossos métodos são desenvolvidos para respeitar as diretrizes de todas as plataformas. A entrega gradual e o uso de contas reais garantem que sua conta não seja penalizada ou bloqueada.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border-b border-slate-100 last:border-b-0">
              <AccordionTrigger className="text-lg font-medium py-3 hover:text-primary transition-colors">
                <span className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                    <BellRingIcon className="w-4 h-4 text-primary" />
                  </span>
                  Como funcionam os planos por assinatura?
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-11 pb-3 text-muted-foreground">
                Os planos por assinatura oferecem um crescimento consistente e contínuo para sua conta. Com pagamento mensal recorrente, você recebe seguidores, curtidas e outros benefícios de forma gradual ao longo do mês, além de ter acesso a recursos exclusivos como análise de métricas e consultoria personalizada, dependendo do plano escolhido.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border-b border-slate-100 last:border-b-0">
              <AccordionTrigger className="text-lg font-medium py-3 hover:text-primary transition-colors">
                <span className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                    <BellRingIcon className="w-4 h-4 text-primary" />
                  </span>
                  Como funciona o cancelamento da assinatura?
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-11 pb-3 text-muted-foreground">
                Você pode cancelar sua assinatura a qualquer momento através do seu painel de controle. O cancelamento será efetivo ao final do período já pago, e você não será cobrado novamente. Não há taxas de cancelamento ou período mínimo de permanência. Todos os benefícios continuam ativos até o final do período pago.
              </AccordionContent>
            </AccordionItem>
        </Accordion>
          
          {/* Badge de Suporte */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/5 to-accent/10 border border-primary/10">
              <MessageCircleIcon className="w-4 h-4 text-primary" />
              <span className="text-sm">Ainda tem dúvidas? Fale com nosso suporte 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

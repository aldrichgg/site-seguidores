import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import HowItWorks from "@/components/HowItWorks";
import FAQSection from "@/components/FAQSection";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { BadgeCustom } from "@/components/ui/badge-custom";
import { Button } from "@/components/ui/button";
import InstagramIcon from "@/assets/icons/instagram";
import YoutubeIcon from "@/assets/icons/youtube";
import TikTokIcon from "@/assets/icons/tiktok";
import {
  ChevronDown,
  Check,
  X,
  Clock,
  Flame,
  Shield,
  UserCheck,
  Headset,
  BadgeCheck,
  Calendar,
  Award,
  Star,
} from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ClientChatCarousel from "@/components/ClientChatCarousel";
import { useUTM } from "@/hooks/use-utm";
import { useServices } from "@/hooks/useServices";

const Index = () => {
  const [activeTab, setActiveTab] = useState("instagram");
  const [activeServiceType, setActiveServiceType] = useState("seguidores");
  const [isNetworkMenuOpen, setIsNetworkMenuOpen] = useState(false);

  // Hook para buscar serviços da API (apenas serviços ativos para usuários)
  const { services, loading: servicesLoading, error: servicesError } = useServices(activeTab, activeServiceType, false);

  /* const { user } = useAuth(); */
  // Este useEffect executará apenas quando o componente for montado, não quando activeTab ou activeServiceType mudarem
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // Dependência vazia significa que só executa uma vez, na montagem do componente

  // Este useEffect lida com a lógica de mudança de categoria baseada na rede social
  useEffect(() => {
    /* console.log("USUÁRIO DEPOIS DE LOGADO", user); */
    if (activeTab === "youtube" && activeServiceType === "seguidores") {
      setActiveServiceType("inscritos");
    } else if (activeTab !== "youtube" && activeServiceType === "inscritos") {
      setActiveServiceType("seguidores");
    }
  }, [activeTab, activeServiceType]);

  // useEffect removido - agora sempre mostramos todas as abas

  // Este useEffect configura os event listeners para scrolling suave
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href")?.substring(1);
        if (!targetId) return;
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: "smooth",
          });
        }
      });
    });
    const animatedElements = document.querySelectorAll(".slide-up, .fade-in");
    animatedElements.forEach((element) => {
      element.classList.add("animate-fade-in");
    });
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.removeEventListener("click", () => {});
      });
    };
  }, [activeTab, activeServiceType]);
  const getSocialNetworkIcon = (network) => {
    switch (network) {
      case "instagram":
        return <InstagramIcon className="w-6 h-6 text-[#E1306C]" />;
      case "tiktok":
        return <TikTokIcon className="w-6 h-6" />;
      default:
        return <InstagramIcon className="w-6 h-6 text-[#E1306C]" />;
    }
  };
  const getNetworkColor = (network) => {
    switch (network) {
      case "instagram":
        return "from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-pink-200 text-pink-800";
      case "facebook":
        return "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-800";
      case "youtube":
        return "bg-red-50 hover:bg-red-100 border-red-200 text-red-800";
      case "tiktok":
        return "bg-black/5 hover:bg-black/10 border-black/20 text-gray-800";
      default:
        return "from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-pink-200 text-pink-800";
    }
  };
  const toggleNetworkMenu = () => {
    setIsNetworkMenuOpen(!isNetworkMenuOpen);
  };
  const getServicePackages = (network, type) => {
    const followerFeatures = [
      "Contas reais e ativas",
      "Entrega gradual e natural",
      "Garantia de reposição",
      "Suporte prioritário",
    ];
    const likeFeatures = [
      "Curtidas 100% reais",
      "Entrega imediata",
      "Aumento de engajamento",
      "Suporte 24/7",
    ];
    const viewFeatures = [
      "Visualizações de alta qualidade",
      "Entrega rápida",
      "Aumento no alcance",
      "Melhora posicionamento",
    ];
    let icon = null;
    let popular = false;
    let title = "";
    let platform = "";
    switch (network) {
      case "instagram":
        icon = <InstagramIcon className="w-6 h-6 text-[#E1306C]" />;
        platform = "Instagram";
        switch (type) {
          case "seguidores":
            return [
              {
                icon,
                title: "200 Seguidores",
                platform,
                price: "R$19,90",
                originalPrice: "R$29,90",
                features: followerFeatures,
                popular: false,
                delay: 150,
                serviceId: 597,
              },
              {
                icon,
                title: "500 Seguidores",
                platform,
                price: "R$28,90",
                originalPrice: "R$48,90",
                features: followerFeatures,
                popular: false,
                delay: 200,
                serviceId: 597,
              },
              {
                icon,
                title: "1.000 Seguidores",
                platform,
                price: "R$47,30",
                originalPrice: "R$83,90",
                features: followerFeatures,
                popular: true,
                delay: 250,
                serviceId: 597,
              },
              {
                icon,
                title: "2.000 Seguidores",
                platform,
                price: "R$53,70",
                originalPrice: "R$99,90",
                features: followerFeatures,
                popular: false,
                delay: 300,
                serviceId: 597,
              },
              {
                icon,
                title: "5.000 Seguidores",
                platform,
                price: "R$139,90",
                originalPrice: "R$179,90",
                features: followerFeatures,
                popular: false,
                recomended: true,
                delay: 350,
                serviceId: 597,
              },
              {
                icon,
                title: "10.000 Seguidores",
                platform,
                price: "R$239,90",
                originalPrice: "R$283,70",
                features: followerFeatures,
                popular: false,
                delay: 350,
                serviceId: 597,
              },
            ];
          case "curtidas":
            return [
              {
                icon,
                title: "200 Curtidas",
                platform,
                price: "R$3,00",
                originalPrice: "R$4,90",
                features: likeFeatures,
                popular: false,
                delay: 100,
                serviceId: 598,
              },
              {
                icon,
                title: "400 Curtidas",
                platform,
                price: "R$3,50",
                originalPrice: "R$6,90",
                features: likeFeatures,
                popular: false,
                delay: 150,
                serviceId: 598,
              },
              {
                icon,
                title: "600 Curtidas",
                platform,
                price: "R$5,50",
                originalPrice: "R$9,90",
                features: likeFeatures,
                popular: false,
                delay: 200,
                serviceId: 598,
              },
              {
                icon,
                title: "1.000 Curtidas",
                platform,
                price: "R$10,00",
                originalPrice: "R$18,90",
                features: likeFeatures,
                popular: false,
                delay: 250,
                serviceId: 598,
              },
              {
                icon,
                title: "2.000 Curtidas",
                platform,
                price: "R$18,00",
                originalPrice: "R$29,90",
                features: likeFeatures,
                popular: false,
                delay: 300,
                serviceId: 598,
              },
              {
                icon,
                title: "6.000 Curtidas",
                platform,
                price: "R$35,00",
                originalPrice: "R$59,90",
                features: likeFeatures,
                popular: false,
                delay: 350,
                serviceId: 598,
              },
            ];
          case "visualizacoes":
            return [
              {
                icon,
                title: "500 Visualizações",
                platform,
                price: "R$3,00",
                originalPrice: "R$5,90",
                features: [
                  "Visualizações de qualidade",
                  "Entrega rápida",
                  "Impulsiona algoritmo",
                  "Maior alcance",
                ],
                popular: false,
                delay: 100,
                serviceId: 250,
              },
              {
                icon,
                title: "1.000 Visualizações",
                platform,
                price: "R$6,00",
                originalPrice: "R$9,90",
                features: [
                  "Visualizações de qualidade",
                  "Entrega rápida",
                  "Impulsiona algoritmo",
                  "Maior alcance",
                ],
                popular: false,
                delay: 150,
                serviceId: 250,
              },
              {
                icon,
                title: "3.000 Visualizações",
                platform,
                price: "R$16,00",
                originalPrice: "R$24,90",
                features: [
                  "Visualizações de qualidade",
                  "Entrega rápida",
                  "Impulsiona algoritmo",
                  "Maior alcance",
                ],
                popular: false,
                delay: 200,
                serviceId: 250,
              },
              {
                icon,
                title: "5.000 Visualizações",
                platform,
                price: "R$25,00",
                originalPrice: "R$39,90",
                features: [
                  "Visualizações de qualidade",
                  "Entrega rápida",
                  "Impulsiona algoritmo",
                  "Maior alcance",
                ],
                popular: false,
                delay: 250,
                serviceId: 250,
              },
              {
                icon,
                title: "10.000 Visualizações",
                platform,
                price: "R$50,00",
                originalPrice: "R$79,90",
                features: [
                  "Visualizações de qualidade",
                  "Entrega rápida",
                  "Impulsiona algoritmo",
                  "Maior alcance",
                ],
                popular: false,
                delay: 300,
                serviceId: 250,
              },
              {
                icon,
                title: "30.000 Visualizações",
                platform,
                price: "R$130,00",
                originalPrice: "R$199,90",
                features: [
                  "Visualizações de qualidade",
                  "Entrega rápida",
                  "Impulsiona algoritmo",
                  "Maior alcance",
                ],
                popular: false,
                delay: 350,
                serviceId: 250,
              },
            ];
          default:
            return [];
        }
      case "youtube":
        icon = <YoutubeIcon className="w-6 h-6 text-[#FF0000]" />;
        platform = "YouTube";
        switch (type) {
          case "inscritos":
            return [
              {
                icon,
                title: "1.000 Inscritos",
                platform,
                price: "R$180,00",
                originalPrice: "R$250,00",
                features: [
                  "Inscritos reais e ativos",
                  "Entrega gradual",
                  "Permanência garantida",
                  "Impulsiona algoritmo",
                ],
                popular: false,
                delay: 100,
              },
              {
                icon,
                title: "3.000 Inscritos",
                platform,
                price: "R$540,00",
                originalPrice: "R$700,00",
                features: [
                  "Inscritos reais e ativos",
                  "Entrega gradual",
                  "Permanência garantida",
                  "Impulsiona algoritmo",
                ],
                popular: false,
                delay: 150,
              },
              {
                icon,
                title: "5.000 Inscritos",
                platform,
                price: "R$900,00",
                originalPrice: "R$1.200,00",
                features: [
                  "Inscritos reais e ativos",
                  "Entrega gradual",
                  "Permanência garantida",
                  "Impulsiona algoritmo",
                ],
                popular: true,
                delay: 200,
              },
              {
                icon,
                title: "10.000 Inscritos",
                platform,
                price: "R$1.800,00",
                originalPrice: "R$2.300,00",
                features: [
                  "Inscritos reais e ativos",
                  "Entrega gradual",
                  "Permanência garantida",
                  "Impulsiona algoritmo",
                ],
                popular: false,
                delay: 250,
              },
              {
                icon,
                title: "30.000 Inscritos",
                platform,
                price: "R$5.400,00",
                originalPrice: "R$6.800,00",
                features: [
                  "Inscritos reais e ativos",
                  "Entrega gradual",
                  "Permanência garantida",
                  "Impulsiona algoritmo",
                ],
                popular: false,
                delay: 300,
              },
              {
                icon,
                title: "100.000 Inscritos",
                platform,
                price: "R$12.600,00",
                originalPrice: "R$16.000,00",
                features: [
                  "Inscritos reais e ativos",
                  "Entrega gradual",
                  "Permanência garantida",
                  "Impulsiona algoritmo",
                ],
                popular: false,
                delay: 350,
              },
            ];
          case "curtidas":
            return [
              {
                icon,
                title: "1.000 Curtidas",
                platform,
                price: "R$25,00",
                originalPrice: "R$39,90",
                features: [
                  "Curtidas reais e permanentes",
                  "Aumento na popularidade",
                  "Entrega gradual",
                  "Impulsiona algoritmo",
                ],
                popular: false,
                delay: 100,
              },
              {
                icon,
                title: "3.000 Curtidas",
                platform,
                price: "R$75,00",
                originalPrice: "R$99,90",
                features: [
                  "Curtidas reais e permanentes",
                  "Aumento na popularidade",
                  "Entrega gradual",
                  "Impulsiona algoritmo",
                ],
                popular: false,
                delay: 150,
              },
              {
                icon,
                title: "5.000 Curtidas",
                platform,
                price: "R$125,00",
                originalPrice: "R$169,90",
                features: [
                  "Curtidas reais e permanentes",
                  "Aumento na popularidade",
                  "Entrega gradual",
                  "Impulsiona algoritmo",
                ],
                popular: true,
                delay: 200,
              },
              {
                icon,
                title: "6.000 Curtidas",
                platform,
                price: "R$150,00",
                originalPrice: "R$199,90",
                features: [
                  "Curtidas reais e permanentes",
                  "Aumento na popularidade",
                  "Entrega gradual",
                  "Impulsiona algoritmo",
                ],
                popular: false,
                delay: 250,
              },
              {
                icon,
                title: "9.000 Curtidas",
                platform,
                price: "R$225,00",
                originalPrice: "R$289,90",
                features: [
                  "Curtidas reais e permanentes",
                  "Aumento na popularidade",
                  "Entrega gradual",
                  "Impulsiona algoritmo",
                ],
                popular: false,
                delay: 300,
              },
              {
                icon,
                title: "10.000 Curtidas",
                platform,
                price: "R$250,00",
                originalPrice: "R$329,90",
                features: [
                  "Curtidas reais e permanentes",
                  "Aumento na popularidade",
                  "Entrega gradual",
                  "Impulsiona algoritmo",
                ],
                popular: false,
                delay: 350,
              },
            ];
          default:
            return [];
        }
      case "tiktok":
        icon = <TikTokIcon className="w-6 h-6" />;
        platform = "TikTok";
        switch (type) {
          case "seguidores":
            return [
              {
                icon,
                title: "100 Seguidores",
                platform,
                price: "R$9,97",
                originalPrice: "R$15,00",
                features: [
                  "Seguidores de alta qualidade",
                  "Entrega gradual",
                  "Reposição garantida",
                  "Suporte 24/7",
                ],
                popular: false,
                delay: 100,
                serviceId: 396,
              },
              {
                icon,
                title: "400 Seguidores",
                platform,
                price: "R$39,88",
                originalPrice: "R$59,90",
                features: [
                  "Seguidores de alta qualidade",
                  "Entrega gradual",
                  "Reposição garantida",
                  "Suporte 24/7",
                ],
                popular: false,
                delay: 150,
                serviceId: 396,
              },
              {
                icon,
                title: "1.000 Seguidores",
                platform,
                price: "R$99,70",
                originalPrice: "R$149,90",
                features: [
                  "Seguidores de alta qualidade",
                  "Entrega gradual",
                  "Reposição garantida",
                  "Suporte 24/7",
                ],
                popular: true,
                delay: 200,
                serviceId: 396,
              },
              {
                icon,
                title: "2.000 Seguidores",
                platform,
                price: "R$199,40",
                originalPrice: "R$299,00",
                features: [
                  "Seguidores de alta qualidade",
                  "Entrega gradual",
                  "Reposição garantida",
                  "Suporte 24/7",
                ],
                popular: false,
                delay: 250,
                serviceId: 396,
              },
              {
                icon,
                title: "4.000 Seguidores",
                platform,
                price: "R$398,80",
                originalPrice: "R$597,00",
                features: [
                  "Seguidores de alta qualidade",
                  "Entrega gradual",
                  "Reposição garantida",
                  "Suporte 24/7",
                ],
                popular: false,
                delay: 300,
                serviceId: 396,
              },
              {
                icon,
                title: "10.000 Seguidores",
                platform,
                price: "R$997,00",
                originalPrice: "R$1.490,00",
                features: [
                  "Seguidores de alta qualidade",
                  "Entrega gradual",
                  "Reposição garantida",
                  "Suporte 24/7",
                ],
                popular: false,
                delay: 350,
                serviceId: 396,
              },
            ];
          case "curtidas":
            return [
              {
                icon,
                title: "100 Curtidas",
                platform,
                price: "R$10,00",
                originalPrice: "R$15,00",
                features: [
                  "Curtidas reais",
                  "Entrega rápida",
                  "Aumento no alcance",
                  "Melhora popularidade",
                ],
                popular: false,
                delay: 100,
                serviceId: 50,
              },
              {
                icon,
                title: "400 Curtidas",
                platform,
                price: "R$16,00",
                originalPrice: "R$24,90",
                features: [
                  "Curtidas reais",
                  "Entrega rápida",
                  "Aumento no alcance",
                  "Melhora popularidade",
                ],
                popular: false,
                delay: 150,
                serviceId: 50,
              },
              {
                icon,
                title: "1.000 Curtidas",
                platform,
                price: "R$18,00",
                originalPrice: "R$29,90",
                features: [
                  "Curtidas reais",
                  "Entrega rápida",
                  "Aumento no alcance",
                  "Melhora popularidade",
                ],
                popular: true,
                delay: 200,
                serviceId: 50,
              },
              {
                icon,
                title: "4.000 Curtidas",
                platform,
                price: "R$35,00",
                originalPrice: "R$59,90",
                features: [
                  "Curtidas reais",
                  "Entrega rápida",
                  "Aumento no alcance",
                  "Melhora popularidade",
                ],
                popular: false,
                delay: 250,
                serviceId: 50,
              },
              {
                icon,
                title: "10.000 Curtidas",
                platform,
                price: "R$91,00",
                originalPrice: "R$139,90",
                features: [
                  "Curtidas reais",
                  "Entrega rápida",
                  "Aumento no alcance",
                  "Melhora popularidade",
                ],
                popular: false,
                delay: 300,
                serviceId: 50,
              },
              {
                icon,
                title: "30.000 Curtidas",
                platform,
                price: "R$170,00",
                originalPrice: "R$259,90",
                features: [
                  "Curtidas reais",
                  "Entrega rápida",
                  "Aumento no alcance",
                  "Melhora popularidade",
                ],
                popular: false,
                delay: 350,
                serviceId: 50,
              },
            ];
          case "visualizacoes":
            return [
              {
                icon,
                title: "1.000 Visualizações",
                platform,
                price: "R$14,90",
                originalPrice: "R$19,90",
                features: viewFeatures,
                popular: false,
                delay: 100,
                serviceId: 334,
              },
              {
                icon,
                title: "5.000 Visualizações",
                platform,
                price: "R$49,90",
                originalPrice: "R$69,90",
                features: viewFeatures,
                popular: true,
                delay: 200,
                serviceId: 334,
              },
              {
                icon,
                title: "10.000 Visualizações",
                platform,
                price: "R$89,90",
                originalPrice: "R$119,90",
                features: viewFeatures,
                popular: false,
                delay: 300,
                serviceId: 334,
              },
            ];
          default:
            return [];
        }
      default:
        return [];
    }
  };
  const getFollowersLabel = (network) => {
    return network === "youtube" ? "Inscritos" : "Seguidores";
  };
  // Função para obter ícone baseado na plataforma
  const getIconForPlatform = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <InstagramIcon className="w-6 h-6 text-[#E1306C]" />;
      case 'youtube':
        return <YoutubeIcon className="w-6 h-6 text-[#FF0000]" />;
      case 'tiktok':
        return <TikTokIcon className="w-6 h-6 text-black" />;
      default:
        return <InstagramIcon className="w-6 h-6 text-[#E1306C]" />;
    }
  };

  // Converter serviços da API para o formato esperado pelo componente
  const currentPackages = services.map(service => ({
    icon: getIconForPlatform(service.platform),
    title: service.name,
    platform: service.platform,
    price: `R$${service.price.toFixed(2).replace('.', ',')}`,
    originalPrice: `R$${service.originalPrice.toFixed(2).replace('.', ',')}`,
    features: service.features,
    popular: service.isPopular,
    recommended: service.isRecommended,
    delay: 150 + (service.sortOrder * 50), // Delay baseado na ordem
    serviceId: service.serviceId,
    type: undefined // Sem tipo para ir direto para pagamento
  }));

  // Funções para verificar se existem serviços ativos para cada categoria
  const hasActiveServices = (platform: string, serviceType: string) => {
    return services.some(service => 
      service.platform === platform && 
      service.serviceType === serviceType && 
      service.isActive
    );
  };

  // Verificar quais categorias têm serviços ativos para a plataforma atual
  const getAvailableServiceTypes = (platform: string) => {
    // Sempre retorna todos os tipos para mostrar todas as abas
    if (platform === 'youtube') {
      return ['inscritos', 'curtidas', 'visualizacoes'];
    } else {
      return ['seguidores', 'curtidas', 'visualizacoes'];
    }
  };
  return (
    <main className="relative overflow-hidden">
      <NavBar />
      <section id="home">
        <HeroSection />
      </section>

      <section id="services" className="bg-gray-50 py-10 md:py-16">
        <div className="container mx-auto px-4">
          {/* Carrossel de conversas de clientes satisfeitos */}
          <ClientChatCarousel />
          <div className="max-w-3xl mx-auto text-center mb-8">
            <BadgeCustom variant="outline" className="mb-3">
              Nossos Serviços
            </BadgeCustom>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Aumente sua presença nas
              <br />
              redes sociais
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Escolha entre nossas soluções de alta qualidade para impulsionar
              seu perfil e aumentar seu engajamento nas principais plataformas.
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-10">
              <div className="bg-gradient-to-r from-primary to-accent p-6 sm:p-8 md:p-10 text-white">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 md:mb-3">
                  Pacotes de Crescimento para Redes Sociais
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-center opacity-90">
                  Aumente sua presença online com nossos pacotes premium de
                  engajamento
                </p>

                <div className="flex justify-center mt-4 sm:mt-6 px-2">
                  <div className="bg-white/20 rounded-2xl sm:rounded-full p-3 sm:p-2 backdrop-blur-sm w-full max-w-full md:max-w-fit">
                    <div className="flex flex-col xs:flex-row items-center justify-center flex-wrap gap-2 sm:gap-1">
                      <span className="inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white text-primary font-semibold text-xs sm:text-sm whitespace-nowrap w-full xs:w-auto">
                        <BadgeCheck className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                        <span className="text-center">
                          Mais de 10.000 clientes satisfeitos
                        </span>
                      </span>
                      <span className="inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-white font-medium text-xs sm:text-sm whitespace-nowrap w-full xs:w-auto">
                        <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                        <span className="text-center">Entrega Rápida</span>
                      </span>
                      <span className="inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-white font-medium text-xs sm:text-sm whitespace-nowrap w-full xs:w-auto">
                        <Headset className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                        <span className="text-center">Suporte 24/7</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-center mb-8 relative">
                  <div className="relative">
                    {isNetworkMenuOpen && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-white rounded-lg shadow-lg z-10 w-full sm:w-96">
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            className={`flex items-center justify-center gap-3 p-3 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors border border-pink-200 font-medium text-pink-800`}
                            onClick={() => {
                              setActiveTab("instagram");
                              setIsNetworkMenuOpen(false);
                            }}
                          >
                            <InstagramIcon className="w-6 h-6 text-[#E1306C]" />
                            Instagram
                          </button>
                          <button
                            className={`flex items-center justify-center gap-3 p-3 rounded-lg bg-black/5 hover:bg-black/10 transition-colors border border-black/20 font-medium`}
                            onClick={() => {
                              setActiveTab("tiktok");
                              setIsNetworkMenuOpen(false);
                            }}
                          >
                            <TikTokIcon className="w-6 h-6" />
                            TikTok
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  <button
                    className={`py-2.5 px-3 rounded-lg shadow-sm transition-all duration-300 ease-in-out ${
                      activeTab === "instagram"
                        ? "bg-gradient-to-br from-purple-100 to-pink-100 border border-pink-200 text-pink-800 shadow-md transform -translate-y-0.5"
                        : "bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200 hover:-translate-y-0.5"
                    } font-medium flex items-center justify-start gap-2.5 relative`}
                    onClick={() => setActiveTab("instagram")}
                  >
                    {activeTab === "instagram" && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full border-2 border-white"></span>
                    )}
                    <div
                      className={`rounded-full p-1.5 flex-shrink-0 ${
                        activeTab === "instagram"
                          ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      <InstagramIcon
                        className={`w-4 h-4 ${
                          activeTab === "instagram"
                            ? "text-white"
                            : "text-[#E1306C]"
                        }`}
                      />
                    </div>
                    <span className="text-sm font-medium">Instagram</span>
                  </button>

                  <button
                    className={`py-2.5 px-3 rounded-lg shadow-sm transition-all duration-300 ease-in-out ${
                      activeTab === "tiktok"
                        ? "bg-gray-100 border border-gray-300 text-gray-800 shadow-md transform -translate-y-0.5"
                        : "bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200 hover:-translate-y-0.5"
                    } font-medium flex items-center justify-start gap-2.5 relative`}
                    onClick={() => setActiveTab("tiktok")}
                  >
                    {activeTab === "tiktok" && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full border-2 border-white"></span>
                    )}
                    <div
                      className={`rounded-full p-1.5 flex-shrink-0 ${
                        activeTab === "tiktok"
                          ? "bg-black text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      <TikTokIcon
                        className={`w-4 h-4 ${
                          activeTab === "tiktok" ? "text-white" : ""
                        }`}
                      />
                    </div>
                    <span className="text-sm font-medium">TikTok</span>
                  </button>
                </div>

                <div className="mb-8">
                  <div className="flex flex-wrap gap-2 md:gap-4 mb-6">
                    {getAvailableServiceTypes(activeTab).map((serviceType) => {
                      const isActive = activeServiceType === serviceType;
                      const label = serviceType === 'inscritos' ? 'Inscritos' : 
                                   serviceType === 'seguidores' ? 'Seguidores' :
                                   serviceType === 'curtidas' ? 'Curtidas' :
                                   serviceType === 'visualizacoes' ? 'Visualizações' : serviceType;
                      return (
                        <button
                          key={serviceType}
                          className={`px-5 py-2 rounded-full ${
                            isActive
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          } font-medium transition-colors`}
                          onClick={() => setActiveServiceType(serviceType)}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative">
                    <div
                      className={`
                      ${
                        activeTab === "instagram" &&
                        activeServiceType === "seguidores"
                          ? "grid grid-cols-1 md:grid-cols-3 gap-6"
                          : "grid grid-cols-1 md:grid-cols-3 gap-6"
                      }
                    `}
                    >
                      {servicesLoading ? (
                        <div className="col-span-full flex justify-center items-center h-64">
                          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                        </div>
                      ) : servicesError ? (
                        <div className="col-span-full flex flex-col items-center justify-center h-64 text-center">
                          <div className="text-red-500 mb-4">
                            <X className="h-16 w-16 mx-auto" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Erro ao carregar serviços
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {servicesError}
                          </p>
                          <Button 
                            onClick={() => window.location.reload()}
                            variant="outline"
                          >
                            Tentar novamente
                          </Button>
                        </div>
                      ) : currentPackages.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center h-64 text-center">
                          <div className="text-gray-400 mb-4">
                            <Star className="h-16 w-16 mx-auto" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Nenhum serviço encontrado
                          </h3>
                          <p className="text-gray-600">
                            Não há serviços disponíveis para esta categoria no momento.
                          </p>
                        </div>
                      ) : (
                        currentPackages.map((pkg, index) => (
                          <div
                            key={`${activeTab}-${activeServiceType}-${index}`}
                            className={`
                              ${pkg.popular ? "z-40" : "z-30"}
                            `}
                          >
                            <ServiceCard
                              icon={pkg.icon}
                              title={pkg.title}
                              platform={pkg.platform}
                              price={pkg.price}
                              originalPrice={pkg.originalPrice}
                              features={pkg.features}
                              popular={pkg.popular}
                              recommended={pkg.recommended}
                              delay={pkg.delay}
                              serviceId={pkg.serviceId}
                              type={pkg.type}
                            />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 -mx-6 -mb-6 p-6 mt-8 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-full shadow-sm">
                        <Shield className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-bold">Garantia de Satisfação</h4>
                        <p className="text-sm text-gray-600">
                          Reembolso garantido se não estiver satisfeito
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-full shadow-sm">
                        <UserCheck className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold">Engajamento Real</h4>
                        <p className="text-sm text-gray-600">
                          Apenas contas autênticas e ativas
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-full shadow-sm">
                        <Headset className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-bold">Suporte Dedicado</h4>
                        <p className="text-sm text-gray-600">
                          Atendimento personalizado para cada cliente
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <a
        href="https://api.whatsapp.com/send?phone=5512982299289&text=Olá%20ImpulseGram%2C%20acabei%20de%20visitar%20o%20site%20e%20gostaria%20de%20tirar%20algumas%20dúvidas%20sobre%20os%20serviços."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-7 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300"
        aria-label="Fale conosco no WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20.52 3.48A11.929 11.929 0 0012 0C5.37 0 .01 5.37 0 12a11.9 11.9 0 001.84 6.31L0 24l5.84-1.83A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12a11.92 11.92 0 00-3.48-8.52zM12 22a9.77 9.77 0 01-5.19-1.5l-.37-.23-3.47 1.09 1.13-3.39-.25-.39A9.908 9.908 0 012 12c0-5.51 4.49-10 10-10s10 4.49 10 10-4.49 10-10 10zm5.28-7.7c-.29-.15-1.7-.84-1.96-.93-.26-.1-.45-.15-.64.15s-.74.93-.9 1.12-.33.22-.62.07a8.05 8.05 0 01-2.37-1.46 8.896 8.896 0 01-1.64-2.06c-.17-.29-.02-.45.13-.6.14-.14.29-.36.44-.53s.19-.3.29-.5.05-.37-.03-.52c-.08-.15-.64-1.55-.88-2.12-.23-.55-.47-.47-.64-.47s-.35 0-.53 0a1.03 1.03 0 00-.75.35 3.14 3.14 0 00-.98 2.34c0 1.38 1.01 2.72 1.15 2.9.15.2 1.98 3.02 4.8 4.23 2.24.96 2.7.77 3.19.72.48-.05 1.56-.63 1.78-1.24.22-.6.22-1.11.15-1.23-.07-.12-.27-.2-.56-.35z" />
        </svg>
      </a>

      <section id="benefits">
        <BenefitsSection />
      </section>

      <section id="how-it-works" className="bg-white py-10 md:py-16">
        <HowItWorks />
      </section>


      <section id="faq">
        <FAQSection />
      </section>

      <section id="contact">
        <ContactSection />
      </section>

      <Footer />
    </main>
  );
};
export default Index;

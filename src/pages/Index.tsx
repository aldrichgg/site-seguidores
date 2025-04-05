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
import FacebookIcon from "@/assets/icons/facebook";
import YoutubeIcon from "@/assets/icons/youtube";
import TikTokIcon from "@/assets/icons/tiktok";
import { ChevronDown, Check, X, Clock, Flame, Shield, UserCheck, Headset, BadgeCheck, Calendar, Award } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Index = () => {
  const [activeTab, setActiveTab] = useState("instagram");
  const [activeServiceType, setActiveServiceType] = useState("seguidores");
  const [isNetworkMenuOpen, setIsNetworkMenuOpen] = useState(false);
  
  // Este useEffect executará apenas quando o componente for montado, não quando activeTab ou activeServiceType mudarem
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // Dependência vazia significa que só executa uma vez, na montagem do componente
  
  // Este useEffect lida com a lógica de mudança de categoria baseada na rede social
  useEffect(() => {
    if (activeTab === "youtube" && activeServiceType === "seguidores") {
      setActiveServiceType("inscritos");
    } else if (activeTab !== "youtube" && activeServiceType === "inscritos") {
      setActiveServiceType("seguidores");
    }
  }, [activeTab, activeServiceType]);
  
  // Este useEffect configura os event listeners para scrolling suave
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href')?.substring(1);
        if (!targetId) return;
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      });
    });
    const animatedElements = document.querySelectorAll('.slide-up, .fade-in');
    animatedElements.forEach(element => {
      element.classList.add('animate-fade-in');
    });
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', () => {});
      });
    };
  }, [activeTab, activeServiceType]);
  const getSocialNetworkIcon = network => {
    switch (network) {
      case "instagram":
        return <InstagramIcon className="w-6 h-6 text-[#E1306C]" />;
      case "facebook":
        return <FacebookIcon className="w-6 h-6 text-[#1877F2]" />;
      case "youtube":
        return <YoutubeIcon className="w-6 h-6 text-[#FF0000]" />;
      case "tiktok":
        return <TikTokIcon className="w-6 h-6" />;
      default:
        return <InstagramIcon className="w-6 h-6 text-[#E1306C]" />;
    }
  };
  const getNetworkColor = network => {
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
    const followerFeatures = ["Contas reais e ativas", "Entrega gradual e natural", "Garantia de reposição", "Suporte prioritário"];
    const likeFeatures = ["Curtidas 100% reais", "Entrega imediata", "Aumento de engajamento", "Suporte 24/7"];
    const viewFeatures = ["Visualizações de alta qualidade", "Entrega rápida", "Aumento no alcance", "Melhora posicionamento"];
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
                title: "100 Seguidores",
                platform,
                price: "R$3,00",
                originalPrice: "R$5,00",
                features: followerFeatures,
                popular: false,
                delay: 100
              }, 
              {
                icon,
                title: "200 Seguidores",
                platform,
                price: "R$5,00",
                originalPrice: "R$8,00",
                features: followerFeatures,
                popular: false,
                delay: 150
              },
              {
                icon,
                title: "500 Seguidores",
                platform,
                price: "R$13,00",
                originalPrice: "R$18,00",
                features: followerFeatures,
                popular: false,
                delay: 200
              },
              {
                icon,
                title: "1.000 Seguidores",
                platform,
                price: "R$19,00",
                originalPrice: "R$29,90",
                features: followerFeatures,
                popular: true,
                delay: 250
              },
              {
                icon,
                title: "2.000 Seguidores",
                platform,
                price: "R$35,00",
                originalPrice: "R$49,90",
                features: followerFeatures,
                popular: false,
                delay: 300
              },
              {
                icon,
                title: "5.000 Seguidores",
                platform,
                price: "R$76,00",
                originalPrice: "R$99,90",
                features: followerFeatures,
                popular: false,
                delay: 350
              }
            ];
          case "curtidas":
            return [
              {
                icon,
                title: "200 Curtidas",
                platform,
                price: "R$2,00",
                originalPrice: "R$4,90",
                features: likeFeatures,
                popular: false,
                delay: 100
              }, 
              {
                icon,
                title: "400 Curtidas",
                platform,
                price: "R$3,50",
                originalPrice: "R$6,90",
                features: likeFeatures,
                popular: false,
                delay: 150
              }, 
              {
                icon,
                title: "600 Curtidas",
                platform,
                price: "R$5,50",
                originalPrice: "R$9,90",
                features: likeFeatures,
                popular: false,
                delay: 200
              }, 
              {
                icon,
                title: "1.000 Curtidas",
                platform,
                price: "R$10,00",
                originalPrice: "R$18,90",
                features: likeFeatures,
                popular: false,
                delay: 250
              }, 
              {
                icon,
                title: "2.000 Curtidas",
                platform,
                price: "R$18,00",
                originalPrice: "R$29,90",
                features: likeFeatures,
                popular: false,
                delay: 300
              }, 
              {
                icon,
                title: "6.000 Curtidas",
                platform,
                price: "R$35,00",
                originalPrice: "R$59,90",
                features: likeFeatures,
                popular: false,
                delay: 350
              }
            ];
          case "visualizacoes":
            return [
              {
                icon,
                title: "500 Visualizações",
                platform,
                price: "R$3,00",
                originalPrice: "R$5,90",
                features: ["Visualizações de qualidade", "Entrega rápida", "Impulsiona algoritmo", "Maior alcance"],
                popular: false,
                delay: 100
              },
              {
                icon,
                title: "1.000 Visualizações",
                platform,
                price: "R$6,00",
                originalPrice: "R$9,90",
                features: ["Visualizações de qualidade", "Entrega rápida", "Impulsiona algoritmo", "Maior alcance"],
                popular: false,
                delay: 150
              },
              {
                icon,
                title: "3.000 Visualizações",
                platform,
                price: "R$16,00",
                originalPrice: "R$24,90",
                features: ["Visualizações de qualidade", "Entrega rápida", "Impulsiona algoritmo", "Maior alcance"],
                popular: false,
                delay: 200
              },
              {
                icon,
                title: "5.000 Visualizações",
                platform,
                price: "R$25,00",
                originalPrice: "R$39,90",
                features: ["Visualizações de qualidade", "Entrega rápida", "Impulsiona algoritmo", "Maior alcance"],
                popular: false,
                delay: 250
              },
              {
                icon,
                title: "10.000 Visualizações",
                platform,
                price: "R$50,00",
                originalPrice: "R$79,90",
                features: ["Visualizações de qualidade", "Entrega rápida", "Impulsiona algoritmo", "Maior alcance"],
                popular: false,
                delay: 300
              },
              {
                icon,
                title: "30.000 Visualizações",
                platform,
                price: "R$130,00",
                originalPrice: "R$199,90",
                features: ["Visualizações de qualidade", "Entrega rápida", "Impulsiona algoritmo", "Maior alcance"],
                popular: false,
                delay: 350
              }
            ];
          case "assinatura":
            return [
              {
                icon,
                title: "Plano Básico",
                platform,
                price: "R$99,90/mês",
                originalPrice: "R$149,90",
                features: [
                  "500 seguidores por mês",
                  "1000 curtidas mensais",
                  "Crescimento orgânico",
                  "Suporte prioritário 24/7"
                ],
                popular: false,
                delay: 100
              },
              {
                icon,
                title: "Plano Premium",
                platform,
                price: "R$199,90/mês",
                originalPrice: "R$299,90",
                features: [
                  "2000 seguidores por mês",
                  "3000 curtidas mensais",
                  "Crescimento orgânico",
                  "Suporte VIP 24/7"
                ],
                popular: true,
                delay: 200
              },
              {
                icon,
                title: "Plano Profissional",
                platform,
                price: "R$399,90/mês",
                originalPrice: "R$599,90",
                features: [
                  "5000 seguidores por mês",
                  "10000 curtidas mensais",
                  "Crescimento orgânico",
                  "Gerente de conta dedicado"
                ],
                popular: false,
                delay: 300
              }
            ];
          default:
            return [];
        }
      case "facebook":
        icon = <FacebookIcon className="w-6 h-6 text-[#1877F2]" />;
        platform = "Facebook";
        switch (type) {
          case "seguidores":
            return [
              {
                icon,
                title: "100 Seguidores",
                platform,
                price: "R$5,00",
                originalPrice: "R$9,90",
                features: ["Seguidores reais", "Entrega gradual", "Garantia de reposição", "Perfis ativos"],
                popular: false,
                delay: 100
              },
              {
                icon,
                title: "500 Seguidores",
                platform,
                price: "R$19,00",
                originalPrice: "R$29,90",
                features: ["Seguidores reais", "Entrega gradual", "Garantia de reposição", "Perfis ativos"],
                popular: false,
                delay: 150
              },
              {
                icon,
                title: "1.000 Seguidores",
                platform,
                price: "R$26,00",
                originalPrice: "R$39,90",
                features: ["Seguidores reais", "Entrega gradual", "Garantia de reposição", "Perfis ativos"],
                popular: true,
                delay: 200
              },
              {
                icon,
                title: "2.000 Seguidores",
                platform,
                price: "R$40,00",
                originalPrice: "R$69,90",
                features: ["Seguidores reais", "Entrega gradual", "Garantia de reposição", "Perfis ativos"],
                popular: false,
                delay: 250
              },
              {
                icon,
                title: "3.000 Seguidores",
                platform,
                price: "R$55,00",
                originalPrice: "R$89,90",
                features: ["Seguidores reais", "Entrega gradual", "Garantia de reposição", "Perfis ativos"],
                popular: false,
                delay: 300
              },
              {
                icon,
                title: "5.000 Seguidores",
                platform,
                price: "R$85,00",
                originalPrice: "R$149,90",
                features: ["Seguidores reais", "Entrega gradual", "Garantia de reposição", "Perfis ativos"],
                popular: false,
                delay: 350
              }
            ];
          case "curtidas":
            return [
              {
                icon,
                title: "100 Curtidas",
                platform,
                price: "R$3,00",
                originalPrice: "R$6,90",
                features: ["Curtidas reais", "Entrega rápida", "Sem queda", "Aumento de alcance"],
                popular: false,
                delay: 100
              }, 
              {
                icon,
                title: "400 Curtidas",
                platform,
                price: "R$9,00",
                originalPrice: "R$14,90",
                features: ["Curtidas reais", "Entrega rápida", "Sem queda", "Aumento de alcance"],
                popular: false,
                delay: 150
              }, 
              {
                icon,
                title: "800 Curtidas",
                platform,
                price: "R$15,00",
                originalPrice: "R$22,90",
                features: ["Curtidas reais", "Entrega rápida", "Sem queda", "Aumento de alcance"],
                popular: false,
                delay: 200
              }, 
              {
                icon,
                title: "1.000 Curtidas",
                platform,
                price: "R$12,00",
                originalPrice: "R$24,90",
                features: ["Curtidas reais", "Entrega rápida", "Sem queda", "Aumento de alcance"],
                popular: true,
                delay: 250
              }, 
              {
                icon,
                title: "2.000 Curtidas",
                platform,
                price: "R$21,00",
                originalPrice: "R$39,90",
                features: ["Curtidas reais", "Entrega rápida", "Sem queda", "Aumento de alcance"],
                popular: false,
                delay: 300
              },
              {
                icon,
                title: "6.000 Curtidas",
                platform,
                price: "R$50,00",
                originalPrice: "R$89,90",
                features: ["Curtidas reais", "Entrega rápida", "Sem queda", "Aumento de alcance"],
                popular: false,
                delay: 350
              }
            ];
          case "visualizacoes":
            return [{
              icon,
              title: "1.000 Visualizações",
              platform,
              price: "R$12,90",
              originalPrice: "R$17,90",
              features: viewFeatures,
              popular: false,
              delay: 100
            }, {
              icon,
              title: "5.000 Visualizações",
              platform,
              price: "R$39,90",
              originalPrice: "R$49,90",
              features: viewFeatures,
              popular: true,
              delay: 200
            }, {
              icon,
              title: "10.000 Visualizações",
              platform,
              price: "R$69,90",
              originalPrice: "R$89,90",
              features: viewFeatures,
              popular: false,
              delay: 300
            }];
          case "assinatura":
            return [
              {
                icon,
                title: "Plano Básico",
                platform,
                price: "R$89,90/mês",
                originalPrice: "R$129,90",
                features: [
                  "400 seguidores por mês",
                  "800 curtidas mensais",
                  "Análise de métricas",
                  "Suporte prioritário"
                ],
                popular: false,
                delay: 100
              },
              {
                icon,
                title: "Plano Premium",
                platform,
                price: "R$179,90/mês",
                originalPrice: "R$259,90",
                features: [
                  "1500 seguidores por mês",
                  "2500 curtidas mensais",
                  "Análise de métricas",
                  "Suporte VIP"
                ],
                popular: true,
                delay: 200
              },
              {
                icon,
                title: "Plano Profissional",
                platform,
                price: "R$349,90/mês",
                originalPrice: "R$499,90",
                features: [
                  "4000 seguidores por mês",
                  "8000 curtidas mensais",
                  "Análise avançada",
                  "Gerente dedicado"
                ],
                popular: false,
                delay: 300
              }
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
                features: ["Inscritos reais e ativos", "Entrega gradual", "Permanência garantida", "Impulsiona algoritmo"],
                popular: false,
                delay: 100
              }, 
              {
                icon,
                title: "3.000 Inscritos",
                platform,
                price: "R$540,00",
                originalPrice: "R$700,00",
                features: ["Inscritos reais e ativos", "Entrega gradual", "Permanência garantida", "Impulsiona algoritmo"],
                popular: false,
                delay: 150
              }, 
              {
                icon,
                title: "5.000 Inscritos",
                platform,
                price: "R$900,00",
                originalPrice: "R$1.200,00",
                features: ["Inscritos reais e ativos", "Entrega gradual", "Permanência garantida", "Impulsiona algoritmo"],
                popular: true,
                delay: 200
              }, 
              {
                icon,
                title: "10.000 Inscritos",
                platform,
                price: "R$1.800,00",
                originalPrice: "R$2.300,00",
                features: ["Inscritos reais e ativos", "Entrega gradual", "Permanência garantida", "Impulsiona algoritmo"],
                popular: false,
                delay: 250
              }, 
              {
                icon,
                title: "30.000 Inscritos",
                platform,
                price: "R$5.400,00",
                originalPrice: "R$6.800,00",
                features: ["Inscritos reais e ativos", "Entrega gradual", "Permanência garantida", "Impulsiona algoritmo"],
                popular: false,
                delay: 300
              }, 
              {
                icon,
                title: "100.000 Inscritos",
                platform,
                price: "R$12.600,00",
                originalPrice: "R$16.000,00",
                features: ["Inscritos reais e ativos", "Entrega gradual", "Permanência garantida", "Impulsiona algoritmo"],
                popular: false,
                delay: 350
              }
            ];
          case "curtidas":
            return [
              {
                icon,
                title: "1.000 Curtidas",
                platform,
                price: "R$25,00",
                originalPrice: "R$39,90",
                features: ["Curtidas reais e permanentes", "Aumento na popularidade", "Entrega gradual", "Impulsiona algoritmo"],
                popular: false,
                delay: 100
              }, 
              {
                icon,
                title: "3.000 Curtidas",
                platform,
                price: "R$75,00",
                originalPrice: "R$99,90",
                features: ["Curtidas reais e permanentes", "Aumento na popularidade", "Entrega gradual", "Impulsiona algoritmo"],
                popular: false,
                delay: 150
              }, 
              {
                icon,
                title: "5.000 Curtidas",
                platform,
                price: "R$125,00",
                originalPrice: "R$169,90",
                features: ["Curtidas reais e permanentes", "Aumento na popularidade", "Entrega gradual", "Impulsiona algoritmo"],
                popular: true,
                delay: 200
              }, 
              {
                icon,
                title: "6.000 Curtidas",
                platform,
                price: "R$150,00",
                originalPrice: "R$199,90",
                features: ["Curtidas reais e permanentes", "Aumento na popularidade", "Entrega gradual", "Impulsiona algoritmo"],
                popular: false,
                delay: 250
              }, 
              {
                icon,
                title: "9.000 Curtidas",
                platform,
                price: "R$225,00",
                originalPrice: "R$289,90",
                features: ["Curtidas reais e permanentes", "Aumento na popularidade", "Entrega gradual", "Impulsiona algoritmo"],
                popular: false,
                delay: 300
              }, 
              {
                icon,
                title: "10.000 Curtidas",
                platform,
                price: "R$250,00",
                originalPrice: "R$329,90",
                features: ["Curtidas reais e permanentes", "Aumento na popularidade", "Entrega gradual", "Impulsiona algoritmo"],
                popular: false,
                delay: 350
              }
            ];
          case "visualizacoes":
            return [
              {
                icon,
                title: "5.000 Visualizações",
                platform,
                price: "R$180,00",
                originalPrice: "R$220,00",
                features: ["Visualizações de alta qualidade", "Retenção no vídeo", "Impulsiona algoritmo", "Entrega gradual"],
                popular: false,
                delay: 100
              }, 
              {
                icon,
                title: "10.000 Visualizações",
                platform,
                price: "R$253,10",
                originalPrice: "R$310,00",
                features: ["Visualizações de alta qualidade", "Retenção no vídeo", "Impulsiona algoritmo", "Entrega gradual"],
                popular: true,
                delay: 150
              }, 
              {
                icon,
                title: "20.000 Visualizações",
                platform,
                price: "R$363,50",
                originalPrice: "R$430,00",
                features: ["Visualizações de alta qualidade", "Retenção no vídeo", "Impulsiona algoritmo", "Entrega gradual"],
                popular: false,
                delay: 200
              }, 
              {
                icon,
                title: "30.000 Visualizações",
                platform,
                price: "R$473,80",
                originalPrice: "R$550,00",
                features: ["Visualizações de alta qualidade", "Retenção no vídeo", "Impulsiona algoritmo", "Entrega gradual"],
                popular: false,
                delay: 250
              }, 
              {
                icon,
                title: "50.000 Visualizações",
                platform,
                price: "R$694,60",
                originalPrice: "R$850,00",
                features: ["Visualizações de alta qualidade", "Retenção no vídeo", "Impulsiona algoritmo", "Entrega gradual"],
                popular: false,
                delay: 300
              }, 
              {
                icon,
                title: "100.000 Visualizações",
                platform,
                price: "R$1.318,30",
                originalPrice: "R$1.590,00",
                features: ["Visualizações de alta qualidade", "Retenção no vídeo", "Impulsiona algoritmo", "Entrega gradual"],
                popular: false,
                delay: 350
              }
            ];
          case "assinatura":
            return [
              {
                icon,
                title: "Plano Básico",
                platform,
                price: "R$299,90/mês",
                originalPrice: "R$399,90",
                features: [
                  "300 inscritos por mês",
                  "1000 visualizações mensais",
                  "Otimização SEO básica",
                  "Suporte prioritário"
                ],
                popular: false,
                delay: 100
              },
              {
                icon,
                title: "Plano Premium",
                platform,
                price: "R$599,90/mês",
                originalPrice: "R$799,90",
                features: [
                  "1000 inscritos por mês",
                  "5000 visualizações mensais",
                  "Otimização SEO avançada",
                  "Suporte VIP"
                ],
                popular: true,
                delay: 200
              },
              {
                icon,
                title: "Plano Profissional",
                platform,
                price: "R$1199,90/mês",
                originalPrice: "R$1599,90",
                features: [
                  "3000 inscritos por mês",
                  "15000 visualizações mensais",
                  "Consultoria personalizada",
                  "Gerente dedicado"
                ],
                popular: false,
                delay: 300
              }
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
                features: ["Seguidores de alta qualidade", "Entrega gradual", "Reposição garantida", "Suporte 24/7"],
                popular: false,
                delay: 100
              },
              {
                icon,
                title: "400 Seguidores",
                platform,
                price: "R$39,88",
                originalPrice: "R$59,90",
                features: ["Seguidores de alta qualidade", "Entrega gradual", "Reposição garantida", "Suporte 24/7"],
                popular: false,
                delay: 150
              },
              {
                icon,
                title: "1.000 Seguidores",
                platform,
                price: "R$99,70",
                originalPrice: "R$149,90",
                features: ["Seguidores de alta qualidade", "Entrega gradual", "Reposição garantida", "Suporte 24/7"],
                popular: true,
                delay: 200
              },
              {
                icon,
                title: "2.000 Seguidores",
                platform,
                price: "R$199,40",
                originalPrice: "R$299,00",
                features: ["Seguidores de alta qualidade", "Entrega gradual", "Reposição garantida", "Suporte 24/7"],
                popular: false,
                delay: 250
              },
              {
                icon,
                title: "4.000 Seguidores",
                platform,
                price: "R$398,80",
                originalPrice: "R$597,00",
                features: ["Seguidores de alta qualidade", "Entrega gradual", "Reposição garantida", "Suporte 24/7"],
                popular: false,
                delay: 300
              },
              {
                icon,
                title: "10.000 Seguidores",
                platform,
                price: "R$997,00",
                originalPrice: "R$1.490,00",
                features: ["Seguidores de alta qualidade", "Entrega gradual", "Reposição garantida", "Suporte 24/7"],
                popular: false,
                delay: 350
              }
            ];
          case "curtidas":
            return [
              {
                icon,
                title: "100 Curtidas",
                platform,
                price: "R$10,00",
                originalPrice: "R$15,00",
                features: ["Curtidas reais", "Entrega rápida", "Aumento no alcance", "Melhora popularidade"],
                popular: false,
                delay: 100
              },
              {
                icon,
                title: "400 Curtidas",
                platform,
                price: "R$16,00",
                originalPrice: "R$24,90",
                features: ["Curtidas reais", "Entrega rápida", "Aumento no alcance", "Melhora popularidade"],
                popular: false,
                delay: 150
              },
              {
                icon,
                title: "1.000 Curtidas",
                platform,
                price: "R$18,00",
                originalPrice: "R$29,90",
                features: ["Curtidas reais", "Entrega rápida", "Aumento no alcance", "Melhora popularidade"],
                popular: true,
                delay: 200
              },
              {
                icon,
                title: "4.000 Curtidas",
                platform,
                price: "R$35,00",
                originalPrice: "R$59,90",
                features: ["Curtidas reais", "Entrega rápida", "Aumento no alcance", "Melhora popularidade"],
                popular: false,
                delay: 250
              },
              {
                icon,
                title: "10.000 Curtidas",
                platform,
                price: "R$91,00",
                originalPrice: "R$139,90",
                features: ["Curtidas reais", "Entrega rápida", "Aumento no alcance", "Melhora popularidade"],
                popular: false,
                delay: 300
              },
              {
                icon,
                title: "30.000 Curtidas",
                platform,
                price: "R$170,00",
                originalPrice: "R$259,90",
                features: ["Curtidas reais", "Entrega rápida", "Aumento no alcance", "Melhora popularidade"],
                popular: false,
                delay: 350
              }
            ];
          case "visualizacoes":
            return [{
              icon,
              title: "1.000 Visualizações",
              platform,
              price: "R$14,90",
              originalPrice: "R$19,90",
              features: viewFeatures,
              popular: false,
              delay: 100
            }, {
              icon,
              title: "5.000 Visualizações",
              platform,
              price: "R$49,90",
              originalPrice: "R$69,90",
              features: viewFeatures,
              popular: true,
              delay: 200
            }, {
              icon,
              title: "10.000 Visualizações",
              platform,
              price: "R$89,90",
              originalPrice: "R$119,90",
              features: viewFeatures,
              popular: false,
              delay: 300
            }];
          case "assinatura":
            return [
              {
                icon,
                title: "Plano Básico",
                platform,
                price: "R$129,90/mês",
                originalPrice: "R$179,90",
                features: [
                  "600 seguidores por mês",
                  "2000 curtidas mensais",
                  "Análise de tendências",
                  "Suporte prioritário"
                ],
                popular: false,
                delay: 100
              },
              {
                icon,
                title: "Plano Premium",
                platform,
                price: "R$249,90/mês",
                originalPrice: "R$349,90",
                features: [
                  "2000 seguidores por mês",
                  "6000 curtidas mensais",
                  "Análise de tendências",
                  "Suporte VIP"
                ],
                popular: true,
                delay: 200
              },
              {
                icon,
                title: "Plano Profissional",
                platform,
                price: "R$499,90/mês",
                originalPrice: "R$699,90",
                features: [
                  "5000 seguidores por mês",
                  "15000 curtidas mensais",
                  "Consultoria de conteúdo",
                  "Gerente dedicado"
                ],
                popular: false,
                delay: 300
              }
            ];
          default:
            return [];
        }
      default:
        return [];
    }
  };
  const getFollowersLabel = network => {
    return network === "youtube" ? "Inscritos" : "Seguidores";
  };
  const currentPackages = getServicePackages(activeTab, activeServiceType);
  return <main className="relative overflow-hidden">
      <NavBar />
      <section id="home">
        <HeroSection />
      </section>
      
      <section id="services" className="bg-gray-50 py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <BadgeCustom variant="outline" className="mb-3">Nossos Serviços</BadgeCustom>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Aumente sua presença nas<br />redes sociais
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Escolha entre nossas soluções de alta qualidade para impulsionar seu perfil e aumentar seu engajamento nas principais plataformas.
            </p>
          </div>
          
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-10">
              <div className="bg-gradient-to-r from-primary to-accent p-6 sm:p-8 md:p-10 text-white">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 md:mb-3">Pacotes de Crescimento para Redes Sociais</h2>
                <p className="text-base sm:text-lg md:text-xl text-center opacity-90">Aumente sua presença online com nossos pacotes premium de engajamento</p>
                
                <div className="flex justify-center mt-4 sm:mt-6 px-2">
                  <div className="bg-white/20 rounded-2xl sm:rounded-full p-3 sm:p-2 backdrop-blur-sm w-full max-w-full md:max-w-fit">
                    <div className="flex flex-col xs:flex-row items-center justify-center flex-wrap gap-2 sm:gap-1">
                      <span className="inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white text-primary font-semibold text-xs sm:text-sm whitespace-nowrap w-full xs:w-auto">
                        <BadgeCheck className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                        <span className="text-center">Mais de 10.000 clientes satisfeitos</span>
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
                    
                    
                    {isNetworkMenuOpen && <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-white rounded-lg shadow-lg z-10 w-full sm:w-96">
                        <div className="grid grid-cols-2 gap-3">
                          <button className={`flex items-center justify-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200 font-medium text-blue-800`} onClick={() => {
                        setActiveTab("facebook");
                        setIsNetworkMenuOpen(false);
                      }}>
                            <FacebookIcon className="w-6 h-6 text-[#1877F2]" />
                            Facebook
                          </button>
                          <button className={`flex items-center justify-center gap-3 p-3 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors border border-pink-200 font-medium text-pink-800`} onClick={() => {
                        setActiveTab("instagram");
                        setIsNetworkMenuOpen(false);
                      }}>
                            <InstagramIcon className="w-6 h-6 text-[#E1306C]" />
                            Instagram
                          </button>
                          <button className={`flex items-center justify-center gap-3 p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors border border-red-200 font-medium text-red-800`} onClick={() => {
                        setActiveTab("youtube");
                        setIsNetworkMenuOpen(false);
                      }}>
                            <YoutubeIcon className="w-6 h-6 text-[#FF0000]" />
                            YouTube
                          </button>
                          <button className={`flex items-center justify-center gap-3 p-3 rounded-lg bg-black/5 hover:bg-black/10 transition-colors border border-black/20 font-medium`} onClick={() => {
                        setActiveTab("tiktok");
                        setIsNetworkMenuOpen(false);
                      }}>
                            <TikTokIcon className="w-6 h-6" />
                            TikTok
                          </button>
                        </div>
                      </div>}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  <button 
                    className={`py-2.5 px-3 rounded-lg shadow-sm transition-all duration-300 ease-in-out ${
                      activeTab === 'instagram' 
                        ? 'bg-gradient-to-br from-purple-100 to-pink-100 border border-pink-200 text-pink-800 shadow-md transform -translate-y-0.5' 
                        : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200 hover:-translate-y-0.5'
                    } font-medium flex items-center justify-start gap-2.5 relative`} 
                    onClick={() => setActiveTab("instagram")}
                  >
                    {activeTab === 'instagram' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full border-2 border-white"></span>}
                    <div className={`rounded-full p-1.5 flex-shrink-0 ${activeTab === 'instagram' ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' : 'bg-gray-100'}`}>
                      <InstagramIcon className={`w-4 h-4 ${activeTab === 'instagram' ? 'text-white' : 'text-[#E1306C]'}`} />
                    </div>
                    <span className="text-sm font-medium">Instagram</span>
                  </button>
                  
                  <button 
                    className={`py-2.5 px-3 rounded-lg shadow-sm transition-all duration-300 ease-in-out ${
                      activeTab === 'facebook' 
                        ? 'bg-blue-100 border border-blue-200 text-blue-800 shadow-md transform -translate-y-0.5' 
                        : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200 hover:-translate-y-0.5'
                    } font-medium flex items-center justify-start gap-2.5 relative`} 
                    onClick={() => setActiveTab("facebook")}
                  >
                    {activeTab === 'facebook' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></span>}
                    <div className={`rounded-full p-1.5 flex-shrink-0 ${activeTab === 'facebook' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                      <FacebookIcon className={`w-4 h-4 ${activeTab === 'facebook' ? 'text-white' : 'text-[#1877F2]'}`} />
                    </div>
                    <span className="text-sm font-medium">Facebook</span>
                  </button>
                  
                  <button 
                    className={`py-2.5 px-3 rounded-lg shadow-sm transition-all duration-300 ease-in-out ${
                      activeTab === 'youtube' 
                        ? 'bg-red-100 border border-red-200 text-red-800 shadow-md transform -translate-y-0.5' 
                        : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200 hover:-translate-y-0.5'
                    } font-medium flex items-center justify-start gap-2.5 relative`} 
                    onClick={() => setActiveTab("youtube")}
                  >
                    {activeTab === 'youtube' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white"></span>}
                    <div className={`rounded-full p-1.5 flex-shrink-0 ${activeTab === 'youtube' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>
                      <YoutubeIcon className={`w-4 h-4 ${activeTab === 'youtube' ? 'text-white' : 'text-[#FF0000]'}`} />
                    </div>
                    <span className="text-sm font-medium">YouTube</span>
                  </button>
                  
                  <button 
                    className={`py-2.5 px-3 rounded-lg shadow-sm transition-all duration-300 ease-in-out ${
                      activeTab === 'tiktok' 
                        ? 'bg-gray-100 border border-gray-300 text-gray-800 shadow-md transform -translate-y-0.5' 
                        : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200 hover:-translate-y-0.5'
                    } font-medium flex items-center justify-start gap-2.5 relative`} 
                    onClick={() => setActiveTab("tiktok")}
                  >
                    {activeTab === 'tiktok' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full border-2 border-white"></span>}
                    <div className={`rounded-full p-1.5 flex-shrink-0 ${activeTab === 'tiktok' ? 'bg-black text-white' : 'bg-gray-100'}`}>
                      <TikTokIcon className={`w-4 h-4 ${activeTab === 'tiktok' ? 'text-white' : ''}`} />
                    </div>
                    <span className="text-sm font-medium">TikTok</span>
                  </button>
                </div>
                
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2 md:gap-4 mb-6">
                    {activeTab === "youtube" ? <button className={`px-5 py-2 rounded-full ${activeServiceType === 'inscritos' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} font-medium transition-colors`} onClick={() => setActiveServiceType("inscritos")}>
                        Inscritos
                      </button> : <button className={`px-5 py-2 rounded-full ${activeServiceType === 'seguidores' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} font-medium transition-colors`} onClick={() => setActiveServiceType("seguidores")}>
                        Seguidores
                      </button>}
                    <button className={`px-5 py-2 rounded-full ${activeServiceType === 'curtidas' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} font-medium transition-colors`} onClick={() => setActiveServiceType("curtidas")}>
                      Curtidas
                    </button>
                    <button className={`px-5 py-2 rounded-full ${activeServiceType === 'visualizacoes' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} font-medium transition-colors`} onClick={() => setActiveServiceType("visualizacoes")}>
                      Visualizações
                    </button>
                    <button className={`px-5 py-2 rounded-full ${activeServiceType === 'assinatura' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} font-medium transition-colors`} onClick={() => setActiveServiceType("assinatura")}>
                      Assinatura
                    </button>
                  </div>
                  
                  <div className="relative">
                    <div className={`
                      ${activeTab === "instagram" && activeServiceType === "seguidores" 
                        ? "grid grid-cols-1 md:grid-cols-3 gap-6" 
                        : "grid grid-cols-1 md:grid-cols-3 gap-6"}
                    `}>
                      {currentPackages.map((pkg, index) => 
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
                            delay={pkg.delay} 
                          />
                        </div>
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
                        <p className="text-sm text-gray-600">Reembolso garantido se não estiver satisfeito</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-full shadow-sm">
                        <UserCheck className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold">Engajamento Real</h4>
                        <p className="text-sm text-gray-600">Apenas contas autênticas e ativas</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-full shadow-sm">
                        <Headset className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-bold">Suporte Dedicado</h4>
                        <p className="text-sm text-gray-600">Atendimento personalizado para cada cliente</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="benefits">
        <BenefitsSection />
      </section>
      
      <section id="how-it-works" className="bg-white py-10 md:py-16">
        <HowItWorks />
      </section>
      
      <section id="testimonials" className="bg-gray-50 py-10 md:py-16">
        <Testimonials />
      </section>
      
      <section id="faq">
        <FAQSection />
      </section>
      
      <section id="contact">
        <ContactSection />
      </section>
      
      <Footer />
    </main>;
};
export default Index;
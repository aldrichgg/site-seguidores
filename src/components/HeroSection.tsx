import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import InstagramIcon from "@/assets/icons/instagram";
import FacebookIcon from "@/assets/icons/facebook";
import YoutubeIcon from "@/assets/icons/youtube";
import TikTokIcon from "@/assets/icons/tiktok";
import { BsPatchCheckFill } from "react-icons/bs";
import { VisaIcon, MastercardIcon, PixIcon } from "@/assets/payment-icons";
import { BadgeCustom } from "./ui/badge-custom";
import {
  Check,
  X,
  Clock,
  Flame,
  Shield,
  UserCheck,
  Headset,
  TrendingUp,
  BarChart3,
  Award,
} from "lucide-react";
import perfilImg from "../assets/imgs/perfil.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = React.useState<
    "1000" | "5000" | "10000"
  >("5000");

  // Função para lidar com o clique no botão de checkout
  const handleCheckout = () => {
    // Definindo os detalhes do pacote selecionado para enviar à página de pagamento
    const packageDetails = {
      "1000": {
        title: "1000 Seguidores Instagram",
        description: "Seguidores reais e de alta qualidade",
        basePrice: 39.9,
        discountPrice: 29.9,
        deliveryTime: "Entrega em 3 dias",
        savePercentage: 25,
        features: [
          "Seguidores reais e de alta qualidade",
          "Entrega gradual para maior naturalidade",
          "Garantia de reposição por 30 dias",
          "Suporte 24/7 via WhatsApp",
        ],
      },
      "5000": {
        title: "5000 Seguidores Instagram",
        description: "Seguidores reais e de alta qualidade",
        basePrice: 119.9,
        discountPrice: 89.9,
        deliveryTime: "Entrega em 7 dias",
        savePercentage: 25,
        features: [
          "Seguidores reais e de alta qualidade",
          "Entrega gradual para maior naturalidade",
          "Garantia de reposição por 30 dias",
          "Suporte 24/7 via WhatsApp",
        ],
      },
      "10000": {
        title: "10000 Seguidores Instagram",
        description: "Seguidores reais e de alta qualidade",
        basePrice: 199.9,
        discountPrice: 159.9,
        deliveryTime: "Entrega em 14 dias",
        savePercentage: 20,
        features: [
          "Seguidores reais e de alta qualidade",
          "Entrega gradual para maior naturalidade",
          "Garantia de reposição por 30 dias",
          "Suporte 24/7 via WhatsApp",
        ],
      },
    };

    // Redirecionar para a página de pagamento com os detalhes do pacote selecionado
    navigate("/payment", {
      state: {
        orderDetails: packageDetails[selectedPackage],
      },
    });
  };

  return (
    <section className="relative overflow-hidden pt-32 md:pt-36 pb-16 md:pb-24">
      {/* Gradiente de fundo com efeito de grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pointer-events-none" />

      {/* Elementos decorativos de redes sociais */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grade de pontos */}
        <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(#888_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        {/* Círculos decorativos que representam ícones de notificação */}
        <div className="absolute top-32 right-[5%] w-12 h-12 rounded-full bg-gradient-to-r from-[#833AB4] to-[#C13584] opacity-25 animate-float-slow"></div>
        <div className="absolute top-52 left-[10%] w-8 h-8 rounded-full bg-[#1877F2] opacity-20 animate-float"></div>
        <div className="absolute bottom-24 right-[15%] w-6 h-6 rounded-full bg-[#FF0000] opacity-20 animate-float-slow"></div>

        {/* Ícones de like, comentário e compartilhamento */}
        <div className="absolute top-[20%] right-[15%] md:right-[25%] opacity-10">
          <div className="w-16 h-16 rounded-full border-2 border-pink-400 flex items-center justify-center text-pink-400 animate-pulse-slow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-[30%] left-[12%] opacity-10">
          <div className="w-14 h-14 rounded-full border-2 border-blue-400 flex items-center justify-center text-blue-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7"
            >
              <path
                fillRule="evenodd"
                d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo à esquerda - Texto e CTAs */}
          <div className="slide-up stagger-1">
            <BadgeCustom
              variant="pill"
              className="mb-5 animate-fade-in bg-gradient-to-r from-primary/10 to-accent/20 text-primary border-primary/20"
            >
              <span className="inline-flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Aumente sua presença nas redes sociais
              </span>
            </BadgeCustom>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Potencialize sua{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                presença digital
              </span>{" "}
              com engajamento real
            </h2>

            <p className="text-gray-600 text-lg mb-8 max-w-2xl">
              Alavanque suas redes sociais com seguidores autênticos e
              engajados. Construa credibilidade, amplie seu alcance e
              destaque-se na era digital.
            </p>

            {/* Contador de seguidores */}
            <div className="flex flex-wrap gap-6 mb-10 slide-up stagger-2">
              <div className="bg-white/60 backdrop-blur-sm shadow-sm border border-slate-100 rounded-xl p-4 px-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <p className="text-sm text-gray-500 mb-1 relative z-10">
                  Seguidores Entregues
                </p>
                <p className="text-2xl font-bold text-gray-800 relative z-10">
                  +3.5 Milhões
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm shadow-sm border border-slate-100 rounded-xl p-4 px-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <p className="text-sm text-gray-500 mb-1 relative z-10">
                  Clientes Satisfeitos
                </p>
                <p className="text-2xl font-bold text-gray-800 relative z-10">
                  +12 Mil
                </p>
              </div>
            </div>

            {/* Plataformas de mídia social */}
            <div className="flex flex-wrap gap-4 mb-10 slide-up stagger-3">
              <div className="flex items-center gap-3 transform hover:scale-105 transition-transform">
                <div className="w-12 h-12 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white shadow-md relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#833AB4]/10 via-[#E1306C]/10 to-[#F56040]/10"></div>
                  <InstagramIcon className="w-6 h-6 sm:w-6 sm:h-6 text-[#E1306C]" />
                </div>
                <span className="text-sm font-medium">Instagram</span>
              </div>

              <div className="flex items-center gap-3 transform hover:scale-105 transition-transform">
                <div className="w-12 h-12 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white shadow-md relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#1877F2]/10"></div>
                  <FacebookIcon className="w-6 h-6 sm:w-6 sm:h-6 text-[#1877F2]" />
                </div>
                <span className="text-sm font-medium">Facebook</span>
              </div>

              <div className="flex items-center gap-3 transform hover:scale-105 transition-transform">
                <div className="w-12 h-12 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white shadow-md relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#FF0000]/10"></div>
                  <YoutubeIcon className="w-6 h-6 sm:w-6 sm:h-6 text-[#FF0000]" />
                </div>
                <span className="text-sm font-medium">YouTube</span>
              </div>

              <div className="flex items-center gap-3 transform hover:scale-105 transition-transform">
                <div className="w-12 h-12 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white shadow-md relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/5"></div>
                  <TikTokIcon className="w-6 h-6 sm:w-6 sm:h-6 text-[#000000]" />
                </div>
                <span className="text-sm font-medium">TikTok</span>
              </div>
            </div>

            {/* Botões CTA */}
            <div className="flex flex-wrap gap-4 slide-up stagger-4">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-base relative overflow-hidden group"
                onClick={() =>
                  document
                    .getElementById("services")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                <span className="absolute inset-0 w-full h-full bg-white/0 group-hover:bg-white/20 transition-colors"></span>
                Começar agora
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 text-base border-2 border-primary text-primary hover:bg-primary/10 relative overflow-hidden group"
                onClick={() =>
                  document
                    .getElementById("services")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                <span className="absolute inset-0 w-0 bg-primary/10 group-hover:w-full transition-all duration-300"></span>
                <span className="relative z-10">Ver preços</span>
              </Button>
            </div>

            {/* Métodos de pagamento */}
            <div className="mt-10 flex flex-col space-y-2">
              <p className="text-xs text-gray-400">Pagamento seguro via:</p>
              <div className="flex space-x-3">
                <VisaIcon className="h-6 sm:h-6 w-auto opacity-70" />
                <MastercardIcon className="h-6 sm:h-6 w-auto opacity-70" />
                <PixIcon className="h-6 sm:h-6 w-auto opacity-70" />
              </div>
            </div>
          </div>

          {/* Conteúdo à direita - Ilustração ou Hero Image */}
          <div className="hidden lg:block relative slide-up stagger-5">
            <div className="w-full aspect-[4/3] relative z-10">
              {/* Smartphone simulando perfil de rede social */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Barra de status */}
                <div className="h-6 bg-gradient-to-r from-primary to-accent flex justify-between items-center px-4">
                  <div className="text-white text-xs">12:30</div>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-full bg-white/80"></div>
                    <div className="w-3 h-3 rounded-full bg-white/80"></div>
                    <div className="w-3 h-3 rounded-full bg-white/80"></div>
                  </div>
                </div>

                {/* Cabeçalho do perfil */}
                <div className="bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                      <div className="flex-shrink-0 bg-blue-500/10 text-blue-500 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                        <img
                          src={perfilImg}
                          alt="Verificado"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 font-bold">
                      <span>ImpulseGram</span>
                      <BsPatchCheckFill className="text-blue-500 w-4 h-4" />
                    </div>
                    
                  </div>
                </div>

                {/* Estatísticas */}
                <div className="grid grid-cols-3 text-center py-3 border-y border-gray-100">
                  <div>
                    <div className="font-bold">10.2K</div>
                    <div className="text-xs text-gray-500">Publicações</div>
                  </div>
                  <div className="relative">
                    <div className="font-bold">52.8K</div>
                    <div className="text-xs text-gray-500">Seguidores</div>
                    {/* Indicador de crescimento */}
                    <div className="absolute top-0 right-0 text-xs text-green-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-0.5" />
                      <span>+2.5K</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">512</div>
                    <div className="text-xs text-gray-500">Seguindo</div>
                  </div>
                </div>

                {/* Publicações */}
                <div className="grid grid-cols-3 gap-1 p-1">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm overflow-hidden"
                    >
                      {i % 3 === 0 && (
                        <div className="absolute top-1 right-1 bg-white/80 rounded-full p-0.5 text-pink-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-3 h-3"
                          >
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                          </svg>
                        </div>
                      )}
                      {i % 5 === 0 && (
                        <div className="absolute top-1 right-1 bg-white/80 rounded-full p-0.5 text-blue-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-3 h-3"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.337 21.718a6.707 6.707 0 01-.533-.074.75.75 0 01-.44-1.223 3.73 3.73 0 00.814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 01-4.246.997z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Navegação inferior */}
                <div className="flex justify-around py-3 border-t border-gray-100">
                  <BarChart3 className="w-5 h-5 text-gray-500" />
                  <Flame className="w-5 h-5 text-gray-500" />
                  <UserCheck className="w-5 h-5 text-gray-500" />
                </div>
              </div>

              {/* Elementos decorativos de fundo */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-primary/20 blur-xl"></div>
              <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-accent/20 blur-xl"></div>

              {/* Elementos de notificação */}
              

             
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

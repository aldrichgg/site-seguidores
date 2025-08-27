import React, { useState } from "react";
import { BadgeCustom } from "./ui/badge-custom";
import { Button } from "@/components/ui/button";
import {
  CheckIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  ClockIcon,
  ZapIcon,
  Check,
  Star,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import RatingForm from "./RatingForm";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  platform: string;
  price: string;
  originalPrice?: string;
  features: string[];
  popular?: boolean;
  delay?: number;
  recommended?: boolean;
  serviceId: number;
  type: number;
}

const ServiceCard = ({
  icon,
  title,
  platform,
  price,
  originalPrice,
  features,
  popular = false,
  recommended = false,
  delay = 0,
  serviceId,
  type,
}: ServiceCardProps) => {
  const navigate = useNavigate();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isSubscriptionClicked, setIsSubscriptionClicked] = useState(false);
  console.log(recommended)
  // Check if this is a subscription plan
  const isSubscription =
    title.toLowerCase().includes("plano") || price.includes("/mês");

  const handleSelectPlan = () => {
    if (isSubscription) {
      setIsSubscriptionClicked(true);
    }

    const priceValue = parseFloat(price.replace("R$", "").replace(",", ".").trim());
    const originalPriceValue = originalPrice
      ? parseFloat(originalPrice.replace("R$", "").replace(",", ".").trim())
      : null;

    const savePercentage = originalPriceValue
      ? Math.round(
          ((originalPriceValue - priceValue) / originalPriceValue) * 100
        )
      : 0;

    let deliveryTime = "Entrega em 1-2 dias";
    for (const feature of features) {
      if (feature.includes("entrega")) {
        deliveryTime = feature;
        break;
      }
    }

    const orderDetails = {
      title,
      description: `${title} para ${platform}`,
      basePrice: originalPriceValue || priceValue,
      discountPrice: priceValue,
      serviceId: serviceId,
      deliveryTime,
      savePercentage,
      features,
      platform,
    };

    if (platform === "YouTube" || platform === "Facebook") {
      const phoneNumber = "+5512981457975";
      const message = `Olá! Tenho interesse no plano *${title}* para *${platform}*. Pode me ajudar?`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(whatsappURL, "_blank");
      return;
    }
    if (type) {
      const phoneNumber = "+5512981457975";
      const message = `Olá! Tenho interesse na assinatura *${title}* para *${platform}*. Pode me ajudar?`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(whatsappURL, "_blank");
      return;
    }
    // Navegar para a página de pagamento com os detalhes do pedido
    navigate("/payment", { state: { orderDetails } });
  };

  // Determinar a cor de fundo e os estilos baseados na plataforma
  const getPlatformStyles = () => {
    const styles = {
      iconBg: "bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20",
      cardBg: isSubscription
        ? "bg-gradient-to-br from-primary/5 via-white to-accent/5"
        : "bg-white hover:bg-gray-50",
      borderAccent: "before:border-transparent",
      badge: "from-primary to-accent",
    };

    if (!isSubscription) {
      // Card recomendado: layout igual ao popular, mas borda/fundo verde
      if (recommended) {
        return {
          ...styles,
          iconBg: "bg-green-100",
          cardBg: "bg-gradient-to-br from-white to-green-50",
          borderAccent: "before:border-green-500/40",
          badge: "from-green-500 to-green-400",
        };
      }
      switch (platform.toLowerCase()) {
        case "instagram":
          return {
            ...styles,
            iconBg:
              "bg-gradient-to-br from-[#833AB4]/10 via-[#E1306C]/10 to-[#F56040]/10",
            cardBg: popular
              ? "bg-gradient-to-br from-white to-pink-50"
              : "bg-white hover:bg-gradient-to-br hover:from-white hover:to-pink-50",
            borderAccent: popular
              ? "before:border-[#E1306C]/40"
              : "before:border-transparent",
            badge: "from-[#833AB4] to-[#E1306C]",
          };
        case "facebook":
          return {
            ...styles,
            iconBg: "bg-[#1877F2]/10",
            cardBg: popular
              ? "bg-gradient-to-br from-white to-blue-50"
              : "bg-white hover:bg-gradient-to-br hover:from-white hover:to-blue-50",
            borderAccent: popular
              ? "before:border-[#1877F2]/40"
              : "before:border-transparent",
            badge: "from-[#1877F2] to-[#1877F2]",
          };
        case "youtube":
          return {
            ...styles,
            iconBg: "bg-[#FF0000]/10",
            cardBg: popular
              ? "bg-gradient-to-br from-white to-red-50"
              : "bg-white hover:bg-gradient-to-br hover:from-white hover:to-red-50",
            borderAccent: popular
              ? "before:border-[#FF0000]/40"
              : "before:border-transparent",
            badge: "from-[#FF0000] to-[#FF0000]",
          };
        case "tiktok":
          return {
            ...styles,
            iconBg: "bg-black/5",
            cardBg: popular
              ? "bg-gradient-to-br from-white to-gray-50"
              : "bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50",
            borderAccent: popular
              ? "before:border-black/30"
              : "before:border-transparent",
            badge: "from-black to-black",
          };
        default:
          return {
            ...styles,
            iconBg: "bg-primary/10",
            cardBg: popular
              ? "bg-gradient-to-br from-white to-violet-50"
              : "bg-white hover:bg-gradient-to-br hover:from-white hover:to-violet-50",
            borderAccent: popular
              ? "before:border-primary/40"
              : "before:border-transparent",
            badge: "from-primary to-accent",
          };
      }
    }

    return styles;
  };

  const styles = getPlatformStyles();

  return (
    <div
      className={`relative rounded-xl p-6 transition-all duration-300 slide-up shadow-sm border border-gray-100 
        ${styles.cardBg} 
        hover:shadow-xl 
        before:absolute before:inset-0 before:rounded-xl before:border-2 ${
          styles.borderAccent
        } before:transition-all before:duration-300 before:opacity-80
        ${
          isSubscription
            ? "z-40 shadow-lg"
            : popular
            ? "scale-[1.02] z-30"
            : "hover:scale-[1.01] z-20"
        }
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Indicador de Assinatura ou Popular */}
      {(isSubscription || popular || recommended) && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-50">
          <BadgeCustom
            variant="default"
            className={`shadow-lg px-3 py-0.5 bg-gradient-to-r ${
              styles.badge
            } text-white border-0 ${
              isSubscription && !isSubscriptionClicked
                ? "animate-pulse-slow"
                : ""
            }`}
          >
            {isSubscription && (
              <>
                <Star className="w-3 h-3 mr-1" />
                Assinatura
              </>
            )}
            {popular && (
              <>
                <ZapIcon className="w-3 h-3 mr-1" />
                Mais vendido
              </>
            )}
            {recommended && (
              <>
                <ZapIcon className="w-3 h-3 mr-1" />
                Recomendado
              </>
            )}
          </BadgeCustom>
        </div>
      )}

      {/* Cabeçalho do Card */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-full ${styles.iconBg} overflow-hidden`}
        >
          {React.cloneElement(icon as React.ReactElement, {
            className: "w-6 h-6 shrink-0",
          })}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">{platform}</p>
        </div>
      </div>

      {/* Preço com desconto */}
      <div className="mt-6 mb-4">
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            {price.includes("/mês") ? (
              <>
                {price.replace("/mês", "")}
                <span className="text-base font-medium">/mês</span>
              </>
            ) : (
              price
            )}
          </span>
          {originalPrice && (
            <span className="text-muted-foreground line-through text-sm mb-1">
              {originalPrice}
            </span>
          )}
        </div>
        {originalPrice && (
          <div className="mt-1">
            <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full inline-flex items-center">
              <TrendingUpIcon className="w-3 h-3 mr-1" />
              Economize{" "}
              {Math.round(
                ((parseFloat(
                  originalPrice.replace("R$", "").replace("/mês", "").trim()
                ) -
                  parseFloat(
                    price.replace("R$", "").replace("/mês", "").trim()
                  )) /
                  parseFloat(
                    originalPrice.replace("R$", "").replace("/mês", "").trim()
                  )) *
                  100
              )}
              %
            </span>
          </div>
        )}
      </div>

      {/* Lista de Recursos */}
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => {
          // Determinar o ícone com base no texto do recurso
          let icon = <CheckIcon className="w-4 h-4 text-green-500 shrink-0" />;

          if (feature.toLowerCase().includes("entrega")) {
            icon = <ClockIcon className="w-4 h-4 text-amber-500 shrink-0" />;
          } else if (
            feature.toLowerCase().includes("garantia") ||
            feature.toLowerCase().includes("reposição")
          ) {
            icon = (
              <ShieldCheckIcon className="w-4 h-4 text-blue-500 shrink-0" />
            );
          } else if (feature.toLowerCase().includes("suporte")) {
            icon = (
              <div className="w-4 h-4 text-indigo-500 shrink-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            );
          } else if (
            feature.toLowerCase().includes("real") ||
            feature.toLowerCase().includes("qualidade")
          ) {
            icon = (
              <div className="w-4 h-4 text-primary shrink-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            );
          } else if (
            feature.toLowerCase().includes("análise") ||
            feature.toLowerCase().includes("métricas")
          ) {
            icon = (
              <div className="w-4 h-4 text-purple-500 shrink-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0V12zm2.25-3a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V9.75A.75.75 0 0113.5 9zm3.75-1.5a.75.75 0 00-1.5 0v9a.75.75 0 001.5 0v-9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            );
          } else if (
            feature.toLowerCase().includes("consultoria") ||
            feature.toLowerCase().includes("gerente")
          ) {
            icon = (
              <div className="w-4 h-4 text-blue-500 shrink-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            );
          }

          return (
            <li key={index} className="flex items-start gap-2 group">
              <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
                {icon}
              </div>
              <span className="text-sm">{feature}</span>
            </li>
          );
        })}
      </ul>

      {/* Botão de Compra */}
      <div className="space-y-3">
        <Button
          variant={popular ? "default" : "default"}
          className={`w-full rounded-full group relative overflow-hidden transition-all duration-300 ${
            isSubscription
              ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border-0 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] animate-pulse-slow"
              : recommended
              ? "bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-400 border-0 text-white shadow-lg hover:shadow-xl"
              : popular
              ? "bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-400 border-0 text-white shadow-lg hover:shadow-xl"
              : "bg-white border border-gray-200 text-gray-700 shadow hover:bg-green-500 hover:text-white hover:border-green-500 hover:shadow-lg"
          }`}
          onClick={handleSelectPlan}
        >
          <span
            className={`absolute inset-0 w-full h-full transition-colors duration-300 ${
              isSubscription
                ? "bg-white/20 group-hover:bg-white/30"
                : recommended
                ? "bg-white/10 group-hover:bg-white/20"
                : "bg-white/0 group-hover:bg-white/10"
            }`}
          ></span>
          <span
            className={`relative flex items-center justify-center gap-2 ${
              isSubscription ? "font-semibold" : "font-medium"
            }`}
          >
            {isSubscription ? (
              <>
                <Star className="w-4 h-4" />
                Assinar Agora
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </>
            ) : (
              <>
                Comprar
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </>
            )}
          </span>
        </Button>

        <Button
          variant="outline"
          className="w-full transition-all duration-300 mt-2 text-muted-foreground hover:text-foreground"
          onClick={() => setShowRatingModal(true)}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Avaliar
        </Button>
      </div>

      {/* Elemento decorativo para cards populares, recomendados e assinaturas */}
      {(popular || recommended || isSubscription) && (
        <div
          className={`absolute -z-10 top-6 right-6 w-24 h-24 rounded-full blur-xl ${
            isSubscription
              ? "bg-gradient-to-br from-violet-400/30 via-indigo-400/30 to-violet-400/30 animate-pulse-slow"
              : recommended
              ? "bg-gradient-to-br from-green-400/30 via-green-300/30 to-green-400/30 animate-pulse-slow"
              : "bg-gradient-to-br from-primary/10 to-accent/5"
          }`}
        ></div>
      )}

      {/* Modal de Avaliação */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div
            className="relative max-w-md w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-10 right-0 text-white hover:text-gray-200"
              onClick={() => setShowRatingModal(false)}
            >
              ✕ Fechar
            </button>
            <RatingForm
              productId={`${platform}-${title}`}
              onSubmitSuccess={() => {
                setTimeout(() => setShowRatingModal(false), 2000);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;

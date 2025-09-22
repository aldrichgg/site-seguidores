import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  Shield,
  Star,
  Gift,
  Heart,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Crown,
  Rocket,
  Check,
  Users,
  MessageCircle,
  Share2,
} from "lucide-react";
import Layout from "@/components/Layout";
import InstagramIcon from "@/assets/icons/instagram";

interface ThankYouData {
  orderDetails?: {
    title: string;
    description?: string;
    price: number;
    status: string;
  };
  isUpsell?: boolean;
  upsellAccepted?: boolean;
  originalOrder?: {
    title: string;
    price: number;
    platform: string;
  };
}

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [thankYouData, setThankYouData] = useState<ThankYouData | null>(null);

  useEffect(() => {
    // Pegar dados do estado
    if (location.state) {
      setThankYouData(location.state);
    }
  }, [location.state]);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleTrackOrder = () => {
    navigate("/acompanhar-pedido", {
      state: {
        orderDetails: thankYouData?.orderDetails,
      },
    });
  };

  const handleWhatsApp = () => {
    const message = thankYouData?.isUpsell 
      ? "Olá! Acabei de realizar um pedido de upsell no ImpulseGram e gostaria de acompanhar o status."
      : "Olá! Acabei de realizar um pedido no ImpulseGram e gostaria de acompanhar o status.";
    
    const whatsappUrl = `https://api.whatsapp.com/send?phone=5512981457975&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!thankYouData) {
    return (
      <Layout showFooter={false} showNavBar={false}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  const isUpsell = thankYouData.isUpsell;
  const upsellAccepted = thankYouData.upsellAccepted;

  return (
    <Layout showFooter={false} showNavBar={false}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                <InstagramIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-800">ImpulseGram</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Card principal de agradecimento */}
            <Card className="mb-8 border-2 border-green-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-3xl md:text-4xl font-bold">
                  {isUpsell && upsellAccepted 
                    ? "Combo Aprovado com Sucesso!" 
                    : isUpsell && !upsellAccepted
                    ? "Obrigado pela Preferência!"
                    : "Pedido Confirmado!"
                  }
                </CardTitle>
                <p className="text-green-100 mt-2 text-lg">
                  {isUpsell && upsellAccepted 
                    ? "Seu combo de 2000 seguidores + 1000 curtidas foi processado!"
                    : isUpsell && !upsellAccepted
                    ? "Seu pedido original está sendo processado normalmente."
                    : "Seu pedido está sendo processado com sucesso!"
                  }
                </p>
              </CardHeader>
              
              <CardContent className="p-8">
                {/* Status do pedido */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold mb-4">
                    <CheckCircle className="w-5 h-5" />
                    {isUpsell && upsellAccepted 
                      ? "Combo Processado"
                      : "Pedido Confirmado"
                    }
                  </div>
                  
                  {thankYouData.orderDetails && (
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        {isUpsell && upsellAccepted ? "Detalhes do Combo:" : "Detalhes do Pedido:"}
                      </h3>
                      <div className="space-y-2 text-left">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Produto:</span>
                          <span className="font-medium">{thankYouData.orderDetails.title}</span>
                        </div>
                        {thankYouData.orderDetails.description && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Descrição:</span>
                            <span className="font-medium">{thankYouData.orderDetails.description}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Valor:</span>
                          <span className="font-bold text-green-600">
                            R$ {thankYouData.orderDetails.price.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-medium text-blue-600">Processando</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Próximos passos */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Rocket className="w-6 h-6 text-blue-600" />
                    Próximos Passos:
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-blue-800">Entrega Rápida</h4>
                        <p className="text-sm text-blue-600">
                          {isUpsell && upsellAccepted 
                            ? "Seu combo será entregue em até 48 horas"
                            : "Seu pedido será processado em até 24 horas"
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                      <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-800">Garantia Total</h4>
                        <p className="text-sm text-green-600">
                          Garantia de reposição por 30 dias
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Benefícios */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-500" />
                    O que você recebe:
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">
                          {isUpsell && upsellAccepted 
                            ? "2000 seguidores reais e ativos"
                            : "Seguidores de alta qualidade"
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">
                          {isUpsell && upsellAccepted 
                            ? "1000 curtidas de alta qualidade"
                            : "Entrega gradual e natural"
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Suporte prioritário 24/7</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">
                          {isUpsell && upsellAccepted 
                            ? "Aumento imediato no engajamento"
                            : "Garantia de reposição"
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">
                          {isUpsell && upsellAccepted 
                            ? "Processamento em até 48 horas"
                            : "Processamento em até 24 horas"
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Acompanhamento em tempo real</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Button
                    onClick={handleTrackOrder}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Acompanhar Pedido
                    </div>
                  </Button>

                  <Button
                    onClick={handleWhatsApp}
                    variant="outline"
                    className="flex-1 py-3 text-lg font-semibold rounded-xl border-2 border-green-500 text-green-600 hover:bg-green-50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Falar no WhatsApp
                    </div>
                  </Button>
                </div>

                {/* Botão para página inicial */}
                <div className="text-center">
                  <Button
                    onClick={handleGoHome}
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Ir para página inicial
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card de depoimentos */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold text-gray-800">
                  O que nossos clientes dizem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4">
                    <div className="flex justify-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-2">
                      "Excelente serviço! Meus seguidores chegaram rapidinho e são todos reais."
                    </p>
                    <p className="text-sm font-semibold text-gray-800">- Maria Silva</p>
                  </div>
                  
                  <div className="text-center p-4">
                    <div className="flex justify-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-2">
                      "Suporte incrível! Resolveram todas as minhas dúvidas rapidamente."
                    </p>
                    <p className="text-sm font-semibold text-gray-800">- João Santos</p>
                  </div>
                  
                  <div className="text-center p-4">
                    <div className="flex justify-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-2">
                      "Recomendo demais! Meu perfil cresceu muito depois do combo."
                    </p>
                    <p className="text-sm font-semibold text-gray-800">- Ana Costa</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card de compartilhamento */}
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Gostou do nosso serviço?
                </h3>
                <p className="text-gray-600 mb-6">
                  Compartilhe com seus amigos e ajude-os a crescer também!
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => {
                      const text = "Acabei de usar o ImpulseGram e recomendo! Serviço incrível para crescer nas redes sociais!";
                      const url = window.location.origin;
                      const shareText = `${text} ${url}`;
                      navigator.clipboard.writeText(shareText);
                      alert("Link copiado para a área de transferência!");
                    }}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Compartilhar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ThankYou;

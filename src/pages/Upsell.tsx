import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  Clock,
  Shield,
  Star,
  Gift,
  Zap,
  Heart,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Crown,
  Rocket,
  QrCodeIcon,
} from "lucide-react";
import Layout from "@/components/Layout";
import InstagramIcon from "@/assets/icons/instagram";
import { getApiBase } from "@/lib/api_base";
import { useUTMContext } from "@/contexts/utmContext";
import { useServices } from "@/hooks/useServices";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from 'firebase/firestore';

interface UpsellData {
  originalOrder: {
    title: string;
    price: number;
    platform: string;
  };
  customerData: {
    name: string;
    email: string;
    linkPerfil: string;
  };
}

const Upsell = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos
  const [upsellData, setUpsellData] = useState<UpsellData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentId, setPaymentId] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [qrCode, setQrCode] = useState<string>("");
  const [pixCode, setPixCode] = useState<string>("");
  const URL = getApiBase();
  const { utm } = useUTMContext();

  // Buscar serviços para encontrar os service IDs corretos
  const { services: followersServices } = useServices(upsellData?.originalOrder.platform.toLowerCase(), 'seguidores');
  const { services: likesServices } = useServices(upsellData?.originalOrder.platform.toLowerCase(), 'curtidas');

  // Dados do combo de upsell
  const upsellOffer = {
    title: "Combo Impulso Total",
    description: "2000 Seguidores + 1000 Curtidas",
    originalPrice: 89.90,
    discountPrice: 59.90,
    savePercentage: 33,
    features: [
      "2000 seguidores reais e ativos",
      "1000 curtidas de alta qualidade",
      "Entrega em até 48 horas",
      "Garantia de reposição por 30 dias",
      "Suporte prioritário 24/7",
      "Aumento imediato no engajamento",
    ],
    benefits: [
      "Algoritmo do Instagram favorece perfis com mais engajamento",
      "Maior visibilidade nas hashtags",
      "Aumento natural de seguidores orgânicos",
      "Perfil mais atrativo para marcas",
    ],
  };

  useEffect(() => {
    // Pegar dados do pedido original
    if (location.state?.upsellData) {
      setUpsellData(location.state.upsellData);
    } else {
      // Fallback se não houver dados
      setUpsellData({
        originalOrder: {
          title: "5000 Seguidores Instagram",
          price: 89.90,
          platform: "Instagram",
        },
        customerData: {
          name: "Cliente",
          email: "cliente@email.com",
          linkPerfil: "https://instagram.com/perfil",
        },
      });
    }

    // Timer de 10 minutos
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [location.state]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Função para encontrar service ID baseado na quantidade e tipo
  const findServiceId = (services: any[], quantity: number, serviceType: string) => {
    // Primeiro, tentar encontrar exatamente a quantidade
    let service = services.find(s => s.quantity === quantity);
    
    if (service) {
      return service.serviceId;
    }
    
    // Se não encontrar exato, buscar o mais próximo
    service = services.find(s => s.quantity >= quantity);
    
    if (service) {
      return service.serviceId;
    }
    
    // Se ainda não encontrar, usar o primeiro disponível
    if (services.length > 0) {
      return services[0].serviceId;
    }
    
    return null;
  };

  // Função para verificar o status do pagamento no Firebase
  const checkPaymentStatus = (paymentId: string) => {
    setPaymentId(paymentId);
    
    // Referência ao documento no Firebase
    const paymentRef = doc(db, 'orders', paymentId);
    
    // Escutar mudanças no documento
    const unsubscribe = onSnapshot(paymentRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const status = data.status;
        
        setPaymentStatus(status);
        
        // Se o pagamento foi aprovado, redirecionar para página de obrigado
        if (status === 'approved') {
          unsubscribe(); // Parar de escutar mudanças
          
          // Redirecionar para página de obrigado
          navigate("/obrigado", {
            state: {
              orderDetails: {
                title: upsellOffer.title,
                description: upsellOffer.description,
                price: upsellOffer.discountPrice,
                status: "processing",
              },
              isUpsell: true,
              upsellAccepted: true,
            },
          });
        }
      }
    }, (error) => {
      console.error("Erro ao verificar status do pagamento:", error);
    });
    
    // Cleanup: parar de escutar quando o componente for desmontado
    return unsubscribe;
  };

  const handleAcceptUpsell = async () => {
    if (!upsellData) return;

    setIsProcessing(true);

    try {
      // Buscar service IDs dinamicamente da API
      const platform = upsellData.originalOrder.platform.toLowerCase();
      
      // Encontrar service IDs para 2000 seguidores e 1000 curtidas
      const followersServiceId = findServiceId(followersServices, 2000, 'seguidores');
      const likesServiceId = findServiceId(likesServices, 1000, 'curtidas');
      
      if (!followersServiceId || !likesServiceId) {
        alert("Erro ao processar pagamento. Service IDs não encontrados.");
        return;
      }

      const valueCents = Math.round(upsellOffer.discountPrice * 100);

      const body = {
        paymentMethod: "pix",
        value: valueCents,
        description: `Combo Upsell - ${upsellOffer.description} ${platform}`,
        paymentPlatform: "openpix",
        postbackUrl: "https://new-back-end-phi.vercel.app/payments/webhook",
        customer: {
          name: upsellData.customerData.name,
          email: upsellData.customerData.email,
          phone: upsellData.customerData.linkPerfil.includes('instagram') ? '11999999999' : '11999999999', // Fallback
        },
        items: [
          {
            name: "Seguidores " + platform,
            quantity: 2000,
            unitAmount: Math.round(valueCents / 2), // Divide o valor entre os dois itens
            service_id: followersServiceId
          },
          {
            name: "Curtidas " + platform,
            quantity: 1000,
            unitAmount: Math.round(valueCents / 2), // Divide o valor entre os dois itens
            service_id: likesServiceId
          }
        ],
        metadata: {
          link: upsellData.customerData.linkPerfil,
          email: upsellData.customerData.email,
          celular: '11999999999', // Fallback
          platform: platform,
          ...utm,
        }
      };

      const response = await fetch(`${URL}/payments/upsell`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      
      if (response.ok) {
        setQrCode(result.qrcode_image);
        setPixCode(result.pixCode);
        
        // Iniciar verificação do status do pagamento
        if (result.id) {
          checkPaymentStatus(result.id);
        }
      } else {
        alert("Erro ao processar pagamento do upsell. Tente novamente.");
      }
    } catch (error) {
      alert("Erro ao processar pagamento do upsell. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeclineUpsell = () => {
    // Redirecionar para página de obrigado
    navigate("/obrigado", {
      state: {
        orderDetails: upsellData?.originalOrder,
        status: "processing",
        isUpsell: true,
        upsellAccepted: false,
      },
    });
  };

  if (!upsellData) {
    return (
      <Layout showFooter={false} showNavBar={false}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showFooter={false} showNavBar={false}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        {/* Header com timer */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <InstagramIcon className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-800">ImpulseGram</span>
              </div>
              
              <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4" />
                <span className="font-medium text-sm">
                  Oferta expira em: {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Mensagem de sucesso */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Parabéns, {upsellData.customerData.name}! 🎉
              </h1>
              <p className="text-lg text-gray-600">
                Seu pedido de <strong>{upsellData.originalOrder.title}</strong> foi confirmado!
              </p>
            </div>

            {/* Oferta especial */}
            <Card className="mb-8 border-2 border-gradient-to-r from-purple-200 to-pink-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-6 h-6" />
                  <Badge className="bg-yellow-400 text-yellow-900 font-bold">
                    OFERTA ESPECIAL
                  </Badge>
                  <Sparkles className="w-6 h-6" />
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  Aproveite esta oferta exclusiva!
                </CardTitle>
                <p className="text-purple-100 mt-2">
                  Apenas para clientes que acabaram de fazer um pedido
                </p>
              </CardHeader>
              
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <InstagramIcon className="w-8 h-8 text-[#E1306C]" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      {upsellOffer.title}
                    </h2>
                  </div>
                  
                  <p className="text-xl text-gray-600 mb-6">
                    {upsellOffer.description}
                  </p>

                  {/* Preços */}
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">Preço normal</p>
                      <p className="text-2xl text-gray-400 line-through">
                        R$ {upsellOffer.originalPrice.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                    
                    <div className="text-center">
                      <p className="text-sm text-green-600 mb-1 font-medium">
                        Seu preço especial
                      </p>
                      <p className="text-4xl font-bold text-green-600">
                        R$ {upsellOffer.discountPrice.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                    <Gift className="w-5 h-5" />
                    Você economiza R$ {(upsellOffer.originalPrice - upsellOffer.discountPrice).toFixed(2).replace('.', ',')} ({upsellOffer.savePercentage}% OFF)
                  </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      O que você recebe:
                    </h3>
                    <ul className="space-y-3">
                      {upsellOffer.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      Por que isso é importante:
                    </h3>
                    <ul className="space-y-3">
                      {upsellOffer.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Zap className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Garantias */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    Nossas Garantias
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Shield className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="font-medium text-gray-900">Garantia de 30 dias</p>
                      <p className="text-sm text-gray-600">Reembolso total</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="font-medium text-gray-900">Entrega rápida</p>
                      <p className="text-sm text-gray-600">Até 48 horas</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Heart className="w-6 h-6 text-purple-600" />
                      </div>
                      <p className="font-medium text-gray-900">Suporte 24/7</p>
                      <p className="text-sm text-gray-600">Sempre disponível</p>
                    </div>
                  </div>
                </div>

                {/* Seção PIX (aparece quando QR Code é gerado) */}
                {qrCode && (
                  <div className="mb-8 space-y-4">
                    {/* Indicador de status do pagamento */}
                    {paymentId && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-blue-800 font-medium">
                            Aguardando confirmação do pagamento...
                          </span>
                        </div>
                        {paymentStatus && (
                          <p className="text-sm text-blue-600 mt-1 text-center">
                            Status: {paymentStatus}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <QrCodeIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-green-800">
                            QR Code PIX Gerado
                          </h3>
                          <p className="text-sm text-green-600">
                            Escaneie com seu aplicativo bancário
                          </p>
                        </div>
                      </div>

                      {/* QR Code */}
                      <div className="text-center mb-4">
                        <img
                          src={qrCode}
                          alt="QR Code PIX"
                          className="mx-auto border border-gray-200 rounded-lg shadow-sm"
                          style={{ maxWidth: "200px", height: "auto" }}
                        />
                      </div>

                      {/* Código PIX */}
                      <div className="bg-white border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-2 font-medium">
                          Ou copie o código PIX:
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={pixCode}
                            readOnly
                            className="flex-1 p-2 border border-gray-300 rounded text-sm font-mono bg-gray-50"
                          />
                          <Button
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(pixCode);
                              alert("Código PIX copiado!");
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Copiar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Botões de ação */}
                {!qrCode && (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleAcceptUpsell}
                      disabled={isProcessing || timeLeft === 0}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processando...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Crown className="w-5 h-5" />
                          Sim, quero esta oferta!
                        </div>
                      )}
                    </Button>

                    <Button
                      onClick={handleDeclineUpsell}
                      variant="outline"
                      className="flex-1 py-4 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-2">
                        <X className="w-5 h-5" />
                        Não, obrigado
                      </div>
                    </Button>
                  </div>
                )}

                {/* Aviso de urgência */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    ⚠️ Esta oferta é válida apenas por tempo limitado e não se repetirá
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Depoimentos */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                O que nossos clientes dizem sobre nossos combos:
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-2">
                    "Comprei o combo e em 2 dias meu perfil explodiu! Muito mais engajamento e seguidores orgânicos."
                  </p>
                  <p className="text-sm text-gray-500">- Maria S., Influencer</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-2">
                    "Vale muito a pena! O algoritmo do Instagram começou a me favorecer depois do combo."
                  </p>
                  <p className="text-sm text-gray-500">- João P., Empreendedor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Upsell;

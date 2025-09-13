import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckIcon,
  CreditCardIcon,
  QrCodeIcon,
  ShieldIcon,
  LockIcon,
  ArrowLeftIcon,
  HomeIcon,
  ArrowRightIcon,
  Clock,
  BadgeCheck,
  CreditCard,
  Star,
  Gift,
  User,
  DollarSign,
  ShieldAlert,
  AlertCircle,
  ShoppingBag,
  CalendarDays,
  Heart,
  Music,
  Rocket,
  Zap,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { VisaIcon, MastercardIcon, PixIcon } from "@/assets/payment-icons";
import Layout from "@/components/Layout";
import ProfilePrivacyModal from "@/components/ProfilePrivacyModal";
import { get } from "http";
import { getApiBase } from "@/lib/api_base";
import { useUTM } from "@/hooks/use-utm";
import { useUTMContext } from "@/contexts/utmContext";

// Interface para definir a estrutura dos detalhes do pedido
interface OrderDetailsType {
  title: string;
  description: string;
  basePrice: number;
  discountPrice: number;
  deliveryTime: string;
  savePercentage: number;
  features?: string[];
  isSubscription?: boolean;
  billingCycle?: string;
  serviceId: number;
  platform: string;
  paymentPlatform: string
}

// Interface para os dados do cliente
interface CustomerData {
  email: string;
  name: string;
  document: string;
  linkPerfil: string;
  phone: string;
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const Payment = () => {
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState<string>("pix");
  const [promocode, setPromocode] = useState<string>("");
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [paymentRequest, setPaymentRequest] = useState<boolean>(false);
  const [qrCode, setQrCode] = useState<string>("");
  const [pixCode, setPixCode] = useState<string>("");
  const [showPixSection, setShowPixSection] = useState<boolean>(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    email: "",
    name: "",
    document: "",
    linkPerfil: "",
    phone: "",
  });
  const [orderDetails, setOrderDetails] = useState<OrderDetailsType>({
    title: "5000 Seguidores Instagram",
    description: "Seguidores reais e de alta qualidade",
    basePrice: 89.9,
    discountPrice: 79.9,
    deliveryTime: "Entrega em 2-3 dias",
    savePercentage: 11,
    serviceId: 0,
    platform: "Instagram",
    paymentPlatform: 'Site impulsegram',
  });
  const [addExtraOffer, setAddExtraOffer] = useState<boolean>(false);
  const [orderBumps, setOrderBumps] = useState({
    turboDelivery: false,
    boostEngagement: false,
    antiDrop: false,
  });
  const [timer, setTimer] = useState<number>(900);
  const [qrCodeTimer, setQrCodeTimer] = useState<number>(300); // 5 minutos = 300 segundos
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [linkValidationStatus, setLinkValidationStatus] = useState<{
    isValid: boolean;
    message: string;
    type: 'instagram' | 'invalid';
  } | null>(null);
  const URL = getApiBase();
  const { utm } = useUTMContext();
  /* console.log(utm); */
  // Carregar detalhes do pedido da navegação se disponíveis
  useEffect(() => {
    if (location.state && location.state.orderDetails) {
      setOrderDetails(location.state.orderDetails);
    }
    window.scrollTo(0, 0);
  }, [location]);

  // Inicializar o total com o valor do pedido
  useEffect(() => {
    setTotalAmount(orderDetails.discountPrice);
  }, [orderDetails.discountPrice]);

  // Atualizar o total quando o checkbox de oferta adicional for alterado
  useEffect(() => {
    let total = orderDetails.discountPrice;

    if (addExtraOffer) {
      total += 9.9;
    }

    // Adicionar order bumps
    if (orderBumps.turboDelivery) total += 9.9;
    if (orderBumps.boostEngagement) total += 14.9;
    if (orderBumps.antiDrop) total += 9.9;

    setTotalAmount(total);
  }, [addExtraOffer, orderDetails.discountPrice, orderBumps]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  // Timer para o QR Code (5 minutos)
  useEffect(() => {
    if (qrCode && qrCodeTimer > 0) {
      const qrCodeInterval = setInterval(() => {
        setQrCodeTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(qrCodeInterval);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(qrCodeInterval);
    }
  }, [qrCode, qrCodeTimer]);

  const handleApplyPromocode = () => {
    if (!promocode) return;
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
    }, 1000);
  };

  // Função para validar link do Instagram
  const validateInstagramLink = (link: string): { isValid: boolean; message: string; type: 'instagram' | 'invalid' } => {
    if (!link.trim()) {
      return { isValid: false, message: 'Link é obrigatório', type: 'invalid' };
    }

    // Remove espaços e converte para minúsculo
    const cleanLink = link.trim().toLowerCase();
    
    // Verifica se é um link do Instagram (instagram.com ou ig.me)
    if (cleanLink.includes('instagram.com') || cleanLink.includes('ig.me')) {
      return { isValid: true, message: 'Link do Instagram válido', type: 'instagram' };
    }

    return { isValid: false, message: 'Link deve ser do Instagram (instagram.com ou ig.me)', type: 'invalid' };
  };

  const handleCustomerDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCustomerData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Validação em tempo real para o link do Instagram
    if (id === 'linkPerfil') {
      const validation = validateInstagramLink(value);
      setFormErrors((prev) => ({
        ...prev,
        linkPerfil: validation.isValid ? '' : validation.message,
      }));
      setLinkValidationStatus(validation);
    }
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    if (method === "pix") {
      setShowPixSection(true);
    } else {
      setShowPixSection(false);
    }
  };

  const handleOrderBumpChange = (bumpType: keyof typeof orderBumps) => {
    setOrderBumps((prev) => ({
      ...prev,
      [bumpType]: !prev[bumpType],
    }));
  };

  const handleSubmitPayment = () => {
    // Validação dos campos obrigatórios
    const errors: { [key: string]: string } = {};
    if (!customerData.email.trim()) errors.email = "Preencha o e-mail";
    if (!customerData.name.trim()) errors.name = "Preencha o nome completo";
    
    // Validação específica para o link do Instagram
    const linkValidation = validateInstagramLink(customerData.linkPerfil);
    if (!linkValidation.isValid) {
      errors.linkPerfil = linkValidation.message;
    }
    
    if (!customerData.phone.trim()) errors.phone = "Preencha o celular";
    if (!acceptTerms) errors.terms = "Você precisa aceitar os termos";
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    
    // Mostrar modal de verificação de privacidade
    setShowPrivacyModal(true);
  };

  const handleConfirmPayment = async () => {
    setShowPrivacyModal(false);
    setIsProcessing(true);

    try {
      // você já tem:
      const priceWithFee = Number((totalAmount * 1.01).toFixed(2));

      // em centavos:
      const valueCents = Math.round(priceWithFee * 100);
      const quantityFromTitle = parseInt(
        (orderDetails.title.match(/[\d.]+/)?.[0] || "1").replace(/\./g, ""),
        10
      );

      // Criar descrição com order bumps
      let description = orderDetails.title;
      if (addExtraOffer) description += " + Oferta Especial";
      if (orderBumps.turboDelivery) description += " + Entrega Turbo";
      if (orderBumps.boostEngagement) description += " + Boost Engajamento";
      if (orderBumps.antiDrop) description += " + Proteção Anti-Queda";

      /* const body = {
         transaction_amount: priceWithFee,
         description: description,
         payment_method_id: "pix",
        payer: {
          email: customerData.email,
          first_name: customerData.name.split(" ")[0],
          last_name: customerData.name.split(" ").slice(1).join(" ") || "-",
          identification: {
            type: "CPF",
            number: customerData.document.replace(/\D/g, ""),
          },
        },
        metadata: {
          service_id: orderDetails.serviceId,
          link: customerData.linkPerfil,
          quantity: quantityFromTitle,
          email: customerData.email,
          celular: customerData.phone.replace(/\D/g, ""),
          first_name: customerData.name.split(" "),
          platform: orderDetails.platform,
        },
      }; */

      /* const body = {
        amount: priceWithFee, // number, não string
        payment_type: "pix", // obrigatório em lowercase
        payer: {
          name: customerData.name, 
          document: customerData.document.replace(/\D/g, ""), 
          email: null,
        },
        metadata: {
          service_id: orderDetails.serviceId,
          link: customerData.linkPerfil,
          quantity: quantityFromTitle,
          email: customerData.email,
          celular: customerData.phone.replace(/\D/g, ""),
          platform: orderDetails.platform,
        },
      }; */

      const body = {
        paymentMethod: "pix",
        value: valueCents,
        description,
        postbackUrl: "https://new-back-end-phi.vercel.app/payments/webhook",
        customer: {
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone.replace(/\D/g, ""),
        },
        items: [
          {
            name: description,
            quantity: quantityFromTitle,
            unitAmount: valueCents,
          },
        ],
        metadata: {
          service_id: orderDetails.serviceId,
          link: customerData.linkPerfil,
          quantity: quantityFromTitle,
          email: customerData.email,
          celular: customerData.phone.replace(/\D/g, ""),
          platform: orderDetails.platform,
          ...utm,
        },
        paymentPlatform: 'site'
      };

      /* console.log(body); */
      const response = await fetch(`${URL}/payments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      /* console.log("💚 Pedido criado com sucesso:", result); */
      if (response.ok) {
        setQrCode(result.qrcode_image);
        setPixCode(result.pixCode);
        setPaymentRequest(true);
        setQrCodeTimer(300);
      } else {
        console.error("❌ Erro ao criar pedido:", result.message);
        alert("Erro ao criar pedido. Tente novamente.");
      }
    } catch (error) {
      console.error("🚨 Erro inesperado na hora de enviar o email:", error);
      alert("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <Layout showFooter={false} showNavBar={false}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pt-6 pb-12">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-primary hover:bg-primary/10 transition-all"
              onClick={() => navigate("/")}
            >
              <ArrowLeftIcon size={16} />
              <span>Voltar para Home</span>
            </Button>

            <div className="flex items-center gap-2">
              <div className="flex items-center space-x-1 text-green-600 bg-green-50 p-1.5 rounded-full px-3">
                <LockIcon size={14} />
                <span className="text-xs font-medium">Site Seguro</span>
              </div>

              <div className="hidden md:flex items-center space-x-1 text-primary bg-primary/10 p-1.5 rounded-full px-3">
                <Clock size={14} />
                <span className="text-xs font-medium">Processo rápido</span>
              </div>
            </div>
          </div>

          {/* Título */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800 tracking-tight">
              Finalizar seu pedido
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Você está a poucos passos de impulsionar sua presença nas redes
              sociais. Preencha os dados abaixo para concluir sua compra.
            </p>
          </div>

          {/* Layout Principal */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Coluna Esquerda - Resumo do Pedido (Desktop) / Primeiro no Mobile */}
            <div className="w-full lg:w-2/5 order-1 lg:order-1">
              <Card className="sticky top-24 border-0 shadow-xl bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <CardHeader
                  className="bg-gradient-to-r from-primary to-accent text-white cursor-pointer"
                  onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingBag className="h-5 w-5" />
                      <CardTitle className="text-xl">
                        Resumo do Pedido
                      </CardTitle>
                    </div>
                    {isOrderSummaryOpen ? (
                      <ChevronUp className="h-5 w-5 text-white/90" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-white/90" />
                    )}
                  </div>
                  <CardDescription className="text-white/90">
                    Clique para revisar os detalhes do seu pedido
                  </CardDescription>
                </CardHeader>

                {isOrderSummaryOpen && (
                  <CardContent className="p-6">
                    <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-primary/10">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-blue-100">
                          {orderDetails.title.includes("Instagram") ? (
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-lg flex items-center justify-center text-white">
                              <Heart size={18} />
                            </div>
                          ) : orderDetails.title.includes("TikTok") ? (
                            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
                              <Music size={18} />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                              <Star size={18} />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {orderDetails.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {orderDetails.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              <Clock size={12} /> {orderDetails.deliveryTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">
                        Preço Original
                      </span>
                      <span className="text-sm line-through">
                        R$ {orderDetails.basePrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="flex items-center gap-1 font-medium">
                        Valor Total
                        <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full">
                          -{orderDetails.savePercentage}%
                        </span>
                      </span>
                      <span className="text-xl font-bold">
                        R$ {orderDetails.discountPrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3 mb-6 flex items-start gap-2">
                      <BadgeCheck className="text-primary w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Entrega Garantida</p>
                        <p className="text-xs text-muted-foreground">
                          {orderDetails.deliveryTime}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <Gift className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                Bônus Especial
                              </h3>
                              <p className="text-xs text-gray-600">
                                Aproveite esta oferta exclusiva
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-purple-600 font-bold text-lg flex items-center gap-2">
                              <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full font-semibold animate-pulse">
                                GRÁTIS
                              </span>
                              +300 LIKES
                            </span>
                            <p className="text-xs text-purple-600 font-medium">
                              Valor Original: R$ 29,90
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <Input
                          placeholder="Código promocional"
                          value={promocode}
                          onChange={(e) => setPromocode(e.target.value)}
                          className="pr-20 bg-slate-50 border-dashed border-gray-300 focus:border-primary"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute right-0 top-0 h-full text-primary hover:text-primary/80 hover:bg-primary/5"
                          onClick={handleApplyPromocode}
                          disabled={isApplying || !promocode}
                        >
                          {isApplying ? "Aplicando..." : "Aplicar"}
                        </Button>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-xl">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 flex items-center gap-1.5">
                          <ShoppingBag size={14} />
                          Subtotal
                        </span>
                        <span className="text-sm">
                          R$ {orderDetails.discountPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-purple-600 flex items-center gap-1.5">
                          <Gift size={14} />
                          300 Likes Bônus
                        </span>
                        <span className="text-sm font-medium text-purple-600">
                          GRÁTIS
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 flex items-center gap-1.5">
                          <DollarSign size={14} />
                          Taxa de processamento
                        </span>
                        <span className="text-sm">R$ 0,00</span>
                      </div>
                      {addExtraOffer && (
                        <div className="flex justify-between">
                          <span className="text-sm text-primary flex items-center gap-1.5">
                            <Rocket size={14} />
                            Impulsionamento (IA)
                          </span>
                          <span className="text-sm font-medium text-primary">
                            + R$ 9,90
                          </span>
                        </div>
                      )}
                      {orderBumps.turboDelivery && (
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-600 flex items-center gap-1.5">
                            <Zap size={14} />
                            Entrega Turbo
                          </span>
                          <span className="text-sm font-medium text-blue-600">
                            + R$ 9,90
                          </span>
                        </div>
                      )}
                      {orderBumps.boostEngagement && (
                        <div className="flex justify-between">
                          <span className="text-sm text-green-600 flex items-center gap-1.5">
                            <Rocket size={14} />
                            Boost Engajamento
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            + R$ 14,90
                          </span>
                        </div>
                      )}
                      {orderBumps.antiDrop && (
                        <div className="flex justify-between">
                          <span className="text-sm text-amber-600 flex items-center gap-1.5">
                            <ShieldAlert size={14} />
                            Proteção Anti-Queda
                          </span>
                          <span className="text-sm font-medium text-amber-600">
                            + R$ 9,90
                          </span>
                        </div>
                      )}
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold">
                        <span className="flex items-center gap-1.5">
                          <BadgeCheck size={16} className="text-primary" />
                          Total
                        </span>
                        <span className="text-xl text-primary">
                          R$ {totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                )}

                {isOrderSummaryOpen && (
                  <CardFooter className="bg-slate-50 px-6 py-4 flex flex-col gap-2">
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <div className="flex flex-col items-center bg-white p-2 rounded-lg">
                        <LockIcon className="w-4 h-4 text-primary mb-1" />
                        <span className="text-[10px] text-gray-600 text-center">
                          Pagamento Seguro
                        </span>
                      </div>
                      <div className="flex flex-col items-center bg-white p-2 rounded-lg">
                        <BadgeCheck className="w-4 h-4 text-green-600 mb-1" />
                        <span className="text-[10px] text-gray-600 text-center">
                          Entrega Garantida
                        </span>
                      </div>
                      <div className="flex flex-col items-center bg-white p-2 rounded-lg">
                        <ShieldAlert className="w-4 h-4 text-amber-600 mb-1" />
                        <span className="text-[10px] text-gray-600 text-center">
                          Suporte Prioritário
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-center gap-3">
                      <VisaIcon className="h-8 w-auto filter drop-shadow-sm" />
                      <MastercardIcon className="h-8 w-auto filter drop-shadow-sm" />
                      <PixIcon className="h-8 w-auto filter drop-shadow-sm" />
                    </div>
                  </CardFooter>
                )}
              </Card>
            </div>

            {/* Coluna Direita - Formulário */}
            <div className="w-full lg:w-3/5 order-2 lg:order-2">
              {/* Seção 1: Dados Pessoais */}
              <div className="space-y-6 mb-8">
                <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-white">
                  <CardHeader className="pb-6 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-[#1A73E8] flex items-center justify-center text-white font-bold text-lg">
                        1
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-[#1A1A1A] uppercase tracking-wide">
                          Dados Pessoais
                        </CardTitle>
                        <CardDescription className="text-[#9CA3AF] text-base mt-1">
                          Quem irá receber o pedido?
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="email"
                        className="text-[#1A1A1A] font-semibold text-base"
                      >
                        E-mail
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={customerData.email}
                          onChange={handleCustomerDataChange}
                          required
                          className={`w-full px-6 py-4 rounded-3xl border-0 bg-[#EDF2F7] text-[#1A1A1A] placeholder-[#6B7280] focus:bg-white focus:ring-2 focus:ring-[#1A73E8] focus:border-[#1A73E8] transition-all duration-200 text-base ${
                            formErrors.email
                              ? "border-red-500 ring-red-500"
                              : ""
                          }`}
                        />
                        {formErrors.email && (
                          <span className="text-xs text-red-500 mt-1 block">
                            {formErrors.email}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="name"
                        className="text-[#1A1A1A] font-semibold text-base"
                      >
                        Nome completo
                      </Label>
                      <div className="relative">
                        <Input
                          id="name"
                          placeholder="Seu nome completo"
                          value={customerData.name}
                          onChange={handleCustomerDataChange}
                          required
                          className={`w-full px-6 py-4 rounded-3xl border-0 bg-[#EDF2F7] text-[#1A1A1A] placeholder-[#6B7280] focus:bg-white focus:ring-2 focus:ring-[#1A73E8] focus:border-[#1A73E8] transition-all duration-200 text-base ${
                            formErrors.name ? "border-red-500 ring-red-500" : ""
                          }`}
                        />
                        {formErrors.name && (
                          <span className="text-xs text-red-500 mt-1 block">
                            {formErrors.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="phone"
                        className="text-[#1A1A1A] font-semibold text-base"
                      >
                        Celular / Whatsapp
                      </Label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-[#6B7280] font-medium">
                          <span>🇧🇷</span>
                          <span>+55</span>
                        </div>
                        <Input
                          id="phone"
                          placeholder="(DD) NNNNNNNNN"
                          value={customerData.phone}
                          onChange={handleCustomerDataChange}
                          required
                          className={`w-full pl-20 pr-6 py-4 rounded-3xl border-0 bg-[#EDF2F7] text-[#1A1A1A] placeholder-[#6B7280] focus:bg-white focus:ring-2 focus:ring-[#1A73E8] focus:border-[#1A73E8] transition-all duration-200 text-base ${
                            formErrors.phone
                              ? "border-red-500 ring-red-500"
                              : ""
                          }`}
                        />
                        {formErrors.phone && (
                          <span className="text-xs text-red-500 mt-1 block">
                            {formErrors.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="linkPerfil"
                        className="text-[#1A1A1A] font-semibold text-base"
                      >
                        Link do Instagram
                      </Label>
                      <div className="relative">
                        <Input
                          id="linkPerfil"
                          placeholder="Cole aqui qualquer link do Instagram"
                          value={customerData.linkPerfil}
                          onChange={handleCustomerDataChange}
                          required
                          className={`w-full px-6 py-4 rounded-3xl border-0 bg-[#EDF2F7] text-[#1A1A1A] placeholder-[#6B7280] focus:bg-white focus:ring-2 focus:ring-[#1A73E8] focus:border-[#1A73E8] transition-all duration-200 text-base ${
                            formErrors.linkPerfil
                              ? "border-red-500 ring-red-500 bg-red-50"
                              : linkValidationStatus?.isValid
                              ? "border-green-500 ring-green-500 bg-green-50"
                              : ""
                          }`}
                        />
                        
                        {/* Ícone de status da validação */}
                        {customerData.linkPerfil && linkValidationStatus && !linkValidationStatus.isValid && (
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <X size={16} className="text-red-500" />
                          </div>
                        )}
                        
                        {/* Mensagens de validação */}
                        {formErrors.linkPerfil && (
                          <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                            <span className="text-xs text-red-600 font-medium">
                              {formErrors.linkPerfil}
                            </span>
                          </div>
                        )}
                        
                        {linkValidationStatus?.isValid && !formErrors.linkPerfil && (
                          <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                            <CheckIcon size={14} className="text-green-500 flex-shrink-0" />
                            <span className="text-xs text-green-600 font-medium">
                              {linkValidationStatus.message}
                            </span>
                          </div>
                        )}
                        
                        {/* Dicas de formato */}
                        {!customerData.linkPerfil && (
                          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs text-blue-600 font-bold">i</span>
                              </div>
                              <div className="text-xs text-blue-700">
                                <p className="font-medium mb-1">Cole qualquer link do Instagram:</p>
                                <p className="text-blue-600">
                                  Perfil, post, reel, story, highlight, etc.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="border-t border-gray-100 bg-white p-6">
                    <div className="flex items-center gap-3 text-sm text-[#9CA3AF]">
                      <ShieldIcon className="h-5 w-5 text-[#1A73E8]" />
                      <span>
                        Seus dados estão protegidos e nunca serão
                        compartilhados.
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              {/* Seção 2: Método de Pagamento */}
              <div className="space-y-6 mb-8">
                <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                  <CardHeader className="pb-6 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-[#1A73E8] flex items-center justify-center text-white font-bold text-lg">
                        2
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-[#1A1A1A] uppercase tracking-wide">
                          Método de Pagamento
                        </CardTitle>
                        <CardDescription className="text-[#9CA3AF] text-base mt-1">
                          Escolha como deseja pagar
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-8">
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={handlePaymentMethodChange}
                      className="space-y-4"
                    >
                      <div className="flex items-start space-x-4 border rounded-xl p-5 cursor-pointer transition-all hover:shadow-md border-primary bg-primary/5">
                        <RadioGroupItem value="pix" id="pix" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center justify-center p-2 bg-gradient-to-b from-green-400 to-green-600 rounded-md text-white">
                              <QrCodeIcon size={20} />
                            </div>
                            <span className="font-medium text-lg">Pix</span>
                          </div>
                          <p className="text-sm text-gray-600 ml-9">
                            A confirmação de pagamento é realizada em poucos
                            minutos. Utilize o aplicativo do seu banco para
                            pagar.
                          </p>
                          <div className="flex items-center gap-2 mt-2 ml-9">
                            <PixIcon className="h-7 w-auto" />
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Clock size={12} />
                              Aprovação imediata
                            </span>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>

                    {/* Order Bumps */}
                    <div className="mt-8 space-y-4">
                      <div className="border-t border-gray-100 pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <Gift className="h-5 w-5 text-primary" />
                          Ofertas Especiais para Você
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                          Turbine ainda mais seus resultados com estas ofertas
                          exclusivas
                        </p>
                      </div>

                      {/* Order Bump 1: Entrega Turbo */}
                      <div
                        className={`relative border rounded-xl p-5 transition-all duration-200 ${
                          orderBumps.turboDelivery
                            ? "border-blue-400 bg-blue-50/50 shadow-md"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center w-6 h-6 mt-1">
                            <input
                              type="checkbox"
                              id="turboDelivery"
                              checked={orderBumps.turboDelivery}
                              onChange={() =>
                                handleOrderBumpChange("turboDelivery")
                              }
                              className="h-5 w-5 rounded border-2 border-blue-400 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-bold text-gray-800 text-lg">
                                Entrega Turbo + Garantia Blindada
                              </h4>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                POPULAR
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              ⚡{" "}
                              <span className="font-semibold text-blue-600">
                                Por apenas R$9,90
                              </span>
                              , ative a Entrega Turbo e receba seus seguidores
                              até 5x mais rápido, com garantia de reposição
                              automática caso algum caia. Segurança total para
                              seu perfil!
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Order Bump 2: Boost de Engajamento */}
                      <div
                        className={`relative border rounded-xl p-5 transition-all duration-200 ${
                          orderBumps.boostEngagement
                            ? "border-blue-400 bg-blue-50/50 shadow-md"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center w-6 h-6 mt-1">
                            <input
                              type="checkbox"
                              id="boostEngagement"
                              checked={orderBumps.boostEngagement}
                              onChange={() =>
                                handleOrderBumpChange("boostEngagement")
                              }
                              className="h-5 w-5 rounded border-2 border-blue-400 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-bold text-gray-800 text-lg">
                                Boost Automático de Engajamento
                              </h4>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                RECOMENDADO
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              🚀{" "}
                              <span className="font-semibold text-green-600">
                                Adicione agora por apenas R$14,90
                              </span>
                              : curtidas automáticas nos seus próximos 3 posts
                              para turbinar ainda mais seu alcance e
                              engajamento.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Order Bump 3: Verificação Anti-Queda */}
                      <div
                        className={`relative border rounded-xl p-5 transition-all duration-200 ${
                          orderBumps.antiDrop
                            ? "border-blue-400 bg-blue-50/50 shadow-md"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center w-6 h-6 mt-1">
                            <input
                              type="checkbox"
                              id="antiDrop"
                              checked={orderBumps.antiDrop}
                              onChange={() => handleOrderBumpChange("antiDrop")}
                              className="h-5 w-5 rounded border-2 border-blue-400 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-bold text-gray-800 text-lg">
                                Verificação Anti-Queda
                              </h4>
                              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                                SEGURANÇA
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              🛡️{" "}
                              <span className="font-semibold text-amber-600">
                                Por R$9,90
                              </span>
                              , ative a proteção anti-queda: se qualquer
                              seguidor cair, repomos sem custo extra por 30
                              dias.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Botão Comprar Agora */}
                    {!qrCode && (
                      <Button
                        onClick={handleSubmitPayment}
                        disabled={!acceptTerms || isProcessing}
                        className="w-full mt-6 py-6 text-base font-medium rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:shadow-green-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <div className="flex items-center gap-2">
                            <svg
                              className="animate-spin h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processando...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>Comprar Agora</span>
                            <BadgeCheck size={18} />
                          </div>
                        )}
                      </Button>
                    )}

                    {/* Seção PIX (aparece quando QR Code é gerado) */}
                    {qrCode && (
                      <div className="mt-6 space-y-4">
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
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                              <Clock className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-medium text-red-700">
                                Expira em: {formatTime(qrCodeTimer)}
                              </span>
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center mb-4 border-2 border-solid border-green-400 p-2 shadow-md">
                              <img
                                src={`${qrCode}`}
                                alt="QR Code"
                                className="w-full h-full object-contain max-h-48"
                                style={{ imageRendering: "pixelated" }}
                              />
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                              Abra o aplicativo do seu banco e escaneie o QR
                              Code
                            </p>
                            {qrCodeTimer === 0 && (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <AlertCircle className="h-5 w-5 text-red-600" />
                                  <span className="text-sm font-medium text-red-700">
                                    QR Code expirado! Gere um novo para
                                    continuar.
                                  </span>
                                </div>
                                <Button
                                  onClick={handleSubmitPayment}
                                  disabled={isProcessing}
                                  className="w-full py-3 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all flex items-center justify-center gap-2"
                                >
                                  {isProcessing ? (
                                    <div className="flex items-center gap-2">
                                      <svg
                                        className="animate-spin h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                      >
                                        <circle
                                          className="opacity-25"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="4"
                                        ></circle>
                                        <path
                                          className="opacity-75"
                                          fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                      </svg>
                                      Processando...
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <span>Gerar Novo QR Code</span>
                                      <QrCodeIcon size={16} />
                                    </div>
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>

                          {pixCode && (
                            <div className="mt-4">
                              <label className="block text-sm text-gray-600 mb-1">
                                Código PIX:
                              </label>
                              <div className="relative">
                                <input
                                  readOnly
                                  value={pixCode}
                                  className="w-full pr-10 pl-3 py-2 text-sm rounded-md border border-gray-300 shadow-sm bg-gray-50 text-gray-800"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(pixCode);
                                    alert("Código copiado!");
                                  }}
                                  className="absolute inset-y-0 right-2 flex items-center text-green-600 hover:text-green-800"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8l6 6v8a2 2 0 01-2 2h-2M8 16v4a2 2 0 002 2h8M8 16h8"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Seção 3: Termos e Finalização */}
              {!qrCode && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-6 border-2 border-blue-200 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
                    <div className="flex items-center justify-center w-6 h-6 mt-0.5">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className={`h-5 w-5 rounded border-2 border-blue-400 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2 ${
                          formErrors.terms ? "border-red-500 ring-red-500" : ""
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <Label
                        htmlFor="terms"
                        className="text-base font-semibold text-gray-800 cursor-pointer"
                      >
                        Concordo com os termos e condições
                      </Label>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        Ao marcar esta caixa, você confirma que leu e concorda
                        com nossos{" "}
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-800 font-medium underline"
                        >
                          Termos de Serviço
                        </a>{" "}
                        e{" "}
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-800 font-medium underline"
                        >
                          Política de Privacidade
                        </a>
                        . Esta confirmação é necessária para processar seu
                        pagamento com segurança.
                      </p>
                      {formErrors.terms && (
                        <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                          <span className="text-sm text-red-700 font-medium">
                            {formErrors.terms}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Verificação de Privacidade */}
      <ProfilePrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        onConfirm={handleConfirmPayment}
        profileLink={customerData.linkPerfil}
      />
    </Layout>
  );
};

export default Payment;

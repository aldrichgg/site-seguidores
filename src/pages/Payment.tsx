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
} from "lucide-react";
import { VisaIcon, MastercardIcon, PixIcon } from "@/assets/payment-icons";
import Layout from "@/components/Layout";

// Interface para definir a estrutura dos detalhes do pedido
interface OrderDetailsType {
  title: string;
  description: string;
  basePrice: number;
  discountPrice: number;
  deliveryTime: string;
  savePercentage: number;
  features?: string[];
  isSubscription?: boolean; // Added for subscription plans
  billingCycle?: string;
  serviceId: number;
  platform: string; // Added for subscription plans
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
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<string>("personalData");
  const [paymentMethod, setPaymentMethod] = useState<string>("pix");
  const [promocode, setPromocode] = useState<string>("");
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [paymentRequest, setPaymentRequest] = useState<boolean>(false);
  const [qrCode, setQrCode] = useState<string>("");
  const [pixCode, setPixCode] = useState<string>("");
  /* console.log(qrCode); */
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
  });
  const [addExtraOffer, setAddExtraOffer] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(900); // 15 minutes in seconds
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // Carregar detalhes do pedido da navegação se disponíveis
  useEffect(() => {
    // Verificar se há detalhes do pedido no estado da rota
    if (location.state && location.state.orderDetails) {
      setOrderDetails(location.state.orderDetails);
    }

    // Garantir que a página seja exibida a partir do topo
    window.scrollTo(0, 0);
  }, [location]);

  // Inicializar o total com o valor do pedido
  useEffect(() => {
    setTotalAmount(orderDetails.discountPrice);
  }, [orderDetails.discountPrice]);

  // Atualizar o total quando o checkbox de oferta adicional for alterado
  useEffect(() => {
    if (addExtraOffer) {
      setTotalAmount(orderDetails.discountPrice + 9.9);
    } else {
      setTotalAmount(orderDetails.discountPrice);
    }
  }, [addExtraOffer, orderDetails.discountPrice]);

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

  const handleApplyPromocode = () => {
    if (!promocode) return;

    setIsApplying(true);

    // Simulação de aplicação de código promocional
    setTimeout(() => {
      setIsApplying(false);
      // Implementação de lógica para cupom seria aqui
    }, 1000);
  };

  const handleCustomerDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCustomerData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleContinueToPayment = () => {
    // Validação simples dos dados do cliente
    if (
      !customerData.email ||
      !customerData.name ||
      !customerData.document ||
      !customerData.linkPerfil
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Avançar para a etapa de escolha do método de pagamento
    setCurrentStep("paymentMethod");
  };

  const handleContinueToConfirmation = () => {
    // Validação dos dados de pagamento (pode ser expandida conforme necessário)
    if (paymentMethod === "creditcard") {
      // Aqui você adicionaria validação dos campos do cartão de crédito
    }

    // Avançar para a etapa de confirmação
    setCurrentStep("confirmation");
  };

  const handleSubmitPayment = async () => {
    if (!acceptTerms) return;

    setIsProcessing(true);

    try {
      const priceWithFee = Number((totalAmount * 1.01).toFixed(2));
      const quantityFromTitle = parseInt(
        orderDetails.title.match(/\d+/)?.[0] || "1",
        10
      );

      const body = {
        transaction_amount: priceWithFee,
        description: `${orderDetails.title} ${
          addExtraOffer ? "+ Oferta Especial" : ""
        }`,
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
      };

      const response = await fetch(
        "https://new-back-end-phi.vercel.app/payments/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();

      if (response.ok) {
        /* console.log("💰 Pedido criado com sucesso:", result); */

        setQrCode(result.point_of_interaction.transaction_data.qr_code_base64);
        setPixCode(result.point_of_interaction.transaction_data.qr_code);
        setPaymentRequest(true);

        window.gtag && window.gtag('event', 'conversion', {
          'send_to': 'AW-17024580299/eiHxCMC70bsaEMv1-bU_',
          'value': orderDetails.discountPrice,
          'currency': 'BRL',
          'transaction_id': result.id,
        });

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

  /* const getStepClass = (step: string) => {
    if (currentStep === step) {
      return "bg-primary text-white shadow-md shadow-primary/30";
    } else if (
      (step === "paymentMethod" && currentStep === "confirmation") ||
      (step === "personalData" && currentStep === "paymentMethod") ||
      (step === "personalData" && currentStep === "confirmation")
    ) {
      return "bg-primary/20 text-primary border border-primary/40";
    }
    return "bg-gray-100 text-gray-500 border border-gray-200";
  }; */

  const getStepClass = (step: string) => {
    if (currentStep === step) {
      return "bg-primary text-white shadow-md shadow-primary/30";
    } else if (
      (step === "paymentMethod" && currentStep === "confirmation") ||
      (step === "personalData" && currentStep === "paymentMethod") ||
      (step === "personalData" && currentStep === "confirmation")
    ) {
      return "bg-primary/20 text-primary border border-primary/40";
    }
    return "bg-gray-100 text-gray-500 border border-gray-200";
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <Layout showFooter={false} showNavBar={false}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pt-6 pb-12">
        <div className="container max-w-6xl mx-auto px-4 py-8">
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

          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800 tracking-tight">
              Finalizar seu pedido
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Você está a poucos passos de impulsionar sua presença nas redes
              sociais. Preencha os dados abaixo para concluir sua compra.
            </p>
          </div>

          {/* Etapa de progresso - Versão melhorada */}
          <div className="max-w-3xl mx-auto mb-10 relative">
            <div className="hidden md:block absolute h-1 bg-gray-200 top-1/2 left-[10%] right-[10%] -translate-y-1/2"></div>
            <div
              className={`absolute h-1 top-1/2 left-[10%] -translate-y-1/2 transition-all duration-500 bg-primary ${
                currentStep === "personalData"
                  ? "w-0"
                  : currentStep === "paymentMethod"
                  ? "w-[40%]"
                  : "w-[80%]"
              }`}
            ></div>
            <div
              className={`absolute h-1 top-1/2 left-[10%] -translate-y-1/2 transition-all duration-500 bg-primary ${
                currentStep === "personalData" ? "w-0" : "w-[80%]"
              }`}
            />

            <div className="flex justify-between relative z-10">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300 ${getStepClass(
                    "personalData"
                  )}`}
                >
                  <User size={20} />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  Seus dados
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300 ${getStepClass(
                    "paymentMethod"
                  )}`}
                >
                  <CreditCard size={20} />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  Pagamento
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300 ${getStepClass(
                    "confirmation"
                  )}`}
                >
                  <BadgeCheck size={20} />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  Confirmação
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Resumo da compra - Coluna da esquerda */}
            <div className="w-full lg:w-2/5 lg:order-1">
              <Card className="sticky top-24 border-0 shadow-xl bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-primary to-accent text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag className="h-5 w-5" />
                    <CardTitle className="text-xl">Resumo do Pedido</CardTitle>
                  </div>
                  <CardDescription className="text-white/90">
                    Detalhes do seu pedido
                  </CardDescription>
                </CardHeader>

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

                  {/* Características do produto se disponíveis */}
                  {orderDetails.features &&
                    orderDetails.features.length > 0 && (
                      <>
                        <Separator className="my-4" />
                        <div className="space-y-2">
                          <h3 className="font-medium mb-2">Características:</h3>
                          <ul className="space-y-1.5">
                            {orderDetails.features.map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-sm"
                              >
                                <CheckIcon className="text-primary w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <Gift className="h-4 w-4 text-primary" />
                        <h3 className="font-medium">Promoção</h3>
                      </div>
                      <span className="text-blue-600 font-medium flex items-center gap-1">
                        <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                          Bônus
                        </span>
                        + 300 LIKES GRATIS
                      </span>
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
                      <span className="text-sm text-gray-500 flex items-center gap-1.5">
                        <DollarSign size={14} />
                        Taxa de processamento
                      </span>
                      <span className="text-sm">R$ 0,00</span>
                    </div>
                    {/* {(currentStep === "confirmation" ||
                      currentStep === "personalData") &&
                      addExtraOffer && (
                        <div className="flex justify-between">
                          <span className="text-sm text-primary flex items-center gap-1.5">
                            <Rocket size={14} />
                            Impulsionamento (IA)
                          </span>
                          <span className="text-sm font-medium text-primary">
                            + R$ 9,90
                          </span>
                        </div>
                      )} */}
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
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        <BadgeCheck size={16} className="text-primary" />
                        Total
                      </span>
                      <span className="text-xl text-primary">
                        R${" "}
                        {(currentStep === "confirmation" ||
                          currentStep === "personalData") &&
                        addExtraOffer
                          ? totalAmount.toFixed(2)
                          : orderDetails.discountPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>

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
              </Card>
            </div>

            {/* Formulário de pagamento - Coluna da direita */}
            <div className="w-full lg:w-3/5 lg:order-2">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Finalizar Compra
              </h1>

              {/* Etapa 1: Dados Pessoais */}
              {currentStep === "personalData" && (
                <div className="space-y-6">
                  <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                    <CardHeader className="pb-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <User size={20} />
                        </div>
                        <div>
                          <CardTitle className="text-xl">
                            Dados para Faturamento
                          </CardTitle>
                          <CardDescription>
                            Preencha seus dados para continuar com o pagamento
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-5">
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="flex items-center gap-2 text-gray-700"
                        >
                          <span className="inline-block w-4 h-4 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs text-primary font-bold">
                              @
                            </span>
                          </span>
                          E-mail *
                        </Label>
                        <div className="relative">
                          <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={customerData.email}
                            onChange={handleCustomerDataChange}
                            required
                            className="pl-10 py-6 rounded-xl border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                          />
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
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
                                strokeWidth={1.5}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="flex items-center gap-2 text-gray-700"
                        >
                          <span className="inline-block w-4 h-4 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs text-primary font-bold">
                              N
                            </span>
                          </span>
                          Nome Completo *
                        </Label>
                        <div className="relative">
                          <Input
                            id="name"
                            placeholder="Seu nome completo"
                            value={customerData.name}
                            onChange={handleCustomerDataChange}
                            required
                            className="pl-10 py-6 rounded-xl border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                          />
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <User size={18} />
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="flex items-center gap-2 text-gray-700"
                        >
                          <span className="inline-block w-4 h-4 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs text-primary font-bold">
                              C
                            </span>
                          </span>
                          Número do celular *
                        </Label>
                        <div className="relative">
                          <Input
                            id="phone"
                            placeholder="(DD) NNNNNNNNN"
                            value={customerData.phone}
                            onChange={handleCustomerDataChange}
                            required
                            className="pl-10 py-6 rounded-xl border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                          />
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <User size={18} />
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="document"
                          className="flex items-center gap-2 text-gray-700"
                        >
                          <span className="inline-block w-4 h-4 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs text-primary font-bold">
                              C
                            </span>
                          </span>
                          CPF *
                        </Label>
                        <div className="relative">
                          <Input
                            id="document"
                            placeholder="000.000.000-00"
                            value={customerData.document}
                            onChange={handleCustomerDataChange}
                            required
                            className="pl-10 py-6 rounded-xl border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                          />
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
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
                                strokeWidth={1.5}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="linkPerfil"
                          className="flex items-center gap-2 text-gray-700"
                        >
                          <span className="inline-block w-4 h-4 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs text-primary font-bold">
                              L
                            </span>
                          </span>
                          {orderDetails.title.includes("Curtidas")
                            ? "Link da Postagem *"
                            : orderDetails.title.includes("Visualizações")
                            ? "Link do Vídeo *"
                            : orderDetails.title.includes("Inscritos")
                            ? "Link do Canal *"
                            : orderDetails.title.includes("Membros")
                            ? "Link do Servidor *"
                            : "Link do Perfil *"}
                        </Label>
                        <div className="relative">
                          <Input
                            id="linkPerfil"
                            placeholder={
                              // Instagram - diferentes tipos de serviço
                              orderDetails.title.includes("Instagram") &&
                              orderDetails.title.includes("Seguidores")
                                ? "instagram.com/seu_perfil"
                                : orderDetails.title.includes("Instagram") &&
                                  orderDetails.title.includes("Curtidas")
                                ? "instagram.com/p/codigo_da_postagem"
                                : orderDetails.title.includes("Instagram") &&
                                  orderDetails.title.includes("Visualizações")
                                ? "instagram.com/reel/codigo_do_reel"
                                : orderDetails.title.includes("Instagram") &&
                                  orderDetails.title.includes("Comentários")
                                ? "instagram.com/p/codigo_da_postagem"
                                : // TikTok - diferentes tipos de serviço
                                orderDetails.title.includes("TikTok") &&
                                  orderDetails.title.includes("Seguidores")
                                ? "tiktok.com/@seu_usuario"
                                : orderDetails.title.includes("TikTok") &&
                                  orderDetails.title.includes("Curtidas")
                                ? "tiktok.com/@usuario/video/codigo_do_video"
                                : orderDetails.title.includes("TikTok") &&
                                  orderDetails.title.includes("Visualizações")
                                ? "tiktok.com/@usuario/video/codigo_do_video"
                                : // YouTube - diferentes tipos de serviço
                                orderDetails.title.includes("YouTube") &&
                                  orderDetails.title.includes("Inscritos")
                                ? "youtube.com/c/seu_canal"
                                : orderDetails.title.includes("YouTube") &&
                                  orderDetails.title.includes("Visualizações")
                                ? "youtube.com/watch?v=codigo_do_video"
                                : orderDetails.title.includes("YouTube") &&
                                  orderDetails.title.includes("Curtidas")
                                ? "youtube.com/watch?v=codigo_do_video"
                                : // Twitter/X - diferentes tipos de serviço
                                orderDetails.title.includes("Twitter") &&
                                  orderDetails.title.includes("Seguidores")
                                ? "twitter.com/seu_usuario"
                                : orderDetails.title.includes("Twitter") &&
                                  orderDetails.title.includes("Curtidas")
                                ? "twitter.com/usuario/status/codigo_do_tweet"
                                : orderDetails.title.includes("Twitter") &&
                                  orderDetails.title.includes("Retweets")
                                ? "twitter.com/usuario/status/codigo_do_tweet"
                                : // Discord
                                orderDetails.title.includes("Discord") ||
                                  orderDetails.title.includes("Membros")
                                ? "discord.gg/codigo_do_convite"
                                : // Padrão para outros casos
                                  "Link completo (incluindo https://)"
                            }
                            value={customerData.linkPerfil}
                            onChange={handleCustomerDataChange}
                            required
                            className="pl-10 py-6 rounded-xl border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                          />
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
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
                                strokeWidth={1.5}
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 10-5.656-5.656l-1.102 1.101"
                              />
                            </svg>
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 ml-6 flex items-start gap-1">
                          <AlertCircle
                            size={12}
                            className="text-primary mt-0.5"
                          />
                          {
                            // Instagram - diferentes tipos de serviço
                            orderDetails.title.includes("Instagram") &&
                            orderDetails.title.includes("Seguidores")
                              ? "Insira o link do seu perfil no Instagram para receber os seguidores"
                              : orderDetails.title.includes("Instagram") &&
                                orderDetails.title.includes("Curtidas")
                              ? "Insira o link da sua postagem no Instagram para receber as curtidas"
                              : orderDetails.title.includes("Instagram") &&
                                orderDetails.title.includes("Visualizações")
                              ? "Insira o link do seu reel/vídeo no Instagram para receber as visualizações"
                              : orderDetails.title.includes("Instagram") &&
                                orderDetails.title.includes("Comentários")
                              ? "Insira o link da sua postagem no Instagram para receber os comentários"
                              : // TikTok - diferentes tipos de serviço
                              orderDetails.title.includes("TikTok") &&
                                orderDetails.title.includes("Seguidores")
                              ? "Insira o link do seu perfil no TikTok para receber os seguidores"
                              : orderDetails.title.includes("TikTok") &&
                                orderDetails.title.includes("Curtidas")
                              ? "Insira o link do seu vídeo no TikTok para receber as curtidas"
                              : orderDetails.title.includes("TikTok") &&
                                orderDetails.title.includes("Visualizações")
                              ? "Insira o link do seu vídeo no TikTok para receber as visualizações"
                              : // YouTube - diferentes tipos de serviço
                              orderDetails.title.includes("YouTube") &&
                                orderDetails.title.includes("Inscritos")
                              ? "Insira o link do seu canal no YouTube para receber os inscritos"
                              : orderDetails.title.includes("YouTube") &&
                                orderDetails.title.includes("Visualizações")
                              ? "Insira o link do seu vídeo no YouTube para receber as visualizações"
                              : orderDetails.title.includes("YouTube") &&
                                orderDetails.title.includes("Curtidas")
                              ? "Insira o link do seu vídeo no YouTube para receber as curtidas"
                              : // Twitter/X - diferentes tipos de serviço
                              orderDetails.title.includes("Twitter") &&
                                orderDetails.title.includes("Seguidores")
                              ? "Insira o link do seu perfil no Twitter para receber os seguidores"
                              : orderDetails.title.includes("Twitter") &&
                                orderDetails.title.includes("Curtidas")
                              ? "Insira o link do seu tweet para receber as curtidas"
                              : orderDetails.title.includes("Twitter") &&
                                orderDetails.title.includes("Retweets")
                              ? "Insira o link do seu tweet para receber os retweets"
                              : // Discord
                              orderDetails.title.includes("Discord") ||
                                orderDetails.title.includes("Membros")
                              ? "Insira o link de convite do seu servidor Discord para receber os membros"
                              : // Padrão para outros casos
                                "Insira o link completo para receber o serviço selecionado"
                          }
                        </p>
                      </div>
                    </CardContent>

                    <CardFooter className="border-t border-gray-100 bg-gray-50 p-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ShieldIcon className="h-5 w-5 text-primary" />
                        <span>
                          Seus dados estão protegidos e nunca serão
                          compartilhados.
                        </span>
                      </div>
                    </CardFooter>
                  </Card>

                  {/* Oferta Adicional (Up-sell) - etapa de dados pessoais */}
                  <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 mt-6">
                    <div className="p-1 bg-gradient-to-r from-primary via-accent to-purple-600">
                      <CardContent className="p-5 bg-white rounded-xl space-y-4">
                        <div className="flex flex-col md:flex-row items-start gap-4">
                          <div className="flex-shrink-0 mx-auto md:mx-0 mb-3 md:mb-0">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-purple-600 p-1 shadow-lg shadow-primary/20">
                              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                <Rocket className="h-8 w-8 text-primary" />
                              </div>
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                                🚀 Garanta seu lugar no topo!
                                <span className="text-xs bg-gradient-to-r from-primary to-accent text-white px-2 py-1 rounded-full flex items-center gap-1 font-medium">
                                  <Zap size={10} className="text-yellow-200" />
                                  Oferta Especial
                                </span>
                              </h3>
                              <span className="text-lg font-bold text-primary">
                                R$ 9,90
                              </span>
                            </div>

                            <p className="text-gray-600 mt-2">
                              Usando nossos métodos exclusivos de Inteligência
                              Artificial, vamos impulsionar seu perfil direto
                              para o Explorar por 24 horas! 🔥
                            </p>

                            <ul className="mt-3 space-y-1.5">
                              <li className="flex items-start gap-2">
                                <CheckIcon className="text-primary w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">
                                  Automação estratégica para aumentar seu
                                  alcance
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckIcon className="text-primary w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">
                                  Engajamento real para atrair mais seguidores
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckIcon className="text-primary w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">
                                  Resultados rápidos e eficazes
                                </span>
                              </li>
                            </ul>

                            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  id="extraOfferPersonalData"
                                  checked={addExtraOffer}
                                  onChange={(e) =>
                                    setAddExtraOffer(e.target.checked)
                                  }
                                  className="h-5 w-5 rounded-full border-2 border-primary text-primary focus:ring-primary"
                                />
                                <Label
                                  htmlFor="extraOfferPersonalData"
                                  className="cursor-pointer font-medium text-gray-900"
                                >
                                  Sim! Adicionar ao meu pedido
                                </Label>
                              </div>

                              {timer > 0 && (
                                <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full border border-red-100">
                                  <Clock size={14} />
                                  <span className="font-mono font-medium">
                                    {formatTime(timer)}
                                  </span>
                                </div>
                              )}
                            </div>

                            {timer > 0 && (
                              <p className="text-yellow-600 mt-2 text-sm font-medium flex items-center gap-1.5">
                                <Zap size={14} className="text-yellow-500" />
                                Vagas limitadas! (enquanto o cronômetro estiver
                                valendo)
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>

                  <div className="space-y-4 mt-6">
                    <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div>
                        <Label
                          htmlFor="terms"
                          className="text-sm font-medium text-gray-800"
                        >
                          Concordo com os termos e condições
                        </Label>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Ao prosseguir, você aceita nossos{" "}
                          <a href="#" className="text-primary hover:underline">
                            Termos de Serviço
                          </a>{" "}
                          e{" "}
                          <a href="#" className="text-primary hover:underline">
                            Política de Privacidade
                          </a>
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={handleContinueToPayment}
                      disabled={!acceptTerms}
                      className="w-full py-6 text-base font-medium rounded-xl bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <span>Continuar para Pagamento</span>
                        <ArrowRightIcon
                          size={16}
                          className="group-hover:translate-x-1 transition-transform duration-300"
                        />
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:400%] animate-slowshine"></span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Etapa 2: Método de Pagamento */}
              {currentStep === "paymentMethod" && (
                <div className="space-y-6">
                  <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                    <CardHeader className="pb-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <CreditCardIcon size={20} />
                        </div>
                        <div>
                          <CardTitle className="text-xl">
                            Método de Pagamento
                          </CardTitle>
                          <CardDescription>
                            Escolha como deseja pagar com total segurança
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                        className="space-y-4"
                      >
                        {/* <div
                          className={`flex items-start space-x-4 border rounded-xl p-5 cursor-pointer transition-all hover:shadow-md 
                          ${
                            paymentMethod === "creditcard"
                              ? "border-primary bg-primary/5 shadow-sm shadow-primary/20"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <RadioGroupItem
                            value="creditcard"
                            id="creditcard"
                            className="mt-1"
                          />
                          <Label
                            htmlFor="creditcard"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center gap-3 mb-1.5">
                              <div className="flex items-center justify-center p-2 bg-gradient-to-b from-blue-500 to-primary-700 rounded-md text-white">
                                <CreditCard size={20} />
                              </div>
                              <span className="font-medium text-lg">
                                Cartão de Crédito
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 ml-9">
                              Pagamento seguro com proteção de dados
                            </p>
                            <div className="flex items-center gap-2 mt-2 ml-9">
                              <VisaIcon className="h-7 w-auto" />
                              <MastercardIcon className="h-7 w-auto" />
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <BadgeCheck size={12} />
                                Até 12x sem juros
                              </span>
                            </div>
                          </Label>
                        </div> */}

                        <div
                          className={`flex items-start space-x-4 border rounded-xl p-5 cursor-pointer transition-all hover:shadow-md
                          ${
                            paymentMethod === "pix"
                              ? "border-primary bg-primary/5 shadow-sm shadow-primary/20"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <RadioGroupItem
                            value="pix"
                            id="pix"
                            className="mt-1"
                          />
                          <Label
                            htmlFor="pix"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center gap-3 mb-1.5">
                              <div className="flex items-center justify-center p-2 bg-gradient-to-b from-green-400 to-green-600 rounded-md text-white">
                                <QrCodeIcon size={20} />
                              </div>
                              <span className="font-medium text-lg">Pix</span>
                            </div>
                            <p className="text-sm text-gray-500 ml-9">
                              Pagamento instantâneo e seguro
                            </p>
                            <div className="flex items-center gap-2 mt-2 ml-9">
                              <PixIcon className="h-7 w-auto" />
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Clock size={12} />
                                Aprovação imediata
                              </span>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </CardContent>
                  </Card>

                  {paymentMethod === "creditcard" && (
                    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                      <CardHeader className="pb-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <CreditCard size={20} />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              Dados do Cartão
                            </CardTitle>
                            <CardDescription>
                              Preencha os detalhes do seu cartão com segurança
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-6 space-y-5">
                        <div className="space-y-2">
                          <Label htmlFor="cardName" className="text-gray-700">
                            Nome no Cartão
                          </Label>
                          <div className="relative">
                            <Input
                              id="cardName"
                              placeholder="Ex: João da Silva"
                              className="pl-10 py-6 rounded-xl border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                              <User size={18} />
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardNumber" className="text-gray-700">
                            Número do Cartão
                          </Label>
                          <div className="relative">
                            <Input
                              id="cardNumber"
                              placeholder="0000 0000 0000 0000"
                              className="pl-10 py-6 rounded-xl border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                              <CreditCard size={18} />
                            </span>
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary">
                              <LockIcon className="h-4 w-4" />
                            </span>
                          </div>
                          <p className="text-xs text-primary flex items-center gap-1 mt-1 ml-1">
                            <LockIcon size={12} />
                            Conexão segura e criptografada
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry" className="text-gray-700">
                              Data de Validade
                            </Label>
                            <div className="relative">
                              <Input
                                id="expiry"
                                placeholder="MM/AA"
                                className="pl-10 py-6 rounded-xl border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                              />
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <CalendarDays size={18} />
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvc" className="text-gray-700">
                              Código de Segurança
                            </Label>
                            <div className="relative">
                              <Input
                                id="cvc"
                                placeholder="CVC"
                                className="pl-10 py-6 rounded-xl border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                              />
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <ShieldIcon size={18} />
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="installments"
                            className="text-gray-700"
                          >
                            Parcelamento
                          </Label>
                          <div className="relative">
                            <select
                              id="installments"
                              className="w-full h-14 pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="1">
                                1x de R${" "}
                                {addExtraOffer
                                  ? totalAmount.toFixed(2)
                                  : orderDetails.discountPrice.toFixed(2)}{" "}
                                (sem juros)
                              </option>
                              <option value="2">
                                2x de R${" "}
                                {(addExtraOffer
                                  ? totalAmount / 2
                                  : orderDetails.discountPrice / 2
                                ).toFixed(2)}{" "}
                                (sem juros)
                              </option>
                              <option value="3">
                                3x de R${" "}
                                {(addExtraOffer
                                  ? totalAmount / 3
                                  : orderDetails.discountPrice / 3
                                ).toFixed(2)}{" "}
                                (sem juros)
                              </option>
                              <option value="4">
                                4x de R${" "}
                                {(addExtraOffer
                                  ? totalAmount / 4
                                  : orderDetails.discountPrice / 4
                                ).toFixed(2)}{" "}
                                (sem juros)
                              </option>
                            </select>
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                              <DollarSign size={18} />
                            </span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="border-t border-gray-100 bg-gray-50 p-6">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <LockIcon className="h-4 w-4 text-green-600" />
                          <span>
                            Utilizamos criptografia de ponta a ponta para
                            proteger seus dados de pagamento.
                          </span>
                        </div>
                      </CardFooter>
                      {orderDetails.isSubscription &&
                        paymentMethod === "creditcard" && (
                          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
                            <h4 className="font-medium text-blue-800 flex items-center gap-2 mb-2">
                              <CalendarDays size={16} />
                              Informação de Assinatura
                            </h4>
                            <p className="text-sm text-blue-600">
                              Esta é uma assinatura mensal recorrente. Seu
                              cartão será cobrado todo mês automaticamente no
                              valor de R${" "}
                              {orderDetails.discountPrice.toFixed(2)}. Você pode
                              cancelar a qualquer momento através do seu painel
                              de controle.
                            </p>
                          </div>
                        )}
                    </Card>
                  )}

                  {paymentMethod === "pix" && (
                    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                      <CardHeader className="pb-3 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <QrCodeIcon size={20} />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              Pagamento via Pix
                            </CardTitle>
                            <CardDescription>
                              Rápido, prático e seguro
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="flex flex-col items-center justify-center py-8">
                        <div className="w-56 h-56 p-3 bg-white rounded-xl flex items-center justify-center mb-4 border-2 border-dashed border-green-300 shadow-sm">
                          <div className="w-full h-full bg-green-50 rounded-lg flex items-center justify-center">
                            <QrCodeIcon className="w-28 h-28 text-green-400" />
                          </div>
                        </div>
                        <div className="text-center max-w-xs">
                          <p className="text-sm font-medium text-gray-800 mb-1">
                            Seu QR Code Pix aparecerá na próxima etapa
                          </p>
                          <p className="text-xs text-gray-500">
                            Ao clicar em "Continuar", você será direcionado para
                            a tela de confirmação com o QR Code do Pix para
                            finalizar seu pagamento.
                          </p>
                        </div>

                        <div className="flex items-center gap-3 mt-6 text-xs text-gray-600 bg-green-50 p-3 rounded-lg border border-green-100">
                          <Clock size={14} className="text-green-600" />
                          <span>
                            O pagamento via Pix é processado instantaneamente
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep("personalData")}
                      className="flex-1 py-6 text-base font-medium rounded-xl hover:bg-primary/5 transition-all border-gray-300 hover:border-primary/30"
                    >
                      <ArrowLeftIcon size={16} className="mr-2" />
                      Voltar
                    </Button>

                    <Button
                      onClick={handleContinueToConfirmation}
                      className="flex-1 py-6 text-base font-medium rounded-xl bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/20 transition-all group"
                    >
                      Continuar para Confirmação
                      <ArrowRightIcon
                        size={16}
                        className="ml-2 group-hover:translate-x-1 transition-transform"
                      />
                    </Button>
                  </div>
                </div>
              )}

              {/* Etapa 3: Confirmação */}
              {currentStep === "confirmation" && (
                <div className="space-y-6">
                  <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                    <CardHeader className="pb-3 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          <BadgeCheck size={20} />
                        </div>
                        <div>
                          <CardTitle className="text-xl">
                            Confirmação de Pedido
                          </CardTitle>
                          <CardDescription>
                            Confirme os dados do seu pedido antes de finalizar
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-6">
                      {/* Detalhes do Produto */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl overflow-hidden shadow-sm border border-blue-100">
                        <div className="border-b border-blue-100 p-4">
                          <h3 className="font-bold text-blue-800 flex items-center gap-2">
                            <ShoppingBag size={16} className="text-primary" />
                            Detalhes do Produto
                          </h3>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start gap-3 mb-4">
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
                              <h4 className="font-medium text-gray-800">
                                {orderDetails.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {orderDetails.description}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm border-b border-blue-50 pb-2">
                              <span className="text-gray-600 flex items-center gap-1.5">
                                <DollarSign
                                  size={14}
                                  className="text-primary"
                                />
                                {orderDetails.isSubscription
                                  ? "Valor Mensal:"
                                  : "Preço:"}
                              </span>
                              <span className="font-medium">
                                {orderDetails.isSubscription ? (
                                  <div className="flex items-center gap-1">
                                    <span>
                                      R$ {orderDetails.discountPrice.toFixed(2)}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      /mês
                                    </span>
                                  </div>
                                ) : (
                                  `R$ ${orderDetails.discountPrice.toFixed(2)}`
                                )}
                              </span>
                            </div>

                            {orderDetails.isSubscription && (
                              <div className="flex justify-between text-sm border-b border-blue-50 pb-2">
                                <span className="text-gray-600 flex items-center gap-1.5">
                                  <CalendarDays
                                    size={14}
                                    className="text-primary"
                                  />
                                  Período:
                                </span>
                                <span className="font-medium">
                                  Cobrança Mensal Recorrente
                                </span>
                              </div>
                            )}

                            <div className="flex justify-between text-sm border-b border-blue-50 pb-2">
                              <span className="text-gray-600 flex items-center gap-1.5">
                                <Clock size={14} className="text-primary" />
                                {orderDetails.isSubscription
                                  ? "Entrega Mensal:"
                                  : "Entrega:"}
                              </span>
                              <span className="font-medium">
                                {orderDetails.deliveryTime}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm pb-2">
                              <span className="text-gray-600 flex items-center gap-1.5">
                                <BadgeCheck
                                  size={14}
                                  className="text-green-500"
                                />
                                Economia:
                              </span>
                              <span className="font-medium text-green-600">
                                {orderDetails.savePercentage}% (R${" "}
                                {(
                                  orderDetails.basePrice -
                                  orderDetails.discountPrice
                                ).toFixed(2)}
                                )
                              </span>
                            </div>
                            {addExtraOffer && (
                              <div className="flex justify-between text-sm border-t border-blue-50 pt-2">
                                <span className="text-gray-600 flex items-center gap-1.5">
                                  <Rocket size={14} className="text-primary" />
                                  Impulsionamento (IA):
                                </span>
                                <span className="font-medium text-primary">
                                  R$ 9,90
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Dados do Cliente */}
                      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                        <div className="border-b border-gray-100 p-4">
                          <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <User size={16} className="text-gray-600" />
                            Dados do Cliente
                          </h3>
                        </div>
                        <div className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                              <span className="text-gray-600">Nome:</span>
                              <span className="font-medium text-gray-800">
                                {customerData.name}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                              <span className="text-gray-600">E-mail:</span>
                              <span className="font-medium text-gray-800">
                                {customerData.email}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                              <span className="text-gray-600">CPF:</span>
                              <span className="font-medium text-gray-800">
                                {customerData.document}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {orderDetails.title.includes("Curtidas")
                                  ? "Link da Postagem:"
                                  : orderDetails.title.includes("Visualizações")
                                  ? "Link do Vídeo:"
                                  : orderDetails.title.includes("Inscritos")
                                  ? "Link do Canal:"
                                  : orderDetails.title.includes("Membros")
                                  ? "Link do Servidor:"
                                  : "Link do Perfil:"}
                              </span>
                              <span
                                className="font-medium text-blue-600 max-w-[200px] truncate"
                                title={customerData.linkPerfil}
                              >
                                {customerData.linkPerfil}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Método de Pagamento */}
                      <div
                        className={`rounded-xl overflow-hidden shadow-sm border ${
                          paymentMethod === "creditcard"
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100"
                            : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-100"
                        }`}
                      >
                        <div
                          className={`border-b p-4 ${
                            paymentMethod === "creditcard"
                              ? "border-blue-100"
                              : "border-green-100"
                          }`}
                        >
                          <h3 className="font-bold flex items-center gap-2 text-gray-800">
                            {paymentMethod === "creditcard" ? (
                              <CreditCard size={16} className="text-blue-600" />
                            ) : (
                              <QrCodeIcon
                                size={16}
                                className="text-green-600"
                              />
                            )}
                            Método de Pagamento
                          </h3>
                        </div>

                        <div className="p-4">
                          {/*  <div className="flex justify-between text-sm mb-3">
                            <span className="text-gray-600">
                              Forma de pagamento:
                            </span>
                            <span className="font-medium flex items-center gap-1.5">
                              {paymentMethod === "creditcard" ? (
                                <>
                                  <CreditCard
                                    size={14}
                                    className="text-blue-600"
                                  />
                                  <span>Cartão de Crédito</span>
                                </>
                              ) : (
                                <>
                                  <QrCodeIcon
                                    size={14}
                                    className="text-green-600"
                                  />
                                  <span>Pix</span>
                                </>
                              )}
                            </span>
                          </div> */}

                          {paymentMethod === "pix" && (
                            <div className="mt-4 relative">
                              {qrCode ? (
                                <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center mb-4 border-2 border-solid border-green-400 p-2 shadow-md">
                                  <img
                                    src={`data:image/png;base64,${qrCode}`}
                                    alt="QR Code"
                                    className="w-full h-full object-contain max-h-48"
                                    style={{ imageRendering: "pixelated" }}
                                  />
                                </div>
                              ) : (
                                <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center mb-4 border-2 border-dashed border-green-300 p-3 shadow-sm">
                                  <div className="w-full h-full bg-green-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                                    <QrCodeIcon className="w-28 h-28 text-green-500" />
                                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm font-medium rotate-6 shadow-sm border border-green-200">
                                        Aguardando confirmação
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Texto explicativo */}
                              <p className="text-xs text-center text-gray-600 mt-2 max-w-xs mx-auto">
                                Após confirmar, você receberá o QR Code para
                                escanear com seu aplicativo bancário
                              </p>

                              {/* Linha digitável com botão de cópia */}
                              {pixCode && (
                                <div className="mt-4 max-w-md mx-auto px-4">
                                  <label className="block text-sm text-gray-600 mb-1">
                                    Copie o código Pix abaixo:
                                  </label>
                                  <div className="relative">
                                    <input
                                      readOnly
                                      value={pixCode}
                                      className="w-full pr-10 pl-3 py-2 text-sm rounded-md border border-gray-300 shadow-sm bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                          )}
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="border-t border-gray-100 bg-gray-50 p-6">
                      <div className="flex items-center justify-center w-full gap-3 text-sm text-gray-600">
                        <ShieldIcon className="h-5 w-5 text-primary" />
                        <span>
                          Confirmando o pedido você concorda com nossos termos
                          de serviço e política de privacidade.
                        </span>
                      </div>
                    </CardFooter>
                  </Card>

                  {paymentRequest ? (
                    ""
                  ) : (
                    <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 mt-6">
                      <div className="p-1 bg-gradient-to-r from-primary via-accent to-purple-600">
                        <CardContent className="p-5 bg-white rounded-xl space-y-4">
                          <div className="flex flex-col md:flex-row items-start gap-4">
                            <div className="flex-shrink-0 mx-auto md:mx-0 mb-3 md:mb-0">
                              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-purple-600 p-1 shadow-lg shadow-primary/20">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                  <Rocket className="h-8 w-8 text-primary" />
                                </div>
                              </div>
                            </div>

                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                                  🚀 Garanta seu lugar no topo!
                                  <span className="text-xs bg-gradient-to-r from-primary to-accent text-white px-2 py-1 rounded-full flex items-center gap-1 font-medium">
                                    <Zap
                                      size={10}
                                      className="text-yellow-200"
                                    />
                                    Oferta Especial
                                  </span>
                                </h3>
                                <span className="text-lg font-bold text-primary">
                                  R$ 9,90
                                </span>
                              </div>

                              <p className="text-gray-600 mt-2">
                                Usando nossos métodos exclusivos de Inteligência
                                Artificial, vamos impulsionar seu perfil direto
                                para o Explorar por 24 horas! 🔥
                              </p>

                              <ul className="mt-3 space-y-1.5">
                                <li className="flex items-start gap-2">
                                  <CheckIcon className="text-primary w-5 h-5 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700">
                                    Automação estratégica para aumentar seu
                                    alcance
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckIcon className="text-primary w-5 h-5 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700">
                                    Engajamento real para atrair mais seguidores
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckIcon className="text-primary w-5 h-5 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700">
                                    Resultados rápidos e eficazes
                                  </span>
                                </li>
                              </ul>

                              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    id="extraOfferConfirmation"
                                    checked={addExtraOffer}
                                    onChange={(e) =>
                                      setAddExtraOffer(e.target.checked)
                                    }
                                    className="h-5 w-5 rounded-full border-2 border-primary text-primary focus:ring-primary"
                                  />
                                  <Label
                                    htmlFor="extraOfferConfirmation"
                                    className="cursor-pointer font-medium text-gray-900"
                                  >
                                    Sim! Adicionar ao meu pedido
                                  </Label>
                                </div>

                                {timer > 0 && (
                                  <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full border border-red-100">
                                    <Clock size={14} />
                                    <span className="font-mono font-medium">
                                      {formatTime(timer)}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {timer > 0 && (
                                <p className="text-yellow-600 mt-2 text-sm font-medium flex items-center gap-1.5">
                                  <Zap size={14} className="text-yellow-500" />
                                  Vagas limitadas! (enquanto o cronômetro
                                  estiver valendo)
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  )}
                  {/* Oferta Adicional (Up-sell) - etapa de confirmação */}

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep("paymentMethod")}
                      className="flex-1 py-6 text-base font-medium rounded-xl hover:bg-primary/5 transition-all border-gray-300 hover:border-primary/30"
                    >
                      <ArrowLeftIcon size={16} className="mr-2" />
                      Voltar
                    </Button>

                    <Button
                      onClick={handleSubmitPayment}
                      disabled={isProcessing || paymentRequest}
                      className={`flex-1 py-6 text-base font-medium rounded-xl transition-all group
    ${
      isProcessing || paymentRequest
        ? "bg-green-400 cursor-not-allowed opacity-60"
        : "bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:shadow-green-500/20"
    }`}
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
                      ) : paymentRequest ? (
                        <div className="text-white">
                          Você já gerou um QR Code
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>Confirmar e Finalizar</span>
                          <BadgeCheck
                            size={18}
                            className="group-hover:scale-110 transition-transform"
                          />
                        </div>
                      )}
                    </Button>
                  </div>

                  <div className="flex flex-col items-center space-y-3">
                    <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1">
                      <LockIcon className="w-3 h-3" />
                      Pagamento seguro e criptografado
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-green-50 rounded-full">
                        <ShieldIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="p-1.5 bg-green-50 rounded-full">
                        <LockIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="p-1.5 bg-green-50 rounded-full">
                        <BadgeCheck className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Payment;

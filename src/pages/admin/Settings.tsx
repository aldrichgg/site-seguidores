import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Bell, 
  CreditCard, 
  Globe, 
  Palette, 
  Shield,
  Save,
  Check,
  X,
  RefreshCw
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

// Tipos para definir o estado das integrações de API
type ApiIntegrationStatus = {
  key: string;
  isValid: boolean;
  isConnected: boolean;
  lastChecked: Date | null;
  balance?: number;
  serviceStatus?: 'online' | 'offline' | 'unstable';
  responseTime?: number;
  failureRate?: number;
  dailyLimit?: number;
  usedToday?: number;
};

// Interface para informações da empresa
interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  description?: string;
  logo?: string;
  favicon?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
}

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("configuracoes-gerais");
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "ImpulseGram",
    email: "contato@impulsegram.com",
    phone: "(11) 99999-8888",
    address: "Rua Example, 123 - São Paulo, SP"
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    ipWhitelist: false
  });

  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    smtpConfig: {
      host: "",
      port: 587,
      user: "",
      password: "",
      secure: true,
      fromEmail: ""
    }
  });

  const [paymentSettings, setPaymentSettings] = useState({
    defaultCurrency: "BRL",
    taxPercentage: 5,
    automaticRefunds: false,
    mercadoPagoAccessToken: "",
    mercadoPagoPublicKey: "",
    mercadoPagoClientId: "",
    mercadoPagoClientSecret: "",
    feeType: "percentage",
    fixedFee: 2.50,
    pixKey: "",
    pixKeyType: "email",
    pixRecipientName: "",
    pixEnabled: false,
    paymentRetention: false,
    allowPartialPayments: false,
    savePaymentInfo: false
  });

  const [apiIntegrations, setApiIntegrations] = useState<{
    fornecedor: ApiIntegrationStatus;
  }>({
    fornecedor: { 
      key: "example_key_seguidores", 
      isValid: true, 
      isConnected: true, 
      lastChecked: new Date(Date.now() - 300000), // 5 minutos atrás
      balance: 2580.50,
      serviceStatus: 'online',
      responseTime: 240,
      failureRate: 0.02,
      dailyLimit: 5000,
      usedToday: 1240
    }
  });

  // Função para salvar configurações
  const saveSettings = () => {
    // Lógica para salvar configurações
    /* console.log("Salvando configurações...", {
      companyInfo,
      securitySettings,
      notificationPreferences,
      paymentSettings,
      apiIntegrations
    }); */
    
    toast({
      title: "Configurações Salvas",
      description: "Suas alterações foram salvas com sucesso!",
      variant: "default"
    });
  };

  // Função para validar chave de API
  const validateApiKey = async (platform: keyof typeof apiIntegrations, key: string) => {
    // Simulação de validação de API
    try {
      // Aqui você implementaria a lógica real de validação com a API específica
      const response = await simulateApiValidation(platform, key);
      
      setApiIntegrations(prev => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          key,
          isValid: response.isValid,
          isConnected: response.isConnected,
          lastChecked: new Date(),
          balance: response.balance,
          serviceStatus: response.serviceStatus,
          responseTime: response.responseTime,
          failureRate: response.failureRate,
          dailyLimit: response.dailyLimit,
          usedToday: response.usedToday
        }
      }));

      // Notificação de resultado
      if (response.isValid) {
        toast({
          title: `Conexão com Fornecedor`,
          description: `Serviço de Seguidores conectado com sucesso!`,
          variant: "default"
        });
      } else {
        toast({
          title: "Erro de Conexão",
          description: "Chave de API inválida ou serviço indisponível.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro de Conexão",
        description: `Não foi possível validar a chave de API do fornecedor.`,
        variant: "destructive"
      });
    }
  };

  // Função simulada de validação de API
  const simulateApiValidation = async (platform: string, key: string) => {
    // Simulação de chamada de API
    return new Promise<{
      isValid: boolean;
      isConnected: boolean;
      balance?: number;
      serviceStatus?: 'online' | 'offline' | 'unstable';
      responseTime?: number;
      failureRate?: number;
      dailyLimit?: number;
      usedToday?: number;
    }>(resolve => {
      // Simula validação com base no comprimento da chave
      const isValid = key.length >= 10;
      const isConnected = isValid && Math.random() > 0.2; // 80% de chance de conexão
      
      let balance = undefined;
      let serviceStatus: 'online' | 'offline' | 'unstable' | undefined = undefined;
      let responseTime = undefined;
      let failureRate = undefined;
      let dailyLimit = undefined;
      let usedToday = undefined;
      
      if (isValid) {
        // Gera dados simulados para APIs válidas
        balance = Math.floor(Math.random() * 5000) + 500;
        responseTime = Math.floor(Math.random() * 500) + 100;
        failureRate = Math.random() * 0.2;
        
        if (failureRate < 0.05) {
          serviceStatus = 'online';
        } else if (failureRate > 0.15) {
          serviceStatus = 'offline';
        } else {
          serviceStatus = 'unstable';
        }
        
        dailyLimit = Math.floor(Math.random() * 15000) + 5000;
        usedToday = Math.floor(Math.random() * dailyLimit);
      }

      // Simula um tempo de resposta de API
      setTimeout(() => {
        resolve({ 
          isValid, 
          isConnected,
          balance,
          serviceStatus,
          responseTime,
          failureRate,
          dailyLimit,
          usedToday
        });
      }, 1500);
    });
  };

  // Renderização da seção de Integrações de API
  const renderApiIntegrationSection = (
    platform: keyof typeof apiIntegrations, 
    serviceType: string
  ) => {
    const integration = apiIntegrations[platform];

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Painel Fornecedor - {serviceType}</Label>
            <div className="flex items-center space-x-2">
              <Input 
                type="password"
                placeholder={`Insira a chave de API de ${serviceType}`}
                value={integration.key}
                onChange={(e) => setApiIntegrations(prev => ({
                  ...prev,
                  [platform]: { ...prev[platform], key: e.target.value }
                }))}
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => validateApiKey(platform, integration.key)}
                disabled={!integration.key}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col justify-end space-y-2">
            <div className="flex items-center space-x-2">
              <Label>Status:</Label>
              {integration.isValid ? (
                <div className="flex items-center text-green-600">
                  <Check className="mr-1 h-4 w-4" />
                  Conectado
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <X className="mr-1 h-4 w-4" />
                  Não Conectado
                </div>
              )}
            </div>
            {integration.lastChecked && (
              <p className="text-xs text-muted-foreground">
                Última verificação: {integration.lastChecked.toLocaleString()}
              </p>
            )}
          </div>
        </div>
        
        {integration.isValid && (
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-3 rounded-md">
            <div>
              <Label className="text-xs text-gray-500">Saldo disponível</Label>
              <p className="font-medium">{integration.balance ? `R$ ${integration.balance.toFixed(2)}` : 'Não disponível'}</p>
            </div>
            <div>
              <Label className="text-xs text-gray-500">Limite diário</Label>
              <p className="font-medium">
                {integration.dailyLimit && integration.usedToday 
                  ? `${integration.usedToday} / ${integration.dailyLimit}` 
                  : 'Ilimitado'}
              </p>
            </div>
            <div>
              <Label className="text-xs text-gray-500">Tempo de resposta</Label>
              <p className="font-medium">{integration.responseTime ? `${integration.responseTime}ms` : 'Não medido'}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Função para salvar configurações de pagamento
  const handleSavePaymentSettings = () => {
    try {
      // Aqui você pode adicionar lógica de validação
      const { 
        mercadoPagoAccessToken, 
        mercadoPagoPublicKey, 
        mercadoPagoClientId, 
        mercadoPagoClientSecret 
      } = paymentSettings;

      // Validação básica (exemplo)
      if (!mercadoPagoAccessToken || !mercadoPagoPublicKey) {
        toast({
          title: "Erro de Validação",
          description: "Por favor, preencha os campos obrigatórios do Mercado Pago.",
          variant: "destructive"
        });
        return;
      }

      // Simulação de salvamento (substitua por chamada de API real)
      /* console.log("Salvando configurações do Mercado Pago:", paymentSettings); */
      
      toast({
        title: "Configurações Salvas",
        description: "Configurações do Mercado Pago atualizadas com sucesso!",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Erro ao Salvar",
        description: "Não foi possível salvar as configurações do Mercado Pago.",
        variant: "destructive"
      });
    }
  };

  return (
    <div id='webcrumbs'>
      <div className='w-full md:w-full bg-white'>
        <div className='flex flex-col md:flex-row min-h-screen'>
          {/* Sidebar */}
          

          {/* Main content */}
          <div className='flex-1 p-4 space-y-6'>
            {/* Header */}
              

            {/* Tab Navigation */}
            <div className='px-4 md:px-6 pt-4 border-b border-gray-200 overflow-x-auto'>
              <div className='flex space-x-1 pb-2 min-w-max'>
                <button 
                  onClick={() => setActiveTab("configuracoes-gerais")}
                  className={`px-3 md:px-4 py-2 ${activeTab === "configuracoes-gerais" 
                    ? "text-primary-600 border-b-2 border-primary-600" 
                    : "text-gray-500 hover:text-gray-700"} font-medium text-sm hover:border-b-2 hover:border-gray-300 transition-all whitespace-nowrap`}
                >
                  Configurações Gerais
                </button>
                <button 
                  onClick={() => setActiveTab("precos-planos")}
                  className={`px-3 md:px-4 py-2 ${activeTab === "precos-planos" 
                    ? "text-primary-600 border-b-2 border-primary-600" 
                    : "text-gray-500 hover:text-gray-700"} font-medium text-sm hover:border-b-2 hover:border-gray-300 transition-all whitespace-nowrap`}
                >
                  Preços e Planos
                </button>
                <button 
                  onClick={() => setActiveTab("integracoes-api")}
                  className={`px-3 md:px-4 py-2 ${activeTab === "integracoes-api" 
                    ? "text-primary-600 border-b-2 border-primary-600" 
                    : "text-gray-500 hover:text-gray-700"} font-medium text-sm hover:border-b-2 hover:border-gray-300 transition-all whitespace-nowrap`}
                >
                  Integrações e API
                </button>
                <button 
                  onClick={() => setActiveTab("pagamentos")}
                  className={`px-3 md:px-4 py-2 ${activeTab === "pagamentos" 
                    ? "text-primary-600 border-b-2 border-primary-600" 
                    : "text-gray-500 hover:text-gray-700"} font-medium text-sm hover:border-b-2 hover:border-gray-300 transition-all whitespace-nowrap`}
                >
                  Pagamentos
                </button>
                <button 
                  onClick={() => setActiveTab("seguranca")}
                  className={`px-3 md:px-4 py-2 ${activeTab === "seguranca" 
                    ? "text-primary-600 border-b-2 border-primary-600" 
                    : "text-gray-500 hover:text-gray-700"} font-medium text-sm hover:border-b-2 hover:border-gray-300 transition-all whitespace-nowrap`}
                >
                  Segurança
                </button>
        </div>
      </div>

      {/* Abas de Configurações */}
            
            {/* Configurações Gerais */}
            {activeTab === "configuracoes-gerais" && (
              <div className='mb-8'>
                <h2 className='text-xl font-semibold mb-4'>
                  Configurações Gerais
                </h2>

                <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
                  <div className='p-4 md:p-6'>
                    <div className='mb-6'>
                      <label
                        htmlFor='site-name'
                        className='block text-sm font-medium mb-2'
                      >
                        Nome do Site
                      </label>
                      <input
                        type='text'
                        id='site-name'
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all'
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                        placeholder="Digite o nome da sua empresa"
                  />
                </div>

                    <div className='mb-6'>
                      <label
                        htmlFor='site-description'
                        className='block text-sm font-medium mb-2'
                      >
                        Descrição Curta
                      </label>
                      <textarea
                        id='site-description'
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none min-h-[100px]'
                        value={companyInfo.description || ''}
                        onChange={(e) => setCompanyInfo({...companyInfo, description: e.target.value})}
                        placeholder="Descreva brevemente sua empresa"
                      />
                      <p className="text-xs text-gray-500 mt-1">Esta descrição será exibida em várias partes do site</p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6'>
                <div>
                        <label className='block text-sm font-medium mb-2'>
                          Logo
                        </label>
                        <div className='flex items-center'>
                          <div className='h-16 w-16 border border-gray-300 rounded-md flex items-center justify-center bg-gray-50'>
                            {companyInfo.logo ? (
                              <img 
                                src={companyInfo.logo} 
                                alt="Logo" 
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-8 w-8 text-gray-400'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                                />
                              </svg>
                            )}
                          </div>
                          <div className='ml-4'>
                            <button className='px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-all'>
                              Alterar
                            </button>
                            {companyInfo.logo && (
                              <button 
                                className='px-3 py-1.5 mt-1 bg-white border border-red-300 text-red-500 rounded-md text-sm font-medium hover:bg-red-50 transition-all'
                                onClick={() => setCompanyInfo({...companyInfo, logo: undefined})}
                              >
                                Remover
                              </button>
                            )}
                            <p className='text-xs text-gray-500 mt-1'>
                              PNG, JPG ou SVG (Max. 1MB)
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className='block text-sm font-medium mb-2'>
                          Favicon
                        </label>
                        <div className='flex items-center'>
                          <div className='h-10 w-10 border border-gray-300 rounded-md flex items-center justify-center bg-gray-50'>
                            {companyInfo.favicon ? (
                              <img 
                                src={companyInfo.favicon} 
                                alt="Favicon" 
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-6 w-6 text-gray-400'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                                />
                              </svg>
                            )}
                          </div>
                          <div className='ml-4'>
                            <button className='px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-all'>
                              Alterar
                            </button>
                            {companyInfo.favicon && (
                              <button 
                                className='px-3 py-1.5 mt-1 bg-white border border-red-300 text-red-500 rounded-md text-sm font-medium hover:bg-red-50 transition-all'
                                onClick={() => setCompanyInfo({...companyInfo, favicon: undefined})}
                              >
                                Remover
                              </button>
                            )}
                            <p className='text-xs text-gray-500 mt-1'>
                              ICO, PNG (32x32px)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label
                          htmlFor='email'
                          className='block text-sm font-medium mb-2'
                        >
                          E-mail de Contato
                        </label>
                        <input
                          type='email'
                          id='email'
                          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all'
                    value={companyInfo.email}
                    onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                          placeholder="contato@suaempresa.com"
                  />
                </div>
                <div>
                        <label
                          htmlFor='phone'
                          className='block text-sm font-medium mb-2'
                        >
                          Telefone
                        </label>
                        <input
                          type='text'
                          id='phone'
                          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all'
                    value={companyInfo.phone}
                    onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                          placeholder="(00) 0000-0000"
                  />
                </div>
                <div>
                        <label
                          htmlFor='whatsapp'
                          className='block text-sm font-medium mb-2'
                        >
                          WhatsApp
                        </label>
                        <input
                          type='text'
                          id='whatsapp'
                          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all'
                          value={companyInfo.whatsapp || ''}
                          onChange={(e) => setCompanyInfo({...companyInfo, whatsapp: e.target.value})}
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor='address'
                          className='block text-sm font-medium mb-2'
                        >
                          Endereço
                        </label>
                        <input
                          type='text'
                          id='address'
                          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all'
                    value={companyInfo.address}
                    onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                          placeholder="Rua, número, bairro, cidade - UF"
                  />
                </div>
              </div>

                    <div className="mb-6">
                      <label
                        htmlFor='currency'
                        className='block text-sm font-medium mb-2'
                      >
                        Moeda
                      </label>
                      <select
                        id='currency'
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all'
                        value={paymentSettings.defaultCurrency}
                        onChange={(e) => setPaymentSettings({...paymentSettings, defaultCurrency: e.target.value})}
                      >
                        <option value='BRL'>Real Brasileiro (BRL)</option>
                        <option value='USD'>Dólar Americano (USD)</option>
                        <option value='EUR'>Euro (EUR)</option>
                        <option value='GBP'>Libra Esterlina (GBP)</option>
                      </select>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Redes Sociais</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor='instagram'
                            className='block text-sm font-medium mb-2'
                          >
                            Instagram
                          </label>
                          <div className="flex">
                            <div className="bg-gray-100 flex items-center justify-center px-3 rounded-l-md border border-r-0 border-gray-300">
                              @
                            </div>
                            <input
                              type='text'
                              id='instagram'
                              className='w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all'
                              value={companyInfo.instagram || ''}
                              onChange={(e) => setCompanyInfo({...companyInfo, instagram: e.target.value})}
                              placeholder="seu_instagram"
                />
              </div>
                        </div>
                        <div>
                          <label
                            htmlFor='facebook'
                            className='block text-sm font-medium mb-2'
                          >
                            Facebook
                          </label>
                          <div className="flex">
                            <div className="bg-gray-100 flex items-center justify-center px-3 rounded-l-md border border-r-0 border-gray-300">
                              facebook.com/
                            </div>
                            <input
                              type='text'
                              id='facebook'
                              className='w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all'
                              value={companyInfo.facebook || ''}
                              onChange={(e) => setCompanyInfo({...companyInfo, facebook: e.target.value})}
                              placeholder="sua_pagina"
                />
              </div>
                        </div>
                        <div>
                          <label
                            htmlFor='twitter'
                            className='block text-sm font-medium mb-2'
                          >
                            Twitter
                          </label>
                          <div className="flex">
                            <div className="bg-gray-100 flex items-center justify-center px-3 rounded-l-md border border-r-0 border-gray-300">
                              @
                            </div>
                            <input
                              type='text'
                              id='twitter'
                              className='w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all'
                              value={companyInfo.twitter || ''}
                              onChange={(e) => setCompanyInfo({...companyInfo, twitter: e.target.value})}
                              placeholder="seu_twitter"
                />
              </div>
                        </div>
                        <div>
                          <label
                            htmlFor='tiktok'
                            className='block text-sm font-medium mb-2'
                          >
                            TikTok
                          </label>
                          <div className="flex">
                            <div className="bg-gray-100 flex items-center justify-center px-3 rounded-l-md border border-r-0 border-gray-300">
                              @
                            </div>
                            <input
                              type='text'
                              id='tiktok'
                              className='w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all'
                              value={companyInfo.tiktok || ''}
                              onChange={(e) => setCompanyInfo({...companyInfo, tiktok: e.target.value})}
                              placeholder="seu_tiktok"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6'>
                      <div className='flex items-center'>
                        <label
                          htmlFor='maintenance-mode'
                          className='text-sm font-medium mr-2'
                        >
                          Modo Manutenção
                        </label>
                        <div className='relative inline-block w-12 h-6 rounded-full transition-all duration-200'>
                          <input
                            type='checkbox'
                            id='maintenance-mode'
                            className='opacity-0 w-0 h-0 absolute peer'
                          />
                          <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-all duration-200 before:content-[''] before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all before:duration-200 peer-checked:bg-primary-500 peer-checked:before:translate-x-6"></span>
              </div>
                      </div>

                      <div>
                        <button 
                          className='w-full sm:w-auto px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all'
                          onClick={saveSettings}
                        >
                          Salvar Alterações
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preços e Planos */}
            {activeTab === "precos-planos" && (
              <div className='mb-8'>
                <h2 className='text-xl font-semibold mb-4'>
                  Gestão de Preços e Planos
                </h2>

                <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
                  <div className='p-4 md:p-6'>
                    <div className='mb-4 sm:mb-6'>
                      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2'>
                        <h3 className='text-base font-medium'>
                          Pacotes de Seguidores
                        </h3>
                        <button className='flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium transition-all'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-4 w-4 mr-1'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                          >
                            <path
                              fillRule='evenodd'
                              d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                              clipRule='evenodd'
                            />
                          </svg>
                          Adicionar Pacote
                        </button>
              </div>

                      <div className='overflow-x-auto -mx-4 sm:-mx-6 md:mx-0'>
                        <table className='min-w-full'>
                          <thead>
                            <tr className='border-b border-gray-200'>
                              <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Descrição
                              </th>
                              <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Quantidade
                              </th>
                              <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Preço
                              </th>
                              <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Status
                              </th>
                              <th className='px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Ações
                              </th>
                            </tr>
                          </thead>
                          <tbody className='bg-white divide-y divide-gray-200'>
                            <tr className='hover:bg-gray-50 transition-all'>
                              <td className='px-3 py-4 whitespace-nowrap text-sm'>
                                Pacote Básico - Instagram
                              </td>
                              <td className='px-3 py-4 whitespace-nowrap text-sm'>
                                100 seguidores
                              </td>
                              <td className='px-3 py-4 whitespace-nowrap text-sm'>
                                R$ 9,90
                              </td>
                              <td className='px-3 py-4 whitespace-nowrap'>
                                <span className='px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full'>
                                  Ativo
                                </span>
                              </td>
                              <td className='px-3 py-4 whitespace-nowrap text-right text-sm'>
                                <button className='text-gray-500 hover:text-gray-700 transition-all mr-2'>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-5 w-5'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                  >
                                    <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                                  </svg>
                                </button>
                                <button className='text-gray-500 hover:text-red-600 transition-all'>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-5 w-5'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                  >
                                    <path
                                      fillRule='evenodd'
                                      d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                                      clipRule='evenodd'
                                    />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                            <tr className='hover:bg-gray-50 transition-all'>
                              <td className='px-3 py-4 whitespace-nowrap text-sm'>
                                Pacote Premium - Instagram
                              </td>
                              <td className='px-3 py-4 whitespace-nowrap text-sm'>
                                500 seguidores
                              </td>
                              <td className='px-3 py-4 whitespace-nowrap text-sm'>
                                R$ 39,90
                              </td>
                              <td className='px-3 py-4 whitespace-nowrap'>
                                <span className='px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full'>
                                  Ativo
                                </span>
                              </td>
                              <td className='px-3 py-4 whitespace-nowrap text-right text-sm'>
                                <button className='text-gray-500 hover:text-gray-700 transition-all mr-2'>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-5 w-5'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                  >
                                    <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                                  </svg>
                                </button>
                                <button className='text-gray-500 hover:text-red-600 transition-all'>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-5 w-5'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                  >
                                    <path
                                      fillRule='evenodd'
                                      d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                                      clipRule='evenodd'
                                    />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                            <tr className='hover:bg-gray-50 transition-all'>
                              <td className='px-3 py-4 whitespace-nowrap text-sm'>
                                Pacote VIP - TikTok
                              </td>
                              <td className='px-3 py-4 whitespace-nowrap text-sm'>
                                1000 seguidores
                              </td>
                              <td className='px-3 py-4 whitespace-nowrap text-sm'>
                                R$ 69,90
                              </td>
                              <td className='px-3 py-4 whitespace-nowrap'>
                                <span className='px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full'>
                                  Inativo
                                </span>
                              </td>
                              <td className='px-3 py-4 whitespace-nowrap text-right text-sm'>
                                <button className='text-gray-500 hover:text-gray-700 transition-all mr-2'>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-5 w-5'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                  >
                                    <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                                  </svg>
                                </button>
                                <button className='text-gray-500 hover:text-red-600 transition-all'>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-5 w-5'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                  >
                                    <path
                                      fillRule='evenodd'
                                      d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                                      clipRule='evenodd'
                                    />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
              </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Integrações e API */}
            {activeTab === "integracoes-api" && (
              <div className='mb-8'>
                <h2 className='text-xl font-semibold mb-4'>
                  Integrações e API de Fornecedores
                </h2>
                
                <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
                  <div className='p-4 md:p-6'>
                    <div className='mb-6'>
                      <h3 className='text-lg font-medium mb-4 flex items-center'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5 mr-2 text-primary-600'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                          />
                        </svg>
                        Fornecedor Principal
                      </h3>
                      {renderApiIntegrationSection('fornecedor', 'Seguidores')}
                    </div>
                    
                    <div className='my-6 border-t border-gray-200'></div>
                    
                    <div className='mb-6'>
                      <h3 className='text-lg font-medium mb-4'>Configurações Gerais da API</h3>
                      
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                          <label
                            htmlFor='api-endpoint'
                            className='block text-sm font-medium mb-2'
                          >
                            Endpoint da API
                          </label>
                          <input
                            type='text'
                            id='api-endpoint'
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all'
                            placeholder="https://api.fornecedor.com/v1"
                          />
                          <p className='text-xs text-gray-500 mt-1'>
                            URL base para todas as requisições de API
                          </p>
                  </div>
                        
                  <div>
                          <label
                            htmlFor='webhook-url'
                            className='block text-sm font-medium mb-2'
                          >
                            URL do Webhook
                          </label>
                          <div className='flex items-center'>
                            <input
                              type='text'
                              id='webhook-url'
                              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all'
                              placeholder="https://seu-dominio.com/api/webhook"
                            />
                            <button className='ml-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all'>
                              Testar
                            </button>
                  </div>
                          <p className='text-xs text-gray-500 mt-1'>
                            Receba notificações em tempo real sobre pedidos e entregas
                          </p>
                        </div>
                      </div>
                      
                      <div className='mt-4'>
                        <div className='flex items-center mb-2'>
                          <input
                            type='checkbox'
                            id='auto-refill'
                            className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-all'
                          />
                          <label
                            htmlFor='auto-refill'
                            className='ml-2 block text-sm font-medium'
                          >
                            Ativar reposição automática em caso de queda
                          </label>
                        </div>
                        <div className='flex items-center mb-2'>
                          <input
                            type='checkbox'
                            id='enable-logs'
                            className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-all'
                          />
                          <label
                            htmlFor='enable-logs'
                            className='ml-2 block text-sm font-medium'
                          >
                            Ativar logs detalhados de requisições
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className='my-6 border-t border-gray-200'></div>
                    
                    <div className='mb-6'>
                      <h3 className='text-lg font-medium mb-4'>Monitoramento de Status</h3>
                      
                      <div className='grid grid-cols-1 gap-4'>
                        <div className='p-4 border border-gray-200 rounded-lg bg-green-50'>
                          <div className='flex items-center justify-between mb-2'>
                            <span className='font-medium'>Fornecedor Principal</span>
                            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                              Online
                            </span>
                          </div>
                          <div className='text-sm text-gray-600'>
                            <p>Última verificação: Há 5 minutos</p>
                            <p>Tempo médio de resposta: 240ms</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className='flex justify-end'>
                      <button 
                        className='px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all'
                        onClick={saveSettings}
                      >
                        Salvar Configurações
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "pagamentos" && (
              <div className='mb-8'>
                <h2 className='text-xl font-semibold mb-4'>
                  Configuração de Pagamentos
                </h2>
                
                <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
                  <div className='p-4 md:p-6'>
                    <div className='mb-6'>
                      <h3 className='text-lg font-medium mb-4 flex items-center'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5 mr-2 text-primary-600'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
                          />
                        </svg>
                        Taxas e Comissões
                      </h3>
                      
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                  <div>
                          <label
                            htmlFor='fee-type'
                            className='block text-sm font-medium mb-2'
                          >
                            Tipo de Taxa
                          </label>
                          <select
                            id='fee-type'
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all'
                            value={paymentSettings.feeType || 'percentage'}
                            onChange={(e) => setPaymentSettings({...paymentSettings, feeType: e.target.value})}
                          >
                            <option value='percentage'>Percentual (%)</option>
                            <option value='fixed'>Valor Fixo (R$)</option>
                          </select>
                          <p className='text-xs text-gray-500 mt-1'>
                            Essa taxa será aplicada a todos os pedidos processados
                          </p>
                        </div>
                        
                        <div>
                          <label
                            htmlFor='fee-value'
                            className='block text-sm font-medium mb-2'
                          >
                            {paymentSettings.feeType === 'fixed' ? 'Valor Fixo (R$)' : 'Percentual (%)'}
                          </label>
                          <input
                            type='number'
                            step={paymentSettings.feeType === 'fixed' ? '0.01' : '0.1'}
                            min='0'
                            id='fee-value'
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all'
                            value={paymentSettings.feeType === 'fixed' ? (paymentSettings.fixedFee || '2.50') : (paymentSettings.taxPercentage || '5')}
                            onChange={(e) => {
                              if (paymentSettings.feeType === 'fixed') {
                                setPaymentSettings({...paymentSettings, fixedFee: parseFloat(e.target.value)});
                              } else {
                                setPaymentSettings({...paymentSettings, taxPercentage: parseFloat(e.target.value)});
                              }
                            }}
                          />
                          <p className='text-xs text-gray-500 mt-1'>
                            {paymentSettings.feeType === 'fixed' 
                              ? 'Taxa fixa em reais aplicada a cada pedido' 
                              : 'Percentual sobre o valor total do pedido'}
                          </p>
                  </div>
                      </div>
                      
                      <div className='mb-4 mt-6'>
                        <div className='flex items-center justify-between mb-2'>
                          <h4 className='text-sm font-medium'>Simulação de Valores</h4>
                        </div>
                        <div className='p-3 bg-gray-50 rounded-md'>
                          <div className='flex justify-between mb-2'>
                            <span className='text-sm text-gray-600'>Valor do Pedido:</span>
                            <span className='text-sm font-medium'>R$ 100,00</span>
                          </div>
                          <div className='flex justify-between mb-2'>
                            <span className='text-sm text-gray-600'>Taxa Aplicada:</span>
                            <span className='text-sm font-medium'>
                              {paymentSettings.feeType === 'fixed' 
                                ? `R$ ${paymentSettings.fixedFee?.toFixed(2) || '2.50'}` 
                                : `${paymentSettings.taxPercentage || 5}% (R$ ${((paymentSettings.taxPercentage || 5) / 100 * 100).toFixed(2)})`}
                            </span>
                          </div>
                          <div className='flex justify-between pt-2 border-t border-gray-200'>
                            <span className='text-sm font-medium'>Valor Final para o Cliente:</span>
                            <span className='text-sm font-medium'>
                              {paymentSettings.feeType === 'fixed' 
                                ? `R$ ${(100 + (paymentSettings.fixedFee || 2.50)).toFixed(2)}` 
                                : `R$ ${(100 * (1 + (paymentSettings.taxPercentage || 5) / 100)).toFixed(2)}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className='my-6 border-t border-gray-200'></div>
                    
                    <div className='mb-6'>
                      <h3 className='text-lg font-medium mb-4 flex items-center'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5 mr-2 text-blue-600'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
                          />
                        </svg>
                        Mercado Pago
                      </h3>
                      
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                  <div>
                          <label
                            htmlFor='mp-public-key'
                            className='block text-sm font-medium mb-2'
                          >
                            Chave Pública
                          </label>
                          <input
                            type='text'
                            id='mp-public-key'
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all'
                            value={paymentSettings.mercadoPagoPublicKey}
                            onChange={(e) => setPaymentSettings({...paymentSettings, mercadoPagoPublicKey: e.target.value})}
                            placeholder="TEST-a1b2c3d4-5e6f-7g8h-9i0j-1k2l3m4n5o6p"
                    />
                  </div>
                  <div>
                          <label
                            htmlFor='mp-access-token'
                            className='block text-sm font-medium mb-2'
                          >
                            Token de Acesso
                          </label>
                          <input
                            type='password'
                            id='mp-access-token'
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all'
                            value={paymentSettings.mercadoPagoAccessToken}
                            onChange={(e) => setPaymentSettings({...paymentSettings, mercadoPagoAccessToken: e.target.value})}
                            placeholder="TEST-0123456789abcdef0123456789abcdef-012345678"
                    />
                  </div>
                      </div>
                      
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                        <div>
                          <label
                            htmlFor='mp-client-id'
                            className='block text-sm font-medium mb-2'
                          >
                            Client ID
                          </label>
                          <input
                            type='text'
                            id='mp-client-id'
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all'
                            value={paymentSettings.mercadoPagoClientId}
                            onChange={(e) => setPaymentSettings({...paymentSettings, mercadoPagoClientId: e.target.value})}
                            placeholder="1234567890"
                          />
                  </div>
                        <div>
                          <label
                            htmlFor='mp-client-secret'
                            className='block text-sm font-medium mb-2'
                          >
                            Client Secret
                          </label>
                          <input
                            type='password'
                            id='mp-client-secret'
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all'
                            value={paymentSettings.mercadoPagoClientSecret}
                            onChange={(e) => setPaymentSettings({...paymentSettings, mercadoPagoClientSecret: e.target.value})}
                            placeholder="abcdefghijklmnopqrstuvwxyz0123456789"
                          />
                </div>
                </div>
                      
                      <div className='mt-4 flex justify-end'>
                        <button 
                          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all'
                          onClick={handleSavePaymentSettings}
                        >
                          Testar Conexão
                        </button>
                </div>
              </div>
                    
                    <div className='flex justify-end mt-6'>
                      <button 
                        className='px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all'
                        onClick={handleSavePaymentSettings}
                      >
                        Salvar Configurações de Pagamento
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "seguranca" && (
              <div className='mb-8'>
                <h2 className='text-xl font-semibold mb-4'>Configurações de Segurança</h2>
                
                <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
                  <div className='p-4 md:p-6'>
                    {/* Autenticação */}
                    <div className='mb-6'>
                      <h3 className='text-lg font-medium mb-4 flex items-center'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5 mr-2 text-primary-600'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                          />
                        </svg>
                        Autenticação
                  </h3>
                  
                      <div className='space-y-4'>
                        <div className='flex items-center justify-between p-3 border border-gray-200 rounded-md'>
                    <div>
                            <h4 className='text-sm font-medium'>Autenticação de Dois Fatores (2FA)</h4>
                            <p className='text-xs text-gray-500 mt-1'>
                              Adicione uma camada extra de segurança exigindo uma segunda forma de autenticação.
                            </p>
                          </div>
                          <div className='flex items-center'>
                            <div className='relative inline-block w-12 h-6 rounded-full transition-all duration-200'>
                              <input
                                type='checkbox'
                                id='two-factor-auth'
                                checked={securitySettings.twoFactorAuth}
                                onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
                                className='opacity-0 w-0 h-0 absolute peer'
                              />
                              <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-all duration-200 before:content-[''] before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all before:duration-200 peer-checked:bg-primary-500 peer-checked:before:translate-x-6"></span>
                            </div>
                          </div>
                    </div>
                    
                        {securitySettings.twoFactorAuth && (
                          <div className='p-3 bg-gray-50 border border-gray-200 rounded-md ml-6'>
                            <div className='space-y-3'>
                    <div>
                                <label className='text-sm font-medium'>Método de Verificação</label>
                                <div className='mt-2 space-y-2'>
                                  <div className='flex items-center'>
                                    <input 
                                      type='radio' 
                                      id='verification-sms' 
                                      name='verification-method' 
                                      className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300'
                                      defaultChecked
                                    />
                                    <label htmlFor='verification-sms' className='ml-2 text-sm text-gray-700'>
                                      SMS
                                    </label>
                                  </div>
                                  <div className='flex items-center'>
                                    <input 
                                      type='radio' 
                                      id='verification-email' 
                                      name='verification-method' 
                                      className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300'
                                    />
                                    <label htmlFor='verification-email' className='ml-2 text-sm text-gray-700'>
                                      E-mail
                                    </label>
                                  </div>
                                  <div className='flex items-center'>
                                    <input 
                                      type='radio' 
                                      id='verification-app' 
                                      name='verification-method' 
                                      className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300'
                                    />
                                    <label htmlFor='verification-app' className='ml-2 text-sm text-gray-700'>
                                      Aplicativo Autenticador
                                    </label>
                                  </div>
                                </div>
                    </div>
                    
                              <button className='px-3 py-1.5 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all'>
                                Configurar
                              </button>
                            </div>
                          </div>
                        )}
                        
                        <div className='flex items-center justify-between p-3 border border-gray-200 rounded-md'>
                    <div>
                            <h4 className='text-sm font-medium'>Notificações de Login</h4>
                            <p className='text-xs text-gray-500 mt-1'>
                              Receba alertas quando sua conta for acessada de um novo dispositivo ou localização.
                            </p>
                          </div>
                          <div className='flex items-center'>
                            <div className='relative inline-block w-12 h-6 rounded-full transition-all duration-200'>
                              <input
                                type='checkbox'
                                id='login-notifications'
                                checked={securitySettings.loginNotifications}
                                onChange={(e) => setSecuritySettings({...securitySettings, loginNotifications: e.target.checked})}
                                className='opacity-0 w-0 h-0 absolute peer'
                              />
                              <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-all duration-200 before:content-[''] before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all before:duration-200 peer-checked:bg-primary-500 peer-checked:before:translate-x-6"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className='my-6 border-t border-gray-200'></div>
                    
                    {/* Proteção contra Fraudes */}
                    <div className='mb-6'>
                      <h3 className='text-lg font-medium mb-4 flex items-center'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5 mr-2 text-red-600'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                          />
                        </svg>
                        Proteção contra Fraudes
                      </h3>
                      
                      <div className='space-y-4'>
                        <div className='flex items-center justify-between p-3 border border-gray-200 rounded-md'>
                    <div>
                            <h4 className='text-sm font-medium'>Detecção de Atividades Suspeitas</h4>
                            <p className='text-xs text-gray-500 mt-1'>
                              Detecta e bloqueia automaticamente comportamentos anormais ou potencialmente fraudulentos.
                            </p>
                          </div>
                          <div className='flex items-center'>
                            <div className='relative inline-block w-12 h-6 rounded-full transition-all duration-200'>
                              <input
                                type='checkbox'
                                id='suspicious-activity'
                                defaultChecked
                                className='opacity-0 w-0 h-0 absolute peer'
                              />
                              <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-all duration-200 before:content-[''] before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all before:duration-200 peer-checked:bg-primary-500 peer-checked:before:translate-x-6"></span>
                            </div>
                          </div>
                    </div>
                    
                        <div className='flex items-center justify-between p-3 border border-gray-200 rounded-md'>
                          <div>
                            <h4 className='text-sm font-medium'>Limites de Transação</h4>
                            <p className='text-xs text-gray-500 mt-1'>
                              Define limites para transações diárias para proteger contra atividades não autorizadas.
                            </p>
                          </div>
                          <div className='flex items-center'>
                            <select
                              className='ml-2 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm'
                              defaultValue='medium'
                            >
                              <option value='low'>Baixo (R$ 1.000)</option>
                              <option value='medium'>Médio (R$ 5.000)</option>
                              <option value='high'>Alto (R$ 10.000)</option>
                              <option value='custom'>Personalizado</option>
                            </select>
                    </div>
                  </div>
                  
                        <div className='flex items-center justify-between p-3 border border-gray-200 rounded-md'>
                          <div>
                            <h4 className='text-sm font-medium'>Lista de IPs Permitidos</h4>
                            <p className='text-xs text-gray-500 mt-1'>
                              Restringe o acesso administrativo a endereços IP específicos.
                            </p>
                  </div>
                          <div className='flex items-center'>
                            <div className='relative inline-block w-12 h-6 rounded-full transition-all duration-200'>
                              <input
                                type='checkbox'
                                id='ip-whitelist'
                                checked={securitySettings.ipWhitelist}
                                onChange={(e) => setSecuritySettings({...securitySettings, ipWhitelist: e.target.checked})}
                                className='opacity-0 w-0 h-0 absolute peer'
                              />
                              <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-all duration-200 before:content-[''] before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all before:duration-200 peer-checked:bg-primary-500 peer-checked:before:translate-x-6"></span>
                </div>
              </div>
                        </div>
                        
                        {securitySettings.ipWhitelist && (
                          <div className='p-3 bg-gray-50 border border-gray-200 rounded-md ml-6'>
                            <div className='space-y-3'>
                              <div>
                                <label htmlFor='ip-addresses' className='text-sm font-medium'>Endereços IP (um por linha)</label>
                                <textarea
                                  id='ip-addresses'
                                  className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm'
                                  rows={3}
                                  placeholder='192.168.1.1&#10;10.0.0.1'
                                ></textarea>
                              </div>
                              
                              <div className='flex justify-end'>
                                <button className='px-3 py-1.5 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all'>
                                  Salvar Lista
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className='my-6 border-t border-gray-200'></div>
                    
                    {/* Senhas e Acesso */}
                    <div className='mb-6'>
                      <h3 className='text-lg font-medium mb-4 flex items-center'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5 mr-2 text-blue-600'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z'
                          />
                        </svg>
                        Senhas e Acesso
                      </h3>
                      
                      <div className='space-y-4'>
                        <div className='p-3 border border-gray-200 rounded-md'>
                          <h4 className='text-sm font-medium mb-2'>Política de Senhas</h4>
                          
                          <div className='space-y-2'>
                            <div className='flex items-center'>
                              <input
                                type='checkbox'
                                id='require-uppercase'
                                defaultChecked
                                className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-all'
                              />
                              <label htmlFor='require-uppercase' className='ml-2 text-sm text-gray-700'>
                                Exigir letra maiúscula
                              </label>
                            </div>
                            
                            <div className='flex items-center'>
                              <input
                                type='checkbox'
                                id='require-number'
                                defaultChecked
                                className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-all'
                              />
                              <label htmlFor='require-number' className='ml-2 text-sm text-gray-700'>
                                Exigir número
                              </label>
                            </div>
                            
                            <div className='flex items-center'>
                              <input
                                type='checkbox'
                                id='require-special'
                                defaultChecked
                                className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-all'
                              />
                              <label htmlFor='require-special' className='ml-2 text-sm text-gray-700'>
                                Exigir caractere especial
                              </label>
                            </div>
                            
                            <div className='flex items-center mt-3'>
                              <label htmlFor='min-length' className='text-sm text-gray-700 mr-3'>
                                Tamanho mínimo:
                              </label>
                              <select
                                id='min-length'
                                className='px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm'
                                defaultValue='8'
                              >
                                <option value='6'>6 caracteres</option>
                                <option value='8'>8 caracteres</option>
                                <option value='10'>10 caracteres</option>
                                <option value='12'>12 caracteres</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        <div className='flex items-center justify-between p-3 border border-gray-200 rounded-md'>
              <div>
                            <h4 className='text-sm font-medium'>Expiração de Senha</h4>
                            <p className='text-xs text-gray-500 mt-1'>
                              Força a alteração de senhas periodicamente.
                            </p>
                          </div>
                          <div className='flex items-center'>
                            <select
                              className='ml-2 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm'
                              defaultValue='90d'
                            >
                              <option value='never'>Nunca</option>
                              <option value='30d'>30 dias</option>
                              <option value='60d'>60 dias</option>
                              <option value='90d'>90 dias</option>
                              <option value='180d'>180 dias</option>
                            </select>
              </div>
                        </div>
                        
                        <div className='p-3 border border-gray-200 rounded-md'>
                          <h4 className='text-sm font-medium mb-2'>Alterar Senha de Administrador</h4>
                          
                          <div className='space-y-3'>
              <div>
                              <label htmlFor='current-password' className='block text-sm font-medium mb-1'>
                                Senha Atual
                              </label>
                              <input
                                type='password'
                                id='current-password'
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm'
                                placeholder='••••••••'
                              />
                </div>
                            
                            <div>
                              <label htmlFor='new-password' className='block text-sm font-medium mb-1'>
                                Nova Senha
                              </label>
                              <input
                                type='password'
                                id='new-password'
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm'
                                placeholder='••••••••'
                              />
              </div>
                            
                            <div>
                              <label htmlFor='confirm-password' className='block text-sm font-medium mb-1'>
                                Confirmar Nova Senha
                              </label>
                              <input
                                type='password'
                                id='confirm-password'
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm'
                                placeholder='••••••••'
                              />
                            </div>
                            
                            <div className='pt-2'>
                              <button className='px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all text-sm'>
                                Alterar Senha
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className='flex justify-end mt-6'>
                      <button 
                        className='px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all'
                        onClick={saveSettings}
                      >
                        Salvar Configurações de Segurança
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingBag,
  Download,
  BarChart2,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Info,
  RefreshCcw,
  Bell
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Dados de exemplo para os gráficos
const salesData = [
  { name: "Jan", Instagram: 4000, Facebook: 2400, YouTube: 1200, TikTok: 800 },
  { name: "Fev", Instagram: 3000, Facebook: 1398, YouTube: 2200, TikTok: 900 },
  { name: "Mar", Instagram: 2000, Facebook: 9800, YouTube: 2290, TikTok: 1000 },
  { name: "Abr", Instagram: 2780, Facebook: 3908, YouTube: 1390, TikTok: 1200 },
  { name: "Mai", Instagram: 1890, Facebook: 4800, YouTube: 2490, TikTok: 1100 },
  { name: "Jun", Instagram: 2390, Facebook: 3800, YouTube: 3490, TikTok: 1700 },
  { name: "Jul", Instagram: 3490, Facebook: 4300, YouTube: 3000, TikTok: 2100 },
];

const platformDistribution = [
  { name: "Instagram", value: 400 },
  { name: "Facebook", value: 300 },
  { name: "YouTube", value: 200 },
  { name: "TikTok", value: 100 },
];

const serviceDistribution = [
  { name: "Seguidores", value: 400 },
  { name: "Curtidas", value: 300 },
  { name: "Visualizações", value: 300 },
  { name: "Inscritos", value: 200 },
];

const COLORS = {
  Instagram: "#E1306C",
  Facebook: "#1877F2", 
  YouTube: "#FF0000", 
  TikTok: "#000000",
  Seguidores: "#8884d8",
  Curtidas: "#82ca9d",
  Visualizações: "#ffc658",
  Inscritos: "#ff8042"
};

// Dados de tendência diária
const dailyTrendData = [
  { name: "1", value: 400 },
  { name: "2", value: 300 },
  { name: "3", value: 200 },
  { name: "4", value: 278 },
  { name: "5", value: 189 },
  { name: "6", value: 239 },
  { name: "7", value: 349 },
];

const Analytics = () => {
  const [timePeriod, setTimePeriod] = useState("7dias");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedService, setSelectedService] = useState("");

  // Função para exportar relatório
  const exportReport = () => {
    console.log("Exportando relatório de analytics");
  };

  // Dados específicos por plataforma
  const platformDetails = {
    Instagram: {
      followers: 1500000,
      growth: 12.5,
      engagement: 4.8,
      avgOrderValue: 85.5,
      topServices: ["Seguidores", "Curtidas", "Stories Views"],
      trend: [1200, 1450, 1560, 1490, 1580, 1620, 1500],
      color: COLORS.Instagram,
    },
    Facebook: {
      followers: 950000,
      growth: 5.2,
      engagement: 2.9,
      avgOrderValue: 72.8,
      topServices: ["Curtidas", "Compartilhamentos", "Comentários"],
      trend: [850, 890, 920, 980, 930, 980, 950],
      color: COLORS.Facebook,
    },
    YouTube: {
      followers: 620000,
      growth: 18.7,
      engagement: 6.3,
      avgOrderValue: 115.2,
      topServices: ["Inscritos", "Visualizações", "Comentários"],
      trend: [540, 580, 610, 650, 680, 710, 620],
      color: COLORS.YouTube,
    },
    TikTok: {
      followers: 2200000,
      growth: 24.1,
      engagement: 7.5,
      avgOrderValue: 65.3,
      topServices: ["Seguidores", "Curtidas", "Compartilhamentos"],
      trend: [1800, 1950, 2050, 2150, 2180, 2240, 2200],
      color: COLORS.TikTok,
    }
  };

  // Dados específicos por serviço
  const serviceDetails = {
    Seguidores: {
      totalSales: 248500,
      growth: 18.7,
      avgPrice: 97.5,
      platforms: [
        { name: "Instagram", value: 45 },
        { name: "TikTok", value: 30 },
        { name: "Facebook", value: 15 },
        { name: "YouTube", value: 10 }
      ],
      trend: [18500, 19200, 20100, 20800, 21500, 22300, 23200],
      color: COLORS.Seguidores,
    },
    Curtidas: {
      totalSales: 175800,
      growth: 12.3,
      avgPrice: 65.2,
      platforms: [
        { name: "Instagram", value: 50 },
        { name: "Facebook", value: 25 },
        { name: "TikTok", value: 20 },
        { name: "YouTube", value: 5 }
      ],
      trend: [14200, 14800, 15300, 15900, 16400, 17000, 17500],
      color: COLORS.Curtidas,
    },
    Visualizações: {
      totalSales: 152600,
      growth: 24.5,
      avgPrice: 45.8,
      platforms: [
        { name: "YouTube", value: 60 },
        { name: "TikTok", value: 25 },
        { name: "Instagram", value: 10 },
        { name: "Facebook", value: 5 }
      ],
      trend: [11800, 12500, 13200, 13800, 14500, 15100, 15800],
      color: COLORS.Visualizações,
    },
    Inscritos: {
      totalSales: 98400,
      growth: 15.8,
      avgPrice: 120.3,
      platforms: [
        { name: "YouTube", value: 75 },
        { name: "TikTok", value: 15 },
        { name: "Instagram", value: 5 },
        { name: "Facebook", value: 5 }
      ],
      trend: [8100, 8500, 8900, 9300, 9700, 10100, 10500],
      color: COLORS.Inscritos,
    }
  };

  // Formatar número com separador de milhares
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Selecionar uma plataforma para visualização detalhada
  const handleSelectPlatform = (platform) => {
    setSelectedPlatform(platform);
    setActiveTab("platforms");
  };

  // Resetar seleção de plataforma
  const resetPlatformSelection = () => {
    setSelectedPlatform("");
  };

  // Selecionar um serviço para visualização detalhada
  const handleSelectService = (service) => {
    setSelectedService(service);
    setActiveTab("services");
  };

  // Resetar seleção de serviço
  const resetServiceSelection = () => {
    setSelectedService("");
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho com Visual Aprimorado */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6 shadow-sm border border-primary-100">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-primary-800">
              <BarChart2 className="h-6 w-6" />
              Analytics
            </h1>
            <p className="text-primary-700 mt-1 text-sm">Análise detalhada de desempenho e vendas</p>
        </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="bg-white shadow-sm border-primary-200 py-1.5 px-3 flex items-center gap-1.5">
              <RefreshCcw className="h-3.5 w-3.5 text-primary-600" />
              <span className="text-xs font-medium">Atualizado: 5 min atrás</span>
            </Badge>
          <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-[180px] bg-white border-primary-200 shadow-sm">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7dias">Últimos 7 dias</SelectItem>
              <SelectItem value="30dias">Últimos 30 dias</SelectItem>
              <SelectItem value="90dias">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white border-primary-200 shadow-sm">
                  <Filter className="mr-2 h-4 w-4 text-primary-600" />
                  Filtros
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Opções de Filtro</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>Por Plataforma</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Por Serviço</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Por Região</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>Limpar Filtros</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="bg-primary-600 hover:bg-primary-700 shadow-md" onClick={exportReport}>
            <Download className="mr-2 h-4 w-4" />
              Exportar
          </Button>
          </div>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800">
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="platforms" className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800">
            Plataformas
          </TabsTrigger>
          <TabsTrigger value="services" className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800">
            Serviços
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Cartões de Métricas com Design Aprimorado */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <div className="absolute top-0 right-0 h-1 w-full bg-primary-500"></div>
              <CardContent className="p-6 pt-7">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2.5 rounded-lg bg-primary-50">
                    <DollarSign className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-500 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>12%</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mt-1">R$ 42.580,50</h3>
                <p className="text-sm font-medium text-gray-500 mt-1">
                  Receita Total
                </p>
                <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </CardContent>
        </Card>

            <Card className="rounded-xl overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <div className="absolute top-0 right-0 h-1 w-full bg-blue-500"></div>
              <CardContent className="p-6 pt-7">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2.5 rounded-lg bg-blue-50">
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-500 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>8%</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mt-1">342</h3>
                <p className="text-sm font-medium text-gray-500 mt-1">
                  Total de Pedidos
                </p>
                <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </CardContent>
        </Card>

            <Card className="rounded-xl overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <div className="absolute top-0 right-0 h-1 w-full bg-green-500"></div>
              <CardContent className="p-6 pt-7">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2.5 rounded-lg bg-green-50">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-500 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>15%</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mt-1">128</h3>
                <p className="text-sm font-medium text-gray-500 mt-1">
                  Novos Clientes
                </p>
                <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '55%' }}></div>
            </div>
          </CardContent>
        </Card>

            <Card className="rounded-xl overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <div className="absolute top-0 right-0 h-1 w-full bg-purple-500"></div>
              <CardContent className="p-6 pt-7">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2.5 rounded-lg bg-purple-50">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-500 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>5%</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mt-1">3.2%</h3>
                <p className="text-sm font-medium text-gray-500 mt-1">
                  Taxa de Conversão
                </p>
                <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '32%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

          {/* Seção de Gráficos com Visual Aprimorado */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Gráfico Principal - Vendas por Plataforma */}
            <Card className="rounded-xl overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow xl:col-span-2">
              <CardHeader className="border-b border-gray-100 bg-gray-50/50 flex flex-row items-center justify-between p-5">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-primary-600" />
                    Vendas por Plataforma
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Comparação de desempenho entre plataformas ao longo do tempo
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-primary-600 hover:bg-primary-50">
                  <Info className="h-4 w-4" />
                </Button>
          </CardHeader>
              <CardContent className="p-5 pt-6">
                <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
                  <div className="flex space-x-4">
                    <Badge variant="outline" className="bg-gray-50 border-gray-200 px-3 py-1 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#E1306C]"></div>
                      <span className="text-xs">Instagram</span>
                    </Badge>
                    <Badge variant="outline" className="bg-gray-50 border-gray-200 px-3 py-1 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#1877F2]"></div>
                      <span className="text-xs">Facebook</span>
                    </Badge>
                    <Badge variant="outline" className="bg-gray-50 border-gray-200 px-3 py-1 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#FF0000]"></div>
                      <span className="text-xs">YouTube</span>
                    </Badge>
                    <Badge variant="outline" className="bg-gray-50 border-gray-200 px-3 py-1 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#000000]"></div>
                      <span className="text-xs">TikTok</span>
                    </Badge>
                  </div>
                  <Select defaultValue="bar">
                    <SelectTrigger className="w-[120px] bg-white border-gray-200 shadow-sm">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Barras</SelectItem>
                      <SelectItem value="line">Linhas</SelectItem>
                      <SelectItem value="area">Área</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#888" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#888" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #f0f0f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: 20 }} />
                    <Bar 
                      dataKey="Instagram"
                      fill={COLORS.Instagram}
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                      onClick={(data) => handleSelectPlatform("Instagram")}
                      className="cursor-pointer"
                    />
                    <Bar 
                      dataKey="Facebook" 
                      fill={COLORS.Facebook}
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                      onClick={(data) => handleSelectPlatform("Facebook")}
                      className="cursor-pointer"
                    />
                    <Bar 
                      dataKey="YouTube" 
                      fill={COLORS.YouTube}
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                      onClick={(data) => handleSelectPlatform("YouTube")}
                      className="cursor-pointer"
                    />
                    <Bar 
                      dataKey="TikTok" 
                      fill={COLORS.TikTok}
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                      onClick={(data) => handleSelectPlatform("TikTok")}
                      className="cursor-pointer"
                    />
              </BarChart>
            </ResponsiveContainer>
                <div className="text-center mt-2 text-sm text-gray-500">
                  Clique em uma barra para ver detalhes da plataforma
                </div>
          </CardContent>
        </Card>

        {/* Distribuição de Plataformas */}
            <Card className="rounded-xl overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="border-b border-gray-100 bg-gray-50/50 flex flex-row items-center justify-between p-5">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-blue-600" />
                    Distribuição de Plataformas
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Participação de mercado por plataforma
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600 hover:bg-blue-50">
                  <Info className="h-4 w-4" />
                </Button>
          </CardHeader>
              <CardContent className="p-5">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                      outerRadius={90}
                      innerRadius={40}
                      paddingAngle={2}
                  fill="#8884d8"
                  dataKey="value"
                      onClick={(data) => handleSelectPlatform(data.name)}
                >
                  {platformDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.name]} 
                          stroke="white"
                          strokeWidth={2}
                          className="cursor-pointer"
                    />
                  ))}
                </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #f0f0f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right" 
                      iconType="circle"
                      iconSize={10}
                      onClick={(data) => handleSelectPlatform(data.value)}
                      className="cursor-pointer"
                />
              </PieChart>
            </ResponsiveContainer>
                <div className="text-center mt-2 text-sm text-gray-500">
                  Clique em uma plataforma para ver detalhes
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de Área - Tendência de Crescimento */}
            <Card className="rounded-xl overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow xl:col-span-2">
              <CardHeader className="border-b border-gray-100 bg-gray-50/50 flex flex-row items-center justify-between p-5">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Tendência de Crescimento
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Evolução das vendas nos últimos meses
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-green-600 hover:bg-green-50">
                  <Info className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-5 pt-6">
                <div className="flex justify-between items-center mb-5">
                  <div className="space-x-3">
                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">Este mês</Badge>
                    <Badge variant="outline" className="bg-transparent text-gray-600 border-gray-200 hover:bg-gray-50">Mês passado</Badge>
                  </div>
                  <Select defaultValue="receita">
                    <SelectTrigger className="w-[140px] bg-white border-gray-200 shadow-sm">
                      <SelectValue placeholder="Métrica" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receita">Receita</SelectItem>
                      <SelectItem value="pedidos">Pedidos</SelectItem>
                      <SelectItem value="clientes">Clientes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                    <defs>
                      <linearGradient id="colorInstagram" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.Instagram} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={COLORS.Instagram} stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorFacebook" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.Facebook} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={COLORS.Facebook} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#888" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#888" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #f0f0f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: 20 }} />
                    <Area 
                      type="monotone" 
                      dataKey="Instagram" 
                      stroke={COLORS.Instagram}
                      fillOpacity={1}
                      fill="url(#colorInstagram)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Facebook" 
                      stroke={COLORS.Facebook}
                      fillOpacity={1}
                      fill="url(#colorFacebook)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Serviços */}
            <Card className="rounded-xl overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="border-b border-gray-100 bg-gray-50/50 flex flex-row items-center justify-between p-5">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-purple-600" />
                    Distribuição de Serviços
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Tipos de serviços mais vendidos
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-purple-600 hover:bg-purple-50">
                  <Info className="h-4 w-4" />
                </Button>
          </CardHeader>
              <CardContent className="p-5">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                      outerRadius={90}
                      innerRadius={40}
                      paddingAngle={2}
                  fill="#8884d8"
                  dataKey="value"
                      onClick={(data) => handleSelectService(data.name)}
                >
                  {serviceDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.name]} 
                          stroke="white"
                          strokeWidth={2}
                          className="cursor-pointer"
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #f0f0f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      iconType="circle"
                      iconSize={10}
                      onClick={(data) => handleSelectService(data.value)}
                      className="cursor-pointer"
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-2 text-sm text-gray-500">
                  Clique em um serviço para ver detalhes
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          {selectedPlatform ? (
            <>
              {/* Cabeçalho da plataforma selecionada */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center" 
                    style={{ backgroundColor: platformDetails[selectedPlatform].color }}
                  >
                    <span className="text-white font-bold text-lg">{selectedPlatform.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedPlatform}</h2>
                    <p className="text-sm text-gray-500">Análise detalhada de desempenho</p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  className="text-gray-600"
                  onClick={resetPlatformSelection}
                >
                  Voltar para visão geral
                </Button>
              </div>

              {/* Métricas principais da plataforma */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <Card className="rounded-xl overflow-hidden border-none shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="w-5 h-5 text-gray-500" />
                      <h3 className="text-sm font-medium text-gray-500">Seguidores</h3>
                    </div>
                    <p className="text-2xl font-bold">{formatNumber(platformDetails[selectedPlatform].followers)}</p>
                    <div className="flex items-center gap-1 mt-2 text-green-500 text-xs">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>{platformDetails[selectedPlatform].growth}% crescimento</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl overflow-hidden border-none shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="w-5 h-5 text-gray-500" />
                      <h3 className="text-sm font-medium text-gray-500">Taxa de Engajamento</h3>
                    </div>
                    <p className="text-2xl font-bold">{platformDetails[selectedPlatform].engagement}%</p>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3">
                      <div 
                        className="h-full rounded-full" 
                        style={{ 
                          backgroundColor: platformDetails[selectedPlatform].color,
                          width: `${platformDetails[selectedPlatform].engagement * 10}%`
                        }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl overflow-hidden border-none shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <DollarSign className="w-5 h-5 text-gray-500" />
                      <h3 className="text-sm font-medium text-gray-500">Valor Médio do Pedido</h3>
                    </div>
                    <p className="text-2xl font-bold">R$ {platformDetails[selectedPlatform].avgOrderValue.toFixed(2).replace('.', ',')}</p>
                    <div className="flex gap-2 mt-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1 flex-1 rounded-full ${i < 4 ? 'bg-green-500' : 'bg-gray-200'}`}
                        ></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl overflow-hidden border-none shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <ShoppingBag className="w-5 h-5 text-gray-500" />
                      <h3 className="text-sm font-medium text-gray-500">Serviços Mais Vendidos</h3>
                    </div>
                    <ul className="space-y-2">
                      {platformDetails[selectedPlatform].topServices.map((service, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: platformDetails[selectedPlatform].color }}
                          ></div>
                          <span className="text-sm">{service}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Gráfico de tendência */}
              <Card className="rounded-xl overflow-hidden border-none shadow-md">
                <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                  <CardTitle>Tendência de Crescimento - {selectedPlatform}</CardTitle>
                  <CardDescription>
                    Evolução nos últimos 7 dias
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart 
                      data={platformDetails[selectedPlatform].trend.map((value, index) => ({ 
                        day: index + 1, 
                        value 
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="day" 
                        stroke="#888"
                        tickFormatter={(value) => `Dia ${value}`}
                      />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #f0f0f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        formatter={(value) => [`${formatNumber(value)}`, 'Seguidores']}
                        labelFormatter={(value) => `Dia ${value}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={platformDetails[selectedPlatform].color}
                        strokeWidth={3}
                        dot={{ 
                          r: 6, 
                          fill: platformDetails[selectedPlatform].color, 
                          strokeWidth: 2,
                          stroke: "white"
                        }}
                        activeDot={{ 
                          r: 8, 
                          stroke: platformDetails[selectedPlatform].color,
                          strokeWidth: 2,
                          fill: "white"
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="rounded-xl overflow-hidden border-none shadow-md">
              <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                <CardTitle>Análise de Plataformas</CardTitle>
                <CardDescription>
                  Selecione uma plataforma para visualizar estatísticas detalhadas
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {Object.keys(platformDetails).map((platform) => (
                    <div 
                      key={platform}
                      className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleSelectPlatform(platform)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center" 
                          style={{ backgroundColor: COLORS[platform] }}
                        >
                          <span className="text-white font-bold">{platform.charAt(0)}</span>
                        </div>
                        <h3 className="font-semibold">{platform}</h3>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500">Seguidores</span>
                        <span className="font-medium">{formatNumber(platformDetails[platform].followers)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500">Crescimento</span>
                        <span className="font-medium text-green-500">+{platformDetails[platform].growth}%</span>
                      </div>
                      <div className="mt-4">
                        <Button 
                          variant="outline" 
                          className="w-full text-xs" 
                          size="sm"
                        >
                          Ver detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          {selectedService ? (
            <>
              {/* Cabeçalho do serviço selecionado */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center" 
                    style={{ backgroundColor: serviceDetails[selectedService].color }}
                  >
                    <span className="text-white font-bold text-lg">{selectedService.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedService}</h2>
                    <p className="text-sm text-gray-500">Análise detalhada de desempenho</p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  className="text-gray-600"
                  onClick={resetServiceSelection}
                >
                  Voltar para visão geral
                </Button>
              </div>

              {/* Métricas principais do serviço */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Card className="rounded-xl overflow-hidden border-none shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <DollarSign className="w-5 h-5 text-gray-500" />
                      <h3 className="text-sm font-medium text-gray-500">Total de Vendas</h3>
                    </div>
                    <p className="text-2xl font-bold">R$ {formatNumber(serviceDetails[selectedService].totalSales.toFixed(2))}</p>
                    <div className="flex items-center gap-1 mt-2 text-green-500 text-xs">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>{serviceDetails[selectedService].growth}% crescimento</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl overflow-hidden border-none shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="w-5 h-5 text-gray-500" />
                      <h3 className="text-sm font-medium text-gray-500">Crescimento</h3>
                    </div>
                    <p className="text-2xl font-bold">{serviceDetails[selectedService].growth}%</p>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3">
                      <div 
                        className="h-full rounded-full bg-green-500" 
                        style={{ width: `${Math.min(serviceDetails[selectedService].growth * 4, 100)}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl overflow-hidden border-none shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <ShoppingBag className="w-5 h-5 text-gray-500" />
                      <h3 className="text-sm font-medium text-gray-500">Preço Médio</h3>
                    </div>
                    <p className="text-2xl font-bold">R$ {serviceDetails[selectedService].avgPrice.toFixed(2).replace('.', ',')}</p>
                    <div className="flex items-center gap-1 mt-2 text-gray-500 text-xs">
                      <span>Por pacote de serviço</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Distribuição por plataforma */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-xl overflow-hidden border-none shadow-md">
                  <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <PieChartIcon className="w-5 h-5 text-blue-600" />
                      Distribuição por Plataforma
                    </CardTitle>
                    <CardDescription>
                      Proporção de vendas de {selectedService} por plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-5">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={serviceDetails[selectedService].platforms}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={90}
                          innerRadius={40}
                          paddingAngle={2}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {serviceDetails[selectedService].platforms.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[entry.name]}
                              stroke="white"
                              strokeWidth={2}
                    />
                  ))}
                </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #f0f0f0",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                          formatter={(value) => [`${value}%`, 'Proporção']}
                        />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right" 
                          iconType="circle"
                          iconSize={10}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

                {/* Gráfico de tendência */}
                <Card className="rounded-xl overflow-hidden border-none shadow-md">
                  <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Tendência de Vendas
                    </CardTitle>
                    <CardDescription>
                      Evolução nas vendas de {selectedService} nos últimos 7 dias
                    </CardDescription>
          </CardHeader>
                  <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
                      <LineChart 
                        data={serviceDetails[selectedService].trend.map((value, index) => ({ 
                          day: index + 1, 
                          value 
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="day" 
                          stroke="#888"
                          tickFormatter={(value) => `Dia ${value}`}
                        />
                        <YAxis stroke="#888" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #f0f0f0",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                          formatter={(value) => [`R$ ${formatNumber(typeof value === 'number' ? value.toFixed(2) : value)}`, 'Vendas']}
                          labelFormatter={(value) => `Dia ${value}`}
                />
                <Line 
                  type="monotone" 
                          dataKey="value" 
                          stroke={serviceDetails[selectedService].color}
                          strokeWidth={3}
                          dot={{ 
                            r: 6, 
                            fill: serviceDetails[selectedService].color, 
                            strokeWidth: 2,
                            stroke: "white"
                          }}
                          activeDot={{ 
                            r: 8, 
                            stroke: serviceDetails[selectedService].color,
                            strokeWidth: 2,
                            fill: "white"
                          }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

              {/* Estatísticas avançadas */}
              <Card className="rounded-xl overflow-hidden border-none shadow-md">
                <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                  <CardTitle className="text-lg font-bold">Estatísticas Avançadas</CardTitle>
                  <CardDescription>
                    Análise detalhada de métricas de vendas para {selectedService}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-500">Taxa de Retenção</h4>
                      <p className="text-2xl font-bold">78%</p>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-500">Ticket Médio</h4>
                      <p className="text-2xl font-bold">R$ 85,50</p>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-500">Frequência de Compra</h4>
                      <p className="text-2xl font-bold">3.2 <span className="text-sm font-normal text-gray-500">por mês</span></p>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: '55%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-500">Churn Rate</h4>
                      <p className="text-2xl font-bold">12.5%</p>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="rounded-xl overflow-hidden border-none shadow-md">
              <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                <CardTitle>Análise de Serviços</CardTitle>
                <CardDescription>
                  Selecione um serviço para visualizar estatísticas detalhadas
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {Object.keys(serviceDetails).map((service) => (
                    <div 
                      key={service}
                      className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleSelectService(service)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center" 
                          style={{ backgroundColor: serviceDetails[service].color }}
                        >
                          <span className="text-white font-bold">{service.charAt(0)}</span>
                        </div>
                        <h3 className="font-semibold">{service}</h3>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500">Vendas</span>
                        <span className="font-medium">R$ {formatNumber(serviceDetails[service].totalSales)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500">Crescimento</span>
                        <span className="font-medium text-green-500">+{serviceDetails[service].growth}%</span>
                      </div>
                      <div className="mt-4">
                        <Button 
                          variant="outline" 
                          className="w-full text-xs" 
                          size="sm"
                        >
                          Ver detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics; 
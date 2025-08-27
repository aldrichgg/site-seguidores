import React, { useEffect, useMemo, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  BarChart as RBarChart,
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
import { getApiBase } from "@/lib/api_base";

// ====== Tipos que refletem o retorno do backend ======

type PeriodUI = "7dias" | "30dias" | "90dias";

type SalesSourceKey = 'site' | 'chatbot' | 'manual' | 'unknown';

type OverviewResponse = {
  period: 'week' | 'month' | 'year';
  range: { start: string; end: string };
  kpis: {
    totalSales: number;        // centavos
    ordersNew: number;
    pendingOrders: number;
    completedOrders: number;
  };
  chart: {
    categories: string[];      // YYYY-MM-DD
    sales: number[];           // centavos por dia (aprovados)
    orders: number[];          // pedidos por dia (todos os status)
  };
  statusDonut: { labels: ["Pago", "Pendente", "Cancelado"]; series: [number, number, number] };
  topChannels: { name: string; count: number; sales: number }[]; // sales em centavos
  salesSources: Record<SalesSourceKey, { orders: number; sales: number }>; // 🆕
  salesSourcesPct: {
    orders: Record<SalesSourceKey, number>;
    sales: Record<SalesSourceKey, number>;
  };
  metrics: {
    conversionRate: number;    // 0..1
    avgTicket: number;         // centavos
    growthMoM: number;
    retentionRate: number;
  };
};

// ====== Helpers ======
const formatBRL = (cents: number) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const centsToNumberBRL = (cents: number) => cents / 100;
const numberToBRL = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const COLORS: Record<string, string> = {
  Instagram: "#E1306C",
  Facebook: "#1877F2",
  YouTube: "#FF0000",
  TikTok: "#000000",
  site: "#2563eb",        // azul
  chatbot: "#16a34a",     // verde
  manual: "#9333ea",      // roxo
  unknown: "#9ca3af",     // cinza
};

const periodMap: Record<PeriodUI, OverviewResponse['period']> = {
  "7dias": "week",
  "30dias": "month",
  "90dias": "year",
};

const Analytics: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<PeriodUI>("7dias");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [sourceMetric, setSourceMetric] = useState<'orders' | 'sales'>('orders');

  // ====== Fetch dos dados reais ======
  useEffect(() => {
    const ctrl = new AbortController();
    const run = async () => {
      try {
        setLoading(true); setErr(null);
        const p = periodMap[timePeriod];
        const res = await fetch(`${getApiBase()}/analytics?period=${p}`, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`GET /analytics ${res.status}`);
        const json = await res.json();
        setOverview(json as OverviewResponse);
      } catch (e: any) {
        if (e.name !== 'AbortError') setErr(e.message || 'Erro ao carregar analytics');
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => ctrl.abort();
  }, [timePeriod]);

  // ====== Dados derivados para gráficos ======
  const dailyData = useMemo(() => {
    if (!overview) return [] as { name: string; Vendas: number; Pedidos: number }[];
    return overview.chart.categories.map((name, i) => ({
      name,
      Vendas: centsToNumberBRL(overview.chart.sales[i] || 0),
      Pedidos: overview.chart.orders[i] || 0,
    }));
  }, [overview]);

  const platformDistribution = useMemo(() => {
    if (!overview) return [] as { name: string; value: number }[];
    // Usa contagem de pedidos por plataforma
    return overview.topChannels.map(ch => ({ name: ch.name, value: ch.count }));
  }, [overview]);

  const salesSourcesDist = useMemo(() => {
    if (!overview) return [] as { name: string; value: number; key: SalesSourceKey }[];
    const src = overview.salesSources;
    return ([
      { key: 'site', name: 'Site', value: sourceMetric === 'orders' ? src.site.orders : centsToNumberBRL(src.site.sales) },
      { key: 'chatbot', name: 'Chatbot', value: sourceMetric === 'orders' ? src.chatbot.orders : centsToNumberBRL(src.chatbot.sales) },
      { key: 'manual', name: 'Manual', value: sourceMetric === 'orders' ? src.manual.orders : centsToNumberBRL(src.manual.sales) },
      { key: 'unknown', name: 'Desconhecido', value: sourceMetric === 'orders' ? src.unknown.orders : centsToNumberBRL(src.unknown.sales) },
    ]);
  }, [overview, sourceMetric]);

  const totalSalesBRL = overview ? numberToBRL(centsToNumberBRL(overview.kpis.totalSales)) : 'R$ 0,00';
  const totalOrders = overview?.kpis.ordersNew ?? 0;
  const completedOrders = overview?.kpis.completedOrders ?? 0;
  const conversionPct = overview ? Math.round(overview.metrics.conversionRate * 1000) / 10 : 0; // 1 casa
  const avgTicketBRL = overview ? numberToBRL(centsToNumberBRL(overview.metrics.avgTicket)) : 'R$ 0,00';

  // Handlers utilitários existentes
  const formatNumber = (num: number | string) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const handleSelectPlatform = (platform: string) => { setSelectedPlatform(platform); setActiveTab("platforms"); };
  const resetPlatformSelection = () => setSelectedPlatform("");
  const handleSelectService = (service: string) => { setSelectedService(service); setActiveTab("services"); };
  const resetServiceSelection = () => setSelectedService("");
  const exportReport = () => {};

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
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
              <span className="text-xs font-medium">{loading ? 'Atualizando…' : 'Atualizado agora'}</span>
            </Badge>
            <Select value={timePeriod} onValueChange={(v: PeriodUI) => setTimePeriod(v)}>
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
        {err && (
          <div className="mt-3 text-sm text-red-600">{err}</div>
        )}
      </div>

      {/* Tabs */}
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
          {/* KPIs com dados reais */}
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
                    <span>--</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mt-1">{totalSalesBRL}</h3>
                <p className="text-sm font-medium text-gray-500 mt-1">Receita Total</p>
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
                    <span>--</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mt-1">{totalOrders}</h3>
                <p className="text-sm font-medium text-gray-500 mt-1">Total de Pedidos</p>
                <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <div className="absolute top-0 right-0 h-1 w-full bg-emerald-500"></div>
              <CardContent className="p-6 pt-7">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2.5 rounded-lg bg-emerald-50">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-500 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>--</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mt-1">{completedOrders}</h3>
                <p className="text-sm font-medium text-gray-500 mt-1">Pedidos Aprovados</p>
                <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '55%' }}></div>
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
                    <span>--</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mt-1">{conversionPct}%</h3>
                <p className="text-sm font-medium text-gray-500 mt-1">Taxa de Conversão</p>
                <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${conversionPct}%` }}></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seção de Gráficos */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Gráfico Principal - Vendas por Dia (R$) */}
            <Card className="rounded-xl overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow xl:col-span-2">
              <CardHeader className="border-b border-gray-100 bg-gray-50/50 flex flex-row items-center justify-between p-5">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-primary-600" />
                    Vendas (R$) e Pedidos por Dia
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Série diária do período selecionado
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-primary-600 hover:bg-primary-50">
                  <Info className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-5 pt-6">
                <ResponsiveContainer width="100%" height={350}>
                  <RBarChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#888" />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#888" />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "white", border: "1px solid #f0f0f0", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                      formatter={(value: any, name: any) => name === 'Vendas' ? [numberToBRL(value as number), 'Vendas'] : [value, 'Pedidos']}
                    />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                    <Bar yAxisId="left" dataKey="Vendas" fill="#0ea5e9" radius={[4,4,0,0]} barSize={22} />
                    <Bar yAxisId="right" dataKey="Pedidos" fill="#22c55e" radius={[4,4,0,0]} barSize={22} />
                  </RBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribuição de Plataformas (do backend) */}
            <Card className="rounded-xl overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="border-b border-gray-100 bg-gray-50/50 flex flex-row items-center justify-between p-5">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-blue-600" />
                    Distribuição de Plataformas
                  </CardTitle>
                  <CardDescription className="mt-1">Participação por plataforma (nº de pedidos)</CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600 hover:bg-blue-50">
                  <Info className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-5">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={platformDistribution} cx="50%" cy="50%" labelLine={false} outerRadius={90} innerRadius={40} paddingAngle={2} dataKey="value">
                      {platformDistribution.map((entry, idx) => (
                        <Cell key={idx} fill={COLORS[entry.name] || "#94a3b8"} stroke="white" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #f0f0f0", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" iconSize={10} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-2 text-sm text-gray-500">Dados reais do período selecionado</div>
              </CardContent>
            </Card>

            {/* NOVO: Origem das Vendas (site/chatbot/manual) */}
            <Card className="rounded-xl overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow xl:col-span-1">
              <CardHeader className="border-b border-gray-100 bg-gray-50/50 flex flex-row items-center justify-between p-5">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-purple-600" />
                    Origem das Vendas
                  </CardTitle>
                  <CardDescription className="mt-1">{sourceMetric === 'orders' ? 'Por quantidade de vendas' : 'Por valor (R$)'}</CardDescription>
                </div>
                <Select value={sourceMetric} onValueChange={(v: 'orders' | 'sales') => setSourceMetric(v)}>
                  <SelectTrigger className="w-[130px] bg-white border-gray-200 shadow-sm">
                    <SelectValue placeholder="Métrica" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="orders">Vendas</SelectItem>
                    <SelectItem value="sales">Receita</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="p-5">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={salesSourcesDist} cx="50%" cy="50%" labelLine={false} outerRadius={90} innerRadius={40} paddingAngle={2} dataKey="value">
                      {salesSourcesDist.map((entry, idx) => (
                        <Cell key={idx} fill={COLORS[entry.key]} stroke="white" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: "white", border: "1px solid #f0f0f0", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                      formatter={(val: any, name: any) => sourceMetric === 'orders' ? [val, name] : [numberToBRL(val as number), name]}
                    />
                    <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" iconSize={10} />
                  </PieChart>
                </ResponsiveContainer>
                {overview && (
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-gray-600">
                    <div><span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: COLORS.site }} />Site: {overview.salesSourcesPct.orders.site}% / {overview.salesSourcesPct.sales.site}%</div>
                    <div><span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: COLORS.chatbot }} />Chatbot: {overview.salesSourcesPct.orders.chatbot}% / {overview.salesSourcesPct.sales.chatbot}%</div>
                    <div><span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: COLORS.manual }} />Manual: {overview.salesSourcesPct.orders.manual}% / {overview.salesSourcesPct.sales.manual}%</div>
                    <div><span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: COLORS.unknown }} />Desconhecido: {overview.salesSourcesPct.orders.unknown}% / {overview.salesSourcesPct.sales.unknown}%</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* As abas de Plataformas e Serviços originais podem permanecer; abaixo deixamos um placeholder mantendo seu design.
            Você pode integrar dados reais neles mais tarde, reaproveitando overview.topChannels e agregações por serviço.
        */}
        <TabsContent value="platforms" className="space-y-6">
          <Card className="rounded-xl overflow-hidden border-none shadow-md">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle>Análise de Plataformas</CardTitle>
              <CardDescription>Selecione uma plataforma para visualizar estatísticas detalhadas</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {(overview?.topChannels || []).map((ch) => (
                  <div key={ch.name} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleSelectPlatform(ch.name)}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS[ch.name] || '#111827' }}>
                        <span className="text-white font-bold">{ch.name.charAt(0)}</span>
                      </div>
                      <h3 className="font-semibold">{ch.name}</h3>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500">Pedidos</span>
                      <span className="font-medium">{ch.count}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500">Vendas</span>
                      <span className="font-medium">{numberToBRL(centsToNumberBRL(ch.sales))}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card className="rounded-xl overflow-hidden border-none shadow-md">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle>Análise de Serviços</CardTitle>
              <CardDescription>Integração futura com breakdown por tipo de serviço.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600">Você pode estender o backend para retornar uma agregação por <em>orderName</em> e preencher esta aba de forma semelhante a plataformas.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;

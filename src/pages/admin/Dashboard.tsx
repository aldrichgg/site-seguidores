import React, { useState } from "react";
import Chart from "react-apexcharts";
import { useDashboard } from "@/hooks/useDashboard";
import { fmtBRL, fmtInt } from "@/lib/format"; // <- removi weekdayPt aqui
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  ChevronRight,
  HomeIcon,
  ThumbsUp,
  Users,
  ShoppingCart,
  DollarSign,
  Clock,
  User,
  Settings,
  BarChart2,
} from "lucide-react";

// Paleta para a origem
const ORIGIN_COLORS = ["#2563eb", "#16a34a", "#9333ea", "#9ca3af"]; // site, chatbot, manual, unknown

// *** FIX DE FUSO ***
// Converte "yyyy-MM-dd" (sem fuso, tratado como UTC pelo JS) para "seg/ter/..." no fuso America/Sao_Paulo.
const weekdayFromYYYYMMDD = (yyyyMmDd: string) => {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  // Cria a data em 12:00 UTC para evitar “voltar um dia” ao aplicar o fuso
  const utcNoon = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1, 12));
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    timeZone: "America/Sao_Paulo",
  }).format(utcNoon);
};

// (opcional) formata ISO UTC do backend no fuso SP para o cabeçalho
const fmtDateBR = (iso?: string) => {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
  }).format(new Date(iso));
};

const Dashboard = () => {
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const { data, loading, error } = useDashboard(period);

  const kpis = data?.kpis || {};
  const chart = data?.chart || { categories: [], sales: [], orders: [] };
  const donut = data?.statusDonut || { labels: [], series: [] };
  const topChannels = data?.topChannels || [];
  const metrics = data?.metrics || {};

  // novas métricas do backend
  const salesSources = data?.salesSources || {
    site: { orders: 0, sales: 0 },
    chatbot: { orders: 0, sales: 0 },
    manual: { orders: 0, sales: 0 },
    unknown: { orders: 0, sales: 0 },
  };
  const salesSourcesPct = data?.salesSourcesPct || {
    orders: { site: 0, chatbot: 0, manual: 0, unknown: 0 },
    sales: { site: 0, chatbot: 0, manual: 0, unknown: 0 },
  };

  // ===== Área (linhas) =====
  const areaCategories =
    chart.categories.length > 0
      ? chart.categories.map(weekdayFromYYYYMMDD)
      : ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  // sales veio em CENTAVOS -> converter para reais (dividir por 100 e arredondar)
  const areaSales =
    chart.sales.length > 0
      ? chart.sales.map((v) => Math.round(v / 100))
      : [0, 0, 0, 0, 0, 0, 0];

  const areaOrders =
    chart.orders.length > 0 ? chart.orders : [0, 0, 0, 0, 0, 0, 0];

  // ===== Donut de status =====
  const donutLabels =
    donut.labels.length > 0 ? donut.labels : ["Pago", "Pendente", "Cancelado"];
  const donutSeries = donut.series.length > 0 ? donut.series : [0, 0, 0];
  const donutTotal = donutSeries.reduce((a, b) => a + b, 0);

  // ===== Métricas =====
  const conversionRate =
    metrics.conversionRate != null
      ? `${Math.round(metrics.conversionRate * 1000) / 10}%`
      : "—";
  const avgTicket = metrics.avgTicket != null ? fmtBRL(metrics.avgTicket) : "—";
  const growthMoM =
    metrics.growthMoM != null ? `${Math.round(metrics.growthMoM * 100)}%` : "—";
  const retentionRate =
    metrics.retentionRate != null
      ? `${Math.round(metrics.retentionRate * 100)}%`
      : "—";

  // ===== Top channels =====
  const maxCount =
    topChannels.length > 0 ? Math.max(...topChannels.map((c) => c.count)) : 1;

  // ===== Origem das vendas =====
  const [originMode, setOriginMode] = useState<"orders" | "sales">("orders");
  const originLabels = ["Site", "Chatbot", "Manual", "Desconhecido"];
  const originSeries =
    originMode === "orders"
      ? [
          salesSources.site.orders,
          salesSources.chatbot.orders,
          salesSources.manual.orders,
          salesSources.unknown.orders,
        ]
      : [
          salesSources.site.sales,
          salesSources.chatbot.sales,
          salesSources.manual.sales,
          salesSources.unknown.sales,
        ];

  const originPercOrders = salesSourcesPct.orders;
  const originPercSales = salesSourcesPct.sales;

  const todayKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  // encontra o índice de hoje nas categorias
  const todayIdx = chart.categories.indexOf(todayKey);

  // valores de hoje
  const todaySalesCents = todayIdx >= 0 ? chart.sales[todayIdx] || 0 : 0;
  const todayOrdersCount = todayIdx >= 0 ? chart.orders[todayIdx] || 0 : 0;

  return (
    <>
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl font-bold mb-4">Visão Geral do Painel</h2>
        <div className="mb-2 text-sm text-gray-500">
          <span className="font-semibold">Período:</span>{" "}
          {data?.period || period} &nbsp;|
          <span className="font-semibold"> Início:</span>{" "}
          {fmtDateBR(data?.range?.start)} &nbsp;|
          <span className="font-semibold"> Fim:</span>{" "}
          {fmtDateBR(data?.range?.end)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Vendas Hoje</p>
                <h3 className="text-2xl font-bold">
                  {loading ? "—" : fmtBRL(todaySalesCents)}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {todayIdx >= 0
                    ? `${todayOrdersCount} pedidos`
                    : "fora do período selecionado"}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <span className="material-symbols-outlined text-blue-500">
                  calendar_today
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-primary-500 hover:shadow-lg transition-all transform hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Vendas Totais</p>
                <h3 className="text-2xl font-bold">
                  {loading ? "—" : fmtBRL(kpis.totalSales)}
                </h3>
                <p className="text-sm text-green-500 flex items-center mt-1">
                  <span className="material-symbols-outlined text-sm">
                    arrow_upward
                  </span>
                  <span>{growthMoM}</span>
                </p>
              </div>
              <div className="p-2 bg-primary-100 rounded-full">
                <span className="material-symbols-outlined text-primary-500">
                  attach_money
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-indigo-500 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Novos Pedidos</p>
                <h3 className="text-2xl font-bold">
                  {loading ? "—" : fmtInt(kpis.ordersNew)}
                </h3>
                <p className="text-sm text-green-500 flex items-center mt-1">
                  <span className="material-symbols-outlined text-sm">
                    arrow_upward
                  </span>
                  <span>{conversionRate}</span>
                </p>
              </div>
              <div className="p-2 bg-indigo-100 rounded-full">
                <span className="material-symbols-outlined text-indigo-500">
                  shopping_cart
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-amber-500 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Pedidos Pendentes</p>
                <h3 className="text-2xl font-bold">
                  {loading ? "—" : fmtInt(kpis.pendingOrders)}
                </h3>
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <span className="material-symbols-outlined text-sm">
                    arrow_downward
                  </span>
                  <span>{retentionRate}</span>
                </p>
              </div>
              <div className="p-2 bg-amber-100 rounded-full">
                <span className="material-symbols-outlined text-amber-500">
                  pending
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Pedidos Pagos</p>
                <h3 className="text-2xl font-bold">
                  {loading ? "—" : fmtInt(kpis.completedOrders)}
                </h3>
                <p className="text-sm text-green-500 flex items-center mt-1">
                  <span className="material-symbols-outlined text-sm">
                    arrow_upward
                  </span>
                  <span>{avgTicket}</span>
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <span className="material-symbols-outlined text-green-500">
                  group
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Linha 1: Gráfico de linha/área (largura máxima) ===== */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-sm p-3 md:p-4 w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Visão Geral das Vendas</h3>
            <select
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={period}
              onChange={(e) =>
                setPeriod(e.target.value as "week" | "month" | "year")
              }
            >
              <option value="week">Esta Semana</option>
              <option value="month">Este Mês</option>
              <option value="year">Este Ano</option>
            </select>
          </div>

          <div className="h-[300px]">
            <Chart
              type="area"
              height={280}
              width="100%"
              series={[
                { name: "Vendas (R$)", data: areaSales },
                { name: "Pedidos", data: areaOrders },
              ]}
              options={{
                chart: { toolbar: { show: false }, zoom: { enabled: false } },
                colors: ["#3b82f6", "#64748b"],
                fill: {
                  type: "gradient",
                  gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.2,
                    stops: [0, 90, 100],
                  },
                },
                dataLabels: { enabled: false },
                stroke: { curve: "smooth", width: 2 },
                grid: { borderColor: "#e2e8f0" },
                xaxis: { categories: areaCategories },
                tooltip: {
                  theme: "dark",
                  y: {
                    formatter: (val: number, opts: any) =>
                      opts.seriesIndex === 0
                        ? fmtBRL(Math.round(val * 100))
                        : fmtInt(val),
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* ===== Linha 2: Dois donuts lado a lado ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Donut: Status do Pedido */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Status do Pedido</h3>
            <span className="material-symbols-outlined cursor-pointer hover:text-primary-500 transition-colors">
              more_vert
            </span>
          </div>
          <div className="h-[300px]">
            <Chart
              type="donut"
              height={280}
              width="100%"
              series={donutSeries}
              options={{
                chart: { toolbar: { show: false } },
                colors: ["#10b981", "#f59e0b", "#ef4444"],
                labels: donutLabels,
                dataLabels: { enabled: false },
                legend: { position: "bottom" },
                plotOptions: {
                  pie: {
                    donut: {
                      size: "70%",
                      labels: {
                        show: true,
                        total: {
                          show: true,
                          label: "Total de Pedidos",
                          formatter: function () {
                            return fmtInt(donutTotal);
                          },
                        },
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Donut: Origem das Vendas */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold">Origem das Vendas</h3>
            <select
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={originMode}
              onChange={(e) =>
                setOriginMode(e.target.value as "orders" | "sales")
              }
            >
              <option value="orders">Vendas</option>
              <option value="sales">Receita</option>
            </select>
          </div>

          <div className="h-[300px]">
            <Chart
              type="donut"
              height={280}
              width="100%"
              series={originSeries}
              options={{
                chart: { toolbar: { show: false } },
                labels: ["Site", "Chatbot", "Manual", "Desconhecido"],
                colors: ["#2563eb", "#16a34a", "#9333ea", "#9ca3af"],
                dataLabels: { enabled: false },
                legend: { position: "bottom" },
                tooltip: {
                  y: {
                    formatter: (val: number) =>
                      originMode === "orders" ? fmtInt(val) : fmtBRL(val),
                  },
                },
                plotOptions: {
                  pie: {
                    donut: {
                      size: "70%",
                      labels: {
                        show: true,
                        total: {
                          show: true,
                          label: originMode === "orders" ? "Vendas" : "Receita",
                          formatter: function (w: any) {
                            const sum = w.globals.seriesTotals.reduce(
                              (a: number, b: number) => a + b,
                              0
                            );
                            return originMode === "orders"
                              ? fmtInt(sum)
                              : fmtBRL(sum);
                          },
                        },
                      },
                    },
                  },
                },
              }}
            />
          </div>

          {/* Percentuais por origem (quantidade / valor) */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-2">
            <div>
              <span
                className="inline-block w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: "#2563eb" }}
              />
              Site: {salesSourcesPct.orders.site}% /{" "}
              {salesSourcesPct.sales.site}%
            </div>
            <div>
              <span
                className="inline-block w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: "#16a34a" }}
              />
              Chatbot: {salesSourcesPct.orders.chatbot}% /{" "}
              {salesSourcesPct.sales.chatbot}%
            </div>
            <div>
              <span
                className="inline-block w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: "#9333ea" }}
              />
              Manual: {salesSourcesPct.orders.manual}% /{" "}
              {salesSourcesPct.sales.manual}%
            </div>
            <div>
              <span
                className="inline-block w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: "#9ca3af" }}
              />
              Desconhecido: {salesSourcesPct.orders.unknown}% /{" "}
              {salesSourcesPct.sales.unknown}%
            </div>
          </div>
        </div>
      </div>

      {/* Última linha do layout (mantida) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-1 lg:col-span-2 bg-white rounded-xl shadow-sm p-3 md:p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Principais Métricas</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Detalhes
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="text-gray-700 font-medium">Taxa de Conversão</h4>
                <div className="text-green-500 flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>{conversionRate}</span>
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">{conversionRate}</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-primary-500 h-1.5 rounded-full"
                  style={{
                    width:
                      metrics.conversionRate != null
                        ? `${Math.round(metrics.conversionRate * 100)}%`
                        : "0%",
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="text-gray-700 font-medium">Ticket Médio</h4>
                <div className="text-green-500 flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>{avgTicket}</span>
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">{avgTicket}</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-primary-500 h-1.5 rounded-full"
                  style={{ width: metrics.avgTicket != null ? "75%" : "0%" }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="text-gray-700 font-medium">Crescimento</h4>
                <div className="text-green-500 flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>{growthMoM}</span>
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">{growthMoM}</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{
                    width:
                      metrics.growthMoM != null
                        ? `${Math.round(metrics.growthMoM * 100)}%`
                        : "0%",
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="text-gray-700 font-medium">Taxa de Retenção</h4>
                <div className="text-amber-500 flex items-center text-sm">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  <span>{retentionRate}</span>
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">{retentionRate}</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-amber-500 h-1.5 rounded-full"
                  style={{
                    width:
                      metrics.retentionRate != null
                        ? `${Math.round(metrics.retentionRate * 100)}%`
                        : "0%",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-3 md:p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Produtos Principais</h3>
            <span className="material-symbols-outlined cursor-pointer hover:text-primary-500 transition-colors">
              more_vert
            </span>
          </div>
          <div className="space-y-4 mt-4">
            {topChannels.length === 0 && (
              <div className="text-gray-400">Nenhum canal encontrado.</div>
            )}
            {topChannels.map((item) => (
              <div
                key={item.name}
                className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors transform hover:scale-[1.02] cursor-pointer"
              >
                <div className="p-2 bg-blue-100 rounded-full">
                  <span className="material-symbols-outlined text-blue-500">
                    thumb_up
                  </span>
                </div>
                <div className="ml-3 flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {fmtInt(item.count)} vendidos
                    </span>
                    <span className="text-sm font-medium">
                      {fmtBRL(item.sales)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{
                        width: `${Math.round((item.count / maxCount) * 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

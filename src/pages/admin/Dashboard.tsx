import React, { useState } from "react";
import Chart from "react-apexcharts";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
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
  BarChart2
} from "lucide-react";

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

// Componente de dashboard
const Dashboard = () => {
  return (
    <>
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl font-bold mb-4">Visão Geral do Painel</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-primary-500 hover:shadow-lg transition-all transform hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Vendas Totais</p>
                <h3 className="text-2xl font-bold">R$25,431</h3>
                <p className="text-sm text-green-500 flex items-center mt-1">
                  <span className="material-symbols-outlined text-sm">arrow_upward</span>
                  <span>12.5% da última semana</span>
                </p>
              </div>
              <div className="p-2 bg-primary-100 rounded-full">
                <span className="material-symbols-outlined text-primary-500">attach_money</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-indigo-500 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Novos Pedidos</p>
                <h3 className="text-2xl font-bold">156</h3>
                <p className="text-sm text-green-500 flex items-center mt-1">
                  <span className="material-symbols-outlined text-sm">arrow_upward</span>
                  <span>5.2% de ontem</span>
                </p>
              </div>
              <div className="p-2 bg-indigo-100 rounded-full">
                <span className="material-symbols-outlined text-indigo-500">shopping_cart</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-amber-500 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Pedidos Pendentes</p>
                <h3 className="text-2xl font-bold">23</h3>
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <span className="material-symbols-outlined text-sm">arrow_downward</span>
                  <span>3.1% de ontem</span>
                </p>
              </div>
              <div className="p-2 bg-amber-100 rounded-full">
                <span className="material-symbols-outlined text-amber-500">pending</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Pedidos Realizados</p>
                <h3 className="text-2xl font-bold">256K</h3>
                <p className="text-sm text-green-500 flex items-center mt-1">
                  <span className="material-symbols-outlined text-sm">arrow_upward</span>
                  <span>8.7% do mês passado</span>
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <span className="material-symbols-outlined text-green-500">group</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <div className="col-span-1 md:col-span-1 lg:col-span-2 bg-white rounded-xl shadow-sm p-3 md:p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Visão Geral das Vendas</h3>
            <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Esta Semana</option>
              <option>Este Mês</option>
              <option>Este Ano</option>
            </select>
            </div>
          <div className="h-[300px]">
            <Chart
              type="area"
              height={280}
              width="100%"
              series={[
                {
                  name: "Vendas",
                  data: [30, 40, 35, 50, 49, 60, 70],
                },
                {
                  name: "Pedidos",
                  data: [20, 35, 40, 45, 40, 50, 60],
                },
              ]}
              options={{
                chart: {
                  toolbar: {
                    show: false,
                  },
                  zoom: {
                    enabled: false,
                  },
                },
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
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  curve: "smooth",
                  width: 2,
                },
                grid: {
                  borderColor: "#e2e8f0",
                },
                xaxis: {
                  categories: [
                    "Seg",
                    "Ter",
                    "Qua",
                    "Qui",
                    "Sex",
                    "Sáb",
                    "Dom",
                  ],
                },
                tooltip: {
                  theme: "dark",
                },
              }}
            />
          </div>
        </div>

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
              series={[65, 25, 10]}
              options={{
                chart: {
                  toolbar: {
                    show: false,
                  },
                },
                colors: ["#10b981", "#f59e0b", "#ef4444"],
                labels: ["Concluído", "Pendente", "Cancelado"],
                dataLabels: {
                  enabled: false,
                },
                legend: {
                  position: "bottom",
                },
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
                            return "2.531";
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
      </div>

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
                  <span>8.2%</span>
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">12.5%</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="text-gray-700 font-medium">Ticket Médio</h4>
                <div className="text-green-500 flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>5.1%</span>
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">R$ 189,90</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="text-gray-700 font-medium">Crescimento</h4>
                <div className="text-green-500 flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>22.3%</span>
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">+15% MoM</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "85%" }}></div>
              </div>
      </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="text-gray-700 font-medium">Taxa de Retenção</h4>
                <div className="text-amber-500 flex items-center text-sm">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  <span>1.2%</span>
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">68.7%</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "69%" }}></div>
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
            <div className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors transform hover:scale-[1.02] cursor-pointer">
              <div className="p-2 bg-blue-100 rounded-full">
                <span className="material-symbols-outlined text-blue-500">thumb_up</span>
              </div>
              <div className="ml-3 flex-1">
                <h4 className="font-medium">Seguidores Instagram</h4>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    35% das vendas
                  </span>
                  <span className="text-sm font-medium">
                    15.240 vendidos
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full"
                    style={{ width: "35%" }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center p-3 md:p-4 hover:bg-gray-50 rounded-lg transition-colors transform hover:scale-[1.02] cursor-pointer">
              <div className="p-2 bg-red-100 rounded-full">
                <span className="material-symbols-outlined text-red-500">subscriptions</span>
              </div>
              <div className="ml-3 flex-1">
                <h4 className="font-medium">Inscritos YouTube</h4>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    25% das vendas
                  </span>
                  <span className="text-sm font-medium">8.670 vendidos</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-red-500 h-1.5 rounded-full"
                    style={{ width: "25%" }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="p-2 bg-cyan-100 rounded-full">
                <span className="material-symbols-outlined text-cyan-500">music_note</span>
              </div>
              <div className="ml-3 flex-1">
                <h4 className="font-medium">Seguidores TikTok</h4>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    20% das vendas
                  </span>
                  <span className="text-sm font-medium">7.450 vendidos</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-cyan-500 h-1.5 rounded-full"
                    style={{ width: "20%" }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="p-2 bg-sky-100 rounded-full">
                <span className="material-symbols-outlined text-sky-500">tag</span>
              </div>
              <div className="ml-3 flex-1">
                <h4 className="font-medium">Seguidores Twitter</h4>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    15% das vendas
                  </span>
                  <span className="text-sm font-medium">
                    5.890 vendidos
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-sky-500 h-1.5 rounded-full"
                    style={{ width: "15%" }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center p-3 md:p-4 hover:bg-gray-50 rounded-lg transition-colors transform hover:scale-[1.02] cursor-pointer">
              <div className="p-2 bg-purple-100 rounded-full">
                <span className="material-symbols-outlined text-purple-500">chat</span>
              </div>
              <div className="ml-3 flex-1">
                <h4 className="font-medium">Membros Discord</h4>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    5% das vendas
                  </span>
                  <span className="text-sm font-medium">
                    2.350 vendidos
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-purple-500 h-1.5 rounded-full"
                    style={{ width: "5%" }}
                  ></div>
                        </div>
                        </div>
            </div>
          </div>
        </div>
    </div>
    </>
  );
};

export default Dashboard; 
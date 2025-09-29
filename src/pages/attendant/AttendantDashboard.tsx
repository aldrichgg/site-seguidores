import React from 'react';
import { useAttendantSales } from '@/hooks/useAttendantSales';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Users,
  Calendar,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

const AttendantDashboard = () => {
  const { sales, loading, error } = useAttendantSales();


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erro ao carregar dados: {error}</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const getStatusBadge = (status: string | undefined) => {
    if (!status) {
      return <Badge variant="secondary">N/A</Badge>;
    }
    
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Aprovado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral das suas vendas e performance</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sales ? formatCurrency(sales.totalRevenue) : 'R$ 0,00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de vendas realizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sales?.totalOrders || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Pedidos processados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sales && sales.totalOrders > 0 
                ? formatCurrency(sales.totalRevenue / sales.totalOrders)
                : 'R$ 0,00'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Valor médio por pedido
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comissão Estimada</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {sales ? formatCurrency(sales.totalSales) : 'R$ 0,00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Sua comissão total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Pedidos Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
          <CardDescription>
            Últimos pedidos processados por você
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sales && sales.orders.length > 0 ? (
            <div className="space-y-4">
              {sales.orders.slice(0, 10).map((order) => (
                <div
                  key={order.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Layout Mobile: Vertical */}
                  <div className="flex flex-col space-y-3 md:hidden">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <ShoppingCart className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{order.customer?.email || 'N/A'}</p>
                        <p className="text-sm text-gray-500">
                          Pedido #{order.id.slice(-8)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(order.order?.amount || 0)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      {getStatusBadge(order.order?.status)}
                    </div>
                  </div>

                  {/* Layout Desktop: Horizontal */}
                  <div className="hidden md:flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.customer?.email || 'N/A'}</p>
                        <p className="text-sm text-gray-500">
                          Pedido #{order.id.slice(-8)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(order.order?.amount || 0)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      {getStatusBadge(order.order?.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum pedido encontrado</p>
              <p className="text-sm text-gray-500">
                Seus pedidos aparecerão aqui quando forem processados
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Estatísticas do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pedidos este mês:</span>
                <span className="font-medium">
                  {sales?.orders.filter(order => {
                    const orderDate = new Date(order.createdAt);
                    const now = new Date();
                    return orderDate.getMonth() === now.getMonth() && 
                           orderDate.getFullYear() === now.getFullYear();
                  }).length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Receita este mês:</span>
                <span className="font-medium">
                  {sales ? formatCurrency(
                    sales.orders
                      .filter(order => {
                        const orderDate = new Date(order.createdAt);
                        const now = new Date();
                        return orderDate.getMonth() === now.getMonth() && 
                               orderDate.getFullYear() === now.getFullYear();
                      })
                      .reduce((sum, order) => sum + (order.order?.amount || 0), 0)
                  ) : 'R$ 0,00'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status dos Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            {sales && sales.orders.length > 0 ? (
              <div className="space-y-3">
                {['approved', 'pending', 'cancelled'].map(status => {
                  const count = sales.orders.filter(order => 
                    order.order?.status && order.order.status.toLowerCase() === status
                  ).length;
                  const percentage = sales.orders.length > 0 
                    ? (count / sales.orders.length) * 100 
                    : 0;
                  
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getStatusBadge(status)}
                        <span className="ml-2 text-sm text-gray-600">
                          {count} pedidos
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nenhum pedido para exibir</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendantDashboard;

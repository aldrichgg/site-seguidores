import React, { useState } from 'react';
import { useAttendantSales } from '@/hooks/useAttendantSales';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search,
  Download,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Calendar,
  ShoppingCart
} from 'lucide-react';

const AttendantSales = () => {
  const { sales, loading, error } = useAttendantSales();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
        <p className="text-red-600">Erro ao carregar vendas: {error}</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
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

  const getStatusBadge = (status: string) => {
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

  // Filtrar pedidos
  const filteredOrders = sales?.orders.filter(order => {
    const matchesSearch = (order.customer?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (order.order?.status || '').toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  // Estatísticas dos pedidos filtrados
  const filteredStats = {
    totalRevenue: filteredOrders.reduce((sum, order) => sum + (order.order?.amount || 0), 0),
    totalOrders: filteredOrders.length,
    approvedOrders: filteredOrders.filter(order => (order.order?.status || '').toLowerCase() === 'approved').length,
    pendingOrders: filteredOrders.filter(order => (order.order?.status || '').toLowerCase() === 'pending').length,
    cancelledOrders: filteredOrders.filter(order => (order.order?.status || '').toLowerCase() === 'cancelled').length,
  };


  const exportToCSV = () => {
    if (!filteredOrders.length) return;

    const headers = ['ID', 'Email', 'Valor', 'Status', 'Data'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => [
        order.id,
        order.customer?.email || '',
        formatCurrency(order.order?.amount || 0),
        order.order?.status || '',
        formatDate(order.createdAt)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `vendas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Vendas</h1>
          <p className="text-gray-600">Histórico completo das suas vendas</p>
        </div>
        <Button onClick={exportToCSV} disabled={!filteredOrders.length}>
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por email ou ID do pedido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">Todos os status</option>
          <option value="approved">Aprovados</option>
          <option value="pending">Pendentes</option>
          <option value="cancelled">Cancelados</option>
        </select>
      </div>

      {/* Estatísticas dos Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Receita Filtrada</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(filteredStats.totalRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total de Pedidos</p>
                <p className="text-lg font-semibold">{filteredStats.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Aprovados</p>
                <p className="text-lg font-semibold">{filteredStats.approvedOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Pendentes</p>
                <p className="text-lg font-semibold">{filteredStats.pendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
          <CardDescription>
            {filteredOrders.length} pedido(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
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
                        <p className="text-sm text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
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
                        <p className="text-sm text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
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
                Tente ajustar os filtros de busca
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendantSales;

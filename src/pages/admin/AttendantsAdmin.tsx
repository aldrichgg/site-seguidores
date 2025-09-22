import React, { useState } from 'react';
import { useAttendants, useAttendantsAdmin } from '@/hooks/useAttendants';
import { useAttendantSales } from '@/hooks/useAttendantSales';
import type { Attendant, CreateAttendantData, UpdateAttendantData } from '@/types/attendants';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  Key,
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Search,
  Filter,
  MoreHorizontal,
  Copy,
  Check,
  Calendar,
  Percent,
  Activity
} from 'lucide-react';

// Componente para exibir card do atendente com métricas
const AttendantCard = ({ 
  attendant, 
  onView, 
  onEdit, 
  onResetPassword, 
  onToggle, 
  onDelete, 
  loadingActions 
}: {
  attendant: Attendant;
  onView: () => void;
  onEdit: () => void;
  onResetPassword: () => void;
  onToggle: () => void;
  onDelete: () => void;
  loadingActions: { [key: string]: boolean };
}) => {
  const { sales, loading: salesLoading } = useAttendantSales(attendant.id);

  const formatCurrency = (value: number) => {
    return `R$ ${(value / 100).toFixed(2).replace('.', ',')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          {/* Informações do Atendente */}
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{attendant.name}</h3>
                <Badge variant={attendant.isActive ? "default" : "secondary"}>
                  {attendant.isActive ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{attendant.email}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Percent className="w-4 h-4" />
                  <span>{attendant.percentage}% comissão</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Criado em {formatDate(attendant.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onView}
              title="Ver detalhes"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onResetPassword}
              disabled={loadingActions[`reset-${attendant.id}`]}
              title="Resetar senha"
            >
              <Key className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggle}
              disabled={loadingActions[`toggle-${attendant.id}`]}
              title={attendant.isActive ? "Desativar" : "Ativar"}
            >
              {attendant.isActive ? (
                <ToggleRight className="w-4 h-4" />
              ) : (
                <ToggleLeft className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              title="Excluir"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Métricas do Atendente */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mx-auto mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-500">Receita Total</p>
              <p className="text-lg font-semibold text-gray-900">
                {salesLoading ? (
                  <div className="animate-pulse bg-gray-200 h-5 w-16 rounded mx-auto"></div>
                ) : sales ? (
                  formatCurrency(sales.totalRevenue)
                ) : (
                  'R$ 0,00'
                )}
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mx-auto mb-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-500">Total Pedidos</p>
              <p className="text-lg font-semibold text-gray-900">
                {salesLoading ? (
                  <div className="animate-pulse bg-gray-200 h-5 w-8 rounded mx-auto"></div>
                ) : (
                  sales?.totalOrders || 0
                )}
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm text-gray-500">Comissão</p>
              <p className="text-lg font-semibold text-gray-900">
                {salesLoading ? (
                  <div className="animate-pulse bg-gray-200 h-5 w-16 rounded mx-auto"></div>
                ) : sales ? (
                  formatCurrency(sales.totalSales)
                ) : (
                  'R$ 0,00'
                )}
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full mx-auto mb-2">
                <Activity className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-sm text-gray-500">Ticket Médio</p>
              <p className="text-lg font-semibold text-gray-900">
                {salesLoading ? (
                  <div className="animate-pulse bg-gray-200 h-5 w-16 rounded mx-auto"></div>
                ) : sales && sales.totalOrders > 0 ? (
                  formatCurrency(sales.totalRevenue / sales.totalOrders)
                ) : (
                  'R$ 0,00'
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AttendantsAdmin = () => {
  const { attendants, loading, error, refetch } = useAttendants();
  const { 
    createAttendant, 
    updateAttendant, 
    deleteAttendant, 
    toggleAttendant, 
    resetPassword,
    loading: actionLoading 
  } = useAttendantsAdmin();

  // Estados para modais
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAttendant, setSelectedAttendant] = useState<Attendant | null>(null);

  // Estados para formulários
  const [formData, setFormData] = useState<CreateAttendantData>({
    name: '',
    email: '',
    percentage: 10
  });

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Estados de loading para ações específicas
  const [loadingActions, setLoadingActions] = useState<{
    [key: string]: boolean;
  }>({});

  // Estado para exibir senha temporária
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Buscar vendas do atendente selecionado
  const { sales, loading: salesLoading } = useAttendantSales(
    selectedAttendant?.id || ''
  );

  // Atualizar atendente selecionado quando a lista for atualizada
  React.useEffect(() => {
    if (selectedAttendant && attendants.length > 0) {
      const updated = attendants.find(a => a.id === selectedAttendant.id);
      if (updated) {
        setSelectedAttendant(updated);
      }
    }
  }, [attendants, selectedAttendant]);

  const setActionLoading = (key: string, loading: boolean) => {
    setLoadingActions(prev => ({ ...prev, [key]: loading }));
  };

  const handleCreateAttendant = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createAttendant(formData);
      
      toast({
        title: "Atendente criado com sucesso!",
        description: result.message,
      });

      // Exibir senha temporária
      setTempPassword(result.temporaryPassword);
      setIsPasswordModalOpen(true);
      
      resetForm();
      setIsCreateOpen(false);
      await refetch();
    } catch (error) {
      console.error('Erro ao criar atendente:', error);
      toast({
        title: "Erro ao criar atendente",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAttendant = async () => {
    if (!selectedAttendant) return;

    try {
      await updateAttendant(selectedAttendant.id, formData);
      
      toast({
        title: "Atendente atualizado com sucesso!",
        description: "Os dados do atendente foram atualizados.",
      });
      
      setIsEditOpen(false);
      setSelectedAttendant(null);
      await refetch();
    } catch (error) {
      console.error('Erro ao atualizar atendente:', error);
      toast({
        title: "Erro ao atualizar atendente",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAttendant = async () => {
    if (!selectedAttendant) return;

    try {
      await deleteAttendant(selectedAttendant.id);
      
      toast({
        title: "Atendente excluído com sucesso!",
        description: "O atendente foi removido do sistema.",
      });
      
      setIsDeleteOpen(false);
      setSelectedAttendant(null);
      await refetch();
    } catch (error) {
      console.error('Erro ao excluir atendente:', error);
      toast({
        title: "Erro ao excluir atendente",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleToggleAttendant = async (attendant: Attendant) => {
    const actionKey = `toggle-${attendant.id}`;
    try {
      setActionLoading(actionKey, true);
      await toggleAttendant(attendant.id);
      
      toast({
        title: `Atendente ${attendant.isActive ? 'desativado' : 'ativado'} com sucesso!`,
        description: `O atendente ${attendant.name} foi ${attendant.isActive ? 'desativado' : 'ativado'}.`,
      });
      
      await refetch();
    } catch (error) {
      console.error('Erro ao alterar status do atendente:', error);
      toast({
        title: "Erro ao alterar status",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setActionLoading(actionKey, false);
    }
  };

  const handleResetPassword = async (attendant: Attendant) => {
    const actionKey = `reset-${attendant.id}`;
    try {
      setActionLoading(actionKey, true);
      const result = await resetPassword(attendant.id);
      
      setTempPassword(result.temporaryPassword);
      setIsPasswordModalOpen(true);
      
      toast({
        title: "Senha resetada com sucesso!",
        description: "Uma nova senha temporária foi gerada.",
      });
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      toast({
        title: "Erro ao resetar senha",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setActionLoading(actionKey, false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      percentage: 10
    });
  };

  const openEditModal = (attendant: Attendant) => {
    setSelectedAttendant(attendant);
    setFormData({
      name: attendant.name,
      email: attendant.email,
      percentage: attendant.percentage
    });
    setIsEditOpen(true);
  };

  const openViewModal = (attendant: Attendant) => {
    setSelectedAttendant(attendant);
    setIsViewOpen(true);
  };

  const openDeleteModal = (attendant: Attendant) => {
    setSelectedAttendant(attendant);
    setIsDeleteOpen(true);
  };

  // Filtrar atendentes
  const filteredAttendants = attendants.filter(attendant => {
    const matchesSearch = attendant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attendant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && attendant.isActive) ||
                         (statusFilter === 'inactive' && !attendant.isActive);
    
    return matchesSearch && matchesStatus;
  });

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
        <p className="text-red-600">Erro ao carregar atendentes: {error}</p>
        <Button onClick={refetch} className="mt-4">
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Atendentes</h1>
          <p className="text-gray-600">Gerencie os atendentes do sistema</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Atendente
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nome ou email..."
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
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
      </div>

      {/* Lista de Atendentes */}
      <div className="grid gap-6">
        {filteredAttendants.map((attendant) => (
          <AttendantCard 
            key={attendant.id} 
            attendant={attendant}
            onView={() => openViewModal(attendant)}
            onEdit={() => openEditModal(attendant)}
            onResetPassword={() => handleResetPassword(attendant)}
            onToggle={() => handleToggleAttendant(attendant)}
            onDelete={() => openDeleteModal(attendant)}
            loadingActions={loadingActions}
          />
        ))}
      </div>

      {filteredAttendants.length === 0 && (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Nenhum atendente encontrado</p>
        </div>
      )}

      {/* Modal: Criar Atendente */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Atendente</DialogTitle>
            <DialogDescription>
              Crie um novo atendente no sistema. Uma senha temporária será gerada.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome completo do atendente"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <Label htmlFor="percentage">Comissão (%) *</Label>
              <Input
                id="percentage"
                type="number"
                min="0"
                max="100"
                value={formData.percentage}
                onChange={(e) => setFormData(prev => ({ ...prev, percentage: Number(e.target.value) }))}
                placeholder="10"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateAttendant} disabled={actionLoading}>
              {actionLoading ? "Criando..." : "Criar Atendente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Editar Atendente */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Atendente</DialogTitle>
            <DialogDescription>
              Atualize as informações do atendente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome completo do atendente"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <Label htmlFor="edit-percentage">Comissão (%) *</Label>
              <Input
                id="edit-percentage"
                type="number"
                min="0"
                max="100"
                value={formData.percentage}
                onChange={(e) => setFormData(prev => ({ ...prev, percentage: Number(e.target.value) }))}
                placeholder="10"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateAttendant} disabled={actionLoading}>
              {actionLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Visualizar Atendente */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Atendente</DialogTitle>
            <DialogDescription>
              Informações completas e vendas do atendente.
            </DialogDescription>
          </DialogHeader>

          {selectedAttendant && (
            <div className="space-y-6">
              {/* Informações do Atendente */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Nome</Label>
                  <p className="text-sm">{selectedAttendant.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <p className="text-sm">{selectedAttendant.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Comissão</Label>
                  <p className="text-sm">{selectedAttendant.percentage}%</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <Badge variant={selectedAttendant.isActive ? "default" : "secondary"}>
                    {selectedAttendant.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>

              {/* Vendas do Atendente */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Vendas</h3>
                {salesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : sales ? (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <DollarSign className="w-8 h-8 text-green-600" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Receita Total</p>
                            <p className="text-lg font-semibold">
                              R$ {(sales.totalRevenue / 100).toFixed(2).replace('.', ',')}
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
                            <p className="text-lg font-semibold">{sales.totalOrders}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <TrendingUp className="w-8 h-8 text-purple-600" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Comissão</p>
                            <p className="text-lg font-semibold">
                              R$ {((sales.totalRevenue * selectedAttendant.percentage) / 10000).toFixed(2).replace('.', ',')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhuma venda encontrada</p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Excluir Atendente */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Atendente</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este atendente? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="p-3 rounded bg-red-50 text-red-700 text-sm">
            {selectedAttendant?.name} ({selectedAttendant?.email})
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteAttendant} disabled={actionLoading}>
              {actionLoading ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Senha Temporária */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Senha Temporária</DialogTitle>
            <DialogDescription>
              Guarde esta senha temporária. O atendente deve alterá-la no primeiro login.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <code className="text-lg font-mono bg-white px-3 py-2 rounded border">
                {tempPassword}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(tempPassword || '');
                  toast({
                    title: "Senha copiada!",
                    description: "A senha temporária foi copiada para a área de transferência.",
                  });
                }}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPasswordModalOpen(false)}>
              Entendi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendantsAdmin;

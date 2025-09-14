import React, { useState } from 'react';
import { useServicesAdmin } from '@/hooks/useServices';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';

const ServicesAdmin = () => {
  const {
    services,
    loading,
    error,
    createService,
    updateService,
    deleteService,
    toggleService,
    refetch
  } = useServicesAdmin();

  const [filterPlatform, setFilterPlatform] = useState('');
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado do formulário
  const [formData, setFormData] = useState({
    name: '',
    platform: '',
    serviceType: '',
    quantity: 0,
    price: 0,
    originalPrice: 0,
    features: [''],
    isPopular: false,
    isRecommended: false,
    deliveryTime: '',
    serviceId: 0,
    sortOrder: 0
  });

  // Filtrar serviços
  const filteredServices = services.filter(service => {
    if (filterPlatform && filterPlatform !== 'all' && service.platform !== filterPlatform) return false;
    if (filterType && filterType !== 'all' && service.serviceType !== filterType) return false;
    if (searchTerm && !service.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Limpar formulário
  const clearForm = () => {
    setFormData({
      name: '',
      platform: '',
      serviceType: '',
      quantity: 0,
      price: 0,
      originalPrice: 0,
      features: [''],
      isPopular: false,
      isRecommended: false,
      deliveryTime: '',
      serviceId: 0,
      sortOrder: 0
    });
  };

  // Abrir dialog de edição
  const openEditDialog = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      platform: service.platform,
      serviceType: service.serviceType,
      quantity: service.quantity,
      price: service.price,
      originalPrice: service.originalPrice,
      features: service.features.length > 0 ? service.features : [''],
      isPopular: service.isPopular,
      isRecommended: service.isRecommended,
      deliveryTime: service.deliveryTime,
      serviceId: service.serviceId,
      sortOrder: service.sortOrder
    });
    setIsEditDialogOpen(true);
  };

  // Fechar dialogs
  const closeDialogs = () => {
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setEditingService(null);
    clearForm();
  };

  // Adicionar feature
  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  // Remover feature
  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Atualizar feature
  const updateFeature = (index, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  // Submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const serviceData = {
        ...formData,
        features: formData.features.filter(f => f.trim() !== ''),
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        serviceId: Number(formData.serviceId),
        sortOrder: Number(formData.sortOrder)
      };

      if (editingService) {
        await updateService(editingService.id, serviceData);
      } else {
        await createService(serviceData);
      }

      closeDialogs();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      alert('Erro ao salvar serviço. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Deletar serviço
  const handleDelete = async (service) => {
    if (!confirm(`Tem certeza que deseja deletar o serviço "${service.name}"?`)) return;

    try {
      await deleteService(service.id);
    } catch (error) {
      console.error('Erro ao deletar serviço:', error);
      alert('Erro ao deletar serviço. Tente novamente.');
    }
  };

  // Alternar status
  const handleToggle = async (service) => {
    try {
      await toggleService(service.id);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="text-red-500 mb-4">
          <Trash2 className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Erro ao carregar serviços
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={refetch} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Serviços</h1>
          <p className="text-gray-600 mt-1">
            Gerencie todos os serviços disponíveis no site
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={clearForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Serviço
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Nome do serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="platform">Plataforma</Label>
              <Select value={filterPlatform || undefined} onValueChange={setFilterPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as plataformas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select value={filterType || undefined} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="seguidores">Seguidores</SelectItem>
                  <SelectItem value="curtidas">Curtidas</SelectItem>
                  <SelectItem value="visualizacoes">Visualizações</SelectItem>
                  <SelectItem value="inscritos">Inscritos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setFilterPlatform('');
                  setFilterType('');
                  setSearchTerm('');
                }}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Serviços */}
      <Card>
        <CardHeader>
          <CardTitle>
            Serviços ({filteredServices.length})
          </CardTitle>
          <CardDescription>
            Lista de todos os serviços cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Plataforma</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{service.name}</div>
                        <div className="text-sm text-gray-500">
                          ID: {service.serviceId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {service.platform}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {service.serviceType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {service.quantity.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-semibold">
                          R$ {service.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500 line-through">
                          R$ {service.originalPrice.toFixed(2)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={service.isActive ? "default" : "secondary"}
                          className="capitalize"
                        >
                          {service.isActive ? 'Ativo' : 'Inativo'}
                        </Badge>
                        {service.isPopular && (
                          <Badge variant="destructive" className="text-xs">
                            Popular
                          </Badge>
                        )}
                        {service.isRecommended && (
                          <Badge variant="outline" className="text-xs">
                            Recomendado
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggle(service)}
                        >
                          {service.isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(service)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(service)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Criação/Edição */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={closeDialogs}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Editar Serviço' : 'Novo Serviço'}
            </DialogTitle>
            <DialogDescription>
              {editingService 
                ? 'Edite as informações do serviço' 
                : 'Preencha as informações para criar um novo serviço'
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Serviço</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: 1000 Seguidores Instagram"
                  required
                />
              </div>
              
            <div>
              <Label htmlFor="platform">Plataforma</Label>
              <Select 
                value={formData.platform || undefined} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a plataforma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serviceType">Tipo de Serviço</Label>
                <Select 
                  value={formData.serviceType || undefined} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, serviceType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seguidores">Seguidores</SelectItem>
                    <SelectItem value="curtidas">Curtidas</SelectItem>
                    <SelectItem value="visualizacoes">Visualizações</SelectItem>
                    <SelectItem value="inscritos">Inscritos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                  placeholder="1000"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Preço Atual</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  placeholder="47.30"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="originalPrice">Preço Original</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                  placeholder="83.90"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="serviceId">ID do Serviço</Label>
                <Input
                  id="serviceId"
                  type="number"
                  value={formData.serviceId}
                  onChange={(e) => setFormData(prev => ({ ...prev, serviceId: Number(e.target.value) }))}
                  placeholder="597"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deliveryTime">Tempo de Entrega</Label>
                <Input
                  id="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, deliveryTime: e.target.value }))}
                  placeholder="24 horas"
                />
              </div>
              
              <div>
                <Label htmlFor="sortOrder">Ordem de Exibição</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: Number(e.target.value) }))}
                  placeholder="1"
                />
              </div>
            </div>

            <div>
              <Label>Features (Benefícios)</Label>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Ex: Contas reais e ativas"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      disabled={formData.features.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Feature
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPopular"
                  checked={formData.isPopular}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPopular: checked }))}
                />
                <Label htmlFor="isPopular">Popular</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isRecommended"
                  checked={formData.isRecommended}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRecommended: checked }))}
                />
                <Label htmlFor="isRecommended">Recomendado</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialogs}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : (editingService ? 'Atualizar' : 'Criar')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesAdmin;

import React, { useState, useEffect } from 'react';
import { useInfluencers, useInfluencersAdmin, useInfluencerSales, Influencer, CreateInfluencerData, ProfilePage } from '@/hooks/useInfluencers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  ExternalLink,
  Search,
  Filter,
  MoreHorizontal,
  Copy,
  Check
} from 'lucide-react';

const InfluencersAdmin = () => {
  const { influencers, loading, error, refetch } = useInfluencers();
  const { 
    createInfluencer, 
    updateInfluencer, 
    deleteInfluencer, 
    toggleInfluencer, 
    resetPassword,
    addProfilePage,
    removeProfilePage,
    loading: actionLoading 
  } = useInfluencersAdmin();

  // Estados para modais
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);

  // Estados para formulários
  const [formData, setFormData] = useState<CreateInfluencerData>({
    name: '',
    email: '',
    percentage: 10,
    profilePages: []
  });

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Estados para páginas de perfil
  const [newProfilePage, setNewProfilePage] = useState({
    name: '',
    platform: '',
    url: ''
  });

  // Estados de loading para ações específicas
  const [loadingActions, setLoadingActions] = useState<{
    [key: string]: boolean;
  }>({});

  // Estado para controlar links copiados
  const [copiedLinks, setCopiedLinks] = useState<{
    [key: string]: boolean;
  }>({});

  // Estado para exibir senha temporária
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Buscar vendas do influenciador selecionado
  const { sales, loading: salesLoading } = useInfluencerSales(
    selectedInfluencer?.id || '', 
    undefined
  );

  // Atualizar influenciador selecionado quando a lista for atualizada
  useEffect(() => {
    if (selectedInfluencer && influencers.length > 0) {
      const updatedInfluencer = influencers.find(inf => inf.id === selectedInfluencer.id);
      if (updatedInfluencer && JSON.stringify(updatedInfluencer) !== JSON.stringify(selectedInfluencer)) {
        setSelectedInfluencer(updatedInfluencer);
      }
    }
  }, [influencers, selectedInfluencer]);

  // Filtrar influenciadores
  const filteredInfluencers = influencers.filter(influencer => {
    const matchesSearch = influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         influencer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && influencer.isActive) ||
                         (statusFilter === 'inactive' && !influencer.isActive);
    return matchesSearch && matchesStatus;
  });

  // Funções auxiliares para loading
  const setActionLoading = (action: string, loading: boolean) => {
    setLoadingActions(prev => ({ ...prev, [action]: loading }));
  };

  const isActionLoading = (action: string) => {
    return loadingActions[action] || false;
  };

  // Função para copiar link UTM
  const handleCopyUtmLink = async (utmLink: string, pageId: string) => {
    try {
      await navigator.clipboard.writeText(utmLink);
      setCopiedLinks(prev => ({ ...prev, [pageId]: true }));
      
      // Resetar o estado após 2 segundos
      setTimeout(() => {
        setCopiedLinks(prev => ({ ...prev, [pageId]: false }));
      }, 2000);
    } catch (error) {
      console.error('Erro ao copiar link:', error);
      // Fallback para navegadores mais antigos
      const textArea = document.createElement('textarea');
      textArea.value = utmLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopiedLinks(prev => ({ ...prev, [pageId]: true }));
      setTimeout(() => {
        setCopiedLinks(prev => ({ ...prev, [pageId]: false }));
      }, 2000);
    }
  };

  const handleCopyPassword = async () => {
    if (tempPassword) {
      try {
        await navigator.clipboard.writeText(tempPassword);
        // Aqui você pode adicionar um toast ou feedback visual
        console.log('Senha copiada para a área de transferência!');
      } catch (error) {
        console.error('Erro ao copiar senha:', error);
      }
    }
  };

  // Handlers
  const handleCreate = async () => {
    try {
      const result = await createInfluencer(formData);
      
      // Debug: verificar o que está sendo retornado
      console.log('Resultado da criação do influenciador:', result);
      console.log('Tipo do resultado:', typeof result);
      console.log('Chaves do resultado:', result ? Object.keys(result) : 'result é null/undefined');
      
      // Verificar se a API retornou uma senha temporária
      if (result && result.tempPassword) {
        console.log('Senha temporária encontrada:', result.tempPassword);
        setTempPassword(result.tempPassword);
        setIsPasswordModalOpen(true);
      } else {
        console.log('Nenhuma senha temporária encontrada no resultado');
        // Vamos tentar outras possíveis chaves
        if (result && result.password) {
          console.log('Senha encontrada em result.password:', result.password);
          setTempPassword(result.password);
          setIsPasswordModalOpen(true);
        } else if (result && result.temporaryPassword) {
          console.log('Senha encontrada em result.temporaryPassword:', result.temporaryPassword);
          setTempPassword(result.temporaryPassword);
          setIsPasswordModalOpen(true);
        } else if (result && result.data && result.data.tempPassword) {
          console.log('Senha encontrada em result.data.tempPassword:', result.data.tempPassword);
          setTempPassword(result.data.tempPassword);
          setIsPasswordModalOpen(true);
        }
      }
      
      setIsCreateOpen(false);
      resetForm();
      await refetch(); // Aguardar o refetch para garantir que a lista seja atualizada
    } catch (error) {
      console.error('Erro ao criar influenciador:', error);
    }
  };

  const handleEdit = async () => {
    if (!selectedInfluencer) return;
    try {
      await updateInfluencer(selectedInfluencer.id, formData);
      setIsEditOpen(false);
      resetForm();
      await refetch(); // Aguardar o refetch
    } catch (error) {
      console.error('Erro ao atualizar influenciador:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedInfluencer) return;
    try {
      await deleteInfluencer(selectedInfluencer.id);
      setIsDeleteOpen(false);
      setSelectedInfluencer(null);
      refetch();
    } catch (error) {
      console.error('Erro ao deletar influenciador:', error);
    }
  };

  const handleToggle = async (influencer: Influencer) => {
    const actionKey = `toggle-${influencer.id}`;
    try {
      setActionLoading(actionKey, true);
      await toggleInfluencer(influencer.id);
      refetch();
    } catch (error) {
      console.error('Erro ao alternar status:', error);
    } finally {
      setActionLoading(actionKey, false);
    }
  };

  const handleResetPassword = async (influencer: Influencer) => {
    const actionKey = `reset-${influencer.id}`;
    try {
      setActionLoading(actionKey, true);
      const result = await resetPassword(influencer.id);
      alert(`Nova senha: ${result.newPassword}`);
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
    } finally {
      setActionLoading(actionKey, false);
    }
  };

  const handleAddProfilePage = async () => {
    console.log('Tentando adicionar página:', {
      selectedInfluencer: selectedInfluencer?.id,
      newProfilePage,
      hasName: !!newProfilePage.name,
      hasPlatform: !!newProfilePage.platform
    });
    
    if (!selectedInfluencer || !newProfilePage.name || !newProfilePage.platform) {
      console.log('Validação falhou:', {
        hasInfluencer: !!selectedInfluencer,
        hasName: !!newProfilePage.name,
        hasPlatform: !!newProfilePage.platform
      });
      return;
    }
    
    const actionKey = `add-page-${selectedInfluencer.id}`;
    try {
      setActionLoading(actionKey, true);
      console.log('Chamando addProfilePage com:', selectedInfluencer.id, newProfilePage);
      const result = await addProfilePage(selectedInfluencer.id, newProfilePage);
      console.log('Resultado da adição:', result);
      setNewProfilePage({ name: '', platform: '', url: '' });
      await refetch(); // Aguardar o refetch
    } catch (error) {
      console.error('Erro ao adicionar página:', error);
    } finally {
      setActionLoading(actionKey, false);
    }
  };

  const handleRemoveProfilePage = async (pageId: string) => {
    if (!selectedInfluencer) return;
    const actionKey = `remove-page-${pageId}`;
    try {
      setActionLoading(actionKey, true);
      await removeProfilePage(selectedInfluencer.id, pageId);
      await refetch(); // Aguardar o refetch
    } catch (error) {
      console.error('Erro ao remover página:', error);
    } finally {
      setActionLoading(actionKey, false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      percentage: 10,
      profilePages: []
    });
  };

  const openEditModal = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
    setFormData({
      name: influencer.name,
      email: influencer.email,
      percentage: influencer.percentage,
      profilePages: influencer.profilePages
    });
    setIsEditOpen(true);
  };

  const openViewModal = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
    setIsViewOpen(true);
  };

  const openDeleteModal = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
    setIsDeleteOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando influenciadores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Erro ao carregar influenciadores: {error}</p>
        <Button onClick={refetch}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Influenciadores</h1>
          <p className="text-muted-foreground">Gerencie influenciadores e suas páginas de perfil</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Influenciador
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Influenciadores */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Influenciadores ({filteredInfluencers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Comissão</TableHead>
                <TableHead>Páginas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInfluencers.map((influencer) => (
                <TableRow key={influencer.id}>
                  <TableCell className="font-medium">{influencer.name}</TableCell>
                  <TableCell>{influencer.email}</TableCell>
                  <TableCell>{influencer.percentage}%</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {influencer.profilePages.length} página(s)
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={influencer.isActive ? "default" : "secondary"}>
                      {influencer.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openViewModal(influencer)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Visualizar detalhes</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(influencer)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar influenciador</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggle(influencer)}
                              disabled={isActionLoading(`toggle-${influencer.id}`)}
                            >
                              {isActionLoading(`toggle-${influencer.id}`) ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                              ) : influencer.isActive ? (
                                <ToggleRight className="w-4 h-4" />
                              ) : (
                                <ToggleLeft className="w-4 h-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{influencer.isActive ? 'Desativar' : 'Ativar'} influenciador</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResetPassword(influencer)}
                              disabled={isActionLoading(`reset-${influencer.id}`)}
                            >
                              {isActionLoading(`reset-${influencer.id}`) ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                              ) : (
                                <Key className="w-4 h-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Resetar senha</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDeleteModal(influencer)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Deletar influenciador</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal: Criar Influenciador */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Criar Novo Influenciador</DialogTitle>
            <DialogDescription>
              Crie uma nova conta de influenciador com páginas de perfil
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do influenciador"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="percentage">Comissão (%)</Label>
              <Input
                id="percentage"
                type="number"
                min="1"
                max="100"
                value={formData.percentage}
                onChange={(e) => setFormData({ ...formData, percentage: Number(e.target.value) })}
                placeholder="10"
              />
            </div>

            <div>
              <Label>Páginas de Perfil</Label>
              <div className="space-y-2">
                {formData.profilePages.map((page, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={page.name}
                      onChange={(e) => {
                        const newPages = [...formData.profilePages];
                        newPages[index].name = e.target.value;
                        setFormData({ ...formData, profilePages: newPages });
                      }}
                      placeholder="Nome da página"
                      className="flex-1"
                    />
                    <Select
                      value={page.platform}
                      onValueChange={(value) => {
                        const newPages = [...formData.profilePages];
                        newPages[index].platform = value;
                        setFormData({ ...formData, profilePages: newPages });
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Plataforma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newPages = formData.profilePages.filter((_, i) => i !== index);
                        setFormData({ ...formData, profilePages: newPages });
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      profilePages: [...formData.profilePages, { name: '', platform: '', url: '' }]
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Página
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={actionLoading}>
              {actionLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Criando...
                </div>
              ) : (
                'Criar Influenciador'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Visualizar Influenciador */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Influenciador</DialogTitle>
            <DialogDescription>
              Informações completas e vendas do influenciador
            </DialogDescription>
          </DialogHeader>
          
          {selectedInfluencer && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList>
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="pages">Páginas</TabsTrigger>
                <TabsTrigger value="sales">Vendas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nome</Label>
                    <p className="text-sm font-medium">{selectedInfluencer.name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm font-medium">{selectedInfluencer.email}</p>
                  </div>
                  <div>
                    <Label>Comissão</Label>
                    <p className="text-sm font-medium">{selectedInfluencer.percentage}%</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge variant={selectedInfluencer.isActive ? "default" : "secondary"}>
                      {selectedInfluencer.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="pages" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>Páginas de Perfil</Label>
                    <div className="space-y-2">
                      {selectedInfluencer.profilePages.map((page) => (
                        <div key={page.id} className="p-3 border rounded space-y-2 w-full max-w-lg overflow-hidden">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{page.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {page.platform} {page.url && `• ${page.url}`}
                              </p>
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => page.id && handleRemoveProfilePage(page.id)}
                                  disabled={isActionLoading(`remove-page-${page.id}`)}
                                >
                                  {isActionLoading(`remove-page-${page.id}`) ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Remover página</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          
                          {page.utmLink && (
                            <div className="p-2 bg-gray-50 rounded max-w-full overflow-hidden">
                              <p className="text-xs text-muted-foreground mb-2">Link UTM:</p>
                              <div className="flex items-center gap-2 w-full max-w-full">
                                <div className="flex-1 min-w-0 overflow-hidden">
                                  <p 
                                    className="text-sm font-mono" 
                                    title={page.utmLink}
                                    style={{ 
                                      width: '100%',
                                      maxWidth: '100%',
                                      wordBreak: 'break-all',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      display: 'block'
                                    }}
                                  >
                                    {page.utmLink}
                                  </p>
                                </div>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => page.id && handleCopyUtmLink(page.utmLink!, page.id)}
                                      className="shrink-0 flex-shrink-0 w-8 h-8 p-0 ml-2"
                                    >
                                      {copiedLinks[page.id!] ? (
                                        <Check className="w-4 h-4 text-green-600" />
                                      ) : (
                                        <Copy className="w-4 h-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{copiedLinks[page.id!] ? 'Copiado!' : 'Copiar link UTM'}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <Label>Adicionar Nova Página</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex gap-2">
                        <Input
                          value={newProfilePage.name}
                          onChange={(e) => setNewProfilePage({ ...newProfilePage, name: e.target.value })}
                          placeholder="Nome da página"
                          className="flex-1"
                        />
                        <Select
                          value={newProfilePage.platform}
                          onValueChange={(value) => setNewProfilePage({ ...newProfilePage, platform: value })}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Plataforma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                          </SelectContent>
                        </Select>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              onClick={handleAddProfilePage}
                              disabled={isActionLoading(`add-page-${selectedInfluencer?.id}`) || !newProfilePage.name || !newProfilePage.platform}
                            >
                              {isActionLoading(`add-page-${selectedInfluencer?.id}`) ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                              ) : (
                                <Plus className="w-4 h-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Adicionar página</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        value={newProfilePage.url}
                        onChange={(e) => setNewProfilePage({ ...newProfilePage, url: e.target.value })}
                        placeholder="URL da página (opcional)"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="sales" className="space-y-4">
                {salesLoading ? (
                  <p>Carregando vendas...</p>
                ) : sales.length > 0 ? (
                  <div className="space-y-4">
                    {sales.map((sale) => (
                      <Card key={sale.profilePageName}>
                        <CardHeader>
                          <CardTitle className="text-lg">{sale.profilePageName}</CardTitle>
                          <CardDescription>
                            {sale.totalOrders} pedidos • R$ {(sale.totalSales / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Produto</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Data</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sale.orders.map((order) => (
                                <TableRow key={order.id}>
                                  <TableCell>
                                    {order.first_name} {order.last_name}
                                    <br />
                                    <span className="text-sm text-muted-foreground">{order.email}</span>
                                  </TableCell>
                                  <TableCell>{order.order_name}</TableCell>
                                  <TableCell>R$ {(order.amount / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                  <TableCell>
                                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhuma venda encontrada</p>
                )}
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Editar Influenciador */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Influenciador</DialogTitle>
            <DialogDescription>
              Edite as informações do influenciador
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do influenciador"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-percentage">Comissão (%)</Label>
              <Input
                id="edit-percentage"
                type="number"
                min="1"
                max="100"
                value={formData.percentage}
                onChange={(e) => setFormData({ ...formData, percentage: Number(e.target.value) })}
                placeholder="10"
              />
            </div>

            <div>
              <Label>Páginas de Perfil</Label>
              <div className="space-y-2">
                {formData.profilePages.map((page, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={page.name}
                      onChange={(e) => {
                        const newPages = [...formData.profilePages];
                        newPages[index].name = e.target.value;
                        setFormData({ ...formData, profilePages: newPages });
                      }}
                      placeholder="Nome da página"
                      className="flex-1"
                    />
                    <Select
                      value={page.platform}
                      onValueChange={(value) => {
                        const newPages = [...formData.profilePages];
                        newPages[index].platform = value;
                        setFormData({ ...formData, profilePages: newPages });
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Plataforma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newPages = formData.profilePages.filter((_, i) => i !== index);
                        setFormData({ ...formData, profilePages: newPages });
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      profilePages: [...formData.profilePages, { name: '', platform: '', url: '' }]
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Página
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit} disabled={actionLoading}>
              {actionLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Salvando...
                </div>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Deletar Influenciador */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar o influenciador "{selectedInfluencer?.name}"? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={actionLoading}>
              {actionLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deletando...
                </div>
              ) : (
                'Deletar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Senha Temporária */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Influenciador Criado com Sucesso!</DialogTitle>
            <DialogDescription>
              O influenciador foi criado com sucesso. Aqui está a senha temporária que você deve enviar para ele:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Key className="w-5 h-5 text-yellow-600" />
                <Label className="text-sm font-medium text-yellow-800">Senha Temporária:</Label>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-2 bg-white border border-yellow-300 rounded font-mono text-lg font-bold text-gray-900">
                  {tempPassword}
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyPassword}
                      className="shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copiar senha</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Importante:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Envie esta senha para o influenciador por um canal seguro</li>
                    <li>• Ele deve alterar a senha no primeiro login</li>
                    <li>• Esta senha é temporária e deve ser usada apenas uma vez</li>
                  </ul>
                </div>
              </div>
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
    </TooltipProvider>
  );
};

export default InfluencersAdmin;

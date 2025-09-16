import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Power, 
  PowerOff, 
  Link, 
  BarChart3,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';
import { usePages, usePageAnalytics, usePageUtmMetrics, CompanyPage, CreatePageData, UpdatePageData, CreateUtmLinkData, UpdateUtmLinkData } from '@/hooks/usePages';

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'linkedin', label: 'LinkedIn' },
];

const CATEGORIES = [
  { value: 'empresa', label: 'Empresa' },
  { value: 'produto', label: 'Produto' },
  { value: 'servico', label: 'Serviço' },
  { value: 'marca', label: 'Marca' },
  { value: 'pessoal', label: 'Pessoal' },
];

const UTM_MEDIUMS = [
  { value: 'stories', label: 'Stories' },
  { value: 'post', label: 'Post' },
  { value: 'reel', label: 'Reel' },
  { value: 'video', label: 'Vídeo' },
  { value: 'ad', label: 'Anúncio' },
  { value: 'bio', label: 'Bio' },
  { value: 'highlight', label: 'Destaque' },
  { value: 'other', label: 'Outro' },
];

const PERIODS = [
  { value: 'day', label: 'Hoje' },
  { value: 'week', label: 'Esta Semana' },
  { value: 'month', label: 'Este Mês' },
];

const PagesAdmin = () => {
  const { 
    pages, 
    loading, 
    error, 
    refetch, 
    createPage, 
    updatePage, 
    deletePage, 
    togglePageStatus,
    createUtmLink,
    updateUtmLink,
    deleteUtmLink
  } = usePages();

  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modais
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUtmCreateOpen, setIsUtmCreateOpen] = useState(false);
  const [isUtmEditOpen, setIsUtmEditOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState("details");
  
  // Estados dos formulários
  const [selectedPage, setSelectedPage] = useState<CompanyPage | null>(null);
  const [selectedUtmLink, setSelectedUtmLink] = useState<any>(null);
  const [formData, setFormData] = useState<CreatePageData>({
    name: '',
    platform: '',
    url: '',
    description: '',
    category: '',
    isActive: true,
  });
  const [utmFormData, setUtmFormData] = useState<CreateUtmLinkData>({
    name: '',
    description: '',
    utmMedium: '',
    utmCampaign: '',
    isActive: true,
  });
  const [analyticsPeriod, setAnalyticsPeriod] = useState('week');
  const [copiedLinks, setCopiedLinks] = useState<Record<string, boolean>>({});

  // Analytics
  const { analytics, loading: analyticsLoading } = usePageAnalytics(
    selectedPage?.id, 
    analyticsPeriod
  );
  
  const { utmMetrics, loading: utmMetricsLoading, error: utmMetricsError } = usePageUtmMetrics(
    selectedPage?.id, 
    analyticsPeriod
  );

  // Debug logs para métricas UTM
  console.log('🎯 [PagesAdmin] selectedPage:', selectedPage);
  console.log('📊 [PagesAdmin] utmMetrics:', utmMetrics);
  console.log('⏳ [PagesAdmin] utmMetricsLoading:', utmMetricsLoading);
  console.log('❌ [PagesAdmin] utmMetricsError:', utmMetricsError);

  // Filtrar páginas
  const filteredPages = pages.filter(page => {
    const matchesSearch = page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || page.platform === platformFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && page.isActive) ||
                         (statusFilter === 'inactive' && !page.isActive);
    
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      name: '',
      platform: '',
      url: '',
      description: '',
      category: '',
      isActive: true,
    });
  };

  const resetUtmForm = () => {
    setUtmFormData({
      name: '',
      description: '',
      utmMedium: '',
      utmCampaign: '',
      isActive: true,
    });
  };

  // Handlers
  const handleCreate = async () => {
    try {
      await createPage(formData);
      setIsCreateOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao criar página:', error);
    }
  };

  const handleEdit = async () => {
    if (!selectedPage) return;
    
    try {
      await updatePage(selectedPage.id, formData);
      setIsEditOpen(false);
      resetForm();
      setSelectedPage(null);
    } catch (error) {
      console.error('Erro ao editar página:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedPage) return;
    
    try {
      await deletePage(selectedPage.id);
      setIsDeleteOpen(false);
      setSelectedPage(null);
    } catch (error) {
      console.error('Erro ao excluir página:', error);
    }
  };

  const handleToggleStatus = async (page: CompanyPage) => {
    try {
      await togglePageStatus(page.id);
    } catch (error) {
      console.error('Erro ao alterar status da página:', error);
    }
  };

  const handleViewPage = (page: CompanyPage, tab: string = "details") => {
    setSelectedPage(page);
    setDefaultTab(tab);
    setIsViewOpen(true);
  };

  const handleEditPage = (page: CompanyPage) => {
    setSelectedPage(page);
    setFormData({
      name: page.name,
      platform: page.platform,
      url: page.url,
      description: page.description || '',
      category: page.category,
      isActive: page.isActive,
    });
    setIsEditOpen(true);
  };

  const handleDeletePage = (page: CompanyPage) => {
    setSelectedPage(page);
    setIsDeleteOpen(true);
  };

  const handleViewAnalytics = (page: CompanyPage) => {
    handleViewPage(page, "metrics");
  };

  // UTM Links handlers
  const handleCreateUtmLink = async () => {
    if (!selectedPage) return;
    
    try {
      await createUtmLink(selectedPage.id, utmFormData);
      setIsUtmCreateOpen(false);
      resetUtmForm();
    } catch (error) {
      console.error('Erro ao criar link UTM:', error);
    }
  };

  const handleEditUtmLink = async () => {
    if (!selectedPage || !selectedUtmLink) return;
    
    try {
      await updateUtmLink(selectedPage.id, selectedUtmLink.id, utmFormData);
      setIsUtmEditOpen(false);
      resetUtmForm();
      setSelectedUtmLink(null);
    } catch (error) {
      console.error('Erro ao editar link UTM:', error);
    }
  };

  const handleDeleteUtmLink = async (utmLinkId: string) => {
    if (!selectedPage) return;
    
    try {
      await deleteUtmLink(selectedPage.id, utmLinkId);
    } catch (error) {
      console.error('Erro ao excluir link UTM:', error);
    }
  };

  const handleCopyUtmLink = async (url: string, utmLinkId: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLinks(prev => ({ ...prev, [utmLinkId]: true }));
      setTimeout(() => {
        setCopiedLinks(prev => ({ ...prev, [utmLinkId]: false }));
      }, 2000);
    } catch (error) {
      console.error('Erro ao copiar link:', error);
    }
  };

  // Atualizar página selecionada quando a lista for atualizada
  useEffect(() => {
    if (selectedPage && pages.length > 0) {
      const updatedPage = pages.find(p => p.id === selectedPage.id);
      if (updatedPage) {
        setSelectedPage(updatedPage);
      }
    }
  }, [pages, selectedPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando páginas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erro: {error}</p>
          <Button onClick={refetch}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Páginas da Empresa</h1>
            <p className="text-muted-foreground">
              Gerencie suas páginas sociais e links UTM
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Página
          </Button>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Nome ou URL..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="platform">Plataforma</Label>
                <Select value={platformFilter} onValueChange={setPlatformFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as plataformas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as plataformas</SelectItem>
                    {PLATFORMS.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="active">Ativas</SelectItem>
                    <SelectItem value="inactive">Inativas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button variant="outline" onClick={refetch} className="w-full">
                  Atualizar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Páginas */}
        <Card>
          <CardHeader>
            <CardTitle>Páginas ({filteredPages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Plataforma</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Links UTM</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">{page.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {PLATFORMS.find(p => p.value === page.platform)?.label || page.platform}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[200px]">{page.url}</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(page.url, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Abrir página</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {CATEGORIES.find(c => c.value === page.category)?.label || page.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={page.isActive ? "default" : "secondary"}>
                        {page.isActive ? "Ativa" : "Inativa"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {page.utmLinks.length} links
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewPage(page)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Visualizar</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewAnalytics(page)}
                            >
                              <BarChart3 className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver métricas</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditPage(page)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(page)}
                            >
                              {page.isActive ? (
                                <PowerOff className="w-4 h-4" />
                              ) : (
                                <Power className="w-4 h-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{page.isActive ? 'Desativar' : 'Ativar'}</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePage(page)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Excluir</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredPages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Nenhuma página encontrada com os filtros aplicados.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de Criação */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Página</DialogTitle>
              <DialogDescription>
                Crie uma nova página da empresa para gerenciar links UTM e métricas.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">Nome da Página *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: ImpulseGram Oficial"
                />
              </div>
              
              <div>
                <Label htmlFor="platform">Plataforma *</Label>
                <Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://www.instagram.com/impulsegram.oficial/"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição da página (opcional)"
                />
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isActive">Página ativa</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate}>
                Criar Página
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Visualização */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0">
            <DialogHeader className="flex-shrink-0 p-6 pb-4 border-b">
              <DialogTitle>{selectedPage?.name}</DialogTitle>
              <DialogDescription>
                Detalhes da página e gerenciamento de links UTM
              </DialogDescription>
            </DialogHeader>

            {selectedPage && (
              <div className="flex-1 overflow-y-auto px-6">
                <Tabs defaultValue={defaultTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4 mt-4">
                    <TabsTrigger value="details">Detalhes</TabsTrigger>
                    <TabsTrigger value="utm">Links UTM</TabsTrigger>
                    <TabsTrigger value="metrics">Métricas</TabsTrigger>
                  </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Informações Básicas</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <Label className="text-sm font-medium">Nome:</Label>
                          <p className="text-sm">{selectedPage.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Plataforma:</Label>
                          <p className="text-sm">
                            {PLATFORMS.find(p => p.value === selectedPage.platform)?.label || selectedPage.platform}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">URL:</Label>
                          <div className="flex items-center gap-2">
                            <p className="text-sm truncate flex-1">{selectedPage.url}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(selectedPage.url, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Categoria:</Label>
                          <p className="text-sm">
                            {CATEGORIES.find(c => c.value === selectedPage.category)?.label || selectedPage.category}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Status:</Label>
                          <Badge variant={selectedPage.isActive ? "default" : "secondary"}>
                            {selectedPage.isActive ? "Ativa" : "Inativa"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">UTM Source</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="p-3 bg-gray-50 rounded">
                          <p className="text-sm font-mono">{selectedPage.utmSource}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Este é o utm_source que será usado em todos os links UTM desta página.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {selectedPage.description && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Descrição</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{selectedPage.description}</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="utm" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Links UTM ({selectedPage.utmLinks.length})</h3>
                    <Button onClick={() => setIsUtmCreateOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Link UTM
                    </Button>
                  </div>
                    {selectedPage.utmLinks.map((utmLink) => (
                      <Card key={utmLink.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{utmLink.name}</CardTitle>
                              <CardDescription>
                                {UTM_MEDIUMS.find(m => m.value === utmLink.utmMedium)?.label || utmLink.utmMedium} • {utmLink.utmCampaign}
                              </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={utmLink.isActive ? "default" : "secondary"}>
                                {utmLink.isActive ? "Ativo" : "Inativo"}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedUtmLink(utmLink);
                                  setUtmFormData({
                                    name: utmLink.name,
                                    description: utmLink.description || '',
                                    utmMedium: utmLink.utmMedium,
                                    utmCampaign: utmLink.utmCampaign,
                                    isActive: utmLink.isActive,
                                  });
                                  setIsUtmEditOpen(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUtmLink(utmLink.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {utmLink.description && (
                              <p className="text-sm text-muted-foreground">{utmLink.description}</p>
                            )}
                            
                            <div className="p-3 bg-gray-50 rounded w-full max-w-md">
                              <p className="text-xs text-muted-foreground mb-2">Link UTM Completo:</p>
                              <div className="flex items-center gap-2 w-full">
                                <div className="flex-1 min-w-0 max-w-[calc(100%-60px)]">
                                  <p
                                    className="text-sm font-mono"
                                    title={utmLink.fullUrl}
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
                                    {utmLink.fullUrl}
                                  </p>
                                </div>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleCopyUtmLink(utmLink.fullUrl, utmLink.id)}
                                      className="shrink-0 flex-shrink-0 w-8 h-8 p-0"
                                    >
                                      {copiedLinks[utmLink.id] ? (
                                        <Check className="w-4 h-4 text-green-600" />
                                      ) : (
                                        <Copy className="w-4 h-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{copiedLinks[utmLink.id] ? 'Copiado!' : 'Copiar link UTM'}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {selectedPage.utmLinks.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          Nenhum link UTM criado para esta página.
                        </p>
                        <Button 
                          className="mt-4" 
                          onClick={() => setIsUtmCreateOpen(true)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Criar Primeiro Link UTM
                        </Button>
                      </div>
                    )}
                </TabsContent>
                
                <TabsContent value="metrics" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Métricas da Página</h3>
                    <Select value={analyticsPeriod} onValueChange={setAnalyticsPeriod}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PERIODS.map((period) => (
                          <SelectItem key={period.value} value={period.value}>
                            {period.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {analyticsLoading || utmMetricsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : analytics.length > 0 ? (
                    <div className="space-y-6">
                      {/* Métricas Gerais */}
                      <div>
                        <h4 className="text-lg font-semibold mb-4">Resumo Geral</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {(analytics[0].totalSales / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
                              <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">{analytics[0].totalOrders}</div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                              <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {(analytics[0].conversionRate * 100).toFixed(1)}%
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {(analytics[0].averageOrderValue / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Métricas por Link UTM */}
                      {(() => {
                        console.log('🔍 [PagesAdmin] Verificando se deve renderizar métricas UTM:', {
                          utmMetricsLength: utmMetrics.length,
                          utmMetrics,
                          utmMetricsLoading,
                          utmMetricsError
                        });
                        return utmMetrics.length > 0;
                      })() && (
                        <div>
                          <h4 className="text-lg font-semibold mb-4">Métricas por Link UTM</h4>
                          <div className="space-y-4">
                            {utmMetrics.map((utmData) => (
                              <Card key={utmData.utmLink.id}>
                                <CardHeader>
                                  <CardTitle className="text-lg flex items-center gap-2">
                                    <Badge variant="outline" className="text-sm">
                                      {UTM_MEDIUMS.find(m => m.value === utmData.utmLink.utmMedium)?.label || utmData.utmLink.utmMedium}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                      {utmData.utmLink.utmCampaign}
                                    </span>
                                  </CardTitle>
                                  <CardDescription>
                                    {utmData.utmLink.name}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-green-600">
                                        {(utmData.metrics.totalRevenue / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                      </div>
                                      <div className="text-sm text-muted-foreground">Receita Total</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-blue-600">
                                        {utmData.metrics.totalOrders}
                                      </div>
                                      <div className="text-sm text-muted-foreground">Pedidos</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-purple-600">
                                        {utmData.metrics.conversionRate.toFixed(1)}%
                                      </div>
                                      <div className="text-sm text-muted-foreground">Conversão</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-orange-600">
                                        {(utmData.metrics.averageOrderValue / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                      </div>
                                      <div className="text-sm text-muted-foreground">Ticket Médio</div>
                                    </div>
                                  </div>
                                  
                                  {/* Link UTM completo */}
                                  <div className="mt-4 p-3 bg-gray-50 rounded">
                                    <p className="text-xs text-muted-foreground mb-2">Link UTM Completo:</p>
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 min-w-0">
                                        <p
                                          className="text-sm font-mono truncate"
                                          title={utmData.utmLink.fullUrl}
                                        >
                                          {utmData.utmLink.fullUrl}
                                        </p>
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          navigator.clipboard.writeText(utmData.utmLink.fullUrl);
                                          setCopiedLinks(prev => ({ ...prev, [utmData.utmLink.id]: true }));
                                          setTimeout(() => {
                                            setCopiedLinks(prev => ({ ...prev, [utmData.utmLink.id]: false }));
                                          }, 2000);
                                        }}
                                        className="shrink-0"
                                      >
                                        {copiedLinks[utmData.utmLink.id] ? (
                                          <Check className="w-4 h-4 text-green-600" />
                                        ) : (
                                          <Copy className="w-4 h-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Pedidos detalhados */}
                                  {utmData.metrics.orders.length > 0 && (
                                    <div className="mt-4">
                                      <h5 className="font-medium mb-2">Pedidos Recentes:</h5>
                                      <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {utmData.metrics.orders.slice(0, 5).map((order) => (
                                          <div key={order.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                                            <div>
                                              <div className="font-medium">Pedido #{order.id.slice(-8)}</div>
                                              <div className="text-xs text-muted-foreground">
                                                {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                                              </div>
                                            </div>
                                            <div className="text-right">
                                              <div className="font-medium">
                                                {(order.amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                              </div>
                                              <Badge 
                                                variant={order.status === 'approved' ? 'default' : 'secondary'}
                                                className="text-xs"
                                              >
                                                {order.status === 'approved' ? 'Aprovado' : order.status}
                                              </Badge>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {utmMetricsError && (
                        <div className="text-center py-4">
                          <p className="text-red-500 text-sm">
                            Erro ao carregar métricas por UTM: {utmMetricsError}
                          </p>
                        </div>
                      )}

                      {/* Debug: Mostrar informações quando não há métricas */}
                      {!utmMetricsLoading && utmMetrics.length === 0 && !utmMetricsError && (
                        <div className="text-center py-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-yellow-800 text-sm mb-2">
                            Debug: Nenhuma métrica UTM encontrada
                          </p>
                          <p className="text-xs text-yellow-600">
                            selectedPage: {selectedPage?.id} | 
                            utmMetrics.length: {utmMetrics.length} | 
                            loading: {utmMetricsLoading.toString()}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Nenhuma métrica disponível para o período selecionado.
                      </p>
                    </div>
                  )}
                </TabsContent>
                </Tabs>
              </div>
            )}

            <DialogFooter className="flex-shrink-0 p-6 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Edição */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Página</DialogTitle>
              <DialogDescription>
                Atualize as informações da página.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="edit-name">Nome da Página *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: ImpulseGram Oficial"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-platform">Plataforma *</Label>
                <Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-category">Categoria *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="edit-url">URL *</Label>
                <Input
                  id="edit-url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://www.instagram.com/impulsegram.oficial/"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="edit-description">Descrição</Label>
                <Input
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição da página (opcional)"
                />
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="edit-isActive">Página ativa</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEdit}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Exclusão */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir Página</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir a página "{selectedPage?.name}"? 
                Esta ação não pode ser desfeita e todos os links UTM associados serão removidos.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Criação de Link UTM */}
        <Dialog open={isUtmCreateOpen} onOpenChange={setIsUtmCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Link UTM</DialogTitle>
              <DialogDescription>
                Crie um novo link UTM para a página "{selectedPage?.name}".
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="utm-name">Nome do Link *</Label>
                <Input
                  id="utm-name"
                  value={utmFormData.name}
                  onChange={(e) => setUtmFormData({ ...utmFormData, name: e.target.value })}
                  placeholder="Ex: Stories Promocional"
                />
              </div>
              
              <div>
                <Label htmlFor="utm-medium">UTM Medium *</Label>
                <Select value={utmFormData.utmMedium} onValueChange={(value) => setUtmFormData({ ...utmFormData, utmMedium: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o medium" />
                  </SelectTrigger>
                  <SelectContent>
                    {UTM_MEDIUMS.map((medium) => (
                      <SelectItem key={medium.value} value={medium.value}>
                        {medium.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="utm-campaign">UTM Campaign *</Label>
                <Input
                  id="utm-campaign"
                  value={utmFormData.utmCampaign}
                  onChange={(e) => setUtmFormData({ ...utmFormData, utmCampaign: e.target.value })}
                  placeholder="Ex: promocao-janeiro"
                />
              </div>
              
              <div>
                <Label htmlFor="utm-description">Descrição</Label>
                <Input
                  id="utm-description"
                  value={utmFormData.description}
                  onChange={(e) => setUtmFormData({ ...utmFormData, description: e.target.value })}
                  placeholder="Descrição do link (opcional)"
                />
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="utm-isActive"
                    checked={utmFormData.isActive}
                    onChange={(e) => setUtmFormData({ ...utmFormData, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="utm-isActive">Link ativo</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUtmCreateOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateUtmLink}>
                Criar Link UTM
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Edição de Link UTM */}
        <Dialog open={isUtmEditOpen} onOpenChange={setIsUtmEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Link UTM</DialogTitle>
              <DialogDescription>
                Atualize as informações do link UTM.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-utm-name">Nome do Link *</Label>
                <Input
                  id="edit-utm-name"
                  value={utmFormData.name}
                  onChange={(e) => setUtmFormData({ ...utmFormData, name: e.target.value })}
                  placeholder="Ex: Stories Promocional"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-utm-medium">UTM Medium *</Label>
                <Select value={utmFormData.utmMedium} onValueChange={(value) => setUtmFormData({ ...utmFormData, utmMedium: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o medium" />
                  </SelectTrigger>
                  <SelectContent>
                    {UTM_MEDIUMS.map((medium) => (
                      <SelectItem key={medium.value} value={medium.value}>
                        {medium.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-utm-campaign">UTM Campaign *</Label>
                <Input
                  id="edit-utm-campaign"
                  value={utmFormData.utmCampaign}
                  onChange={(e) => setUtmFormData({ ...utmFormData, utmCampaign: e.target.value })}
                  placeholder="Ex: promocao-janeiro"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-utm-description">Descrição</Label>
                <Input
                  id="edit-utm-description"
                  value={utmFormData.description}
                  onChange={(e) => setUtmFormData({ ...utmFormData, description: e.target.value })}
                  placeholder="Descrição do link (opcional)"
                />
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-utm-isActive"
                    checked={utmFormData.isActive}
                    onChange={(e) => setUtmFormData({ ...utmFormData, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="edit-utm-isActive">Link ativo</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUtmEditOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditUtmLink}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </TooltipProvider>
  );
};

export default PagesAdmin;

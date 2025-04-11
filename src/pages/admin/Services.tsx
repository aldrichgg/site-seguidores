import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MoreHorizontal, 
  PlusSquare, 
  Edit, 
  Trash2 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Dados de serviços fictícios
const MOCK_SERVICES = [
  {
    id: "SRV-001",
    name: "1000 Seguidores Instagram",
    platform: "Instagram",
    price: 29.90,
    deliveryTime: "24 horas",
    status: "Ativo"
  },
  {
    id: "SRV-002",
    name: "5000 Curtidas Facebook",
    platform: "Facebook",
    price: 89.90,
    deliveryTime: "48 horas",
    status: "Ativo"
  },
  {
    id: "SRV-003",
    name: "3000 Visualizações YouTube",
    platform: "YouTube",
    price: 59.90,
    deliveryTime: "72 horas",
    status: "Inativo"
  },
  {
    id: "SRV-004",
    name: "10000 Seguidores TikTok",
    platform: "TikTok",
    price: 159.90,
    deliveryTime: "96 horas",
    status: "Ativo"
  }
];

const Services = () => {
  const [services, setServices] = useState(MOCK_SERVICES);
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Função para adicionar serviço
  const handleAddService = () => {
    // Lógica para adicionar serviço
    /* console.log("Adicionando serviço"); */
    setIsAddServiceDialogOpen(false);
  };

  // Função para editar serviço
  const handleEditService = (service) => {
    setSelectedService(service);
    // Lógica para editar serviço
    /* console.log(`Editando serviço ${service.id}`); */
  };

  // Função para excluir serviço
  const handleDeleteService = (service) => {
    // Lógica para excluir serviço
    /* console.log(`Excluindo serviço ${service.id}`); */
    setServices(services.filter(s => s.id !== service.id));
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Serviços</h1>
          <p className="text-muted-foreground">Gerencie seus pacotes de seguidores e engajamento</p>
        </div>
        <Button onClick={() => setIsAddServiceDialogOpen(true)}>
          <PlusSquare className="mr-2 h-4 w-4" />
          Adicionar Serviço
        </Button>
      </div>

      {/* Tabela de Serviços */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome do Serviço</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Tempo de Entrega</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.id}</TableCell>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.platform}</TableCell>
                  <TableCell>R$ {service.price.toFixed(2)}</TableCell>
                  <TableCell>{service.deliveryTime}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={service.status === "Ativo" ? "default" : "secondary"}
                    >
                      {service.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditService(service)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteService(service)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo de Adicionar Serviço */}
      <Dialog open={isAddServiceDialogOpen} onOpenChange={setIsAddServiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Serviço</DialogTitle>
            <DialogDescription>
              Crie um novo pacote de seguidores ou engajamento
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome do Serviço
              </Label>
              <Input 
                id="name" 
                placeholder="Ex: 1000 Seguidores Instagram" 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="platform" className="text-right">
                Plataforma
              </Label>
              <Input 
                id="platform" 
                placeholder="Instagram, Facebook, etc" 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Preço
              </Label>
              <Input 
                id="price" 
                type="number" 
                placeholder="Valor do serviço" 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deliveryTime" className="text-right">
                Tempo de Entrega
              </Label>
              <Input 
                id="deliveryTime" 
                placeholder="Ex: 24 horas" 
                className="col-span-3" 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleAddService}
            >
              Adicionar Serviço
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services; 
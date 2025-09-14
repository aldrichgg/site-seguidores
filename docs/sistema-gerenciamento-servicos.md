# 🚀 Sistema de Gerenciamento de Planos e Serviços

## 📋 Visão Geral

Este documento explica como implementar um sistema completo de gerenciamento de planos e serviços para o site ImpulseGram, permitindo controlar preços, planos e serviços diretamente pelo painel administrativo.

## 🏗️ Arquitetura

- **Frontend**: React + TypeScript
- **Backend**: NestJS + Firebase Firestore
- **Banco de Dados**: Firebase Firestore
- **Autenticação**: Firebase Auth

## 📊 Estrutura do Banco de Dados (Firestore)

### Coleção: `services`

```javascript
// Documento: services/{serviceId}
{
  id: "service_001",
  name: "1000 Seguidores Instagram",
  platform: "instagram", // instagram, youtube, tiktok
  serviceType: "seguidores", // seguidores, curtidas, visualizacoes, inscritos
  quantity: 1000,
  price: 47.30,
  originalPrice: 83.90,
  features: [
    "Contas reais e ativas",
    "Entrega gradual e natural",
    "Garantia de reposição",
    "Suporte prioritário"
  ],
  isPopular: true,
  isRecommended: false,
  isActive: true,
  deliveryTime: "24 horas",
  serviceId: 597, // ID único para integração
  sortOrder: 1,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 🔧 Implementação Backend (NestJS)

### 1. Instalação de Dependências

```bash
npm install @nestjs/firebase firebase-admin
npm install class-validator class-transformer
```

### 2. Configuração do Firebase

```typescript
// src/config/firebase.config.ts
import { Module } from '@nestjs/common';
import { FirebaseModule } from '@nestjs/firebase';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    FirebaseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        projectId: configService.get('FIREBASE_PROJECT_ID'),
        privateKey: configService.get('FIREBASE_PRIVATE_KEY'),
        clientEmail: configService.get('FIREBASE_CLIENT_EMAIL'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class FirebaseConfigModule {}
```

### 3. Endpoints da API (Já Implementados)

**Base URL:** `http://localhost:3000/services`

#### Rotas Disponíveis:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/services` | Listar todos os serviços (com filtros) |
| `GET` | `/services/:id` | Buscar serviço por ID |
| `GET` | `/services/by-service-id/:serviceId` | Buscar por serviceId |
| `POST` | `/services` | Criar novo serviço |
| `PATCH` | `/services/:id` | Atualizar serviço |
| `PATCH` | `/services/:id/toggle` | Alternar status ativo/inativo |
| `DELETE` | `/services/:id` | Deletar serviço |

#### Exemplos de Uso:

```bash
# Buscar todos os serviços
curl -X GET "http://localhost:3000/services"

# Buscar serviços do Instagram
curl -X GET "http://localhost:3000/services?platform=instagram"

# Buscar seguidores do Instagram
curl -X GET "http://localhost:3000/services?platform=instagram&serviceType=seguidores"

# Buscar por serviceId (para integração com pagamentos)
curl -X GET "http://localhost:3000/services/by-service-id/597"
```

### 4. DTOs (Data Transfer Objects)

```typescript
// src/services/dto/create-service.dto.ts
import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, IsEnum } from 'class-validator';

export enum Platform {
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
  TIKTOK = 'tiktok',
}

export enum ServiceType {
  SEGUIDORES = 'seguidores',
  CURTIDAS = 'curtidas',
  VISUALIZACOES = 'visualizacoes',
  INSCRITOS = 'inscritos',
}

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsEnum(Platform)
  platform: Platform;

  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsNumber()
  originalPrice: number;

  @IsArray()
  @IsString({ each: true })
  features: string[];

  @IsBoolean()
  @IsOptional()
  isPopular?: boolean;

  @IsBoolean()
  @IsOptional()
  isRecommended?: boolean;

  @IsString()
  @IsOptional()
  deliveryTime?: string;

  @IsNumber()
  serviceId: number;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}
```

```typescript
// src/services/dto/update-service.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
```

### 5. Interface do Serviço

```typescript
// src/services/interfaces/service.interface.ts
export interface Service {
  id: string;
  name: string;
  platform: string;
  serviceType: string;
  quantity: number;
  price: number;
  originalPrice: number;
  features: string[];
  isPopular: boolean;
  isRecommended: boolean;
  isActive: boolean;
  deliveryTime: string;
  serviceId: number;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### 6. Serviço (Service)

```typescript
// src/services/services.service.ts
import { Injectable } from '@nestjs/common';
import { InjectFirebaseAdmin } from '@nestjs/firebase';
import { Firestore } from 'firebase-admin/firestore';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './interfaces/service.interface';

@Injectable()
export class ServicesService {
  constructor(
    @InjectFirebaseAdmin()
    private readonly firestore: Firestore,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const serviceData = {
      ...createServiceDto,
      isActive: true,
      sortOrder: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await this.firestore.collection('services').add(serviceData);
    
    return {
      id: docRef.id,
      ...serviceData,
    };
  }

  async findAll(platform?: string, serviceType?: string): Promise<Service[]> {
    let query = this.firestore
      .collection('services')
      .where('isActive', '==', true)
      .orderBy('sortOrder', 'asc');

    if (platform) {
      query = query.where('platform', '==', platform);
    }

    if (serviceType) {
      query = query.where('serviceType', '==', serviceType);
    }

    const snapshot = await query.get();
    const services: Service[] = [];

    snapshot.forEach((doc) => {
      services.push({
        id: doc.id,
        ...doc.data(),
      } as Service);
    });

    return services;
  }

  async findOne(id: string): Promise<Service> {
    const doc = await this.firestore.collection('services').doc(id).get();
    
    if (!doc.exists) {
      throw new Error('Serviço não encontrado');
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as Service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const updateData = {
      ...updateServiceDto,
      updatedAt: new Date(),
    };

    await this.firestore.collection('services').doc(id).update(updateData);
    
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.firestore.collection('services').doc(id).delete();
  }

  async toggleActive(id: string): Promise<Service> {
    const service = await this.findOne(id);
    const newStatus = !service.isActive;

    await this.firestore.collection('services').doc(id).update({
      isActive: newStatus,
      updatedAt: new Date(),
    });

    return this.findOne(id);
  }
}
```

### 7. Controller

```typescript
// src/services/services.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  findAll(
    @Query('platform') platform?: string,
    @Query('serviceType') serviceType?: string,
  ) {
    return this.servicesService.findAll(platform, serviceType);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }

  @Patch(':id/toggle')
  toggleActive(@Param('id') id: string) {
    return this.servicesService.toggleActive(id);
  }
}
```

### 8. Módulo

```typescript
// src/services/services.module.ts
import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { FirebaseConfigModule } from '../config/firebase.config';

@Module({
  imports: [FirebaseConfigModule],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
```

## 🎛️ Implementação Frontend

### 1. Integração com API Existente

Como sua API já está funcionando, você pode integrar diretamente com os endpoints disponíveis:

#### Hook para Consumir a API

```typescript
// src/hooks/useServices.ts
import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3000/services'; // ou sua URL de produção

export const useServices = (platform?: string, serviceType?: string) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        if (platform) params.append('platform', platform);
        if (serviceType) params.append('serviceType', serviceType);
        
        const response = await fetch(`${API_BASE_URL}?${params}`);
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError(err.message);
        console.error('Erro ao buscar serviços:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [platform, serviceType]);

  return { services, loading, error };
};

// Hook para buscar serviço por serviceId (usado no pagamento)
export const useServiceByServiceId = (serviceId: number) => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!serviceId) {
      setService(null);
      setLoading(false);
      return;
    }

    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/by-service-id/${serviceId}`);
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setService(data);
      } catch (err) {
        setError(err.message);
        console.error('Erro ao buscar serviço:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  return { service, loading, error };
};
```

### 2. Hook para Serviços (Firebase - Alternativo)

```typescript
// src/hooks/useServices.ts
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const useServices = (platform: string, serviceType: string) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!platform || !serviceType) {
      setServices([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'services'),
      where('platform', '==', platform),
      where('serviceType', '==', serviceType),
      where('isActive', '==', true),
      orderBy('sortOrder', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const servicesData = [];
      snapshot.forEach((doc) => {
        servicesData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setServices(servicesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [platform, serviceType]);

  return { services, loading };
};
```

### 3. Modificação da Página Principal

```typescript
// src/pages/Index.tsx
import { useServices } from '@/hooks/useServices';

const Index = () => {
  const [activeTab, setActiveTab] = useState("instagram");
  const [activeServiceType, setActiveServiceType] = useState("seguidores");
  
  const { services, loading } = useServices(activeTab, activeServiceType);

  // Função para obter ícone baseado na plataforma
  const getIconForPlatform = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <InstagramIcon className="w-6 h-6 text-[#E1306C]" />;
      case 'youtube':
        return <YoutubeIcon className="w-6 h-6 text-[#FF0000]" />;
      case 'tiktok':
        return <TikTokIcon className="w-6 h-6 text-black" />;
      default:
        return <InstagramIcon className="w-6 h-6 text-[#E1306C]" />;
    }
  };

  // Converter serviços do Firebase para o formato esperado pelo componente
  const currentPackages = services.map(service => ({
    icon: getIconForPlatform(service.platform),
    title: service.name,
    platform: service.platform,
    price: `R$${service.price.toFixed(2).replace('.', ',')}`,
    originalPrice: `R$${service.originalPrice.toFixed(2).replace('.', ',')}`,
    features: service.features,
    popular: service.isPopular,
    recommended: service.isRecommended,
    delay: 150 + (service.sortOrder * 50), // Delay baseado na ordem
    serviceId: service.serviceId,
    type: service.serviceType
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // ... resto do componente permanece igual
};
```

### 4. Painel Admin - Lista de Serviços

#### Usando a API NestJS (Recomendado)

```typescript
// src/pages/admin/Services.tsx
import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3000/services';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPlatform, setFilterPlatform] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Erro ao buscar serviços');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleToggleService = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/toggle`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Erro ao alterar status');
      
      // Atualizar lista local
      setServices(services.map(service => 
        service.id === id 
          ? { ...service, isActive: !service.isActive }
          : service
      ));
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este serviço?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao deletar serviço');
      
      // Remover da lista local
      setServices(services.filter(service => service.id !== id));
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  const filteredServices = services.filter(service => {
    if (filterPlatform && service.platform !== filterPlatform) return false;
    if (filterType && service.serviceType !== filterType) return false;
    return true;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Gerenciar Serviços</h1>
        
        {/* Filtros */}
        <div className="flex gap-4 mb-4">
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">Todas as plataformas</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="tiktok">TikTok</option>
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">Todos os tipos</option>
            <option value="seguidores">Seguidores</option>
            <option value="curtidas">Curtidas</option>
            <option value="visualizacoes">Visualizações</option>
            <option value="inscritos">Inscritos</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      ) : (
        /* Tabela de serviços */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plataforma
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServices.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {service.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {service.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {service.serviceType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    R$ {service.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      service.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleToggleService(service.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      {service.isActive ? 'Desativar' : 'Ativar'}
                    </button>
                    <button 
                      onClick={() => handleDeleteService(service.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Services;
```

#### Usando Firebase Diretamente (Alternativo)

```typescript
// src/pages/admin/Services.tsx
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPlatform, setFilterPlatform] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'services'),
      orderBy('sortOrder', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const servicesData = [];
      snapshot.forEach((doc) => {
        servicesData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setServices(servicesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredServices = services.filter(service => {
    if (filterPlatform && service.platform !== filterPlatform) return false;
    if (filterType && service.serviceType !== filterType) return false;
    return true;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Gerenciar Serviços</h1>
        
        {/* Filtros */}
        <div className="flex gap-4 mb-4">
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">Todas as plataformas</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="tiktok">TikTok</option>
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">Todos os tipos</option>
            <option value="seguidores">Seguidores</option>
            <option value="curtidas">Curtidas</option>
            <option value="visualizacoes">Visualizações</option>
            <option value="inscritos">Inscritos</option>
          </select>
        </div>
      </div>

      {/* Tabela de serviços */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plataforma
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredServices.map((service) => (
              <tr key={service.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {service.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {service.platform}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {service.serviceType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  R$ {service.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    service.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {service.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                    Editar
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Services;
```

## 🔐 Configuração de Segurança

### Regras do Firestore

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Serviços - leitura pública, escrita apenas para admins
    match /services/{serviceId} {
      allow read: if true; // Qualquer um pode ler
      allow write: if request.auth != null && 
                     request.auth.token.admin == true; // Apenas admins podem escrever
    }
  }
}
```

### Variáveis de Ambiente

```bash
# .env
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-projeto.iam.gserviceaccount.com
```

## 📊 Migração de Dados Existentes

### Script para Migrar Serviços do Código para a API

```typescript
// scripts/migrate-services.ts
const services = [
  // Instagram Seguidores
  {
    name: "200 Seguidores",
    platform: "instagram",
    serviceType: "seguidores",
    quantity: 200,
    price: 19.90,
    originalPrice: 29.90,
    features: [
      "Contas reais e ativas",
      "Entrega gradual e natural",
      "Garantia de reposição",
      "Suporte prioritário"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "24 horas",
    serviceId: 597,
    sortOrder: 1
  },
  {
    name: "500 Seguidores",
    platform: "instagram",
    serviceType: "seguidores",
    quantity: 500,
    price: 28.90,
    originalPrice: 48.90,
    features: [
      "Contas reais e ativas",
      "Entrega gradual e natural",
      "Garantia de reposição",
      "Suporte prioritário"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "24 horas",
    serviceId: 597,
    sortOrder: 2
  },
  {
    name: "1.000 Seguidores",
    platform: "instagram",
    serviceType: "seguidores",
    quantity: 1000,
    price: 47.30,
    originalPrice: 83.90,
    features: [
      "Contas reais e ativas",
      "Entrega gradual e natural",
      "Garantia de reposição",
      "Suporte prioritário"
    ],
    isPopular: true,
    isRecommended: false,
    deliveryTime: "24 horas",
    serviceId: 597,
    sortOrder: 3
  },
  // Adicione todos os outros serviços aqui...
];

async function migrateServices() {
  const API_BASE_URL = 'http://localhost:3000/services';
  
  for (const service of services) {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(service)
      });
      
      if (response.ok) {
        console.log(`✅ Serviço migrado: ${service.name}`);
      } else {
        console.error(`❌ Erro ao migrar: ${service.name}`, await response.text());
      }
    } catch (error) {
      console.error(`❌ Erro ao migrar: ${service.name}`, error);
    }
  }
}

migrateServices();
```

### Executar Migração

```bash
# 1. Certifique-se que sua API está rodando
npm run start:dev

# 2. Execute o script de migração
npx ts-node scripts/migrate-services.ts
```

## 📋 Checklist de Implementação

### Backend (NestJS) ✅
- [x] Instalar dependências Firebase
- [x] Configurar Firebase Admin SDK
- [x] Criar DTOs de validação
- [x] Implementar ServicesService
- [x] Implementar ServicesController
- [x] Configurar módulo ServicesModule
- [x] Adicionar validações de entrada
- [x] Implementar tratamento de erros

### Frontend
- [ ] Criar hook useServices (com API)
- [ ] Modificar página Index.tsx
- [ ] Implementar painel admin
- [ ] Adicionar loading states
- [ ] Implementar tratamento de erros

### Migração
- [ ] Extrair dados do código atual
- [ ] Criar script de migração
- [ ] Executar migração
- [ ] Validar dados migrados
- [ ] Testar integração completa

## 🚀 Próximos Passos

Como sua API já está funcionando, você pode seguir estes passos:

1. **✅ Backend já está pronto** - Sua API NestJS está funcionando
2. **Migre os dados** - Use o script de migração para importar os serviços existentes
3. **Modifique o frontend** - Integre com sua API usando os hooks fornecidos
4. **Crie o painel admin** - Use o código de exemplo para gerenciar serviços
5. **Teste tudo** - Valide funcionamento completo

### Ordem de Implementação Recomendada:

1. **Primeiro**: Execute a migração de dados
2. **Segundo**: Modifique a página Index.tsx para usar a API
3. **Terceiro**: Implemente o painel admin
4. **Quarto**: Teste e ajuste conforme necessário

## 📚 Recursos Adicionais

- [Documentação NestJS](https://docs.nestjs.com/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Web SDK](https://firebase.google.com/docs/web/setup)

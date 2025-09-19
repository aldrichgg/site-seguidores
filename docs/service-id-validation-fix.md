# Correção do Problema de Service ID Null

## Problema Identificado

Alguns pedidos de 5000 seguidores (e outros serviços) estavam chegando com `service_id` null no banco de dados, causando problemas no processamento dos pedidos.

## Causas Identificadas

1. **Inicialização com ServiceId = 0**: A página de pagamento inicializava com `serviceId: 0`
2. **Perda do State na Navegação**: Se o usuário acessasse `/payment` diretamente ou perdesse o `location.state`
3. **Falta de Validação**: Não havia validação antes de enviar o pagamento

## Soluções Implementadas

### 1. Criado Utilitário de Validação (`src/utils/serviceIdMapper.ts`)

- **Integração com API existente** para buscar serviceIds dinamicamente
- **Funções de validação** para verificar se um serviceId é válido
- **Sistema de fallback assíncrono** para buscar serviceId baseado no título do serviço
- **Suporte a múltiplas plataformas**: Instagram, YouTube, TikTok
- **Busca dinâmica** usando a API `/services` existente

### 2. Validação na Página de Pagamento (`src/pages/Payment.tsx`)

#### Fallback Automático
```typescript
useEffect(() => {
  if (location.state && location.state.orderDetails) {
    setOrderDetails(location.state.orderDetails);
  } else {
    // Fallback: tentar determinar serviceId baseado no título atual usando API
    if (!isValidServiceId(orderDetails.serviceId) && currentTitle && currentPlatform) {
      getServiceIdWithFallback(
        orderDetails.serviceId,
        currentTitle,
        currentPlatform
      ).then(fallbackServiceId => {
        if (fallbackServiceId) {
          setOrderDetails(prev => ({
            ...prev,
            serviceId: fallbackServiceId
          }));
        }
      }).catch(error => {
        console.error('Erro ao buscar serviceId fallback:', error);
      });
    }
  }
}, [location, orderDetails.title, orderDetails.platform, orderDetails.serviceId]);
```

#### Validação Antes do Pagamento
```typescript
const handleConfirmPayment = async () => {
  // Validar se serviceId é válido antes de prosseguir usando API
  const finalServiceId = await getServiceIdWithFallback(
    orderDetails.serviceId,
    orderDetails.title,
    orderDetails.platform
  );

  if (!isValidServiceId(finalServiceId)) {
    console.error("ServiceId inválido:", {
      originalServiceId: orderDetails.serviceId,
      title: orderDetails.title,
      platform: orderDetails.platform
    });
    alert("Erro: Serviço não identificado. Por favor, selecione um serviço novamente.");
    navigate("/");
    return;
  }
  
  // ... resto do código
};
```

### 3. Validação no ServiceCard (`src/components/ServiceCard.tsx`)

```typescript
// Validar se serviceId é válido
if (!isValidServiceId(serviceId)) {
  console.error("ServiceId inválido no ServiceCard:", {
    serviceId,
    title,
    platform
  });
  alert("Erro: Serviço não identificado corretamente. Tente novamente.");
  return;
}
```

## Integração com API

A solução agora usa a API existente `/services` para buscar os serviceIds dinamicamente:

- **Endpoint**: `GET /services?platform={platform}&serviceType={serviceType}`
- **Busca por título**: Compara o título do serviço com os nomes retornados pela API
- **Busca por quantidade**: Compara a quantidade extraída do título com os serviços da API
- **Fallback automático**: Se o serviceId principal for inválido, busca na API usando o título

## Logs de Debug

A implementação foi otimizada para produção, removendo logs desnecessários para melhor performance.

## Testes

Criados testes unitários em `src/utils/__tests__/serviceIdMapper.test.ts` para garantir que:

- ✅ Mapeamento correto de títulos para serviceIds
- ✅ Validação de serviceIds
- ✅ Sistema de fallback funcionando
- ✅ Tratamento de casos edge

## Benefícios

1. **Eliminação de ServiceIds Null**: Garante que sempre haverá um serviceId válido
2. **Fallback Automático**: Se o serviceId principal falhar, usa o título como fallback
3. **Validação Múltipla**: Validação em diferentes pontos do fluxo
4. **Logs Detalhados**: Facilita o debug de problemas futuros
5. **Cobertura Completa**: Suporte a todas as plataformas e tipos de serviço

## Como Testar

1. **Teste Normal**: Navegue pelos ServiceCards normalmente
2. **Teste de Acesso Direto**: Acesse `/payment` diretamente
3. **Teste de Refresh**: Faça refresh na página de pagamento
4. **Teste de Fallback**: Simule um serviceId inválido

## Monitoramento

Para monitorar se o problema foi resolvido:

1. Monitore o banco de dados para serviceIds null
2. Verifique os logs da API de pagamento
3. Observe o comportamento dos usuários na página de pagamento

## Rollback

Se necessário, o rollback pode ser feito removendo:
- `src/utils/serviceIdMapper.ts`
- As importações e validações adicionadas
- Os testes relacionados

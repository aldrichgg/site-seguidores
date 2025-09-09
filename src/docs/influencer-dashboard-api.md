# API do Dashboard de Influenciador

## Endpoint: `/analytics/overview`

### Parâmetros de Query

- `period`: "week" | "month" | "year" (obrigatório)
- `utm_source`: string (opcional) - Nome de uma página específica (ex: "joao_instagram")
- `influencer_uid`: string (opcional) - UID do influenciador para buscar todas as páginas

### Exemplos de Requisições

#### 1. Dashboard geral do influenciador (todas as páginas)
```
GET /analytics/overview?period=week&influencer_uid=abc123def456
```

#### 2. Dashboard de uma página específica
```
GET /analytics/overview?period=week&utm_source=joao_instagram
```

#### 3. Mais exemplos de requisições

**Página específica:**
```
// Instagram semanal
GET /analytics/overview?period=week&utm_source=joao_instagram

// TikTok mensal  
GET /analytics/overview?period=month&utm_source=joao_tiktok

// Instagram anual
GET /analytics/overview?period=year&utm_source=joao_instagram
```

**Todas as páginas:**
```
// Todas as páginas semanal
GET /analytics/overview?period=week&influencer_uid=abc123def456

// Todas as páginas mensal
GET /analytics/overview?period=month&influencer_uid=abc123def456

// Todas as páginas anual
GET /analytics/overview?period=year&influencer_uid=abc123def456
```

### Estrutura do Usuário no Token JWT

O token JWT deve incluir as `profilePages` do usuário:

```json
{
  "user_id": "abc123def456",
  "email": "joao@exemplo.com",
  "name": "João Silva",
  "role": 2,
  "profilePages": [
    {
      "id": "page_1737360000000",
      "name": "joao_instagram",
      "platform": "Instagram",
      "url": "https://instagram.com/joao_silva",
      "createdAt": "2025-01-20T10:00:00.000Z"
    },
    {
      "id": "page_1737360000001",
      "name": "joao_tiktok",
      "platform": "TikTok",
      "url": "https://tiktok.com/@joao_silva",
      "createdAt": "2025-01-20T10:00:00.000Z"
    }
  ],
  "exp": 1640995200,
  "iat": 1640908800
}
```

### Lógica do Backend

1. **Verificar autenticação**: Validar o token JWT
2. **Verificar role**: Confirmar que o usuário tem `role: 2` (influenciador)
3. **Filtrar dados**:
   - Se `utm_source` está presente: buscar dados apenas dessa página específica
   - Se `influencer_uid` está presente: buscar dados de todas as páginas do influenciador
   - Se nenhum parâmetro: retornar erro ou dados vazios

### Exemplo de Query no Banco

```javascript
// Para uma página específica
db.orders.find({
  utm_source: "joao_instagram",
  createdAt: { $gte: startDate, $lte: endDate }
})

// Para todas as páginas do influenciador
db.orders.find({
  influencer_uid: "abc123def456",
  createdAt: { $gte: startDate, $lte: endDate }
})
```

### Resposta da API

A resposta deve seguir o mesmo formato do dashboard admin:

```json
{
  "kpis": {
    "totalSales": 125000,
    "ordersNew": 45,
    "pendingOrders": 12,
    "completedOrders": 33
  },
  "chart": {
    "categories": ["2025-01-20", "2025-01-21", ...],
    "sales": [12000, 15000, ...],
    "orders": [5, 7, ...]
  },
  "statusDonut": {
    "labels": ["Pago", "Pendente", "Cancelado"],
    "series": [33, 12, 0]
  },
  "topChannels": [
    {
      "name": "Instagram Followers",
      "count": 25,
      "sales": 50000
    }
  ],
  "metrics": {
    "conversionRate": 0.032,
    "avgTicket": 8500,
    "growthMoM": 0.125,
    "retentionRate": 0.85
  },
  "salesSources": {
    "site": { "orders": 20, "sales": 60000 },
    "chatbot": { "orders": 15, "sales": 45000 },
    "manual": { "orders": 10, "sales": 20000 },
    "unknown": { "orders": 0, "sales": 0 }
  },
  "salesSourcesPct": {
    "orders": { "site": 44, "chatbot": 33, "manual": 22, "unknown": 0 },
    "sales": { "site": 48, "chatbot": 36, "manual": 16, "unknown": 0 }
  },
  "period": "week",
  "range": {
    "start": "2025-01-20T00:00:00.000Z",
    "end": "2025-01-26T23:59:59.999Z"
  }
}
```

### Mapeamento de Origem das Vendas

Para influenciadores, o mapeamento das origens pode ser:

- `site`: Instagram
- `chatbot`: TikTok  
- `manual`: YouTube
- `unknown`: Outras plataformas

Ou você pode criar um mapeamento personalizado baseado nas `profilePages` do usuário.

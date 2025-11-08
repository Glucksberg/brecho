# API Endpoints - Retrô Carólis

Documentação completa de todos os endpoints do Backend #1 (Next.js API Routes).

## 📑 Índice

- [Autenticação](#autenticação)
- [Vendas](#vendas)
- [Produtos](#produtos)
- [Pagamentos](#pagamentos)
- [Caixa](#caixa)
- [Fornecedores](#fornecedores)
- [Empresas](#empresas)
- [Usuários](#usuários)
- [Analytics](#analytics)
- [Mercado Pago](#mercado-pago)

---

## 🔐 Autenticação

### POST `/api/auth/signin`
Realiza login de usuário (gerenciado pelo NextAuth.js).

**Body**:
```json
{
  "username": "string",
  "password": "string",
  "accountType": "DONO" | "ADMIN" | "VENDEDOR" | "CLIENTE"
}
```

**Resposta 200**:
```json
{
  "ok": true,
  "url": "/dashboard"
}
```

**Fluxo**:
- Se `accountType === "DONO"`: valida via License Portal (Backend #2)
- Caso contrário: valida no banco local com bcrypt

---

### POST `/api/auth/signout`
Realiza logout.

**Resposta 200**:
```json
{
  "ok": true
}
```

---

### GET `/api/auth/session`
Retorna sessão atual do usuário.

**Resposta 200**:
```json
{
  "user": {
    "id": "cuid...",
    "username": "joao123",
    "email": "joao@example.com",
    "role": "VENDEDOR",
    "companyId": "company_1"
  },
  "expires": "2025-12-08T10:00:00Z"
}
```

---

## 🛒 Vendas

### GET `/api/sales`
Lista vendas da empresa do usuário logado.

**Query Params**:
- `page`: número da página (padrão: 1)
- `limit`: itens por página (padrão: 20)
- `startDate`: filtrar por data inicial (ISO 8601)
- `endDate`: filtrar por data final (ISO 8601)
- `sellerId`: filtrar por vendedor

**Resposta 200**:
```json
{
  "sales": [
    {
      "id": "sale_123",
      "total": 130.00,
      "discount": 0,
      "createdAt": "2025-11-08T10:30:00Z",
      "seller": {
        "id": "user_1",
        "username": "maria"
      },
      "items": [
        {
          "productId": "prod_1",
          "productName": "Camisa",
          "quantity": 2,
          "price": 50.00
        }
      ],
      "payments": [
        {
          "method": "DINHEIRO",
          "amount": 80.00,
          "status": "APPROVED"
        }
      ]
    }
  ],
  "total": 45,
  "page": 1,
  "totalPages": 3
}
```

**Permissões**: ADMIN, DONO, VENDEDOR

---

### POST `/api/sales`
Cria nova venda.

**Body**:
```json
{
  "items": [
    {
      "productId": "prod_1",
      "quantity": 2,
      "price": 50.00
    }
  ],
  "payments": [
    {
      "method": "DINHEIRO",
      "amount": 100.00
    }
  ],
  "discount": 0,
  "customerId": "customer_1" // opcional
}
```

**Resposta 201**:
```json
{
  "id": "sale_123",
  "total": 100.00,
  "discount": 0,
  "items": [...],
  "payments": [...],
  "createdAt": "2025-11-08T10:30:00Z"
}
```

**Validações**:
- Produtos devem existir e ter estoque suficiente
- Soma dos pagamentos deve ser >= total da venda
- Vendedor deve ter caixa aberto

**Efeitos**:
- Atualiza estoque dos produtos
- Cria movimentação no caixa
- Se produto em consignação, registra pagamento pendente ao fornecedor

**Permissões**: ADMIN, DONO, VENDEDOR

---

### GET `/api/sales/[id]`
Retorna detalhes de uma venda específica.

**Resposta 200**:
```json
{
  "id": "sale_123",
  "total": 130.00,
  "discount": 0,
  "createdAt": "2025-11-08T10:30:00Z",
  "seller": {
    "id": "user_1",
    "username": "maria",
    "email": "maria@example.com"
  },
  "customer": {
    "id": "customer_1",
    "name": "João Silva"
  },
  "items": [...],
  "payments": [...],
  "cashRegister": {
    "id": "cash_1",
    "openedAt": "2025-11-08T08:00:00Z"
  }
}
```

**Permissões**: ADMIN, DONO, VENDEDOR

---

### DELETE `/api/sales/[id]`
Cancela uma venda (apenas se criada há menos de 24h).

**Resposta 200**:
```json
{
  "message": "Venda cancelada com sucesso",
  "sale": {
    "id": "sale_123",
    "status": "CANCELLED"
  }
}
```

**Efeitos**:
- Estorna estoque dos produtos
- Reverte movimentação do caixa
- Cancela pagamentos pendentes

**Permissões**: ADMIN, DONO

---

## 📦 Produtos

### GET `/api/products`
Lista produtos da empresa.

**Query Params**:
- `page`: número da página
- `limit`: itens por página
- `search`: busca por nome
- `category`: filtrar por categoria
- `inStock`: `true` para apenas com estoque
- `supplierId`: filtrar por fornecedor

**Resposta 200**:
```json
{
  "products": [
    {
      "id": "prod_1",
      "name": "Camisa Polo",
      "price": 45.00,
      "stock": 10,
      "category": "ROUPAS",
      "supplier": {
        "id": "supplier_1",
        "name": "Maria Fornecedora"
      },
      "consignment": false,
      "createdAt": "2025-10-01T10:00:00Z"
    }
  ],
  "total": 120,
  "page": 1,
  "totalPages": 6
}
```

**Permissões**: ADMIN, DONO, VENDEDOR

---

### POST `/api/products`
Cria novo produto.

**Body**:
```json
{
  "name": "Camisa Polo",
  "price": 45.00,
  "stock": 10,
  "category": "ROUPAS",
  "description": "Camisa polo azul tamanho M",
  "barcode": "7891234567890", // opcional
  "supplierId": "supplier_1", // opcional
  "consignment": false
}
```

**Resposta 201**:
```json
{
  "id": "prod_1",
  "name": "Camisa Polo",
  "price": 45.00,
  "stock": 10,
  "category": "ROUPAS",
  "companyId": "company_1",
  "createdAt": "2025-11-08T10:30:00Z"
}
```

**Permissões**: ADMIN, DONO, VENDEDOR

---

### GET `/api/products/[id]`
Retorna detalhes de um produto.

**Resposta 200**:
```json
{
  "id": "prod_1",
  "name": "Camisa Polo",
  "price": 45.00,
  "stock": 10,
  "category": "ROUPAS",
  "description": "...",
  "supplier": {...},
  "salesHistory": [
    {
      "saleId": "sale_1",
      "quantity": 2,
      "soldAt": "2025-11-01T10:00:00Z"
    }
  ]
}
```

**Permissões**: ADMIN, DONO, VENDEDOR

---

### PATCH `/api/products/[id]`
Atualiza produto.

**Body** (campos opcionais):
```json
{
  "name": "Camisa Polo Azul",
  "price": 50.00,
  "stock": 15
}
```

**Resposta 200**:
```json
{
  "id": "prod_1",
  "name": "Camisa Polo Azul",
  "price": 50.00,
  "stock": 15,
  "updatedAt": "2025-11-08T11:00:00Z"
}
```

**Permissões**: ADMIN, DONO

---

### DELETE `/api/products/[id]`
Remove produto (apenas se nunca foi vendido).

**Resposta 200**:
```json
{
  "message": "Produto removido com sucesso"
}
```

**Permissões**: ADMIN, DONO

---

## 💳 Pagamentos

### GET `/api/payments`
Lista pagamentos da empresa.

**Query Params**:
- `saleId`: filtrar por venda
- `method`: filtrar por método (DINHEIRO, PIX, CARTAO_CREDITO, etc.)
- `status`: filtrar por status (PENDING, APPROVED, REJECTED)

**Resposta 200**:
```json
{
  "payments": [
    {
      "id": "payment_1",
      "amount": 100.00,
      "method": "DINHEIRO",
      "status": "APPROVED",
      "saleId": "sale_1",
      "createdAt": "2025-11-08T10:30:00Z"
    }
  ]
}
```

**Permissões**: ADMIN, DONO, VENDEDOR

---

### POST `/api/payments`
Cria novo pagamento (geralmente associado a uma venda).

**Body**:
```json
{
  "saleId": "sale_123",
  "amount": 100.00,
  "method": "PIX",
  "mercadoPagoId": "mp_123" // opcional
}
```

**Resposta 201**:
```json
{
  "id": "payment_1",
  "amount": 100.00,
  "method": "PIX",
  "status": "APPROVED",
  "saleId": "sale_123"
}
```

**Permissões**: ADMIN, DONO, VENDEDOR

---

## 💰 Caixa

### GET `/api/cash-register`
Lista caixas da empresa.

**Query Params**:
- `status`: `open` ou `closed`
- `userId`: filtrar por vendedor

**Resposta 200**:
```json
{
  "cashRegisters": [
    {
      "id": "cash_1",
      "openedAt": "2025-11-08T08:00:00Z",
      "closedAt": null,
      "openingBalance": 100.00,
      "closingBalance": null,
      "user": {
        "id": "user_1",
        "username": "maria"
      },
      "movements": [
        {
          "type": "SALE",
          "amount": 130.00,
          "description": "Venda #123",
          "createdAt": "2025-11-08T10:30:00Z"
        }
      ]
    }
  ]
}
```

**Permissões**: ADMIN, DONO, VENDEDOR

---

### POST `/api/cash-register`
Abre um novo caixa.

**Body**:
```json
{
  "openingBalance": 100.00
}
```

**Resposta 201**:
```json
{
  "id": "cash_1",
  "openedAt": "2025-11-08T08:00:00Z",
  "openingBalance": 100.00,
  "userId": "user_1",
  "companyId": "company_1"
}
```

**Validações**:
- Usuário não pode ter outro caixa aberto

**Permissões**: ADMIN, DONO, VENDEDOR

---

### POST `/api/cash-register/[id]/close`
Fecha um caixa.

**Body**:
```json
{
  "closingBalance": 850.00
}
```

**Resposta 200**:
```json
{
  "id": "cash_1",
  "closedAt": "2025-11-08T18:00:00Z",
  "openingBalance": 100.00,
  "closingBalance": 850.00,
  "expectedBalance": 830.00,
  "difference": 20.00,
  "totalSales": 730.00
}
```

**Permissões**: ADMIN, DONO, VENDEDOR (apenas próprio caixa)

---

### POST `/api/cash-register/[id]/movements`
Adiciona movimentação ao caixa (sangria, suprimento, etc.).

**Body**:
```json
{
  "type": "WITHDRAWAL", // ou DEPOSIT
  "amount": 50.00,
  "description": "Sangria para troco"
}
```

**Resposta 201**:
```json
{
  "id": "movement_1",
  "type": "WITHDRAWAL",
  "amount": 50.00,
  "description": "Sangria para troco",
  "cashRegisterId": "cash_1",
  "createdAt": "2025-11-08T12:00:00Z"
}
```

**Permissões**: ADMIN, DONO, VENDEDOR

---

## 🤝 Fornecedores

### GET `/api/suppliers`
Lista fornecedores da empresa.

**Resposta 200**:
```json
{
  "suppliers": [
    {
      "id": "supplier_1",
      "name": "Maria Fornecedora",
      "phone": "(11) 98765-4321",
      "email": "maria@example.com",
      "productCount": 15,
      "totalPending": 450.00,
      "consignmentHoldDays": 30,
      "createdAt": "2025-10-01T10:00:00Z"
    }
  ]
}
```

**Permissões**: ADMIN, DONO, VENDEDOR

---

### POST `/api/suppliers`
Cria novo fornecedor.

**Body**:
```json
{
  "name": "Maria Fornecedora",
  "phone": "(11) 98765-4321",
  "email": "maria@example.com",
  "consignmentHoldDays": 30
}
```

**Resposta 201**:
```json
{
  "id": "supplier_1",
  "name": "Maria Fornecedora",
  "phone": "(11) 98765-4321",
  "email": "maria@example.com",
  "consignmentHoldDays": 30,
  "companyId": "company_1"
}
```

**Permissões**: ADMIN, DONO

---

### GET `/api/suppliers/[id]`
Retorna detalhes de um fornecedor.

**Resposta 200**:
```json
{
  "id": "supplier_1",
  "name": "Maria Fornecedora",
  "phone": "(11) 98765-4321",
  "products": [
    {
      "id": "prod_1",
      "name": "Camisa",
      "price": 45.00,
      "stock": 10,
      "consignment": true
    }
  ],
  "pendingPayments": [
    {
      "id": "pending_1",
      "amount": 200.00,
      "dueDate": "2025-12-08",
      "saleIds": ["sale_1", "sale_2"]
    }
  ],
  "totalPaid": 1500.00
}
```

**Permissões**: ADMIN, DONO

---

### POST `/api/suppliers/[id]/consignment`
Registra produtos em consignação.

**Body**:
```json
{
  "products": [
    {
      "name": "Camisa Polo",
      "price": 45.00,
      "quantity": 5
    }
  ]
}
```

**Resposta 201**:
```json
{
  "message": "Produtos registrados em consignação",
  "products": [
    {
      "id": "prod_new_1",
      "name": "Camisa Polo",
      "consignment": true,
      "consignmentHoldUntil": "2025-12-08T10:00:00Z"
    }
  ]
}
```

**Efeitos**:
- Cria produtos automaticamente
- Define período de retenção (30 dias)
- Bloqueia pagamento ao fornecedor até fim do período

**Permissões**: ADMIN, DONO

---

### GET `/api/suppliers/[id]/payments`
Lista pagamentos realizados ao fornecedor.

**Resposta 200**:
```json
{
  "payments": [
    {
      "id": "supplier_payment_1",
      "amount": 200.00,
      "paidAt": "2025-11-01T10:00:00Z",
      "sales": [
        {
          "id": "sale_1",
          "total": 100.00,
          "createdAt": "2025-10-15T10:00:00Z"
        }
      ]
    }
  ],
  "totalPaid": 1500.00,
  "totalPending": 450.00
}
```

**Permissões**: ADMIN, DONO

---

## 🏢 Empresas

### GET `/api/companies`
Lista empresas (apenas para ADMINs de sistema).

**Resposta 200**:
```json
{
  "companies": [
    {
      "id": "company_1",
      "name": "Brechó XYZ",
      "cnpj": "12345678000100",
      "externalId": "external_123",
      "userCount": 5,
      "productCount": 120,
      "createdAt": "2025-01-01T10:00:00Z"
    }
  ]
}
```

**Permissões**: ADMIN (sistema)

---

### GET `/api/companies/[id]`
Retorna detalhes de uma empresa.

**Resposta 200**:
```json
{
  "id": "company_1",
  "name": "Brechó XYZ",
  "cnpj": "12345678000100",
  "users": [
    {
      "id": "user_1",
      "username": "maria",
      "role": "VENDEDOR"
    }
  ],
  "stats": {
    "totalProducts": 120,
    "totalSales": 450,
    "revenue": 15000.00
  }
}
```

**Permissões**: ADMIN, DONO

---

## 👥 Usuários

### GET `/api/users`
Lista usuários da empresa.

**Resposta 200**:
```json
{
  "users": [
    {
      "id": "user_1",
      "username": "maria",
      "email": "maria@example.com",
      "role": "VENDEDOR",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

**Permissões**: ADMIN, DONO

---

### POST `/api/users`
Cria novo usuário (vendedor).

**Body**:
```json
{
  "username": "joao123",
  "email": "joao@example.com",
  "password": "senha123",
  "role": "VENDEDOR"
}
```

**Resposta 201**:
```json
{
  "id": "user_new_1",
  "username": "joao123",
  "email": "joao@example.com",
  "role": "VENDEDOR",
  "companyId": "company_1"
}
```

**Validações**:
- Username único
- Email válido e único
- Senha mínimo 6 caracteres (hash com bcrypt)

**Permissões**: ADMIN, DONO

---

### PATCH `/api/users/[id]`
Atualiza usuário.

**Body**:
```json
{
  "email": "novoemail@example.com",
  "role": "ADMIN"
}
```

**Resposta 200**:
```json
{
  "id": "user_1",
  "username": "maria",
  "email": "novoemail@example.com",
  "role": "ADMIN"
}
```

**Permissões**: ADMIN, DONO

---

### DELETE `/api/users/[id]`
Remove usuário.

**Resposta 200**:
```json
{
  "message": "Usuário removido com sucesso"
}
```

**Validações**:
- Não pode remover usuário com vendas associadas
- Não pode remover a si mesmo

**Permissões**: ADMIN, DONO

---

## 📊 Analytics

### GET `/api/analytics/dashboard`
Retorna métricas do dashboard.

**Query Params**:
- `startDate`: data inicial (padrão: último mês)
- `endDate`: data final (padrão: hoje)

**Resposta 200**:
```json
{
  "summary": {
    "totalSales": 45,
    "revenue": 5600.00,
    "averageTicket": 124.44,
    "productsInStock": 120
  },
  "salesByDay": [
    {
      "date": "2025-11-01",
      "count": 12,
      "total": 1500.00
    }
  ],
  "topProducts": [
    {
      "productId": "prod_1",
      "productName": "Camisa Polo",
      "quantitySold": 25,
      "revenue": 1125.00
    }
  ],
  "paymentMethods": [
    {
      "method": "DINHEIRO",
      "count": 20,
      "total": 2000.00
    },
    {
      "method": "PIX",
      "count": 15,
      "total": 1800.00
    }
  ]
}
```

**Permissões**: ADMIN, DONO

---

### GET `/api/analytics/sales`
Relatório detalhado de vendas.

**Query Params**:
- `groupBy`: `day`, `week`, `month`
- `startDate`, `endDate`

**Resposta 200**:
```json
{
  "data": [
    {
      "period": "2025-11",
      "count": 45,
      "total": 5600.00,
      "averageTicket": 124.44
    }
  ]
}
```

**Permissões**: ADMIN, DONO

---

## 💳 Mercado Pago

### POST `/api/mercadopago/create-payment`
Cria link de pagamento.

**Body**:
```json
{
  "saleId": "sale_123",
  "amount": 130.00,
  "description": "Venda #123 - Brechó XYZ"
}
```

**Resposta 201**:
```json
{
  "id": "mp_pref_123456",
  "init_point": "https://mercadopago.com.br/checkout/v1/redirect?pref_id=...",
  "qr_code": "data:image/png;base64,..." // opcional
}
```

**Permissões**: ADMIN, DONO, VENDEDOR

---

### POST `/api/mercadopago/webhook`
Recebe notificações do Mercado Pago (chamado pelo MP, não pelo frontend).

**Headers**:
- `x-signature`: assinatura do webhook
- `x-request-id`: ID da requisição

**Body**:
```json
{
  "type": "payment",
  "data": {
    "id": "payment_456"
  }
}
```

**Resposta 200**:
```json
{
  "received": true
}
```

**Efeitos**:
- Atualiza status do pagamento no banco
- Notifica frontend via SSE (se implementado)

**Permissões**: Pública (validada por assinatura)

---

## 🔒 Matriz de Permissões

| Endpoint | ADMIN | DONO | VENDEDOR | CLIENTE |
|----------|-------|------|----------|---------|
| GET `/api/sales` | ✅ | ✅ | ✅ (próprias) | ❌ |
| POST `/api/sales` | ✅ | ✅ | ✅ | ❌ |
| DELETE `/api/sales/[id]` | ✅ | ✅ | ❌ | ❌ |
| GET `/api/products` | ✅ | ✅ | ✅ | ✅ |
| POST `/api/products` | ✅ | ✅ | ✅ | ❌ |
| PATCH `/api/products/[id]` | ✅ | ✅ | ❌ | ❌ |
| DELETE `/api/products/[id]` | ✅ | ✅ | ❌ | ❌ |
| GET `/api/suppliers` | ✅ | ✅ | ✅ | ❌ |
| POST `/api/suppliers` | ✅ | ✅ | ❌ | ❌ |
| GET `/api/analytics/*` | ✅ | ✅ | ❌ | ❌ |
| POST `/api/users` | ✅ | ✅ | ❌ | ❌ |
| GET `/api/companies` | ✅ (sistema) | ❌ | ❌ | ❌ |

---

## 📝 Notas Gerais

1. **Autenticação**: Todos os endpoints (exceto `/api/auth/*` e webhooks) exigem sessão válida
2. **Multi-tenant**: Todas as queries filtram automaticamente por `companyId`
3. **Paginação**: Endpoints de listagem suportam `page` e `limit`
4. **Validação**: Todos os endpoints usam Zod para validar dados de entrada
5. **Erros**:
   - `401`: Não autenticado
   - `403`: Sem permissão
   - `404`: Recurso não encontrado
   - `422`: Dados inválidos (detalhes no body)
   - `500`: Erro interno do servidor

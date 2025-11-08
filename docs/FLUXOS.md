# Fluxos de Comunicação - Retrô Carólis

Este documento detalha os principais fluxos de comunicação entre frontend, backends e serviços externos.

## 📑 Índice

1. [Fluxo de Login](#fluxo-de-login)
2. [Fluxo de Vendas](#fluxo-de-vendas)
3. [Fluxo de Pagamentos](#fluxo-de-pagamentos)
4. [Fluxo de Caixa](#fluxo-de-caixa)
5. [Fluxo de Produtos](#fluxo-de-produtos)
6. [Fluxo de Fornecedores](#fluxo-de-fornecedores)
7. [Fluxo de Consignação](#fluxo-de-consignação)

---

## 🔐 Fluxo de Login

### Login de DONO (com License Portal)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USUÁRIO NO FRONTEND                                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Preenche formulário:
                        │ - username: "dono123"
                        │ - password: "senha123"
                        │ - accountType: "DONO"
                        │
                        │ Click "Entrar"
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. FRONTEND: src/app/login/page.tsx                         │
│                                                              │
│   await signIn('credentials', {                             │
│     username: 'dono123',                                    │
│     password: 'senha123',                                   │
│     accountType: 'DONO',                                    │
│     redirect: false                                         │
│   })                                                        │
└───────────────────────┬─────────────────────────────────────┘
                        │ POST /api/auth/callback/credentials
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. NEXTAUTH.JS (Middleware Automático)                      │
│                                                              │
│   • Recebe credenciais                                      │
│   • Chama CredentialsProvider.authorize()                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. BACKEND #1: src/lib/auth.ts                              │
│                                                              │
│   authorize: async (credentials) => {                       │
│     if (credentials?.accountType === "DONO") {              │
│       // Rota para Backend #2 (License Portal)             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ POST https://licensas.cloudfarm.ai/
                        │      login-retrocarolis.php
                        │
                        │ Body: {
                        │   username: "dono123",
                        │   password: "senha123"
                        │ }
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. BACKEND #2: CloudFarm License Portal (PHP)               │
│                                                              │
│   • Valida username + password                              │
│   • Verifica se licença está ativa                          │
│   • Busca dados da empresa                                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Response 200 OK:
                        │ {
                        │   "retcode": 0,
                        │   "id": "user-external-id",
                        │   "username": "dono123",
                        │   "email": "dono@example.com",
                        │   "company": {
                        │     "id": "company-external-id",
                        │     "name": "Brechó XYZ",
                        │     "cnpj": "12345678000100"
                        │   }
                        │ }
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. BACKEND #1: src/lib/auth.ts (continuação)                │
│                                                              │
│   const data = await response.json()                        │
│                                                              │
│   if (data.retcode === 0) {                                 │
│     // Busca ou cria empresa no banco local                 │
│     let company = await prisma.company.findFirst({          │
│       where: { externalId: data.company.id }                │
│     })                                                       │
│                                                              │
│     if (!company) {                                         │
│       company = await prisma.company.create({               │
│         data: {                                             │
│           name: data.company.name,                          │
│           externalId: data.company.id,                      │
│           cnpj: data.company.cnpj                           │
│         }                                                   │
│       })                                                    │
│     }                                                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Prisma queries
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. POSTGRESQL DATABASE                                      │
│                                                              │
│   INSERT INTO Company (id, name, externalId, cnpj, ...)     │
│   VALUES (...)                                              │
│   RETURNING *                                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Company { id: "cuid...", ... }
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. BACKEND #1: src/lib/auth.ts (continuação)                │
│                                                              │
│     // Busca ou cria usuário no banco local                 │
│     let user = await prisma.user.findFirst({                │
│       where: { externalId: data.id }                        │
│     })                                                       │
│                                                              │
│     if (!user) {                                            │
│       user = await prisma.user.create({                     │
│         data: {                                             │
│           username: data.username,                          │
│           email: data.email,                                │
│           role: 'DONO',                                     │
│           companyId: company.id,                            │
│           externalId: data.id                               │
│         }                                                   │
│       })                                                    │
│     }                                                       │
│                                                              │
│     return user  // Retorna para NextAuth                   │
│   }                                                         │
│ }                                                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ User object
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. NEXTAUTH.JS                                              │
│                                                              │
│   • Recebe user object do authorize()                       │
│   • Cria JWT token com:                                     │
│     - user.id                                               │
│     - user.username                                         │
│     - user.role                                             │
│     - user.companyId                                        │
│   • Assina JWT com NEXTAUTH_SECRET                          │
│   • Cria cookie httpOnly                                    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Set-Cookie: next-auth.session-token=...
                        │ Response: { ok: true, url: "/dashboard" }
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 10. FRONTEND                                                │
│                                                              │
│   • Recebe resposta do signIn()                             │
│   • Cookie salvo automaticamente pelo browser               │
│   • Redireciona para /dashboard                             │
│   • useSession() agora retorna dados do usuário             │
└─────────────────────────────────────────────────────────────┘
                        ✅ USUÁRIO AUTENTICADO
```

### Login de ADMIN/VENDEDOR/CLIENTE (sem License Portal)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. FRONTEND: Formulário de Login                            │
│    accountType: "ADMIN" ou "VENDEDOR" ou "CLIENTE"          │
└───────────────────────┬─────────────────────────────────────┘
                        │ signIn('credentials', {...})
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. BACKEND #1: src/lib/auth.ts                              │
│                                                              │
│   authorize: async (credentials) => {                       │
│     if (credentials?.accountType !== "DONO") {              │
│       // Login direto no banco local                        │
│       const user = await prisma.user.findUnique({           │
│         where: { username: credentials.username }           │
│       })                                                    │
│                                                              │
│       if (!user) return null                                │
│                                                              │
│       // Valida senha com bcrypt                            │
│       const isValid = await bcrypt.compare(                 │
│         credentials.password,                               │
│         user.password                                       │
│       )                                                     │
│                                                              │
│       if (!isValid) return null                             │
│                                                              │
│       return user  // ✅ Usuário válido                     │
│     }                                                       │
│   }                                                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
                   (continua com NextAuth criando sessão JWT)
```

---

## 🛒 Fluxo de Vendas

### Criar Nova Venda

```
┌─────────────────────────────────────────────────────────────┐
│ 1. FRONTEND: src/app/dashboard/sales/page.tsx               │
│                                                              │
│   • Vendedor adiciona produtos ao carrinho                  │
│   • Define método(s) de pagamento                           │
│   • Aplica desconto (opcional)                              │
│   • Click "Finalizar Venda"                                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ POST /api/sales
                        │ Body: {
                        │   items: [
                        │     { productId: "...", quantity: 2, price: 50.00 },
                        │     { productId: "...", quantity: 1, price: 30.00 }
                        │   ],
                        │   payments: [
                        │     { method: "DINHEIRO", amount: 80.00 },
                        │     { method: "PIX", amount: 50.00 }
                        │   ],
                        │   discount: 0,
                        │   customerId: "..." (opcional)
                        │ }
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. MIDDLEWARE: src/middleware.ts                            │
│                                                              │
│   • Verifica cookie de sessão                               │
│   • Valida JWT token                                        │
│   • Extrai user.id, user.role, user.companyId               │
│   • Verifica se role permite criar vendas                   │
│   • Se OK, continua para API route                          │
└───────────────────────┬─────────────────────────────────────┘
                        │ ✅ Autorizado
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. BACKEND #1: src/app/api/sales/route.ts                   │
│                                                              │
│   export async function POST(request: Request) {            │
│     const session = await getServerSession(authOptions)     │
│     const data = await request.json()                       │
│                                                              │
│     // Validação com Zod                                    │
│     const validatedData = saleSchema.parse(data)            │
│                                                              │
│     // Inicia transação atômica                             │
│     const sale = await prisma.$transaction(async (tx) => {  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ BEGIN TRANSACTION
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. POSTGRESQL: Transação Atômica                            │
│                                                              │
│   -- 4.1: Criar registro da venda                           │
│   INSERT INTO Sale (                                        │
│     id, total, discount, companyId, sellerId, createdAt     │
│   ) VALUES (                                                │
│     'sale_123', 130.00, 0, 'company_1', 'user_1', NOW()     │
│   ) RETURNING *                                             │
│                                                              │
│   -- 4.2: Criar itens da venda                              │
│   INSERT INTO SaleItem (saleId, productId, quantity, price) │
│   VALUES                                                    │
│     ('sale_123', 'prod_1', 2, 50.00),                       │
│     ('sale_123', 'prod_2', 1, 30.00)                        │
│                                                              │
│   -- 4.3: Atualizar estoque dos produtos                    │
│   UPDATE Product                                            │
│   SET stock = stock - 2                                     │
│   WHERE id = 'prod_1' AND companyId = 'company_1'           │
│                                                              │
│   UPDATE Product                                            │
│   SET stock = stock - 1                                     │
│   WHERE id = 'prod_2' AND companyId = 'company_1'           │
│                                                              │
│   -- 4.4: Criar registros de pagamento                      │
│   INSERT INTO Payment (saleId, method, amount, status)      │
│   VALUES                                                    │
│     ('sale_123', 'DINHEIRO', 80.00, 'APPROVED'),            │
│     ('sale_123', 'PIX', 50.00, 'APPROVED')                  │
│                                                              │
│   -- 4.5: Buscar caixa aberto do vendedor                   │
│   SELECT * FROM CashRegister                                │
│   WHERE userId = 'user_1'                                   │
│     AND companyId = 'company_1'                             │
│     AND closedAt IS NULL                                    │
│   LIMIT 1                                                   │
│                                                              │
│   -- 4.6: Registrar movimentação no caixa                   │
│   INSERT INTO CashRegisterMovement (                        │
│     cashRegisterId, type, amount, description, saleId       │
│   ) VALUES (                                                │
│     'cash_reg_1', 'SALE', 130.00, 'Venda #123', 'sale_123'  │
│   )                                                         │
│                                                              │
│   COMMIT  ✅ Tudo ou nada!                                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Sale { id, total, items, payments, ... }
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. BACKEND #1: src/app/api/sales/route.ts (continuação)     │
│                                                              │
│     })  // Fim da transação                                 │
│                                                              │
│     return NextResponse.json(sale, { status: 201 })         │
│   }                                                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Response 201:
                        │ {
                        │   id: "sale_123",
                        │   total: 130.00,
                        │   discount: 0,
                        │   items: [...],
                        │   payments: [...],
                        │   createdAt: "2025-11-08T10:30:00Z"
                        │ }
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. FRONTEND: Resposta Recebida                              │
│                                                              │
│   const response = await fetch('/api/sales', {...})         │
│   const sale = await response.json()                        │
│                                                              │
│   • Mostra mensagem de sucesso                              │
│   • Atualiza lista de vendas                                │
│   • Limpa carrinho                                          │
│   • Opcionalmente imprime recibo                            │
└─────────────────────────────────────────────────────────────┘
                        ✅ VENDA FINALIZADA
```

---

## 💳 Fluxo de Pagamentos (Mercado Pago)

### Criar Link de Pagamento

```
┌─────────────────────────────────────────────────────────────┐
│ 1. FRONTEND: Tela de Checkout                               │
│                                                              │
│   • Cliente escolhe "Pagar com Mercado Pago"                │
│   • Click "Gerar Link de Pagamento"                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ POST /api/mercadopago/create-payment
                        │ Body: {
                        │   saleId: "sale_123",
                        │   amount: 130.00,
                        │   description: "Venda #123 - Brechó XYZ"
                        │ }
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. BACKEND #1: src/app/api/mercadopago/                     │
│                create-payment/route.ts                       │
│                                                              │
│   import mercadopago from '@/lib/mercadopago'               │
│                                                              │
│   const preference = await mercadopago.preferences.create({ │
│     items: [{                                               │
│       title: "Venda #123 - Brechó XYZ",                     │
│       unit_price: 130.00,                                   │
│       quantity: 1                                           │
│     }],                                                     │
│     back_urls: {                                            │
│       success: "https://app.com/payment/success",           │
│       failure: "https://app.com/payment/failure",           │
│       pending: "https://app.com/payment/pending"            │
│     },                                                      │
│     notification_url: "https://app.com/api/mercadopago/webhook", │
│     external_reference: "sale_123"                          │
│   })                                                        │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTPS POST to Mercado Pago API
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. MERCADO PAGO API (Serviço Externo)                       │
│                                                              │
│   • Cria preferência de pagamento                           │
│   • Gera ID único                                           │
│   • Retorna init_point (URL de checkout)                    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Response: {
                        │   id: "mp_pref_123456",
                        │   init_point: "https://mercadopago.com.br/checkout/v1/redirect?pref_id=mp_pref_123456"
                        │ }
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. BACKEND #1: Salva referência no banco                    │
│                                                              │
│   await prisma.payment.update({                             │
│     where: { saleId: "sale_123" },                          │
│     data: {                                                 │
│       mercadoPagoId: "mp_pref_123456",                      │
│       status: "PENDING"                                     │
│     }                                                       │
│   })                                                        │
│                                                              │
│   return NextResponse.json({                                │
│     init_point: preference.init_point                       │
│   })                                                        │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Response: { init_point: "https://..." }
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. FRONTEND: Recebe Link                                    │
│                                                              │
│   const { init_point } = await response.json()              │
│                                                              │
│   • Mostra botão "Pagar Agora"                              │
│   • Ou abre em nova aba                                     │
│   • Ou mostra QR Code (PIX)                                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Cliente clica e é redirecionado
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. MERCADO PAGO: Página de Checkout                         │
│                                                              │
│   • Cliente vê opções de pagamento (cartão, PIX, boleto)    │
│   • Cliente completa o pagamento                            │
│   • Mercado Pago processa                                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Pagamento aprovado ✅
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. MERCADO PAGO: Envia Webhook                              │
│                                                              │
│   POST https://app.com/api/mercadopago/webhook              │
│   Headers: {                                                │
│     x-signature: "assinatura-mp",                           │
│     x-request-id: "req-123"                                 │
│   }                                                         │
│   Body: {                                                   │
│     type: "payment",                                        │
│     data: { id: "payment_456" }                             │
│   }                                                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. BACKEND #1: src/app/api/mercadopago/webhook/route.ts     │
│                                                              │
│   • Valida assinatura do webhook                            │
│   • Busca detalhes do pagamento via API MP                  │
│   • Atualiza status no banco                                │
│                                                              │
│   const payment = await mercadopago.payment.get(            │
│     req.body.data.id                                        │
│   )                                                         │
│                                                              │
│   await prisma.payment.update({                             │
│     where: { mercadoPagoId: payment.id },                   │
│     data: {                                                 │
│       status: payment.status === 'approved'                 │
│         ? 'APPROVED'                                        │
│         : 'REJECTED'                                        │
│     }                                                       │
│   })                                                        │
│                                                              │
│   return NextResponse.json({ received: true })              │
└─────────────────────────────────────────────────────────────┘
                        ✅ PAGAMENTO PROCESSADO
```

---

## 💰 Fluxo de Caixa

### Abrir Caixa

```
FRONTEND (Dashboard)
    │ POST /api/cash-register
    │ Body: { openingBalance: 100.00 }
    ▼
BACKEND #1: /api/cash-register/route.ts
    │ Valida sessão (vendedor/admin)
    │ Verifica se já existe caixa aberto
    ▼
PRISMA
    │ INSERT INTO CashRegister
    │ (userId, companyId, openingBalance, openedAt)
    │ VALUES (user_1, company_1, 100.00, NOW())
    ▼
FRONTEND
    ✅ Caixa aberto - Vendedor pode vender
```

### Fechar Caixa

```
FRONTEND
    │ POST /api/cash-register/[id]/close
    │ Body: { closingBalance: 850.00 }
    ▼
BACKEND #1
    │ Busca todas as movimentações do caixa
    │ Calcula total esperado
    │ Compara com closingBalance informado
    ▼
PRISMA
    │ UPDATE CashRegister
    │ SET closedAt = NOW(),
    │     closingBalance = 850.00,
    │     difference = (closingBalance - expectedBalance)
    ▼
FRONTEND
    ✅ Caixa fechado - Mostra relatório
```

---

## 📦 Fluxo de Produtos

### Adicionar Produto

```
FRONTEND: Formulário de Produto
    │ POST /api/products
    │ Body: {
    │   name: "Camisa Polo",
    │   price: 45.00,
    │   stock: 10,
    │   category: "ROUPAS",
    │   supplierId: "supplier_1" (opcional)
    │ }
    ▼
BACKEND #1: /api/products/route.ts
    │ Validação Zod
    │ Verifica permissões
    ▼
PRISMA
    │ INSERT INTO Product
    │ (name, price, stock, companyId, supplierId, ...)
    │ VALUES (...)
    │
    │ Se supplierId fornecido:
    │   UPDATE Supplier
    │   SET productCount = productCount + 1
    ▼
FRONTEND
    ✅ Produto criado
```

---

## 🤝 Fluxo de Fornecedores e Consignação

### Registrar Produto em Consignação

```
FRONTEND: Tela de Fornecedores
    │ POST /api/suppliers/[id]/consignment
    │ Body: {
    │   productId: "prod_123",
    │   quantity: 5
    │ }
    ▼
BACKEND #1: /api/suppliers/[id]/consignment/route.ts
    │ Busca fornecedor
    │ Busca produto
    │ Calcula data de liberação (hoje + 30 dias)
    ▼
PRISMA: Transação
    │ INSERT INTO ConsignmentItem
    │ (supplierId, productId, quantity, receivedAt, releaseDate)
    │ VALUES (supplier_1, prod_123, 5, NOW(), NOW() + 30 days)
    │
    │ UPDATE Product
    │ SET consignment = true,
    │     consignmentHoldUntil = NOW() + 30 days
    ▼
FRONTEND
    ✅ Produto em consignação (bloqueado por 30 dias)
```

### Vender Produto em Consignação (dentro dos 30 dias)

```
FRONTEND: Tenta vender produto em consignação
    │ POST /api/sales
    ▼
BACKEND #1: Valida venda
    │ Verifica se produto está em consignação
    │ Verifica se ainda está no período de hold
    ▼
PRISMA: Transação
    │ Se dentro do período de hold:
    │   - Cria venda normalmente
    │   - NÃO repassa $ para fornecedor ainda
    │   - Marca como "pagamento pendente ao fornecedor"
    │
    │ INSERT INTO SupplierPaymentPending
    │ (supplierId, saleId, amount, dueDate)
    ▼
FRONTEND
    ✅ Venda concluída ($ retido temporariamente)
```

### Liberar Pagamento ao Fornecedor (após 30 dias)

```
SISTEMA: Cron Job ou Manual
    │ GET /api/suppliers/pending-payments
    ▼
BACKEND #1
    │ SELECT * FROM SupplierPaymentPending
    │ WHERE dueDate <= NOW() AND paid = false
    ▼
PRISMA: Para cada pagamento pendente
    │ BEGIN TRANSACTION
    │
    │ UPDATE SupplierPaymentPending
    │ SET paid = true, paidAt = NOW()
    │
    │ INSERT INTO SupplierPayment
    │ (supplierId, amount, paidAt)
    │
    │ COMMIT
    ▼
SISTEMA
    ✅ Fornecedor pode receber pagamento
```

---

## 🔄 Resumo Visual de Todos os Fluxos

```
┌──────────────┐
│   FRONTEND   │
│  (React App) │
└──────┬───────┘
       │
       │ fetch('/api/*')
       │
       ▼
┌──────────────────────────────────────┐
│      MIDDLEWARE (Autenticação)       │
│      src/middleware.ts               │
└──────┬───────────────────────────────┘
       │
       │ Se autenticado
       │
       ▼
┌──────────────────────────────────────┐
│   BACKEND #1 (Next.js API Routes)    │
│   src/app/api/*                      │
│                                      │
│   • Validação (Zod)                  │
│   • Lógica de negócio                │
│   • Prisma queries                   │
└──────┬──────────┬────────────────────┘
       │          │
       │          │ (apenas login DONO)
       │          ▼
       │    ┌─────────────────────┐
       │    │  BACKEND #2         │
       │    │  License Portal     │
       │    │  (CloudFarm)        │
       │    └─────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│        POSTGRESQL DATABASE           │
│        (Prisma ORM)                  │
│                                      │
│   • Users, Companies                 │
│   • Products, Sales                  │
│   • Payments, Suppliers              │
│   • CashRegisters, etc.              │
└──────────────────────────────────────┘
       │
       │ (pagamentos)
       ▼
┌──────────────────────────────────────┐
│      MERCADO PAGO API                │
│      (Serviço Externo)               │
│                                      │
│   • Criar preferências               │
│   • Processar pagamentos             │
│   • Enviar webhooks                  │
└──────────────────────────────────────┘
```

---

## 📝 Notas Importantes

1. **Todas as requisições passam pelo middleware** antes de chegar às API routes
2. **Isolamento multi-tenant**: Todas as queries filtram por `companyId`
3. **Transações atômicas**: Operações críticas (vendas, caixa) usam `prisma.$transaction()`
4. **Segurança**: Senhas com bcrypt, JWT assinado, HTTPS obrigatório
5. **Webhooks**: Mercado Pago notifica o backend assincronamente
6. **Consignação**: Produtos ficam retidos por 30 dias antes de pagar fornecedor

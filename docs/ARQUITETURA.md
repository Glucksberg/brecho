# Arquitetura do Sistema Retrô Carólis

## 🗺️ Visão Geral

O projeto Retrô Carólis é uma aplicação full-stack monolítica construída com Next.js 14, que integra dois backends distintos para gerenciar um sistema de brechó multi-tenant.

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Client-Side)                        │
│  React Components + Context API + TailwindCSS                   │
│  src/components/* + src/app/*/page.tsx                          │
└──────────────────────┬──────────────────────────────────────────┘
                       │ fetch() / HTTP requests
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND #1: Next.js API Routes                      │
│              (App Backend - Backend principal)                   │
│                                                                  │
│  📍 Localização: /src/app/api/*                                 │
│  🔧 Tecnologia: Next.js 14 API Routes + TypeScript              │
│  📊 33+ endpoints para:                                         │
│     • Vendas (/api/sales)                                       │
│     • Produtos (/api/products)                                  │
│     • Pagamentos (/api/payments)                                │
│     • Caixa (/api/cash-register)                                │
│     • Analytics (/api/analytics)                                │
│     • Multi-tenant (/api/companies)                             │
│     • Fornecedores (/api/suppliers)                             │
│                                                                  │
└──────────┬────────────────────────┬─────────────────────────────┘
           │                        │
           │                        │ (Apenas login DONO)
           │                        ▼
           │              ┌─────────────────────────────┐
           │              │  BACKEND #2: License Portal │
           │              │  (CloudFarm - Externo)      │
           │              │                             │
           │              │  URL: licensas.cloudfarm.ai │
           │              │  Valida licenças de DONOs   │
           │              │  Integrado via HTTP POST    │
           │              └─────────────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│      PostgreSQL Database          │
│      Via Prisma ORM               │
│                                   │
│  15 modelos:                      │
│  • User, Company, Product         │
│  • Sale, Payment, Supplier        │
│  • CashRegister, etc.             │
└──────────────────────────────────┘
```

## 📋 Os Dois Backends

### Backend #1: App Backend (Next.js API Routes)

**Localização**: `/src/app/api/`

**Tecnologia**: Next.js 14 API Routes (serverless functions) rodando no servidor Node.js

**Função**: Gerenciar toda a lógica de negócio do sistema de brechó

**Características**:
- 33+ endpoints RESTful
- Validação com Zod schemas
- Prisma ORM para acesso ao banco
- TypeScript para type-safety
- Transações atômicas no banco
- Integração com Mercado Pago
- Sistema multi-tenant (isolamento por companyId)

**Principais Grupos de Endpoints**:

| Grupo | Endpoints | Função |
|-------|-----------|---------|
| **Vendas** | `/api/sales/*` | Criar, listar, obter detalhes de vendas |
| **Produtos** | `/api/products/*` | CRUD de produtos, busca, filtros |
| **Pagamentos** | `/api/payments/*` | Processar pagamentos, validar |
| **Caixa** | `/api/cash-register/*` | Abrir, fechar, movimentações |
| **Analytics** | `/api/analytics/*` | Relatórios, métricas, dashboards |
| **Empresas** | `/api/companies/*` | Gestão multi-tenant |
| **Fornecedores** | `/api/suppliers/*` | CRUD fornecedores, consignação |
| **Mercado Pago** | `/api/mercadopago/*` | Criar pagamentos, webhooks |
| **Usuários** | `/api/users/*` | CRUD usuários, vendedores |

**Exemplo de Endpoint**:
```typescript
// src/app/api/sales/route.ts
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  // Validação
  const data = saleSchema.parse(await request.json())

  // Lógica de negócio
  const sale = await prisma.$transaction(async (tx) => {
    // Criar venda
    // Criar pagamentos
    // Atualizar estoque
    // Registrar movimento de caixa
    return sale
  })

  return NextResponse.json(sale)
}
```

### Backend #2: License Portal (CloudFarm)

**Localização**: Serviço externo hospedado em `https://licensas.cloudfarm.ai`

**Tecnologia**: API PHP externa (não temos controle sobre ela)

**Função**: Validar licenças ativas de usuários DONO (donos de brechós)

**Características**:
- Apenas usado durante o login de usuários DONO
- Valida credenciais + verifica licença ativa
- Retorna dados do usuário e empresa
- Integrado via HTTP POST

**Ponto de Integração**: `src/lib/auth.ts:18-49`

```typescript
// src/lib/auth.ts
async authorize(credentials) {
  if (credentials?.accountType === "DONO") {
    // Chama o License Portal
    const response = await fetch(
      "https://licensas.cloudfarm.ai/login-retrocarolis.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      }
    )

    const data = await response.json()

    if (data.retcode === 0) {
      // Licença válida, retorna usuário
      return {
        id: data.id,
        username: data.username,
        email: data.email,
        role: "DONO",
        companyId: data.company.id,
      }
    }
  }
}
```

**Resposta do License Portal**:
```json
{
  "retcode": 0,
  "id": "user-id",
  "username": "dono123",
  "email": "dono@example.com",
  "company": {
    "id": "company-id",
    "name": "Brechó XYZ"
  }
}
```

## 🔄 Fluxos de Comunicação

### 1. Login de Usuário DONO

```
┌─────────┐
│ Cliente │
└────┬────┘
     │ 1. POST /api/auth/signin
     │    { username, password, accountType: "DONO" }
     ▼
┌──────────────┐
│  NextAuth.js │
└──────┬───────┘
       │ 2. Chama authorize()
       ▼
┌─────────────────────┐
│ src/lib/auth.ts     │
│ CredentialsProvider │
└──────┬──────────────┘
       │ 3. POST https://licensas.cloudfarm.ai/login-retrocarolis.php
       │    { username, password }
       ▼
┌──────────────────────┐
│ License Portal       │
│ (Backend Externo #2) │
└──────┬───────────────┘
       │ 4. Valida credenciais + licença ativa
       │ 5. Retorna { retcode: 0, id, username, email, company }
       ▼
┌─────────────────────┐
│ src/lib/auth.ts     │
└──────┬──────────────┘
       │ 6. Busca/cria empresa no banco local
       │ 7. Busca/cria usuário no banco local
       ▼
┌──────────────────┐
│ PostgreSQL       │
└──────┬───────────┘
       │ 8. Retorna usuário completo
       ▼
┌──────────────┐
│  NextAuth.js │
└──────┬───────┘
       │ 9. Cria sessão JWT
       │ 10. Define cookie de sessão
       ▼
┌─────────┐
│ Cliente │ ✅ Autenticado
└─────────┘
```

### 2. Login de Outros Usuários (ADMIN, VENDEDOR, CLIENTE)

```
┌─────────┐
│ Cliente │
└────┬────┘
     │ 1. POST /api/auth/signin
     │    { username, password, accountType: "ADMIN" }
     ▼
┌──────────────┐
│  NextAuth.js │
└──────┬───────┘
       │ 2. Chama authorize()
       ▼
┌─────────────────────┐
│ src/lib/auth.ts     │
└──────┬──────────────┘
       │ 3. Busca usuário no banco local
       │ 4. Valida senha com bcrypt.compare()
       ▼
┌──────────────────┐
│ PostgreSQL       │
└──────┬───────────┘
       │ 5. Retorna usuário
       ▼
┌──────────────┐
│  NextAuth.js │
└──────┬───────┘
       │ 6. Cria sessão JWT
       ▼
┌─────────┐
│ Cliente │ ✅ Autenticado
└─────────┘
```

### 3. Operação Normal (Ex: Criar Venda)

```
┌─────────────────┐
│ Frontend        │
│ SalesPage.tsx   │
└────┬────────────┘
     │ 1. fetch('/api/sales', {
     │      method: 'POST',
     │      body: JSON.stringify(saleData)
     │    })
     ▼
┌─────────────────────┐
│ middleware.ts       │ (Executa no servidor)
└────┬────────────────┘
     │ 2. Valida sessão NextAuth
     │ 3. Verifica permissões RBAC
     │ 4. Se OK, permite continuar
     ▼
┌──────────────────────────┐
│ src/app/api/sales/route.ts │
│ (Backend #1)              │
└────┬─────────────────────┘
     │ 5. Valida dados com Zod
     │ 6. Inicia transação no banco
     ▼
┌──────────────────┐
│ Prisma ORM       │
└────┬─────────────┘
     │ 7. BEGIN TRANSACTION
     │ 8. INSERT INTO Sale
     │ 9. INSERT INTO Payment
     │ 10. UPDATE Product (estoque)
     │ 11. INSERT INTO CashRegisterMovement
     │ 12. COMMIT
     ▼
┌──────────────────┐
│ PostgreSQL       │
└────┬─────────────┘
     │ 13. Retorna dados salvos
     ▼
┌──────────────────────────┐
│ src/app/api/sales/route.ts │
└────┬─────────────────────┘
     │ 14. NextResponse.json(sale)
     ▼
┌─────────────────┐
│ Frontend        │
│ SalesPage.tsx   │
└─────────────────┘
     15. Atualiza UI
     16. Mostra confirmação
```

### 4. Pagamento com Mercado Pago

```
┌─────────────────┐
│ Frontend        │
└────┬────────────┘
     │ 1. POST /api/mercadopago/create-payment
     ▼
┌────────────────────────────────────┐
│ src/app/api/mercadopago/           │
│   create-payment/route.ts          │
└────┬───────────────────────────────┘
     │ 2. Cria preferência de pagamento
     │ 3. Chama SDK do Mercado Pago
     ▼
┌──────────────────────┐
│ Mercado Pago API     │ (Serviço Externo)
└────┬─────────────────┘
     │ 4. Retorna init_point (URL de pagamento)
     ▼
┌─────────────────┐
│ Frontend        │
└────┬────────────┘
     │ 5. Redireciona usuário para Mercado Pago
     │ 6. Cliente paga
     ▼
┌──────────────────────┐
│ Mercado Pago         │
└────┬─────────────────┘
     │ 7. POST /api/mercadopago/webhook
     │    (notificação de pagamento)
     ▼
┌────────────────────────────────────┐
│ src/app/api/mercadopago/           │
│   webhook/route.ts                 │
└────┬───────────────────────────────┘
     │ 8. Valida assinatura
     │ 9. Atualiza status do pagamento
     ▼
┌──────────────────┐
│ PostgreSQL       │
└────┬─────────────┘
     │ 10. UPDATE Payment SET status = 'approved'
     ▼
┌─────────────────┐
│ Frontend        │ (via polling ou webhook)
└─────────────────┘
```

## 🏗️ Estrutura de Pastas

```
/root/brecho/
├── src/
│   ├── app/
│   │   ├── api/                    ← BACKEND #1 (Next.js API Routes)
│   │   │   ├── analytics/
│   │   │   ├── cash-register/
│   │   │   ├── companies/
│   │   │   ├── mercadopago/
│   │   │   ├── payments/
│   │   │   ├── products/
│   │   │   ├── sales/
│   │   │   ├── suppliers/
│   │   │   └── users/
│   │   ├── dashboard/              ← FRONTEND (Páginas React)
│   │   ├── settings/               ← FRONTEND
│   │   └── login/                  ← FRONTEND
│   │
│   ├── components/                 ← FRONTEND (Componentes React)
│   │   ├── Providers.tsx
│   │   ├── ui/
│   │   └── ...
│   │
│   ├── lib/
│   │   ├── auth.ts                 ← Integração BACKEND #2 (License Portal)
│   │   ├── prisma.ts               ← Cliente Prisma ORM
│   │   ├── mercadopago.ts          ← Cliente Mercado Pago
│   │   └── utils.ts
│   │
│   ├── middleware.ts               ← Proteção de rotas (Server-side)
│   │
│   └── contexts/                   ← FRONTEND (Estado global)
│       ├── AuthContext.tsx
│       └── CompanyContext.tsx
│
├── prisma/
│   ├── schema.prisma               ← Definição do banco de dados
│   └── migrations/                 ← Migrações do banco
│
├── public/                         ← Arquivos estáticos
│
├── .env                            ← Variáveis de ambiente
├── package.json
└── tsconfig.json
```

## 🔧 Stack Tecnológica

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Gerenciamento de Estado**: React Context API
- **Autenticação Cliente**: NextAuth.js (useSession hook)
- **HTTP Client**: fetch API nativo

### Backend #1 (App Backend)
- **Framework**: Next.js 14 API Routes
- **Runtime**: Node.js
- **Linguagem**: TypeScript
- **ORM**: Prisma 5.x
- **Validação**: Zod
- **Autenticação**: NextAuth.js 4.24.7
- **Hash de Senha**: bcryptjs
- **Pagamentos**: Mercado Pago SDK 2.10.0

### Backend #2 (License Portal)
- **Provedor**: CloudFarm
- **URL**: https://licensas.cloudfarm.ai
- **Tecnologia**: PHP (não temos controle)
- **Protocolo**: HTTP POST com JSON

### Banco de Dados
- **SGBD**: PostgreSQL
- **Acesso**: Prisma ORM
- **Modelos**: 15 entidades principais

### Infraestrutura
- **Autenticação**: NextAuth.js + JWT
- **Sessão**: Cookies httpOnly
- **Middleware**: Next.js middleware (rotas protegidas)
- **Variáveis de Ambiente**: .env

## 🔐 Autenticação e Autorização

### Sistema Dual de Autenticação

1. **DONO (Donos de Brechó)**:
   - Autenticação via License Portal (Backend #2)
   - Validação de licença ativa obrigatória
   - Usuário criado/atualizado no banco local após validação
   - Sessão JWT gerenciada pelo NextAuth.js

2. **ADMIN, VENDEDOR, CLIENTE**:
   - Autenticação direta no banco local (Backend #1)
   - Validação de senha com bcrypt
   - Sessão JWT gerenciada pelo NextAuth.js

### Níveis de Acesso (RBAC)

| Papel | Permissões |
|-------|-----------|
| **ADMIN** | Acesso total ao sistema, gerencia tudo |
| **DONO** | Proprietário de brechó, acesso full com licença ativa |
| **VENDEDOR** | Vender produtos, registrar pagamentos, caixa |
| **CLIENTE** | Ver produtos, fazer compras próprias (futuro) |

### Proteção de Rotas

**Middleware** (`src/middleware.ts`):
- Intercepta todas as requisições
- Valida sessão JWT
- Verifica permissões RBAC
- Redireciona não autorizados para /login
- Permite rotas públicas (/login, /api/auth/*)

```typescript
// src/middleware.ts
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verifica permissões específicas por rota
  if (request.nextUrl.pathname.startsWith('/settings')) {
    if (!['ADMIN', 'DONO'].includes(token.role)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}
```

## 🗄️ Banco de Dados

### Modelos Principais (15 entidades)

```prisma
model User {
  id          String   @id @default(cuid())
  username    String   @unique
  email       String?  @unique
  password    String?
  role        Role     @default(VENDEDOR)
  companyId   String
  company     Company  @relation(...)
  sales       Sale[]
  cashRegisters CashRegister[]
}

model Company {
  id          String   @id @default(cuid())
  name        String
  users       User[]
  products    Product[]
  sales       Sale[]
  suppliers   Supplier[]
}

model Product {
  id          String   @id @default(cuid())
  name        String
  price       Decimal
  stock       Int
  companyId   String
  company     Company  @relation(...)
  supplierId  String?
  supplier    Supplier?
}

model Sale {
  id          String   @id @default(cuid())
  total       Decimal
  discount    Decimal  @default(0)
  companyId   String
  company     Company
  sellerId    String
  seller      User
  items       SaleItem[]
  payments    Payment[]
  createdAt   DateTime @default(now())
}

model Payment {
  id          String   @id @default(cuid())
  amount      Decimal
  method      PaymentMethod
  status      PaymentStatus @default(PENDING)
  saleId      String
  sale        Sale
  mercadoPagoId String?
}

model Supplier {
  id          String   @id @default(cuid())
  name        String
  phone       String?
  companyId   String
  company     Company
  products    Product[]
  consignmentHoldDays Int @default(30)
}

model CashRegister {
  id          String   @id @default(cuid())
  openedAt    DateTime
  closedAt    DateTime?
  openingBalance Decimal
  closingBalance Decimal?
  companyId   String
  userId      String
  movements   CashRegisterMovement[]
}
```

### Isolamento Multi-Tenant

**Estratégia**: Todos os dados são isolados por `companyId`

```typescript
// Toda query filtra por companyId
const products = await prisma.product.findMany({
  where: {
    companyId: session.user.companyId, // ← Isolamento
  },
})
```

## 🌐 Variáveis de Ambiente

```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/brecho"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN="your-access-token"
MERCADO_PAGO_PUBLIC_KEY="your-public-key"

# License Portal (Backend #2)
# URL hardcoded em src/lib/auth.ts
# https://licensas.cloudfarm.ai/login-retrocarolis.php
```

## 🚀 Deploy e Execução

### Desenvolvimento
```bash
npm run dev
# Frontend: http://localhost:3000
# Backend API: http://localhost:3000/api/*
```

### Produção
```bash
npm run build
npm start
```

### Migrações do Banco
```bash
npx prisma migrate dev
npx prisma generate
```

## 📊 Resumo de Comunicação

| De | Para | Como | Quando |
|----|------|------|--------|
| Frontend | Backend #1 (API Routes) | `fetch('/api/*')` | Toda operação do app |
| Backend #1 | PostgreSQL | Prisma ORM | Persistência de dados |
| Backend #1 | Backend #2 (License Portal) | HTTP POST | Login de DONO apenas |
| Backend #1 | Mercado Pago | SDK oficial | Criar pagamentos |
| Mercado Pago | Backend #1 | Webhook POST | Notificação de pagamento |
| Frontend | NextAuth | `signIn()`, `useSession()` | Autenticação |

## 🎯 Pontos-Chave

1. **Monolito Full-Stack**: Tudo em um único projeto Next.js
2. **Dois Backends Distintos**:
   - Backend #1 (principal): Next.js API Routes para toda lógica de negócio
   - Backend #2 (externo): CloudFarm License Portal apenas para validar DONOs
3. **Frontend e Backend no mesmo código**: Separados por convenção de pastas
4. **Comunicação Simples**: fetch() do frontend para `/api/*`
5. **Multi-Tenant**: Isolamento por `companyId` em todas as queries
6. **Autenticação Dual**: License Portal para DONOs, local para demais
7. **Type-Safe**: TypeScript + Prisma + Zod em toda a stack

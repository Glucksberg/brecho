# 🎯 PLANO DE EXECUÇÃO - QUALIDADE PRIMEIRO

**Abordagem Escolhida:** B - Qualidade Primeiro
**Timeline:** 4-6 semanas
**Objetivo:** Sistema robusto, testado e pronto para escala
**Data Início:** 2025-11-06

---

## 📋 VISÃO GERAL

### Fases do Projeto

**FASE 0:** Testes de Integração (Semana 1)
**FASE 1:** P2 Críticos (Semana 2-3)
**FASE 2:** Code Quality (Semana 4)
**FASE 3:** Funcionalidades e TODOs (Semana 5-6)
**FASE 4:** Testes e Deploy (Semana 6+)

### Métricas de Sucesso

- ✅ 0 problemas P0 (já alcançado)
- ✅ 0 problemas P1 (já alcançado)
- 🎯 0 problemas P2 críticos
- 🎯 < 10 usos de `any`
- 🎯 0 console.logs em produção
- 🎯 80% cobertura de testes
- 🎯 < 100ms tempo de resposta APIs
- 🎯 Sistema em produção estável

---

## 📅 FASE 0: TESTES DE INTEGRAÇÃO (Semana 1)

**Objetivo:** Validar que as implementações P0/P1 funcionam corretamente

### 🗓️ Segunda-feira: Setup e Migração

**Tarefas:**
1. [ ] Executar migração do banco de dados
2. [ ] Configurar variáveis de ambiente (sandbox)
3. [ ] Verificar todas as dependências instaladas
4. [ ] Testar build do projeto
5. [ ] Verificar tipos TypeScript

**Comandos:**
```bash
# Migração
npx prisma migrate dev --name add-mercadopago-fields

# Verificar build
npm run build

# TypeScript check
npx tsc --noEmit
```

**Checklist:**
- [ ] Migração executada sem erros
- [ ] Build passa sem erros
- [ ] TypeScript compila (ignorar warnings por enquanto)
- [ ] .env configurado corretamente

---

### 🗓️ Terça-feira: Testes Mercado Pago

**Tarefas:**
1. [ ] Configurar Mercado Pago sandbox
2. [ ] Testar criação de preferência
3. [ ] Testar redirect para checkout
4. [ ] Configurar webhook (usar ngrok ou webhook.site)
5. [ ] Testar recebimento de webhook
6. [ ] Validar idempotência (enviar webhook 2x)

**Testes Específicos:**

**Teste 1: Criar Preferência**
```bash
# Adicionar produto ao carrinho
# Preencher dados de checkout
# Verificar POST /api/pagamento/criar-preferencia
# Verificar init_point retornado
```

**Teste 2: Validação de Estoque**
```bash
# Marcar produto como vendido
# Tentar fazer checkout
# Verificar se bloqueia (esperado: erro de estoque)
```

**Teste 3: Webhook Idempotente**
```bash
# Simular pagamento aprovado
# Enviar webhook 1x → Criar venda
# Enviar webhook 2x → Não duplicar venda
# Verificar campo mercadoPagoPaymentId é único
```

**Checklist:**
- [ ] Preferência criada com sucesso
- [ ] Redirect funciona
- [ ] Webhook recebido
- [ ] Venda criada no banco
- [ ] Idempotência funcionando
- [ ] Validação de estoque OK

---

### 🗓️ Quarta-feira: Testes de Validação

**Tarefas:**
1. [ ] Testar validação de CPF (frontend + backend)
2. [ ] Testar validação de email
3. [ ] Testar validação de telefone
4. [ ] Testar timeouts em ViaCEP
5. [ ] Testar hash de tokens de reset

**Testes Específicos:**

**Teste 1: CPF Validation**
```bash
# Tentar cadastrar com CPF inválido
# Esperado: erro "CPF inválido"

# Tentar CPF válido: 123.456.789-09
# Esperado: aceitar
```

**Teste 2: Timeout ViaCEP**
```bash
# Simular API lenta (pode usar proxy)
# Verificar timeout após 5s
# Verificar mensagem de erro adequada
```

**Teste 3: Reset Password**
```bash
# Solicitar reset de senha
# Verificar token hasheado no banco
# Usar token para resetar senha
# Verificar que funciona
```

**Checklist:**
- [ ] CPF inválido rejeitado
- [ ] CPF válido aceito
- [ ] Email validado corretamente
- [ ] Timeout funciona
- [ ] Reset de senha funciona

---

### 🗓️ Quinta-feira: Testes End-to-End

**Tarefas:**
1. [ ] Fluxo completo: Cadastro → Login → Compra
2. [ ] Testar todos os cenários de erro
3. [ ] Documentar bugs encontrados
4. [ ] Criar lista de correções necessárias

**Fluxo Completo:**
```
1. Cadastrar novo usuário
   - Email válido
   - CPF válido
   - Endereço completo

2. Login
   - Verificar sessão criada

3. Navegar na loja
   - Ver produtos
   - Adicionar ao carrinho

4. Checkout
   - Preencher dados
   - Buscar CEP
   - Verificar estoque
   - Criar preferência

5. Pagamento (sandbox)
   - Redirecionar para MP
   - Pagar com cartão de teste
   - Aguardar webhook

6. Confirmação
   - Verificar venda no banco
   - Verificar estoque atualizado
```

**Checklist:**
- [ ] Fluxo completo funciona sem erros
- [ ] Bugs documentados
- [ ] Correções priorizadas

---

### 🗓️ Sexta-feira: Correções e Documentação

**Tarefas:**
1. [ ] Corrigir bugs encontrados nos testes
2. [ ] Atualizar documentação de APIs
3. [ ] Criar guia de testes
4. [ ] Commit e push de correções

**Entregáveis:**
- Relatório de testes executados
- Lista de bugs corrigidos
- Guia de testes para futuras validações
- Sistema validado e funcionando

---

## 📅 FASE 1: P2 CRÍTICOS (Semana 2-3)

**Objetivo:** Resolver todos os 12 problemas P2

### 🎯 Semana 2: Funcionalidades Essenciais

#### Segunda-feira: Paginação nas APIs

**P2#15: Implementar paginação em todas as listas**

**Tarefas:**
1. [ ] Revisar helpers de paginação existentes
2. [ ] Implementar em `/api/clientes`
3. [ ] Implementar em `/api/fornecedoras`
4. [ ] Implementar em `/api/despesas`
5. [ ] Testar todas as APIs com paginação

**Implementação:**
```typescript
// Pattern a seguir (já existe em vendas/produtos)
import { parsePaginationParams, buildPaginationResponse } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const { page, perPage, skip, take } = parsePaginationParams(searchParams)

  const [items, total] = await Promise.all([
    prisma.cliente.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.cliente.count()
  ])

  const response = buildPaginationResponse(items, total, page, perPage)
  return successResponse(response)
}
```

**Checklist:**
- [ ] Clientes paginado
- [ ] Fornecedoras paginado
- [ ] Despesas paginado
- [ ] Trocas paginado
- [ ] Frontend recebe e exibe paginação

---

#### Terça-feira: Sistema de Emails

**P2#18: Implementar envio de emails**

**Tarefas:**
1. [ ] Escolher serviço (Resend recomendado)
2. [ ] Criar conta e obter API key
3. [ ] Instalar dependência `resend`
4. [ ] Criar `src/lib/email.ts`
5. [ ] Criar templates de email
6. [ ] Implementar reset de senha
7. [ ] Implementar confirmação de pedido
8. [ ] Testar envios

**Setup Resend:**
```bash
npm install resend
```

**Implementação:**
```typescript
// src/lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXTAUTH_URL}/redefinir-senha?token=${token}`

  await resend.emails.send({
    from: 'Retrô Carólis <noreply@retrocarolis.com>',
    to: email,
    subject: 'Redefinir sua senha',
    html: `
      <h1>Redefinir Senha</h1>
      <p>Clique no link abaixo para redefinir sua senha:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Este link expira em 1 hora.</p>
    `
  })
}

export async function sendOrderConfirmationEmail(
  email: string,
  orderNumber: string,
  total: number,
  items: any[]
) {
  await resend.emails.send({
    from: 'Retrô Carólis <noreply@retrocarolis.com>',
    to: email,
    subject: `Pedido #${orderNumber} confirmado!`,
    html: `
      <h1>Pedido Confirmado!</h1>
      <p>Seu pedido #${orderNumber} foi confirmado.</p>
      <p>Total: R$ ${(total / 100).toFixed(2)}</p>
      <h2>Itens:</h2>
      <ul>
        ${items.map(item => `<li>${item.nome} - R$ ${item.preco}</li>`).join('')}
      </ul>
    `
  })
}
```

**Integrar em esqueci-senha:**
```typescript
// src/app/api/auth/esqueci-senha/route.ts
import { sendPasswordResetEmail } from '@/lib/email'

// Substituir console.log por:
await sendPasswordResetEmail(user.email, resetToken)
```

**Integrar em webhook:**
```typescript
// src/app/api/webhooks/mercadopago/route.ts
import { sendOrderConfirmationEmail } from '@/lib/email'

async function handleApprovedPayment(paymentInfo: any) {
  // ... criar venda ...

  // Enviar email de confirmação
  await sendOrderConfirmationEmail(
    cliente.email,
    venda.numeroVenda,
    venda.total,
    venda.itens
  )
}
```

**Checklist:**
- [ ] Resend configurado
- [ ] Email de reset funciona
- [ ] Email de confirmação funciona
- [ ] Templates são responsivos
- [ ] Emails chegam na caixa de entrada

---

#### Quarta-feira: Índices de Performance

**P2#16: Adicionar índices compostos**

**Tarefas:**
1. [ ] Analisar queries mais comuns
2. [ ] Adicionar índices compostos no schema
3. [ ] Criar migração
4. [ ] Testar performance antes/depois
5. [ ] Documentar melhorias

**Implementação:**
```prisma
// prisma/schema.prisma

model Produto {
  // ... campos existentes ...

  // NOVOS ÍNDICES COMPOSTOS
  @@index([brechoId, ativo, categoria])
  @@index([brechoId, vendido])
  @@index([brechoId, ativo, destaque])
  @@index([fornecedoraId, vendido])
}

model Venda {
  // ... campos existentes ...

  // NOVOS ÍNDICES COMPOSTOS
  @@index([origem, status, dataVenda])
  @@index([brechoId, status, dataVenda])
  @@index([clienteId, status])
}

model Cliente {
  // ... campos existentes ...

  @@index([brechoId, ativo])
}
```

**Migração:**
```bash
npx prisma migrate dev --name add-composite-indexes
```

**Teste de Performance:**
```typescript
// Testar antes e depois
console.time('Query produtos ativos')
await prisma.produto.findMany({
  where: {
    brechoId: 'xxx',
    ativo: true,
    categoria: 'roupas'
  }
})
console.timeEnd('Query produtos ativos')
```

**Checklist:**
- [ ] Índices adicionados
- [ ] Migração executada
- [ ] Queries 50%+ mais rápidas
- [ ] Nenhum erro em produção

---

#### Quinta-feira: Error Handling

**P2#19: Melhorar error handling**

**Tarefas:**
1. [ ] Instalar biblioteca de toast notifications
2. [ ] Criar componente de notificações
3. [ ] Adicionar error boundaries
4. [ ] Melhorar mensagens de erro
5. [ ] Adicionar feedback visual

**Setup:**
```bash
npm install react-hot-toast
```

**Implementação:**
```typescript
// src/app/layout.tsx
import { Toaster } from 'react-hot-toast'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
```

**Usar em CartContext:**
```typescript
// src/contexts/CartContext.tsx
import toast from 'react-hot-toast'

useEffect(() => {
  try {
    localStorage.setItem('brechoCart', JSON.stringify(state.items))
  } catch (error) {
    console.error('Error saving cart:', error)
    toast.error('Erro ao salvar carrinho. Por favor, tente novamente.')
  }
}, [state.items])
```

**Error Boundary:**
```typescript
// src/components/ErrorBoundary.tsx
'use client'

import { Component, ReactNode } from 'react'

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2>Algo deu errado</h2>
          <button onClick={() => window.location.reload()}>
            Recarregar página
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

**Checklist:**
- [ ] Toast notifications funcionando
- [ ] Erros exibidos ao usuário
- [ ] Error boundaries implementados
- [ ] Feedback visual em operações

---

#### Sexta-feira: Validações e Debounce

**P2#17 e P2#20**

**Tarefas:**
1. [ ] Melhorar validação de campos opcionais
2. [ ] Adicionar debounce em buscas
3. [ ] Criar utility de debounce
4. [ ] Implementar em todas as buscas
5. [ ] Testar performance

**Implementação Debounce:**
```typescript
// src/lib/utils.ts
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
```

**Usar em busca:**
```typescript
// Exemplo em página de produtos
const [searchTerm, setSearchTerm] = useState('')

const debouncedSearch = useMemo(
  () =>
    debounce((query: string) => {
      fetchProdutos(query)
    }, 300),
  []
)

useEffect(() => {
  debouncedSearch(searchTerm)
}, [searchTerm, debouncedSearch])
```

**Validações opcionais:**
```typescript
// Melhorar schemas Zod
complemento: z.string()
  .min(1, 'Complemento não pode ser vazio')
  .optional()
  .or(z.literal(''))
  .transform(val => val || undefined)
```

**Checklist:**
- [ ] Debounce em todas as buscas
- [ ] Campos opcionais validados corretamente
- [ ] Menos requests desnecessárias

---

### 🎯 Semana 3: P2 Restantes

#### Segunda-Terça: Revisar e Testar

**Tarefas:**
1. [ ] Revisar todos os P2 implementados
2. [ ] Testar cada funcionalidade
3. [ ] Corrigir bugs encontrados
4. [ ] Atualizar documentação

**Checklist P2:**
- [ ] P2#13: any (deixar para Fase 2)
- [ ] P2#14: console.log (deixar para Fase 2)
- [ ] P2#15: Paginação ✅
- [ ] P2#16: Índices ✅
- [ ] P2#17: Validações ✅
- [ ] P2#18: Emails ✅
- [ ] P2#19: Error handling ✅
- [ ] P2#20: Debounce ✅
- [ ] P2#21-24: Outros (revisar)

---

## 📅 FASE 2: CODE QUALITY (Semana 4)

**Objetivo:** Melhorar qualidade do código

### Segunda: Logger Profissional

**P2#14: Substituir console.log**

**Tarefas:**
1. [ ] Instalar pino (logger)
2. [ ] Criar `src/lib/logger.ts`
3. [ ] Substituir console.log (42 ocorrências)
4. [ ] Configurar níveis de log
5. [ ] Testar em desenvolvimento e produção

**Setup:**
```bash
npm install pino pino-pretty
```

**Implementação:**
```typescript
// src/lib/logger.ts
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  })
})

// Usage
logger.info('User logged in', { userId: '123' })
logger.error('Payment failed', { error, paymentId })
```

**Substituir:**
```typescript
// ❌ ANTES
console.log('Payment approved:', paymentInfo.id)
console.error('Error:', error)

// ✅ DEPOIS
logger.info('Payment approved', { paymentId: paymentInfo.id })
logger.error('Payment processing error', { error, paymentId })
```

**Checklist:**
- [ ] Logger configurado
- [ ] 42 console.logs substituídos
- [ ] Logs estruturados (JSON)
- [ ] Níveis de log apropriados

---

### Terça-Quarta: Reduzir `any`

**P2#13: Substituir any por tipos específicos**

**Tarefas:**
1. [ ] Listar todos os 51 usos de `any`
2. [ ] Categorizar por tipo de uso
3. [ ] Criar tipos apropriados
4. [ ] Substituir progressivamente
5. [ ] Testar compilação TypeScript

**Estratégia:**
```typescript
// ❌ ANTES
} catch (error: any) {
  console.error('Error:', error)
}

const where: any = {}

// ✅ DEPOIS
} catch (error: unknown) {
  if (error instanceof Error) {
    logger.error('Error occurred', { error: error.message })
  }
}

type WhereClause = Prisma.ProdutoWhereInput
const where: WhereClause = {}
```

**Priorização:**
1. Errors em catch blocks (mais comum)
2. Where clauses do Prisma
3. Event handlers
4. Props de componentes
5. Outros

**Checklist:**
- [ ] < 10 usos de `any` restantes
- [ ] TypeScript strict mode habilitado
- [ ] Nenhum erro de compilação
- [ ] Type safety melhorado

---

### Quinta-Sexta: Refatoração e Otimização

**Tarefas:**
1. [ ] Refatorar código duplicado
2. [ ] Otimizar queries do Prisma
3. [ ] Melhorar componentes reutilizáveis
4. [ ] Documentar funções complexas
5. [ ] Code review geral

**Checklist:**
- [ ] DRY (Don't Repeat Yourself) aplicado
- [ ] Funções < 50 linhas
- [ ] Componentes bem documentados
- [ ] Código limpo e legível

---

## 📅 FASE 3: FUNCIONALIDADES E TODOs (Semana 5-6)

**Objetivo:** Implementar TODOs prioritários (43 total)

### Priorização dos TODOs

**P0 - Críticos (FAZER):**
1. Implementar NextAuth completamente
2. Middleware de autenticação
3. Processar webhooks completamente (criar venda real)
4. Atualizar estoque no webhook
5. Implementar multi-tenant por domínio

**P1 - Importantes (FAZER):**
6. Fetch from API em páginas mockadas (8 TODOs)
7. Sistema de permissões
8. Cupons de desconto
9. Logout implementado
10. Email templates profissionais

**P2 - Nice to Have (AVALIAR):**
11-43. Outros TODOs (documentar e priorizar com usuário)

---

### Semana 5: TODOs Críticos

#### Segunda-Terça: NextAuth Completo

**Tarefas:**
1. [ ] Criar route handler `/api/auth/[...nextauth]/route.ts`
2. [ ] Implementar verificação de senha
3. [ ] Configurar sessões
4. [ ] Testar login/logout
5. [ ] Implementar middleware de autenticação

**Implementação:**
```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname

      // Public paths
      if (path.startsWith('/loja')) return true
      if (path === '/login') return true
      if (path === '/cadastro') return true

      // Protected paths require auth
      return !!token
    }
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
```

**Checklist:**
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Sessão persiste
- [ ] Middleware protege rotas
- [ ] Redirect correto

---

#### Quarta-Quinta: Webhook Completo

**Tarefas:**
1. [ ] Implementar criação de venda no webhook
2. [ ] Atualizar estoque de produtos
3. [ ] Criar cliente se não existir
4. [ ] Criar créditos para consignadas
5. [ ] Enviar email de confirmação
6. [ ] Testar com pagamentos reais (sandbox)

**Implementação:**
```typescript
// src/app/api/webhooks/mercadopago/route.ts
async function handleApprovedPayment(paymentInfo: any) {
  const paymentId = paymentInfo.id.toString()

  // Idempotency check
  const vendaExistente = await prisma.venda.findUnique({
    where: { mercadoPagoPaymentId: paymentId }
  })

  if (vendaExistente) return

  // Get preference data (stored when creating preference)
  const preferenceData = await getPreferenceData(paymentInfo.preference_id)

  // Create sale with transaction
  const venda = await prisma.$transaction(async (tx) => {
    // 1. Create or get cliente
    const cliente = await tx.cliente.upsert({
      where: { email: preferenceData.payer.email },
      update: {},
      create: {
        nome: preferenceData.payer.nome + ' ' + preferenceData.payer.sobrenome,
        email: preferenceData.payer.email,
        cpf: preferenceData.payer.cpf,
        telefone: preferenceData.payer.telefone,
        brechoId: preferenceData.brechoId
      }
    })

    // 2. Create venda
    const novaVenda = await tx.venda.create({
      data: {
        brechoId: preferenceData.brechoId,
        clienteId: cliente.id,
        vendedorId: preferenceData.vendedorId || 'SYSTEM',
        numeroVenda: generateOrderNumber(),
        formaPagamento: mapPaymentMethod(paymentInfo.payment_method_id),
        subtotal: paymentInfo.transaction_amount,
        total: paymentInfo.transaction_amount,
        origem: 'ONLINE',
        status: 'PAGO',
        mercadoPagoPaymentId: paymentId,
        mercadoPagoStatus: paymentInfo.status,
        mercadoPagoPreferenceId: paymentInfo.preference_id,
        dataPagamento: new Date(),
        enderecoEntrega: preferenceData.shipment.endereco
      }
    })

    // 3. Create items and update stock
    for (const item of preferenceData.items) {
      await tx.itemVenda.create({
        data: {
          vendaId: novaVenda.id,
          produtoId: item.id,
          quantidade: item.quantidade,
          precoUnitario: item.preco,
          subtotal: item.preco * item.quantidade
        }
      })

      // Update product
      await tx.produto.update({
        where: { id: item.id },
        data: {
          vendido: true,
          estoque: { decrement: item.quantidade },
          dataVenda: new Date()
        }
      })

      // Create credit if consignado
      const produto = await tx.produto.findUnique({
        where: { id: item.id },
        include: { fornecedora: true }
      })

      if (produto?.tipo === 'CONSIGNADO' && produto.fornecedoraId) {
        const valorVenda = item.preco * item.quantidade
        const percentualRepasse = produto.fornecedora?.percentualRepasse || 60
        const valorCredito = (valorVenda * percentualRepasse) / 100

        await tx.credito.create({
          data: {
            fornecedoraId: produto.fornecedoraId,
            vendaId: novaVenda.id,
            produtoId: produto.id,
            valorVenda,
            percentualRepasse,
            valorCredito,
            status: 'PENDENTE',
            dataVenda: new Date(),
            dataLiberacao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        })
      }
    }

    return novaVenda
  })

  // 4. Send confirmation email
  await sendOrderConfirmationEmail(
    venda.cliente.email,
    venda.numeroVenda,
    venda.total,
    venda.itens
  )

  logger.info('Sale created from webhook', {
    vendaId: venda.id,
    paymentId
  })
}
```

**Checklist:**
- [ ] Webhook cria venda completa
- [ ] Estoque atualizado
- [ ] Cliente criado/atualizado
- [ ] Créditos criados (consignadas)
- [ ] Email enviado
- [ ] Logs estruturados

---

#### Sexta: Outras Funcionalidades

**Tarefas:**
1. [ ] Implementar cupons de desconto
2. [ ] Sistema de permissões básico
3. [ ] Melhorar páginas mockadas
4. [ ] Substituir dados mock por API real

---

### Semana 6: Testes e Polimento

**Tarefas:**
1. [ ] Revisar todos os TODOs implementados
2. [ ] Testar cada funcionalidade
3. [ ] Corrigir bugs
4. [ ] Preparar para deploy

---

## 📅 FASE 4: TESTES E DEPLOY (Semana 6+)

**Objetivo:** Testes completos e deploy em produção

### Testes Automatizados

**Unit Tests:**
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

**Testes prioritários:**
1. [ ] Validadores (CPF, email, telefone)
2. [ ] Utilitários (debounce, formatters)
3. [ ] Lógica de negócio (cálculos, regras)

**Integration Tests:**
1. [ ] APIs principais
2. [ ] Fluxo de autenticação
3. [ ] Fluxo de compra

**E2E Tests (Playwright):**
```bash
npm install --save-dev @playwright/test
```

1. [ ] Jornada do usuário completa
2. [ ] Checkout e pagamento
3. [ ] Admin dashboard

---

### Deploy em Produção

**Checklist Pre-Deploy:**
- [ ] Todos os testes passando
- [ ] Build sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados migrado
- [ ] Mercado Pago em modo produção
- [ ] Emails configurados (domínio real)
- [ ] Monitoramento configurado (Sentry)
- [ ] Backup configurado

**Deploy:**
```bash
# Vercel
vercel --prod

# Railway
railway up

# Docker
docker build -t retrocarolis .
docker push
```

**Post-Deploy:**
1. [ ] Smoke tests em produção
2. [ ] Monitorar logs por 24h
3. [ ] Testar fluxo completo
4. [ ] Configurar alertas
5. [ ] Documentar deploy

---

## 📊 TRACKING E MÉTRICAS

### Métricas Semanais

**Semana 1:**
- [ ] P0: 0/0 ✅
- [ ] P1: 0/0 ✅
- [ ] Testes de integração: 10/10
- [ ] Bugs encontrados: 0

**Semana 2-3:**
- [ ] P2: 0/12
- [ ] Console.logs: 42 → X
- [ ] Any: 51 → X

**Semana 4:**
- [ ] Console.logs: → 0
- [ ] Any: → <10
- [ ] Code quality: B → A

**Semana 5-6:**
- [ ] TODOs: 43 → 10
- [ ] Funcionalidades: 90% complete
- [ ] Testes: 80% coverage

---

## 🎯 PRÓXIMA AÇÃO IMEDIATA

### COMEÇAR AGORA: Fase 0 - Segunda-feira

**Tarefas de hoje:**
1. [ ] Executar migração do banco
2. [ ] Configurar variáveis de ambiente
3. [ ] Verificar build
4. [ ] Preparar ambiente de testes

**Comandos:**
```bash
# 1. Migração
npx prisma migrate dev --name add-mercadopago-fields

# 2. Build
npm run build

# 3. TypeScript check
npx tsc --noEmit

# 4. Instalar dev dependencies
npm install --save-dev @types/node
```

**Quer que eu comece executando esses comandos agora?** 🚀

---

**Documento criado:** 2025-11-06
**Timeline total:** 6 semanas
**Abordagem:** Qualidade Primeiro
**Status:** Pronto para executar ✅

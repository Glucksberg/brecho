# 🛡️ GUIA: PROTEÇÃO CSRF (Cross-Site Request Forgery)

**Status:** ✅ **PARCIALMENTE IMPLEMENTADO** (NextAuth fornece proteção básica)
**Criticidade:** 🟡 **ALTA** para operações autenticadas

---

## 🎯 O QUE É CSRF?

CSRF (Cross-Site Request Forgery) é um ataque onde um site malicioso faz requisições para sua aplicação usando as credenciais do usuário autenticado (cookies de sessão).

**Exemplo de ataque:**
1. Usuário está logado em `retrocarolis.com`
2. Usuário visita `site-malicioso.com`
3. `site-malicioso.com` faz request POST para `retrocarolis.com/api/produtos/delete`
4. Como usuário está autenticado, o request é executado

---

## ✅ PROTEÇÃO EXISTENTE

### NextAuth (Autenticação)

NextAuth **já fornece proteção CSRF automática** para:
- Login (`/api/auth/signin`)
- Logout (`/api/auth/signout`)
- Todas as rotas de autenticação

**Como funciona:**
```typescript
// NextAuth gera um token CSRF automaticamente
// O token é validado em todas as requisições de autenticação
// Configurado em: src/lib/auth.ts

export const authOptions: NextAuthOptions = {
  // ...
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60
  }
  // CSRF protection é habilitado automaticamente
}
```

**Requisitos:**
- ✅ `NEXTAUTH_SECRET` deve estar configurado no `.env`
- ✅ Todas as rotas NextAuth são protegidas automaticamente

---

## ⚠️ ROTAS QUE PRECISAM PROTEÇÃO ADICIONAL

As seguintes rotas **NÃO** estão protegidas por CSRF automaticamente:

### APIs Públicas (Sem Autenticação)
❌ `/api/auth/cadastro` - Criação de conta
❌ `/api/auth/esqueci-senha` - Solicitação de reset
❌ `/api/auth/redefinir-senha` - Reset de senha
❌ `/api/webhooks/mercadopago` - Webhook (protegido por signature)

**Solução:** Estas APIs usam **outros métodos de proteção**:
- Rate limiting (recomendado - ver RATE_LIMITING_GUIDE.md)
- Webhook signature validation (já implementado)
- Captcha (recomendado para cadastro)

### APIs Privadas (Com Autenticação)
⚠️ `/api/vendas` - Criar venda
⚠️ `/api/produtos` - CRUD de produtos
⚠️ `/api/clientes` - CRUD de clientes
⚠️ `/api/fornecedoras` - CRUD de fornecedoras
⚠️ `/api/despesas` - CRUD de despesas
⚠️ `/api/caixa` - Operações de caixa
⚠️ `/api/trocas` - Trocas e devoluções

**Solução:** Implementar validação de sessão em cada API.

---

## 📝 SOLUÇÃO: VALIDAÇÃO DE SESSÃO EM APIs

### Opção 1: Validar Sessão Manualmente (Atual)

Para cada API que requer autenticação, adicione validação de sessão:

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  // Validate session
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'Não autenticado' },
      { status: 401 }
    )
  }

  // Continue with request...
  // session.user contains authenticated user data
}
```

**Vantagens:**
- Simples de implementar
- Controle granular por rota
- Já protege contra CSRF (porque valida JWT)

**Desvantagens:**
- Precisa adicionar em cada API
- Código repetitivo

---

### Opção 2: Middleware Global (Recomendado)

Criar middleware para proteger todas as rotas `/api/*` automaticamente.

**Arquivo:** `middleware.ts` (raiz do projeto)

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Routes that require authentication
const protectedApiRoutes = [
  '/api/vendas',
  '/api/produtos',
  '/api/clientes',
  '/api/fornecedoras',
  '/api/despesas',
  '/api/caixa',
  '/api/trocas'
]

// Routes that are public (no auth needed)
const publicApiRoutes = [
  '/api/auth',           // NextAuth routes
  '/api/webhooks',       // Webhooks (protected by signature)
  '/api/produtos/public' // Public product listing
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route requires authentication
  const isProtectedRoute = protectedApiRoutes.some(route =>
    pathname.startsWith(route)
  )

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Validate JWT token from session
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  if (!token) {
    return NextResponse.json(
      { error: 'Não autenticado' },
      { status: 401 }
    )
  }

  // Add user info to headers (accessible in API route)
  const response = NextResponse.next()
  response.headers.set('x-user-id', token.id as string)
  response.headers.set('x-user-role', token.tipo as string)

  return response
}

export const config = {
  matcher: '/api/:path*'
}
```

**Como usar no API route:**

```typescript
export async function POST(request: NextRequest) {
  // User is already authenticated by middleware
  const userId = request.headers.get('x-user-id')
  const userRole = request.headers.get('x-user-role')

  // Continue with request...
}
```

---

## 🎯 PROTEÇÕES COMPLEMENTARES

### 1. SameSite Cookies

NextAuth já configura cookies com `SameSite=Lax`, o que previne CSRF em muitos casos.

Verifique em: `next-auth` configuration
```typescript
cookies: {
  sessionToken: {
    name: `__Secure-next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax', // Previne CSRF
      path: '/',
      secure: process.env.NODE_ENV === 'production'
    }
  }
}
```

### 2. Origin Validation

Adicionar validação de origem em APIs críticas:

```typescript
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  const allowedOrigins = [
    process.env.NEXTAUTH_URL,
    'http://localhost:3000'
  ]

  if (!origin || !allowedOrigins.includes(origin)) {
    return NextResponse.json(
      { error: 'Origin não permitida' },
      { status: 403 }
    )
  }

  // Continue...
}
```

### 3. Referer Validation

```typescript
const referer = request.headers.get('referer')
if (!referer || !referer.startsWith(process.env.NEXTAUTH_URL!)) {
  return NextResponse.json(
    { error: 'Referer inválido' },
    { status: 403 }
  )
}
```

---

## 🧪 TESTANDO PROTEÇÃO CSRF

### Teste Manual

1. **Login no sistema:**
```bash
# Login via browser em http://localhost:3000/login
```

2. **Tentar fazer request de outro domínio:**
```html
<!-- Criar página HTML em outro servidor -->
<form action="http://localhost:3000/api/vendas" method="POST">
  <input type="hidden" name="data" value="malicious" />
  <button type="submit">Send</button>
</form>
```

**Resultado esperado:** Request deve ser bloqueado (401 Unauthorized)

### Teste Automatizado

```typescript
// tests/csrf.test.ts
import { POST } from '@/app/api/vendas/route'

test('should reject request without valid session', async () => {
  const request = new Request('http://localhost:3000/api/vendas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: 'test' })
  })

  const response = await POST(request)
  expect(response.status).toBe(401)
})
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

Antes de produção:

### Básico (Mínimo)
- [x] `NEXTAUTH_SECRET` configurado no `.env`
- [x] NextAuth configurado corretamente
- [ ] Middleware de autenticação implementado
- [ ] Todas as APIs protegidas validam sessão

### Avançado (Recomendado)
- [ ] SameSite cookies configurado
- [ ] Origin validation em APIs críticas
- [ ] Rate limiting implementado (ver RATE_LIMITING_GUIDE.md)
- [ ] Captcha em formulários públicos
- [ ] Headers de segurança configurados

### Headers de Segurança (next.config.js)

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  }
}
```

---

## 🚨 IMPORTANTE

### NextAuth CSRF Protection

NextAuth **automaticamente** protege contra CSRF em:
- ✅ Login/Logout
- ✅ Todas as rotas `/api/auth/*`

Mas **NÃO** protege automaticamente:
- ❌ Suas APIs customizadas (`/api/vendas`, `/api/produtos`, etc.)

**Solução:** Adicionar validação de sessão em todas as APIs que requerem autenticação.

### Não É Suficiente Apenas Verificar Cookies

```typescript
// ❌ ERRADO - vulnerável a CSRF
const cookie = request.cookies.get('session')
if (cookie) {
  // Aceita request
}

// ✅ CORRETO - usa NextAuth para validar sessão
const session = await getServerSession(authOptions)
if (session?.user) {
  // Aceita request
}
```

---

## 📚 RECURSOS

- [NextAuth CSRF Protection](https://next-auth.js.org/configuration/options#cookies)
- [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [MDN SameSite Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)

---

**Status Atual:** ⚠️ **IMPLEMENTAÇÃO PARCIAL**
- ✅ NextAuth CSRF protection habilitado
- ⚠️ APIs customizadas precisam validação de sessão
- ❌ Middleware global não implementado

**Prioridade:** 🟡 **ALTA** antes de produção

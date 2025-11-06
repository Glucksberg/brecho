# 🛡️ GUIA DE IMPLEMENTAÇÃO: RATE LIMITING

**Criticidade:** 🔴 **CRÍTICO** para produção
**Status:** ⚠️ **NÃO IMPLEMENTADO** (requer configuração)

---

## 🎯 PROBLEMA

As APIs de autenticação **NÃO têm rate limiting**, o que permite:
- ❌ Brute force attacks em login
- ❌ Enumeração de emails válidos
- ❌ Spam de cadastros
- ❌ Tentativas ilimitadas de reset de senha

**Risco:** ALTO - Sistema vulnerável a ataques automatizados

---

## ✅ SOLUÇÃO

Existem 3 abordagens para implementar rate limiting:

### Opção 1: Upstash Redis (Recomendado - Serverless)
**Vantagens:** Funciona em Vercel/serverless, sem infraestrutura
**Desvantagens:** Requer conta Upstash (tem tier gratuito)

### Opção 2: Vercel Rate Limit Middleware
**Vantagens:** Nativo do Vercel, sem dependências externas
**Desvantagens:** Apenas funciona no Vercel

### Opção 3: Node.js Rate Limiter
**Vantagens:** Sem dependências externas
**Desvantagens:** Não funciona em serverless (memória não é compartilhada)

---

## 📝 IMPLEMENTAÇÃO - OPÇÃO 1 (UPSTASH - RECOMENDADO)

### Passo 1: Criar Conta Upstash

1. Acesse: https://upstash.com/
2. Crie conta gratuita
3. Crie um banco Redis
4. Copie as credenciais:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### Passo 2: Instalar Dependências

```bash
npm install @upstash/ratelimit @upstash/redis
```

### Passo 3: Configurar `.env.local`

```env
# Upstash Redis (para rate limiting)
UPSTASH_REDIS_REST_URL="https://xxxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token-here"
```

### Passo 4: Criar Utilitário de Rate Limit

**Arquivo:** `src/lib/rate-limit.ts`

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Create Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Create rate limiters
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 m'), // 5 requests per 10 minutes
  analytics: true,
})

export const generalRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 m'), // 20 requests per minute
  analytics: true,
})

// Helper function to get client IP
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return ip
}
```

### Passo 5: Aplicar em APIs de Autenticação

**Exemplo:** `src/app/api/auth/cadastro/route.ts`

```typescript
import { authRateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const ip = getClientIp(request)
  const { success, limit, reset, remaining } = await authRateLimit.limit(ip)

  if (!success) {
    return NextResponse.json(
      {
        error: 'Muitas tentativas. Tente novamente mais tarde.',
        retryAfter: Math.floor((reset - Date.now()) / 1000)
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        }
      }
    )
  }

  // Continue with normal logic...
  try {
    const body = await request.json()
    // ... rest of the code
  }
}
```

### Passo 6: Aplicar em Todas as APIs de Auth

Adicionar rate limiting em:
- ✅ `/api/auth/cadastro`
- ✅ `/api/auth/esqueci-senha`
- ✅ `/api/auth/redefinir-senha`
- ✅ `/api/auth/validar-token`

---

## 📝 IMPLEMENTAÇÃO - OPÇÃO 2 (VERCEL)

### Apenas se usar Vercel!

**Arquivo:** `middleware.ts`

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimit } from '@vercel/ratelimit'

const limiter = rateLimit({
  interval: '10m',
  uniqueTokenPerInterval: 500,
})

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? 'anonymous'

  // Apply rate limit only to auth routes
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    const { success } = await limiter.check(ip, 5) // 5 per 10min

    if (!success) {
      return NextResponse.json(
        { error: 'Muitas tentativas' },
        { status: 429 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/auth/:path*',
}
```

---

## 📝 IMPLEMENTAÇÃO - OPÇÃO 3 (IN-MEMORY - NÃO SERVERLESS)

### ⚠️ Apenas para deploy tradicional (não Vercel/serverless)

**Arquivo:** `src/lib/rate-limit-memory.ts`

```typescript
interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

export function checkRateLimit(
  ip: string,
  limit: number = 5,
  windowMs: number = 10 * 60 * 1000 // 10 minutes
): { success: boolean; remaining: number } {
  const now = Date.now()
  const entry = store.get(ip)

  // Clean up expired entries
  if (entry && now > entry.resetAt) {
    store.delete(ip)
  }

  const current = store.get(ip)

  if (!current) {
    store.set(ip, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: limit - 1 }
  }

  if (current.count >= limit) {
    return { success: false, remaining: 0 }
  }

  current.count++
  return { success: true, remaining: limit - current.count }
}

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(ip)
    }
  }
}, 5 * 60 * 1000)
```

**Uso:**

```typescript
import { checkRateLimit } from '@/lib/rate-limit-memory'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const { success, remaining } = checkRateLimit(ip)

  if (!success) {
    return NextResponse.json(
      { error: 'Muitas tentativas' },
      { status: 429 }
    )
  }

  // Continue...
}
```

---

## 🎯 LIMITES RECOMENDADOS

### APIs de Autenticação (Muito Restritivo)
- **Cadastro:** 3 tentativas por 15 minutos
- **Login:** 5 tentativas por 15 minutos
- **Esqueci Senha:** 3 tentativas por hora
- **Redefinir Senha:** 5 tentativas por 15 minutos

### APIs Públicas (Moderado)
- **Produtos:** 60 requests por minuto
- **Categorias:** 60 requests por minuto
- **Busca:** 20 requests por minuto

### Webhooks (Permissivo)
- **Mercado Pago:** Sem limit (já validado por signature)

---

## 🧪 TESTANDO RATE LIMITING

### Teste Manual

```bash
# Fazer múltiplas requests rapidamente
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/cadastro \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","senha":"12345678"}'
  echo ""
done
```

**Esperado:** Após 5 requests, retornar 429.

### Teste Automatizado

```typescript
// tests/rate-limit.test.ts
import { POST } from '@/app/api/auth/cadastro/route'

test('should rate limit after 5 requests', async () => {
  const requests = Array(10).fill(null).map(() =>
    POST(new Request('http://localhost:3000/api/auth/cadastro', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', senha: '12345678' })
    }))
  )

  const responses = await Promise.all(requests)
  const rateLimited = responses.filter(r => r.status === 429)

  expect(rateLimited.length).toBeGreaterThan(0)
})
```

---

## 📊 MONITORAMENTO

### Upstash Dashboard
Se usar Upstash, você pode monitorar:
- Número de requests bloqueados
- IPs mais ativos
- Padrões de ataque

### Logs
```typescript
if (!success) {
  console.warn(`Rate limit exceeded for IP: ${ip}`)
  // Send alert to monitoring service (Sentry, Datadog, etc)
}
```

---

## 🚨 IMPORTANTE

### Antes de Produção:
1. ✅ **Implementar rate limiting** (escolher opção 1, 2 ou 3)
2. ✅ **Testar com múltiplas requests**
3. ✅ **Monitorar logs** por alguns dias
4. ✅ **Ajustar limites** conforme necessário

### Sem Rate Limiting:
- ❌ Sistema vulnerável a brute force
- ❌ Pode ser abusado por bots
- ❌ Custos de infra podem explodir
- ❌ **NÃO RECOMENDADO** para produção

---

## 📚 RECURSOS

- [Upstash Rate Limiting Docs](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)
- [Vercel Rate Limiting](https://vercel.com/docs/concepts/limits/rate-limiting)
- [OWASP Rate Limiting](https://cheatsheetseries.owasp.org/cheatsheets/Rate_Limiting_Cheat_Sheet.html)

---

**Status:** ⚠️ **IMPLEMENTAÇÃO PENDENTE**
**Prioridade:** 🔴 **CRÍTICA** antes de produção

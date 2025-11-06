# 🐛 RELATÓRIO DE BUGS - REVISÃO COMPLETA

## 🔴 PROBLEMAS CRÍTICOS (Quebram o sistema)

### 1. **NOMENCLATURA DE MODELOS PRISMA** ⚠️ CRÍTICO

**Localização:** Todas as APIs de autenticação

**Problema:**
Os nomes dos modelos e campos do Prisma estão ERRADOS em todas as APIs.

**Schema Prisma:**
```prisma
model User {  // Nome do modelo é "User"
  name String?
  email String
  password String?
  role UserRole
  ativo Boolean
  ...
}
```

**Código ERRADO (nas APIs):**
```typescript
prisma.usuario.findUnique()  // ❌ Deveria ser prisma.user
prisma.usuario.create({
  nome: ...      // ❌ Deveria ser name
  senha: ...     // ❌ Deveria ser password
  papel: ...     // ❌ Deveria ser role
  status: ...    // ❌ Deveria ser ativo (boolean)
})
```

**Arquivos Afetados:**
- `/src/app/api/auth/cadastro/route.ts` (linhas 31, 56)
- `/src/app/api/auth/esqueci-senha/route.ts` (linhas 16, 32)
- `/src/app/api/auth/validar-token/route.ts`
- `/src/app/api/auth/redefinir-senha/route.ts`

---

### 2. **CAMPOS INCOMPATÍVEIS NO CADASTRO** ⚠️ CRÍTICO

**Arquivo:** `/src/app/api/auth/cadastro/route.ts`

**Problemas:**
```typescript
// Linha 56-66
prisma.usuario.create({
  brechoId: brecho.id,  // ✅ OK
  nome: validated.nome,  // ❌ Campo é "name" no schema
  email: validated.email,  // ✅ OK
  senha: senhaHash,  // ❌ Campo é "password" no schema
  telefone: validated.telefone,  // ❌ NÃO existe no schema User!
  cpf: validated.cpf,  // ❌ NÃO existe no schema User!
  papel: 'CLIENTE',  // ❌ Campo é "role", valor é UserRole.CLIENTE
  status: 'ATIVO',  // ❌ Campo é "ativo" (boolean), não string
  endereco: "..."  // ❌ NÃO existe no schema User!
})
```

**Schema Real:**
```prisma
model User {
  name String?
  email String
  password String?
  role UserRole @default(CLIENTE)
  ativo Boolean @default(true)
  // NÃO TEM: telefone, cpf, endereco
}
```

---

### 3. **FALTA CAMPOS ESSENCIAIS NO USER** ⚠️ DESIGN

O modelo `User` não tem campos que são necessários para cadastro de clientes:
- telefone
- cpf
- endereco

**Opções:**
1. Adicionar esses campos ao modelo `User`
2. Criar um modelo `Cliente` separado e linkar
3. Usar o modelo `Cliente` existente para dados adicionais

---

### 4. **ENUMS INCONSISTENTES** ⚠️ MÉDIO

**Problema:** Valores de enums não batem entre código e schema

**Mercado Pago Integration:**
```typescript
// Código usa:
'CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX', 'BOLETO'

// Schema tem:
enum FormaPagamento {
  DINHEIRO
  CARTAO  // ❌ Genérico demais
  PIX
  TRANSFERENCIA
}
```

---

### 5. **FALTA VALIDAÇÃO DE USUARIO.FINDUNIQUE** ⚠️ MÉDIO

**Arquivo:** `/src/app/api/auth/redefinir-senha/route.ts`

```typescript
const usuario = await prisma.usuario.findFirst({
  where: { resetToken: token, ... }
})
```

Deveria validar se `usuario` existe antes de usar `usuario.id`

---

## 🟡 PROBLEMAS DE LÓGICA

### 6. **CONFIRMAÇÃO DE SENHA NÃO É ENVIADA** ⚠️ LÓGICO

**Arquivo:** `/src/app/cadastro/page.tsx`

A página coleta `confirmarSenha` mas NÃO envia para a API:
```typescript
body: JSON.stringify(formData)  // contém confirmarSenha
```

Mas a API não valida/usa esse campo.

**Solução:** Validar no frontend antes de enviar OU adicionar validação na API.

---

### 7. **FALTA TRATAMENTO DE CAMPOS OPCIONAIS** ⚠️ LÓGICO

**Arquivo:** `/src/app/loja/checkout/page.tsx`

```typescript
nome: dadosCliente.nome.split(' ')[0],
sobrenome: dadosCliente.nome.split(' ').slice(1).join(' '),
```

Se o usuário digitar só um nome, `sobrenome` será string vazia, o que pode causar problemas no Mercado Pago.

---

### 8. **CARRINHO NÃO LIMPA APÓS SUCESSO** ⚠️ UX

**Arquivo:** `/src/app/loja/checkout/sucesso/page.tsx`

```typescript
useEffect(() => {
  if (status === 'approved') {
    clearCart()
  }
}, [status, clearCart])
```

Mas `clearCart` não está nos deps do useEffect, pode causar warning.

---

## 🟢 PROBLEMAS MENORES

### 9. **MISSING LOADING STATES**

Várias páginas não têm estados de loading:
- `/src/app/loja/favoritos/page.tsx`
- `/src/app/despesas/page.tsx`

### 10. **HARD-CODED MOCK DATA**

Algumas páginas ainda têm dados mockados:
- `/src/app/loja/conta/page.tsx` (usuario, pedidos)
- `/src/app/despesas/page.tsx` (despesas)

### 11. **FALTA ERROR BOUNDARIES**

Nenhuma página tem error boundaries. Se houver erro, todo o app quebra.

### 12. **MISSING ALT TEXTS**

Várias imagens sem alt text (acessibilidade).

---

## 🔧 PROBLEMAS DE CONFIGURAÇÃO

### 13. **FALTA .env NO PROJETO**

O arquivo `.env` não existe, só `.env.example`. Ao rodar o projeto, vai quebrar.

### 14. **MERCADO PAGO SDK IMPORT**

**Arquivo:** `/src/lib/mercadopago.ts`

```typescript
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'
```

Precisa verificar se o SDK está corretamente instalado e se os tipos estão corretos.

---

## 📊 RESUMO

| Severidade | Quantidade | Status |
|------------|------------|--------|
| 🔴 Crítico | 5 | BLOCKER |
| 🟡 Lógico | 3 | HIGH |
| 🟢 Menor | 4 | MEDIUM |
| 🔧 Config | 2 | MEDIUM |

**Total:** 14 bugs encontrados

---

## ✅ PRIORIDADE DE CORREÇÃO

### P0 - BLOCKER (Não roda sem corrigir)
1. ✅ Corrigir nomenclatura Prisma (user, name, password, role, ativo)
2. ✅ Adicionar campos faltantes ao User OU usar Cliente
3. ✅ Corrigir enums de FormaPagamento

### P1 - CRÍTICO (Quebra funcionalidade)
4. ✅ Validar campos obrigatórios nas APIs
5. ✅ Tratar nomes com espaço único no checkout

### P2 - IMPORTANTE (Melhoria necessária)
6. ✅ Adicionar loading states
7. ✅ Remover dados mockados
8. ✅ Adicionar error boundaries

---

## 🚀 PRÓXIMOS PASSOS

1. Corrigir TODOS os bugs P0 (blocker)
2. Decidir arquitetura: User com campos extras OU User + Cliente
3. Executar prisma migrate
4. Testar fluxo completo
5. Corrigir bugs P1 e P2

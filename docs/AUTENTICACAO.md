# Arquitetura de Autenticação - Retrô Carólis

## Visão Geral

O sistema possui **duas fontes de autenticação completamente separadas**:

### 1. Portal de Licenças (Gerenciamento Externo)
- **Usuários**: DONO (MASTER) e VENDEDOR
- **Credenciais**: Fornecidas pelo Portal de Licenças
- **Autenticação**: Sempre via Portal de Licenças (externo)
- **Login**: `/login` (username + password)
- **Gerenciamento**: Portal de Licenças controla criação, senhas e permissões

### 2. Sistema Local (Gerenciamento Interno)
- **Usuários**: CLIENTE
- **Credenciais**: Criadas pelos próprios clientes
- **Autenticação**: Banco de dados local (bcrypt)
- **Login**: `/loja/login` (email + password) ou Google OAuth
- **Gerenciamento**: Sistema local controla criação e senhas

## Separação de Responsabilidades

```
┌─────────────────────────────────────────────────────────┐
│           PORTAL DE LICENÇAS (Externo)                 │
│  ┌──────────────────┐  ┌──────────────────┐          │
│  │   DONO (MASTER)  │  │    VENDEDOR      │          │
│  │                  │  │                  │          │
│  │ username: dono   │  │ username: vend1  │          │
│  │ password: ***    │  │ password: ***    │          │
│  └──────────────────┘  └──────────────────┘          │
│                                                        │
│  • Gerencia credenciais                                │
│  • Valida licenças                                     │
│  • Controla acesso                                     │
└─────────────────────────────────────────────────────────┘
                        │
                        │ Validação via API
                        ▼
┌─────────────────────────────────────────────────────────┐
│              SISTEMA RETRÔ CARÓLIS                      │
│                                                        │
│  ┌──────────────────────────────────────────────┐     │
│  │  Login Administrativo (/login)               │     │
│  │  • username + password                       │     │
│  │  • Valida via Portal de Licenças             │     │
│  │  • Cria/atualiza User local                  │     │
│  └──────────────────────────────────────────────┘     │
│                                                        │
│  ┌──────────────────────────────────────────────┐     │
│  │  Login Cliente (/loja/login)                 │     │
│  │  • email + password (banco local)            │     │
│  │  • Google OAuth                               │     │
│  │  • Cadastro próprio                          │     │
│  └──────────────────────────────────────────────┘     │
│                                                        │
│  ┌──────────────────────────────────────────────┐     │
│  │  Banco de Dados Local                        │     │
│  │  • CLIENTE: senha bcrypt                     │     │
│  │  • DONO/VENDEDOR: sem senha local            │     │
│  └──────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

## Fluxos de Autenticação

### Login de DONO/VENDEDOR

```
1. Usuário acessa /login
2. Preenche username + password
3. Sistema chama Portal de Licenças
4. Portal valida e retorna dados
5. Sistema cria/atualiza User local (sem senha)
6. Sessão criada com role DONO ou VENDEDOR
```

**Características:**
- ✅ Sempre valida via Portal de Licenças
- ✅ NUNCA armazena senha localmente
- ✅ Auto-provisioning de brechó (primeira vez)
- ✅ Username obrigatório

### Login de CLIENTE

```
1. Usuário acessa /loja/login
2. Opção A: Preenche email + password (cadastro próprio)
   → Valida no banco local
   → Senha armazenada com bcrypt
3. Opção B: Clica "Continuar com Google"
   → Google OAuth
   → Cria User como CLIENTE automaticamente
4. Sessão criada com role CLIENTE
```

**Características:**
- ✅ Validação sempre local (banco de dados)
- ✅ Senha armazenada localmente (bcrypt)
- ✅ NUNCA passa pelo Portal de Licenças
- ✅ Email obrigatório (não tem username)

## Validações Implementadas

### No CredentialsProvider (`src/lib/auth.ts`)

1. **Login com email**:
   - ✅ Verifica se não tem username (garantir que é cliente)
   - ✅ Verifica se User não tem username (não é conta administrativa)
   - ✅ Verifica se role é CLIENTE
   - ✅ Valida senha no banco local

2. **Login com username**:
   - ✅ Verifica se não tem email (garantir que é administrativo)
   - ✅ Sempre valida via Portal de Licenças
   - ✅ NUNCA valida senha localmente

## Páginas de Login

### `/login` - Login Administrativo
- **Para**: DONO, VENDEDOR
- **Campos**: username, password
- **Validação**: Portal de Licenças
- **Redireciona**: `/dashboard`

### `/loja/login` - Login Cliente
- **Para**: CLIENTE
- **Campos**: email, password (ou Google OAuth)
- **Validação**: Banco local
- **Redireciona**: `/loja`

## Modelo de Dados

```prisma
model User {
  id            String    @id
  username      String?   @unique  // Apenas DONO/VENDEDOR
  email         String    @unique  // Todos têm email
  password      String?            // Apenas CLIENTE tem senha local
  role          UserRole
  
  // DONO/VENDEDOR: username preenchido, password NULL
  // CLIENTE: username NULL, password preenchido
}
```

## Regras de Negócio

1. **CLIENTE**:
   - ✅ Pode criar conta própria
   - ✅ Pode usar Google OAuth
   - ✅ Senha armazenada localmente
   - ❌ NUNCA tem username
   - ❌ NUNCA passa pelo Portal de Licenças

2. **DONO/VENDEDOR**:
   - ✅ Credenciais fornecidas pelo Portal de Licenças
   - ✅ Sempre valida via Portal de Licenças
   - ✅ Username obrigatório
   - ❌ NUNCA tem senha local
   - ❌ NUNCA pode criar conta própria no sistema

## Segurança

- ✅ Separação completa de autenticação
- ✅ Validações explícitas para evitar confusão
- ✅ Mensagens de erro claras
- ✅ Logs separados por tipo de login
- ✅ Clientes não podem acessar contas administrativas


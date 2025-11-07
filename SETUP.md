# 🚀 Guia de Setup - Retrô Carólis

Este guia vai te ajudar a configurar o projeto do zero no seu computador.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18+ (recomendado: 20+)
- **PostgreSQL** 14+ ou **MySQL** 8+
- **Git**

---

## 🔧 Passo a Passo

### 1️⃣ Clone o Projeto

```bash
git clone [url-do-repositorio]
cd brecho
```

### 2️⃣ Instale as Dependências

```bash
npm install
```

Isso vai instalar todas as dependências do projeto, incluindo:
- Next.js 14
- Prisma
- NextAuth
- Tailwind CSS
- E todas as outras bibliotecas necessárias

---

### 3️⃣ Configure o Banco de Dados

#### Opção A: PostgreSQL (Recomendado)

1. **Crie o banco de dados:**
   ```sql
   CREATE DATABASE retrocarolis;
   ```

2. **Configure o usuário** (se necessário):
   ```sql
   CREATE USER retrocarolis WITH PASSWORD 'sua_senha';
   GRANT ALL PRIVILEGES ON DATABASE retrocarolis TO retrocarolis;
   ```

#### Opção B: MySQL

1. **Crie o banco de dados:**
   ```sql
   CREATE DATABASE retrocarolis;
   ```

2. **Configure o usuário** (se necessário):
   ```sql
   CREATE USER 'retrocarolis'@'localhost' IDENTIFIED BY 'sua_senha';
   GRANT ALL PRIVILEGES ON retrocarolis.* TO 'retrocarolis'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

### 4️⃣ Configure as Variáveis de Ambiente

1. **Copie o arquivo de exemplo:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edite o arquivo `.env.local`** e configure:

#### ⚡ Configurações OBRIGATÓRIAS:

```env
# ============================================
# DATABASE (OBRIGATÓRIO)
# ============================================

# PostgreSQL:
DATABASE_URL="postgresql://retrocarolis:sua_senha@localhost:5432/retrocarolis?schema=public"

# OU MySQL:
# DATABASE_URL="mysql://retrocarolis:sua_senha@localhost:3306/retrocarolis"


# ============================================
# NEXTAUTH (OBRIGATÓRIO)
# ============================================

# Gere um secret seguro com: openssl rand -base64 32
# Ou use: https://generate-secret.vercel.app/32
NEXTAUTH_SECRET="cole_aqui_o_secret_gerado"

# URL da sua aplicação
NEXTAUTH_URL="http://localhost:3000"
```

#### 🔑 Como gerar o NEXTAUTH_SECRET:

**Opção 1 - No terminal:**
```bash
openssl rand -base64 32
```

**Opção 2 - Online:**
Acesse: https://generate-secret.vercel.app/32

Copie o resultado e cole no `.env.local`

---

#### 💳 Configurações OPCIONAIS (mas recomendadas para testes):

**Mercado Pago (para pagamentos):**

1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Crie uma aplicação de teste
3. Vá em "Credenciais de teste"
4. Copie o **Access Token** e **Public Key**

```env
# ============================================
# MERCADO PAGO (OPCIONAL - para testes)
# ============================================

MERCADOPAGO_MODE="sandbox"
MERCADOPAGO_ACCESS_TOKEN="TEST-1234567890-XXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX-123456789"
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY="TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**📧 Email, Storage, Analytics:** Você pode configurar depois, não são necessários para rodar o projeto.

---

### 5️⃣ Execute as Migrações do Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Isso vai:
- ✅ Gerar o cliente do Prisma (tipos TypeScript)
- ✅ Criar todas as tabelas no banco de dados
- ✅ Aplicar todas as migrations

---

### 6️⃣ Popule o Banco com Dados de Teste (Seed)

```bash
npm run prisma:seed
```

Isso vai criar:
- ✅ 1 Brechó: **Retrô Carólis**
- ✅ 2 Usuários: **Admin** e **Vendedor**
- ✅ 1 Cliente de teste
- ✅ 2 Fornecedoras
- ✅ 4 Produtos de exemplo

**Credenciais criadas:**

```
🔐 ADMIN:
   Email: admin@retrocarolis.com.br
   Senha: admin123

🔐 VENDEDOR:
   Email: vendedor@retrocarolis.com.br
   Senha: admin123
```

---

### 7️⃣ Inicie o Servidor de Desenvolvimento

```bash
npm run dev
```

✅ **Pronto!** Acesse: http://localhost:3000

---

## 🎯 Testando o Sistema

### 1. Acesse a Homepage
- Vá para: http://localhost:3000
- Você será redirecionado para `/login` (não autenticado)

### 2. Faça Login como Admin
```
Email: admin@retrocarolis.com.br
Senha: admin123
```

- Após login, você será redirecionado para: `/dashboard`
- Explore o painel administrativo

### 3. Teste a Loja (E-commerce)
- Faça logout ou abra em aba anônima
- Acesse: http://localhost:3000/loja
- Navegue pelos produtos, adicione ao carrinho, etc.

---

## 🐛 Solução de Problemas

### ❌ Erro: "Can't reach database server"

**Problema:** Prisma não consegue conectar ao banco.

**Solução:**
1. Verifique se o PostgreSQL/MySQL está rodando:
   ```bash
   # PostgreSQL
   sudo systemctl status postgresql

   # MySQL
   sudo systemctl status mysql
   ```

2. Verifique o `DATABASE_URL` no `.env.local`
3. Teste a conexão:
   ```bash
   npx prisma db push
   ```

---

### ❌ Erro: "Invalid `prisma.xxx.findMany()` invocation"

**Problema:** Cliente Prisma não foi gerado.

**Solução:**
```bash
npx prisma generate
```

---

### ❌ Erro no Seed: "Unique constraint failed"

**Problema:** Dados já existem no banco.

**Solução:**
```bash
# Resetar o banco (CUIDADO: apaga tudo!)
npx prisma migrate reset

# Depois rode o seed novamente
npm run prisma:seed
```

---

### ❌ Erro: "NEXTAUTH_SECRET is not set"

**Problema:** Variável de ambiente não configurada.

**Solução:**
1. Gere um secret: `openssl rand -base64 32`
2. Adicione ao `.env.local`:
   ```env
   NEXTAUTH_SECRET="seu_secret_aqui"
   ```
3. Reinicie o servidor: `npm run dev`

---

## 📚 Comandos Úteis

```bash
# Desenvolvimento
npm run dev                  # Inicia servidor de desenvolvimento
npm run build                # Build para produção
npm run start                # Inicia servidor de produção

# Prisma
npm run prisma:generate      # Gera cliente Prisma
npm run prisma:migrate       # Cria nova migration
npm run prisma:seed          # Popula banco com dados
npm run prisma:studio        # Abre Prisma Studio (GUI do banco)
npm run prisma:push          # Sincroniza schema sem migration

# Outros
npm run lint                 # Verifica erros de código
```

---

## 🎨 Prisma Studio (GUI do Banco)

Para visualizar e editar os dados do banco visualmente:

```bash
npm run prisma:studio
```

Abre em: http://localhost:5555

---

## 📦 Próximos Passos

Depois de configurar e testar:

1. ✅ Explore o código
2. ✅ Customize as cores/tema (Tailwind)
3. ✅ Configure as integrações (Mercado Pago, Email, etc)
4. ✅ Adicione suas próprias funcionalidades
5. ✅ Deploy em produção (Vercel é recomendado)

---

## 🆘 Precisa de Ajuda?

- 📖 **README.md** - Documentação geral do projeto
- 📄 **.env.example** - Todas as variáveis de ambiente disponíveis
- 🐛 **Issues** - Reporte bugs ou peça ajuda

---

**Desenvolvido com ❤️ para a Retrô Carólis**

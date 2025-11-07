# 🔗 Integração com Portal de Licenças

Este documento descreve a integração entre o sistema Retrô Carólis e o Portal de Licenças externo.

---

## 📋 Visão Geral

O Portal de Licenças é responsável por:
1. Gerenciar licenças e planos
2. Criar a conta MASTER (DONO) do brechó
3. Enviar dados do DONO para este sistema via API

Este sistema (Retrô Carólis) recebe os dados e cria:
- Registro do Brechó
- Usuário DONO com acesso administrativo

---

## 🔐 Autenticação

A comunicação entre os sistemas usa **API Key** no header:

```
X-License-Portal-Key: <sua-chave-secreta>
```

### Configuração

Adicione no `.env.local`:

```env
# Portal de Licenças
LICENSE_PORTAL_API_KEY="sua-chave-secreta-aqui"
```

⚠️ **IMPORTANTE**: Esta chave deve ser a mesma configurada no Portal de Licenças.

---

## 📡 Endpoint: Importar DONO

### POST `/api/portal-licencas/importar-dono`

Cria brechó e conta DONO a partir dos dados do Portal de Licenças.

#### Headers

```
Content-Type: application/json
X-License-Portal-Key: <api-key>
```

#### Request Body

```json
{
  "brecho": {
    "nome": "Retrô Carólis",
    "slug": "retrocarolis",
    "dominio": "retrocarolis.com.br",
    "email": "contato@retrocarolis.com.br",
    "telefone": "(11) 99999-9999",
    "cor": "#8B5CF6",
    "logo": "https://..."
  },
  "dono": {
    "name": "Carolina Oliveira",
    "email": "dono@retrocarolis.com.br",
    "password": "SenhaSegura123",
    "telefone": "(11) 98888-8888",
    "cpf": "123.456.789-00"
  },
  "licenca": {
    "id": "lic_abc123",
    "plano": "PRO",
    "dataExpiracao": "2025-12-31T23:59:59Z",
    "ativa": true
  }
}
```

#### Campos Obrigatórios

**brecho:**
- `nome` (string): Nome do brechó
- `slug` (string): URL-friendly identifier (único)

**dono:**
- `name` (string): Nome completo do dono
- `email` (string): Email (único)
- `password` (string): Senha (mínimo 8 caracteres)

#### Campos Opcionais

**brecho:**
- `dominio`: Domínio customizado
- `email`: Email de contato do brechó
- `telefone`: Telefone do brechó
- `cor`: Cor primária (hex, padrão: #8B5CF6)
- `logo`: URL da logo

**dono:**
- `telefone`: Telefone do dono
- `cpf`: CPF do dono

**licenca:**
- Objeto completo opcional para rastreamento

#### Response Success (201)

```json
{
  "success": true,
  "message": "Conta DONO criada com sucesso",
  "brecho": {
    "id": "clxxx...",
    "nome": "Retrô Carólis",
    "slug": "retrocarolis"
  },
  "dono": {
    "id": "clxxx...",
    "name": "Carolina Oliveira",
    "email": "dono@retrocarolis.com.br"
  }
}
```

#### Response Errors

**400 - Dados Inválidos**
```json
{
  "error": "Dados inválidos",
  "details": [...]
}
```

**401 - API Key Ausente/Inválida**
```json
{
  "error": "API Key obrigatória"
}
```

**409 - Conflito (já existe)**
```json
{
  "error": "Brechó já existe",
  "slug": "retrocarolis"
}
```

ou

```json
{
  "error": "Email já cadastrado",
  "email": "dono@retrocarolis.com.br"
}
```

**500 - Erro Interno**
```json
{
  "error": "Erro ao importar conta"
}
```

---

## 🔄 Fluxo de Integração

```
1. Usuário cria licença no Portal de Licenças
   ↓
2. Portal valida pagamento/plano
   ↓
3. Portal coleta dados do brechó e dono
   ↓
4. Portal faz POST para /api/portal-licencas/importar-dono
   (Com API Key no header)
   ↓
5. Sistema Retrô Carólis:
   - Valida API Key
   - Valida dados
   - Cria Brechó
   - Cria usuário DONO
   - Retorna sucesso
   ↓
6. Portal recebe confirmação
   ↓
7. Portal ativa licença
   ↓
8. DONO pode fazer login no sistema
```

---

## 🧪 Testando a Integração

### Usando cURL

```bash
curl -X POST http://localhost:3000/api/portal-licencas/importar-dono \
  -H "Content-Type: application/json" \
  -H "X-License-Portal-Key: sua-chave-secreta" \
  -d '{
    "brecho": {
      "nome": "Brechó Teste",
      "slug": "brecho-teste",
      "email": "contato@brechoteste.com"
    },
    "dono": {
      "name": "João Silva",
      "email": "joao@brechoteste.com",
      "password": "SenhaSegura123"
    }
  }'
```

### Usando Postman

1. Método: **POST**
2. URL: `http://localhost:3000/api/portal-licencas/importar-dono`
3. Headers:
   - `Content-Type`: `application/json`
   - `X-License-Portal-Key`: `sua-chave-secreta`
4. Body (raw JSON): Cole o JSON do exemplo acima

---

## 📝 Documentação do Endpoint

O endpoint também tem auto-documentação via GET:

```bash
GET http://localhost:3000/api/portal-licencas/importar-dono
```

Retorna a documentação completa da API.

---

## 🔒 Segurança

### Recomendações

1. **HTTPS Obrigatório em Produção**
   - Nunca use HTTP em produção
   - Configure SSL/TLS no servidor

2. **API Key Secreta**
   - Gere uma chave longa e aleatória
   - Nunca commite no Git
   - Use `.env.local` (já está no .gitignore)

3. **Rate Limiting**
   - TODO: Implementar rate limiting neste endpoint
   - Sugestão: máximo 10 requisições/minuto

4. **Logs**
   - Todas as tentativas são logadas
   - Monitore logs para tentativas suspeitas

5. **Validação Rigorosa**
   - Todos os dados são validados com Zod
   - Previne SQL injection automaticamente (Prisma)

---

## 🚀 Deploy em Produção

### 1. Configurar Variáveis de Ambiente

No servidor de produção (Vercel, AWS, etc):

```env
LICENSE_PORTAL_API_KEY="<chave-longa-e-aleatoria>"
```

### 2. Configurar no Portal de Licenças

- URL Base: `https://seu-dominio.com`
- Endpoint: `/api/portal-licencas/importar-dono`
- API Key: (mesma configurada acima)

### 3. Testar Conexão

Use o endpoint de teste do Portal de Licenças ou faça um POST manual.

---

## ❓ FAQ

### Q: O que acontece se eu tentar importar um brechó que já existe?

R: O endpoint retorna erro 409 (Conflict) com a mensagem "Brechó já existe".

### Q: A senha vem hasheada do Portal ou em texto plano?

R: O sistema espera senha em **texto plano**. O hash é feito aqui com bcrypt (10 rounds).

### Q: Posso importar múltiplos brechós?

R: Sim, cada slug deve ser único. Um brechó por requisição.

### Q: O DONO criado tem acesso imediato?

R: Sim, a conta é criada com `ativo: true` e pode fazer login imediatamente.

### Q: Como renovo uma licença expirada?

R: Isso é gerenciado no Portal de Licenças. Este sistema não valida expiração (ainda).

---

## 📞 Suporte

Para dúvidas sobre a integração:

1. Verifique os logs do sistema: `/var/log/retrocarolis/app.log`
2. Teste o endpoint com cURL
3. Entre em contato com o time do Portal de Licenças

---

**Última atualização**: 2025-11-07

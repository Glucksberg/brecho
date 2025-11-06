# 🛒 Configuração do Mercado Pago

Este documento explica como configurar a integração completa do Mercado Pago no Retrô Carólis.

## 📋 Pré-requisitos

- Conta no Mercado Pago: https://www.mercadopago.com.br
- Aplicação criada no Developer Panel

## 🔑 Passo 1: Obter Credenciais de Teste (Sandbox)

1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Crie uma nova aplicação (se ainda não tiver)
3. Vá para a aba **"Credenciais de teste"**
4. Copie as seguintes credenciais:
   - **Access Token** (começa com `TEST-`)
   - **Public Key** (começa com `TEST-`)

## ⚙️ Passo 2: Configurar Variáveis de Ambiente

1. Copie o arquivo de exemplo:
   ```bash
   cd retrocarolis-nextjs
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e adicione suas credenciais:
   ```env
   # Mercado Pago - SANDBOX (Testes)
   MERCADOPAGO_MODE="sandbox"
   MERCADOPAGO_ACCESS_TOKEN="TEST-1234567890-..." # Seu Access Token de teste
   NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY="TEST-xxxxxxxx-xxxx-..." # Sua Public Key de teste
   ```

## 🧪 Passo 3: Testar em Sandbox

### Cartões de Teste

Use estes cartões para testar diferentes cenários:

**Aprovado:**
- Número: `5031 4332 1540 6351`
- CVV: qualquer 3 dígitos
- Validade: qualquer data futura

**Recusado (saldo insuficiente):**
- Número: `5031 7557 3453 0604`

**Mais cartões:** https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-test/test-cards

### Usuários de Teste

1. Crie usuários de teste: https://www.mercadopago.com.br/developers/panel/test-users
2. Use um para vendedor (sua conta) e outro para comprador

### Fluxo de Teste

1. Adicione produtos ao carrinho
2. Vá para o checkout
3. Preencha os dados (pode usar dados fictícios)
4. Clique em "Ir para Pagamento"
5. Você será redirecionado para o Mercado Pago
6. Use um cartão de teste
7. Complete o pagamento
8. Será redirecionado de volta com o resultado

## 🚀 Passo 4: Ir para Produção

### 4.1 Obter Credenciais de Produção

1. Complete o formulário "Quero ir para produção"
2. Aguarde aprovação do Mercado Pago
3. Vá para **"Credenciais de produção"**
4. Copie:
   - **Access Token** (começa com `APP_USR-`)
   - **Public Key** (começa com `APP_USR-`)

### 4.2 Atualizar .env

```env
# Mercado Pago - PRODUCTION
MERCADOPAGO_MODE="production"
MERCADOPAGO_ACCESS_TOKEN="APP_USR-1234567890-..."
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY="APP_USR-xxxxxxxx-xxxx-..."
```

### 4.3 Configurar Webhook

O webhook já está configurado automaticamente em:
```
https://SEU-DOMINIO.com/api/webhooks/mercadopago
```

No painel do Mercado Pago:
1. Vá em **Integrações > Webhooks**
2. Adicione a URL acima
3. Selecione o evento: **Pagamentos**

## 📊 Monitoramento

### Logs do Webhook

Os webhooks são logados no console do servidor. Para ver:

```bash
# Em desenvolvimento
npm run dev

# Em produção (Vercel)
vercel logs
```

### Testar Webhook Localmente

Use ngrok para expor localhost:

```bash
# Instale ngrok
npm install -g ngrok

# Exponha a porta 3000
ngrok http 3000

# Use a URL fornecida (ex: https://abc123.ngrok.io)
# Configure no Mercado Pago: https://abc123.ngrok.io/api/webhooks/mercadopago
```

## 🔍 Troubleshooting

### Erro: "Mercado Pago não configurado"

✅ Verifique se as variáveis de ambiente estão corretas
✅ Reinicie o servidor após alterar .env
✅ Certifique-se de que as credenciais correspondem ao modo (sandbox/production)

### Erro: "URL de checkout não retornada"

✅ Verifique se o Access Token está correto
✅ Veja os logs do servidor para detalhes do erro
✅ Certifique-se de que há itens no carrinho

### Webhook não está funcionando

✅ Verifique se a URL está acessível publicamente
✅ Em desenvolvimento, use ngrok
✅ Verifique os logs do servidor
✅ Teste manualmente: POST para /api/webhooks/mercadopago

## 📚 Documentação Oficial

- Checkout Pro: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/landing
- Webhooks: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
- Cartões de Teste: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-test/test-cards

## ✅ Checklist de Go-Live

- [ ] Credenciais de produção configuradas
- [ ] Webhook configurado e testado
- [ ] NEXTAUTH_URL apontando para domínio de produção
- [ ] Testado fluxo completo em produção
- [ ] Notificações por email funcionando
- [ ] Página de sucesso/erro funcionando
- [ ] Monitoramento de logs ativo

## 🆘 Suporte

Em caso de problemas:

1. Verifique os logs do servidor
2. Consulte a documentação do Mercado Pago
3. Entre em contato com o suporte: https://www.mercadopago.com.br/developers/pt/support

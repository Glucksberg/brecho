# Tutorial - Integração Mercado Pago Backend

Este é um projeto de exemplo seguindo o tutorial de integração com Mercado Pago para um app de loja de roupas.

## 📋 O que este projeto faz

- Cria um servidor backend que se comunica com a API do Mercado Pago
- Recebe dados do carrinho de compras do frontend
- Gera links de checkout para pagamento
- Fornece endpoints de teste e verificação

## 🚀 Como executar

### 1. Instalar dependências
```bash
npm install
```

### 2. Executar o servidor
```bash
# Modo desenvolvimento (com auto-reload)
npm run dev

# Modo produção
npm start
```

### 3. Testar os endpoints

O servidor rodará em `http://localhost:3001` e disponibilizará:

- **GET** `/api/health` - Verifica se o servidor está funcionando
- **GET** `/api/test-mercadopago` - Testa se o token do Mercado Pago é válido
- **POST** `/api/create-mercadopago-preference` - Endpoint principal para criar checkout

## 🧪 Testando o endpoint principal

### Exemplo de requisição POST para criar checkout:

```bash
curl -X POST http://localhost:3001/api/create-mercadopago-preference \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "title": "Camiseta Básica",
        "quantity": 1,
        "unit_price": 29.90,
        "currency_id": "BRL"
      },
      {
        "title": "Calça Jeans",
        "quantity": 1,
        "unit_price": 89.90,
        "currency_id": "BRL"
      }
    ],
    "back_urls": {
      "success": "https://seusite.com/sucesso",
      "failure": "https://seusite.com/erro",
      "pending": "https://seusite.com/pendente"
    },
    "auto_return": "approved"
  }'
```

### Resposta esperada:
```json
{
  "init_point": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=123456789-abc123",
  "preference_id": "123456789-abc123"
}
```

## 🔑 Configuração do Token

**IMPORTANTE**: O token atual é de TESTE. Para usar em produção:

1. Acesse sua conta do Mercado Pago
2. Vá em "Suas integrações" > "Credenciais"
3. Copie o Access Token de produção
4. Substitua no arquivo `index.js` na linha do `MERCADO_PAGO_ACCESS_TOKEN`

## 🌐 Deploy em produção

Para hospedar este servidor, você pode usar:

- **Vercel**: `vercel --prod`
- **Render**: Conecte seu repositório Git
- **Heroku**: `git push heroku main`
- **Railway**: Conecte seu repositório Git

### Configuração para produção:

1. Use variáveis de ambiente para o token (não hardcode no código)
2. Configure CORS adequadamente para permitir apenas seus domínios
3. Use HTTPS sempre
4. Substitua o token de teste pelo de produção

## 📱 Como conectar com o frontend

No seu frontend (React, Vue, etc.), faça uma requisição POST para:

```javascript
// Se rodando localmente
const response = await fetch('http://localhost:3001/api/create-mercadopago-preference', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(dadosDoCarrinho)
});

// Se hospedado (substitua pela sua URL)
const response = await fetch('https://seu-backend.onrender.com/api/create-mercadopago-preference', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(dadosDoCarrinho)
});

const data = await response.json();
// Redirecionar para: data.init_point
window.location.href = data.init_point;
```

## 🛡️ Segurança

- Nunca exponha seu Access Token no frontend
- Use HTTPS em produção
- Configure CORS adequadamente
- Valide todos os dados recebidos
- Use tokens de teste durante o desenvolvimento

## 📝 Logs e Debug

O servidor mostra logs detalhados no console para ajudar no debug:
- Dados recebidos nas requisições
- Respostas da API do Mercado Pago
- Erros e exceções

---

✅ **Este tutorial está completo e funcional!** 
🔧 **Pronto para estudar e depois integrar com seu app da base44 quando estiver preparado.** 
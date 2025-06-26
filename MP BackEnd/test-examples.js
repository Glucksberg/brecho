// Exemplos de teste para o tutorial do Mercado Pago
// Execute estes comandos para testar o servidor

// IMPORTANTE: Certifique-se de que o servidor está rodando primeiro!
// npm run dev (em outro terminal)

/**
 * Exemplo 1: Teste básico de saúde do servidor
 */
async function testarSaude() {
  console.log('\n🏥 Testando saúde do servidor...');
  try {
    const response = await fetch('http://localhost:3001/api/health');
    const data = await response.json();
    console.log('✅ Servidor funcionando:', data);
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
}

/**
 * Exemplo 2: Teste do token do Mercado Pago
 */
async function testarMercadoPago() {
  console.log('\n🔑 Testando token do Mercado Pago...');
  try {
    const response = await fetch('http://localhost:3001/api/test-mercadopago');
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Token válido:', data);
    } else {
      console.log('❌ Token inválido:', data);
    }
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
}

/**
 * Exemplo 3: Criar checkout para uma camiseta
 */
async function criarCheckoutCamiseta() {
  console.log('\n👕 Criando checkout para camiseta...');
  
  const dadosCarrinho = {
    items: [
      {
        title: "Camiseta Básica Branca",
        quantity: 1,
        unit_price: 29.90,
        currency_id: "BRL"
      }
    ],
    back_urls: {
      success: "https://seusite.com/sucesso",
      failure: "https://seusite.com/erro", 
      pending: "https://seusite.com/pendente"
    },
    auto_return: "approved"
  };

  try {
    const response = await fetch('http://localhost:3001/api/create-mercadopago-preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosCarrinho)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Checkout criado com sucesso!');
      console.log('💳 Link de pagamento:', data.init_point);
      console.log('🆔 ID da preferência:', data.preference_id);
    } else {
      console.log('❌ Erro ao criar checkout:', data);
    }
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
}

/**
 * Exemplo 4: Criar checkout para carrinho com múltiplos itens
 */
async function criarCheckoutCarrinhoCompleto() {
  console.log('\n🛒 Criando checkout para carrinho completo...');
  
  const dadosCarrinho = {
    items: [
      {
        title: "Camiseta Básica Branca",
        quantity: 2,
        unit_price: 29.90,
        currency_id: "BRL"
      },
      {
        title: "Calça Jeans Escura",
        quantity: 1,
        unit_price: 89.90,
        currency_id: "BRL"
      },
      {
        title: "Tênis Casual",
        quantity: 1,
        unit_price: 159.90,
        currency_id: "BRL"
      }
    ],
    back_urls: {
      success: "https://seusite.com/sucesso",
      failure: "https://seusite.com/erro",
      pending: "https://seusite.com/pendente"
    },
    auto_return: "approved",
    statement_descriptor: "LOJA_ROUPAS", // Nome que aparece na fatura
    external_reference: "PEDIDO_001" // Referência do seu sistema
  };

  try {
    const response = await fetch('http://localhost:3001/api/create-mercadopago-preference', {
      method: 'POST',  
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosCarrinho)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Checkout criado com sucesso!');
      console.log('💳 Link de pagamento:', data.init_point);
      console.log('🆔 ID da preferência:', data.preference_id);
      console.log('💰 Total estimado: R$', (29.90*2 + 89.90 + 159.90).toFixed(2));
    } else {
      console.log('❌ Erro ao criar checkout:', data);
    }
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
}

/**
 * Executar todos os testes em sequência
 */
async function executarTodosTestes() {
  console.log('🚀 Iniciando testes do tutorial Mercado Pago...');
  
  await testarSaude();
  await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa 1s
  
  await testarMercadoPago();
  await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa 1s
  
  await criarCheckoutCamiseta();
  await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa 1s
  
  await criarCheckoutCarrinhoCompleto();
  
  console.log('\n✅ Todos os testes concluídos!');
  console.log('💡 Copie os links de pagamento gerados e abra no navegador para testar o checkout.');
}

// Se executar este arquivo diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  // Importa fetch para Node.js (caso não esteja disponível)
  if (typeof fetch === 'undefined') {
    const { default: fetch } = await import('node-fetch');
    global.fetch = fetch;
  }
  
  executarTodosTestes();
} 
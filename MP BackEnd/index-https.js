// ARQUIVO: index-https.js - Versão HTTPS do servidor Mercado Pago
// Este servidor usa HTTPS para evitar problemas de Mixed Content

import express from 'express';
import https from 'https';
import fs from 'fs';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();

// Middleware para parsing JSON
app.use(express.json());

// Configuração de CORS mais permissiva para permitir requisições de qualquer origem
app.use(cors({
  origin: '*', // Permite qualquer origem (inclui base44.app)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false // Para requisições simples
}));

// Headers adicionais para compatibilidade
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Responde a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Cole seu Access Token aqui. Em produção, use variáveis de ambiente!
// IMPORTANTE: Este é um token de TESTE - substitua pelo seu token real
const MERCADO_PAGO_ACCESS_TOKEN = "TEST-1638350194862018-062321-fda76b1d2389cafc5ec0ea27e42be4ea-197964248";

/**
 * Endpoint principal para criar preferência de pagamento no Mercado Pago
 */
app.post('/api/create-mercadopago-preference', async (req, res) => {
  const preferenceData = req.body;

  // Log para debug - mostra os dados recebidos
  console.log('🛒 Dados recebidos para criar preferência:', JSON.stringify(preferenceData, null, 2));

  try {
    // Fazendo a requisição para a API do Mercado Pago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`
      },
      body: JSON.stringify(preferenceData)
    });

    const data = await response.json();

    if (response.ok) {
      // Sucesso: envia de volta o init_point (URL de checkout) para o frontend
      console.log('✅ Preferência criada com sucesso:', data.id);
      console.log('🔗 Link de checkout:', data.init_point);
      res.json({ 
        init_point: data.init_point,
        preference_id: data.id
      });
    } else {
      // Erro da API do Mercado Pago
      console.error('❌ Mercado Pago API Error:', data);
      res.status(response.status).json(data);
    }
  } catch (error) {
    // Erro interno do servidor
    console.error('❌ Internal Server Error:', error);
    res.status(500).json({ 
      message: 'Erro ao criar preferência de pagamento.',
      error: error.message 
    });
  }
});

/**
 * Endpoint de teste para verificar se o servidor está funcionando
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor HTTPS do tutorial Mercado Pago funcionando!',
    timestamp: new Date().toISOString(),
    protocol: 'HTTPS',
    cors: 'habilitado para todas as origens'
  });
});

/**
 * Endpoint para testar a configuração do Mercado Pago
 */
app.get('/api/test-mercadopago', async (req, res) => {
  try {
    // Teste simples: buscar informações da conta
    const response = await fetch('https://api.mercadopago.com/users/me', {
      headers: {
        'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      res.json({ 
        status: 'OK', 
        message: 'Token do Mercado Pago válido!',
        user_id: data.id 
      });
    } else {
      res.status(400).json({ 
        status: 'ERROR', 
        message: 'Token do Mercado Pago inválido',
        error: data 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Erro ao testar Mercado Pago',
      error: error.message 
    });
  }
});

// Configuração HTTPS
const httpsOptions = {
  key: fs.readFileSync('/tmp/key.pem'),
  cert: fs.readFileSync('/tmp/cert.pem')
};

// Iniciar servidor HTTPS
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;
https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
  console.log(`🚀 Servidor HTTPS rodando na porta ${HTTPS_PORT}`);
  console.log(`🔒 Acessível via HTTPS: https://178.156.173.84:${HTTPS_PORT}`);
  console.log(`📋 Endpoints disponíveis:`);
  console.log(`   - GET  https://178.156.173.84:${HTTPS_PORT}/api/health`);
  console.log(`   - GET  https://178.156.173.84:${HTTPS_PORT}/api/test-mercadopago`);
  console.log(`   - POST https://178.156.173.84:${HTTPS_PORT}/api/create-mercadopago-preference`);
  console.log(`🔓 CORS habilitado para todas as origens (inclui base44.app)`);
  console.log(`⚠️  Certificado auto-assinado - o navegador mostrará aviso de segurança`);
}); 
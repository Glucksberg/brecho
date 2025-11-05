# 🎯 Plano de Implementação - Retrô Carólis

**Projeto:** Sistema de Gestão para Brechós com E-commerce
**Cliente:** Retrô Carólis
**Data:** 05/11/2025
**Status:** 📋 PLANEJAMENTO

---

## 📊 Visão Geral

### O Que Já Temos:
✅ E-commerce completo (diferencial!)
✅ Gestão de produtos robusta
✅ Sistema de vendas
✅ Controle de despesas
✅ Dashboard administrativo
✅ Integração Mercado Pago

### O Que Vamos Construir:
🎯 Sistema de Consignação Completo
🎯 Portal da Fornecedora
🎯 Código de Barras e Etiquetas
🎯 Controle de Caixa
🎯 Sistema de Trocas/Devoluções (CDC)
🎯 Sistema de Permissões (4 níveis)
🎯 Fluxo de Caixa Completo
🎯 Relatórios Avançados

---

## 🚀 Roadmap

### 📅 FASE 1 - FUNDAÇÃO (8 semanas)
**Início:** Por definir
**Entrega:** Sistema básico de consignação operacional

#### Semana 1-2: 🏗️ Infraestrutura
```
✓ Renomear projeto (Brechó da Luli → Retrô Carólis)
✓ Sistema de permissões RBAC
✓ 4 níveis de usuário (Admin, Dono, Vendedor, Fornecedor)
✓ Estrutura multi-tenant (preparação futura)
```

#### Semana 3-4: 💼 Consignação Base
```
✓ Entidade Fornecedora
✓ Vínculo Produto → Fornecedora
✓ % de repasse configurável
✓ Entidade Crédito/Repasse
✓ Cálculo automático de créditos
✓ Liberação após 30 dias
✓ Desconto 15% ao usar crédito
```

#### Semana 5-6: 👩‍💼 Portal da Fornecedora
```
✓ Login específico
✓ Dashboard com saldo
✓ Produtos consignados (ativos/vendidos)
✓ Histórico de vendas
✓ Histórico de repasses
✓ Relatórios pessoais
```

#### Semana 7-8: 🏷️ Código de Barras
```
✓ Geração de códigos
✓ Leitura com leitor USB
✓ Templates de etiquetas
✓ Impressão (individual/lote)
✓ QR Code com link
```

---

### 📅 FASE 2 - OPERAÇÃO PROFISSIONAL (10-12 semanas)
**Entrega:** Controles operacionais completos

#### Mês 1: 💰 Controle de Caixa
```
✓ Abertura de caixa (saldo inicial)
✓ Movimentações (vendas, despesas, sangria, reforço)
✓ Fechamento (conferência, diferença)
✓ Relatórios de movimento
✓ Histórico de caixas
✓ Controle por operador
```

#### Mês 2: 🔄 Trocas e Devoluções
```
✓ Entidade Troca/Devolução
✓ Regras presencial:
  - COM defeito: troca ≤ valor (devolve diferença)
  - SEM defeito: troca ≥ valor (cliente paga diferença)
✓ Regras online: CDC 7 dias (cliente paga frete)
✓ Interface explicativa
✓ Workflow de aprovação
✓ Estorno automático
✓ Reintegração ao estoque
```

#### Mês 3: 💵 Fluxo de Caixa
```
✓ Contas a receber
✓ Dashboard de fluxo
✓ Entradas vs Saídas
✓ Gráficos de evolução
✓ Saldo projetado
```

---

### 📅 FASE 3 - INTELIGÊNCIA (6-8 semanas)
**Entrega:** Relatórios avançados e exportações

#### Mês 1: 📈 Relatórios de Consignação
```
✓ Por fornecedora (vendas, créditos, produtos)
✓ Produtos consignados (status, valores)
✓ Créditos a pagar (pendentes, pagos)
✓ Repasses realizados
✓ Rentabilidade por fornecedora
```

#### Mês 2: 📊 Relatórios de Vendas
```
✓ Comparativo período vs período
✓ Produtos/categorias mais vendidos
✓ Análise ABC
✓ Por vendedor
✓ Por forma de pagamento
✓ Online vs Presencial
✓ Exportação PDF/Excel/CSV
```

---

### 📅 FASE 4 - APRIMORAMENTOS (Contínuo)
**Entrega:** Melhorias incrementais

```
□ Nota fiscal simplificada (sem SEFAZ)
□ Alertas de estoque baixo
□ Histórico detalhado de clientes
□ Gestão de comissões para vendedores
□ Rastreamento de pedidos
□ Sistema de avaliações
□ Melhorias de UX/UI
```

---

## 🎯 Prioridades Críticas

### 🔴 PRIORIDADE MÁXIMA
1. **Sistema de Consignação** - Core business
2. **Portal da Fornecedora** - Diferencial competitivo
3. **Código de Barras** - Operação física

### 🟡 PRIORIDADE ALTA
4. **Controle de Caixa** - Gestão financeira
5. **Trocas/Devoluções (CDC)** - Compliance legal
6. **Sistema de Permissões** - Segurança

### 🟢 PRIORIDADE MÉDIA
7. **Fluxo de Caixa** - Visão financeira
8. **Relatórios Avançados** - Análise de dados

---

## 👥 Níveis de Acesso

```
🔐 ADMIN (Super usuário)
├── Acesso a todos os brechós
├── Configurações globais
└── Gestão de brechós

📊 DONO (Proprietário)
├── Acesso total ao seu brechó
├── Relatórios completos
├── Gestão de usuários
└── Configurações do brechó

💼 VENDEDOR
├── Cadastro de produtos
├── Registro de vendas
├── Atendimento a clientes
└── Relatórios básicos

🏷️ FORNECEDOR
├── Portal da Fornecedora
├── Seus produtos
├── Seus créditos
└── Seus relatórios
```

---

## 💡 Regras de Negócio Principais

### Sistema de Consignação

**Créditos da Fornecedora:**
- ✓ Cálculo automático na venda (% configurável)
- ✓ Liberação após 30 dias
- ✓ Opção 1: Receber em R$ (100%)
- ✓ Opção 2: Trocar em produtos (115% de poder de compra)

**Exemplo:**
```
Produto vendido: R$ 100,00
% Fornecedora: 60%
Crédito: R$ 60,00

Após 30 dias:
→ Receber: R$ 60,00 em dinheiro
→ OU Trocar: R$ 69,00 em produtos (R$ 60 + 15%)
```

### Sistema de Trocas

**PRESENCIAL - COM DEFEITO:**
```
✓ Troca por produto ≤ valor → devolve R$ diferença
✓ Troca por produto ≥ valor → cliente paga diferença
```

**PRESENCIAL - SEM DEFEITO:**
```
✓ Troca por produto ≥ valor → cliente paga diferença
✗ Não devolve dinheiro (só troca)
```

**ONLINE (CDC):**
```
✓ 7 dias para arrependimento
✓ Cliente paga frete de devolução
✓ Retrô Carólis devolve valor integral
✓ Independente do motivo
```

---

## 🛠️ Stack Técnico

### Frontend
- React 18+
- Vite
- Tailwind CSS
- React Router

### Bibliotecas Adicionais
```bash
# Código de Barras
npm install jsbarcode react-barcode qrcode.react

# Impressão
npm install react-to-print jspdf

# Exportação
npm install xlsx

# Gráficos
npm install recharts

# Permissões
npm install @casl/ability @casl/react

# Utilitários
npm install date-fns zod
```

### Backend (Atual)
- Node.js
- Mercado Pago SDK

---

## 📐 Arquitetura Multi-Tenant

### Preparação Futura
```
Sistema
├── Brechó 1: Retrô Carólis (atual)
│   ├── Admin: Você
│   ├── Dono: Proprietário
│   ├── Vendedores: Equipe
│   └── Fornecedoras: Consignação
│
└── Brechó 2: Cliente Futuro
    ├── Dono: Outro brechó
    ├── Vendedores: Equipe deles
    └── Fornecedoras: Deles
```

### Implementação
- Campo `brecho_id` em todas as tabelas
- Filtro automático por brechó
- Isolamento total de dados
- JWT com info do brechó
- Subdomínios opcionais

---

## 💰 Modelo de Negócio (Futuro)

### Plano SaaS
```
💵 R$ 79,90/mês
✓ E-commerce incluído
✓ Trial 14 dias grátis
✓ Sem fidelidade
✓ Suporte WhatsApp/Email
```

### Diferencial vs 2Cabides
- 🎯 Mesmo preço (R$ 69,90 vs R$ 79,90)
- ✅ E-commerce INCLUÍDO (2Cabides não tem)
- ✅ Design mais moderno
- ✅ Portal da Fornecedora completo

---

## 📋 Checklist de Início

### Antes de Começar:
- [ ] Validar este plano
- [ ] Definir data de início
- [ ] Criar branch de desenvolvimento
- [ ] Configurar ambiente de homologação
- [ ] Documentar estrutura de dados
- [ ] Definir padrões de código

### Durante o Desenvolvimento:
- [ ] Code review em cada módulo
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Documentação atualizada
- [ ] Demos semanais de progresso

### Entrega de Cada Fase:
- [ ] Testes completos
- [ ] Manual de uso
- [ ] Deploy em homologação
- [ ] Validação com usuários
- [ ] Ajustes e melhorias
- [ ] Deploy em produção

---

## 📊 Estimativa de Tempo

```
FASE 1: 8 semanas   ▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░
FASE 2: 10-12 sem   ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░
FASE 3: 6-8 sem     ▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░
FASE 4: Contínuo    ░░░░░░░░░░░░░░░░░░░░░░░░

TOTAL ESTIMADO: 24-28 semanas (6-7 meses)
```

### Cronograma Sugerido (Exemplo)
```
Nov 2025: Início Fase 1
Jan 2026: Conclusão Fase 1 → Início Fase 2
Abr 2026: Conclusão Fase 2 → Início Fase 3
Jun 2026: Conclusão Fase 3 → Sistema Completo
Jul 2026+: Fase 4 (aprimoramentos contínuos)
```

---

## 🎉 Marcos de Entrega

### 🏁 Marco 1 - MVP Consignação (Semana 8)
**Entregável:**
- Sistema de consignação operacional
- Portal da Fornecedora básico
- Código de barras funcionando
- Usuários com permissões

### 🏁 Marco 2 - Operação Completa (Semana 20)
**Entregável:**
- Controle de caixa
- Trocas e devoluções
- Fluxo de caixa
- Sistema pronto para uso intenso

### 🏁 Marco 3 - Sistema Profissional (Semana 28)
**Entregável:**
- Relatórios avançados
- Exportações
- Sistema completo e robusto
- Pronto para escalar

---

## 📞 Próximos Passos

### Imediato:
1. ✅ Validar este plano
2. ⏭️ Definir data de início
3. ⏭️ Revisar e aprovar escopo da Fase 1
4. ⏭️ Preparar ambiente de desenvolvimento

### Esta Semana:
- [ ] Criar branch `feature/fase-1-infraestrutura`
- [ ] Documentar estrutura de dados
- [ ] Configurar novas bibliotecas
- [ ] Iniciar desenvolvimento

---

**📄 Documento criado:** 05/11/2025
**✏️ Autor:** Claude AI
**📧 Contato:** [Seu contato aqui]
**🔄 Versão:** 1.0

---

> 💡 **Lembre-se:** Este é um plano vivo. Ajustes são esperados conforme o desenvolvimento avança.

> 🎯 **Foco:** Entregar valor incremental a cada fase. O sistema já funcionará após a Fase 1!

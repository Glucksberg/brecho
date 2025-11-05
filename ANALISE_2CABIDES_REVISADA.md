# Análise Completa: 2Cabides vs Retrô Carólis (REVISADA)

**Data da Análise:** 05 de Novembro de 2025
**Última Atualização:** 05 de Novembro de 2025
**Objetivo:** Mapear todas as funcionalidades do sistema 2Cabides e comparar com o que a Retrô Carólis já possui

---

## 1. VISÃO GERAL DO 2CABIDES

O **2Cabides** é um sistema completo de gestão para brechós, desenvolvido especificamente para o mercado brasileiro. É um software SaaS (Software as a Service) baseado em nuvem que não requer instalação.

### Características Principais:
- **Preço:** R$ 69,90/mês
- **Modelo:** Assinatura mensal sem fidelidade
- **Trial:** 7 dias de teste grátis com todas as funcionalidades
- **Plataforma:** Web (acesso via navegador em qualquer dispositivo)
- **Público-alvo:** Brechós físicos e online no Brasil

---

## 2. FUNCIONALIDADES MAPEADAS

### 2.1. GESTÃO DE PRODUTOS E ESTOQUE

#### Status na Retrô Carólis:
- ✅ **POSSUI:** Cadastro completo de produtos (nome, descrição, preço, categoria, subcategoria, tamanho, cor, marca, condição, gênero)
- ✅ **POSSUI:** Controle de estoque (quantidade disponível)
- ✅ **POSSUI:** Sistema de imagens múltiplas com imagem principal
- ✅ **POSSUI:** Filtros avançados (categoria, preço, tamanho, cor, marca, condição, gênero)
- ✅ **POSSUI:** Sistema de busca com tags
- ✅ **POSSUI:** Produtos em destaque
- ✅ **POSSUI:** Controle de produtos vendidos
- ✅ **POSSUI:** Peso e dimensões para cálculo de frete
- ❌ **FALTA:** Sistema de código de barras
- ❌ **FALTA:** Integração com leitores de código de barras
- ❌ **FALTA:** Impressão de etiquetas
- ❌ **FALTA:** Alertas de estoque baixo
- ❌ **FALTA:** Separação entre "produtos em loja" vs "produtos em estoque"

### 2.2. GESTÃO DE CLIENTES

#### Status na Retrô Carólis:
- ✅ **POSSUI:** Cadastro completo de clientes (nome, email, telefone, endereço completo)
- ✅ **POSSUI:** Total de compras e número de compras
- ✅ **POSSUI:** Data da última compra
- ✅ **POSSUI:** Cálculo de ticket médio
- ✅ **POSSUI:** Classificação de clientes (VIP, Premium, Regular, Novo)
- ✅ **POSSUI:** Validação de email e telefone
- ✅ **POSSUI:** Observações e data de nascimento
- ❌ **FALTA:** Histórico detalhado de compras (lista de produtos comprados)

### 2.3. GESTÃO DE FORNECEDORAS (CONSIGNAÇÃO)

#### Requisitos Específicos da Retrô Carólis:

**Sistema de Consignação:**
- ❌ Cadastro completo de fornecedoras
- ❌ Percentual de repasse configurável por fornecedora
- ❌ Vínculo de produtos com fornecedoras
- ❌ Sistema de créditos em R$ para fornecedoras
- ❌ Liberação de crédito 30 dias após a venda
- ❌ Opções de uso de crédito:
  - Receber em dinheiro (valor integral)
  - Trocar em produtos (15% de desconto adicional no valor dos créditos)
- ❌ Controle de status de crédito (pendente, liberado, utilizado, pago)

**Portal da Fornecedora:**
- ❌ Login específico para fornecedoras
- ❌ Dashboard com saldo de créditos
- ❌ Histórico de produtos entregues para consignação
- ❌ Histórico de produtos vendidos
- ❌ Histórico de repasses (pagos e pendentes)
- ❌ Relatórios de vendas dos seus produtos
- ❌ Consulta de produtos ativos na loja
- ❌ Interface simples e direta

**Relatórios Administrativos de Consignação:**
- ❌ Relatório de vendas por fornecedora
- ❌ Relatório de produtos consignados (ativos, vendidos, devolvidos)
- ❌ Relatório de créditos a pagar
- ❌ Relatório de repasses realizados
- ❌ Métricas de desempenho por fornecedora
- ❌ Análise de rentabilidade por fornecedora

### 2.4. CONTROLE DE VENDAS

#### Status na Retrô Carólis:
- ✅ **POSSUI:** Registro completo de vendas
- ✅ **POSSUI:** Múltiplos itens por venda
- ✅ **POSSUI:** Controle de formas de pagamento (dinheiro, cartão, PIX, transferência)
- ✅ **POSSUI:** Sistema de status (pendente, pago, cancelado, estornado)
- ✅ **POSSUI:** Cálculo automático de subtotal, desconto e total
- ✅ **POSSUI:** Número único de venda
- ✅ **POSSUI:** Taxa de entrega
- ✅ **POSSUI:** Endereço de entrega
- ✅ **POSSUI:** Cupom de desconto
- ✅ **POSSUI:** Vinculação com vendedor
- ✅ **POSSUI:** Estatísticas de vendas
- ✅ **POSSUI:** Integração com Mercado Pago
- ❌ **FALTA:** Sistema de caixa físico (abertura/fechamento)
- ❌ **FALTA:** Emissão de nota fiscal (estrutura básica, sem integração SEFAZ/MT)
- ❌ **FALTA:** Sistema de devoluções estruturado (baseado no CDC)
- ❌ **FALTA:** Sistema de trocas (com regras específicas)
- ❌ **FALTA:** Relatórios avançados de vendas
- ❌ **FALTA:** Identificação de origem da venda (online vs presencial)

### 2.5. SISTEMA DE TROCAS E DEVOLUÇÕES

#### Regras Específicas da Retrô Carólis:

**IMPORTANTE: Retrô Carólis NÃO faz trocas de produtos consignados**

**Para Clientes - Compras Presenciais:**
- ✅ **COM DEFEITO:**
  - Pode trocar por produto de igual ou menor valor
  - Se trocar por menor valor: devolve a diferença em dinheiro
  - Se trocar por maior valor: cliente paga a diferença
- ✅ **SEM DEFEITO:**
  - Pode trocar por produto de igual ou maior valor
  - Se trocar por maior valor: cliente paga a diferença
  - Não há devolução em dinheiro (somente troca)

**Para Clientes - Compras Online:**
- ✅ **Baseado no CDC (Código de Defesa do Consumidor):**
  - Cliente tem 7 dias para desistir da compra (direito de arrependimento)
  - Cliente arca com o custo do frete de devolução
  - Retrô Carólis devolve o valor integral da compra
  - Independente do motivo (com ou sem defeito)

**Requisitos do Sistema:**
- ❌ Cadastro de solicitação de troca/devolução
- ❌ Controle de prazo (7 dias para online, prazo customizável para presencial)
- ❌ Identificação do tipo de compra (online/presencial)
- ❌ Identificação do motivo (com/sem defeito)
- ❌ Status da solicitação (solicitado, aprovado, em análise, recusado, concluído)
- ❌ Interface explicativa com as regras do CDC
- ❌ Diferenciação clara entre regras online vs presencial
- ❌ Controle de produtos devolvidos ao estoque
- ❌ Estorno automático de valores quando aplicável
- ❌ Geração de vale-troca quando aplicável

### 2.6. GESTÃO FINANCEIRA

#### Status na Retrô Carólis:
- ✅ **POSSUI:** Sistema completo de despesas
- ✅ **POSSUI:** Categorização de despesas (operacional, marketing, pessoal, produto, outros)
- ✅ **POSSUI:** Subcategorias de despesas
- ✅ **POSSUI:** Controle de vencimento e pagamento
- ✅ **POSSUI:** Status (pendente, pago, vencido, cancelado)
- ✅ **POSSUI:** Formas de pagamento
- ✅ **POSSUI:** Controle de fornecedores
- ✅ **POSSUI:** Número de documento
- ✅ **POSSUI:** Despesas recorrentes (mensal, bimestral, trimestral, semestral, anual)
- ✅ **POSSUI:** Centro de custo
- ✅ **POSSUI:** Anexos/documentos
- ✅ **POSSUI:** Dashboard com estatísticas financeiras
- ❌ **FALTA:** Controle de contas a receber
- ❌ **FALTA:** Fluxo de caixa completo (entradas e saídas)
- ❌ **FALTA:** Dashboard de fluxo de caixa

**NÃO NECESSÁRIO (por enquanto):**
- ⏸️ Conciliação bancária (tem programa separado)
- ⏸️ Projeções financeiras (fase futura)
- ⏸️ DRE (fase futura)
- ⏸️ Balanço patrimonial (fase futura)

### 2.7. CONTROLE DE CAIXA

#### Requisitos:
- ❌ Abertura de caixa (saldo inicial)
- ❌ Registro de movimentações (vendas, despesas, sangrias, reforços)
- ❌ Fechamento de caixa (saldo final, conferência)
- ❌ Diferença de caixa (sobra/falta)
- ❌ Relatório de movimento do caixa
- ❌ Histórico de caixas fechados
- ❌ Múltiplos caixas (se necessário)
- ❌ Controle por operador/vendedor

### 2.8. CONTROLE DE USUÁRIOS E PERMISSÕES

#### Níveis de Acesso Requeridos:

1. **ADMIN** (Super usuário)
   - Acesso total ao sistema
   - Gerenciamento de todos os brechós (preparar para multi-tenant futuro)
   - Configurações globais

2. **DONO** (Proprietário da Retrô Carólis)
   - Acesso total ao seu brechó
   - Relatórios completos
   - Configurações do brechó
   - Gestão de usuários
   - Gestão financeira completa

3. **VENDEDOR**
   - Cadastro de produtos
   - Registro de vendas
   - Atendimento a clientes
   - Consulta de estoque
   - Relatórios básicos

4. **FORNECEDOR**
   - Acesso ao Portal da Fornecedora
   - Visualização dos seus produtos
   - Consulta de créditos
   - Relatórios pessoais
   - Histórico de repasses

**Requisitos Técnicos:**
- ❌ Sistema de permissões RBAC (Role-Based Access Control)
- ❌ Controle granular de acesso por módulo
- ❌ Preparação para multi-tenant (vários brechós no futuro)
- ❌ Auditoria de ações (log de atividades)
- ❌ Associação de vendas ao vendedor logado

#### Status Atual:
- ✅ **POSSUI:** Sistema de usuários (entidade User)
- ✅ **POSSUI:** Vinculação de vendedor às vendas
- ❌ **FALTA:** Sistema de permissões estruturado
- ❌ **FALTA:** 4 níveis de acesso (Admin, Dono, Vendedor, Fornecedor)
- ❌ **FALTA:** Controle de comissões para vendedores
- ❌ **FALTA:** Relatórios por vendedor
- ❌ **FALTA:** Estrutura multi-tenant

### 2.9. CÓDIGO DE BARRAS E ETIQUETAS

#### Requisitos:
- ❌ Geração automática de código de barras (EAN-13, Code128 ou QR Code)
- ❌ Leitura com leitor USB
- ❌ Impressão de etiquetas personalizáveis
- ❌ Templates de etiquetas:
  - Código de barras
  - QR Code (link para produto online)
  - Preço
  - Tamanho
  - Código do produto
  - Marca
- ❌ Impressão em lote
- ❌ Suporte a impressoras térmicas

### 2.10. RELATÓRIOS E MÉTRICAS

#### Status na Retrô Carólis:
- ✅ **POSSUI:** Dashboard administrativo
- ✅ **POSSUI:** Estatísticas de vendas (cards com totais)
- ✅ **POSSUI:** Estatísticas de produtos
- ✅ **POSSUI:** Estatísticas de despesas
- ✅ **POSSUI:** Gráficos de categorias
- ✅ **POSSUI:** Visão de vendas recentes
- ✅ **POSSUI:** Visão geral de produtos
- ✅ **POSSUI:** Relatórios básicos (estoque, vendas, movimentação)

#### O que falta:
- ❌ **Relatórios de Consignação:**
  - Por fornecedora (vendas, créditos, produtos)
  - Produtos consignados (status, valores)
  - Créditos a pagar (pendentes, pagos)
  - Rentabilidade por fornecedora

- ❌ **Relatórios de Vendas Avançados:**
  - Comparativo período vs período
  - Análise de tendências
  - Produtos mais vendidos
  - Categorias mais vendidas
  - Margem de lucro
  - Análise ABC de produtos
  - Vendas por vendedor
  - Vendas por forma de pagamento
  - Vendas online vs presencial

- ❌ **Relatórios Financeiros:**
  - Fluxo de caixa detalhado
  - Contas a pagar/receber
  - Despesas por categoria
  - Receitas por período

- ❌ **Exportação:**
  - PDF
  - Excel (XLSX)
  - CSV

- ❌ **Relatórios para Impressão:**
  - Nota fiscal simplificada (sem SEFAZ por enquanto)
  - Recibo de venda
  - Comprovante de consignação
  - Comprovante de repasse

### 2.11. FUNCIONALIDADES DO E-COMMERCE

#### Status na Retrô Carólis:
- ✅ **POSSUI:** Site completo com loja online
- ✅ **POSSUI:** Catálogo de produtos público
- ✅ **POSSUI:** Sistema de carrinho
- ✅ **POSSUI:** Sistema de favoritos
- ✅ **POSSUI:** Página de detalhes do produto
- ✅ **POSSUI:** Filtros e busca avançada
- ✅ **POSSUI:** Sistema de autenticação
- ✅ **POSSUI:** Área de conta do cliente
- ✅ **POSSUI:** Checkout com Mercado Pago
- ✅ **POSSUI:** Páginas institucionais (Home, Sobre)
- ✅ **POSSUI:** Design responsivo
- ✅ **POSSUI:** SEO básico

#### Melhorias Sugeridas:
- ⚠️ Área do cliente mais completa (histórico de compras detalhado)
- ⚠️ Rastreamento de pedidos
- ⚠️ Sistema de avaliações/reviews
- ⚠️ Wishlist pública/compartilhável

---

## 3. COMPARATIVO RESUMIDO

### ✅ O QUE A RETRÔ CARÓLIS JÁ TEM BEM DESENVOLVIDO:

1. **E-commerce completo** (2Cabides não oferece) ⭐
2. **Gestão de produtos robusta** com múltiplos filtros
3. **Sistema de clientes** com classificação
4. **Controle de vendas** completo
5. **Sistema de despesas** avançado com recorrência
6. **Dashboard administrativo** funcional
7. **Carrinho e favoritos**
8. **Sistema de autenticação**
9. **Integração com Mercado Pago**
10. **Design moderno e responsivo**

### ❌ O QUE FALTA NA RETRÔ CARÓLIS

#### 🔴 PRIORIDADE CRÍTICA (Necessário para operação básica)

1. **Sistema de Consignação Completo**
   - Cadastro de fornecedoras
   - Percentual de repasse por fornecedora
   - Vínculo produto → fornecedora
   - Sistema de créditos em R$
   - Liberação após 30 dias
   - Desconto de 15% ao usar crédito em produtos
   - Portal da Fornecedora (login, dashboard, relatórios)
   - Relatórios administrativos de consignação

2. **Código de Barras e Etiquetas**
   - Geração de códigos
   - Leitura com leitor USB
   - Impressão de etiquetas personalizáveis

3. **Controle de Caixa**
   - Abertura/fechamento
   - Movimentações
   - Conferência
   - Relatórios

#### 🟡 PRIORIDADE ALTA (Importantes para operação profissional)

4. **Sistema de Trocas e Devoluções (CDC)**
   - Regras específicas (presencial com/sem defeito)
   - Regras online (7 dias CDC)
   - Interface explicativa
   - Controle de solicitações

5. **Sistema de Permissões e Usuários**
   - 4 níveis: Admin, Dono, Vendedor, Fornecedor
   - RBAC completo
   - Preparação multi-tenant

6. **Fluxo de Caixa Completo**
   - Contas a receber
   - Dashboard de fluxo de caixa
   - Projeções básicas

7. **Relatórios Avançados**
   - Exportação PDF/Excel
   - Relatórios de consignação
   - Relatórios de vendas avançados
   - Comparativos

#### 🟢 PRIORIDADE MÉDIA (Melhorias incrementais)

8. **Nota Fiscal Simplificada**
   - Estrutura básica (sem integração SEFAZ/MT)
   - Impressão
   - Numeração

9. **Alertas de Estoque Baixo**
   - Configuração de limite mínimo
   - Notificações

10. **Histórico Detalhado de Clientes**
    - Lista de produtos comprados
    - Timeline de interações

11. **Gestão de Comissões para Vendedores**
    - Percentual por vendedor
    - Cálculo automático
    - Relatórios

#### ⏸️ FASE FUTURA (Não prioritário agora)

12. **Calendário e Eventos**
    - Agenda integrada
    - Lembretes
    - Agendamentos

13. **Sistema de Serviços**
    - Lavanderia
    - Ajustes/consertos

14. **Relatórios Financeiros Avançados**
    - DRE
    - Balanço patrimonial
    - Projeções complexas

---

## 4. DIFERENCIAL COMPETITIVO DA RETRÔ CARÓLIS

### Vantagens sobre o 2Cabides:

1. ✅ **E-commerce Integrado** - Gestão + Vendas Online em uma plataforma
2. ✅ **Design Moderno** - Interface contemporânea e atraente
3. ✅ **Pagamentos Online** - Mercado Pago integrado
4. ✅ **SEO Ready** - Preparado para marketing digital
5. ✅ **Favoritos** - Facilita retorno de clientes
6. ✅ **Cálculo de Frete** - Peso e dimensões já implementados

### Potencial de Mercado:

- **SaaS Multi-tenant**: Preparação para vender para outros brechós
- **Solução Completa**: Online + Offline em um único sistema
- **Mercado em Crescimento**: 118.000+ brechós no Brasil (+31% em 5 anos)
- **Preço Competitivo**: Contra R$ 69,90/mês do 2Cabides

---

## 5. PLANO DE IMPLEMENTAÇÃO REVISADO

### 🔴 FASE 1 - FUNDAÇÃO (1-2 meses)
**Objetivo: Operação básica de consignação e loja física**

#### Semanas 1-2: Infraestrutura
- [ ] Renomear "Brechó da Luli" → "Retrô Carólis" em todo o código
- [ ] Implementar sistema de permissões base (RBAC)
- [ ] Criar 4 níveis de usuário (Admin, Dono, Vendedor, Fornecedor)
- [ ] Estrutura para multi-tenant (preparação futura)

#### Semanas 3-4: Consignação Base
- [ ] Entidade Fornecedora (cadastro completo)
- [ ] Campo "fornecedora_id" em Produto (null = próprio)
- [ ] Campo "percentual_repasse" por fornecedora
- [ ] Entidade Crédito/Repasse
- [ ] Cálculo automático de créditos na venda
- [ ] Status de crédito (pendente_30_dias, liberado, utilizado, pago)

#### Semanas 5-6: Portal da Fornecedora
- [ ] Tela de login para fornecedoras
- [ ] Dashboard com saldo
- [ ] Listagem de produtos consignados
- [ ] Histórico de vendas
- [ ] Histórico de repasses
- [ ] Relatórios básicos

#### Semanas 7-8: Código de Barras e Etiquetas
- [ ] Geração de código de barras
- [ ] Campo "codigo_barras" em Produto
- [ ] Integração com leitor USB
- [ ] Templates de etiquetas
- [ ] Impressão (individual e em lote)

### 🟡 FASE 2 - OPERAÇÃO PROFISSIONAL (2-3 meses)
**Objetivo: Controles operacionais e financeiros**

#### Mês 1: Controle de Caixa
- [ ] Entidade Caixa
- [ ] Abertura (saldo inicial, operador)
- [ ] Movimentações (vendas, despesas, sangria, reforço)
- [ ] Fechamento (conferência, diferença)
- [ ] Relatórios de movimento
- [ ] Histórico de caixas

#### Mês 2: Trocas e Devoluções
- [ ] Entidade Troca/Devolução
- [ ] Regras presencial (com/sem defeito)
- [ ] Regras online (CDC 7 dias)
- [ ] Interface explicativa
- [ ] Controle de solicitações
- [ ] Workflow de aprovação
- [ ] Estorno automático
- [ ] Reintegração ao estoque

#### Mês 3: Fluxo de Caixa
- [ ] Entidade Conta a Receber
- [ ] Dashboard de fluxo de caixa
- [ ] Entradas vs Saídas
- [ ] Gráficos de evolução
- [ ] Saldo projetado (básico)

### 🟢 FASE 3 - RELATÓRIOS E ANÁLISES (1-2 meses)
**Objetivo: Inteligência de negócio e exportações**

#### Mês 1: Relatórios de Consignação
- [ ] Relatório por fornecedora (vendas, créditos)
- [ ] Relatório de produtos consignados
- [ ] Relatório de créditos a pagar
- [ ] Relatório de repasses realizados
- [ ] Análise de rentabilidade por fornecedora

#### Mês 2: Relatórios de Vendas e Exportação
- [ ] Relatórios avançados de vendas
- [ ] Comparativo período vs período
- [ ] Produtos/categorias mais vendidos
- [ ] Análise ABC
- [ ] Vendas por vendedor
- [ ] Vendas por forma de pagamento
- [ ] Vendas online vs presencial
- [ ] Exportação PDF
- [ ] Exportação Excel/CSV

### 🔵 FASE 4 - APRIMORAMENTOS (Contínuo)
**Objetivo: Melhorias incrementais**

- [ ] Nota fiscal simplificada (estrutura, sem SEFAZ)
- [ ] Alertas de estoque baixo
- [ ] Histórico detalhado de clientes
- [ ] Gestão de comissões para vendedores
- [ ] Rastreamento de pedidos online
- [ ] Sistema de avaliações
- [ ] Melhorias de UX/UI

### ⏸️ FASE FUTURA (6+ meses)
**Objetivo: Expansão e diferenciação**

- [ ] Calendário e eventos
- [ ] Sistema de serviços (lavanderia, ajustes)
- [ ] DRE e Balanço Patrimonial
- [ ] Projeções financeiras avançadas
- [ ] Marketing automation
- [ ] Integração com redes sociais
- [ ] App mobile

---

## 6. ESTIMATIVA DE ESFORÇO REVISADA

### Complexidade por Módulo:

| Módulo | Complexidade | Tempo Estimado |
|--------|--------------|----------------|
| **FASE 1** | | **8 semanas** |
| Sistema de Permissões (RBAC) | Alta | 1-2 semanas |
| Consignação Base | Alta | 2-3 semanas |
| Portal da Fornecedora | Média | 2 semanas |
| Código de Barras e Etiquetas | Média | 1-2 semanas |
| **FASE 2** | | **10-12 semanas** |
| Controle de Caixa | Média | 2-3 semanas |
| Sistema de Trocas/Devoluções | Alta | 3-4 semanas |
| Fluxo de Caixa | Alta | 3-4 semanas |
| Consignação Avançada | Média | 2-3 semanas |
| **FASE 3** | | **6-8 semanas** |
| Relatórios de Consignação | Média | 2-3 semanas |
| Relatórios de Vendas | Alta | 3-4 semanas |
| Exportação (PDF/Excel) | Média | 1-2 semanas |
| **FASE 4** | | **Variável** |
| Nota Fiscal Simplificada | Baixa | 1 semana |
| Alertas de Estoque | Baixa | 3-5 dias |
| Histórico de Clientes | Baixa | 1 semana |
| Gestão de Comissões | Média | 2 semanas |

### **Total Estimado: 24-28 semanas (6-7 meses) para Fases 1-3**

---

## 7. STACK TÉCNICO RECOMENDADO

### Bibliotecas Necessárias:

1. **Código de Barras:**
   ```bash
   npm install jsbarcode react-barcode
   ```

2. **QR Code:**
   ```bash
   npm install qrcode.react
   ```

3. **Impressão:**
   ```bash
   npm install react-to-print jspdf
   ```

4. **Exportação Excel:**
   ```bash
   npm install xlsx
   ```

5. **Gráficos Avançados:**
   ```bash
   npm install recharts
   ```

6. **Permissões (RBAC):**
   ```bash
   npm install @casl/ability @casl/react
   ```

7. **Datas:**
   ```bash
   npm install date-fns
   ```

8. **Validação:**
   ```bash
   npm install zod
   ```

---

## 8. CONSIDERAÇÕES FINAIS

### Arquitetura Multi-Tenant:

Para preparar o sistema para venda futura para outros brechós:

1. **Banco de Dados:**
   - Adicionar campo `brecho_id` em todas as tabelas principais
   - Filtro automático por `brecho_id` em todas as queries
   - Isolamento total de dados entre brechós

2. **Autenticação:**
   - JWT com informações do brechó
   - Middleware para verificar `brecho_id`
   - Subdomínios por brechó (opcional): `retrocarolis.app`, `outrobrecho.app`

3. **Configurações:**
   - Tabela de configurações por brechó
   - Temas/cores personalizáveis
   - Logo e identidade visual

4. **Níveis de Acesso:**
   ```
   ADMIN (você)
   └── BRECHÓ 1 (Retrô Carólis)
       ├── DONO
       ├── VENDEDOR
       └── FORNECEDOR
   └── BRECHÓ 2 (Cliente futuro)
       ├── DONO
       ├── VENDEDOR
       └── FORNECEDOR
   ```

### Modelo de Negócio Sugerido:

- **Plano Único:** R$ 79,90/mês (competitivo com 2Cabides)
- **Diferencial:** E-commerce incluído
- **Trial:** 14 dias grátis
- **Sem fidelidade:** Cancela quando quiser
- **Suporte:** WhatsApp/Email

### Próximos Passos Imediatos:

1. ✅ Validar este plano revisado
2. ⏭️ Iniciar Fase 1 - Semanas 1-2 (Infraestrutura)
3. ⏭️ Criar branch de desenvolvimento
4. ⏭️ Documentar APIs e estrutura de dados
5. ⏭️ Definir padrões de código

---

**Documento criado em:** 05/11/2025
**Status:** APROVADO PARA IMPLEMENTAÇÃO
**Próxima Revisão:** Após conclusão da Fase 1

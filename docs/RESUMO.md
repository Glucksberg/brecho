# Resumo do Projeto Brechó da Luli

## Visão Geral
E-commerce completo para brechó com painel administrativo e loja pública. Sistema moderno construído com React e Node.js, pronto para integração com banco de dados.

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 18.2** - Framework UI
- **Vite 5.0** - Build tool e dev server
- **React Router DOM 6.20** - Roteamento
- **Tailwind CSS 3.3** - Framework CSS
- **Framer Motion 10.16** - Animações
- **Radix UI** - Componentes headless
- **Lucide React** - Biblioteca de ícones

### Backend
- **Node.js + Express 4.18** - Servidor API
- **Mercado Pago SDK** - Integração de pagamentos
- **CORS** - Cross-origin requests

### Ferramentas de Desenvolvimento
- ESLint
- PostCSS + Autoprefixer
- Nodemon

---

## 📁 Estrutura do Projeto

```
/root/brecho/
├── src/                    # Aplicação React principal
│   ├── main.jsx           # Entry point
│   ├── App.jsx            # Componente raiz
│   └── index.css          # Estilos globais
├── Pages/                 # 26 páginas da aplicação
│   ├── Home/             # Página inicial da loja
│   ├── Products/         # Catálogo de produtos
│   ├── Admin/            # Painel administrativo
│   ├── Auth/             # Autenticação
│   └── Checkout/         # Fluxo de pagamento
├── components/           # Componentes reutilizáveis
│   ├── auth/            # Autenticação
│   ├── ui/              # Primitivos UI
│   ├── providers/       # Context providers
│   ├── admin/           # Admin específicos
│   ├── home/            # Seções homepage
│   ├── products/        # Produtos
│   ├── sales/           # Vendas
│   ├── clientes/        # Clientes
│   ├── despesas/        # Despesas
│   └── reports/         # Relatórios
├── entities/            # Modelos de dados JavaScript
│   ├── Produto.js
│   ├── Cliente.js
│   ├── Venda.js
│   ├── Despesa.js
│   └── User.js
├── Entities/            # Schemas JSON
├── utils/               # Funções utilitárias
├── MP BackEnd/          # Backend Mercado Pago
│   ├── server.js
│   └── package.json
├── docs/                # Documentação
├── Layout.jsx           # Layout principal com sidebars
├── index.html           # HTML entry
├── vite.config.js       # Configuração Vite
├── tailwind.config.js   # Configuração Tailwind
└── package.json         # Dependências frontend
```

---

## ✨ Funcionalidades

### Loja Pública (Cliente)

#### Navegação e Catálogo
- ✅ Homepage com hero section, carrossel, produtos em destaque
- ✅ Catálogo completo de produtos
- ✅ Página de detalhes do produto com galeria de imagens
- ✅ Sistema de busca avançada
- ✅ Filtros múltiplos:
  - Por categoria
  - Por faixa de preço
  - Por tamanho
  - Por cor
  - Por condição (novo/seminovo/usado)

#### Compras
- ✅ Carrinho de compras
  - Adicionar/remover produtos
  - Aplicar cupons de desconto
  - Persistência em localStorage
- ✅ Sistema de favoritos
  - Salvar produtos favoritos
  - Persistência em localStorage
- ✅ Checkout com Mercado Pago
  - Páginas: Success, Error, Pending

#### Autenticação de Usuários
- ✅ Registro de novos usuários
- ✅ Login (email/senha)
- ✅ Google OAuth (preparado)
- ✅ Recuperação de senha
- ✅ Verificação OTP (simulado)
- ✅ Gestão de sessão (expiração 24h)
- ✅ Página "Minha Conta"

### Painel Administrativo

#### Dashboard
- ✅ Métricas em tempo real:
  - Total de produtos
  - Número de vendas
  - Receita total
- ✅ Gráficos:
  - Distribuição por categoria
  - Performance de vendas
- ✅ Alertas de estoque baixo
- ✅ Vendas recentes

#### Gestão de Produtos
- ✅ CRUD completo de produtos
- ✅ Upload de imagens (preparado)
- ✅ Gestão de status:
  - Disponível
  - Vendido
  - Reservado
- ✅ Códigos únicos automáticos (BR{timestamp})
- ✅ Campos completos:
  - Nome, descrição, preço
  - Categoria, subcategoria
  - Tamanho, cor, marca
  - Condição, gênero
  - Tags, estoque

#### Gestão de Vendas
- ✅ Registrar vendas
- ✅ Vendas com múltiplos produtos
- ✅ Múltiplas formas de pagamento:
  - Dinheiro
  - PIX
  - Cartão
- ✅ Associar cliente à venda
- ✅ Cálculo de descontos

#### Gestão de Clientes
- ✅ CRUD de clientes
- ✅ Status (ativo/inativo)
- ✅ Histórico de compras
- ✅ Dados completos:
  - Nome, email, telefone
  - Endereço completo

#### Controle Financeiro
- ✅ Registro de despesas
- ✅ Categorização de despesas
- ✅ Relatórios financeiros
- ✅ Métricas de performance

#### Configurações
- ✅ Backup de dados
- ✅ Restauração de dados

---

## 🏷️ Categorias de Produtos

- Vestidos
- Blazers
- Acessórios
- Bolsas
- Saias
- Calçados

---

## 📊 Modelos de Dados

### Produto
```javascript
{
  id: string,
  nome: string,
  descricao: string,
  preco: number,
  precoOriginal: number,
  categoria: string,
  subcategoria: string,
  tamanho: string,
  cor: string,
  marca: string,
  condicao: 'novo' | 'seminovo' | 'usado',
  genero: 'masculino' | 'feminino' | 'unissex' | 'infantil',
  imagens: string[],
  estoque: number,
  ativo: boolean,
  destaque: boolean,
  tags: string[],
  criadoEm: Date,
  atualizadoEm: Date,
  vendido: boolean
}
```

### Cliente
```javascript
{
  id: string,
  nome: string,
  email: string,
  telefone: string,
  endereco: {
    rua: string,
    numero: string,
    complemento: string,
    bairro: string,
    cidade: string,
    estado: string,
    cep: string
  },
  historicoCompras: array,
  status: 'ativo' | 'inativo',
  criadoEm: Date
}
```

### Venda
```javascript
{
  id: string,
  cliente_id: string,
  produtos: array,
  valor_venda: number,
  forma_pagamento: string,
  data_venda: Date,
  status: string
}
```

### Despesa
```javascript
{
  id: string,
  descricao: string,
  categoria: string,
  valor: number,
  data: Date,
  metodo_pagamento: string
}
```

### User (Admin)
```javascript
{
  id: string,
  nome: string,
  email: string,
  telefone: string,
  role: 'admin' | 'user',
  avatar: string,
  endereco: object,
  ativo: boolean
}
```

---

## 🎨 Sistema de Design

### Paleta de Cores
- Verdes sage (tons pastel)
- Roxos e rosas (acentos)
- Gradientes customizados

### Características
- Design responsivo (mobile-first)
- Animações customizadas (fade-in, slide-up, bounce-subtle)
- Biblioteca de componentes inspirada em Shadcn/ui
- Tipografia: Inter como fonte principal

---

## ⚙️ Configurações

### Vite (vite.config.js)
- Plugin React configurado
- Alias de path: `@` → raiz do projeto
- Dev server: porta 5173
- Code splitting otimizado:
  - vendor (dependências)
  - ui (componentes UI)
  - radix (Radix UI)
- Minificação com terser

### Tailwind (tailwind.config.js)
- Paths de conteúdo incluem todos JSX
- Sistema de cores estendido com variáveis CSS
- Paleta sage customizada
- Animações e keyframes customizados

### Backend (MP BackEnd)
- Servidor Express na porta 3001
- Endpoints disponíveis:
  - `/api/health` - Health check
  - `/api/test-mercadopago` - Teste integração MP
  - `/api/create-mercadopago-preference` - Criar preferência de pagamento

---

## 📈 Status Atual do Projeto

### ✅ Completo (85%)
- Interface UI/UX totalmente implementada
- Todos os componentes de página construídos
- Sistema de navegação e roteamento funcionando
- Gerenciamento de estado com Context API
- Biblioteca completa de componentes UI
- Painel administrativo totalmente desenhado
- Servidor backend API funcional
- Layout responsivo

### ⚠️ Pendente (15%)

#### Crítico
- [ ] **Banco de dados real** - Dados não persistem (atualmente apenas mock)
- [ ] **Implementação dos métodos das entidades** - list(), create(), update(), delete()
- [ ] **Conexão frontend-backend** - APIs não conectadas
- [ ] **Sistema de upload de imagens** - Funcionalidade preparada mas não implementada
- [ ] **Integração de email** - Sistema mockado (OTP, recuperação de senha)
- [ ] **Google OAuth real** - Apenas preparado
- [ ] **Webhooks Mercado Pago** - Callbacks de pagamento

---

## 🚀 Próximos Passos Recomendados

### Fase 1: Infraestrutura de Dados
1. Implementar banco de dados
   - Opção recomendada: **Prisma + PostgreSQL** ou **Prisma + SQLite**
   - Definir schema baseado nas entities existentes
   - Configurar migrations
2. Implementar métodos CRUD nas entities
3. Criar API REST no backend para conectar frontend

### Fase 2: Integrações
4. Implementar upload de imagens real
   - Opções: AWS S3, Cloudinary, ou armazenamento local
5. Configurar serviço de email
   - Para OTP e notificações
   - Opções: SendGrid, Mailgun, Resend
6. Integrar webhooks do Mercado Pago
   - Confirmação de pagamento
   - Atualização de status de vendas

### Fase 3: Autenticação
7. Implementar Google OAuth real
8. Adicionar sistema de tokens JWT
9. Implementar refresh tokens

### Fase 4: Deploy e Performance
10. Otimizar imagens e assets
11. Configurar ambiente de produção
12. Deploy (Vercel/Netlify para frontend, Railway/Render para backend)

---

## 📝 Notas Importantes

- **Sessões**: Sistema de sessão com expiração de 24 horas implementado
- **Códigos de produto**: Gerados automaticamente no formato `BR{timestamp}`
- **LocalStorage**: Usado para persistência temporária de carrinho e favoritos
- **Dual Layout**: Sistema com layouts separados para área pública e admin
- **Context API**: Gerenciamento global de estado para Cart e Favorites

---

## 🔧 Comandos Disponíveis

### Frontend
```bash
npm run dev      # Inicia servidor de desenvolvimento (porta 5173)
npm run build    # Build para produção
npm run preview  # Preview do build de produção
npm run lint     # Executar linter
```

### Backend (MP BackEnd/)
```bash
npm start        # Inicia servidor Express (porta 3001)
npm run dev      # Inicia com nodemon (hot reload)
```

---

**Última atualização**: 28 de outubro de 2025
**Versão do projeto**: 1.0 (Em desenvolvimento)

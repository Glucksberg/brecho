/**
 * TypeScript Types and Interfaces
 * Sistema Retrô Carólis - Next.js 14 + TypeScript
 */

import {
  User as PrismaUser,
  Brecho as PrismaBrecho,
  Fornecedora as PrismaFornecedora,
  Credito as PrismaCredito,
  Produto as PrismaProduto,
  Cliente as PrismaCliente,
  Venda as PrismaVenda,
  ItemVenda as PrismaItemVenda,
  Caixa as PrismaCaixa,
  Troca as PrismaTroca,
  Despesa as PrismaDespesa,
  UserRole,
  TipoProduto,
  CondicaoProduto,
  StatusVenda,
  StatusCaixa,
  StatusTroca,
  TipoTroca,
  MotivoTroca,
  OrigemVenda,
  CreditoStatus,
  CategoriaDespesa
} from '@prisma/client'

// ============================================================================
// Extended Types (Prisma models with relations)
// ============================================================================

export type User = PrismaUser & {
  brecho?: Brecho | null
  fornecedora?: Fornecedora | null
  vendas?: Venda[]
  caixasAbertas?: Caixa[]
  caixasFechadas?: Caixa[]
}

export type Brecho = PrismaBrecho & {
  usuarios?: User[]
  fornecedoras?: Fornecedora[]
  produtos?: Produto[]
  clientes?: Cliente[]
  vendas?: Venda[]
  caixas?: Caixa[]
  trocas?: Troca[]
  despesas?: Despesa[]
}

export type Fornecedora = PrismaFornecedora & {
  brecho?: Brecho
  usuario?: User | null
  produtos?: Produto[]
  creditos?: Credito[]
}

export type Credito = PrismaCredito & {
  fornecedora?: Fornecedora
  venda?: Venda | null
  itemVenda?: ItemVenda | null
  utilizadoEmVenda?: Venda | null
}

export type Produto = PrismaProduto & {
  brecho?: Brecho
  fornecedora?: Fornecedora | null
  itensVenda?: ItemVenda[]
}

export type Cliente = PrismaCliente & {
  brecho?: Brecho
  vendas?: Venda[]
  trocas?: Troca[]
}

export type Venda = PrismaVenda & {
  brecho?: Brecho
  cliente?: Cliente | null
  vendedor?: User | null
  itens?: ItemVenda[]
  creditoUtilizado?: Credito | null
  caixa?: Caixa | null
  trocas?: Troca[]
}

export type ItemVenda = PrismaItemVenda & {
  venda?: Venda
  produto?: Produto
  creditoGerado?: Credito | null
}

export type Caixa = PrismaCaixa & {
  brecho?: Brecho
  usuarioAbertura?: User
  usuarioFechamento?: User | null
  vendas?: Venda[]
  despesas?: Despesa[]
}

export type Troca = PrismaTroca & {
  brecho?: Brecho
  venda?: Venda
  cliente?: Cliente | null
  novaVenda?: Venda | null
}

export type Despesa = PrismaDespesa & {
  brecho?: Brecho
  caixa?: Caixa | null
}

// ============================================================================
// Enums Re-exports
// ============================================================================

export {
  UserRole,
  TipoProduto,
  CondicaoProduto,
  StatusVenda,
  StatusCaixa,
  StatusTroca,
  TipoTroca,
  MotivoTroca,
  OrigemVenda,
  CreditoStatus,
  CategoriaDespesa
}

// ============================================================================
// DTOs (Data Transfer Objects)
// ============================================================================

export interface CreateUserDTO {
  nome: string
  email: string
  senha: string
  telefone?: string
  tipo: UserRole
  brechoId: string
  fornecedoraId?: string
  comissao?: number
  metaMensal?: number
}

export interface UpdateUserDTO {
  nome?: string
  email?: string
  telefone?: string
  comissao?: number
  metaMensal?: number
  ativo?: boolean
}

export interface CreateFornecedoraDTO {
  nome: string
  cpf?: string
  telefone: string
  email?: string
  percentualRepasse: number
  brechoId: string
  endereco?: {
    rua: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    estado: string
    cep: string
  }
}

export interface UpdateFornecedoraDTO {
  nome?: string
  cpf?: string
  telefone?: string
  email?: string
  percentualRepasse?: number
  ativo?: boolean
  endereco?: {
    rua?: string
    numero?: string
    complemento?: string
    bairro?: string
    cidade?: string
    estado?: string
    cep?: string
  }
}

export interface CreateProdutoDTO {
  nome: string
  descricao?: string
  preco: number
  categoria: string
  subcategoria?: string
  marca?: string
  tamanho?: string
  cor?: string
  condicao: CondicaoProduto
  tipo: TipoProduto
  fornecedoraId?: string
  brechoId: string
  imagens?: string[]
  peso?: number
  altura?: number
  largura?: number
  profundidade?: number
}

export interface CreateVendaDTO {
  clienteId?: string
  origem: OrigemVenda
  tipoPagamento: string
  itens: {
    produtoId: string
    quantidade: number
    precoUnitario: number
    desconto?: number
  }[]
  desconto?: number
  creditoUtilizadoId?: string
  valorCreditoUtilizado?: number
  caixaId?: string
  brechoId: string
}

export interface CreateCaixaDTO {
  saldoInicial: number
  usuarioAberturaId: string
  brechoId: string
  observacoes?: string
}

export interface FecharCaixaDTO {
  saldoFinal: number
  usuarioFechamentoId: string
  vendasDinheiro?: number
  vendasCartaoDebito?: number
  vendasCartaoCredito?: number
  vendasPix?: number
  totalDespesas?: number
  totalSangrias?: number
  totalReforcos?: number
  observacoesFechamento?: string
}

export interface CreateTrocaDTO {
  vendaId: string
  clienteId?: string
  tipo: TipoTroca
  motivo: MotivoTroca
  observacoes?: string
  produtosTroca?: {
    produtoId: string
    quantidade: number
  }[]
  brechoId: string
}

export interface CreateDespesaDTO {
  descricao: string
  valor: number
  categoria: CategoriaDespesa
  dataVencimento?: Date
  caixaId?: string
  brechoId: string
  observacoes?: string
}

// ============================================================================
// View Models / Display Types
// ============================================================================

export interface DashboardStats {
  vendasHoje: {
    total: number
    quantidade: number
    crescimento: number
  }
  vendasMes: {
    total: number
    quantidade: number
    crescimento: number
  }
  produtosAtivos: number
  produtosVendidosMes: number
  ticketMedio: number
  caixaAberto: boolean
  saldoCaixa: number
}

export interface FornecedoraStats {
  id: string
  nome: string
  totalProdutosAtivos: number
  totalProdutosVendidos: number
  totalVendido: number
  creditoDisponivel: number
  creditoPendente: number
  percentualRepasse: number
  classificacao: 'VIP' | 'Premium' | 'Regular' | 'Iniciante'
}

export interface RelatorioVendas {
  periodo: {
    inicio: Date
    fim: Date
  }
  totalVendas: number
  quantidadeVendas: number
  ticketMedio: number
  vendasPorDia: {
    data: Date
    total: number
    quantidade: number
  }[]
  vendasPorFormaPagamento: {
    tipo: string
    total: number
    quantidade: number
    percentual: number
  }[]
  vendasPorVendedor: {
    vendedorId: string
    vendedorNome: string
    total: number
    quantidade: number
    comissao: number
  }[]
  produtosMaisVendidos: {
    produtoId: string
    produtoNome: string
    quantidade: number
    total: number
  }[]
}

export interface RelatorioConsignacao {
  fornecedoraId: string
  fornecedoraNome: string
  periodo: {
    inicio: Date
    fim: Date
  }
  produtosAtivos: number
  produtosVendidos: number
  totalVendido: number
  creditosGerados: number
  creditosLiberados: number
  creditosUtilizados: number
  creditoPendente: number
  creditoDisponivel: number
  percentualRepasse: number
}

export interface CaixaMovimento {
  tipo: 'ENTRADA' | 'SAIDA'
  categoria: 'VENDA' | 'DESPESA' | 'SANGRIA' | 'REFORCO'
  descricao: string
  valor: number
  dataHora: Date
  usuario: string
}

// ============================================================================
// Filter Types
// ============================================================================

export interface ProdutoFilters {
  search?: string
  categoria?: string
  tipo?: TipoProduto
  condicao?: CondicaoProduto
  fornecedoraId?: string
  precoMin?: number
  precoMax?: number
  ordenar?: 'recentes' | 'antigos' | 'menor_preco' | 'maior_preco' | 'nome_az' | 'nome_za'
}

export interface VendaFilters {
  dataInicio?: Date
  dataFim?: Date
  clienteId?: string
  vendedorId?: string
  origem?: OrigemVenda
  tipoPagamento?: string
  status?: StatusVenda
  valorMin?: number
  valorMax?: number
}

export interface FornecedoraFilters {
  search?: string
  ativo?: boolean
  ordenar?: 'nome_az' | 'nome_za' | 'maior_credito' | 'mais_produtos' | 'mais_vendas'
}

// ============================================================================
// Pagination Types
// ============================================================================

export interface PaginationParams {
  page: number
  perPage: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    perPage: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiError {
  message: string
  code?: string
  field?: string
}

// ============================================================================
// Session Types (NextAuth)
// ============================================================================

export interface SessionUser {
  id: string
  nome: string
  email: string
  tipo: UserRole
  brechoId: string
  fornecedoraId?: string | null
  avatar?: string | null
  permissoes: string[]
}

// ============================================================================
// Utility Types
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

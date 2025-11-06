/**
 * Sistema de Permissões RBAC (Role-Based Access Control)
 * TypeScript version for Next.js
 */

import { UserRole } from '@prisma/client'
import type { SessionUser } from '@/types'

/**
 * Definição dos níveis de acesso e suas permissões
 *
 * Hierarquia:
 * - ADMIN: Super usuário, acesso total a todos os brechós
 * - DONO: Proprietário do brechó, acesso total ao seu brechó
 * - VENDEDOR: Funcionário, pode vender e gerenciar produtos
 * - FORNECEDOR: Acesso ao portal da fornecedora
 * - CLIENTE: Usuário comum, acesso à loja online
 */

// Definição de permissões disponíveis
export const PERMISSIONS = {
  // Produtos
  PRODUTO_CRIAR: 'produto:criar',
  PRODUTO_EDITAR: 'produto:editar',
  PRODUTO_EXCLUIR: 'produto:excluir',
  PRODUTO_VISUALIZAR: 'produto:visualizar',
  PRODUTO_GERAR_CODIGO_BARRAS: 'produto:gerar_codigo_barras',
  PRODUTO_IMPRIMIR_ETIQUETA: 'produto:imprimir_etiqueta',

  // Vendas
  VENDA_CRIAR: 'venda:criar',
  VENDA_EDITAR: 'venda:editar',
  VENDA_CANCELAR: 'venda:cancelar',
  VENDA_VISUALIZAR: 'venda:visualizar',
  VENDA_VISUALIZAR_TODAS: 'venda:visualizar_todas',

  // Clientes
  CLIENTE_CRIAR: 'cliente:criar',
  CLIENTE_EDITAR: 'cliente:editar',
  CLIENTE_EXCLUIR: 'cliente:excluir',
  CLIENTE_VISUALIZAR: 'cliente:visualizar',

  // Fornecedoras (Consignação)
  FORNECEDORA_CRIAR: 'fornecedora:criar',
  FORNECEDORA_EDITAR: 'fornecedora:editar',
  FORNECEDORA_EXCLUIR: 'fornecedora:excluir',
  FORNECEDORA_VISUALIZAR: 'fornecedora:visualizar',
  FORNECEDORA_PAGAR: 'fornecedora:pagar',
  FORNECEDORA_VISUALIZAR_CREDITOS: 'fornecedora:visualizar_creditos',

  // Portal da Fornecedora
  PORTAL_FORNECEDORA_ACESSAR: 'portal_fornecedora:acessar',
  PORTAL_FORNECEDORA_RELATORIOS: 'portal_fornecedora:relatorios',

  // Caixa
  CAIXA_ABRIR: 'caixa:abrir',
  CAIXA_FECHAR: 'caixa:fechar',
  CAIXA_SANGRIA: 'caixa:sangria',
  CAIXA_REFORCO: 'caixa:reforco',
  CAIXA_VISUALIZAR: 'caixa:visualizar',

  // Trocas e Devoluções
  TROCA_CRIAR: 'troca:criar',
  TROCA_APROVAR: 'troca:aprovar',
  TROCA_RECUSAR: 'troca:recusar',
  TROCA_VISUALIZAR: 'troca:visualizar',

  // Despesas
  DESPESA_CRIAR: 'despesa:criar',
  DESPESA_EDITAR: 'despesa:editar',
  DESPESA_EXCLUIR: 'despesa:excluir',
  DESPESA_VISUALIZAR: 'despesa:visualizar',

  // Relatórios
  RELATORIO_VENDAS: 'relatorio:vendas',
  RELATORIO_PRODUTOS: 'relatorio:produtos',
  RELATORIO_FINANCEIRO: 'relatorio:financeiro',
  RELATORIO_CONSIGNACAO: 'relatorio:consignacao',
  RELATORIO_EXPORTAR: 'relatorio:exportar',

  // Usuários
  USUARIO_CRIAR: 'usuario:criar',
  USUARIO_EDITAR: 'usuario:editar',
  USUARIO_EXCLUIR: 'usuario:excluir',
  USUARIO_VISUALIZAR: 'usuario:visualizar',

  // Configurações
  CONFIG_VISUALIZAR: 'config:visualizar',
  CONFIG_EDITAR: 'config:editar',

  // Dashboard
  DASHBOARD_ACESSAR: 'dashboard:acessar',
  DASHBOARD_VENDAS: 'dashboard:vendas',
  DASHBOARD_FINANCEIRO: 'dashboard:financeiro',

  // Brechós (Multi-tenant)
  BRECHO_CRIAR: 'brecho:criar',
  BRECHO_EDITAR: 'brecho:editar',
  BRECHO_EXCLUIR: 'brecho:excluir',
  BRECHO_VISUALIZAR_TODOS: 'brecho:visualizar_todos',
} as const

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS]

// Definição de permissões por tipo de usuário
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Admin tem TODAS as permissões
    ...Object.values(PERMISSIONS)
  ],

  [UserRole.DONO]: [
    // Produtos
    PERMISSIONS.PRODUTO_CRIAR,
    PERMISSIONS.PRODUTO_EDITAR,
    PERMISSIONS.PRODUTO_EXCLUIR,
    PERMISSIONS.PRODUTO_VISUALIZAR,
    PERMISSIONS.PRODUTO_GERAR_CODIGO_BARRAS,
    PERMISSIONS.PRODUTO_IMPRIMIR_ETIQUETA,

    // Vendas
    PERMISSIONS.VENDA_CRIAR,
    PERMISSIONS.VENDA_EDITAR,
    PERMISSIONS.VENDA_CANCELAR,
    PERMISSIONS.VENDA_VISUALIZAR,
    PERMISSIONS.VENDA_VISUALIZAR_TODAS,

    // Clientes
    PERMISSIONS.CLIENTE_CRIAR,
    PERMISSIONS.CLIENTE_EDITAR,
    PERMISSIONS.CLIENTE_EXCLUIR,
    PERMISSIONS.CLIENTE_VISUALIZAR,

    // Fornecedoras
    PERMISSIONS.FORNECEDORA_CRIAR,
    PERMISSIONS.FORNECEDORA_EDITAR,
    PERMISSIONS.FORNECEDORA_EXCLUIR,
    PERMISSIONS.FORNECEDORA_VISUALIZAR,
    PERMISSIONS.FORNECEDORA_PAGAR,
    PERMISSIONS.FORNECEDORA_VISUALIZAR_CREDITOS,

    // Caixa
    PERMISSIONS.CAIXA_ABRIR,
    PERMISSIONS.CAIXA_FECHAR,
    PERMISSIONS.CAIXA_SANGRIA,
    PERMISSIONS.CAIXA_REFORCO,
    PERMISSIONS.CAIXA_VISUALIZAR,

    // Trocas
    PERMISSIONS.TROCA_CRIAR,
    PERMISSIONS.TROCA_APROVAR,
    PERMISSIONS.TROCA_RECUSAR,
    PERMISSIONS.TROCA_VISUALIZAR,

    // Despesas
    PERMISSIONS.DESPESA_CRIAR,
    PERMISSIONS.DESPESA_EDITAR,
    PERMISSIONS.DESPESA_EXCLUIR,
    PERMISSIONS.DESPESA_VISUALIZAR,

    // Relatórios
    PERMISSIONS.RELATORIO_VENDAS,
    PERMISSIONS.RELATORIO_PRODUTOS,
    PERMISSIONS.RELATORIO_FINANCEIRO,
    PERMISSIONS.RELATORIO_CONSIGNACAO,
    PERMISSIONS.RELATORIO_EXPORTAR,

    // Usuários
    PERMISSIONS.USUARIO_CRIAR,
    PERMISSIONS.USUARIO_EDITAR,
    PERMISSIONS.USUARIO_EXCLUIR,
    PERMISSIONS.USUARIO_VISUALIZAR,

    // Configurações
    PERMISSIONS.CONFIG_VISUALIZAR,
    PERMISSIONS.CONFIG_EDITAR,

    // Dashboard
    PERMISSIONS.DASHBOARD_ACESSAR,
    PERMISSIONS.DASHBOARD_VENDAS,
    PERMISSIONS.DASHBOARD_FINANCEIRO,
  ],

  [UserRole.VENDEDOR]: [
    // Produtos
    PERMISSIONS.PRODUTO_CRIAR,
    PERMISSIONS.PRODUTO_EDITAR,
    PERMISSIONS.PRODUTO_VISUALIZAR,
    PERMISSIONS.PRODUTO_GERAR_CODIGO_BARRAS,
    PERMISSIONS.PRODUTO_IMPRIMIR_ETIQUETA,

    // Vendas (só suas próprias vendas)
    PERMISSIONS.VENDA_CRIAR,
    PERMISSIONS.VENDA_VISUALIZAR,

    // Clientes
    PERMISSIONS.CLIENTE_CRIAR,
    PERMISSIONS.CLIENTE_EDITAR,
    PERMISSIONS.CLIENTE_VISUALIZAR,

    // Caixa
    PERMISSIONS.CAIXA_ABRIR,
    PERMISSIONS.CAIXA_FECHAR,
    PERMISSIONS.CAIXA_SANGRIA,
    PERMISSIONS.CAIXA_REFORCO,
    PERMISSIONS.CAIXA_VISUALIZAR,

    // Trocas
    PERMISSIONS.TROCA_CRIAR,
    PERMISSIONS.TROCA_VISUALIZAR,

    // Dashboard básico
    PERMISSIONS.DASHBOARD_ACESSAR,
  ],

  [UserRole.FORNECEDOR]: [
    // Portal da Fornecedora
    PERMISSIONS.PORTAL_FORNECEDORA_ACESSAR,
    PERMISSIONS.PORTAL_FORNECEDORA_RELATORIOS,

    // Visualizar apenas seus produtos
    PERMISSIONS.PRODUTO_VISUALIZAR,

    // Visualizar créditos
    PERMISSIONS.FORNECEDORA_VISUALIZAR_CREDITOS,
  ],

  [UserRole.CLIENTE]: [
    // Clientes podem apenas comprar na loja online
    // Não tem acesso ao painel administrativo
  ],
}

/**
 * Verifica se um usuário tem uma permissão específica
 */
export function hasPermission(user: SessionUser | null, permission: Permission): boolean {
  if (!user || !user.tipo) return false

  // Admin sempre tem todas as permissões
  if (user.tipo === UserRole.ADMIN) return true

  // Verifica permissões customizadas do usuário
  if (user.permissoes && Array.isArray(user.permissoes)) {
    if (user.permissoes.includes(permission)) return true
  }

  // Verifica permissões padrão da role
  const rolePermissions = ROLE_PERMISSIONS[user.tipo] || []
  return rolePermissions.includes(permission)
}

/**
 * Verifica se um usuário pode acessar uma rota
 */
export function canAccessRoute(user: SessionUser | null, route: string): boolean {
  if (!user) return false

  const routePermissions: Record<string, Permission[]> = {
    // Dashboard
    '/dashboard': [PERMISSIONS.DASHBOARD_ACESSAR],
    '/dashboard/vendas': [PERMISSIONS.DASHBOARD_VENDAS],
    '/dashboard/financeiro': [PERMISSIONS.DASHBOARD_FINANCEIRO],

    // Produtos
    '/admin/produtos': [PERMISSIONS.PRODUTO_VISUALIZAR],
    '/admin/produtos/novo': [PERMISSIONS.PRODUTO_CRIAR],

    // Vendas
    '/vendas': [PERMISSIONS.VENDA_VISUALIZAR],
    '/vendas/nova': [PERMISSIONS.VENDA_CRIAR],

    // Clientes
    '/clientes': [PERMISSIONS.CLIENTE_VISUALIZAR],

    // Fornecedoras
    '/fornecedoras': [PERMISSIONS.FORNECEDORA_VISUALIZAR],
    '/fornecedoras/creditos': [PERMISSIONS.FORNECEDORA_VISUALIZAR_CREDITOS],

    // Portal da Fornecedora
    '/portal-fornecedora': [PERMISSIONS.PORTAL_FORNECEDORA_ACESSAR],

    // Caixa
    '/caixa': [PERMISSIONS.CAIXA_VISUALIZAR],

    // Trocas
    '/trocas': [PERMISSIONS.TROCA_VISUALIZAR],

    // Despesas
    '/despesas': [PERMISSIONS.DESPESA_VISUALIZAR],

    // Relatórios
    '/relatorios': [PERMISSIONS.RELATORIO_VENDAS, PERMISSIONS.RELATORIO_PRODUTOS],

    // Configurações
    '/configuracoes': [PERMISSIONS.CONFIG_VISUALIZAR],
  }

  const requiredPermissions = routePermissions[route]
  if (!requiredPermissions) return true // Rota não requer permissões específicas

  // Verifica se tem pelo menos uma das permissões requeridas
  return requiredPermissions.some(permission => hasPermission(user, permission))
}

/**
 * Verifica se usuário é admin ou dono
 */
export function hasAdminAccess(user: SessionUser | null): boolean {
  if (!user) return false
  return user.tipo === UserRole.ADMIN || user.tipo === UserRole.DONO
}

/**
 * Verifica se usuário pode realizar vendas
 */
export function canSell(user: SessionUser | null): boolean {
  if (!user) return false
  return [UserRole.ADMIN, UserRole.DONO, UserRole.VENDEDOR].includes(user.tipo)
}

/**
 * Verifica se usuário pode acessar portal da fornecedora
 */
export function canAccessFornecedoraPortal(user: SessionUser | null): boolean {
  return hasPermission(user, PERMISSIONS.PORTAL_FORNECEDORA_ACESSAR)
}

/**
 * Obtém lista de permissões de um usuário
 */
export function getUserPermissions(user: SessionUser | null): Permission[] {
  if (!user || !user.tipo) return []

  // Admin tem todas
  if (user.tipo === UserRole.ADMIN) return Object.values(PERMISSIONS)

  // Combina permissões da role com permissões customizadas
  const rolePermissions = ROLE_PERMISSIONS[user.tipo] || []
  const customPermissions = (user.permissoes || []) as Permission[]

  return [...new Set([...rolePermissions, ...customPermissions])]
}

/**
 * Filtra lista de itens baseado em permissões
 */
export function filterByPermission<T>(
  items: T[],
  user: SessionUser | null,
  permissionCheck: (user: SessionUser, item: T) => boolean
): T[] {
  if (!user) return []
  if (user.tipo === UserRole.ADMIN) return items

  return items.filter(item => permissionCheck(user, item))
}

/**
 * Middleware helper - verifica múltiplas permissões
 */
export function hasAnyPermission(user: SessionUser | null, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(user, permission))
}

/**
 * Middleware helper - verifica todas as permissões
 */
export function hasAllPermissions(user: SessionUser | null, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(user, permission))
}

/**
 * Helper para checagem de permissão com throw
 */
export function requirePermission(user: SessionUser | null, permission: Permission): void {
  if (!hasPermission(user, permission)) {
    throw new Error(`Permissão negada: ${permission}`)
  }
}

/**
 * Helper para checagem de acesso admin com throw
 */
export function requireAdminAccess(user: SessionUser | null): void {
  if (!hasAdminAccess(user)) {
    throw new Error('Acesso negado: requer permissões de administrador')
  }
}

export default {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  canAccessRoute,
  hasAdminAccess,
  canSell,
  canAccessFornecedoraPortal,
  getUserPermissions,
  filterByPermission,
  hasAnyPermission,
  hasAllPermissions,
  requirePermission,
  requireAdminAccess,
}

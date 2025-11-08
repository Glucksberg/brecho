import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

/**
 * POST /api/tornar-se-fornecedora
 * Permite que um CLIENTE se torne fornecedora
 */

const fornecedoraSchema = z.object({
  telefone: z.string().min(10, 'Telefone é obrigatório'),
  cpf: z.string().optional(),
  percentualRepasse: z.number().min(0).max(100).default(60),
  endereco: z.object({
    rua: z.string().min(1, 'Rua é obrigatória'),
    numero: z.string().min(1, 'Número é obrigatório'),
    complemento: z.string().optional(),
    bairro: z.string().min(1, 'Bairro é obrigatório'),
    cidade: z.string().min(1, 'Cidade é obrigatória'),
    estado: z.string().min(2).max(2, 'UF deve ter 2 caracteres'),
    cep: z.string().min(8, 'CEP é obrigatório')
  }).optional(),
  dadosBancarios: z.object({
    banco: z.string().optional(),
    agencia: z.string().optional(),
    conta: z.string().optional(),
    tipoConta: z.enum(['CORRENTE', 'POUPANCA']).optional(),
    pix: z.string().optional()
  }).optional()
})

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = (await getServerSession()) as any

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Verificar se é CLIENTE
    if (session.user.tipo !== 'CLIENTE') {
      return NextResponse.json(
        { error: 'Apenas clientes podem se tornar fornecedoras' },
        { status: 403 }
      )
    }

    // Verificar se já é fornecedora
    if (session.user.fornecedoraId) {
      return NextResponse.json(
        { error: 'Você já é uma fornecedora' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const data = fornecedoraSchema.parse(body)

    // Buscar usuário completo
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    if (!user.brechoId) {
      return NextResponse.json(
        { error: 'Usuário não vinculado a um brechó' },
        { status: 400 }
      )
    }

    // Criar registro de Fornecedora
    const fornecedora = await prisma.fornecedora.create({
      data: {
        nome: user.name || 'Sem nome',
        cpf: data.cpf || user.cpf,
        email: user.email,
        telefone: (data.telefone || user.telefone || '') as string,
        percentualRepasse: data.percentualRepasse,
        endereco: data.endereco || undefined,
        dadosBancarios: data.dadosBancarios || undefined,
        ativo: true,
        brechoId: user.brechoId
      }
    })

    // Vincular fornecedora ao usuário
    await prisma.user.update({
      where: { id: user.id },
      data: {
        fornecedoraId: fornecedora.id,
        telefone: data.telefone || user.telefone,
        cpf: data.cpf || user.cpf
      }
    })

    // Criar registro na tabela Cliente se não existir
    const clienteExistente = await prisma.cliente.findFirst({
      where: {
        email: user.email,
        brechoId: user.brechoId
      }
    })

    if (!clienteExistente) {
      await prisma.cliente.create({
        data: {
          nome: user.name || 'Sem nome',
          email: user.email,
          telefone: data.telefone || user.telefone,
          cpf: data.cpf || user.cpf,
          brechoId: user.brechoId,
          ativo: true,
          totalCompras: 0,
          numeroCompras: 0
        }
      })
    }

    logger.info('User became fornecedora', {
      userId: user.id,
      fornecedoraId: fornecedora.id,
      email: user.email
    })

    return NextResponse.json({
      success: true,
      message: 'Parabéns! Você agora é uma fornecedora da Retrô Carólis',
      fornecedora: {
        id: fornecedora.id,
        nome: fornecedora.nome,
        percentualRepasse: fornecedora.percentualRepasse
      }
    })
  } catch (error: any) {
    logger.error('Error creating fornecedora', { error: error?.message })

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/tornar-se-fornecedora
 * Verifica se o usuário pode se tornar fornecedora
 */
export async function GET(request: NextRequest) {
  try {
    const session = (await getServerSession()) as any

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const canBecomeFornecedora =
      session.user.tipo === 'CLIENTE' &&
      !session.user.fornecedoraId

    return NextResponse.json({
      canBecomeFornecedora,
      isFornecedora: !!session.user.fornecedoraId,
      role: session.user.tipo
    })
  } catch (error: any) {
    logger.error('Error checking fornecedora status', { error: error?.message })

    return NextResponse.json(
      { error: 'Erro ao verificar status' },
      { status: 500 }
    )
  }
}

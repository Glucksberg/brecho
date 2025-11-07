import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { hash } from 'bcryptjs'
import { z } from 'zod'

/**
 * POST /api/portal-licencas/importar-dono
 *
 * Endpoint para receber dados do Portal de Licenças e criar conta DONO
 * Este endpoint é chamado pelo sistema externo de licenças
 *
 * IMPORTANTE: Este endpoint deve ter autenticação via API Key do portal de licenças
 */

const importDonoSchema = z.object({
  // Dados do brechó
  brecho: z.object({
    nome: z.string().min(1),
    slug: z.string().min(1),
    dominio: z.string().optional(),
    email: z.string().email().optional(),
    telefone: z.string().optional(),
    cor: z.string().default('#8B5CF6'),
    logo: z.string().optional()
  }),

  // Dados do dono
  dono: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8), // Já vem hasheado do portal?
    telefone: z.string().optional(),
    cpf: z.string().optional()
  }),

  // Metadados da licença
  licenca: z.object({
    id: z.string(),
    plano: z.string(),
    dataExpiracao: z.string().datetime().optional(),
    ativa: z.boolean().default(true)
  }).optional()
})

export async function POST(request: NextRequest) {
  try {
    // TODO: Validar API Key do portal de licenças
    const apiKey = request.headers.get('X-License-Portal-Key')

    if (!apiKey) {
      logger.warn('Missing API key from license portal')
      return NextResponse.json(
        { error: 'API Key obrigatória' },
        { status: 401 }
      )
    }

    // TODO: Validar API Key contra env var
    // if (apiKey !== process.env.LICENSE_PORTAL_API_KEY) {
    //   return NextResponse.json({ error: 'API Key inválida' }, { status: 401 })
    // }

    const body = await request.json()
    const data = importDonoSchema.parse(body)

    // Verificar se brechó já existe
    const brechoExistente = await prisma.brecho.findUnique({
      where: { slug: data.brecho.slug }
    })

    if (brechoExistente) {
      return NextResponse.json(
        { error: 'Brechó já existe', slug: data.brecho.slug },
        { status: 409 }
      )
    }

    // Verificar se email do dono já existe
    const donoExistente = await prisma.user.findUnique({
      where: { email: data.dono.email }
    })

    if (donoExistente) {
      return NextResponse.json(
        { error: 'Email já cadastrado', email: data.dono.email },
        { status: 409 }
      )
    }

    // Criar brechó e dono em transação
    const result = await prisma.$transaction(async (tx) => {
      // 1. Criar Brechó
      const brecho = await tx.brecho.create({
        data: {
          nome: data.brecho.nome,
          slug: data.brecho.slug,
          dominio: data.brecho.dominio,
          email: data.brecho.email,
          telefone: data.brecho.telefone,
          cor: data.brecho.cor,
          logo: data.brecho.logo,
          ativo: true
        }
      })

      // 2. Hash da senha se ainda não estiver
      // Assumindo que o portal envia senha em texto plano por segurança do canal
      const hashedPassword = await hash(data.dono.password, 10)

      // 3. Criar usuário DONO
      const dono = await tx.user.create({
        data: {
          name: data.dono.name,
          email: data.dono.email,
          password: hashedPassword,
          telefone: data.dono.telefone,
          cpf: data.dono.cpf,
          role: 'DONO',
          brechoId: brecho.id,
          ativo: true,
          comissao: 0,
          metaMensal: 0,
          permissoes: []
        }
      })

      return { brecho, dono }
    })

    logger.info('DONO imported from license portal', {
      brechoId: result.brecho.id,
      donoId: result.dono.id,
      email: result.dono.email,
      licencaId: data.licenca?.id
    })

    return NextResponse.json({
      success: true,
      message: 'Conta DONO criada com sucesso',
      brecho: {
        id: result.brecho.id,
        nome: result.brecho.nome,
        slug: result.brecho.slug
      },
      dono: {
        id: result.dono.id,
        name: result.dono.name,
        email: result.dono.email
      }
    }, { status: 201 })

  } catch (error: any) {
    logger.error('Error importing DONO from license portal', {
      error: error?.message,
      stack: error?.stack
    })

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao importar conta' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/portal-licencas/importar-dono
 *
 * Retorna documentação do endpoint
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    endpoint: 'POST /api/portal-licencas/importar-dono',
    description: 'Importa conta DONO do Portal de Licenças',
    authentication: 'Header: X-License-Portal-Key',
    requestBody: {
      brecho: {
        nome: 'string (required)',
        slug: 'string (required, unique)',
        dominio: 'string (optional)',
        email: 'string (optional)',
        telefone: 'string (optional)',
        cor: 'string (optional, default: #8B5CF6)',
        logo: 'string (optional)'
      },
      dono: {
        name: 'string (required)',
        email: 'string (required, unique)',
        password: 'string (required, min 8 chars)',
        telefone: 'string (optional)',
        cpf: 'string (optional)'
      },
      licenca: {
        id: 'string (optional)',
        plano: 'string (optional)',
        dataExpiracao: 'datetime (optional)',
        ativa: 'boolean (optional)'
      }
    },
    responses: {
      201: 'Conta criada com sucesso',
      400: 'Dados inválidos',
      401: 'API Key ausente ou inválida',
      409: 'Brechó ou email já existe',
      500: 'Erro interno'
    }
  })
}

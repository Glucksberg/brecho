import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const cadastroSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  confirmarSenha: z.string().min(8, 'Confirmação de senha deve ter no mínimo 8 caracteres'),
  telefone: z.string().min(10, 'Telefone inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
  endereco: z.object({
    cep: z.string(),
    rua: z.string(),
    numero: z.string(),
    complemento: z.string().optional(),
    bairro: z.string(),
    cidade: z.string(),
    estado: z.string().length(2, 'Estado deve ter 2 caracteres')
  })
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha']
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validated = cadastroSchema.parse(body)

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hash(validated.senha, 12)

    // Get first Brecho (multi-tenant support)
    const brecho = await prisma.brecho.findFirst()

    if (!brecho) {
      return NextResponse.json(
        { error: 'Sistema não configurado' },
        { status: 500 }
      )
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        brechoId: brecho.id,
        name: validated.nome,
        email: validated.email,
        password: passwordHash,
        telefone: validated.telefone,
        cpf: validated.cpf.replace(/\D/g, ''),
        role: 'CLIENTE',
        ativo: true,
        endereco: `${validated.endereco.rua}, ${validated.endereco.numero}${validated.endereco.complemento ? ', ' + validated.endereco.complemento : ''}, ${validated.endereco.bairro}, ${validated.endereco.cidade} - ${validated.endereco.estado}, CEP: ${validated.endereco.cep}`
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    return NextResponse.json({
      message: 'Usuário criado com sucesso',
      user
    })
  } catch (error: any) {
    // Sanitize error before logging (remove sensitive data)
    const sanitizedError = error.name === 'ZodError' ? {
      name: error.name,
      issues: error.errors?.map((e: any) => ({
        path: e.path,
        message: e.message,
        code: e.code
      }))
    } : {
      message: error.message,
      name: error.name
    }

    console.error('Erro ao criar usuário:', sanitizedError)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    )
  }
}

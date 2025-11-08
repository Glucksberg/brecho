import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { z } from 'zod'

const createBrechoSchema = z.object({
  nome: z.string().min(2),
  telefone: z.string().optional(),
  email: z.string().email().optional(),
  dominio: z.string().optional()
})

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const data = createBrechoSchema.parse(body)

    // Derivar username da sessão (portal:<username>) quando vindo do portal
    let username: string | undefined
    if (session.user.id?.startsWith('portal:')) {
      username = session.user.id.split(':', 2)[1]
    }

    // Se não conseguir derivar, tentar do token (via middleware) ou retornar erro
    if (!username) {
      return NextResponse.json({ error: 'Não foi possível identificar o usuário (username ausente).' }, { status: 400 })
    }

    // Se o usuário local já existir e tiver brechoId, retornar sucesso idempotente
    const existingUser = await prisma.user.findUnique({
      where: { username },
      include: { brecho: true }
    })
    if (existingUser?.brechoId && existingUser.brecho) {
      return NextResponse.json({
        success: true,
        data: {
          brecho: {
            id: existingUser.brecho.id,
            nome: existingUser.brecho.nome,
            slug: existingUser.brecho.slug
          }
        }
      })
    }

    // Gerar slug único
    let baseSlug = slugify(data.nome)
    if (!baseSlug) baseSlug = slugify(username)
    let slug = baseSlug
    let counter = 1
    // garantir unicidade
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const found = await prisma.brecho.findUnique({ where: { slug } })
      if (!found) break
      slug = `${baseSlug}-${counter++}`
    }

    // Garantir email único
    let email = data.email
    if (!email) {
      email = `${username}@${slug}.local`
    }
    // Se já existir, adicionar sufixo
    let emailCandidate = email
    counter = 1
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const found = await prisma.user.findUnique({ where: { email: emailCandidate } })
      if (!found) break
      const [local, ...domainParts] = email.split('@')
      const domain = domainParts.join('@') || 'local.local'
      emailCandidate = `${local}+${counter++}@${domain}`
    }
    email = emailCandidate

    const result = await prisma.$transaction(async (tx) => {
      // Criar brechó
      const brecho = await tx.brecho.create({
        data: {
          nome: data.nome,
          slug,
          dominio: data.dominio,
          telefone: data.telefone,
          email: data.email,
          ativo: true
        }
      })

      // Criar/atualizar usuário local vinculado ao brechó
      const user = await tx.user.upsert({
        where: { username },
        update: {
          name: session.user.nome || session.user.id || username,
          email,
          role: 'DONO',
          brechoId: brecho.id,
          ativo: true
        },
        create: {
          name: session.user.nome || username,
          username,
          email,
          role: 'DONO',
          brechoId: brecho.id,
          ativo: true,
          comissao: 0,
          metaMensal: 0,
          permissoes: []
        }
      })

      return { brecho, user }
    })

    return NextResponse.json({
      success: true,
      data: {
        brecho: {
          id: result.brecho.id,
          nome: result.brecho.nome,
          slug: result.brecho.slug
        }
      }
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Erro ao criar brechó'
    }, { status: 500 })
  }
}



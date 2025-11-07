import { PrismaClient, UserRole } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // 1. Criar Brechó Principal
  console.log('📦 Criando brechó...')
  const brecho = await prisma.brecho.upsert({
    where: { slug: 'retrocarolis' },
    update: {},
    create: {
      nome: 'Retrô Carólis',
      slug: 'retrocarolis',
      dominio: 'retrocarolis.com.br',
      ativo: true,
      logo: null,
      cor: '#8B5CF6',
      email: 'contato@retrocarolis.com.br',
      telefone: '(11) 99999-9999',
      endereco: {
        rua: 'Rua das Flores',
        numero: '123',
        complemento: 'Loja 1',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567'
      }
    }
  })
  console.log(`✅ Brechó criado: ${brecho.nome}`)

  // 2. Criar Usuários (todos os 5 níveis do RBAC)
  console.log('👤 Criando usuários (5 níveis RBAC)...')
  const hashedPassword = await bcrypt.hash('admin123', 10)

  // ADMIN - Super usuário, acesso total
  const admin = await prisma.user.upsert({
    where: { email: 'admin@retrocarolis.com.br' },
    update: {},
    create: {
      name: 'Administrador Sistema',
      email: 'admin@retrocarolis.com.br',
      password: hashedPassword,
      role: UserRole.ADMIN,
      brechoId: brecho.id,
      ativo: true,
      comissao: 0,
      metaMensal: 0,
      permissoes: []
    }
  })
  console.log(`✅ Admin criado: ${admin.email}`)

  // DONO - Proprietário do brechó
  const dono = await prisma.user.upsert({
    where: { email: 'dono@retrocarolis.com.br' },
    update: {},
    create: {
      name: 'Carolina Oliveira',
      email: 'dono@retrocarolis.com.br',
      password: hashedPassword,
      role: UserRole.DONO,
      brechoId: brecho.id,
      ativo: true,
      comissao: 0,
      metaMensal: 0,
      permissoes: []
    }
  })
  console.log(`✅ Dono criado: ${dono.email}`)

  // VENDEDOR - Funcionário
  const vendedor = await prisma.user.upsert({
    where: { email: 'vendedor@retrocarolis.com.br' },
    update: {},
    create: {
      name: 'Maria Silva',
      email: 'vendedor@retrocarolis.com.br',
      password: hashedPassword,
      role: UserRole.VENDEDOR,
      brechoId: brecho.id,
      ativo: true,
      comissao: 5,
      metaMensal: 10000,
      permissoes: []
    }
  })
  console.log(`✅ Vendedor criado: ${vendedor.email}`)

  // 3. Criar Fornecedoras
  console.log('👗 Criando fornecedoras...')
  const fornecedora1 = await prisma.fornecedora.create({
    data: {
      nome: 'Ana Paula Santos',
      cpf: '987.654.321-00',
      email: 'ana@email.com',
      telefone: '(11) 97777-7777',
      percentualRepasse: 60,
      ativo: true,
      brechoId: brecho.id,
      endereco: {
        rua: 'Rua das Rosas',
        numero: '456',
        bairro: 'Jardim das Flores',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-999'
      }
    }
  })

  const fornecedora2 = await prisma.fornecedora.create({
    data: {
      nome: 'Beatriz Costa',
      cpf: '111.222.333-44',
      email: 'beatriz@email.com',
      telefone: '(11) 96666-6666',
      percentualRepasse: 55,
      ativo: true,
      brechoId: brecho.id
    }
  })
  console.log(`✅ Fornecedoras criadas: ${fornecedora1.nome}, ${fornecedora2.nome}`)

  // FORNECEDOR - Usuário vinculado à fornecedora (acesso ao portal)
  const fornecedor = await prisma.user.upsert({
    where: { email: 'fornecedor@email.com' },
    update: {},
    create: {
      name: 'Ana Paula Santos',
      email: 'fornecedor@email.com',
      password: hashedPassword,
      role: UserRole.FORNECEDOR,
      brechoId: brecho.id,
      fornecedoraId: fornecedora1.id,
      ativo: true,
      comissao: 0,
      metaMensal: 0,
      permissoes: []
    }
  })
  console.log(`✅ Fornecedor criado: ${fornecedor.email} (vinculado à ${fornecedora1.nome})`)

  // 4. Criar Cliente
  console.log('👤 Criando cliente...')
  const clienteRecord = await prisma.cliente.upsert({
    where: {
      email_brechoId: {
        email: 'cliente@email.com',
        brechoId: brecho.id
      }
    },
    update: {},
    create: {
      nome: 'João Cliente',
      email: 'cliente@email.com',
      telefone: '(11) 98888-8888',
      cpf: '123.456.789-00',
      brechoId: brecho.id,
      ativo: true,
      totalCompras: 0,
      numeroCompras: 0
    }
  })
  console.log(`✅ Cliente criado: ${clienteRecord.nome}`)

  // CLIENTE - Usuário cliente (acesso à loja online)
  const clienteUser = await prisma.user.upsert({
    where: { email: 'cliente@email.com' },
    update: {},
    create: {
      name: 'João Cliente',
      email: 'cliente@email.com',
      password: hashedPassword,
      role: UserRole.CLIENTE,
      telefone: '(11) 98888-8888',
      cpf: '123.456.789-00',
      ativo: true,
      comissao: 0,
      metaMensal: 0,
      permissoes: []
    }
  })
  console.log(`✅ Usuário Cliente criado: ${clienteUser.email}`)

  // 6. Criar alguns Produtos
  console.log('👕 Criando produtos...')

  const produto1 = await prisma.produto.create({
    data: {
      nome: 'Vestido Floral Vintage',
      descricao: 'Lindo vestido floral vintage, tamanho M, em excelente estado',
      slug: 'vestido-floral-vintage',
      preco: 89.90,
      categoria: 'Vestidos',
      subcategoria: 'Vestidos Longos',
      marca: 'Vintage',
      tamanho: 'M',
      cor: 'Floral',
      condicao: 'SEMINOVO',
      genero: 'FEMININO',
      tipo: 'CONSIGNADO',
      fornecedoraId: fornecedora1.id,
      estoque: 1,
      vendido: false,
      ativo: true,
      destaque: true,
      brechoId: brecho.id,
      tags: ['vintage', 'floral', 'verão']
    }
  })

  const produto2 = await prisma.produto.create({
    data: {
      nome: 'Jaqueta Jeans Anos 90',
      descricao: 'Jaqueta jeans estilo anos 90, oversized, tamanho G',
      slug: 'jaqueta-jeans-anos-90',
      preco: 129.90,
      precoOriginal: 159.90,
      categoria: 'Jaquetas',
      marca: 'Levi\'s',
      tamanho: 'G',
      cor: 'Azul',
      condicao: 'USADO',
      genero: 'UNISSEX',
      tipo: 'PROPRIO',
      estoque: 1,
      vendido: false,
      ativo: true,
      destaque: true,
      brechoId: brecho.id,
      tags: ['jeans', 'anos 90', 'oversized']
    }
  })

  const produto3 = await prisma.produto.create({
    data: {
      nome: 'Bolsa de Couro Marrom',
      descricao: 'Bolsa de couro legítimo, cor marrom, com alça ajustável',
      slug: 'bolsa-couro-marrom',
      preco: 179.90,
      categoria: 'Acessórios',
      subcategoria: 'Bolsas',
      cor: 'Marrom',
      condicao: 'SEMINOVO',
      genero: 'FEMININO',
      tipo: 'CONSIGNADO',
      fornecedoraId: fornecedora2.id,
      estoque: 1,
      vendido: false,
      ativo: true,
      brechoId: brecho.id,
      tags: ['bolsa', 'couro', 'vintage']
    }
  })

  const produto4 = await prisma.produto.create({
    data: {
      nome: 'Camiseta Band The Beatles',
      descricao: 'Camiseta oficial The Beatles, tamanho M, nova',
      slug: 'camiseta-beatles',
      preco: 49.90,
      categoria: 'Camisetas',
      marca: 'Original',
      tamanho: 'M',
      cor: 'Preto',
      condicao: 'NOVO',
      genero: 'UNISSEX',
      tipo: 'PROPRIO',
      estoque: 3,
      vendido: false,
      ativo: true,
      brechoId: brecho.id,
      tags: ['camiseta', 'band', 'beatles']
    }
  })

  console.log(`✅ Produtos criados: ${produto1.nome}, ${produto2.nome}, ${produto3.nome}, ${produto4.nome}`)

  console.log('')
  console.log('✅ Seed concluído com sucesso!')
  console.log('')
  console.log('📝 Credenciais de acesso (todos os 5 níveis RBAC):')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')
  console.log('🔐 ADMIN (Super usuário, acesso total):')
  console.log('   Email: admin@retrocarolis.com.br')
  console.log('   Senha: admin123')
  console.log('   → Redireciona para: /dashboard')
  console.log('')
  console.log('🔐 DONO (Proprietário do brechó):')
  console.log('   Email: dono@retrocarolis.com.br')
  console.log('   Senha: admin123')
  console.log('   → Redireciona para: /dashboard')
  console.log('')
  console.log('🔐 VENDEDOR (Funcionário com comissão):')
  console.log('   Email: vendedor@retrocarolis.com.br')
  console.log('   Senha: admin123')
  console.log('   → Redireciona para: /dashboard')
  console.log('')
  console.log('🔐 FORNECEDOR (Acesso ao portal de fornecedoras):')
  console.log('   Email: fornecedor@email.com')
  console.log('   Senha: admin123')
  console.log('   → Redireciona para: /portal-fornecedora')
  console.log('')
  console.log('🔐 CLIENTE (Cliente da loja online):')
  console.log('   Email: cliente@email.com')
  console.log('   Senha: admin123')
  console.log('   → Redireciona para: /loja')
  console.log('')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

# Instruções de Migração do Banco de Dados

## Alterações no Schema Prisma

As seguintes alterações foram feitas no schema do Prisma e precisam ser aplicadas ao banco de dados:

### 1. Campos Adicionados ao Model User

Foram adicionados 3 novos campos opcionais ao model `User`:

```prisma
// Dados adicionais para clientes
telefone      String?
cpf           String?
endereco      String? // Endereço completo como string
```

### 2. Enum FormaPagamento Atualizado

O enum `FormaPagamento` foi estendido para incluir todos os métodos de pagamento:

```prisma
enum FormaPagamento {
  DINHEIRO
  CARTAO_CREDITO  // NOVO
  CARTAO_DEBITO   // NOVO
  CARTAO          // Genérico para compatibilidade
  PIX
  BOLETO          // NOVO
  TRANSFERENCIA
}
```

## Como Aplicar a Migração

### Passo 1: Configurar o Banco de Dados

Certifique-se de que o arquivo `.env.local` ou `.env` contém a variável `DATABASE_URL`:

```env
# Exemplo para PostgreSQL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/brecho_db?schema=public"

# Exemplo para MySQL
DATABASE_URL="mysql://usuario:senha@localhost:3306/brecho_db"
```

### Passo 2: Executar a Migração

Execute o seguinte comando no diretório do projeto:

```bash
cd retrocarolis-nextjs
npx prisma migrate dev --name add-user-fields-and-update-payment-enum
```

Este comando irá:
- Criar os arquivos de migração SQL
- Aplicar as alterações ao banco de dados
- Regenerar o Prisma Client com os novos tipos

### Passo 3: Verificar a Migração

Após executar a migração, verifique se tudo está correto:

```bash
# Ver o status das migrações
npx prisma migrate status

# Verificar o banco de dados no Prisma Studio
npx prisma studio
```

## Alternativa: Reset Completo (APENAS EM DESENVOLVIMENTO)

Se você estiver em ambiente de desenvolvimento e quiser resetar o banco completamente:

```bash
# ATENÇÃO: Isso apagará TODOS os dados!
npx prisma migrate reset
```

Este comando:
- Apaga o banco de dados
- Cria um novo banco
- Aplica todas as migrações
- Executa o seed (se configurado)

## Migrações em Produção

Para ambientes de produção, use:

```bash
npx prisma migrate deploy
```

Este comando aplica as migrações pendentes sem criar novas.

## Troubleshooting

### Erro: "Column already exists"

Se você já tinha adicionado esses campos manualmente:

```bash
# Marcar a migração como aplicada sem executar
npx prisma migrate resolve --applied add-user-fields-and-update-payment-enum
```

### Erro: "Enum value already exists"

Se os valores do enum já existem:

```bash
# Marcar a migração como aplicada
npx prisma migrate resolve --applied add-user-fields-and-update-payment-enum
```

### Verificar Schema Atual

Para ver o schema atual do banco:

```bash
npx prisma db pull
```

Isso irá atualizar seu `schema.prisma` com o estado real do banco de dados.

## Campos Adicionados - Detalhes

### `telefone` (String, opcional)
- Armazena o telefone do cliente
- Formato livre (máscaras aplicadas no frontend)
- Usado no cadastro e checkout

### `cpf` (String, opcional)
- Armazena o CPF do cliente (apenas números)
- Processado sem pontuação: "12345678900"
- Usado no cadastro e checkout
- **Nota**: Considerar adicionar `@unique` se necessário

### `endereco` (String, opcional)
- Armazena o endereço completo formatado
- Formato: "Rua, Número, Complemento, Bairro, Cidade - UF, CEP: 00000-000"
- Usado no cadastro

## Próximos Passos Recomendados

Após aplicar a migração, considere:

1. **Adicionar índices** para campos frequentemente consultados:
   ```prisma
   @@index([cpf])
   @@index([telefone])
   ```

2. **Normalizar endereço**: Considerar criar um model separado `Endereco` para normalização.

3. **Validações no banco**: Adicionar constraints adicionais se necessário.

## Suporte

Se encontrar problemas durante a migração, consulte:
- [Documentação Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- Logs de erro em `prisma/migrations/`
- Arquivo `BUGS_ENCONTRADOS.md` para outros problemas conhecidos

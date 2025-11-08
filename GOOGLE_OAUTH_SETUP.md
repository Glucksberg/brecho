# Configuração de Autenticação - Google OAuth

## Variáveis de Ambiente Necessárias

Para habilitar o login com Google, adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# Google OAuth
GOOGLE_CLIENT_ID="seu-client-id-aqui"
GOOGLE_CLIENT_SECRET="seu-client-secret-aqui"

# NextAuth (já deve existir)
NEXTAUTH_URL="https://retrocarolis.com"
NEXTAUTH_SECRET="seu-secret-aqui"
```

## Como Obter as Credenciais do Google

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá em **APIs & Services** > **Credentials**
4. Clique em **Create Credentials** > **OAuth client ID**
5. Configure:
   - **Application type**: Web application
   - **Name**: Retrô Carólis (ou o nome que preferir)
   - **Authorized JavaScript origins**: 
     - `https://retrocarolis.com`
     - `http://localhost:3000` (para desenvolvimento)
   - **Authorized redirect URIs**:
     - `https://retrocarolis.com/api/auth/callback/google`
     - `http://localhost:3000/api/auth/callback/google` (para desenvolvimento)
6. Copie o **Client ID** e **Client Secret** para o arquivo `.env`

## ⚠️ Configuração de Produção no Google Cloud Console

### Status de Verificação do OAuth

Quando você cria as credenciais OAuth no Google Cloud Console, elas começam em **modo de teste**. Isso significa:

- ✅ Funciona para contas de teste (que você adiciona manualmente)
- ❌ **NÃO funciona para usuários gerais** até você publicar

### Como Publicar para Produção

1. **Acesse o Google Cloud Console**
   - Vá em **APIs & Services** > **OAuth consent screen**

2. **Verifique o Status**
   - Se estiver como "Testing", você precisa publicar

3. **Publicar o App**
   - Clique em **PUBLISH APP** (ou "Publicar aplicativo")
   - Confirme a publicação
   - ⚠️ **Atenção**: Isso torna o app disponível para qualquer usuário do Google

4. **Verificação (Opcional mas Recomendado)**
   - Para apps que precisam de verificação do Google:
     - Preencha todas as informações do OAuth consent screen
     - Adicione políticas de privacidade e termos de serviço
     - Submeta para verificação do Google
   - Para apps internos/privados:
     - Se você não precisa de verificação, pode usar em modo "Testing" com usuários específicos

### Modo de Teste vs Produção

**Modo de Teste (Testing)**:
- ✅ Funciona imediatamente
- ✅ Apenas para contas de teste (máximo 100 usuários)
- ✅ Não precisa de verificação do Google
- ❌ Usuários precisam ser adicionados manualmente como "test users"

**Modo de Produção (Published)**:
- ✅ Funciona para qualquer usuário do Google
- ✅ Não precisa adicionar usuários manualmente
- ⚠️ Pode precisar de verificação do Google (dependendo do escopo)
- ⚠️ Processo de verificação pode levar alguns dias

### Recomendação

Para começar rapidamente:
1. Use **modo de teste** inicialmente
2. Adicione alguns usuários de teste
3. Teste o fluxo completo
4. Quando estiver pronto, publique para produção

## Reiniciar o Servidor Após Configuração

Após adicionar as variáveis de ambiente no `.env`, você **DEVE reiniciar o servidor**:

```bash
# Se estiver usando PM2 (produção)
pm2 restart retrocarolis-app

# Se estiver usando npm run dev (desenvolvimento)
# Pare o servidor (Ctrl+C) e inicie novamente:
npm run dev
```

**Por quê?**
- Next.js carrega variáveis de ambiente apenas na inicialização
- Mudanças no `.env` não são detectadas automaticamente
- Reiniciar garante que as novas variáveis sejam carregadas

## Funcionalidades Implementadas

✅ **Google OAuth Provider** - Login com Google configurado
✅ **Página de Login/Cadastro** - `/loja/login` com opção de Google e email/senha
✅ **Página de Conta** - `/loja/conta` usando dados reais da sessão
✅ **Logout Funcional** - Logout implementado corretamente
✅ **LojaLayout Atualizado** - Mostra login/logout baseado na sessão
✅ **Middleware Atualizado** - Rotas públicas da loja permitidas

## Fluxo de Autenticação

### Login com Google
1. Usuário clica em "Continuar com Google"
2. Redireciona para Google OAuth
3. Usuário autoriza
4. Google retorna para `/api/auth/callback/google`
5. NextAuth cria/atualiza usuário no banco como `CLIENTE`
6. Redireciona para `/loja`

### Login com Email/Senha
1. Usuário preenche email e senha
2. Sistema valida no banco de dados
3. Se válido, cria sessão
4. Redireciona para `/loja`

### Cadastro
1. Usuário preenche formulário de cadastro
2. Sistema cria usuário como `CLIENTE` no banco
3. Faz login automaticamente
4. Redireciona para `/loja`

## Estrutura do Banco de Dados

O sistema já possui toda a estrutura necessária:
- ✅ Model `User` com role `CLIENTE`
- ✅ Model `Account` para OAuth providers
- ✅ Model `Cliente` separado (pode ser vinculado ao User)
- ✅ NextAuth com PrismaAdapter configurado

## Notas Importantes

- O Google OAuth só funcionará se as variáveis de ambiente estiverem configuradas
- **Sempre reinicie o servidor** após alterar variáveis de ambiente
- Usuários criados via Google OAuth são automaticamente criados como `CLIENTE`
- O sistema permite vincular contas com mesmo email (via `allowDangerousEmailAccountLinking`)
- Em modo de teste, adicione usuários de teste no Google Cloud Console
- Para produção, publique o app no OAuth consent screen

## Troubleshooting

### Erro: "redirect_uri_mismatch"
- Verifique se a URL de callback está correta no Google Cloud Console
- Deve ser exatamente: `https://retrocarolis.com/api/auth/callback/google`

### Erro: "access_denied"
- Verifique se o app está publicado (modo produção) ou se o usuário está na lista de test users (modo teste)

### Botão do Google não aparece
- Verifique se `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estão no `.env`
- Reinicie o servidor após adicionar as variáveis



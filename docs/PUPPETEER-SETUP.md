# Setup de Automação com Puppeteer

## Status
⏸️ **Aguardando informações do usuário**

## Objetivo
Usar Puppeteer para fazer login automatizado em um site e mapear todas as funcionalidades disponíveis na área logada.

---

## Informações Necessárias

### 1. URL do Site
**Pergunta**: Qual é a URL do site que você quer explorar?

**Resposta**: _[PENDENTE]_

---

### 2. Credenciais de Login

**Email/Usuário**: _[PENDENTE]_

**Senha**: _[PENDENTE]_

---

### 3. Detalhes do Formulário de Login

**URL da página de login**: _[PENDENTE]_
- Exemplos: `/login`, `/signin`, `/auth/login`
- Ou o login é na página inicial?

**Seletores do formulário** (se souber):
- Campo de email/usuário: _[PENDENTE]_
- Campo de senha: _[PENDENTE]_
- Botão de submit: _[PENDENTE]_

---

### 4. O Que Mapear?

Marque com [x] o que você quer documentar:

- [ ] Todas as páginas e rotas disponíveis
- [ ] Funcionalidades de cada seção
- [ ] Screenshots de cada página
- [ ] Estrutura de navegação/menu
- [ ] APIs e endpoints (através do Network tab)
- [ ] Formulários e campos disponíveis
- [ ] Fluxos de usuário completos
- [ ] Outros: _[especifique]_

---

## Próximos Passos

Quando as informações acima forem preenchidas:

1. ✅ Verificar se Puppeteer está instalado (Status: **NÃO instalado**)
2. ⏳ Instalar Puppeteer: `npm install puppeteer`
3. ⏳ Criar script de automação (`/scripts/puppeteer-explorer.js`)
4. ⏳ Executar navegação automatizada
5. ⏳ Gerar documentação completa com:
   - Lista de todas as rotas/páginas
   - Screenshots organizados
   - Descrição das funcionalidades
   - Estrutura de navegação
   - Relatório final em Markdown

---

## Notas de Segurança

- ⚠️ **As credenciais não devem ser commitadas no repositório**
- Opção 1: Usar variáveis de ambiente (`.env` no `.gitignore`)
- Opção 2: Passar credenciais como argumentos ao executar o script
- Opção 3: Criar arquivo `credentials.json` local (adicionar ao `.gitignore`)

---

## Estrutura de Saída Proposta

```
/docs/
  /site-analysis/
    /screenshots/
      - home.png
      - dashboard.png
      - products.png
      - ...
    - rotas.md
    - funcionalidades.md
    - navegacao.md
    - relatorio-completo.md
```

---

**Data de criação**: 28 de outubro de 2025
**Status**: Aguardando informações para continuar

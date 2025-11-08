# Otimização de Performance (Next.js + Retrô Carólis)

Este guia resume práticas para reduzir o delay da primeira navegação e melhorar a fluidez do app em produção.

## Entendendo o “delay” da primeira navegação
- Desenvolvimento: a primeira navegação compila as rotas (JIT) e hidrata o bundle; as seguintes usam cache do Next Router e do navegador.
- Produção: páginas já vêm pré-compiladas/minificadas e o Next faz prefetch em links visíveis. Ainda assim, o primeiro acesso baixa assets e abre conexões (API/DB), então há um custo inicial menor que no dev.

## Checklist de Produção
- Build e start:
  - `npm run build` e `npm start`
- Infra/HTTP:
  - Ative compressão (gzip/br), HTTP/2/HTTP/3
  - Coloque CDN (Vercel/Cloudflare/Nginx proxy) para estáticos
- Cache:
  - Habilite cache estático no CDN para `_next/static`, imagens e fontes
  - Defina políticas de cache em APIs quando possível (revalidação, SWR)

## Técnicas do Next.js
- Prefetch automático:
  - Mantenha `next/link` com prefetch padrão para carregar rotas antecipadamente.
- Code-splitting:
  - `dynamic(() => import('...'), { ssr: false })` para componentes pesados que não precisam do SSR.
  - Evite carregar gráficos/editors na home; carregue sob demanda.
- Server Components/SSR:
  - Use Server Components para reduzir bundle no cliente quando viável.
  - Evite trazer dados pesados ao client sem necessidade.

## Imagens e Fontes
- Imagens:
  - Use `next/image` com tamanhos/`sizes` corretos, formatos modernos (WebP/AVIF) e lazy-load.
  - Prefetch de imagens críticas (acima da dobra) se necessário.
- Fontes:
  - Use `next/font` (Google/local) para reduzir FOUT/FOIT.
  - Limite variantes/pesos para diminuir o payload.

## Rede e CDN
- Preconnect/Prefetch:
  - `<link rel="preconnect" href="https://seu-dominio-estatico">`
  - `<link rel="dns-prefetch" href="https://seu-dominio-estatico">`
- HTTP Caching:
  - Cabeçalhos adequados em assets estáticos (Cache-Control: immutable, long TTL)
  - Revalidação para conteúdo que muda (ETag/Last-Modified)

## Dados e APIs
- Cache no cliente:
  - Use SWR/React Query para cache, revalidação e deduplicação.
  - Configure `stale-while-revalidate` para UX responsiva.
- Cache no servidor:
  - Para endpoints que não mudam a cada request, use revalidação programada (ISR) ou caching na camada de API.
- Evite N+1:
  - Prefira agregações/joins no servidor (Prisma aggregate) e retorne o formato final necessário.

## Build e Bundle
- Reduza bundle inicial:
  - Remova imports não utilizados; faça split de libs pesadas (charting, rich text) com `dynamic`.
  - Evite pollyfills e dependências desnecessárias.
- Análise:
  - Use `next build` com análise de bundle (plugins/bundle analyzer) para identificar gargalos.

## Observabilidade
- Monitoramento do front:
  - Meça TTFB/FP/LCP/CLS com Web Vitals.
  - Habilite logs de erro e tracing em produção.
- Monitoramento do back:
  - Métricas de queries do Prisma e latência das APIs.

## Ações rápidas (prioridade)
1) Rodar em produção: `npm run build && npm start`.
2) Garantir compressão (gzip/br) e HTTP/2/3 no proxy/CDN.
3) `next/image` e `next/font` nas páginas com mídia/peso.
4) Dynamic imports para componentes pesados.
5) SWR/React Query para cache de dados com revalidação.
6) Cabeçalhos de cache corretos em assets e APIs.

Com isso, o first-load reduz bastante e as próximas navegações permanecem instantâneas graças ao prefetch e cache.



# Logbook Frontend

Frontend do sistema Logbook, desenvolvido com Nuxt 4 para consumir uma API REST de registros.

Nuxt 4 frontend for the Logbook system, built to consume a REST API for log entries.

## Portuguese

### Sobre

Este projeto foi construído para servir como a interface do Logbook, permitindo criar, listar, buscar e excluir registros.

A aplicação roda hoje como frontend estático/client-side:

- Nuxt 4
- Vue 3
- `nitro.preset = "static"`
- integração com API via `fetch`
- configuração pública com `runtimeConfig.public`

### Funcionalidades

- criação de registros com título, conteúdo e tags
- listagem paginada
- busca por título, conteúdo ou tags
- exclusão com confirmação
- feedback visual para sucesso, erro e rate limit
- suporte a português e inglês

### Arquitetura

Estrutura principal:

- `pages/index.vue`: tela principal e fluxo da interface
- `services/logsApi.js`: camada de acesso à API
- `utils/apiRoutes.js`: centralização das rotas
- `utils/tags.js`: parse de tags
- `utils/alerts.js`: alerts com SweetAlert2
- `utils/elapsedTime.js`: tempo relativo
- `utils/translations.js`: textos PT/EN

Práticas aplicadas:

- separação entre UI e integração HTTP
- rotas centralizadas
- utilitários reutilizáveis
- tratamento de erro com `ApiError`
- regras simples extraídas da view para facilitar manutenção e teste

### Ambiente

Crie um arquivo `.env` com:

```env
NUXT_PUBLIC_API_BASE=http://localhost:4010
NUXT_PUBLIC_WRITE_TOKEN=seu_token_de_escrita
```

Mapeamento:

- `NUXT_PUBLIC_API_BASE` -> `runtimeConfig.public.apiBase`
- `NUXT_PUBLIC_WRITE_TOKEN` -> `runtimeConfig.public.writeToken`

Observações:

- `GET /logs/getList` não precisa token
- `POST` e `DELETE` exigem o header `x-write-token`
- como o token está em `public`, ele fica exposto no navegador; isso funciona para este projeto, mas não é o modelo ideal para cenários sensíveis de produção

### Execução Local

Instalar dependências:

```bash
npm install
```

Rodar em desenvolvimento:

```bash
npm run dev
```

Gerar build estático:

```bash
npm run generate
```

Visualizar build localmente:

```bash
npm run preview
```

### Deploy

Como o projeto é estático, mudanças em variáveis públicas exigem novo build.

Fluxo recomendado:

1. atualizar `.env`
2. rodar `npm run generate`
3. publicar os arquivos gerados
4. fazer refresh completo no navegador

### Testes

O projeto possui teste básico para regra isolada em:

- `test/elapsedTime.test.js`

### Stack

- Nuxt 4
- Vue 3
- SweetAlert2
- `@nuxt/icon`
- `@nuxtjs/google-fonts`

## English

### About

This project is the frontend for the Logbook system, built to create, list, search, and delete log entries through a REST API.

The app currently runs as a static/client-side frontend:

- Nuxt 4
- Vue 3
- `nitro.preset = "static"`
- API integration through `fetch`
- public configuration via `runtimeConfig.public`

### Features

- create entries with title, content, and tags
- paginated listing
- search by title, content, or tags
- delete with confirmation
- visual feedback for success, error, and rate limiting
- Portuguese and English UI support

### Architecture

Main structure:

- `pages/index.vue`: main screen and UI flow
- `services/logsApi.js`: API access layer
- `utils/apiRoutes.js`: centralized routes
- `utils/tags.js`: tag parsing
- `utils/alerts.js`: SweetAlert2 helpers
- `utils/elapsedTime.js`: relative time formatting
- `utils/translations.js`: PT/EN texts

Practices applied:

- separation between UI and HTTP integration
- centralized routes
- reusable utilities
- error handling with `ApiError`
- simple rules extracted from the view layer for easier maintenance and testing

### Environment

Create a `.env` file with:

```env
NUXT_PUBLIC_API_BASE=http://localhost:4010
NUXT_PUBLIC_WRITE_TOKEN=your_write_token
```

Mapping:

- `NUXT_PUBLIC_API_BASE` -> `runtimeConfig.public.apiBase`
- `NUXT_PUBLIC_WRITE_TOKEN` -> `runtimeConfig.public.writeToken`

Notes:

- `GET /logs/getList` does not require a token
- `POST` and `DELETE` require the `x-write-token` header
- since the token lives in `public`, it is exposed to the browser; acceptable for this project, but not ideal for sensitive production scenarios

### Local Run

Install dependencies:

```bash
npm install
```

Run in development:

```bash
npm run dev
```

Generate the static build:

```bash
npm run generate
```

Preview the generated build locally:

```bash
npm run preview
```

### Deployment

Because the project is static, changes to public environment variables require a new build.

Recommended flow:

1. update `.env`
2. run `npm run generate`
3. publish the generated files
4. hard refresh the browser

### Tests

The project includes a basic isolated-rule test in:

- `test/elapsedTime.test.js`

### Stack

- Nuxt 4
- Vue 3
- SweetAlert2
- `@nuxt/icon`
- `@nuxtjs/google-fonts`

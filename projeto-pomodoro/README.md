# Chronos Pomodoro + API

Monorepo com frontend React (`chronos-pomodoro`) e API Express (`chronos-api`)
para persistir settings e histórico de tasks em MySQL.

## Estrutura de pastas

- `chronos-pomodoro`: frontend React + TypeScript + Vite
- `chronos-api`: backend Express + Prisma + MySQL

## Pré-requisitos

- Node.js 20+
- MySQL 8+

## 1) Subindo a API (`chronos-api`)

### Configurar ambiente

```bash
cd chronos-api
cp .env.example .env
```

Edite `DATABASE_URL` no `.env` para seu MySQL local.

### Instalar dependências

```bash
npm install
```

### Criar banco/tabelas via Prisma

```bash
npm run prisma:migrate -- --name init
```

### Iniciar API

```bash
npm run dev
```

API disponível em `http://localhost:3333`  
Health check: `GET http://localhost:3333/health`

## 2) Subindo o frontend (`chronos-pomodoro`)

```bash
cd chronos-pomodoro
npm install
npm run dev
```

Frontend em `http://localhost:5173`

> Opcional: defina `VITE_API_URL` no frontend (senão usa `http://localhost:3333` por padrão).

## Endpoints implementados

### Settings

- `GET /settings`
- `PUT /settings`

### Tasks

- `GET /tasks`
- `POST /tasks`
- `PATCH /tasks/:id/complete`
- `PATCH /tasks/:id/interrupt`
- `DELETE /tasks`

## Esqueleto mínimo da API (Express + Prisma + MySQL)

A API foi organizada com:

- `src/app.ts`
- `src/server.ts`
- `src/lib/prisma.ts`
- `src/routes/settings.routes.ts`
- `src/routes/tasks.routes.ts`
- `prisma/schema.prisma`

## Instruções guiadas aplicadas no projeto

### Encontro 1 - API e banco no ar

- Estrutura Express criada em `chronos-api`.
- Prisma configurado com modelos `Settings` e `Task`.
- Endpoints iniciais e health check adicionados.

### Encontro 2 - Configurações integradas

- Tela `Settings` do frontend salva dados via `PUT /settings`.
- Carregamento inicial de settings vem da API no provider.

### Encontro 3 - Tasks e histórico integrados

- Criação de task no `MainForm` envia para `POST /tasks`.
- Interrupção de task envia para `PATCH /tasks/:id/interrupt`.
- Conclusão automática sincroniza em `PATCH /tasks/:id/complete`.
- Hydration inicial de tasks via `GET /tasks`.

### Encontro 4 - Limpeza de histórico e robustez

- Botão de limpar histórico chama `DELETE /tasks`.
- Estado local limpa com action `CLEAR_TASKS` sem resetar config.
- Fallback local mantido se API indisponível (mensagens de erro amigáveis).


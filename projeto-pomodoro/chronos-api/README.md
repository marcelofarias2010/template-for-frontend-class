# Chronos API (Express + Prisma + MySQL)

Este documento descreve, em formato de instrução guiada, todo o processo de:

1. Criação da `chronos-api` (backend Express),
2. Configuração do banco MySQL com Prisma,
3. Integração com o frontend `chronos-pomodoro`,
4. Testes dos endpoints no Postman.

---

## 1) Objetivo da API

A `chronos-api` foi criada para persistir dados do projeto Pomodoro que antes ficavam apenas no frontend/localStorage:

- Configurações do timer (`settings`)
- Histórico de tarefas (`tasks`)

Com isso, o frontend passa a ter integração real com banco de dados MySQL.

---

## 2) Stack adotada

- Node.js + TypeScript
- Express
- Prisma ORM
- MySQL

---

## 3) Estrutura da `chronos-api`

```txt
chronos-api/
  prisma/
    schema.prisma
  src/
    lib/
      prisma.ts
    routes/
      settings.routes.ts
      tasks.routes.ts
    app.ts
    server.ts
  .env
  .env.example
  package.json
  tsconfig.json
```

---

## 4) Configuração de ambiente

### 4.1 Arquivo `.env`

Exemplo funcional:

```env
DATABASE_URL="mysql://root:SenhaDoSeuServidor@localhost:3306/pomodoro_db"
PORT=3333
```

### 4.2 Banco local

Banco utilizado:

- `pomodoro_db`

Se não existir, crie no MySQL local:

```sql
CREATE DATABASE IF NOT EXISTS pomodoro_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

---

## 5) Prisma: schema e migration

### 5.1 Modelos

O `schema.prisma` contém dois modelos:

- `Settings` (configuração global da aplicação)
- `Task` (histórico de tarefas)

### 5.2 Rodar migration

```bash
npm run prisma:migrate -- --name init
```

### 5.3 Gerar client (caso necessário)

```bash
npm run prisma:generate
```

---

## 6) Subir a API

```bash
npm install
npm run dev
```

Servidor:

- `http://localhost:3333`

Health check:

- `GET http://localhost:3333/health`

---

## 7) Endpoints implementados

## 7.1 Health

- `GET /health`

Retorno:

```json
{ "ok": true }
```

## 7.2 Settings

- `GET /settings`
  - Busca configurações atuais
  - Cria automaticamente defaults se ainda não existir registro
- `PUT /settings`
  - Atualiza `workTime`, `shortBreakTime`, `longBreakTime`
  - Valida payload numérico inteiro

## 7.3 Tasks

- `GET /tasks`
  - Lista tarefas ordenadas por `startDate desc`
- `POST /tasks`
  - Cria nova tarefa
- `PATCH /tasks/:id/complete`
  - Marca tarefa como concluída
- `PATCH /tasks/:id/interrupt`
  - Marca tarefa como interrompida
- `DELETE /tasks`
  - Limpa histórico

### Observação técnica importante

Os campos de data são `BigInt` no MySQL.  
Na resposta HTTP eles são serializados para `string`, evitando erro de `JSON.stringify` com BigInt.

---

## 8) Alterações aplicadas no frontend (`chronos-pomodoro`)

Para integrar com a API, os seguintes pontos foram modificados:

## 8.1 Novo serviço HTTP

Arquivo criado:

- `src/services/api.ts`

Funções principais:

- `getSettings`
- `updateSettings`
- `getTasks`
- `createTask`
- `completeTask`
- `interruptTask`
- `clearTasks`

## 8.2 Settings integrado com API

Arquivo:

- `src/pages/Settings/index.tsx`

Mudança:

- Submit agora chama `updateSettings(...)` na API.
- Em sucesso: mantém atualização no estado global.
- Em falha: mostra mensagem de erro.

## 8.3 MainForm integrado com API

Arquivo:

- `src/components/MainForm/index.tsx`

Mudança:

- Criação de task chama `POST /tasks`.
- Interrupção de task chama `PATCH /tasks/:id/interrupt`.

## 8.4 History integrado com API

Arquivo:

- `src/pages/History/index.tsx`

Mudança:

- Limpar histórico chama `DELETE /tasks`.
- Estado local é limpo com action `CLEAR_TASKS`.

## 8.5 Provider com hidratação inicial e sincronização

Arquivo:

- `src/contexts/TaskContext/TaskContextProvider.tsx`

Mudança:

- Na inicialização: busca `settings` e `tasks` da API.
- Sincroniza conclusão de tarefas com `PATCH /tasks/:id/complete`.
- Mantém fallback local se API indisponível.

## 8.6 Novas actions no estado global

Arquivos:

- `src/contexts/TaskContext/taskActions.ts`
- `src/contexts/TaskContext/taskReducer.ts`

Actions adicionadas:

- `CLEAR_TASKS`
- `HYDRATE_TASKS`

---

## 9) Variável do frontend para URL da API

Arquivo:

- `chronos-pomodoro/.env.example`

Conteúdo:

```env
VITE_API_URL=http://localhost:3333
```

Se não definir `VITE_API_URL`, o frontend usa fallback para `http://localhost:3333`.

---

## 10) Roteiro de testes no Postman

Crie um Environment chamado `Chronos Local`:

- `baseUrl = http://localhost:3333`
- `taskId =` (vazio inicialmente)

## Ordem de testes

1. `GET {{baseUrl}}/health`
2. `GET {{baseUrl}}/settings`
3. `PUT {{baseUrl}}/settings`
4. `POST {{baseUrl}}/tasks`
5. `PATCH {{baseUrl}}/tasks/{{taskId}}/complete`
6. `GET {{baseUrl}}/tasks`
7. `DELETE {{baseUrl}}/tasks`
8. `GET {{baseUrl}}/tasks` (confirmar vazio)

## Payloads sugeridos

### PUT /settings

```json
{
  "workTime": 30,
  "shortBreakTime": 10,
  "longBreakTime": 20
}
```

### POST /tasks

```json
{
  "id": "{{$timestamp}}",
  "name": "Task via Postman",
  "duration": 30,
  "type": "workTime",
  "startDate": {{$timestamp}}
}
```

### PATCH /tasks/:id/complete

```json
{
  "completeDate": {{$timestamp}}
}
```

### PATCH /tasks/:id/interrupt (alternativo)

```json
{
  "interruptDate": {{$timestamp}}
}
```

## Script de teste no Postman para salvar `taskId`

Na request de `POST /tasks`, aba **Tests**:

```javascript
const json = pm.response.json();
pm.environment.set("taskId", json.id);
```

---

## 11) Troubleshooting

## Prisma P1000 (credencial inválida)

Erro:

`Authentication failed against database server`

Ação:

- Revisar `DATABASE_URL` no `.env`
- Confirmar usuário/senha do MySQL

## Porta ocupada (EADDRINUSE)

Erro:

`listen EADDRINUSE :::3333`

Ação:

- Fechar processo anterior da API
- Ou trocar `PORT` no `.env`

## Falha ao serializar BigInt

Erro:

`Do not know how to serialize a BigInt`

Ação:

- Garantir serialização para `string` nos retornos de `Task`.

---

## 12) Comandos úteis

```bash
# API
npm run dev
npm run build

# Prisma
npm run prisma:migrate -- --name init
npm run prisma:generate
npm run prisma:studio
```

---

## 13) Status atual

Checklist de conclusão:

- [x] API Express criada
- [x] Prisma + MySQL configurados
- [x] Migration aplicada
- [x] Endpoints de settings/tasks funcionando
- [x] Frontend integrado com API
- [x] Roteiro Postman documentado

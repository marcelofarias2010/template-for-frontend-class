# Persistindo configurações no estado global (Context + Reducer)

## Objetivo

Concluir o fluxo da página de configurações para que, após validar o formulário, os novos tempos sejam salvos no estado global da aplicação usando `dispatch`, `taskActions` e `taskReducer`.

## Como esta prática foi definida

Esta instrução foi composta com base nos arquivos modificados da branch:

- `src/pages/Settings/index.tsx`
- `src/contexts/TaskContext/taskActions.ts`
- `src/contexts/TaskContext/taskReducer.ts`

Com isso, o foco da prática é:

1. criar a action `CHANGE_SETTINGS`;
2. tipar corretamente o payload da action;
3. tratar a action no reducer;
4. disparar o `dispatch` no submit da página `Settings` após validações;
5. exibir feedback de sucesso.

## Requisitos da implementação

1. Adicionar em `TaskActionTypes` a action `CHANGE_SETTINGS`.
2. Definir `payload` dessa action com o tipo `TaskStateModel['config']`.
3. Tratar `CHANGE_SETTINGS` no `taskReducer`, atualizando `state.config`.
4. Na página `Settings`, usar `dispatch` vindo de `useTaskContext`.
5. Depois de passar pelas validações:
   - disparar `dispatch({ type: TaskActionTypes.CHANGE_SETTINGS, payload: { ... } })`;
   - exibir `showMessage.success('Configurações salvas')`.
6. Manter os `defaultValue` dos inputs vinculados a `state.config`.

## Resultado esperado

- Ao enviar valores válidos no formulário de configurações:
  - o estado global é atualizado;
  - uma mensagem de sucesso é exibida.
- Ao enviar valores inválidos:
  - erros são exibidos;
  - nenhuma alteração é aplicada no estado global.

---

## Código-fonte dos arquivos modificados nesta branch

### `src/pages/Settings/index.tsx`

```tsx
import { SaveIcon } from 'lucide-react';
import { Container } from '../../components/Container';
import { DefaultButton } from '../../components/DefaultButton';
import { DefaultInput } from '../../components/DefaultInput';
import { Heading } from '../../components/Heading';
import { MainTemplate } from '../../templates/MainTemplate';
import { useTaskContext } from '../../contexts/TaskContext';
import { useRef } from 'react';
import { showMessage } from '../../adapters/showMessage';
import { TaskActionTypes } from '../../contexts/TaskContext/taskActions';

export function Settings() {
  const { state, dispatch } = useTaskContext();
  const workTimeInput = useRef<HTMLInputElement>(null);
  const shortBreakTimeInput = useRef<HTMLInputElement>(null);
  const longBreakTimeInput = useRef<HTMLInputElement>(null);

  function handleSaveSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    showMessage.dismiss();

    const formErrors = [];

    const workTime = Number(workTimeInput.current?.value);
    const shortBreakTime = Number(shortBreakTimeInput.current?.value);
    const longBreakTime = Number(longBreakTimeInput.current?.value);

    if (isNaN(workTime) || isNaN(shortBreakTime) || isNaN(longBreakTime)) {
      formErrors.push('Digite apenas números para TODOS os campos');
    }

    if (workTime < 1 || workTime > 99) {
      formErrors.push('Digite valores entre 1 e 99 para foco');
    }

    if (shortBreakTime < 1 || shortBreakTime > 30) {
      formErrors.push('Digite valores entre 1 e 30 para descanso curto');
    }

    if (longBreakTime < 1 || longBreakTime > 60) {
      formErrors.push('Digite valores entre 1 e 60 para descanso longo');
    }

    if (formErrors.length > 0) {
      formErrors.forEach(error => {
        showMessage.error(error);
      });
      return;
    }

    dispatch({
      type: TaskActionTypes.CHANGE_SETTINGS,
      payload: {
        workTime,
        shortBreakTime,
        longBreakTime,
      },
    });
    showMessage.success('Configurações salvas');
  }

  return (
    <MainTemplate>
      <Container>
        <Heading>Configurações</Heading>
      </Container>

      <Container>
        <p style={{ textAlign: 'center' }}>
          Modifique as configurações para tempo de foco, descanso curso e
          descanso longo.
        </p>
      </Container>

      <Container>
        <form onSubmit={handleSaveSettings} action='' className='form'>
          <div className='formRow'>
            <DefaultInput
              id='workTime'
              labelText='Foco'
              ref={workTimeInput}
              defaultValue={state.config.workTime}
              type='number'
            />
          </div>
          <div className='formRow'>
            <DefaultInput
              id='shortBreakTime'
              labelText='Descanso curto'
              ref={shortBreakTimeInput}
              defaultValue={state.config.shortBreakTime}
              type='number'
            />
          </div>
          <div className='formRow'>
            <DefaultInput
              id='longBreakTime'
              labelText='Descanso longo'
              ref={longBreakTimeInput}
              defaultValue={state.config.longBreakTime}
              type='number'
            />
          </div>
          <div className='formRow'>
            <DefaultButton
              icon={<SaveIcon />}
              aria-label='Salvar configurações'
              title='Salvar configurações'
            />
          </div>
        </form>
      </Container>
    </MainTemplate>
  );
}
```

### `src/contexts/TaskContext/taskActions.ts`

```ts
// useReducer <- hook do React que recebe um reducer e um estado inicial
// reducer <- função que recebe o estado atual e uma ação, e retorna o novo estado
// state <- o estado atual
// action <- a ação disparada, geralmente é um objeto com type e (opcionalmente) payload
// type <- o tipo da ação, geralmente uma string (pode ser enum, constante, etc)
// payload <- os dados extras enviados junto com a action, se necessário para atualizar o estado

import type { TaskModel } from '../../models/TaskModel';
import type { TaskStateModel } from '../../models/TaskStateModel';

// 1. Trocamos 'enum' por um objeto literal com 'as const'
export const TaskActionTypes = {
  START_TASK: 'START_TASK',
  INTERRUPT_TASK: 'INTERRUPT_TASK',
  RESET_STATE: 'RESET_STATE',
  COUNT_DOWN: 'COUNT_DOWN',
  COMPLETE_TASK: 'COMPLETE_TASK',
  CHANGE_SETTINGS: 'CHANGE_SETTINGS',
} as const;

export type TaskActionTypes =
  (typeof TaskActionTypes)[keyof typeof TaskActionTypes];

export type TaskActionsWithPayload =
  | {
    type: typeof TaskActionTypes.START_TASK;
    payload: TaskModel;
  }
  | {
    type: typeof TaskActionTypes.COUNT_DOWN;
    payload: { secondsRemaining: number };
  }
  | {
    type: typeof TaskActionTypes.CHANGE_SETTINGS;
    payload: TaskStateModel['config'];
  };

export type TaskActionsWithoutPayload =
  | {
    type: typeof TaskActionTypes.RESET_STATE;
  }
  | {
    type: typeof TaskActionTypes.INTERRUPT_TASK;
  }
  | {
    type: typeof TaskActionTypes.COMPLETE_TASK;
  };

export type TaskActionModel =
  | TaskActionsWithPayload
  | TaskActionsWithoutPayload;
```

### `src/contexts/TaskContext/taskReducer.ts`

```ts
import type { TaskStateModel } from '../../models/TaskStateModel';
import { formatSecondsToMinutes } from '../../utils/formatSecondsToMinutes';
import { getNextCycle } from '../../utils/getNextCycle';
import { initialTaskState } from './initialTaskState';
import { TaskActionTypes, type TaskActionModel } from './taskActions';

export function taskReducer(
  state: TaskStateModel,
  action: TaskActionModel,
): TaskStateModel {
  switch (action.type) {
    case TaskActionTypes.START_TASK: {
      const newTask = action.payload;
      const nextCycle = getNextCycle(state.currentCycle);
      const secondsRemaining = newTask.duration * 60;

      return {
        ...state,
        activeTask: newTask,
        currentCycle: nextCycle,
        secondsRemaining,
        formattedSecondsRemaining: formatSecondsToMinutes(secondsRemaining),
        tasks: [...state.tasks, newTask],
      };
    }
    case TaskActionTypes.INTERRUPT_TASK: {
      return {
        ...state,
        activeTask: null,
        secondsRemaining: 0,
        formattedSecondsRemaining: '00:00',
        tasks: state.tasks.map(task => {
          if (state.activeTask && state.activeTask.id === task.id) {
            return { ...task, interruptDate: Date.now() };
          }
          return task;
        }),
      };
    }
    case TaskActionTypes.COMPLETE_TASK: {
      return {
        ...state,
        activeTask: null,
        secondsRemaining: 0,
        formattedSecondsRemaining: '00:00',
        tasks: state.tasks.map(task => {
          if (state.activeTask && state.activeTask.id === task.id) {
            return { ...task, completeDate: Date.now() };
          }
          return task;
        }),
      };
    }
    case TaskActionTypes.RESET_STATE: {
      return { ...initialTaskState };
    }
    case TaskActionTypes.COUNT_DOWN: {
      return {
        ...state,
        secondsRemaining: action.payload.secondsRemaining,
        formattedSecondsRemaining: formatSecondsToMinutes(
          action.payload.secondsRemaining,
        ),
      };
    }
    case TaskActionTypes.CHANGE_SETTINGS: {
      return { ...state, config: { ...action.payload } };
    }
  }

  // Sempre deve retornar o estado
  return state;
}
```

---

## Checklist

- [ ] Action `CHANGE_SETTINGS` criada e tipada.
- [ ] Reducer atualiza `state.config` no case `CHANGE_SETTINGS`.
- [ ] Página `Settings` dispara `dispatch` com payload válido.
- [ ] Erros de validação impedem o dispatch.
- [ ] Mensagem de sucesso exibida após salvar.

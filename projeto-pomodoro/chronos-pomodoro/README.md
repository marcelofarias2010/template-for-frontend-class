# Confirmação customizada com React-Toastify

## Objetivo

Substituir o `window.confirm` por um diálogo visual customizado com `react-toastify`, mantendo o fluxo de confirmação para apagar o histórico.

## Contexto da aula

Nesta prática, vamos:

- Exibir um toast de confirmação que **não fecha sozinho**.
- Renderizar um **componente React** dentro do toast.
- Capturar a decisão do usuário (`true` para confirmar, `false` para cancelar).
- Encapsular a lógica no adapter `showMessage.confirm(...)` para evitar repetição.
- Aplicar esse fluxo na tela de histórico antes de disparar `RESET_STATE`.

## Requisitos da implementação

1. Criar o componente `Dialog` em `src/components/Dialog/index.tsx`.
2. Estilizar o componente com `src/components/Dialog/styles.module.css`.
3. Adicionar no adapter `showMessage` o método:
   - `confirm(data: string, onClosing: (confirmation: boolean) => void)`
4. Configurar o toast de confirmação com:
   - `autoClose: false`
   - `closeOnClick: false`
   - `closeButton: false`
   - `draggable: false`
5. Na página `History`:
   - Trocar confirmação antiga por `showMessage.confirm(...)`.
   - Salvar o retorno da confirmação no estado.
   - Usar `useEffect` para executar `dispatch({ type: TaskActionTypes.RESET_STATE })` apenas quando confirmado.

## Comportamento esperado

- Clicou na lixeira: abre diálogo com pergunta.
- Clicou em cancelar: não apaga o histórico.
- Clicou em confirmar: apaga o histórico.
- O toast só fecha quando o usuário escolhe uma ação.

## Código-fonte dos arquivos modificados/criados nesta branch

### `src/adapters/showMessage.ts` (modificado)

```ts
import { toast } from 'react-toastify';
import { Dialog } from '../components/Dialog';

export const showMessage = {
  success: (msg: string) => toast.success(msg),
  error: (msg: string) => toast.error(msg),
  warn: (msg: string) => toast.warn(msg),
  warning: (msg: string) => toast.warning(msg),
  info: (msg: string) => toast.info(msg),
  dismiss: () => toast.dismiss(),
  confirm: (data: string, onClosing: (confirmation: boolean) => void) =>
    toast(Dialog, {
      data,
      onClose: confirmation => {
        if (confirmation) return onClosing(true);
        return onClosing(false);
      },
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
      draggable: false,
    }),
};
```

### `src/pages/History/index.tsx` (modificado)

```tsx
import { TrashIcon } from 'lucide-react';
import { Container } from '../../components/Container';
import { DefaultButton } from '../../components/DefaultButton';
import { Heading } from '../../components/Heading';
import { MainTemplate } from '../../templates/MainTemplate';

import styles from './styles.module.css';
import { useTaskContext } from '../../contexts/TaskContext';
import { formatDate } from '../../utils/formatDate';
import { getTaskStatus } from '../../utils/getTaskStatus';
import { sortTasks, type SortTasksOptions } from '../../utils/sortTasks';
import { useEffect, useState } from 'react';
import { TaskActionTypes } from '../../contexts/TaskContext/taskActions';
import { showMessage } from '../../adapters/showMessage';

export function History() {
  const { state, dispatch } = useTaskContext();
  const [confirmClearHistory, setConfirmClearHistory] = useState(false);
  const hasTasks = state.tasks.length > 0;

  const [sortTasksOptions, setSortTaskOptions] = useState<SortTasksOptions>(
    () => {
      return {
        tasks: sortTasks({ tasks: state.tasks }),
        field: 'startDate',
        direction: 'desc',
      };
    },
  );

  useEffect(() => {
    setSortTaskOptions(prevState => ({
      ...prevState,
      tasks: sortTasks({
        tasks: state.tasks,
        direction: prevState.direction,
        field: prevState.field,
      }),
    }));
  }, [state.tasks]);

  useEffect(() => {
    if (!confirmClearHistory) return;

    setConfirmClearHistory(false);

    dispatch({ type: TaskActionTypes.RESET_STATE });
  }, [confirmClearHistory, dispatch]);

  function handleSortTasks({ field }: Pick<SortTasksOptions, 'field'>) {
    const newDirection = sortTasksOptions.direction === 'desc' ? 'asc' : 'desc';

    setSortTaskOptions({
      tasks: sortTasks({
        direction: newDirection,
        tasks: sortTasksOptions.tasks,
        field,
      }),
      direction: newDirection,
      field,
    });
  }

  function handleResetHistory() {
    showMessage.dismiss();
    showMessage.confirm('Tem certeza?', confirmation => {
      setConfirmClearHistory(confirmation);
    });
  }

  return (
    <MainTemplate>
      <Container>
        <Heading>
          <span>History</span>
          {hasTasks && (
            <span className={styles.buttonContainer}>
              <DefaultButton
                icon={<TrashIcon />}
                color='red'
                aria-label='Apagar todo o histórico'
                title='Apagar histórico'
                onClick={handleResetHistory}
              />
            </span>
          )}
        </Heading>
      </Container>

      <Container>
        {hasTasks && (
          <div className={styles.responsiveTable}>
            <table>
              <thead>
                <tr>
                  <th
                    onClick={() => handleSortTasks({ field: 'name' })}
                    className={styles.thSort}
                  >
                    Tarefa ↕
                  </th>
                  <th
                    onClick={() => handleSortTasks({ field: 'duration' })}
                    className={styles.thSort}
                  >
                    Duração ↕
                  </th>
                  <th
                    onClick={() => handleSortTasks({ field: 'startDate' })}
                    className={styles.thSort}
                  >
                    Data ↕
                  </th>
                  <th>Status</th>
                  <th>Tipo</th>
                </tr>
              </thead>

              <tbody>
                {sortTasksOptions.tasks.map(task => {
                  const taskTypeDictionary = {
                    workTime: 'Foco',
                    shortBreakTime: 'Descanso curto',
                    longBreakTime: 'Descanso longo',
                  };
                  return (
                    <tr key={task.id}>
                      <td>{task.name}</td>
                      <td>{task.duration}min</td>
                      <td>{formatDate(task.startDate)}</td>
                      <td>{getTaskStatus(task, state.activeTask)}</td>
                      <td>{taskTypeDictionary[task.type]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!hasTasks && (
          <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Ainda não existem tarefas criadas.
          </p>
        )}
      </Container>
    </MainTemplate>
  );
}
```

### `src/components/Dialog/index.tsx` (criado)

```tsx
import type { ToastContentProps } from 'react-toastify';
import { DefaultButton } from '../DefaultButton';
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';

import styles from './styles.module.css';

export function Dialog({ closeToast, data }: ToastContentProps<string>) {
  return (
    <>
      <div className={styles.container}>
        <p>{data}</p>

        <div className={styles.buttonsContainer}>
          <DefaultButton
            onClick={() => closeToast(true)}
            icon={<ThumbsUpIcon />}
            aria-label='Confirmar ação e fechar'
            title='Confirmar ação e fechar'
          />
          <DefaultButton
            onClick={() => closeToast(false)}
            icon={<ThumbsDownIcon />}
            color='red'
            aria-label='Cancelar ação e fechar'
            title='Cancelar ação e fechar'
          />
        </div>
      </div>
    </>
  );
}
```

### `src/components/Dialog/styles.module.css` (criado)

```css
.container {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 1.6rem;
  text-align: center;
}

.buttonsContainer {
  display: flex;
  gap: 1.6rem;
}

.buttonsContainer button {
  min-width: auto;
  margin: 0;
}

.buttonsContainer svg {
  width: 1.6rem;
  height: 1.6rem;
}
```

## Checklist final

- [ ] Botão de lixeira abre diálogo de confirmação customizado.
- [ ] Toast não fecha sozinho e não fecha com clique no corpo.
- [ ] Botão de confirmar envia `true` e apaga o histórico.
- [ ] Botão de cancelar envia `false` e não apaga nada.
- [ ] Lógica de confirmação centralizada no adapter (`showMessage.confirm`).

# Correção de bug ao sair da tela de histórico

## Objetivo

Corrigir o bug em que o toast de confirmação continua visível ao sair da página `History`, causando comportamento inconsistente quando o usuário tenta confirmar a ação fora da tela de histórico.

## Cenário do bug

Durante os testes, foi identificado o seguinte comportamento:

1. O usuário abre a confirmação para apagar histórico.
2. Sai da página `History` sem clicar em confirmar/cancelar.
3. O toast continua na tela.
4. Se clicar em confirmar fora da página `History`, a lógica baseada no estado local da página pode não executar como esperado, pois o componente já foi desmontado.

## Estratégia aplicada nesta prática

Utilizar o **cleanup do `useEffect`** no componente `History` para remover qualquer toast ativo quando a página for desmontada.

### Implementação

- Adicionar um `useEffect` com array de dependências vazio (`[]`).
- No `return` desse efeito (função de cleanup), chamar `showMessage.dismiss()`.

Com isso:

- Ao navegar para fora de `History`, os toasts são fechados automaticamente.
- O usuário não fica com confirmação “pendurada” na UI.
- Evitamos ação de confirmação fora do contexto da página.

## Resultado esperado

- Se abrir o diálogo de confirmação e sair da página `History`, o diálogo deve desaparecer.
- Não deve ser possível confirmar uma ação de limpar histórico fora da tela de histórico.
- O fluxo de confirmação/cancelamento continua funcionando normalmente dentro da página.

## Arquivo modificado nesta branch

### `src/pages/History/index.tsx`

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

  useEffect(() => {
    return () => {
      showMessage.dismiss();
    };
  }, []);

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

## Checklist

- [ ] Ao abrir confirmação e sair da tela, o toast é removido automaticamente.
- [ ] Confirmar/cancelar dentro da tela `History` continua funcionando.
- [ ] Não há toast “preso” ao navegar para outras rotas.
- [ ] O histórico só é apagado quando a confirmação for positiva.

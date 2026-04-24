# 🎭 Definindo o Tipo do Ciclo: A Lógica "FizzBuzz" do Pomodoro

Agora que já sabemos controlar os ciclos, vamos usar lógica e matemática básica
para definir qual é o tipo de tarefa atual (Tempo de Foco, Pausa Curta ou Pausa
Longa)!

Na aula passada, nós criamos a função que conta de 1 a 8 e reinicia. Agora,
precisamos de uma segunda inteligência: dado o número de um ciclo (ex: Ciclo 3),
qual é o tipo dele?

Se analisarmos o padrão do Pomodoro, temos o seguinte:

- **Ímpares (1, 3, 5, 7):** Tempo de Foco (`workTime`)
- **Pares (2, 4, 6):** Pausa Curta (`shortBreakTime`)
- **O Ciclo 8 (e seus múltiplos, se houvesse):** Pausa Longa (`longBreakTime`)

Para resolver isso, vamos usar o operador de Módulo (`%`), que pega o **resto da
divisão** entre dois números. É uma lógica muito parecida com o famoso teste de
algoritmo "FizzBuzz"!

---

## 🛠️ 1. Criando a Função Utilitária (`getNextCycleType.ts`)

Vamos criar mais um arquivo na nossa pasta `utils`. Dessa vez, além de receber o
número do ciclo, vamos usar o TypeScript para garantir que o retorno seja
exatamente um dos três tipos válidos do nosso `TaskModel`.

**Arquivo:** `src/utils/getNextCycleType.ts`

```typescript
import { TaskModel } from '../models/TaskModel';

// Tipamos o retorno para ser exatamente a chave 'type' do TaskModel
export function getNextCycleType(currentCycle: number): TaskModel['type'] {
  // 1. Se o resto da divisão por 8 for zero, é a oitava tarefa (Pausa Longa)
  if (currentCycle % 8 === 0) return 'longBreakTime';

  // 2. Se o resto da divisão por 2 for zero, é um número Par (Pausa Curta)
  if (currentCycle % 2 === 0) return 'shortBreakTime';

  // 3. Se não caiu em nenhuma das regras acima, só pode ser Ímpar (Tempo de Foco)
  return 'workTime';
}
```

## 🔌 2. Aplicando a Lógica no Formulário (`MainForm.tsx`)

Agora, voltamos ao nosso `MainForm` e aplicamos essa nova função da mesma forma
que fizemos com a função de ciclos.

Lembre-se: como estamos trabalhando "um passo à frente", passamos o `nextCycle`
(que calculamos na aula passada) para a nossa nova função descobrir o
`nextCycleType`.

**Arquivo:** `src/components/MainForm/index.tsx`

```tsx
import { PlayCircleIcon } from 'lucide-react';
import { Cycles } from '../Cycles';
import { DefaultButton } from '../DefaultButton';
import { DefaultInput } from '../DefaultInput';
import { useRef } from 'react';
import type { TaskModel } from '../../models/TaskModel';
import { useTaskContext } from '../../contexts/TaskContext/useTaskContext';
import { getNextCycle } from '../../utils/getNextCycle';
import { getNextCycleType } from '../../utils/getNextCycleType';

export function MainForm() {
  const { state, setState } = useTaskContext();

  const taskNameInput = useRef<HTMLInputElement>(null);

  // ciclos
  const nextCycle = getNextCycle(state.currentCycle);
  const nextCyleType = getNextCycleType(nextCycle);

  function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (taskNameInput.current === null) return;

    const taskName = taskNameInput.current.value.trim();

    if (!taskName) {
      alert('Digite o nome da tarefa');
      return;
    }

    const newTask: TaskModel = {
      id: Date.now().toString(),
      name: taskName,
      startDate: Date.now(),
      completeDate: null,
      interruptDate: null,
      duration: 1,
      type: nextCyleType,
    };

    const secondsRemaining = newTask.duration * 60;

    setState(prevState => {
      return {
        ...prevState,
        config: { ...prevState.config },
        activeTask: newTask,
        currentCycle: nextCycle,
        secondsRemaining, // Conferir
        formattedSecondsRemaining: '00:00', // Conferir
        tasks: [...prevState.tasks, newTask],
      };
    });
  }

  return (
    <form onSubmit={handleCreateNewTask} className='form' action=''>
      <div className='formRow'>
        <DefaultInput
          labelText='task'
          id='meuInput'
          type='text'
          placeholder='Digite algo'
          ref={taskNameInput}
        />
      </div>

      <div className='formRow'>
        <p>Próximo intervalo é de 25min</p>
      </div>

      <div className='formRow'>
        <Cycles />
      </div>

      <div className='formRow'>
        <DefaultButton icon={<PlayCircleIcon />} />
      </div>
    </form>
  );
}
```

## ✅ Testando o Fluxo Completo

É hora de validar se a nossa matemática funcionou! Com o seu "espião"
(`console.log` dentro do `useEffect` lá no `TaskContextProvider`) ainda ativo,
siga os passos:

1. Inicie uma tarefa ("Tarefa 1"). Olhe no console, abra a `activeTask`: o type
   deve ser `workTime`.
2. Inicie a segunda ("Tarefa 2"). O type deve ser `shortBreakTime`.
3. Continue iniciando tarefas até a 8ª.
4. Na 8ª tarefa, o type deve ser obrigatoriamente `longBreakTime`.
5. Se você iniciar a 9ª tarefa, o ciclo deve voltar a ser 1 e o type volta a ser
   `workTime`.

Se os logs bateram, parabéns! Você acabou de criar o motor principal das regras
de negócio do seu Pomodoro.

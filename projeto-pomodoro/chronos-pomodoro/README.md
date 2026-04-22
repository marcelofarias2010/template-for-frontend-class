# Prática 80 - Validação de formulário na página Settings

## Objetivo

Implementar a validação dos campos de configuração (foco, descanso curto e descanso longo) antes de salvar os dados no estado global.

Nesta prática, o foco é:

- validar os dados no JavaScript (React);
- acumular e exibir todos os erros de uma vez;
- restringir os inputs para número com `type='number'`;
- preparar o fluxo para, na próxima aula, disparar action/reducer para salvar no contexto.

## Contexto da aula

Com o submit já funcionando, agora precisamos garantir que os valores informados são válidos.

A abordagem escolhida foi:

1. limpar mensagens antigas (`showMessage.dismiss()`),
2. ler os valores via `useRef`,
3. converter para número com `Number(...)`,
4. validar e adicionar mensagens no array `formErrors`,
5. exibir todos os erros com `showMessage.error(...)`,
6. interromper com `return` se houver erro.

## Regras de validação aplicadas

- Todos os campos devem ser numéricos.
- `workTime` (Foco): mínimo **1**, máximo **99**.
- `shortBreakTime` (Descanso curto): mínimo **1**, máximo **30**.
- `longBreakTime` (Descanso longo): mínimo **1**, máximo **60**.

## Resultado esperado

- Se qualquer campo estiver inválido, o usuário recebe mensagem de erro e o formulário não prossegue.
- Se os três valores estiverem corretos, o fluxo chega no ponto de salvar (`console.log('SALVAR')`), que será substituído pela atualização real do estado na próxima prática.
- Os inputs passam a ser numéricos no HTML (`type='number'`), mas a validação principal continua no JavaScript.

## Código-fonte do arquivo modificado nesta branch

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

export function Settings() {
  const { state } = useTaskContext();
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

    console.log('SALVAR');
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

## Checklist

- [ ] Formulário impede reload (`preventDefault`).
- [ ] Mensagens antigas são limpas antes de validar (`showMessage.dismiss()`).
- [ ] Valores convertidos com `Number(...)`.
- [ ] Validação numérica geral com `isNaN`.
- [ ] Validação de faixas por campo (foco, descanso curto e descanso longo).
- [ ] Exibição de erros acumulados com `formErrors.forEach(...)`.
- [ ] Inputs usando `type='number'`.
- [ ] Fluxo de sucesso chegando no ponto de salvar.

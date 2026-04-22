# Captura do submit e leitura dos valores da página Settings

## Objetivo

Implementar a primeira camada de lógica da página `Settings`:

- Capturar o evento de envio do formulário.
- Impedir o reload da página com `preventDefault`.
- Ler os valores dos campos usando `useRef` (inputs não controlados).
- Carregar valores padrão vindos do estado global em `defaultValue`.

> Nesta etapa, ainda não vamos salvar nem validar os valores. O foco é estruturar o fluxo de leitura dos dados.

## Contexto da aula

Agora que a tela de configurações já existe, precisamos começar a tratar o formulário.

Como a validação será feita apenas no envio (e não em tempo real enquanto digita), foi escolhida a abordagem com **inputs não controlados** + **refs**:

- `workTimeInput`
- `shortBreakTimeInput`
- `longBreakTimeInput`

No submit, os valores são capturados por `ref.current?.value` e exibidos no console para teste inicial do fluxo.

## Requisitos da prática

1. Criar a função `handleSaveSettings`.
2. Tipar o evento como `React.FormEvent<HTMLFormElement>`.
3. Executar `e.preventDefault()` no início do handler.
4. Criar refs com `useRef<HTMLInputElement>(null)` para os três inputs.
5. Associar cada ref no respectivo `DefaultInput`.
6. Ler os valores no submit com `current?.value`.
7. Exibir os três valores com `console.log(...)` para validação manual.
8. Preencher os campos com os valores atuais do contexto:
   - `state.config.workTime`
   - `state.config.shortBreakTime`
   - `state.config.longBreakTime`

## Resultado esperado

- O formulário não recarrega a página ao clicar em salvar.
- O console mostra os valores digitados em foco, descanso curto e descanso longo.
- Os campos já aparecem preenchidos com os dados atuais do estado global ao abrir a página.

## Próximo passo (próxima aula)

- Validar os valores recebidos.
- Converter os dados para número.
- Aplicar regras mínimas de faixa e obrigatoriedade.
- Disparar atualização do estado global quando tudo estiver válido.

---

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

export function Settings() {
  const { state } = useTaskContext();
  const workTimeInput = useRef<HTMLInputElement>(null);
  const shortBreakTimeInput = useRef<HTMLInputElement>(null);
  const longBreakTimeInput = useRef<HTMLInputElement>(null);

  function handleSaveSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const workTime = workTimeInput.current?.value;
    const shortBreakTime = shortBreakTimeInput.current?.value;
    const longBreakTime = longBreakTimeInput.current?.value;

    console.log(workTime, shortBreakTime, longBreakTime);
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
            />
          </div>
          <div className='formRow'>
            <DefaultInput
              id='shortBreakTime'
              labelText='Descanso curto'
              ref={shortBreakTimeInput}
              defaultValue={state.config.shortBreakTime}
            />
          </div>
          <div className='formRow'>
            <DefaultInput
              id='longBreakTime'
              labelText='Descanso longo'
              ref={longBreakTimeInput}
              defaultValue={state.config.longBreakTime}
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

---

## Checklist de validação

- [ ] `onSubmit` implementado no formulário.
- [ ] `preventDefault` evitando reload.
- [ ] `useRef` criado para os 3 campos.
- [ ] Valores capturados por `current?.value`.
- [ ] `defaultValue` ligado ao `state.config`.
- [ ] `console.log` exibindo os 3 valores ao salvar.

# Prática - Capturando o `submit` do formulário no `MainForm`

## Objetivo

Nesta etapa, o foco é **simples e direto**: capturar o envio do formulário da
task e impedir o comportamento padrão do navegador (recarregar a página).

Ainda **não** vamos pegar valor do input nesta aula. Isso fica para a próxima.

---

## O que será feito

- Adicionar `onSubmit` no `<form>`.
- Criar a função `handleCreateNewTask`.
- Tipar o evento como `React.FormEvent<HTMLFormElement>`.
- Executar `event.preventDefault()`.
- Confirmar no console com `console.log('DEU CERTO')`.

---

## Por que isso é importante?

Quando um formulário é enviado no HTML puro, o navegador faz refresh da página.
Em aplicações React, isso quebra a experiência e perde estado em memória.

Com `preventDefault()`, o fluxo passa a ser controlado pelo React e conseguimos
seguir com validações e lógica da aplicação sem recarregar.

---

## Código da etapa

Arquivo: `src/components/MainForm/index.tsx`

```tsx
import { PlayCircleIcon } from 'lucide-react';
import { Cycles } from '../Cycles';
import { DefaultButton } from '../DefaultButton';
import { DefaultInput } from '../DefaultInput';

export function MainForm() {
  function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log('DEU CERTO');
  }

  return (
    <form onSubmit={handleCreateNewTask} className='form' action=''>
      <div className='formRow'>
        <DefaultInput
          labelText='task'
          id='meuInput'
          type='text'
          placeholder='Digite algo'
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

---

## Checklist

- [ ] O formulário possui `onSubmit={handleCreateNewTask}`.
- [ ] A função recebe o evento tipado `React.FormEvent<HTMLFormElement>`.
- [ ] Existe `event.preventDefault()` no início da função.
- [ ] Ao clicar no botão, aparece `DEU CERTO` no console.
- [ ] A página não recarrega ao enviar o formulário.

---

## Próxima aula

Agora que o submit está controlado, o próximo passo é capturar e tratar o valor
do input da task.

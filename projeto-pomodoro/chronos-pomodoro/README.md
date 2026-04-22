# Criando a estrutura da página de configurações

## Objetivo

Construir a estrutura inicial da página `Settings`, conectá-la ao roteamento principal e preparar o formulário para, na próxima prática, receber validações e persistência das configurações.

## Contexto da aula

Até este ponto da aplicação, já existe menu com link para configurações, mas faltava a tela em si.  
Nesta prática, o foco é apenas a **estrutura de UI**:

- Título da página.
- Texto explicativo.
- Formulário com três campos (foco, descanso curto e descanso longo).
- Botão de salvar com ícone.
- Rota `/settings/` adicionada no roteador.

> Importante: nesta etapa ainda não há lógica de envio, validação dos valores ou atualização de estado global.

## Requisitos da prática

1. Criar a página `Settings` em `src/pages/Settings/index.tsx`.
2. Usar `MainTemplate`, `Container`, `Heading`, `DefaultInput` e `DefaultButton`.
3. Exibir os três campos:
   - `workTime` com label **Foco**
   - `shortBreakTime` com label **Descanso curto**
   - `longBreakTime` com label **Descanso longo**
4. Adicionar botão com `SaveIcon` e atributos de acessibilidade:
   - `aria-label="Salvar configurações"`
   - `title="Salvar configurações"`
5. Registrar a rota `/settings/` no `MainRouter`.

## Observações importantes

- O formulário ainda está estrutural (`action=''`) e será evoluído na próxima aula.
- O texto explicativo foi centralizado com `style` inline (`textAlign: 'center'`) apenas como ajuste visual rápido.
- As classes `form` e `formRow` são globais e reaproveitadas nesta tela.
- O import de `Settings` deve apontar para a página correta, pois o nome é comum em libs e pode gerar confusão de autoimport.

## Resultado esperado

- Ao clicar no menu de configurações, a rota `/settings/` carrega a nova tela.
- A página mostra:
  - Heading “Configurações”
  - Parágrafo explicativo
  - Três inputs
  - Botão de salvar com ícone
- Ainda ocorre submit padrão do formulário (comportamento esperado nesta etapa inicial).

---

## Código-fonte dos arquivos novos e modificados desta branch

### Novo arquivo: `src/pages/Settings/index.tsx`

```tsx
import { SaveIcon } from 'lucide-react';
import { Container } from '../../components/Container';
import { DefaultButton } from '../../components/DefaultButton';
import { DefaultInput } from '../../components/DefaultInput';
import { Heading } from '../../components/Heading';
import { MainTemplate } from '../../templates/MainTemplate';

export function Settings() {
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
        <form action='' className='form'>
          <div className='formRow'>
            <DefaultInput id='workTime' labelText='Foco' />
          </div>
          <div className='formRow'>
            <DefaultInput id='shortBreakTime' labelText='Descanso curto' />
          </div>
          <div className='formRow'>
            <DefaultInput id='longBreakTime' labelText='Descanso longo' />
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

### Arquivo modificado: `src/routers/MainRouter/index.tsx`

```tsx
import { BrowserRouter, Route, Routes, useLocation } from 'react-router';
import { AboutPomodoro } from '../../pages/AboutPomodoro';
import { NotFound } from '../../pages/NotFound';
import { Home } from '../../pages/Home';
import { useEffect } from 'react';
import { History } from '../../pages/History';
import { Settings } from '../../pages/Settings';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

export function MainRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/history/' element={<History />} />
        <Route path='/settings/' element={<Settings />} />
        <Route path='/about-pomodoro/' element={<AboutPomodoro />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <ScrollToTop />
    </BrowserRouter>
  );
}
```

---

## Checklist de entrega

- [ ] Página `Settings` criada com estrutura base.
- [ ] Inputs de foco, descanso curto e descanso longo renderizados.
- [ ] Botão com `SaveIcon` e atributos de acessibilidade presentes.
- [ ] Rota `/settings/` adicionada no `MainRouter`.
- [ ] Navegação via menu funcionando.

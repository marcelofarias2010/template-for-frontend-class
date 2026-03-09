# 📦 Refatorando o Layout: Criando o Componente Container

Na aula anterior, criamos uma estrutura de HTML com
`<div className="container">` e `<div className="content">` para alinhar nosso
layout. No entanto, percebemos que esse código iria se repetir em todas as
seções do site (Logo, Menu, Formulário, Footer).

No React, sempre que notamos repetição de interface, é um sinal claro de que
devemos **criar um componente**!

---

## 🛠️ 1. Criando o Componente `Container`

Vamos isolar essa estrutura repetitiva. Se quiser um desafio, tente criar este
componente sozinho antes de olhar a resposta abaixo! Lembre-se que ele precisará
receber elementos dentro dele (a propriedade `children`).

1. Crie o arquivo `src/components/Container.tsx` (ou `.jsx`).
2. Defina a tipagem para receber o `children`.

```tsx
// src/components/Container.tsx
import { ReactNode } from 'react';
import styles from './Container.module.css'; // Já vamos criar este arquivo!

// 1. Tipagem: O Container vai abraçar outros elementos (ReactNode)
type ContainerProps = {
  children: ReactNode;
};

// 2. Componente: Desestruturamos o children e aplicamos a estrutura base
export function Container({ children }: ContainerProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
```

## 🎨 2. Migrando o CSS para CSS Modules

Na aula passada, colocamos as classes `.container` e `.content` no nosso arquivo
global. Como agora temos um componente específico para isso, devemos isolar esse
CSS para mantermos a organização (CSS Modules).

1. Vá no arquivo src/styles/global.css e apague as classes `.container` e
   `.content`.
2. Crie um novo arquivo chamado `Container.module.css` na mesma pasta do seu
   novo componente.
3. Cole o CSS lá dentro:

```css
/* src/components/Container.module.css */

.container {
  max-width: 98rem;
  margin: 0 auto;
}

.content {
  padding: 3.2rem;
}
```

_Nota: Ao usar CSS Modules, o React vai gerar nomes de classes únicos (ex:
`Container_container__1a2b3`), garantindo que esse estilo nunca conflite com
outras partes do site._

## 🧩 3. Composição de Componentes (O "Quebra-Cabeça" do React)

A verdadeira mágica do React acontece quando começamos a colocar componentes
dentro de outros componentes (Composição).

Vamos voltar ao nosso arquivo principal (`App.tsx`) e substituir aquele monte de
`<div>` solta pelos nossos novos componentes: o `<Container>` e o `<Heading>`.

```tsx
// src/App.tsx
import { Container } from './components/Container';
import { Heading } from './components/Heading';

export function App() {
  return (
    <>
      {/* Seção 1: Logo */}
      <Container>
        <Heading>Logo</Heading>
      </Container>

      {/* Seção 2: Menu */}
      <Container>
        <Heading>Menu</Heading>
      </Container>
    </>
  );
}
```

### 🧐 O que mudou?

Olhe como o código do `App.tsx` ficou muito mais limpo e semântico!

- O `<Container>` é responsável **apenas** por alinhar e dar espaçamento
  (layout).
- O `<Heading>` é responsável **apenas** por exibir um título padronizado.
- Nós apenas encaixamos um dentro do outro!

## 🔜 Próximos Passos (Spoiler!)

Se você olhar o design final da nossa aplicação, notará que o Menu, a Logo e o
Rodapé (Footer) se repetem de forma idêntica em **todas** as páginas (Página de
Cronômetro, Página de Histórico, etc).

Em breve, usaremos essa mesma lógica de composição para criar um grande
**Template de Página (Layout)**, onde o cabeçalho e rodapé já ficam fixos, e nós
só trocamos o "miolo" do conteúdo!

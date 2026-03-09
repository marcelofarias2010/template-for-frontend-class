# 📐 Construindo o Layout Base: Container e Content

Nesta aula, vamos começar a estruturar o layout principal da nossa aplicação. Em
vez de simplesmente jogar os elementos soltos na tela, vamos criar um sistema de
**Containers** para garantir que o conteúdo fique sempre centralizado,
responsivo e com uma largura máxima agradável para a leitura.

---

## 🏗️ 1. A Estrutura Visual Desejada

Se observarmos o layout final do nosso projeto (o cronômetro), podemos dividi-lo
em seções horizontais empilhadas:

1. Logo
2. Menu
3. Cronômetro / Formulário
4. Rodapé (Footer)

Para que todos esses elementos fiquem alinhados ao centro e não "colem" nas
bordas de monitores muito largos (como telas Ultrawide), usaremos uma técnica
clássica de CSS.

---

## 📦 2. Criando as Classes de Container no CSS Global

Vamos abrir o nosso arquivo `src/styles/global.css` e criar três classes
utilitárias que nos ajudarão a controlar o layout da página.

### Classe 1: `.container-fluid` (Opcional, mas útil)

Serve para quando queremos que a cor de fundo (background) ocupe 100% da largura
da tela, mas o conteúdo interno continue centralizado e limitado.

```css
.container-fluid {
  width: 100%;
}
```

### Classe 2: `.container` (O Limitador)

Esta é a classe mais importante. Ela define uma largura máxima para o conteúdo e
usa a propriedade `margin: 0 auto` para centralizar essa "caixa" invisível no
meio da tela.

```css
.container {
  max-width: 98rem; /* Equivale a 980px */
  margin: 0 auto; /* Centraliza horizontalmente */
}
```

### Classe 3: `.content` (O Respiro)

Mesmo com o `.container` limitando a largura, em telas pequenas (como
celulares), o texto vai colar nas bordas do aparelho. A classe `.content` serve
para adicionar um _padding_ (respiro) interno nas laterais.

```css
.content {
  padding: 3.2rem; /* Adiciona espaço interno (32px) */
}
```

### 🧱 3. Aplicando a Estrutura no `App.jsx`

Agora que temos as nossas classes utilitárias prontas, vamos aplicá-las no nosso
componente principal (`App.jsx`).

Para simular o nosso layout em seções, vamos criar múltiplos blocos usando a
estrutura `container > content`:

```js
// src/App.jsx

export function App() {
  return (
    <>
      {/* Seção 1: Logo */}
      <div className='container'>
        <div className='content'>
          <p>Logo do App</p>
        </div>
      </div>

      {/* Seção 2: Menu */}
      <div className='container'>
        <div className='content'>
          <p>Menu de Navegação</p>
        </div>
      </div>

      {/* Seção 3: Formulário / Cronômetro */}
      <div className='container'>
        <div className='content'>
          <p>Área do Cronômetro</p>
        </div>
      </div>

      {/* Seção 4: Footer */}
      <div className='container'>
        <div className='content'>
          <p>Rodapé da Página</p>
        </div>
      </div>
    </>
  );
}
```

### 🧐 Como testar se funcionou?

Se você abrir o navegador, verá que os textos estão perfeitamente alinhados e
afastados das bordas. Para ver o efeito real, tente adicionar temporariamente um
`background-color: red`; na classe `.container` e redimensione a janela do seu
navegador.

Você notará que a "caixa" vermelha nunca ultrapassa os `980px` de largura e fica
sempre no centro da tela!

### 🔜 Próximos Passos

Nossa estrutura de divs no `App.jsx` está funcionando perfeitamente, mas o
código está muito repetitivo, não acha?

O React foi feito exatamente para resolver esse problema de repetição! Na
próxima aula, vamos pegar essa estrutura de `<div className="container">` e
`<div className="content">` e transformá-la em um Componente Reutilizável
inteligente.

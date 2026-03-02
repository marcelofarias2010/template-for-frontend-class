- Apresentação e discussão do Plano de Ensino e do Cronograma de Atividades da disciplina.
- Introdução aos conceitos da Web.     * Discussão sobre a diferença entre desenvolvimento frontend, backend e mobile.
- O que é ser um desenvolvedor Frontend e as tecnologias essenciais (HTML, CSS e JS).

## 🔌 Extensões Essenciais para o VS Code

Para melhorar sua produtividade e padronizar o ambiente durante o desenvolvimento com React, recomendamos a instalação das seguintes extensões no seu **Visual Studio Code**:

- **[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)**
- **[Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)**
- **[ES7+ React/Redux/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)**

---

## ⚙️ Configurações Recomendadas do VS Code

Para garantir que o código de todos os alunos siga o mesmo padrão de formatação e visualização, configure o Workspace do seu VS Code seguindo os passos abaixo:

1. Na raiz do seu repositório/projeto, crie uma pasta chamada `.vscode`.
2. Dentro dessa pasta, crie um arquivo chamado `settings.json`.
3. Copie o código abaixo e cole dentro deste arquivo:

```json
{
  "editor.fontFamily": "IBM Plex Mono, Monaco, Courier New, monospace",
  "editor.fontSize": 16,
  "editor.lineHeight": 28,
  "editor.tabSize": 2,
  "editor.tabCompletion": "on",
  "editor.wordWrap": "on",
  "workbench.activityBar.visible": true,
  "liveServer.settings.donotShowInfoMsg": true,
  "liveServer.settings.donotVerifyTags": true,
  "explorer.confirmDragAndDrop": false,
  "diffEditor.renderSideBySide": true,
  "editor.formatOnSave": true,
  "html.autoClosingTags": false,
  "editor.colorDecorators": false,
  "editor.autoClosingBrackets": "always",
  "editor.autoClosingQuotes": "always",
  "prettier.singleQuote": true,
  "files.associations": {
    "*.js": "javascriptreact"
  },
  "editor.minimap.renderCharacters": false,
  "breadcrumbs.enabled": false,
  "telemetry.telemetryLevel": "off",
  "color-highlight.markerType": "dot-before",
  "editor.renderWhitespace": "selection",
  "workbench.statusBar.visible": true,
  "prettier.trailingComma": "all",
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "explorer.sortOrder": "default",
  "window.title": "${activeEditorMedium}${separator}${rootName}",
  "window.newWindowDimensions": "inherit",
  "html.format.wrapAttributes": "auto",
  "html.format.wrapLineLength": 0,
  "[html]": {
    "editor.defaultFormatter": "vscode.html-language-features"
  },
  "editor.bracketPairColorization.enabled": false
}
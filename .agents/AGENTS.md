# Contexto do Projeto

A Blanger Arte Rústica é uma plataforma de e-commerce.
Este repositório contém a vitrine (Front-end) da aplicação, construída sob o conceito de Headless Commerce, consumindo dados via API REST (ou `products.json`) através do `fetch`.

Antes de iniciar qualquer tarefa, leia a estrutura de pastas existente e os arquivos de estilo (CSS) e scripts (JS) relacionados ao componente ou página que será alterada.

# Regras de Trabalho e Arquitetura

- Trabalhar em etapas pequenas e verificáveis.
- Implementar SOMENTE o que foi solicitado. Não adicionar seções ou animações extras que não estejam no escopo.
- Maximizar a reutilização de código existente. Utilizar classes CSS globais e funções utilitárias de JavaScript já definidas.
- Seguir rigorosamente a Separação de Responsabilidades (Separation of Concerns):
  - `*.html`: Apenas marcação semântica e estrutura acessível. PROIBIDO injetar estilos inline ou hardcodar produtos/catálogo diretamente no HTML.
  - `*.css`: Apenas estilização. Seguir a identidade visual da loja e adotar a abordagem _Mobile First_ (responsividade é obrigatória).
  - `*.js`: Manipulação de DOM, eventos e requisições HTTP (`fetch`).
- Centralizar as chamadas de API (o `fetch` para o backend ou leitura do JSON) em módulos específicos (ex: `api.js` ou pasta `services/`), separando a lógica de busca de dados da lógica de renderização na tela.
- Utilizar JavaScript moderno (ES6+): `async/await`, desestruturação, template literals. NUNCA usar `.then()/.catch()` para requisições de API, dê preferência ao `try/catch` com `async`.
- Garantir que as atualizações de DOM sejam eficientes e que não ocorram vazamentos de memória (remover _event listeners_ quando necessário).

# Fluxo Antes de Alterar Código

1. Ler o código HTML, CSS e JS relacionado à tarefa.
2. Identificar os padrões de nomenclatura de classes e a estrutura do DOM.
3. Apresentar um plano curto da implementação (ex: "Vou criar o container no HTML, adicionar o grid no CSS e fazer o fetch no JS").
4. Aguardar autorização do usuário.
5. Implementar somente a etapa solicitada.
6. Revisar o diff e informar os arquivos alterados.

# Performance e Acessibilidade (Lighthouse)

- O código deve ser escrito pensando nas métricas do Lighthouse (Performance, Acessibilidade, Melhores Práticas e SEO).
- Imagens devem ter o atributo `alt` preenchido e carregamento otimizado (ex: `loading="lazy"`).
- Botões e links devem ter áreas de clique adequadas e contraste de cor legível.

# Git e Commits

- Não utilizar comandos git.

# Limites de Autonomia do Agente

**O Agente PODE:**

- Ler arquivos estruturais (HTML, CSS, JS, JSON) e analisar o estado visual do projeto;
- Alterar arquivos relacionados à tarefa atual;
- Sugerir melhorias de UI/UX, acessibilidade e performance;
- Executar comandos locais de desenvolvimento se houver _bundler_ configurado (ex: Vite, Live Server).

**O Agente NÃO PODE (sem autorização explícita):**

- Fazer push para o repositório remoto;
- Criar ou enviar commits;
- Adicionar frameworks pesados (React, Vue) ou bibliotecas (jQuery, Bootstrap) caso o projeto seja em Vanilla JS;
- Fazer grandes refatorações visuais que fujam do tema "Arte Rústica".

# Finalização de Cada Tarefa

Ao concluir uma instrução, o agente deve obrigatoriamente informar:

1. O que foi implementado na interface.
2. Quais arquivos foram criados ou alterados.
3. Quais decisões de usabilidade/performance foram tomadas (se houver).
4. Se existe alguma pendência.

Depois disso, parar imediatamente e aguardar novas instruções do usuário.

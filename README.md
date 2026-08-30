# Blanger Arte Rústica — Frontend

Loja virtual em **React + Vite + Tailwind CSS**, feita para consumir a API
[`blanger-arte-rustica-api`](../blanger-arte-rustica-api) (Express + Sequelize + Neon).

## Identidade visual

- **Cores**: papel/creme (`paper`), tinta walnut escura (`ink`/`walnut`), laranja brasa (`ember`) como cor de ação, verde musgo (`moss`) para tags/sucesso e latão (`brass`) para detalhes.
- **Tipografia**: `Fraunces` (serifada rústica, com itálico) para títulos, `Work Sans` para o corpo do texto e `IBM Plex Mono` para preços e rótulos — como se fossem carimbados.
- **Elemento de assinatura**: os cards de produto são "etiquetas penduradas" (`hang-tag`), com um furo de ilhós no topo, remetendo às etiquetas de peças artesanais.

## Rodando localmente

```bash
cp .env.example .env
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173` e espera a API em
`http://localhost:3000/api/v1` (configurável via `VITE_API_URL`).

> **Modo demonstração:** se a API não estiver no ar, a Home e a Loja carregam
> automaticamente um catálogo de exemplo (`src/data/demoProducts.js`), para
> que a vitrine nunca fique vazia durante o desenvolvimento do front.

## Build de produção

```bash
npm run build
npm run preview
```

## Estrutura

```
src/
├── api/            # clientes axios (auth, products, addresses, orders)
├── assets/         # logo da marca
├── components/     # Header, Footer, Layout, ProductCard, PriceTag, etc.
├── context/         # AuthContext (sessão/JWT) e CartContext (carrinho)
├── data/            # produtos de demonstração (fallback offline)
├── pages/            # Home, Shop, ProductDetail, Cart, Checkout, Login,
│                      # Register, Account, NotFound
├── utils/            # formatPrice
├── App.jsx           # definição de rotas
├── main.jsx          # bootstrap (providers + router)
└── index.css         # tema Tailwind + componentes utilitários
```

## Fluxos implementados

- **Autenticação**: registro, login, sessão persistida em `localStorage`, rotas protegidas (`/checkout`, `/conta`).
- **Catálogo**: listagem com busca e filtro por categoria, detalhe de produto.
- **Carrinho**: adicionar/remover/alterar quantidade, persistido em `localStorage`.
- **Checkout**: seleção ou cadastro de endereço de entrega, escolha de forma de pagamento, criação do pedido via API.
- **Conta**: histórico de pedidos com cancelamento, gerenciamento de endereços, dados de perfil.

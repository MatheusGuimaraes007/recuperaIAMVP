# Recupera.IA - Frontend v3.0

Plataforma de Recuperação de Vendas com IA - Interface Web Moderna

## 🚀 Stack Tecnológica

- **Vue 3.5+** - Framework progressivo
- **Vite 7+** - Build tool ultra-rápido
- **Pinia 3.0+** - State management
- **TanStack Query 5+** - Data fetching e cache
- **Vue Router 4.5+** - Roteamento
- **Tailwind CSS 4+** - Estilização
- **Vee-Validate 4+** - Validação de formulários
- **VueSonner** - Notificações elegantes
- **Supabase** - Backend as a Service

## 📋 Pré-requisitos

- Node.js >= 20.0.0
- npm >= 10.0.0

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/recupera-ia/frontend.git
cd frontend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env.development
```

Edite o arquivo `.env.development` e preencha com suas credenciais:

```env
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build           # Build para produção
npm run preview         # Preview da build de produção

# Qualidade de código
npm run lint            # Executa ESLint
npm run format          # Formata código com Prettier

# Testes
npm run test           # Executa testes unitários
npm run test:ui        # UI interativa dos testes
npm run test:coverage  # Cobertura de testes
```

## 🏗️ Estrutura do Projeto

```
recupera-ia-frontend/
├── public/                      # Arquivos estáticos
├── src/
│   ├── api/                     # Camada de integração com backend
│   │   ├── adapters/           # Implementações de data sources
│   │   ├── models/             # Domain models
│   │   ├── services/           # Business logic
│   │   ├── transformers/       # Data transformation
│   │   ├── queries/            # TanStack Query queries
│   │   └── mutations/          # TanStack Query mutations
│   │
│   ├── assets/                  # Assets estáticos
│   │   ├── fonts/
│   │   ├── images/
│   │   └── styles/
│   │
│   ├── components/              # Componentes Vue (Atomic Design)
│   │   ├── atoms/              # Componentes básicos
│   │   ├── molecules/          # Combinações funcionais
│   │   ├── organisms/          # Componentes complexos
│   │   └── templates/          # Layouts
│   │
│   ├── composables/             # Lógica reutilizável
│   │   ├── core/
│   │   ├── ui/
│   │   ├── data/
│   │   └── utils/
│   │
│   ├── config/                  # Configurações
│   ├── constants/               # Constantes
│   ├── design-system/           # Design tokens
│   ├── layouts/                 # Layouts principais
│   ├── lib/                     # Bibliotecas e integrações
│   ├── pages/                   # Páginas (rotas)
│   ├── plugins/                 # Plugins Vue
│   ├── router/                  # Vue Router
│   ├── stores/                  # Pinia stores
│   ├── utils/                   # Utilitários
│   │
│   ├── App.vue                  # Componente raiz
│   ├── main.js                  # Entry point
│   └── style.css               # Estilos globais
│
├── tests/                       # Testes
├── .env.example                 # Exemplo de variáveis de ambiente
├── .env.development             # Variáveis de desenvolvimento
├── .gitignore
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎨 Design System

O projeto utiliza um Design System customizado baseado em:

- **Cor Principal**: Verde #00C853
- **Tipografia**: Manrope (display/body), DM Mono (code)
- **Espaçamento**: Sistema de 4px
- **Border Radius**: 8px a 24px
- **Sombras**: 4 níveis de elevação

Consulte a [documentação completa do Design System](./src/design-system/docs/README.md)

## 🔐 Autenticação

A autenticação é gerenciada via Supabase Auth. Fluxos disponíveis:

- Login com email/senha
- Registro de novos usuários
- Recuperação de senha
- Refresh de token automático

## 📊 State Management

### Pinia Stores
Gerenciam estado global da aplicação:
- `useAuthStore` - Autenticação e usuário
- `useUIStore` - Estado da interface
- `useNotificationsStore` - Notificações

### TanStack Query
Gerencia data fetching e cache:
- Cache automático
- Invalidação inteligente
- Otimistic updates
- Deduplicação de requests

## 🧪 Testes

```bash
# Executar todos os testes
npm run test

# Executar com UI interativa
npm run test:ui

# Gerar relatório de cobertura
npm run test:coverage
```

## 🚀 Deploy

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`

### Deploy em Vercel

```bash
vercel --prod
```

### Deploy em Netlify

```bash
netlify deploy --prod
```

## 📝 Convenções de Código

### Nomenclatura

- **Componentes Vue**: PascalCase (ex: `RButton.vue`)
- **Composables**: camelCase com prefixo `use` (ex: `useAuth.js`)
- **Stores**: camelCase com sufixo `Store` (ex: `useAuthStore`)
- **Utilitários**: camelCase (ex: `formatCurrency.js`)

### Git Commit

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona componente RButton
fix: corrige bug no login
docs: atualiza README
style: formata código
refactor: refatora useAuth
test: adiciona testes para RButton
chore: atualiza dependências
```

## 📚 Documentação

- [Guia de Arquitetura](./docs/ARCHITECTURE.md)
- [Design System](./src/design-system/docs/README.md)
- [Composables](./docs/COMPOSABLES.md)
- [API Layer](./docs/API.md)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feat/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feat/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade privada da Recupera.IA.

## 👥 Time

- **Desenvolvedor Frontend**: [Seu Nome]
- **Tech Lead**: [Nome do Tech Lead]
- **Product Owner**: [Nome do PO]

## 📞 Suporte

Para suporte, entre em contato:
- Email: dev@recupera.ia
- Slack: #frontend-dev

---

**Recupera.IA** - Recuperação de Vendas com Inteligência Artificial 🚀

# 🗂️ Estrutura do Projeto - Recupera.IA

> Organização completa de pastas, arquivos e convenções de código

---

## 📁 Estrutura de Diretórios

```
recupera-ia/
│
├── 📄 .env                           # Variáveis de ambiente (não versionado)
├── 📄 .env.example                   # Template de variáveis
├── 📄 .gitignore                     # Arquivos ignorados pelo Git
├── 📄 package.json                   # Dependências e scripts
├── 📄 vite.config.js                 # Configuração do Vite
├── 📄 postcss.config.js              # Configuração do PostCSS
├── 📄 tailwind.config.js             # Configuração do TailwindCSS
├── 📄 README.md                      # Documentação principal
│
├── 📁 docs/                          # 📚 Documentação técnica
│   ├── ARCHITECTURE.md               # Arquitetura do sistema
│   ├── DATABASE.md                   # Schema do banco
│   ├── DIAGRAMS.md                   # Diagramas visuais
│   ├── PROJECT_STRUCTURE.md          # Este arquivo
│   └── INTEGRATIONS.md               # Documentação de integrações
│
├── 📁 public/                        # 🌐 Assets estáticos (servidos na raiz)
│   ├── favicon.ico
│   └── logo.svg
│
└── 📁 src/                           # 💻 Código-fonte da aplicação
    │
    ├── 📄 main.js                    # ⚡ Entry point da aplicação
    ├── 📄 App.vue                    # 🎯 Componente raiz
    ├── 📄 style.css                  # 🎨 Estilos globais + Tailwind
    │
    ├── 📁 assets/                    # 🖼️ Assets da aplicação
    │   ├── images/
    │   ├── icons/
    │   └── vue.svg
    │
    ├── 📁 components/                # 🧩 Componentes Vue reutilizáveis
    │   │
    │   ├── 📁 all/                   # Componentes globais/compartilhados
    │   │   ├── Login.vue             # ✅ Tela de login
    │   │   ├── Cadastro.vue          # ✅ Tela de cadastro
    │   │   ├── RecuperarSenha.vue    # ✅ Solicitar reset de senha
    │   │   ├── RedefinirSenha.vue    # ✅ Definir nova senha
    │   │   ├── Header.vue            # 🚧 Header global
    │   │   ├── Sidebar.vue           # 🚧 Menu lateral
    │   │   └── LoadingSpinner.vue    # 🚧 Componente de loading
    │   │
    │   ├── 📁 dashboard/             # Componentes do dashboard
    │   │   ├── Dashboard.vue         # 🚧 View principal
    │   │   ├── GuaranteeCard.vue     # 📅 Card de garantia
    │   │   ├── MetricsCard.vue       # 📅 Card de métricas
    │   │   └── ConversionChart.vue   # 📅 Gráfico de conversão
    │   │
    │   ├── 📁 opportunities/         # Componentes de oportunidades
    │   │   ├── OpportunityList.vue   # 📅 Lista de oportunidades
    │   │   ├── OpportunityCard.vue   # 📅 Card individual
    │   │   ├── OpportunityDetail.vue # 📅 Detalhes completos
    │   │   ├── MessageThread.vue     # 📅 Thread de mensagens
    │   │   └── OpportunityFilters.vue# 📅 Filtros e busca
    │   │
    │   ├── 📁 agents/                # Componentes de agentes IA
    │   │   ├── AgentList.vue         # 📅 Lista de agentes
    │   │   ├── AgentForm.vue         # 📅 Formulário de criação
    │   │   └── AgentCard.vue         # 📅 Card de agente
    │   │
    │   └── 📁 shared/                # Componentes compartilhados
    │       ├── Button.vue            # 🚧 Botão customizado
    │       ├── Input.vue             # 🚧 Input customizado
    │       ├── Modal.vue             # 🚧 Modal genérico
    │       ├── Card.vue              # 🚧 Card genérico
    │       └── Toast.vue             # 🚧 Notificações
    │
    ├── 📁 composables/               # 🔧 Lógica reutilizável (Composition API)
    │   ├── useAuth.js                # ✅ Autenticação
    │   ├── useDashboard.js           # 📅 Lógica do dashboard
    │   ├── useOpportunities.js       # 📅 Gestão de oportunidades
    │   ├── useAgents.js              # 📅 Gestão de agentes
    │   ├── useGuarantee.js           # 📅 Cálculos de garantia
    │   └── useRealtime.js            # 📅 Subscriptions Supabase
    │
    ├── 📁 stores/                    # 📦 State Management (Pinia)
    │   ├── useAuthStore.js           # ✅ Estado de autenticação
    │   ├── useDashboardStore.js      # 📅 Estado do dashboard
    │   └── useOpportunitiesStore.js  # 📅 Estado de oportunidades
    │
    ├── 📁 router/                    # 🔀 Configuração de rotas
    │   └── index.js                  # ✅ Definição de rotas + guards
    │
    ├── 📁 utils/                     # 🛠️ Funções auxiliares
    │   ├── supabase.js               # ✅ Cliente Supabase
    │   ├── formatters.js             # 🚧 Formatação de dados
    │   ├── validators.js             # 🚧 Validações
    │   ├── constants.js              # 🚧 Constantes globais
    │   └── helpers.js                # 🚧 Funções auxiliares


```

**Legenda de Status**:
- ✅ **Implementado**: Código pronto e funcional
- 🚧 **Em Progresso**: Desenvolvimento iniciado
- 📅 **Planejado**: Ainda não iniciado

---

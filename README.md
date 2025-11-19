# 🚀 Recupera.IA

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat-square&logo=vue.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)
![Status](https://img.shields.io/badge/Status-MVP%20Development-orange?style=flat-square)

**Plataforma SaaS de Recuperação Automatizada de Vendas com IA**

Transforme "quase-clientes" em faturamento real através de agentes conversacionais inteligentes no WhatsApp.

</div>

---

## 📖 Sobre o Projeto

**Recupera.IA** é uma plataforma SaaS focada em infoprodutores e e-commerce que utiliza Inteligência Artificial para recuperar vendas automaticamente através do WhatsApp Business API.

### 💎 Proposta de Valor

> *"Recuperamos o dobro do seu investimento ou devolvemos 100% do seu dinheiro"*

### ✨ Funcionalidades Principais

- 🤖 **Agentes IA Personalizáveis** - Configure prompts, tom de voz e objetivos
- 💬 **WhatsApp Business API** - Automação via API oficial do Meta
- 📊 **Dashboard em Tempo Real** - Métricas de conversão e oportunidades
- 🎯 **Sistema de Garantia** - Tracking de ROI com garantia de 90 dias
- 🔗 **Integrações Nativas** - Webhooks para plataformas de checkout
- 📈 **Gestão Completa de Leads** - Funil de vendas end-to-end

---

## 🚀 Quick Start

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/recupera-ia.git
cd recupera-ia

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Execute o projeto
npm run dev
```

Acesse: `http://localhost:5173`

---

## 📚 Documentação

### 📑 Índice de Documentos

| Documento | Descrição |
|-----------|-----------|
| **[📐 ARCHITECTURE.md](./docs/ARCHITECTURE.md)** | Arquitetura completa do sistema, stack tecnológica e decisões de design |
| **[📊 DATABASE.md](./docs/DATABASE.md)** | Schema do banco de dados, relacionamentos e políticas RLS |
| **[🔄 DIAGRAMS.md](./docs/DIAGRAMS.md)** | Diagramas de entidades, fluxos e sequências |
| **[🗂️ PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md)** | Estrutura de pastas, convenções e organização do código |
| **[🔌 INTEGRATIONS.md](./docs/INTEGRATIONS.md)** | Documentação de integrações (WhatsApp, N8N, Checkouts) |

---

## 🛠️ Stack Tecnológica

- **Frontend**: Vue.js 3 (Composition API) + Vite + TailwindCSS
- **State Management**: Pinia
- **Backend/Database**: Supabase (PostgreSQL + Auth + Realtime)
- **Automação**: N8N (Self-hosted)
- **IA**: Gemini / Anthropic Claude
- **Messaging**: WhatsApp Business API (Oficial)

---

## 📊 Status do MVP (Sprint 7 Dias)

| Dia | Módulo | Status |
|-----|--------|--------|
| 1 | Setup + Autenticação | ✅ |
| 2 | Banco de Dados + Dashboard Base | 🚧 |
| 3 | Visualização de Garantia | 📅 |
| 4 | Gerenciamento de Leads | 📅 |
| 5 | N8N + Integrações | 📅 |
| 6 | WhatsApp API + IA | 📅 |
| 7 | Gestão de Agentes + Testes | 📅 |

**Legenda**: ✅ Concluído | 🚧 Em Progresso | 📅 Planejado

---

## 🏗️ Estrutura do Projeto

```
recupera-ia/
├── docs/                    # 📚 Documentação técnica
├── public/                  # Assets estáticos
├── src/
│   ├── assets/             # Imagens, ícones, estilos
│   ├── components/         # Componentes Vue
│   │   ├── all/           # Componentes globais
│   │   └── dashboard/     # Componentes do dashboard
│   ├── composables/       # Lógica reutilizável
│   ├── router/            # Configuração de rotas
│   ├── stores/            # State management (Pinia)
│   ├── utils/             # Funções auxiliares
│   └── main.js
├── .env                   # Variáveis de ambiente
└── package.json
```

Veja [PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) para detalhes completos.

---

## 🔐 Variáveis de Ambiente

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

## 🎯 Informações

**Versão**: 0.0.1 (MVP)  
**Última Atualização**: Novembro 2025  
**Status**: Em Desenvolvimento Ativo

---

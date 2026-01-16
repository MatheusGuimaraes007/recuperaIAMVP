import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/useAuthStore.js";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../components/all/Login.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/admin/cadastro",
    name: "Cadastro",
    component: () => import("../components/all/Cadastro.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/recuperar-senha",
    name: "RecuperarSenha",
    component: () => import("../components/all/RecuperarSenha.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/redefinir-senha",
    name: "RedefinirSenha",
    component: () => import("../components/all/RedefinirSenha.vue"),
    meta: { public: true },
  },
  {
    path: "/reset-password",
    redirect: "/redefinir-senha",
  },

  // --- Rotas Administrativas ---
  {
    path: "/admin/dashboard",
    name: "AdminDashboard",
    component: () => import("../components/adm/AdminDashboard.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  
  // Rotas Admin - Gestão de Clientes
  {
    path: "/admin/clientes",
    name: "AdminClientes",
    component: () => import("../components/adm/AdminClientsList.vue"),
    meta: { 
      requiresAuth: true, 
      requiresAdmin: true,
      title: "Gestão de Clientes"
    },
  },
  {
    path: "/admin/dashboard/:clientId",
    name: "AdminClientDashboard",
    component: () => import("../components/adm/AdminClientDashboard.vue"),
    meta: { 
      requiresAuth: true, 
      requiresAdmin: true,
      title: "Dashboard do Cliente"
    },
  },
  {
    path: "/admin/oportunidades/:clientId",
    name: "AdminClientOpportunities",
    component: () => import("../components/adm/AdminClientOpportunities.vue"),
    meta: { 
      requiresAuth: true, 
      requiresAdmin: true,
      title: "Oportunidades do Cliente"
    },
  },
  {
    path: "/admin/contatos/:clientId",
    name: "AdminClientContacts",
    component: () => import("../components/adm/AdminClientContacts.vue"),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: "Contatos do Cliente"
    }
  },
  {
      path: "/admin/conhecimento/:baseId",
      name: "AdminClientKnowledgeBases",
      component: () => import("../components/conhecimento/adm/EditarBaseConhecimento.vue"),
      meta: { 
      requiresAuth: true, 
      requiresAdmin: true,
      title: "Editar Base de Conhecimento"
    },
  },
  {
      path: "/admin/produtos",
      name: "AdminProdutos",
      component: () => import("../components/produtos/adm/AdminProdutos.vue"),
      meta: { 
      requiresAuth: true, 
      requiresAdmin: true,
      title: "Todos os Produtos"
    },
  },

  // --- Rotas de Usuário / Plataforma ---
  {
    path: "/clientes",
    name: "Clientes",
    component: () => import("../components/clientes/ClientesList.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/clientes/:id",
    name: "ClientDetail",
    component: () => import("../components/clientes/ClientesDetail.vue"),
    meta: {
      requiresAuth: true,
      title: "Detalhes do Cliente",
    },
  },
  {
    path: '/admin/agents',
    name: 'agents',
    component: () => import('../components/agents/AgentsList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/agents/:id',
    name: 'agent-detail',
    component: () => import('../components/agents/AgentDetail.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/agents/novo', 
    name: 'AdminAgentCreate',
    component: () => import('../components/agents/AgentCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/agents/:id/editar', // Rota com parâmetro ID
    name: 'AdminAgentEdit',
    component: () => import('../components/agents/AgentEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/admin/conhecimento",
    name: "BaseConhecimento",
    component: () => import("../components/conhecimento/adm/BaseConhecimento.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/oportunidades",
    name: "Oportunidades",
    component: () => import("../components/opportunities/OpportunityList.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/conhecimento",
    name: "ClienteBaseConhecimento",
    component: () => import("../components/conhecimento/cliente/ClienteBaseConhecimento.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/oportunidades/:id",
    name: "OpportunityDetail",
    component: () => import("../components/opportunities/OpportunityDetail.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    console.log('🔍 Router Guard:', {
        to: to.name,
        from: from.name,
        hasSession: !!authStore.session,
        loading: authStore.loading
    });

    if (!authStore.session && !authStore.loading) {
        console.log('⏳ Inicializando autenticação...');
        await authStore.initializeAuth();
    }

    let timeout = 0;
    while (authStore.loading && timeout < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        timeout++;
    }

    const isAuthenticated = authStore.isAuthenticated;
    const isAdmin = authStore.isAdmin;

    if (to.meta.public) {
        console.log('✅ Rota pública, permitindo acesso');
        return next();
    }

    if (to.meta.requiresAuth && !isAuthenticated) {
        console.log('🚫 Não autenticado, redirecionando para Login');
        return next({ name: 'Login' });
    }

    if (to.meta.requiresAdmin && !isAdmin) {
        console.log('🚫 Não é admin, redirecionando para Oportunidades');
        return next({ name: 'Oportunidades' });
    }

    if (to.meta.requiresGuest && isAuthenticated) {
        if (isAdmin) {
            return next({ name: 'AdminDashboard' });
        } else {
            return next({ name: 'Oportunidades' });
        }
    }

    next();
});

export default router;
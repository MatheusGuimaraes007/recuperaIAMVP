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
    path: "/cadastro",
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
    path: "/adm/dashboard",
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
    path: '/agents',
    name: 'agents',
    component: () => import('../components/agents/AgentsList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/agentes/:id',
    name: 'agent-detail',
    component: () => import('../components/agents/AgentDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/conhecimento",
    name: "BaseConhecimento",
    component: () => import("../components/conhecimento/BaseConhecimento.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/oportunidades",
    name: "Oportunidades",
    component: () => import("../components/opportunities/OpportunityList.vue"),
    meta: { requiresAuth: true },
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

// Guard de Navegação Unificado
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // Inicializa a sessão se ainda não estiver carregada
    if (!authStore.session && !authStore.loading) {
        await authStore.initializeAuth();
    }

    const isAuthenticated = authStore.isAuthenticated;
    const isAdmin = authStore.isAdmin;

    // Rota pública permite acesso direto
    if (to.meta.public) {
        return next();
    }

    // Rota requer Auth e usuário não está logado -> Login
    if (to.meta.requiresAuth && !isAuthenticated) {
        return next({ name: 'Login' });
    }

    // Rota requer Admin e usuário não é Admin -> Redireciona para área do usuário
    if (to.meta.requiresAdmin && !isAdmin) {
        return next({ name: 'Oportunidades' });
    }

    // Rota requer Guest (Login/Register) mas usuário já está logado
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
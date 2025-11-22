<<<<<<< Updated upstream
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

  {
    path: "/adm/dashboard",
    name: "AdminDashboard",
    component: () => import("../components/adm/AdminDashboard.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },

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
    // {
    //     path: '/agentes/novo',
    //     name: 'agent-create',
    //     component: () => import('../components/agents/AgentForm.vue'), // Criar depois
    //     meta: { requiresAuth: true }
    // },
    // {
    //     path: '/agentes/:id/editar',
    //     name: 'agent-edit',
    //     component: () => import('../components/agents/AgentForm.vue'), // Criar depois
    //     meta: { requiresAuth: true }
    // },
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

=======
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore.js';
import Login from '../components/all/Login.vue';
import Cadastro from '../components/all/Cadastro.vue';
import RecuperarSenha from '../components/all/RecuperarSenha.vue';
import RedefinirSenha from '../components/all/RedefinirSenha.vue';
import Dashboard from '../components/dashboard/Dashboard.vue';

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { requiresGuest: true }
    },
    {
        path: '/cadastro',
        name: 'Cadastro',
        component: Cadastro,
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/recuperar-senha',
        name: 'RecuperarSenha',
        component: RecuperarSenha,
        meta: { requiresGuest: true }
    },
    {
        path: '/redefinir-senha',
        name: 'RedefinirSenha',
        component: RedefinirSenha,
        meta: { public: true }
    },
    {
        path: '/reset-password',
        redirect: '/redefinir-senha'
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    }
>>>>>>> Stashed changes
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    if (!authStore.session && !authStore.loading) {
        await authStore.initializeAuth();
    }

    const isAuthenticated = authStore.isAuthenticated;
    const isAdmin = authStore.isAdmin;


    if (to.meta.public) {
        return next();
    }

    if (to.meta.requiresAuth && !isAuthenticated) {
        return next({ name: 'Login' });
    }

    if (to.meta.requiresAdmin && !isAdmin) {
        return next({ name: 'Dashboard' });
    }

    if (to.meta.requiresGuest && isAuthenticated) {
        return next({ name: 'Dashboard' });
    }

    next();
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.session && !authStore.loading) {
    await authStore.initializeAuth();
  }

  const isAuthenticated = authStore.isAuthenticated;
  const isAdmin = authStore.isAdmin;

  if (to.meta.public) {
    return next();
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: "Login" });
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    return next({ name: "Clientes" });
  }

  if (to.meta.requiresGuest && isAuthenticated) {
    return next({ name: "AdminDashboard" });
  }

  next();
});

export default router;
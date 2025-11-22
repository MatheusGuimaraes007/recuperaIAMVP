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
    path: "/agents",
    name: "Agents",
    component: () => import("../components/agents/AgentsList.vue"),
    meta: { requiresAuth: true },
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
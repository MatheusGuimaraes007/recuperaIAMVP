import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore.js';
import Login from '../components/all/Login.vue';
import Cadastro from '../components/all/Cadastro.vue';
import RecuperarSenha from '../components/all/RecuperarSenha.vue';
import RedefinirSenha from '../components/all/RedefinirSenha.vue';
import AdminDashboard from '../components/adm/AdminDashboard.vue';
import OpportunityList from "../components/opportunities/OpportunityList.vue";
import OpportunityDetail from "../components/opportunities/OpportunityDetail.vue";

// Páginas placeholder - você pode criar componentes completos depois
const Clientes = () => import('../components/clientes/ClientesList.vue');
const Agents = () => import('../components/agents/AgentsList.vue');
const BaseConhecimento = () => import('../components/conhecimento/BaseConhecimento.vue');

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
        path: '/adm/dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/clientes',
        name: 'Clientes',
        component: Clientes,
        meta: { requiresAuth: true }
    },
    {
        path: '/agents',
        name: 'Agents',
        component: Agents,
        meta: { requiresAuth: true }
    },
    {
        path: '/conhecimento',
        name: 'BaseConhecimento',
        component: BaseConhecimento,
        meta: { requiresAuth: true }
    },
    {
        path: '/oportunidades',
        name: 'Oportunidades',
        component: OpportunityList,
        meta: { requiresAuth: true }
    },
    {
        path: '/oportunidades/:id',
        name: 'OpportunityDetail',
        component: OpportunityDetail,
        meta: { requiresAuth: true }
    }
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
        return next({ name: 'Clientes' });
    }

    if (to.meta.requiresGuest && isAuthenticated) {
        return next({ name: 'AdminDashboard' });
    }

    next();
});

export default router;
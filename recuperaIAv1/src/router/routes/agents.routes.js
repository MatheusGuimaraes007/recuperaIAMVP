/**
 * Agents Routes
 * Rotas do módulo de Agentes de IA
 *
 * @version 3.0.0
 * @requires auth.guard - Autenticação obrigatória
 * @requires admin.guard - Permissões de administrador
 */

export const agentsRoutes = [
  {
    path: '/admin/agents',
    name: 'agents-list',
    component: () => import('@/pages/agents/AgentsListPage.vue'),
    meta: {
      title: 'Agentes IA',
      requiresAuth: true,
      requiresAdmin: true,
      icon: 'bot',
      layout: 'default'
    }
  },
  {
    path: '/admin/agents/novo',
    name: 'agent-create',
    component: () => import('@/pages/agents/AgentCreatePage.vue'),
    meta: {
      title: 'Novo Agente',
      requiresAuth: true,
      requiresAdmin: true,
      icon: 'plus',
      layout: 'default'
    }
  },
  {
    path: '/admin/agents/:id',
    name: 'agent-detail',
    component: () => import('@/pages/agents/AgentDetailPage.vue'),
    meta: {
      title: 'Detalhes do Agente',
      requiresAuth: true,
      requiresAdmin: true,
      icon: 'eye',
      layout: 'default'
    }
  },
  {
    path: '/admin/agents/:id/editar',
    name: 'agent-edit',
    component: () => import('@/pages/agents/AgentEditPage.vue'),
    meta: {
      title: 'Editar Agente',
      requiresAuth: true,
      requiresAdmin: true,
      icon: 'edit-2',
      layout: 'default'
    }
  }
]

export default agentsRoutes
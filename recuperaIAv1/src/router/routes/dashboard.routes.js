/**
 * Dashboard Routes
 *
 * Rotas do dashboard principal.
 */

export const dashboardRoutes = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/pages/dashboard/DashboardPage.vue'),
    meta: {
      title: 'Dashboard',
      requiresAuth: true,
      icon: 'layout-dashboard',
      breadcrumb: [
        { label: 'Home', to: '/' },
        { label: 'Dashboard' }
      ]
    }
  }
]

export default dashboardRoutes
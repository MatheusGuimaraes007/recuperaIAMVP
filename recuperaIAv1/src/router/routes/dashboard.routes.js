// /**
//  * Dashboard Routes
//  *
//  * Rotas do dashboard principal.
//  */
//
// export const dashboardRoutes = [
//     {
//         path: '/dashboard',
//         name: 'dashboard',
//         component: () => import('@/pages/dashboard/DashboardPage.vue'),
//         meta: {
//             title: 'Dashboard',
//             requiresAuth: true,
//             icon: 'layout-dashboard',
//             breadcrumb: [
//                 { label: 'Home', to: '/' },
//                 { label: 'Dashboard' }
//             ]
//         }
//     },
//     {
//         path: '/dashboard/guarantee',
//         name: 'guarantee',
//         component: () => import('@/pages/dashboard/GuaranteePage.vue'),
//         meta: {
//             title: 'Garantia',
//             requiresAuth: true,
//             icon: 'shield-check',
//             breadcrumb: [
//                 { label: 'Home', to: '/' },
//                 { label: 'Dashboard', to: '/dashboard' },
//                 { label: 'Garantia' }
//             ]
//         }
//     }
// ]
//
// export default dashboardRoutes
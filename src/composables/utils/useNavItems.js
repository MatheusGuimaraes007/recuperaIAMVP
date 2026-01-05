import { computed } from 'vue'
import {useAuth} from "../useAuth.js";

export function useNavItems() {
    const { isAdmin } = useAuth()

    const adminNavItems = [
        {
            name: 'Dashboard',
            path: '/admin/dashboard',
            icon: 'LayoutDashboard'
        },
        {
            name: 'Clientes',
            path: '/admin/clientes',
            icon: 'Users'
        },
        {
            name: 'Oportunidades',
            path: '/admin/oportunidades',
            icon: 'Briefcase'
        },
        {
            name: 'Agentes IA',
            path: '/admin/agents',
            icon: 'Bot'
        },
        {
            name: 'Produtos',
            path: '/admin/produtos',
            icon: 'Package'
        },
        {
            name: 'Base de Conhecimento',
            path: '/admin/conhecimento',
            icon: 'BookOpen'
        }
    ]

    const clientNavItems = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: 'LayoutDashboard'
        },
        {
            name: 'Oportunidades',
            path: '/oportunidades',
            icon: 'Briefcase'
        },
        {
            name: 'Clientes',
            path: '/clientes',
            icon: 'Users'
        },
        {
            name: 'Base de Conhecimento',
            path: '/conhecimento',
            icon: 'BookOpen'
        }
    ]

    const navItems = computed(() => {
        return isAdmin.value ? adminNavItems : clientNavItems
    })

    return {
        navItems
    }
}

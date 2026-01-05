import { computed } from 'vue'
import {useAuth} from "../useAuth.js";

export function useNavItems() {
    const { isAdmin } = useAuth()

    const navItems = computed(() => {
        if (isAdmin.value) {
            return [
                {
                    name: 'Dashboard',
                    path: '/admin/dashboard',
                    icon: 'dashboard'
                },
                {
                    name: 'Cadastro',
                    path: '/admin/cadastro',
                    icon: 'user-plus'
                },
                {
                    name: 'Clientes',
                    path: '/admin/clientes',
                    icon: 'users-cog'
                },
                {
                    name: 'Agents',
                    path: '/admin/agents',
                    icon: 'robot'
                },
                {
                    name: 'Produtos',
                    path: '/admin/produtos',
                    icon: 'box'
                },
                {
                    name: 'Conhecimento',
                    path: '/admin/conhecimento',
                    icon: 'book'
                }
            ]
        }

        return [
            {
                name: 'Oportunidades',
                path: '/oportunidades',
                icon: 'clipboard'
            },
            {
                name: 'Clientes',
                path: '/clientes',
                icon: 'users'
            },
            {
                name: 'Base de Conhecimento',
                path: '/conhecimento',
                icon: 'book'
            }
        ]
    })

    return {
        navItems
    }
}
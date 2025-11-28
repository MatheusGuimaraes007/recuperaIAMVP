<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'
import {
  LayoutDashboard,
  UserPlus,
  Settings,
  Users,
  ClipboardList,
  Bot,
  BookOpen,
  LogOut,
  Shield
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const { user, isAdmin, logout } = useAuth()

const ICON_MAP = {
  'dashboard': LayoutDashboard,
  'user-plus': UserPlus,
  'users-cog': Settings,
  'users': Users,
  'clipboard': ClipboardList,
  'robot': Bot,
  'book': BookOpen
}

const navItems = computed(() => {
  if (isAdmin.value) {
    return [
      { name: 'Dashboard', path: '/adm/dashboard', icon: 'dashboard', adminOnly: true },
      { name: 'Cadastro', path: '/cadastro', icon: 'user-plus', adminOnly: true },
      { name: 'Gestão Clientes', path: '/admin/clientes', icon: 'users-cog', adminOnly: true },
      { name: 'Agents', path: '/agents', icon: 'robot', adminOnly: true },
      { name: 'Base de Conhecimento', path: '/conhecimento', icon: 'book', adminOnly: true },
    ]
  }
  return [
    { name: 'Oportunidades', path: '/oportunidades', icon: 'clipboard', adminOnly: false },
    { name: 'Clientes', path: '/clientes', icon: 'users', adminOnly: false },
  ]
})

const isActive = (path) => route.path === path

const navigate = (path) => router.push(path)

const handleLogout = async () => {
  const result = await logout()
  if (result.success) router.push('/login')
}

const dashboardPath = computed(() => {
  return isAdmin.value ? '/adm/dashboard' : '/oportunidades'
})

const getIconComponent = (iconName) => {
  return ICON_MAP[iconName] || Users
}
</script>

<template>
  <header class="border-b border-border sticky top-0 z-50 bg-background-card backdrop-blur-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">

        <!-- Logo e Título -->
        <div class="flex items-center">
          <div class="flex items-center cursor-pointer group" @click="navigate(dashboardPath)">
            <h1 class="text-2xl font-bold">
              <span class="text-white group-hover:text-gray-200 transition-colors">recupera</span>
              <span class="text-primary group-hover:text-primary-hover transition-colors">.ia</span>
            </h1>
          </div>

          <div class="h-8 w-px bg-gray-700 opacity-50 mx-4 hidden sm:block"></div>

          <div class="hidden sm:flex flex-col ml-2">
            <span class="text-white text-sm font-medium">
              {{ isAdmin ? 'Dashboard Interno' : 'Painel do Cliente' }}
            </span>
            <span class="text-xs text-gray-500">
              {{ isAdmin ? 'Gestão de Clientes' : 'Recuperação de Vendas' }}
            </span>
          </div>
        </div>

        <!-- Navegação Central -->
        <nav class="hidden md:flex items-center space-x-1">
          <button
              v-for="item in navItems"
              :key="item.path"
              @click="navigate(item.path)"
              class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
              :class="isActive(item.path)
              ? 'bg-primary-200 text-primary border border-primary-300'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'"
          >
            <component :is="getIconComponent(item.icon)" :size="16" />
            <span class="hidden lg:inline">{{ item.name }}</span>
          </button>
        </nav>

        <!-- User Info e Ações -->
        <div class="flex items-center space-x-4">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-medium text-white">{{ user?.name }}</p>
            <p class="text-xs text-gray-400">{{ user?.email }}</p>
          </div>

          <div class="flex items-center space-x-2">
            <!-- Admin Badge -->
            <span
                v-if="isAdmin"
                class="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 bg-metric-purple-light text-metric-purple border border-metric-purple-border"
            >
              <Shield :size="12" />
              <span class="hidden sm:inline">Admin</span>
            </span>

            <!-- Logout Button -->
            <button
                @click="handleLogout"
                class="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white cursor-pointer"
                title="Sair"
            >
              <LogOut :size="20" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <nav class="md:hidden flex items-center justify-around py-2 border-t border-gray-800 -mx-4 px-4">
        <button
            v-for="item in navItems"
            :key="item.path"
            @click="navigate(item.path)"
            class="p-2 rounded-lg transition-all duration-200 flex flex-col items-center gap-1"
            :class="isActive(item.path) ? 'text-primary' : 'text-gray-400'"
        >
          <component :is="getIconComponent(item.icon)" :size="20" />
          <span class="text-[10px]">{{ item.name.split(' ')[0] }}</span>
        </button>
      </nav>
    </div>
  </header>
</template>
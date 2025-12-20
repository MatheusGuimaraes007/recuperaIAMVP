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
      { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard', adminOnly: true },
      { name: 'Cadastro', path: '/admin/cadastro', icon: 'user-plus', adminOnly: true },
      { name: 'Clientes', path: '/admin/clientes', icon: 'users-cog', adminOnly: true },
      { name: 'Agents', path: '/admin/agents', icon: 'robot', adminOnly: true },
      { name: 'Produtos', path: '/admin/produtos', icon: 'box', adminOnly: true },
      { name: 'Conhecimento', path: '/admin/conhecimento', icon: 'book', adminOnly: true },
    ];
  }
  
  return [
    { name: 'Oportunidades', path: '/oportunidades', icon: 'clipboard', adminOnly: false },
    { name: 'Clientes', path: '/clientes', icon: 'users', adminOnly: false },
    { name: 'Base de Conhecimento', path: '/conhecimento', icon: 'book', adminOnly: false}
  ];
});

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
              class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer"
              :class="isActive(item.path)
              ? 'bg-primary-200 text-primary border border-primary-300'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'"
          >
            <!-- Dashboard Icon -->
            <svg v-if="item.icon === 'dashboard'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            
            <!-- User Plus Icon -->
            <svg v-if="item.icon === 'user-plus'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            
            <!-- Users Cog Icon (Admin Clients Management) -->
            <svg v-if="item.icon === 'users-cog'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            
            <!-- Users Icon -->
            <svg v-if="item.icon === 'users'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            
            <!-- Clipboard Icon (Opportunities) -->
            <svg v-if="item.icon === 'clipboard'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            
            <!-- Robot Icon -->
            <svg v-if="item.icon === 'robot'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <svg v-if="item.icon === 'box'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <!-- Book Icon -->
            <svg v-if="item.icon === 'book'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            
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
            class="p-2 rounded-lg transition-all duration-200 flex flex-col items-center gap-1 cursor-pointer"
            :class="isActive(item.path) ? 'text-[#7cba10]' : 'text-gray-400'"
        >
          <!-- Dashboard Icon -->
          <svg v-if="item.icon === 'dashboard'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          
          <!-- User Plus Icon -->
          <svg v-if="item.icon === 'user-plus'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          
          <!-- Users Cog Icon -->
          <svg v-if="item.icon === 'users-cog'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          
          <!-- Users Icon -->
          <svg v-if="item.icon === 'users'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          
          <!-- Clipboard Icon -->
          <svg v-if="item.icon === 'clipboard'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          
          <!-- Robot Icon -->
          <svg v-if="item.icon === 'robot'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          
          <svg v-if="item.icon === 'box'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>

          <!-- Book Icon -->
          <svg v-if="item.icon === 'book'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          
          <span class="text-[10px]">{{ item.name.split(' ')[0] }}</span>
        </button>
      </nav>
    </div>
  </header>
</template>
<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {useAuth} from "../composables/useAuth.js";

const router = useRouter();
const route = useRoute();
const { user, isAdmin, logout } = useAuth();

const navItems = computed(() => {
  const items = [
    { name: 'Dashboard', path: '/adm/dashboard', icon: 'dashboard' },
    { name: 'Clientes', path: '/clientes', icon: 'users' },
    { name: 'Agents', path: '/agents', icon: 'robot' },
    { name: 'Base de Conhecimento', path: '/conhecimento', icon: 'book' },
  ];

  if (isAdmin.value) {
    items.splice(1, 0, { name: 'Cadastro', path: '/cadastro', icon: 'user-plus' });
  }

  return items;
});

const isActive = (path) => route.path === path;

const navigate = (path) => router.push(path);

const handleLogout = async () => {
  const result = await logout();
  if (result.success) router.push('/login');
};
</script>

<template>
  <header class="border-b sticky top-0 z-50" style="background-color: var(--color-background4); border-color: var(--color-border1)">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">

        <!-- Logo e Título -->
        <div class="flex items-center">
          <div class="flex items-center cursor-pointer" @click="navigate('/adm/dashboard')">
            <h1 class="text-2xl font-bold">
              <span class="text-white">recupera</span>
              <span style="color: var(--color-text1)">.ia</span>
            </h1>
          </div>
          <hr class="mx-4 h-8 border-l border-gray-700 opacity-50 hidden sm:block"/>
          <div class="hidden sm:flex flex-col ml-2">
            <span class="text-white text-sm">Dashboard Interno</span>
            <span class="text-xs text-gray-500">Gestão de Clientes</span>
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
              ? 'bg-[#7cba10]/20 text-[#7cba10] border border-[#7cba10]/30'
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
            <!-- Users Icon -->
            <svg v-if="item.icon === 'users'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <!-- Robot Icon -->
            <svg v-if="item.icon === 'robot'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
            <span v-if="isAdmin" class="px-2 py-1 rounded text-xs font-medium" style="background-color: var(--color-border1); color: var(--color-text1)">
              Admin
            </span>
            <button
                @click="handleLogout"
                class="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white cursor-pointer"
                title="Sair"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
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
            :class="isActive(item.path) ? 'text-[#7cba10]' : 'text-gray-400'"
        >
          <svg v-if="item.icon === 'dashboard'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <svg v-if="item.icon === 'user-plus'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <svg v-if="item.icon === 'users'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-if="item.icon === 'robot'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <svg v-if="item.icon === 'book'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span class="text-[10px]">{{ item.name.split(' ')[0] }}</span>
        </button>
      </nav>
    </div>
  </header>
</template>
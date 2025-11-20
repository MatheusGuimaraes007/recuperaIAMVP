<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';
import GuaranteeCard from './GuaranteeCard.vue';

const router = useRouter();
const { user, isAdmin, logout } = useAuth();

const handleLogout = async () => {
  const result = await logout();
  if (result.success) {
    router.push('/login');
  }
};

const goToCadastro = () => {
  router.push('/cadastro');
};
</script>

<template>
  <div class="min-h-screen" style="background-color: var(--color-background3)">

    <header class="border-b" style="background-color: var(--color-background4); border-color: rgba(124, 186, 16, 0.2)">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">

          <div class="flex items-center">
            <h1 class="text-2xl font-bold">
              <span class="text-white">recupera</span><span style="color: var(--color-text1)">.ia</span>
            </h1>
          </div>

          <div class="flex items-center space-x-4">
            <div class="text-right">
              <p class="text-sm font-medium text-white">{{ user?.name }}</p>
              <p class="text-xs text-gray-400">{{ user?.email }}</p>
            </div>

            <div class="flex items-center space-x-2">
              <span v-if="isAdmin"
                    class="px-2 py-1 rounded text-xs font-medium"
                    style="background-color: rgba(124, 186, 16, 0.2); color: var(--color-text1)">
                Admin
              </span>

              <button
                  v-if="isAdmin"
                  @click="goToCadastro"
                  class="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
                  title="Cadastrar novo usuário"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </button>

              <button
                  @click="handleLogout"
                  class="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
                  title="Sair"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div class="rounded-2xl p-8 mb-8 border"
           style="background-color: var(--color-background4); border-color: rgba(124, 186, 16, 0.2)">
        <h2 class="text-3xl font-bold text-white mb-2">
          Bem-vindo, {{ user?.name }}!
        </h2>
        <p class="text-gray-400">
          Este é seu dashboard. Aqui você terá acesso a todas as funcionalidades do sistema.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div class="rounded-xl p-6 border"
             style="background-color: var(--color-background4); border-color: rgba(124, 186, 16, 0.2)">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-white">Status</h3>
            <div class="w-10 h-10 rounded-full flex items-center justify-center"
                 style="background-color: rgba(124, 186, 16, 0.2)">
              <svg class="w-6 h-6" style="color: var(--color-text1)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold" style="color: var(--color-text1)">{{ user?.status }}</p>
          <p class="text-sm text-gray-400 mt-1">Conta ativa</p>
        </div>

        <div class="rounded-xl p-6 border"
             style="background-color: var(--color-background4); border-color: rgba(124, 186, 16, 0.2)">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-white">Perfil</h3>
            <div class="w-10 h-10 rounded-full flex items-center justify-center"
                 style="background-color: rgba(124, 186, 16, 0.2)">
              <svg class="w-6 h-6" style="color: var(--color-text1)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-white">{{ user?.role }}</p>
          <p class="text-sm text-gray-400 mt-1">Tipo de usuário</p>
        </div>

        <div class="rounded-xl p-6 border"
             style="background-color: var(--color-background4); border-color: rgba(124, 186, 16, 0.2)">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-white">Contato</h3>
            <div class="w-10 h-10 rounded-full flex items-center justify-center"
                 style="background-color: rgba(124, 186, 16, 0.2)">
              <svg class="w-6 h-6" style="color: var(--color-text1)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-white">{{ user?.phone || 'N/A' }}</p>
          <p class="text-sm text-gray-400 mt-1">Telefone</p>
        </div>
      </div>

      <div v-if="isAdmin" class="rounded-2xl p-8 border"
           style="background-color: var(--color-background4); border-color: rgba(124, 186, 16, 0.2)">
        <h3 class="text-xl font-bold text-white mb-4">Ações de Administrador</h3>
        <div class="flex flex-wrap gap-4">
          <button
              @click="goToCadastro"
              class="px-6 py-3 rounded-lg font-semibold text-black transition-all duration-200 hover:opacity-90 flex items-center"
              style="background-color: var(--color-text1)"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Cadastrar novo usuário
          </button>
        </div>
      </div>
    </main>

    <GuaranteeCard />
  </div>
</template>

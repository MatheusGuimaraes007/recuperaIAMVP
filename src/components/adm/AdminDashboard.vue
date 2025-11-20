<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';
import { useAdminDashboard } from '../../composables/useAdminDashboard';
import { onMounted } from 'vue';

const router = useRouter();
const { user, isAdmin, logout } = useAuth();
const {fetchMonthlyRevenue, montlyRevenue} = useAdminDashboard();

onMounted(async () => {
  await fetchMonthlyRevenue()
})
console.log(montlyRevenue);
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

    <header class="border-b" style="background-color: var(--color-background4); border-color: var(--color-border1)">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">

          <div class="flex justify-start items-center w-[50%]">
            <div class="flex items-center">
            <h1 class="text-2xl font-bold">
              <span class="text-white">recupera</span><span style="color: var(--color-text1)">.ia</span>
            </h1>
          </div>
          <hr class="mx-4 h-8 border-l ml-6 border-background1 opacity-50"/>
          <div class="flex flex-col ml-6">
            <span class="text-white">Dashboard Interno</span>
            <span class="text-xs text-gray-500">Gestão de Clientes</span>
          </div>
          </div>

          <div class="flex items-center space-x-4">
            <div class="text-right">
              <p class="text-sm font-medium text-white">{{ user?.name }}</p>
              <p class="text-xs text-gray-400">{{ user?.email }}</p>
            </div>

            <div class="flex items-center space-x-2">
              <span v-if="isAdmin"
                    class="px-2 py-1 rounded text-xs font-medium"
                    style="background-color: var(--color-border1); color: var(--color-text1)">
                Admin
              </span>

              <button
                  v-if="isAdmin"
                  @click="goToCadastro"
                  class="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white cursor-pointer"
                  title="Cadastrar novo usuário"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </button>

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
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      

      <div class="rounded-2xl p-8 mb-8 border"
           style="background-color: var(--color-background4); border-color: var(--color-border1)">
        <h2 class="text-3xl font-bold text-white mb-2">
          Bem-vindo, {{ user?.name }}!
        </h2>
        <p class="text-gray-400">
          Este é seu dashboard. Aqui você terá acesso a todas as funcionalidades do sistema.
        </p>
      </div>

      <div v-if="isAdmin" class="rounded-2xl p-8 mb-8 border"
           style="background-color: var(--color-background4); border-color: var(--color-border1)">
        <h3 class="text-xl font-bold text-white mb-4">Ações de Administrador</h3>
        <div class="flex flex-wrap gap-4">
          <button
              @click="goToCadastro"
              class="px-6 py-3 rounded-lg font-semibold text-black transition-all duration-200 hover:opacity-90 flex items-center cursor-pointer"
              style="background-color: var(--color-text1)"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Cadastrar novo usuário
          </button>
        </div>
      </div>

      <div v-if="isAdmin" class="rounded-2xl p-8 mb-8 border"
           style="background-color: var(--color-background4); border-color: var(--color-border1)">
        <h3 class="text-3xl font-bold text-white mb-4">Visão Geral da Receita Recupera.ia</h3>
        <div v-if="isAdmin" class="rounded-2xl p-8 border">
      </div>
        <div class="p-8 mb-8 border-b-2 flex flex-wrap gap-4 justify-center items-center"
           style="background-color: var(--color-background4); border-color: var(--color-border1)">
          <div class="rounded-2xl p-5 border flex-1/4 flex flex-col gap-4 h-full"
           style="background-color: var(--color-background3); border-color: var(--color-border1)">
           <div>
            <span class="text-white text-sm flex items-center"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9" />
            </svg>Faturamento Mensalidade</span>
           </div>
           <div class="flex justify-between items-center bet">
            <span class="text-white text-2xl font-bold" style="color: var(--color-text1);">{{ montlyRevenue }}</span>
            <span class="text-white text-[15px]" style="color: var(--color-background1);">12%</span>
           </div>
           <div>
            <span class="text-white text-[12px]">Últimos 7 dias</span>
           </div>
        </div>
        <div class="rounded-2xl p-2 border flex-1/4"
           style="background-color: var(--color-background3); border-color: var(--color-border1)">
           
        </div>
        <div class="rounded-2xl p-2 border flex-1/4"
           style="background-color: var(--color-background3); border-color: var(--color-border1)">
        </div>
        <div class="rounded-2xl p-2 border flex-1/4"
           style="background-color: var(--color-background3); border-color: var(--color-border1)">
        </div>
        <div class="rounded-2xl p-2 border flex-1/4"
           style="background-color: var(--color-background3); border-color: var(--color-border1)">
        </div>
        </div>
      </div>

      

      
    </main>
  </div>
</template>
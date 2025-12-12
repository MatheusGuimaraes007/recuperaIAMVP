<script setup>
import { ref } from 'vue';
import Navbar from '../../../shared/Navbar.vue';
import Card from '../../../shared/Card.vue';
import Button from '../../../shared/Button.vue';
import ClienteModalCriarBaseConhecimento from './ClienteModalCriarBaseConhecimento.vue';

const props = defineProps({
  pageTitle: { type: String, default: 'Administre suas bases de conhecimento' },
  pageDescription: { type: String, default: 'Criação da base de conhecimento para os agents' },
  pageIcon: { type: String, default: 'default' }
});

const isModalOpen = ref(true);

function openModal() {
  isModalOpen.value = true;
}
</script>

<template>
  <div class="min-h-screen" style="background-color: var(--color-background3)">
    <Navbar />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card padding="lg" class="mb-8">
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-xl" style="background-color: rgba(124, 186, 16, 0.1)">
            <svg class="w-8 h-8" style="color: var(--color-text1)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h2 class="text-3xl font-bold text-white">{{ pageTitle }}</h2>
            <p class="text-gray-400">{{ pageDescription }}</p>
          </div>
        </div>
      </Card>

      <div class="flex justify-between items-center mb-6">
        <div class="flex gap-3">
          <Button variant="primary" @click="openModal" class="cursor-pointer">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Novo
          </Button>
          <Button variant="secondary" class="cursor-pointer">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtrar
          </Button>
        </div>
        <div class="relative">
          <input
              type="text"
              placeholder="Buscar..."
              class="px-4 py-2 pl-10 rounded-lg border border-gray-700 focus:ring-2 focus:outline-none transition-colors w-64"
              style="background-color: var(--color-background2); color: white; border-color: var(--color-border1); --tw-ring-color: var(--color-text1)"
          />
          <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <Card padding="none">
        <div class="flex flex-col items-center justify-center py-16 text-center">
          <div class="p-4 rounded-full mb-4" style="background-color: rgba(124, 186, 16, 0.1)">
            <svg class="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">Nenhum item encontrado</h3>
          <p class="text-gray-400 mb-6 max-w-md">
            Comece adicionando seu primeiro item clicando no botão acima.
          </p>
          <Button variant="ghost" class="cursor-pointer">
            Saiba mais
          </Button>
        </div>
      </Card>
    </main>
    
    <ClienteModalCriarBaseConhecimento :aberto="isModalOpen" @close="isModalOpen = false" /> 
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '../../../shared/Navbar.vue';
import Card from '../../../shared/Card.vue';
import Button from '../../../shared/Button.vue';
// Cliente não pode criar bases aqui; usamos apenas listagem/edição
import { useBaseConhecimento } from '../../../composables/useBaseConhecimento';

const props = defineProps({
  pageTitle: { type: String, default: 'Administre suas bases de conhecimento' },
  pageDescription: { type: String, default: 'Criação da base de conhecimento para os agents' },
  pageIcon: { type: String, default: 'default' }
});

const route = useRoute();
const { allKnowledgeBases, fetchAllKnowledgeBases, loading } = useBaseConhecimento();

// no modal creation for clients

async function loadBasesForQuery() {
  const clientId = route.query.clientId;
  if (clientId) {
    await fetchAllKnowledgeBases({ userId: clientId });
  } else {
    await fetchAllKnowledgeBases();
  }
}

onMounted(() => {
  loadBasesForQuery();
});

watch(() => route.query.clientId, () => {
  loadBasesForQuery();
});
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
        <div class="py-6">
          <div v-if="loading" class="flex items-center justify-center py-12">
            <svg class="animate-spin h-10 w-10 text-gray-400" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </div>

          <div v-else>
            <div v-if="allKnowledgeBases.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
              <div class="p-4 rounded-full mb-4" style="background-color: rgba(124, 186, 16, 0.1)">
                <svg class="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-2">Nenhuma base encontrada</h3>
              <p class="text-gray-400 mb-6 max-w-md">Não há bases de conhecimento associadas a este cliente.</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              <div v-for="base in allKnowledgeBases" :key="base.id" class="bg-background2 border border-white/5 rounded-xl p-5 flex flex-col h-full">
                <div class="flex-1">
                  <h4 class="text-lg font-bold text-white mb-2">{{ base.name }}</h4>
                  <p class="text-sm text-gray-400 mb-4">Produto: {{ base.product?.name || '—' }}</p>
                  <p class="text-xs text-gray-400">Criado em: {{ new Date(base.created_at).toLocaleDateString() }}</p>
                </div>
                <div class="mt-4 flex gap-2">
                  <router-link :to="{ name: 'ClienteEditarBase', params: { baseId: base.id } }">
                    <Button variant="primary">Abrir</Button>
                  </router-link>
                  <Button variant="ghost">Saiba mais</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </main>
    
    <!-- Clientes não podem criar bases aqui; apenas visualizar/editar as associadas -->
  </div>
</template>
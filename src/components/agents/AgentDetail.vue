<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAgents } from '../../composables/useAgents';
import Card from '../../shared/Card.vue';
import LoadingState from '../../shared/LoadingState.vue';
import Button from '../../shared/Button.vue';
import Navbar from '../../shared/Navbar.vue';
import { formatDate } from '../../utils/formatters';

const route = useRoute();
const router = useRouter();

const {
  currentAgent,
  loading,
  fetchAgentById,
  fetchAgentMetrics,
  formatTokens,
  calculateTokenCost,
  whatsappStatusConfig,
  getAIModelLabel,
  getToneOfVoiceLabel,
  formatWhatsappNumber,
  getAgentHealth
} = useAgents();

const agentId = computed(() => parseInt(route.params.id));
const metrics = ref(null);

onMounted(async () => {
  await loadAgentDetails();
});

const loadAgentDetails = async () => {
  await fetchAgentById(agentId.value);

  const metricsResult = await fetchAgentMetrics(agentId.value);
  if (metricsResult.success) {
    metrics.value = metricsResult.data;
  }
};

const handleBack = () => {
  router.push('/admin/agents');
};

const handleEdit = () => {
  router.push(`/admin/agents/${agentId.value}/editar`);
};

const healthStatus = computed(() => {
  if (!metrics.value) return null;
  return getAgentHealth(metrics.value);
});
</script>

<template>
  <div class="min-h-screen" style="background-color: var(--color-background3)">
    <Navbar />

    <div class="p-6">
      <div class="max-w-[1400px] mx-auto">
        <!-- Header -->
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button
                @click="handleBack"
                class="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 class="text-3xl font-bold text-white">
                {{ currentAgent?.name || 'Carregando...' }}
              </h1>
              <p class="text-gray-400 text-sm mt-1">
                Detalhes e métricas do agente
              </p>
            </div>
          </div>

          <Button @click="handleEdit" class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Editar Agente</span>
          </Button>
        </div>

        <!-- Loading State -->
        <LoadingState v-if="loading" message="Carregando detalhes do agente..." />

        <!-- Content -->
        <div v-else-if="currentAgent" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Coluna Principal -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Informações Básicas -->
            <Card padding="lg">
              <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <svg class="w-6 h-6 text-[#7cba10]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Informações Básicas
              </h2>

              <div class="grid grid-cols-2 gap-6">
                <div>
                  <p class="text-sm text-gray-400 mb-2">Nome</p>
                  <p class="text-white font-semibold">{{ currentAgent.name }}</p>
                </div>

                <div>
                  <p class="text-sm text-gray-400 mb-2">Função</p>
                  <p class="text-white font-semibold">{{ currentAgent.function || 'Não definida' }}</p>
                </div>

                <div>
                  <p class="text-sm text-gray-400 mb-2">Modelo IA</p>
                  <p class="text-white font-semibold">{{ getAIModelLabel(currentAgent.ai_model) }}</p>
                </div>

                <div>
                  <p class="text-sm text-gray-400 mb-2">Tom de Voz</p>
                  <p class="text-white font-semibold">{{ getToneOfVoiceLabel(currentAgent.tone_of_voice) }}</p>
                </div>

                <div>
                  <p class="text-sm text-gray-400 mb-2">Tokens Usados</p>
                  <p class="text-white font-semibold">{{ formatTokens(currentAgent.token_used) }}</p>
                </div>

                <div>
                  <p class="text-sm text-gray-400 mb-2">Custo Estimado</p>
                  <p class="text-white font-semibold">${{ calculateTokenCost(currentAgent.token_used, currentAgent.ai_model) }}</p>
                </div>

                <div>
                  <p class="text-sm text-gray-400 mb-2">Criado em</p>
                  <p class="text-white font-semibold">{{ formatDate(currentAgent.created_at) }}</p>
                </div>

                <div>
                  <p class="text-sm text-gray-400 mb-2">Atualizado em</p>
                  <p class="text-white font-semibold">{{ formatDate(currentAgent.updated_at) }}</p>
                </div>
              </div>

              <div v-if="currentAgent.prompt" class="mt-6 pt-6 border-t" style="border-color: var(--color-border1)">
                <p class="text-sm text-gray-400 mb-2">Prompt do Sistema</p>
                <div class="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <p class="text-sm text-gray-300 whitespace-pre-wrap">{{ currentAgent.prompt }}</p>
                </div>
              </div>
            </Card>

            <!-- WhatsApp -->
            <Card padding="lg">
              <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Número WhatsApp
              </h2>

              <div v-if="currentAgent.whatsapp_number" class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-white font-semibold text-lg">{{ currentAgent.whatsapp_number.display_name }}</p>
                    <p class="text-gray-400 text-sm mt-1">{{ formatWhatsappNumber(currentAgent.whatsapp_number.phone_number) }}</p>
                  </div>
                  <span
                      class="px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2"
                      :style="{
                      color: whatsappStatusConfig(currentAgent.whatsapp_number.status).color,
                      backgroundColor: whatsappStatusConfig(currentAgent.whatsapp_number.status).bgColor
                    }"
                  >
                    <span>{{ whatsappStatusConfig(currentAgent.whatsapp_number.status).icon }}</span>
                    <span>{{ whatsappStatusConfig(currentAgent.whatsapp_number.status).label }}</span>
                  </span>
                </div>
              </div>
              <div v-else class="text-center py-8">
                <p class="text-gray-400">Nenhum número WhatsApp configurado</p>
              </div>
            </Card>

            <!-- Bases de Conhecimento -->
            <Card padding="lg">
              <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Bases de Conhecimento
              </h2>

              <div v-if="currentAgent.knowledge_bases && currentAgent.knowledge_bases.length > 0" class="space-y-3">
                <div
                    v-for="kb in currentAgent.knowledge_bases"
                    :key="kb.id"
                    class="p-4 rounded-lg border border-gray-700 hover:border-[#7cba10] transition-colors"
                >
                  <h3 class="text-white font-semibold">{{ kb.name }}</h3>
                  <p class="text-sm text-gray-400 mt-1">{{ kb.description }}</p>
                </div>
              </div>
              <div v-else class="text-center py-8">
                <p class="text-gray-400">Nenhuma base de conhecimento associada</p>
              </div>
            </Card>
          </div>

          <!-- Coluna Lateral - Métricas -->
          <div class="space-y-6">
            <!-- Status de Saúde -->
            <Card padding="lg" v-if="healthStatus">
              <h3 class="text-lg font-bold text-white mb-4">Status do Agente</h3>
              <div class="text-center py-6">
                <span class="text-6xl">{{ healthStatus.icon }}</span>
                <p class="text-2xl font-bold mt-4" :style="{ color: healthStatus.color }">
                  {{ healthStatus.label }}
                </p>
              </div>
            </Card>

            <!-- Métricas Rápidas -->
            <Card padding="lg" v-if="metrics">
              <h3 class="text-lg font-bold text-white mb-4">Métricas</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-gray-400 text-sm">Contatos</span>
                  <span class="text-white font-bold text-lg">{{ metrics.total_contacts }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-400 text-sm">Oportunidades</span>
                  <span class="text-white font-bold text-lg">{{ metrics.total_opportunities }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-400 text-sm">Taxa de Conversão</span>
                  <span class="text-[#7cba10] font-bold text-lg">{{ metrics.conversion_rate }}%</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-400 text-sm">Receita Total</span>
                  <span class="text-white font-bold text-lg">R$ {{ metrics.total_revenue?.toFixed(2) }}</span>
                </div>
              </div>
            </Card>

            <!-- Contatos Recentes -->
            <Card padding="lg">
              <h3 class="text-lg font-bold text-white mb-4">Contatos Recentes</h3>
              <div v-if="currentAgent.recent_contacts && currentAgent.recent_contacts.length > 0" class="space-y-3">
                <div
                    v-for="contact in currentAgent.recent_contacts.slice(0, 5)"
                    :key="contact.id"
                    class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
                    @click="router.push(`/clientes/${contact.id}`)"
                >
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {{ contact.name?.charAt(0) || '?' }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-white text-sm font-medium truncate">{{ contact.name }}</p>
                    <p class="text-gray-400 text-xs">{{ contact.phone }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-4">
                <p class="text-gray-400 text-sm">Nenhum contato ainda</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
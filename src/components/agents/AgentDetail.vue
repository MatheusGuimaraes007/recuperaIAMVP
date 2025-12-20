<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAgents } from '../../composables/useAgents';
import Card from '../../shared/Card.vue';
import LoadingState from '../../shared/LoadingState.vue';
import Button from '../../shared/Button.vue';
import Navbar from '../../shared/Navbar.vue';
import MetricCard from '../../shared/MetricCard.vue';
import { formatDate, formatCurrency } from '../../utils/formatters';
import {
  ArrowLeft,
  Edit,
  Info,
  Phone,
  BookOpen,
  Activity,
  Users
} from 'lucide-vue-next';

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
  <div class="min-h-screen bg-background-base">
    <Navbar />

    <div class="p-4 md:p-6">
      <div class="max-w-[1600px] mx-auto">

        <!-- Back Button -->
        <div class="mb-6">
          <button
              @click="handleBack"
              class="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-200 mb-4 px-3 py-2 rounded-lg hover:bg-gray-800/50"
          >
            <ArrowLeft :size="20" class="transition-transform group-hover:-translate-x-1" />
            <span class="font-medium">Voltar para Agentes</span>
          </button>
        </div>

        <!-- Header -->
        <Card padding="lg" class="mb-8 relative overflow-hidden">
          <div class="absolute inset-0 opacity-5">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,_white_1px,_transparent_0)] bg-[length:40px_40px]"></div>
          </div>

          <div class="relative flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-white mb-2">
                {{ currentAgent?.name || 'Carregando...' }}
              </h1>
              <p class="text-gray-400 text-sm">
                Detalhes e métricas do agente
              </p>
            </div>

            <Button
                @click="handleEdit"
                variant="primary"
                class="flex items-center gap-2"
            >
              <Edit :size="16" />
              <span>Editar Agente</span>
            </Button>
          </div>
        </Card>

        <!-- Loading State -->
        <LoadingState v-if="loading" message="Carregando detalhes do agente..." />

        <!-- Content -->
        <div v-else-if="currentAgent" class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Coluna Principal -->
          <div class="lg:col-span-2 space-y-6">

            <!-- Informações Básicas -->
            <Card padding="lg">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Info :size="20" class="text-primary" />
                </div>
                <h2 class="text-xl font-bold text-white">Informações Básicas</h2>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-400">Nome</p>
                  <p class="text-white font-semibold">{{ currentAgent.name }}</p>
                </div>

                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-400">Função</p>
                  <p class="text-white font-semibold">{{ currentAgent.function || 'Não definida' }}</p>
                </div>

                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-400">Modelo IA</p>
                  <p class="text-white font-semibold">{{ getAIModelLabel(currentAgent.ai_model) }}</p>
                </div>

                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-400">Tom de Voz</p>
                  <p class="text-white font-semibold">{{ getToneOfVoiceLabel(currentAgent.tone_of_voice) }}</p>
                </div>

                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-400">Tokens Usados</p>
                  <p class="text-white font-semibold">{{ formatTokens(currentAgent.token_used) }}</p>
                </div>

                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-400">Custo Estimado</p>
                  <p class="text-metric-green font-semibold">${{ calculateTokenCost(currentAgent.token_used, currentAgent.ai_model) }}</p>
                </div>

                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-400">Criado em</p>
                  <p class="text-white font-semibold">{{ formatDate(currentAgent.created_at) }}</p>
                </div>

                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-400">Atualizado em</p>
                  <p class="text-white font-semibold">{{ formatDate(currentAgent.updated_at) }}</p>
                </div>
              </div>

              <div v-if="currentAgent.prompt" class="mt-6 pt-6 border-t border-border">
                <p class="text-sm font-medium text-gray-400 mb-3">Prompt do Sistema</p>
                <div class="bg-background-base rounded-lg p-4 border border-border">
                  <p class="text-sm text-gray-300 whitespace-pre-wrap">{{ currentAgent.prompt }}</p>
                </div>
              </div>
            </Card>

            <!-- WhatsApp -->
            <Card padding="lg">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-lg bg-metric-green-light flex items-center justify-center">
                  <Phone :size="20" class="text-metric-green" />
                </div>
                <h2 class="text-xl font-bold text-white">Número WhatsApp</h2>
              </div>

              <div v-if="currentAgent.whatsapp_number" class="space-y-4">
                <div class="flex items-center justify-between p-4 rounded-lg border border-border bg-background-base">
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
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-lg bg-metric-purple-light flex items-center justify-center">
                  <BookOpen :size="20" class="text-metric-purple" />
                </div>
                <h2 class="text-xl font-bold text-white">Bases de Conhecimento</h2>
              </div>

              <div v-if="currentAgent.knowledge_bases && currentAgent.knowledge_bases.length > 0" class="space-y-3">
                <div
                    v-for="kb in currentAgent.knowledge_bases"
                    :key="kb.id"
                    class="p-4 rounded-lg border border-border hover:border-primary transition-colors bg-background-base"
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
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-lg bg-metric-blue-light flex items-center justify-center">
                  <Activity :size="20" class="text-metric-blue" />
                </div>
                <h3 class="text-lg font-bold text-white">Status do Agente</h3>
              </div>

              <div class="text-center py-6 rounded-lg bg-background-base border border-border">
                <span class="text-6xl">{{ healthStatus.icon }}</span>
                <p class="text-2xl font-bold mt-4" :style="{ color: healthStatus.color }">
                  {{ healthStatus.label }}
                </p>
              </div>
            </Card>

            <!-- Métricas Rápidas -->
            <div v-if="metrics" class="space-y-4">
              <MetricCard
                  label="Contatos"
                  :value="metrics.total_contacts"
                  icon="users"
                  variant="blue"
              />

              <MetricCard
                  label="Oportunidades"
                  :value="metrics.total_opportunities"
                  icon="briefcase"
                  variant="purple"
              />

              <MetricCard
                  label="Taxa de Conversão"
                  :value="`${metrics.conversion_rate}%`"
                  icon="trending-up"
                  variant="green"
              />

              <MetricCard
                  label="Receita Total"
                  :value="formatCurrency(metrics.total_revenue || 0)"
                  icon="dollar-sign"
                  variant="orange"
              />
            </div>

            <!-- Contatos Recentes -->
            <Card padding="lg">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-lg bg-metric-blue-light flex items-center justify-center">
                  <Users :size="20" class="text-metric-blue" />
                </div>
                <h3 class="text-lg font-bold text-white">Contatos Recentes</h3>
              </div>

              <div v-if="currentAgent.recent_contacts && currentAgent.recent_contacts.length > 0" class="space-y-2">
                <button
                    v-for="contact in currentAgent.recent_contacts.slice(0, 5)"
                    :key="contact.id"
                    class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-background-base transition-colors border border-transparent hover:border-border"
                    @click="router.push(`/clientes/${contact.id}`)"
                >
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {{ contact.name?.charAt(0).toUpperCase() || '?' }}
                  </div>
                  <div class="flex-1 min-w-0 text-left">
                    <p class="text-white text-sm font-medium truncate">{{ contact.name }}</p>
                    <p class="text-gray-400 text-xs">{{ contact.phone }}</p>
                  </div>
                </button>
              </div>
              <div v-else class="text-center py-8">
                <p class="text-gray-400 text-sm">Nenhum contato ainda</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
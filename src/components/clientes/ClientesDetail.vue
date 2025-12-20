<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useClients } from '../../composables/useClients';
import { formatCurrency, formatDate, formatPhone } from '../../utils/formatters';
import { OPPORTUNITY_TYPE_LABELS } from '../../utils/constants';

// Componentes Compartilhados
import Navbar from '../../shared/Navbar.vue';
import Card from '../../shared/Card.vue';
import Button from '../../shared/Button.vue';
import LoadingState from '../../shared/LoadingState.vue';
import StatusBadge from '../../shared/StatusBadge.vue';
import UserAvatar from '../../shared/UserAvatar.vue';
import MetricCard from '../../shared/MetricCard.vue';
import EmptyState from '../../shared/EmptyState.vue';

// Ícones
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  User,
  Clock,
  Briefcase,
  CheckCircle,
  AlertCircle
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const { fetchContactById } = useClients();

const contact = ref(null);
const loading = ref(true);
const error = ref(null);

const contactId = computed(() => route.params.id);

onMounted(async () => {
  await loadContactDetails();
});

const loadContactDetails = async () => {
  loading.value = true;
  error.value = null;

  try {
    const result = await fetchContactById(contactId.value);

    if (result.success) {
      contact.value = result.data;
    } else {
      error.value = 'Erro ao carregar detalhes do contato';
    }
  } catch (err) {
    console.error('Erro:', err);
    error.value = 'Erro ao carregar detalhes do contato';
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push('/clientes');
};

// Helper seguro para formatar ID
const formatOppId = (id) => {
  if (!id) return '';
  return String(id).slice(0, 8);
};

const opportunityMetrics = computed(() => {
  if (!contact.value?.opportunities) {
    return {
      total: 0,
      won: 0,
      totalValue: 0,
      totalConverted: 0,
      conversionRate: 0
    };
  }

  const opps = contact.value.opportunities;
  const metrics = {
    total: opps.length,
    won: opps.filter(o => o.status === 'won').length,
    totalValue: opps.reduce((sum, o) => sum + (parseFloat(o.value) || 0), 0),
    totalConverted: opps.reduce((sum, o) => sum + (parseFloat(o.converted_value) || 0), 0)
  };

  metrics.conversionRate = metrics.total > 0
      ? ((metrics.won / metrics.total) * 100).toFixed(1)
      : 0;

  return metrics;
});
</script>

<template>
  <div class="min-h-screen bg-background-base">
    <Navbar />

    <div class="p-4 md:p-6">
      <div class="max-w-[1600px] mx-auto">

        <div class="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" @click="goBack">
            <ArrowLeft :size="20" class="mr-2" />
            Voltar para Clientes
          </Button>
        </div>

        <LoadingState v-if="loading" message="Carregando detalhes do cliente..." />

        <div v-else-if="error" class="flex flex-col items-center justify-center p-12 bg-background-card border border-border rounded-xl">
          <div class="w-16 h-16 bg-status-error/10 text-status-error rounded-full flex items-center justify-center mb-4">
            <AlertCircle :size="32" />
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Erro ao carregar</h3>
          <p class="text-gray-400 mb-6">{{ error }}</p>
          <Button variant="primary" @click="loadContactDetails">Tentar Novamente</Button>
        </div>

        <template v-else-if="contact">

          <Card padding="lg" class="mb-6 relative overflow-hidden">
            <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">

              <div class="flex items-start gap-6">
                <UserAvatar
                    :name="contact.name || 'Sem nome'"
                    :url="contact.avatar"
                    size="xl"
                    class="ring-4 ring-background-card"
                />

                <div class="flex-1 min-w-0 pt-2">
                  <h1 class="text-3xl font-bold text-white mb-2">{{ contact.name || 'Sem nome' }}</h1>

                  <div class="flex flex-col gap-2 text-gray-400">
                    <a :href="`tel:${contact.phone}`" class="flex items-center gap-2 hover:text-primary transition-colors w-fit">
                      <Phone :size="16" />
                      <span class="font-medium">{{ formatPhone(contact.phone) }}</span>
                    </a>
                    <a v-if="contact.email" :href="`mailto:${contact.email}`" class="flex items-center gap-2 hover:text-primary transition-colors w-fit">
                      <Mail :size="16" />
                      <span>{{ contact.email }}</span>
                    </a>
                  </div>
                </div>
              </div>

              <div class="flex-shrink-0">
                <StatusBadge
                    :status="contact.status"
                    type="client"
                    size="lg"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-border">

              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-lg bg-metric-purple-light flex items-center justify-center flex-shrink-0">
                  <User :size="20" class="text-metric-purple" />
                </div>
                <div>
                  <p class="text-gray-400 text-sm mb-1">Agente Responsável</p>
                  <div v-if="contact.agent" class="flex items-center gap-2">
                    <UserAvatar :name="contact.agent.name" size="xs" />
                    <p class="text-white font-medium">{{ contact.agent.name }}</p>
                  </div>
                  <p v-else class="text-gray-500 italic">Não atribuído</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-lg bg-metric-blue-light flex items-center justify-center flex-shrink-0">
                  <Calendar :size="20" class="text-metric-blue" />
                </div>
                <div>
                  <p class="text-gray-400 text-sm mb-1">Data de Cadastro</p>
                  <p class="text-white font-medium">{{ formatDate(contact.created_at) }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-lg bg-metric-green-light flex items-center justify-center flex-shrink-0">
                  <Clock :size="20" class="text-metric-green" />
                </div>
                <div>
                  <p class="text-gray-400 text-sm mb-1">Última Atualização</p>
                  <p class="text-white font-medium">{{ formatDate(contact.updated_at) }}</p>
                </div>
              </div>

            </div>
          </Card>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard
                label="Total Oportunidades"
                :value="opportunityMetrics.total"
                icon="briefcase"
                variant="blue"
            />

            <MetricCard
                label="Oportunidades Ganhas"
                :value="opportunityMetrics.won"
                icon="check-circle"
                variant="green"
            />

            <MetricCard
                label="Taxa de Conversão"
                :value="`${opportunityMetrics.conversionRate}%`"
                icon="trending-up"
                variant="purple"
            />

            <MetricCard
                label="Valor Convertido"
                :value="formatCurrency(opportunityMetrics.totalConverted)"
                icon="dollar-sign"
                variant="orange"
            />
          </div>

          <Card padding="lg">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-xl font-bold text-white mb-1">Histórico de Oportunidades</h2>
                <p class="text-gray-400 text-sm">Acompanhe todas as interações e conversões</p>
              </div>
            </div>

            <EmptyState
                v-if="!contact.opportunities || contact.opportunities.length === 0"
                title="Nenhuma oportunidade"
                message="Este cliente ainda não possui oportunidades registradas."
                icon="briefcase"
            />

            <div v-else class="space-y-4">
              <div
                  v-for="opp in contact.opportunities"
                  :key="opp.id"
                  class="group p-5 rounded-xl border border-border bg-background-base/50 hover:bg-background-base transition-all duration-200"
              >
                <div class="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div class="flex-1">
                    <div class="flex flex-wrap items-center gap-3 mb-2">
                      <StatusBadge :status="opp.status" type="opportunity" size="sm" />

                      <span class="px-2 py-1 rounded text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
                        {{ OPPORTUNITY_TYPE_LABELS[opp.opportunity_type] || opp.opportunity_type }}
                      </span>
                    </div>

                    <h4 class="text-white font-semibold text-lg mb-1">
                      Oportunidade #{{ formatOppId(opp.id) }}
                    </h4>

                    <p class="text-sm text-gray-400 flex items-center gap-1.5">
                      <Clock :size="14" />
                      Criada em {{ formatDate(opp.created_at) }}
                    </p>
                  </div>

                  <div class="text-right">
                    <p class="text-2xl font-bold text-white mb-1">{{ formatCurrency(opp.value) }}</p>
                    <p v-if="opp.status === 'won' && opp.converted_value" class="text-sm font-semibold text-status-success flex items-center justify-end gap-1">
                      <CheckCircle :size="14" />
                      {{ formatCurrency(opp.converted_value) }}
                    </p>
                  </div>
                </div>

                <div v-if="opp.conversation_summary" class="pt-4 border-t border-border mt-4">
                  <div class="flex items-start gap-2">
                    <Briefcase :size="16" class="text-gray-500 mt-0.5 flex-shrink-0" />
                    <p class="text-sm text-gray-300 leading-relaxed">{{ opp.conversation_summary }}</p>
                  </div>
                </div>

              </div>
            </div>
          </Card>

        </template>
      </div>
    </div>
  </div>
</template>
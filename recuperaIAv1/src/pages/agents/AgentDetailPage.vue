<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAgents as useAgentsComposable } from '@/composables/data/useAgents'

// Templates & Organisms
import RDetailTemplate from '@/components/templates/sections/RDetailTemplate.vue'
import RPageHeader from '@/components/organisms/headers/RPageHeader.vue'

// Molecules
import RStatCard from '@/components/molecules/cards/RStatCard.vue'
import RKeyValue from '@/components/molecules/data-display/RKeyValue.vue'
import RStatusBadge from '@/components/molecules/data-display/RStatusBadge.vue'

// Atoms
import RButton from '@/components/atoms/buttons/RButton.vue'
import RCard from '@/components/atoms/layout/RCard.vue'
import RHeading from '@/components/atoms/typography/RHeading.vue'
import RText from '@/components/atoms/typography/RText.vue'
import RLoadingState from '@/components/molecules/feedback/RLoadingState.vue'
import RBadge from '@/components/atoms/feedback/RBadge.vue'
import RAvatar from '@/components/atoms/feedback/RAvatar.vue'

const route = useRoute()
const router = useRouter()

const agentId = computed(() => route.params.id)

// Composable
const {
  useAgent,
  useAgentStats,
  formatTokens,
  calculateTokenCost,
  formatWhatsAppNumber,
  getModelLabel,
  getToneLabel,
  getWhatsAppStatus,
  calculateAgentHealth
} = useAgentsComposable()

// Queries
const { data: agent, isLoading: loadingAgent } = useAgent(agentId)
const { data: stats, isLoading: loadingStats } = useAgentStats(agentId)

// Breadcrumb
const breadcrumb = computed(() => [
  { label: 'Admin', to: '/admin/dashboard' },
  { label: 'Agentes', to: '/admin/agents' },
  { label: agent.value?.name || 'Detalhes', to: `/admin/agents/${agentId.value}` }
])

// Handlers
const handleEdit = () => {
  router.push(`/admin/agents/${agentId.value}/editar`)
}

const handleBack = () => {
  router.push('/admin/agents')
}

// Formatters
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Computed
const agentHealth = computed(() => calculateAgentHealth(stats.value))
const whatsappStatus = computed(() => {
  if (!agent.value?.official_whatsapp) return null
  return getWhatsAppStatus(agent.value.official_whatsapp.status)
})
</script>

<template>
  <RDetailTemplate
    :title="agent?.name || 'Carregando...'"
    :subtitle="`Agente IA • ${agent?.function || ''}`"
    :breadcrumb="breadcrumb"
    :loading="loadingAgent"
  >
    <!-- Header Actions -->
    <template #header-actions>
      <RButton variant="ghost" icon-left="arrow-left" @click="handleBack">
        Voltar
      </RButton>
      <RButton variant="primary" icon-left="edit-2" @click="handleEdit">
        Editar
      </RButton>
    </template>

    <!-- Loading State -->
    <RLoadingState v-if="loadingAgent" message="Carregando detalhes..." />

    <!-- Content -->
    <template v-else-if="agent">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Coluna Principal -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Informações Básicas -->
          <RCard padding="lg">
            <RHeading level="3" class="mb-6">Informações Básicas</RHeading>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RKeyValue label="Nome" :value="agent.name" />
              <RKeyValue label="Função" :value="agent.function || '-'" />
              <RKeyValue label="Modelo IA" :value="getModelLabel(agent.ai_model)" />
              <RKeyValue label="Tom de Voz" :value="getToneLabel(agent.tone_of_voice)" />
              <RKeyValue label="Tokens Usados" :value="formatTokens(agent.token_used)" />
              <RKeyValue label="Criado em" :value="formatDate(agent.created_at)" />
            </div>
          </RCard>

          <!-- Prompt do Sistema -->
          <RCard padding="lg">
            <RHeading level="3" class="mb-4">Prompt do Sistema</RHeading>
            <div class="bg-bg-secondary rounded-lg p-4 border border-border-light">
              <RText size="sm" class="whitespace-pre-wrap font-mono">
                {{ agent.prompt || 'Nenhum prompt configurado' }}
              </RText>
            </div>
          </RCard>

          <!-- WhatsApp Oficial -->
          <RCard padding="lg">
            <RHeading level="3" class="mb-6 flex items-center gap-2">
              <span class="text-2xl">📱</span>
              WhatsApp Oficial
            </RHeading>

            <div v-if="agent.official_whatsapp" class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-bg-secondary rounded-lg border border-border-light">
                <div>
                  <RText weight="semibold" class="mb-1">
                    {{ agent.official_whatsapp.display_name }}
                  </RText>
                  <RText size="sm" color="secondary">
                    {{ formatWhatsAppNumber(agent.official_whatsapp.phone_number) }}
                  </RText>
                </div>
                <RStatusBadge
                  v-if="whatsappStatus"
                  :status="whatsappStatus.label"
                  :variant="whatsappStatus.variant"
                />
              </div>
            </div>

            <RText v-else color="secondary" align="center" class="py-8">
              Nenhum número WhatsApp configurado
            </RText>
          </RCard>

          <!-- Bases de Conhecimento -->
          <RCard padding="lg">
            <RHeading level="3" class="mb-6 flex items-center gap-2">
              <span class="text-2xl">📚</span>
              Bases de Conhecimento
            </RHeading>

            <div v-if="agent.knowledge_bases?.length" class="space-y-3">
              <div
                v-for="kb in agent.knowledge_bases"
                :key="kb.id"
                class="p-4 rounded-lg border border-border-light hover:border-primary transition-colors cursor-pointer"
              >
                <RText weight="semibold" class="mb-1">{{ kb.name }}</RText>
                <RText size="sm" color="secondary">{{ kb.description }}</RText>
              </div>
            </div>

            <RText v-else color="secondary" align="center" class="py-8">
              Nenhuma base associada
            </RText>
          </RCard>
        </div>

        <!-- Sidebar - Métricas -->
        <div class="space-y-6">
          <!-- Status do Agente -->
          <RCard padding="lg">
            <RHeading level="4" class="mb-4">Status</RHeading>
            <div class="text-center py-6">
              <div class="text-6xl mb-4">
                {{ agentHealth.icon }}
              </div>
              <RText weight="bold" :style="{ color: agentHealth.color }">
                {{ agentHealth.label }}
              </RText>
            </div>
          </RCard>

          <!-- Métricas Rápidas -->
          <div v-if="stats" class="space-y-4">
            <RStatCard
              label="Oportunidades"
              :value="stats.total_opportunities"
              icon="briefcase"
              color="purple"
            />
            <RStatCard
              label="Contatos"
              :value="stats.total_contacts"
              icon="users"
              color="blue"
            />
            <RStatCard
              label="Taxa Conversão"
              :value="`${stats.conversion_rate?.toFixed(1) || 0}%`"
              icon="trending-up"
              color="green"
            />
            <RStatCard
              label="Valor Total"
              :value="`R$ ${stats.total_value?.toFixed(2) || 0}`"
              icon="dollar-sign"
              color="orange"
            />
          </div>

          <!-- Informações do Owner -->
          <RCard padding="lg" v-if="agent.user">
            <RHeading level="4" class="mb-4">Proprietário</RHeading>
            <div class="flex items-center gap-3">
              <RAvatar :name="agent.user.name" size="md" />
              <div>
                <RText weight="semibold" class="mb-1">{{ agent.user.name }}</RText>
                <RText size="sm" color="secondary">{{ agent.user.email }}</RText>
              </div>
            </div>
          </RCard>
        </div>
      </div>
    </template>
  </RDetailTemplate>
</template>
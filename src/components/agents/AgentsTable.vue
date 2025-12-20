<script setup>
import { useRouter } from 'vue-router'
import { Bot, Smartphone, Zap, Calendar, Edit2, Trash2, ChevronRight } from 'lucide-vue-next'
import Card from '../../shared/Card.vue'
import StatusBadge from '../../shared/StatusBadge.vue'
import UserAvatar from '../../shared/UserAvatar.vue'
import { formatDate } from '../../utils/formatters'
import { useAgents } from '../../composables/useAgents'

const router = useRouter()
const { formatTokens, getAIModelLabel } = useAgents()

const props = defineProps({
  agents: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['agent-click', 'edit-agent', 'delete-agent'])

const handleAgentClick = (agent) => {
  router.push(`/admin/agentes/${agent.id}`);
};

const handleEditAgent = (agent, event) => {
  event.stopPropagation()
  emit('edit-agent', agent)
}

const handleDeleteAgent = (agent, event) => {
  event.stopPropagation()
  emit('delete-agent', agent)
}
</script>

<template>
  <div>
    <Card padding="none" class="overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="relative">
          <div class="absolute inset-0 bg-linear-to-r from-gray-800/50 to-gray-900/50"></div>
          <tr class="border-b-2" style="border-color: var(--color-border1)">
            <th class="relative px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                <span class="flex items-center gap-2">
                  <Bot :size="16" />
                  Agente
                </span>
            </th>
            <th class="relative px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                <span class="flex items-center gap-2">
                  <Smartphone :size="16" />
                  WhatsApp
                </span>
            </th>
            <th class="relative px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                <span class="flex items-center gap-2">
                  <Bot :size="16" />
                  Modelo IA
                </span>
            </th>
            <th class="relative px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                <span class="flex items-center gap-2">
                  <Zap :size="16" />
                  Tokens
                </span>
            </th>
            <th class="relative px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                <span class="flex items-center gap-2">
                  <Calendar :size="16" />
                  Criado em
                </span>
            </th>
            <th class="relative px-6 py-4 text-right text-xs font-bold text-gray-300 uppercase tracking-wider">
                <span class="flex items-center justify-end gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Ações
                </span>
            </th>
          </tr>
          </thead>
          <tbody class="divide-y divide-border">
          <tr
              v-for="agent in agents"
              :key="agent.id"
              @click="handleAgentClick(agent)"
              class="group hover:bg-linear-to-r hover:from-gray-800/40 hover:to-transparent transition-all duration-200 cursor-pointer relative"
          >
            <td class="px-6 py-4 relative">
              <div class="absolute inset-y-0 left-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div class="flex items-center gap-3">
                <div class="relative">
                  <div class="absolute -inset-0.5 bg-linear-to-r from-[#7cba10] to-purple-600 rounded-full blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
                  <div class="relative w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white transition-transform group-hover:scale-110"
                       style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                    {{ getInitials(agent.name) }}
                  </div>
                </div>
                <div class="min-w-0">
                  <p class="text-white font-semibold truncate group-hover:text-primary transition-colors">
                    {{ agent.name || 'Sem nome' }}
                  </p>
                  <p v-if="agent.function" class="text-xs text-gray-400 truncate mt-0.5">
                    {{ agent.function }}
                  </p>
                </div>
              </div>
            </td>

            <td class="px-6 py-4">
              <div v-if="agent.whatsapp_number" class="space-y-1">
                <p class="text-sm text-white font-medium">
                  {{ agent.whatsapp_number.display_name || 'Número Oficial' }}
                </p>
                <StatusBadge
                    :status="agent.whatsapp_number.status"
                    type="whatsapp"
                    size="sm"
                />
              </div>
              <span v-else class="text-sm text-gray-500 italic">Não configurado</span>
            </td>

            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <span class="text-2xl">🧠</span>
                <span class="text-sm text-white font-medium">
                    {{ getAIModelLabel(agent.ai_model) || 'N/A' }}
                  </span>
              </div>
            </td>

            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <Zap :size="16" class="text-metric-purple" />
                <span class="text-sm text-white font-medium">
                    {{ formatTokens(agent.token_used) }}
                  </span>
              </div>
            </td>

            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <Calendar :size="16" class="text-gray-400" />
                <span class="text-sm text-gray-400 font-medium">{{ formatDate(agent.created_at) }}</span>
              </div>
            </td>

            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <button
                    @click="handleEditAgent(agent, $event)"
                    class="p-2 rounded-lg text-metric-blue hover:bg-metric-blue-light transition-colors"
                    title="Editar agente"
                >
                  <Edit2 :size="18" />
                </button>

                <button
                    @click="handleDeleteAgent(agent, $event)"
                    class="p-2 rounded-lg text-status-error hover:bg-status-error-light transition-colors"
                    title="Deletar agente"
                >
                  <Trash2 :size="18" />
                </button>

                <button
                    @click.stop="handleAgentClick(agent)"
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-background-base bg-primary hover:bg-primary-hover transition-all hover:scale-105 hover:shadow-lg"
                >
                  <span>Ver Detalhes</span>
                  <ChevronRight :size="16" class="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="px-6 py-5 border-t bg-linear-to-r from-gray-800/20 to-transparent" style="border-color: var(--color-border1)">
        <slot name="pagination"></slot>
      </div>
    </Card>
  </div>
</template>
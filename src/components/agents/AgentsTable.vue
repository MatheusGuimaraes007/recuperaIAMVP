<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import Card from '../../shared/Card.vue';
import { formatDate } from '../../utils/formatters';
import { useAgents } from '../../composables/useAgents';

const router = useRouter();
const { formatTokens, whatsappStatusConfig, getAIModelLabel } = useAgents();

const props = defineProps({
  agents: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['agent-click', 'edit-agent', 'delete-agent']);

const handleAgentClick = (agent) => {
  router.push(`/admin/agentes/${agent.id}`);
};

const handleEditAgent = (agent, event) => {
  event.stopPropagation();
  emit('edit-agent', agent);
};

const handleDeleteAgent = (agent, event) => {
  event.stopPropagation();
  emit('delete-agent', agent);
};

const hasAgents = computed(() => props.agents && props.agents.length > 0);

const getInitials = (name) => {
  if (!name) return '?';
  return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
};
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
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  Agente
                </span>
            </th>
            <th class="relative px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                <span class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  WhatsApp
                </span>
            </th>
            <th class="relative px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                <span class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Modelo IA
                </span>
            </th>
            <th class="relative px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                <span class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Tokens
                </span>
            </th>
            <th class="relative px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                <span class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
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
          <tbody class="divide-y" style="border-color: var(--color-border1)">
          <tr
              v-for="agent in agents"
              :key="agent.id"
              @click="handleAgentClick(agent)"
              class="group hover:bg-linear-to-r hover:from-gray-800/40 hover:to-transparent transition-all duration-200 cursor-pointer relative"
          >

            <td class="px-6 py-4 relative">
              <div class="absolute inset-y-0 left-0 w-1 bg-[#7cba10] opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div class="flex items-center gap-3">
                <div class="relative">
                  <div class="absolute -inset-0.5 bg-linear-to-r from-[#7cba10] to-purple-600 rounded-full blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
                  <div class="relative w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white transition-transform group-hover:scale-110"
                       style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                    {{ getInitials(agent.name) }}
                  </div>
                </div>
                <div class="min-w-0">
                  <p class="text-white font-semibold truncate group-hover:text-[#7cba10] transition-colors">
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
                <span
                    class="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold"
                    :style="{
                      color: whatsappStatusConfig(agent.whatsapp_number.status).color,
                      backgroundColor: whatsappStatusConfig(agent.whatsapp_number.status).bgColor
                    }"
                >
                    <span>{{ whatsappStatusConfig(agent.whatsapp_number.status).icon }}</span>
                    <span>{{ whatsappStatusConfig(agent.whatsapp_number.status).label }}</span>
                  </span>
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
                <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span class="text-sm text-white font-medium">
                    {{ formatTokens(agent.token_used) }}
                  </span>
              </div>
            </td>

            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm text-gray-400 font-medium">{{ formatDate(agent.created_at) }}</span>
              </div>
            </td>

            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <button
                    @click="handleEditAgent(agent, $event)"
                    class="p-2 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors"
                    title="Editar agente"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                <button
                    @click="handleDeleteAgent(agent, $event)"
                    class="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Deletar agente"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                <button
                    @click.stop="handleAgentClick(agent)"
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
                    style="background: linear-gradient(135deg, #7cba10 0%, #5a8c0d 100%)"
                >
                  <span>Ver Detalhes</span>
                  <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
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
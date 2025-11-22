<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import Card from '../../shared/Card.vue';
import { formatDate, formatPhone } from '../../utils/formatters';

const router = useRouter();

const props = defineProps({
  contacts: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['contact-click', 'status-change']);

const handleContactClick = (contact) => {
  router.push(`/clientes/${contact.id}`);
};

const getStatusConfig = (status) => {
  const configs = {
    new: {
      label: 'Novo',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      icon: '🆕'
    },
    engaged: {
      label: 'Engajado',
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
      icon: '💬'
    },
    qualified: {
      label: 'Qualificado',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      icon: '⭐'
    },
    converted: {
      label: 'Convertido',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      icon: '✅'
    },
    lost: {
      label: 'Perdido',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      icon: '❌'
    },
    blocked: {
      label: 'Bloqueado',
      color: '#6b7280',
      bgColor: 'rgba(107, 114, 128, 0.1)',
      icon: '🚫'
    }
  };

  return configs[status] || configs.new;
};

const hasContacts = computed(() => props.contacts && props.contacts.length > 0);
</script>

<template>
  <div>
    <Card padding="none" class="overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-gray-800/50 to-gray-900/50"></div>
            <tr class="border-b-2" style="border-color: var(--color-border1)">
              <th class="relative px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                <span class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Cliente
                </span>
              </th>
              <th class="relative px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                <span class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Contato
                </span>
              </th>
              <th class="relative px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                <span class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Status
                </span>
              </th>
              <th class="relative px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                <span class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Agente
                </span>
              </th>
              <th class="relative px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                <span class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Data Cadastro
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
              v-for="contact in contacts"
              :key="contact.id"
              @click="handleContactClick(contact)"
              class="group hover:bg-gradient-to-r hover:from-gray-800/40 hover:to-transparent transition-all duration-200 cursor-pointer relative"
            >
              <td colspan="6" class="absolute inset-y-0 left-0 w-1 bg-[#7cba10] opacity-0 group-hover:opacity-100 transition-opacity"></td>
              
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="relative">
                    <div class="absolute -inset-0.5 bg-gradient-to-r from-[#7cba10] to-purple-600 rounded-full blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
                    <div class="relative w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white transition-transform group-hover:scale-110"
                         style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                      {{ contact.name?.charAt(0)?.toUpperCase() || '?' }}
                    </div>
                  </div>
                  <div class="min-w-0">
                    <p class="text-white font-semibold truncate group-hover:text-[#7cba10] transition-colors">
                      {{ contact.name || 'Sem nome' }}
                    </p>
                    <p v-if="contact.tags && contact.tags.length > 0" class="text-xs text-gray-400 truncate flex items-center gap-1 mt-0.5">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {{ contact.tags.slice(0, 2).join(', ') }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="space-y-1.5">
                  <a :href="`tel:${contact.phone}`" @click.stop class="text-sm text-white flex items-center gap-1.5 hover:text-[#7cba10] transition-colors w-fit">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span class="font-medium">{{ formatPhone(contact.phone) }}</span>
                  </a>
                  <a v-if="contact.email" :href="`mailto:${contact.email}`" @click.stop class="text-xs text-gray-400 flex items-center gap-1.5 hover:text-[#7cba10] transition-colors w-fit">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span class="truncate max-w-[150px]">{{ contact.email }}</span>
                  </a>
                </div>
              </td>

              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all group-hover:scale-105"
                  :style="{
                    color: getStatusConfig(contact.status).color,
                    backgroundColor: getStatusConfig(contact.status).bgColor,
                    border: `1.5px solid ${getStatusConfig(contact.status).color}40`
                  }"
                >
                  <span class="text-base">{{ getStatusConfig(contact.status).icon }}</span>
                  <span>{{ getStatusConfig(contact.status).label }}</span>
                </span>
              </td>

              <td class="px-6 py-4">
                <div v-if="contact.agent?.name" class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#7cba10] to-[#5a8c0d] flex items-center justify-center text-white text-xs font-bold">
                    {{ contact.agent.name.charAt(0).toUpperCase() }}
                  </div>
                  <span class="text-sm text-white font-medium">{{ contact.agent.name }}</span>
                </div>
                <span v-else class="text-sm text-gray-500 italic">Não atribuído</span>
              </td>

              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-sm text-gray-400 font-medium">{{ formatDate(contact.created_at) }}</span>
                </div>
              </td>

              <td class="px-6 py-4 text-right">
                <button
                  @click.stop="handleContactClick(contact)"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
                  style="background: linear-gradient(135deg, #7cba10 0%, #5a8c0d 100%)"
                >
                  <span>Ver Detalhes</span>
                  <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-6 py-5 border-t bg-gradient-to-r from-gray-800/20 to-transparent" style="border-color: var(--color-border1)">
        <slot name="pagination"></slot>
      </div>
    </Card>
  </div>
</template>

<style scoped>
tbody tr {
  animation: fadeInRow 0.3s ease-out;
}

@keyframes fadeInRow {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

tbody tr:hover {
  transform: translateX(2px);
}

a {
  position: relative;
}

a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: currentColor;
  transition: width 0.3s ease;
}

a:hover::after {
  width: 100%;
}
</style>
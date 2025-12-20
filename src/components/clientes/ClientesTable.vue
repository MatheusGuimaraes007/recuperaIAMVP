<script setup>
import { useRouter } from 'vue-router';
import { formatDate, formatPhone } from '../../utils/formatters';
import Button from "../../shared/Button.vue";
import StatusBadge from "../../shared/StatusBadge.vue";
import UserAvatar from "../../shared/UserAvatar.vue";
import Card from "../../shared/Card.vue";

const props = defineProps({
  contacts: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['contact-click']);
const router = useRouter();

const handleContactClick = (contact) => {
  router.push(`/clientes/${contact.id}`);
};
</script>

<template>
  <div>
    <Card padding="none" class="overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="relative">
            <div class="absolute inset-0 from-gray-800/50 to-gray-900/50"></div>
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
              class="group hover:bg-linear-to-r hover:from-gray-800/40 hover:to-transparent transition-all duration-200 cursor-pointer relative"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <UserAvatar :name="contact.name" size="sm" class="mr-3" />
                  <div>
                    <div class="text-sm font-medium text-white">{{ contact.name }}</div>
                    <div class="text-xs text-gray-500">{{ contact.email || 'Sem email' }}</div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-300">{{ formatPhone(contact.phone) }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <StatusBadge :status="contact.status || 'lead'" />
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-400">{{ contact.agent_name || '-' }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-400">{{ formatDate(contact.created_at) }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  class="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                >
                  Ver detalhes
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="$slots.pagination" class="border-t border-gray-700 bg-gray-800/20 p-4">
        <slot name="pagination"></slot>
      </div>
    </Card> </div>
</template>
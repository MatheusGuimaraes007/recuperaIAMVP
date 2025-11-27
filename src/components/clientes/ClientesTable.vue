<script setup>
import { useRouter } from 'vue-router';
import { formatDate, formatPhone } from '../../utils/formatters';
import Button from "../../shared/Button.vue";
import StatusBadge from "../../shared/StatusBadge.vue";
import UserAvatar from "../../shared/UserAvatar.vue";

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
  <div class="rounded-xl border border-border overflow-hidden bg-background-card">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-800/50 border-b border-gray-700">
        <tr>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-primary">Cliente</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-primary">Contato</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-primary">Status</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-primary">Agente</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-primary">Data Cadastro</th>
          <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-primary">Ação</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="contact in contacts"
            :key="contact.id"
            @click="handleContactClick(contact)"
            class="border-b border-gray-700 hover:bg-gray-800/30 transition-colors cursor-pointer group">

          <td class="px-6 py-4">
            <div class="flex items-center gap-3">
              <UserAvatar
                  :name="contact.name || 'Sem nome'"
                  :url="contact.avatar"
                  size="sm"
              />
              <span class="text-sm font-medium text-white group-hover:text-primary transition-colors">
                {{ contact.name || 'Sem nome' }}
              </span>
            </div>
          </td>

          <td class="px-6 py-4">
            <div class="text-xs text-gray-400">
              <div class="mb-1 text-white/90">{{ contact.email || '-' }}</div>
              <div class="flex items-center gap-1">
                {{ formatPhone(contact.phone) }}
              </div>
            </div>
          </td>

          <td class="px-6 py-4">
            <StatusBadge
                :status="contact.status"
                type="client"
                size="sm"
            />
          </td>

          <td class="px-6 py-4">
            <div v-if="contact.agent?.name" class="flex items-center gap-2">
              <UserAvatar :name="contact.agent.name" size="xs" :show-tooltip="true" />
              <span class="text-sm text-gray-300">{{ contact.agent.name }}</span>
            </div>
            <span v-else class="text-xs text-gray-500 italic">Não atribuído</span>
          </td>

          <td class="px-6 py-4 text-sm text-gray-400">
            {{ formatDate(contact.created_at) }}
          </td>

          <td class="px-6 py-4 text-center">
            <Button
                variant="ghost"
                size="sm"
                @click.stop="handleContactClick(contact)"
                class="text-xs text-primary border-primary hover:bg-primary/10"
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
  </div>
</template>
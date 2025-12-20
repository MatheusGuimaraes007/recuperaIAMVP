<script setup>
import { computed } from 'vue';
import Button from './Button.vue';
import Card from './Card.vue';
// 1. Importamos os ícones da biblioteca
import { Box, Search, Folder, Bot, Inbox, FileText, Users } from 'lucide-vue-next';

const props = defineProps({
  title: {
    type: String,
    default: 'Nenhum resultado encontrado'
  },
  message: {
    type: String,
    default: 'Tente ajustar os filtros ou a busca'
  },
  icon: {
    type: String,
    default: 'box',
    // 2. Atualizamos o validador para aceitar 'robot' e outros úteis
    validator: (value) => ['box', 'search', 'folder', 'robot', 'inbox', 'bot', 'users', 'document'].includes(value)
  },
  actionLabel: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['action']);

// 3. Mapeamos o nome (string) para o Componente
const iconComponent = computed(() => {
  const icons = {
    box: Box,
    search: Search,
    folder: Folder,
    robot: Bot, // 'robot' vai renderizar o ícone 'Bot'
    inbox: Inbox,
    users: Users,
    document: FileText
  };
  // Retorna o ícone correspondente ou Box como fallback
  return icons[props.icon] || Box;
});
</script>

<template>
  <Card padding="lg">
    <div class="text-center flex flex-col items-center">
      
      <div class="mb-4 p-4 rounded-full bg-white/5 border border-white/10 inline-flex">
        <component 
          :is="iconComponent" 
          class="w-8 h-8 text-gray-500" 
          stroke-width="1.5"
        />
      </div>

      <h3 class="text-xl font-semibold text-white mb-2">
        {{ title }}
      </h3>

      <p class="text-gray-400 mb-6 max-w-sm mx-auto">
        {{ message }}
      </p>

      <Button
          v-if="actionLabel"
          variant="primary"
          @click="$emit('action')"
          class="cursor-pointer"
      >
        {{ actionLabel }}
      </Button>
    </div>
  </Card>
</template>
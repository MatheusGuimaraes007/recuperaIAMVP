<script setup>
import { ref, onMounted, computed } from 'vue';
import { supabase } from '../../utils/supabase';
import Card from "../../shared/Card.vue";
import LoadingState from "../../shared/LoadingState.vue";
import EmptyState from "../../shared/EmptyState.vue";

import { MessageCircle } from 'lucide-vue-next';
import MessageBubble from "../../shared/MessageBubble.vue";

const props = defineProps({
  opportunityId: { type: String, required: true }
});

const messages = ref([]);
const loading = ref(false);
const error = ref(null);

onMounted(async () => {
  await fetchMessages();
});

const fetchMessages = async () => {
  loading.value = true;
  error.value = null;
  try {
    const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('opportunity_id', props.opportunityId)
        .order('created_at', { ascending: true });

    if (fetchError) throw fetchError;
    messages.value = data || [];
  } catch (err) {
    console.error('Erro ao buscar mensagens:', err);
    error.value = 'Erro ao carregar mensagens';
  } finally {
    loading.value = false;
  }
};

const groupedMessages = computed(() => {
  const groups = {};
  messages.value.forEach(message => {
    const date = new Date(message.created_at).toLocaleDateString('pt-BR');
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
  });
  return groups;
});
</script>

<template>
  <Card padding="lg">
    <div class="flex items-center gap-3 mb-6 border-b border-gray-700 pb-4">
      <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
        <MessageCircle :size="20" class="text-primary" />
      </div>
      <div>
        <h3 class="text-xl font-bold text-white">Histórico de Mensagens</h3>
        <p class="text-sm text-gray-400">
          {{ messages.length }} {{ messages.length === 1 ? 'mensagem' : 'mensagens' }}
        </p>
      </div>
    </div>

    <LoadingState v-if="loading" message="Carregando mensagens..." />

    <EmptyState
        v-else-if="messages.length === 0"
        title="Nenhuma mensagem"
        message="Ainda não há mensagens nesta oportunidade"
        icon="message-circle"
    />

    <div v-else class="space-y-8 max-h-[600px] overflow-y-auto pr-2 scrollbar-custom">
      <div v-for="(msgs, date) in groupedMessages" :key="date">
        <div class="flex items-center justify-center mb-6">
          <div class="px-4 py-1.5 rounded-full bg-gray-800 border border-gray-700">
            <span class="text-xs text-gray-400 font-medium">{{ date }}</span>
          </div>
        </div>

        <div class="space-y-2">
          <MessageBubble
              v-for="message in msgs"
              :key="message.id"
              :content="message.content"
              :is-outgoing="message.direction === 'outgoing'"
              :timestamp="message.created_at"
              :status="message.status"
              :metadata="{
              senderName: message.direction === 'outgoing' ? 'Você' : 'Contato'
            }"
          />
        </div>
      </div>
    </div>
  </Card>
</template>
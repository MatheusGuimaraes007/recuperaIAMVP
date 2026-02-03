<script setup>
import { ref, computed, watch } from 'vue';
import { supabase } from '../../utils/supabase';
import LoadingState from "../../shared/LoadingState.vue";
import EmptyState from "../../shared/EmptyState.vue";

import { MessageCircle } from 'lucide-vue-next';
import MessageBubble from "../../shared/MessageBubble.vue";

const props = defineProps({
  opportunityId: { type: [String, Number], required: true },
  contactId: { type: [String, Number], default: null }
});

const messages = ref([]);
const loading = ref(false);
const error = ref(null);

const hasLookupIdentifiers = computed(() => Boolean(props.opportunityId || props.contactId));

const fetchMessages = async () => {
  if (!hasLookupIdentifiers.value) {
    messages.value = [];
    return;
  }

  loading.value = true;
  error.value = null;
  try {
    let query = supabase
        .from('messages')
        .select('*');

    if (props.opportunityId) {
      query = query.eq('opportunity_id', props.opportunityId);
    }

    if (props.contactId) {
      query = query.eq('contact_id', props.contactId);
    }

    const { data, error: fetchError } = await query
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

watch(
  () => [props.opportunityId, props.contactId],
  () => {
    if (!hasLookupIdentifiers.value) {
      messages.value = [];
      return;
    }
    fetchMessages();
  },
  { immediate: true }
);

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
  <div class="h-full flex flex-col overflow-hidden">
    <div class="flex items-center gap-3 mb-4 border-b border-gray-700 pb-4 shrink-0">
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

    <div v-if="loading" class="flex-1 overflow-hidden">
      <LoadingState message="Carregando mensagens..." />
    </div>

    <div v-else-if="messages.length === 0" class="flex-1 overflow-hidden">
      <EmptyState
          title="Nenhuma mensagem"
          message="Ainda não há mensagens nesta oportunidade"
          icon="message-circle"
      />
    </div>

    <div v-else class="flex-1 overflow-y-auto overflow-x-hidden pr-2 scrollbar-custom">
      <div class="space-y-6 pb-4">
        <div v-for="(msgs, date) in groupedMessages" :key="date">
          <div class="flex items-center justify-center mb-4">
            <div class="px-4 py-1.5 rounded-full bg-gray-800 border border-gray-700">
              <span class="text-xs text-gray-400 font-medium">{{ date }}</span>
            </div>
          </div>

          <div class="space-y-3">
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
    </div>
  </div>
</template>
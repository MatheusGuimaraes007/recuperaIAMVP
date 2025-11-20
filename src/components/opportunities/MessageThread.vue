<script setup>
import { ref, onMounted, computed } from 'vue';
import { supabase } from '../../utils/supabase';
import { formatDate } from '../../utils/formatters';
import Card from "../../shared/Card.vue";
import LoadingState from "../../shared/LoadingState.vue";
import EmptyState from "../../shared/EmptyState.vue";

const props = defineProps({
  opportunityId: {
    type: String,
    required: true
  }
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
    messages.value = [];
  } finally {
    loading.value = false;
  }
};

const hasMessages = computed(() => {
  return messages.value && messages.value.length > 0;
});

const groupedMessages = computed(() => {
  const groups = {};
  
  messages.value.forEach(message => {
    const date = new Date(message.created_at).toLocaleDateString('pt-BR');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
  });
  
  return groups;
});

const getInitials = (direction) => {
  return direction === 'outgoing' ? 'EU' : 'C';
};
</script>

<template>
  <Card padding="lg">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-[#7cba10]/20 flex items-center justify-center">
          <svg class="w-5 h-5 text-[#7cba10]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-white">Histórico de Mensagens</h3>
          <p class="text-sm text-gray-400">
            {{ messages.length }} {{ messages.length === 1 ? 'mensagem' : 'mensagens' }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="error" class="flex items-start gap-3 p-4 rounded-lg border mb-4"
         style="background-color: rgba(239, 67, 67, 0.1); border-color: var(--color-text2)">
      <svg class="w-5 h-5 flex-shrink-0 mt-0.5" style="color: var(--color-text2)" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      <p class="text-sm" style="color: var(--color-text2)">{{ error }}</p>
    </div>

    <LoadingState v-if="loading" message="Carregando mensagens..." />

    <EmptyState
      v-else-if="!hasMessages"
      title="Nenhuma mensagem"
      message="Ainda não há mensagens nesta oportunidade"
      icon="message"
    />

    <div v-else class="space-y-8">
      <div v-for="(msgs, date) in groupedMessages" :key="date">

        <!-- Date Separator -->
        <div class="flex items-center justify-center mb-6">
          <div class="px-4 py-1.5 rounded-full bg-gray-800 border border-gray-700">
            <span class="text-xs text-gray-400 font-medium">{{ date }}</span>
          </div>
        </div>

        <!-- Messages -->
        <div class="space-y-6">
          <div
            v-for="message in msgs"
            :key="message.id"
            class="flex gap-3 animate-fade-in"
            :class="message.direction === 'outgoing' ? 'flex-row-reverse' : 'flex-row'"
          >
            <!-- Avatar -->
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-transform hover:scale-110"
              :class="message.direction === 'outgoing' 
                ? 'bg-[#7cba10] text-black' 
                : 'bg-gray-700 text-white'"
            >
              {{ getInitials(message.direction) }}
            </div>

            <!-- Message Bubble -->
            <div
              class="max-w-[75%] md:max-w-[65%] rounded-2xl px-4 py-3 shadow-lg transition-all hover:shadow-xl"
              :class="message.direction === 'outgoing' 
                ? 'bg-gradient-to-br from-[#7cba10] to-[#6aa50e] text-black rounded-tr-sm' 
                : 'bg-gray-800 border border-gray-700 text-white rounded-tl-sm'"
            >
              <!-- Message Header -->
              <div class="flex items-center gap-2 mb-2">
                <span 
                  class="text-xs font-semibold"
                  :class="message.direction === 'outgoing' ? 'text-black/80' : 'text-[#7cba10]'"
                >
                  {{ message.direction === 'outgoing' ? 'Você' : 'Contato' }}
                </span>
                <span 
                  class="text-xs"
                  :class="message.direction === 'outgoing' ? 'text-black/60' : 'text-gray-500'"
                >
                  {{ new Date(message.created_at).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }) }}
                </span>
              </div>

              <!-- Message Content -->
              <div 
                class="text-sm leading-relaxed whitespace-pre-wrap break-words"
                :class="message.direction === 'outgoing' ? 'text-black' : 'text-white'"
              >
                {{ message.content }}
              </div>

              <!-- Message Status (for outgoing) -->
              <div v-if="message.direction === 'outgoing' && message.status" 
                   class="mt-2 flex items-center justify-end gap-1.5">
                <!-- Single check - sent -->
                <svg 
                  v-if="message.status === 'sent'" 
                  class="w-4 h-4 text-black/60" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <!-- Double check - delivered/read -->
                <div 
                  v-else-if="message.status === 'delivered' || message.status === 'read'" 
                  class="flex items-center"
                  :class="message.status === 'read' ? 'text-black' : 'text-black/60'"
                >
                  <svg class="w-4 h-4 -mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Info Footer -->
    <div class="mt-8 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p class="text-sm text-blue-300 font-medium mb-1">Sincronização Automática</p>
          <p class="text-sm text-gray-400">
            As mensagens são sincronizadas automaticamente com o WhatsApp. 
            Novas mensagens podem levar alguns segundos para aparecer.
          </p>
        </div>
      </div>
    </div>
  </Card>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>

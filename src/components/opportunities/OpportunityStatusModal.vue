<script setup>
import { ref, watch } from 'vue'

import { CheckCircle, X } from 'lucide-vue-next'
import Card from "../../shared/Card.vue";
import {STATUS_OPTIONS} from "../../utils/constants.js";
import Button from "../../shared/Button.vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  currentStatus: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'update'])

const selectedStatus = ref('')

// Atualiza o status selecionado quando o modal abre
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    selectedStatus.value = props.currentStatus
  }
})

const handleUpdate = () => {
  if (selectedStatus.value && selectedStatus.value !== props.currentStatus) {
    emit('update', selectedStatus.value)
  }
}

const getStatusDescription = (status) => {
  const descriptions = {
    'new': 'Oportunidade recém-criada, aguardando primeiro contato.',
    'contacted': 'Contato inicial realizado com sucesso.',
    'qualified': 'Lead qualificado e com potencial de conversão.',
    'proposal': 'Proposta comercial enviada ao cliente.',
    'negotiation': 'Em processo de negociação de termos e valores.',
    'won': 'Sucesso! Oportunidade convertida em venda.',
    'lost': 'Oportunidade perdida ou descartada.',
    'converted': 'Venda finalizada e convertida.'
  }
  return descriptions[status] || 'Status da oportunidade.'
}
</script>

<template>
  <Transition name="modal">
    <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="emit('close')"
    >
      <Card padding="lg" class="w-full max-w-md transform transition-all relative flex flex-col max-h-[90vh]">
        <div class="flex items-center justify-between mb-6 flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckCircle :size="20" class="text-primary" />
            </div>
            <h3 class="text-xl font-bold text-white">Alterar Status</h3>
          </div>
          <button
              @click="emit('close')"
              class="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X :size="20" />
          </button>
        </div>

        <div class="space-y-2 mb-6 overflow-y-auto scrollbar-custom pr-2 flex-1">
          <button
              v-for="status in STATUS_OPTIONS"
              :key="status.value"
              @click="selectedStatus = status.value"
              class="w-full px-4 py-3 rounded-lg border transition-all text-left group relative"
              :class="selectedStatus === status.value
              ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(124,186,16,0.1)]'
              : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800'"
          >
            <div class="flex items-start gap-3">
              <div
                  class="w-4 h-4 rounded-full mt-1 flex items-center justify-center border transition-all"
                  :class="selectedStatus === status.value
                  ? 'border-primary bg-primary'
                  : 'border-gray-500 group-hover:border-gray-400'"
              >
                <div v-if="selectedStatus === status.value" class="w-1.5 h-1.5 rounded-full bg-white"></div>
              </div>

              <div class="flex-1">
                <div class="flex items-center justify-between mb-0.5">
                  <span
                      class="font-semibold transition-colors"
                      :class="selectedStatus === status.value ? 'text-white' : 'text-gray-300'"
                  >
                    {{ status.label }}
                  </span>
                </div>
                <p class="text-xs text-gray-400 leading-relaxed">
                  {{ getStatusDescription(status.value) }}
                </p>
              </div>
            </div>
          </button>
        </div>

        <div class="flex gap-3 flex-shrink-0 pt-4 border-t border-gray-700">
          <Button
              variant="secondary"
              class="flex-1"
              @click="emit('close')"
              :disabled="loading"
          >
            Cancelar
          </Button>
          <Button
              variant="primary"
              class="flex-1"
              :loading="loading"
              :disabled="selectedStatus === currentStatus"
              @click="handleUpdate"
          >
            {{ loading ? 'Atualizando...' : 'Confirmar Alteração' }}
          </Button>
        </div>
      </Card>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .card,
.modal-leave-active .card {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from .card,
.modal-leave-to .card {
  transform: scale(0.95);
  opacity: 0;
}
</style>
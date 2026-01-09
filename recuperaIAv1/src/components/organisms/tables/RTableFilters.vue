<script setup>
import { ref } from 'vue'
import RButton from '@/components/atoms/buttons/RButton.vue'
import RSelect from '@/components/atoms/inputs/RSelect.vue'
import RIcon from '@/components/atoms/icons/RIcon.vue'

defineProps({
  filters: { type: Array, default: () => [] } // [{ key: 'status', label: 'Status', options: [] }]
})

const emit = defineEmits(['apply', 'clear'])
const activeFilters = ref({})
const isOpen = ref(false)

const apply = () => {
  emit('apply', activeFilters.value)
  isOpen.value = false
}
</script>

<template>
  <div class="relative inline-block">
    <RButton variant="outline" icon-left="filter" @click="isOpen = !isOpen">
      Filtros
    </RButton>

    <div v-if="isOpen" class="absolute right-0 mt-2 w-72 bg-bg-primary border border-border-light rounded-lg shadow-xl z-20 p-4">
      <div class="space-y-4">
        <div v-for="filter in filters" :key="filter.key">
          <RSelect
              v-model="activeFilters[filter.key]"
              :label="filter.label"
              :options="filter.options"
              size="sm"
          />
        </div>
      </div>

      <div class="flex justify-between mt-4 pt-4 border-t border-border-light">
        <button class="text-xs text-text-tertiary hover:text-text-primary" @click="emit('clear'); activeFilters = {}">
          Limpar
        </button>
        <RButton size="sm" variant="primary" @click="apply">Aplicar</RButton>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import RDatePicker from '@components/atoms/inputs/RDatePicker.vue'
import RText from '@components/atoms/typography/RText.vue'
import RIcon from '@components/atoms/icons/RIcon.vue'

const props = defineProps({
  startDate: { type: [String, Date], default: null },
  endDate: { type: [String, Date], default: null },
  label: { type: String, default: 'Período' }
})

const emit = defineEmits(['update:startDate', 'update:endDate'])

const start = ref(props.startDate)
const end = ref(props.endDate)

watch(start, (val) => emit('update:startDate', val))
watch(end, (val) => emit('update:endDate', val))
</script>

<template>
  <div class="r-date-range-filter">
    <RText size="sm" color="secondary" class="r-date-range-filter__label">{{ label }}</RText>
    <div class="r-date-range-filter__inputs">
      <RDatePicker
        v-model="start"
        placeholder="Início"
        :max-date="end"
        class="r-date-range-filter__picker"
      />
      <div class="r-date-range-filter__separator">
        <RIcon name="arrow-right" size="14" />
      </div>
      <RDatePicker
        v-model="end"
        placeholder="Fim"
        :min-date="start"
        class="r-date-range-filter__picker"
      />
    </div>
  </div>
</template>

<style scoped>
.r-date-range-filter { display: flex; flex-direction: column; gap: 4px; }
.r-date-range-filter__inputs { display: flex; align-items: center; gap: 8px; }
.r-date-range-filter__separator { color: var(--text-tertiary); display: flex; align-items: center; }
.r-date-range-filter__picker { width: 140px; }
</style>
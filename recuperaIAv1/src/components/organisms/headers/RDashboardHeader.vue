<script setup>
import RHeading from '@/components/atoms/typography/RHeading.vue'
import RText from '@/components/atoms/typography/RText.vue'
import RDateRangeFilter from '@/components/molecules/filters/RDateRangeFilter.vue'
import RButton from '@/components/atoms/buttons/RButton.vue'

defineProps({
  userName: String,
  loading: Boolean
})

const emit = defineEmits(['refresh', 'filter-change'])
</script>

<template>
  <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
    <div>
      <RHeading level="1" class="mb-1">
        Olá, {{ userName }} 👋
      </RHeading>
      <RText color="secondary">
        Aqui está o resumo da sua operação hoje.
      </RText>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto bg-bg-primary p-2 rounded-lg border border-border-light shadow-sm">
      <RDateRangeFilter
          class="flex-1 sm:flex-none"
          @update:startDate="$emit('filter-change', { start: $event })"
          @update:endDate="$emit('filter-change', { end: $event })"
      />
      <div class="w-px bg-border-light hidden sm:block"></div>
      <RButton
          variant="ghost"
          icon-left="refresh-cw"
          :loading="loading"
          @click="$emit('refresh')"
      >
        Atualizar
      </RButton>
    </div>
  </div>
</template>
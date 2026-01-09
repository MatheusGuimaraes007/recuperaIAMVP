<script setup>
import RModal from './RModal.vue'
import RButton from '@/components/atoms/buttons/RButton.vue'

defineProps({
  modelValue: Boolean,
  title: String,
  loading: Boolean
})

defineEmits(['update:modelValue', 'edit'])
</script>

<template>
  <RModal :model-value="modelValue" :title="title" size="lg" @update:model-value="$emit('update:modelValue', $event)">
    <div v-if="loading" class="py-12 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div v-else>
      <slot />
    </div>

    <template #footer>
      <RButton variant="ghost" @click="$emit('update:modelValue', false)">Fechar</RButton>
      <RButton variant="primary" icon-left="edit-2" @click="$emit('edit')">Editar</RButton>
    </template>
  </RModal>
</template>
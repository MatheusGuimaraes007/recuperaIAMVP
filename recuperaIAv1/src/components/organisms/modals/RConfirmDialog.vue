<script setup>
import RModal from './RModal.vue'
import RButton from '@components/atoms/buttons/RButton.vue'
import RText from '@components/atoms/typography/RText.vue'

defineProps({
  modelValue: Boolean,
  title: { type: String, default: 'Confirmar Ação' },
  message: { type: String, required: true },
  confirmText: { type: String, default: 'Confirmar' },
  cancelText: { type: String, default: 'Cancelar' },
  danger: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'confirm'])
</script>

<template>
  <RModal
    :model-value="modelValue"
    :title="title"
    size="sm"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <RText>{{ message }}</RText>

    <template #footer>
      <RButton variant="ghost" @click="$emit('update:modelValue', false)">
        {{ cancelText }}
      </RButton>
      <RButton
        :variant="danger ? 'danger' : 'primary'"
        :loading="loading"
        @click="$emit('confirm')"
      >
        {{ confirmText }}
      </RButton>
    </template>
  </RModal>
</template>
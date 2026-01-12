<script setup>
/**
 * RTextarea - Campo de texto multilinha
 */
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: null },
  placeholder: { type: String, default: null },
  helpText: { type: String, default: null },
  error: { type: String, default: null },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  rows: { type: [String, Number], default: 4 },
  maxlength: { type: [String, Number], default: null },
  showCounter: { type: Boolean, default: false }, // NOVO
  resize: {
    type: String,
    default: 'vertical',
    validator: (v) => ['none', 'vertical', 'horizontal', 'both'].includes(v)
  }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

const textareaRef = ref(null)
const inputId = computed(() => `textarea-${Math.random().toString(36).substr(2, 9)}`)

// NOVO: contador de caracteres
const characterCount = computed(() => {
  return String(props.modelValue).length
})

const showCharacterCounter = computed(() => {
  return props.showCounter && props.maxlength
})
</script>

<template>
  <div class="r-textarea">
    <label v-if="label" :for="inputId" class="r-textarea__label">
      {{ label }}
      <span v-if="required" class="r-textarea__required">*</span>
    </label>

    <textarea
      :id="inputId"
      ref="textareaRef"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :maxlength="maxlength"
      :class="[
        'r-textarea__field',
        { 'r-textarea__field--error': error }
      ]"
      :style="{ resize }"
      @input="emit('update:modelValue', $event.target.value)"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />

    <!-- NOVO: Contador de caracteres -->
    <div v-if="showCharacterCounter" class="r-textarea__counter">
      {{ characterCount }} / {{ maxlength }}
    </div>

    <p v-if="error" class="r-textarea__error">{{ error }}</p>
    <p v-else-if="helpText" class="r-textarea__help">{{ helpText }}</p>
  </div>
</template>

<style scoped>
.r-textarea {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.r-textarea__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.r-textarea__required {
  color: var(--color-error);
}

.r-textarea__field {
  width: 100%;
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  color: var(--text-primary);
  padding: var(--spacing-3) var(--spacing-4);
  border: var(--border-width-default) solid var(--border-medium);
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  transition: border-color var(--duration-normal) var(--easing-out),
              box-shadow var(--duration-normal) var(--easing-out);
  outline: none;
}

.r-textarea__field:focus {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}

.r-textarea__field--error {
  border-color: var(--color-error);
}

.r-textarea__field:disabled {
  background-color: var(--color-gray-100); /* CORRIGIDO: era bg-tertiary */
  opacity: 0.6;
  cursor: not-allowed;
}

/* NOVO: Character counter */
.r-textarea__counter {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  text-align: right;
}

.r-textarea__error {
  font-size: var(--font-size-sm);
  color: var(--color-error);
  margin: 0;
}

.r-textarea__help {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
}
</style>
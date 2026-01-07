<script setup>
/**
 * RFileUpload - Upload de arquivos
 */
import { ref } from 'vue'

const props = defineProps({
  modelValue: { type: File, default: null },
  label: { type: String, default: null },
  accept: { type: String, default: null },
  multiple: { type: Boolean, default: false },
  maxSize: { type: Number, default: null }, // em bytes
  error: { type: String, default: null },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'change'])

const inputRef = ref(null)
const fileName = ref(null)

const handleChange = (event) => {
  const files = event.target.files
  if (files && files.length > 0) {
    const file = files[0]

    if (props.maxSize && file.size > props.maxSize) {
      emit('change', { error: 'File too large' })
      return
    }

    fileName.value = file.name
    emit('update:modelValue', file)
    emit('change', file)
  }
}

const triggerFileInput = () => {
  inputRef.value?.click()
}
</script>

<template>
  <div class="r-file-upload">
    <label v-if="label" class="r-file-upload__label">{{ label }}</label>

    <div
      :class="[
        'r-file-upload__zone',
        { 'r-file-upload__zone--error': error }
      ]"
      @click="triggerFileInput"
    >
      <input
        ref="inputRef"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        class="r-file-upload__input"
        @change="handleChange"
      >

      <div class="r-file-upload__content">
        <span class="r-file-upload__icon">📁</span>
        <p class="r-file-upload__text">
          {{ fileName || 'Click to upload or drag and drop' }}
        </p>
      </div>
    </div>

    <p v-if="error" class="r-file-upload__error">{{ error }}</p>
  </div>
</template>

<style scoped>
.r-file-upload {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.r-file-upload__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.r-file-upload__zone {
  border: 2px dashed var(--border-medium);
  border-radius: var(--radius-md);
  padding: var(--spacing-8);
  text-align: center;
  cursor: pointer;
  transition: var(--transition-normal);
}

.r-file-upload__zone:hover {
  border-color: var(--color-primary);
  background-color: var(--color-primary-50);
}

.r-file-upload__zone--error {
  border-color: var(--color-error);
}

.r-file-upload__input {
  display: none;
}

.r-file-upload__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
}

.r-file-upload__icon {
  font-size: 48px;
}

.r-file-upload__text {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.r-file-upload__error {
  font-size: var(--font-size-sm);
  color: var(--color-error);
  margin: 0;
}
</style>
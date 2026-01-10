<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: { type: File, default: null },
  label: { type: String, default: null },
  accept: { type: String, default: null },
  multiple: { type: Boolean, default: false },
  maxSize: { type: Number, default: null },
  error: { type: String, default: null },
  disabled: { type: Boolean, default: false },
  helpText: { type: String, default: null }
})

const emit = defineEmits(['update:modelValue', 'change', 'error'])

const inputRef = ref(null)
const fileName = ref(null)
const isDragging = ref(false)

const handleChange = (event) => {
  const files = event.target.files
  if (files && files.length > 0) {
    const file = files[0]

    if (props.maxSize && file.size > props.maxSize) {
      emit('error', { error: 'File too large', maxSize: props.maxSize, fileSize: file.size })
      return
    }

    fileName.value = file.name
    emit('update:modelValue', file)
    emit('change', file)
  }
}

const triggerFileInput = () => {
  if (!props.disabled) {
    inputRef.value?.click()
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
  if (!props.disabled) {
    isDragging.value = true
  }
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragging.value = false

  if (props.disabled) return

  const files = event.dataTransfer.files
  if (files && files.length > 0) {
    const file = files[0]

    if (props.maxSize && file.size > props.maxSize) {
      emit('error', { error: 'File too large', maxSize: props.maxSize, fileSize: file.size })
      return
    }

    fileName.value = file.name
    emit('update:modelValue', file)
    emit('change', file)
  }
}

const formatFileSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>

<template>
  <div class="r-file-upload">
    <label v-if="label" class="r-file-upload__label">
      {{ label }}
    </label>

    <div
        :class="[
        'r-file-upload__zone',
        { 'r-file-upload__zone--error': error },
        { 'r-file-upload__zone--disabled': disabled },
        { 'r-file-upload__zone--dragging': isDragging }
      ]"
        @click="triggerFileInput"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
    >
      <input
          ref="inputRef"
          type="file"
          class="r-file-upload__input"
          :accept="accept"
          :multiple="multiple"
          :disabled="disabled"
          @change="handleChange"
      >

      <div class="r-file-upload__content">
        <svg
            class="r-file-upload__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        <p class="r-file-upload__text">
          <span v-if="fileName" class="r-file-upload__filename">{{ fileName }}</span>
          <span v-else>
            <strong>Clique para fazer upload</strong> ou arraste o arquivo
          </span>
        </p>

        <p v-if="accept || maxSize" class="r-file-upload__hint">
          <span v-if="accept">{{ accept }}</span>
          <span v-if="accept && maxSize"> • </span>
          <span v-if="maxSize">Máx: {{ formatFileSize(maxSize) }}</span>
        </p>
      </div>
    </div>

    <p v-if="helpText && !error" class="r-file-upload__help">
      {{ helpText }}
    </p>

    <p v-if="error" class="r-file-upload__error">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.r-file-upload {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1-5);
  width: 100%;
}

.r-file-upload__label {
  font-family: var(--font-sans);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.r-file-upload__zone {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-8);
  border: 2px dashed var(--border-medium);
  border-radius: var(--radius-lg);
  background-color: var(--color-gray-50);
  cursor: pointer;
  transition: all var(--duration-normal) var(--easing-out);
}

.r-file-upload__zone:hover:not(.r-file-upload__zone--disabled) {
  border-color: var(--color-primary-600);
  background-color: var(--color-primary-50);
}

.r-file-upload__zone--dragging {
  border-color: var(--color-primary-600);
  background-color: var(--color-primary-50);
  transform: scale(1.02);
}

.r-file-upload__zone--error {
  border-color: var(--color-error-500);
  background-color: var(--color-error-50);
}

.r-file-upload__zone--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.r-file-upload__input {
  display: none;
}

.r-file-upload__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
  text-align: center;
}

.r-file-upload__icon {
  width: var(--spacing-12);
  height: var(--spacing-12);
  color: var(--text-secondary);
}

.r-file-upload__text {
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  color: var(--text-primary);
  margin: 0;
}

.r-file-upload__filename {
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-600);
}

.r-file-upload__hint {
  font-family: var(--font-sans);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
}

.r-file-upload__help {
  font-family: var(--font-sans);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
}

.r-file-upload__error {
  font-family: var(--font-sans);
  font-size: var(--font-size-sm);
  color: var(--color-error-500);
  margin: 0;
}
</style>
<script setup>
import { ref, computed } from 'vue'
import RSpinner from '../feedback/RSpinner.vue' // CORRIGIDO: faltava import

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  width: { type: [String, Number], default: null },
  height: { type: [String, Number], default: null },
  fit: {
    type: String,
    default: 'cover',
    validator: (v) => ['contain', 'cover', 'fill', 'none', 'scale-down'].includes(v)
  },
  lazy: { type: Boolean, default: true },
  fallback: { type: String, default: null }
})

const isLoaded = ref(false)
const hasError = ref(false)

const handleLoad = () => {
  isLoaded.value = true
}

const handleError = () => {
  hasError.value = true
}

const displaySrc = computed(() => {
  if (hasError.value && props.fallback) return props.fallback
  return props.src
})
</script>

<template>
  <div class="r-image">
    <img
      :src="displaySrc"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="lazy ? 'lazy' : 'eager'"
      :class="[
        'r-image__img',
        { 'r-image__img--loaded': isLoaded }
      ]"
      :style="{ objectFit: fit }"
      @load="handleLoad"
      @error="handleError"
    >
    <div v-if="!isLoaded" class="r-image__placeholder">
      <RSpinner size="sm" />
    </div>
  </div>
</template>

<style scoped>
.r-image {
  position: relative;
  display: inline-block;
  overflow: hidden;
}

.r-image__img {
  display: block;
  width: 100%;
  height: auto;
  opacity: 0;
  transition: opacity var(--duration-normal) ease-out;
}

.r-image__img--loaded {
  opacity: 1;
}

.r-image__placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-gray-100); /* CORRIGIDO: era bg-tertiary */
}
</style>
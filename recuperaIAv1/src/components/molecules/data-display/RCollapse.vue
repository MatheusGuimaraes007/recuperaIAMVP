
<script setup>
import { ref } from 'vue'
import RIcon from '@components/atoms/icons/RIcon.vue'
import RText from '@components/atoms/typography/RText.vue'

const props = defineProps({
  title: { type: String, required: true },
  defaultOpen: { type: Boolean, default: false }
})

const isOpen = ref(props.defaultOpen)
const toggle = () => isOpen.value = !isOpen.value
</script>

<template>
  <div :class="['r-collapse', { 'r-collapse--open': isOpen }]">
    <button class="r-collapse__header" @click="toggle">
      <RText weight="medium">{{ title }}</RText>
      <RIcon
        name="chevron-down"
        class="r-collapse__icon"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>
    <div v-show="isOpen" class="r-collapse__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.r-collapse {
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.r-collapse__header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--bg-primary);
  border: none;
  cursor: pointer;
}

.r-collapse__header:hover {
  background-color: var(--bg-secondary);
}

.r-collapse__icon {
  transition: transform 0.3s ease;
}

.rotate-180 { transform: rotate(180deg); }

.r-collapse__content {
  padding: var(--spacing-4);
  border-top: 1px solid var(--border-light);
  background-color: var(--bg-primary);
}
</style>
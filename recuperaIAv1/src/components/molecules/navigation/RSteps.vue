<script setup>
/**
 * RSteps - Indicador de Etapas/Passos
 *
 * Componente molecule para exibir progresso em múltiplas etapas
 * com estados completed, current e upcoming.
 *
 * @example
 * <RSteps
 *   :steps="[
 *     { label: 'Conta', description: 'Dados básicos' },
 *     { label: 'Perfil', description: 'Informações' },
 *     { label: 'Confirmação' }
 *   ]"
 *   :currentStep="1"
 * />
 */

import { computed } from 'vue'
import RIcon from '@components/atoms/icons/RIcon.vue'
import RText from '@components/atoms/typography/RText.vue'

const props = defineProps({
  steps: {
    type: Array,
    required: true,
    validator: steps => steps.every(step => step.label)
  },
  currentStep: { type: Number, default: 0 },
  vertical: { type: Boolean, default: false },
  clickable: { type: Boolean, default: false },
  size: {
    type: String,
    default: 'md',
    validator: v => ['sm', 'md', 'lg'].includes(v)
  },
  showDescription: { type: Boolean, default: true }
})

const emit = defineEmits(['step-click', 'change'])

const getStepStatus = (index) => {
  if (index < props.currentStep) return 'completed'
  if (index === props.currentStep) return 'current'
  return 'upcoming'
}

const handleStepClick = (index) => {
  if (props.clickable && index <= props.currentStep) {
    emit('step-click', index)
    emit('change', index)
  }
}

const containerClasses = computed(() => [
  'r-steps',
  `r-steps--${props.size}`,
  { 'r-steps--vertical': props.vertical },
  { 'r-steps--clickable': props.clickable }
])
</script>

<template>
  <div :class="containerClasses">
    <div
      v-for="(step, index) in steps"
      :key="index"
      :class="[
        'r-step',
        `r-step--${getStepStatus(index)}`,
        { 'r-step--clickable': clickable && index <= currentStep }
      ]"
      @click="handleStepClick(index)"
    >
      <div v-if="index !== steps.length - 1" class="r-step__line" />

      <div class="r-step__indicator">
        <div class="r-step__circle">
          <RIcon
            v-if="getStepStatus(index) === 'completed'"
            name="check"
            :size="size === 'sm' ? 12 : size === 'lg' ? 18 : 14"
          />
          <span v-else>{{ index + 1 }}</span>
        </div>
      </div>

      <div class="r-step__content">
        <RText
          :size="size === 'sm' ? 'xs' : size === 'lg' ? 'base' : 'sm'"
          :weight="getStepStatus(index) === 'current' ? 'bold' : 'medium'"
          class="r-step__label"
        >
          {{ step.label }}
        </RText>

        <RText
          v-if="step.description && showDescription"
          size="xs"
          color="tertiary"
          class="r-step__description"
        >
          {{ step.description }}
        </RText>
      </div>
    </div>
  </div>
</template>

<style scoped>
.r-steps {
  display: flex;
  justify-content: space-between;
  counter-reset: step;
}

.r-steps--vertical {
  flex-direction: column;
  gap: var(--spacing-4);
}

.r-step {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  flex: 1;
}

.r-steps:not(.r-steps--vertical) .r-step:last-child {
  flex: 0;
}

.r-step--clickable {
  cursor: pointer;
}

.r-step--clickable:hover .r-step__circle {
  transform: scale(1.1);
}

/* Line connector */
.r-step__line {
  position: absolute;
  background-color: var(--color-border-light);
  z-index: 0;
  transition: background-color var(--transition-normal);
}

.r-steps:not(.r-steps--vertical) .r-step__line {
  top: 12px;
  left: calc(50% + 12px);
  right: calc(-50% + 12px);
  height: 2px;
}

.r-steps--sm:not(.r-steps--vertical) .r-step__line {
  top: 10px;
}

.r-steps--lg:not(.r-steps--vertical) .r-step__line {
  top: 16px;
}

.r-steps--vertical .r-step__line {
  top: 28px;
  left: 11px;
  bottom: -16px;
  width: 2px;
  height: auto;
}

.r-step--completed .r-step__line {
  background-color: var(--color-primary);
}

/* Indicator */
.r-step__indicator {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.r-step__circle {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-bold);
  border: 2px solid;
  background-color: var(--color-bg-primary);
  transition: all var(--transition-normal);
}

.r-steps--sm .r-step__circle {
  width: 20px;
  height: 20px;
  font-size: var(--font-size-xs);
}

.r-steps--md .r-step__circle {
  width: 24px;
  height: 24px;
  font-size: var(--font-size-xs);
}

.r-steps--lg .r-step__circle {
  width: 32px;
  height: 32px;
  font-size: var(--font-size-sm);
}

/* Content */
.r-step__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  padding-top: 2px;
}

.r-steps--vertical .r-step__content {
  flex: 1;
}

/* Status: Completed */
.r-step--completed .r-step__circle {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-white);
}

.r-step--completed .r-step__label {
  color: var(--color-primary);
}

/* Status: Current */
.r-step--current .r-step__circle {
  border-color: var(--color-primary);
  color: var(--color-primary);
  border-width: 3px;
}

.r-step--current .r-step__label {
  color: var(--color-text-primary);
}

/* Status: Upcoming */
.r-step--upcoming .r-step__circle {
  border-color: var(--color-border-medium);
  color: var(--color-text-tertiary);
}

.r-step--upcoming .r-step__label {
  color: var(--color-text-tertiary);
}

@media (max-width: 640px) {
  .r-steps:not(.r-steps--vertical) {
    overflow-x: auto;
    justify-content: flex-start;
  }

  .r-step__content {
    min-width: 80px;
  }
}
</style>
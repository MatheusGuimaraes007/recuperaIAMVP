<script setup>
import RIcon from '@components/atoms/icons/RIcon.vue'

const props = defineProps({
  /**
   * Array de objetos: { label: 'Conta', description?: 'Dados básicos' }
   */
  steps: { type: Array, required: true },
  currentStep: { type: Number, default: 0 },
  vertical: { type: Boolean, default: false }
})

defineEmits(['change'])

const getStepStatus = (index) => {
  if (index < props.currentStep) return 'completed'
  if (index === props.currentStep) return 'current'
  return 'upcoming'
}
</script>

<template>
  <div :class="['r-steps', { 'r-steps--vertical': vertical }]">
    <div
      v-for="(step, index) in steps"
      :key="index"
      :class="['r-step', `r-step--${getStepStatus(index)}`]"
    >
      <div v-if="index !== steps.length - 1" class="r-step__line"></div>

      <div class="r-step__circle">
        <RIcon v-if="getStepStatus(index) === 'completed'" name="check" size="16" />
        <span v-else>{{ index + 1 }}</span>
      </div>

      <div class="r-step__content">
        <span class="r-step__label">{{ step.label }}</span>
        <span v-if="step.description" class="r-step__desc">{{ step.description }}</span>
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
  gap: var(--spacing-6);
}

.r-step {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  flex: 1;
}

.r-step:last-child {
  flex: 0;
}

/* Connector Line */
.r-step__line {
  position: absolute;
  top: 50%;
  left: calc(var(--spacing-3) + 24px); /* circle width + padding */
  right: calc(var(--spacing-3) * -1);
  height: 2px;
  background-color: var(--border-light);
  transform: translateY(-50%);
  z-index: 0;
}

.r-steps--vertical .r-step__line {
  top: 32px;
  left: 12px;
  right: auto;
  bottom: -24px; /* gap size */
  width: 2px;
  height: auto;
}

.r-step--completed .r-step__line {
  background-color: var(--color-primary);
}

/* Circle */
.r-step__circle {
  position: relative;
  z-index: 1;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: bold;
  border: 2px solid;
  background-color: var(--bg-primary);
  transition: all 0.3s;
}

/* Content */
.r-step__content {
  display: flex;
  flex-direction: column;
}

.r-step__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.r-step__desc {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

/* Status Styles */
.r-step--completed .r-step__circle {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-white);
}

.r-step--completed .r-step__label {
  color: var(--color-primary);
}

.r-step--current .r-step__circle {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.r-step--current .r-step__label {
  color: var(--text-primary);
  font-weight: var(--font-weight-bold);
}

.r-step--upcoming .r-step__circle {
  border-color: var(--border-medium);
  color: var(--text-tertiary);
}

.r-step--upcoming .r-step__label {
  color: var(--text-tertiary);
}
</style>
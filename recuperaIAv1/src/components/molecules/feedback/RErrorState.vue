<script setup>
/**
 * RErrorState - Estado de erro
 */
import RHeading from '@components/atoms/typography/RHeading.vue'
import RText from '@components/atoms/typography/RText.vue'
import RButton from '@components/atoms/buttons/RButton.vue'
import RCode from '@components/atoms/typography/RCode.vue'

const props = defineProps({
  title: { type: String, default: 'Algo deu errado' },
  message: { type: String, default: null },
  errorCode: { type: String, default: null },
  retryLabel: { type: String, default: 'Tentar novamente' }
})

const emit = defineEmits(['retry'])
</script>

<template>
  <div class="r-error-state">
    <div class="r-error-state__icon">⚠️</div>
    <RHeading level="3" align="center" color="error">{{ title }}</RHeading>
    <RText v-if="message" color="secondary" align="center" class="r-error-state__message">
      {{ message }}
    </RText>
    <RCode v-if="errorCode" class="r-error-state__code">{{ errorCode }}</RCode>
    <RButton variant="primary" @click="emit('retry')" class="r-error-state__action">
      {{ retryLabel }}
    </RButton>
  </div>
</template>

<style scoped>
.r-error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-12);
  text-align: center;
}

.r-error-state__icon {
  font-size: 64px;
  margin-bottom: var(--spacing-4);
}

.r-error-state__message {
  margin-top: var(--spacing-2);
  max-width: 400px;
}

.r-error-state__code {
  margin-top: var(--spacing-2);
}

.r-error-state__action {
  margin-top: var(--spacing-6);
}
</style>
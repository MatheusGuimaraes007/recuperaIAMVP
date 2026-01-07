<script setup>
/**
 * RUserCard - Card de perfil de usuário
 */
import RCard from './RCard.vue'
import RAvatar from '@components/atoms/feedback/RAvatar.vue'
import RHeading from '@components/atoms/typography/RHeading.vue'
import RText from '@components/atoms/typography/RText.vue'
import RBadge from '@components/atoms/feedback/RBadge.vue'
import RButton from '@components/atoms/buttons/RButton.vue'

const props = defineProps({
  name: { type: String, required: true },
  role: { type: String, default: null },
  email: { type: String, default: null },
  avatar: { type: String, default: null },
  status: { type: String, default: null },
  actions: { type: Boolean, default: true }
})

const emit = defineEmits(['view-profile', 'send-message'])
</script>

<template>
  <RCard padding="md" class="r-user-card">
    <div class="r-user-card__header">
      <RAvatar :src="avatar" :name="name" size="lg" />
      <div class="r-user-card__info">
        <div class="r-user-card__name-row">
          <RHeading level="5">{{ name }}</RHeading>
          <RBadge v-if="status" variant="success" size="sm">
            {{ status }}
          </RBadge>
        </div>
        <RText v-if="role" size="sm" color="secondary">{{ role }}</RText>
        <RText v-if="email" size="sm" color="tertiary">{{ email }}</RText>
      </div>
    </div>

    <div v-if="actions" class="r-user-card__actions">
      <RButton
        size="sm"
        variant="outline"
        :full-width="true"
        @click="emit('view-profile')"
      >
        Ver Perfil
      </RButton>
      <RButton
        size="sm"
        variant="primary"
        :full-width="true"
        @click="emit('send-message')"
      >
        Mensagem
      </RButton>
    </div>
  </RCard>
</template>

<style scoped>
.r-user-card__header {
  display: flex;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-4);
}

.r-user-card__info {
  flex: 1;
  min-width: 0;
}

.r-user-card__name-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-1);
}

.r-user-card__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2);
}
</style>
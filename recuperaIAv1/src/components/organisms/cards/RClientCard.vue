<script setup>
import RCard from '@components/atoms/layout/RCard.vue'
import RAvatar from '@components/atoms/feedback/RAvatar.vue'
import RHeading from '@components/atoms/typography/RHeading.vue'
import RText from '@components/atoms/typography/RText.vue'
import RStatusBadge from '@components/molecules/data-display/RStatusBadge.vue'
import RIcon from '@components/atoms/icons/RIcon.vue'
import { formatDate } from '@utils/formatters'

defineProps({
  client: {
    type: Object,
    required: true,
    // Espera: { name, email, avatar_url, status, created_at, plan, ... }
  },
  loading: Boolean
})
</script>

<template>
  <RCard class="r-client-card" padding="lg">
    <div class="r-client-card__header">
      <div class="r-client-card__main-info">
        <div class="relative group">
          <div class="r-client-card__avatar-glow"></div>
          <RAvatar
            :name="client.name || 'Sem Nome'"
            :src="client.avatar_url"
            size="xl"
            class="relative z-10"
          />
        </div>

        <div class="r-client-card__texts">
          <div class="flex items-center gap-2">
            <RHeading level="2">{{ client.name || 'Cliente Sem Nome' }}</RHeading>
            <span class="r-client-card__tag">CLIENTE</span>
          </div>

          <div class="flex items-center gap-4 text-secondary">
            <div class="flex items-center gap-1">
              <RIcon name="mail" size="16" />
              <RText color="secondary">{{ client.email }}</RText>
            </div>
          </div>
        </div>
      </div>

      <RStatusBadge
        v-if="client.status"
        :status="client.status"
        size="lg"
      />
    </div>

    <div class="r-client-card__details">
      <div class="r-client-card__detail-item">
        <div class="r-client-card__icon-box bg-blue-soft">
          <RIcon name="calendar" class="text-blue" />
        </div>
        <div>
          <RText size="xs" color="secondary">Cadastro</RText>
          <RText weight="semibold">{{ formatDate(client.created_at) }}</RText>
        </div>
      </div>

      <div class="r-client-card__detail-item">
        <div class="r-client-card__icon-box bg-purple-soft">
          <RIcon name="briefcase" class="text-purple" />
        </div>
        <div>
          <RText size="xs" color="secondary">Plano</RText>
          <RText weight="semibold">{{ client.plan || 'Não definido' }}</RText>
        </div>
      </div>

      </div>
  </RCard>
</template>

<style scoped>
.r-client-card__header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
}

@media (min-width: 640px) {
  .r-client-card__header {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
}

.r-client-card__main-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.r-client-card__tag {
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: var(--color-primary-100);
  color: var(--color-primary);
  border: 1px solid var(--color-primary-200);
}

.r-client-card__details {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-4);
  padding-top: var(--spacing-6);
  border-top: 1px solid var(--border-light);
}

@media (min-width: 768px) {
  .r-client-card__details {
    grid-template-columns: repeat(3, 1fr);
  }
}

.r-client-card__detail-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.r-client-card__icon-box {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Utilitários de cor para o exemplo (devem vir do design tokens) */
.bg-blue-soft { background-color: var(--color-info-50); }
.text-blue { color: var(--color-info); }
.bg-purple-soft { background-color: #F3E8FF; }
.text-purple { color: #9333EA; }
</style>
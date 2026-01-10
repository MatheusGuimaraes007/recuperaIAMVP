<template>
  <RMinimalLayout>
    <div class="not-found-page">
      <RCard class="not-found-card" padding="xl">
        <div class="not-found-content">
          <!-- Icon -->
          <div class="error-icon">
            <FileQuestion :size="64" />
          </div>

          <!-- Title -->
          <RHeading level="1" class="error-title">
            404
          </RHeading>

          <RHeading level="2" class="error-subtitle">
            Página Não Encontrada
          </RHeading>

          <!-- Message -->
          <RText color="secondary" class="error-message">
            A página que você está procurando não existe ou foi removida.
          </RText>

          <!-- Actions -->
          <div class="error-actions">
            <RButton
              variant="primary"
              size="lg"
              @click="router.push({ name: 'dashboard' })"
            >
              Voltar ao Dashboard
            </RButton>

            <RButton
              variant="secondary"
              size="lg"
              @click="router.back()"
            >
              Página Anterior
            </RButton>
          </div>
        </div>
      </RCard>
    </div>
  </RMinimalLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { FileQuestion } from 'lucide-vue-next'

// Layout
import RMinimalLayout from '@/components/templates/layouts/RMinimalLayout.vue'

// Components
import RCard from '@/components/atoms/layout/RCard.vue'
import RHeading from '@/components/atoms/typography/RHeading.vue'
import RText from '@/components/atoms/typography/RText.vue'
import RButton from '@/components/atoms/buttons/RButton.vue'

const router = useRouter()
</script>

<style scoped>
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--spacing-4);
  background-color: var(--color-bg-secondary);
}

.not-found-card {
  max-width: 600px;
  width: 100%;
}

.not-found-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--spacing-4);
}

.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.error-title {
  font-size: 6rem;
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1;
  margin: 0;
}

.error-subtitle {
  font-size: 1.5rem;
  color: var(--color-text-primary);
  margin: 0;
}

.error-message {
  max-width: 400px;
  margin: 0;
}

.error-actions {
  display: flex;
  gap: var(--spacing-3);
  margin-top: var(--spacing-4);
}

@media (max-width: 640px) {
  .error-title {
    font-size: 4rem;
  }

  .error-subtitle {
    font-size: 1.25rem;
  }

  .error-actions {
    flex-direction: column;
    width: 100%;
  }

  .error-actions button {
    width: 100%;
  }
}
</style>
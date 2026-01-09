<script setup>
import RHeading from '@components/atoms/typography/RHeading.vue'
import RText from '@components/atoms/typography/RText.vue'
import RBreadcrumb from '@components/molecules/navigation/RBreadcrumb.vue'

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: null },
  breadcrumb: { type: Array, default: () => [] } // [{ label: 'Home', to: '/' }]
})
</script>

<template>
  <header class="r-page-header">
    <div class="r-page-header__content">
      <RBreadcrumb
        v-if="breadcrumb.length"
        :items="breadcrumb"
        class="r-page-header__breadcrumb"
      />

      <div class="r-page-header__row">
        <div class="r-page-header__titles">
          <RHeading level="1">{{ title }}</RHeading>
          <RText v-if="subtitle" color="secondary">{{ subtitle }}</RText>
        </div>

        <div v-if="$slots.actions" class="r-page-header__actions">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.r-page-header {
  margin-bottom: var(--spacing-6);
  background-color: transparent;
}

.r-page-header__breadcrumb {
  margin-bottom: var(--spacing-2);
}

.r-page-header__row {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

@media (min-width: 768px) {
  .r-page-header__row {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
}

.r-page-header__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}
</style>
<script setup>
/**
 * RBreadcrumb - Navegação breadcrumb
 */
import { computed } from 'vue'
import RLink from '@components/atoms/typography/RLink.vue'
import RText from '@components/atoms/typography/RText.vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
    // [{ label: 'Home', to: '/' }, { label: 'Products' }]
  },
  separator: {
    type: String,
    default: '/'
  }
})

const lastIndex = computed(() => props.items.length - 1)
</script>

<template>
  <nav class="r-breadcrumb" aria-label="Breadcrumb">
    <ol class="r-breadcrumb__list">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="r-breadcrumb__item"
      >
        <RLink
          v-if="item.to && index !== lastIndex"
          :to="item.to"
          :underline="false"
        >
          {{ item.label }}
        </RLink>
        <RText
          v-else
          size="sm"
          :color="index === lastIndex ? 'primary' : 'secondary'"
          weight="medium"
        >
          {{ item.label }}
        </RText>

        <span
          v-if="index !== lastIndex"
          class="r-breadcrumb__separator"
          aria-hidden="true"
        >
          {{ separator }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.r-breadcrumb__list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  list-style: none;
  margin: 0;
  padding: 0;
}

.r-breadcrumb__item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.r-breadcrumb__separator {
  color: var(--text-tertiary);
  user-select: none;
}
</style>
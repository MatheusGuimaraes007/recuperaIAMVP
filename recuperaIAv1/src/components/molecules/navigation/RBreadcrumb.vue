<script setup>
/**
 * RBreadcrumb - Navegação Breadcrumb
 *
 * Componente molecule para exibir trilha de navegação hierárquica
 * com separadores customizáveis e suporte a ícones.
 *
 * @example
 * <RBreadcrumb
 *   :items="[
 *     { label: 'Home', to: '/', icon: 'home' },
 *     { label: 'Pacientes', to: '/pacientes' },
 *     { label: 'Detalhes' }
 *   ]"
 * />
 */

import { computed } from 'vue'
import RLink from '@components/atoms/typography/RLink.vue'
import RText from '@components/atoms/typography/RText.vue'
import RIcon from '@components/atoms/icons/RIcon.vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    validator: (items) => items.every(item => item.label)
  },
  separator: { type: String, default: '/' },
  separatorIcon: { type: String, default: null },
  maxItems: { type: Number, default: 0 },
  size: {
    type: String,
    default: 'sm',
    validator: v => ['xs', 'sm', 'base'].includes(v)
  },
  showHome: { type: Boolean, default: true },
  homeIcon: { type: String, default: 'home' }
})

const emit = defineEmits(['item-click'])

const lastIndex = computed(() => props.items.length - 1)

const visibleItems = computed(() => {
  if (props.maxItems > 0 && props.items.length > props.maxItems) {
    return [
      props.items[0],
      { label: '...', collapsed: true },
      ...props.items.slice(-(props.maxItems - 2))
    ]
  }
  return props.items
})

const handleClick = (item, index) => {
  if (!item.to) {
    emit('item-click', { item, index })
  }
}
</script>

<template>
  <nav class="r-breadcrumb" aria-label="Breadcrumb">
    <ol class="r-breadcrumb__list">
      <li
        v-for="(item, index) in visibleItems"
        :key="index"
        class="r-breadcrumb__item"
      >
        <RLink
          v-if="item.to && !item.collapsed"
          :to="item.to"
          :underline="false"
          class="r-breadcrumb__link"
          @click="handleClick(item, index)"
        >
          <RIcon v-if="item.icon" :name="item.icon" :size="size === 'xs' ? 12 : 14" />
          <span>{{ item.label }}</span>
        </RLink>

        <RText
          v-else
          :size="size"
          :color="item.collapsed ? 'tertiary' : (index === lastIndex ? 'primary' : 'secondary')"
          :weight="index === lastIndex ? 'semibold' : 'medium'"
          class="r-breadcrumb__text"
        >
          <RIcon v-if="item.icon && !item.collapsed" :name="item.icon" :size="size === 'xs' ? 12 : 14" />
          <span>{{ item.label }}</span>
        </RText>

        <span
          v-if="index !== lastIndex && !item.collapsed"
          class="r-breadcrumb__separator"
          aria-hidden="true"
        >
          <RIcon v-if="separatorIcon" :name="separatorIcon" size="12" />
          <template v-else>{{ separator }}</template>
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

.r-breadcrumb__link,
.r-breadcrumb__text {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.r-breadcrumb__link {
  transition: color var(--transition-fast);
}

.r-breadcrumb__link:hover {
  color: var(--color-primary);
}

.r-breadcrumb__separator {
  color: var(--color-text-tertiary);
  user-select: none;
  display: flex;
  align-items: center;
}
</style>
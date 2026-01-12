<script setup>
/**
 * RFilterChips - Lista de Chips de Filtros Ativos
 *
 * Componente molecule que exibe chips removíveis dos filtros aplicados
 * com opção de limpar todos de uma vez.
 *
 * @example
 * <RFilterChips
 *   :filters="activeFilters"
 *   @remove="handleRemoveFilter"
 *   @clear-all="handleClearAll"
 * />
 */

import { computed } from 'vue'
import RChip from '@components/molecules/data-display/RChip.vue'
import RButton from '@components/atoms/buttons/RButton.vue'
import RText from '@components/atoms/typography/RText.vue'

// Props
const props = defineProps({
  /**
   * Array de filtros ativos
   * Formato: [{ id: 'status', label: 'Status: Ativo', color: 'primary' }]
   */
  filters: {
    type: Array,
    default: () => []
  },

  /**
   * Label antes dos chips
   */
  label: {
    type: String,
    default: 'Filtros:'
  },

  /**
   * Label do botão limpar
   */
  clearLabel: {
    type: String,
    default: 'Limpar tudo'
  },

  /**
   * Se deve mostrar o label
   */
  showLabel: {
    type: Boolean,
    default: true
  },

  /**
   * Se deve mostrar botão de limpar
   */
  showClearAll: {
    type: Boolean,
    default: true
  },

  /**
   * Tamanho dos chips
   * @values sm, md, lg
   */
  chipSize: {
    type: String,
    default: 'sm',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },

  /**
   * Variante dos chips
   * @values default, outline, soft, solid
   */
  chipVariant: {
    type: String,
    default: 'soft',
    validator: (value) => ['default', 'outline', 'soft', 'solid'].includes(value)
  },

  /**
   * Alinhamento do conteúdo
   * @values left, center, right
   */
  align: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'center', 'right'].includes(value)
  },

  /**
   * Máximo de chips a exibir (0 = ilimitado)
   */
  maxVisible: {
    type: Number,
    default: 0
  }
})

// Emits
const emit = defineEmits([
  'remove',
  'clear-all',
  'show-more'
])

// Computed
const hasFilters = computed(() => {
  return props.filters.length > 0
})

const visibleFilters = computed(() => {
  if (props.maxVisible > 0 && props.filters.length > props.maxVisible) {
    return props.filters.slice(0, props.maxVisible)
  }
  return props.filters
})

const hiddenCount = computed(() => {
  if (props.maxVisible > 0 && props.filters.length > props.maxVisible) {
    return props.filters.length - props.maxVisible
  }
  return 0
})

const containerClasses = computed(() => {
  const classes = ['r-filter-chips']
  classes.push(`r-filter-chips--align-${props.align}`)
  return classes
})

// Methods
const handleRemove = (filterId) => {
  emit('remove', filterId)
}

const handleClearAll = () => {
  emit('clear-all')
}

const handleShowMore = () => {
  emit('show-more')
}
</script>

<template>
  <div v-if="hasFilters" :class="containerClasses">
    <div class="r-filter-chips__list">
      <!-- Label -->
      <RText
        v-if="showLabel"
        size="sm"
        weight="medium"
        color="secondary"
        class="r-filter-chips__label"
      >
        {{ label }}
      </RText>

      <!-- Filter Chips -->
      <RChip
        v-for="filter in visibleFilters"
        :key="filter.id"
        :label="filter.label"
        :color="filter.color || 'primary'"
        :variant="chipVariant"
        :size="chipSize"
        :removable="true"
        @remove="handleRemove(filter.id)"
      />

      <!-- Show More Button -->
      <RButton
        v-if="hiddenCount > 0"
        variant="ghost"
        :size="chipSize"
        class="r-filter-chips__show-more"
        @click="handleShowMore"
      >
        +{{ hiddenCount }} mais
      </RButton>

      <!-- Clear All Button -->
      <RButton
        v-if="showClearAll"
        variant="ghost"
        :size="chipSize"
        class="r-filter-chips__clear"
        @click="handleClearAll"
      >
        {{ clearLabel }}
      </RButton>
    </div>

    <!-- Custom Actions Slot -->
    <div v-if="$slots.actions" class="r-filter-chips__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
/* ============================================================================
   BASE STYLES
   ============================================================================ */

.r-filter-chips {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  padding: var(--spacing-2) 0;
}

/* ============================================================================
   LIST
   ============================================================================ */

.r-filter-chips__list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

/* Alignment */
.r-filter-chips--align-left .r-filter-chips__list {
  justify-content: flex-start;
}

.r-filter-chips--align-center .r-filter-chips__list {
  justify-content: center;
}

.r-filter-chips--align-right .r-filter-chips__list {
  justify-content: flex-end;
}

/* ============================================================================
   LABEL
   ============================================================================ */

.r-filter-chips__label {
  flex-shrink: 0;
  line-height: 1.5;
}

/* ============================================================================
   BUTTONS
   ============================================================================ */

.r-filter-chips__clear {
  color: var(--color-error);
  font-size: var(--font-size-xs);
  padding: var(--spacing-1) var(--spacing-2);
  margin-left: var(--spacing-1);
}

.r-filter-chips__clear:hover {
  background-color: var(--color-error-50);
}

.r-filter-chips__show-more {
  font-size: var(--font-size-xs);
  padding: var(--spacing-1) var(--spacing-2);
  color: var(--color-primary);
}

.r-filter-chips__show-more:hover {
  background-color: var(--color-primary-50);
}

/* ============================================================================
   ACTIONS
   ============================================================================ */

.r-filter-chips__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding-top: var(--spacing-2);
  border-top: 1px solid var(--color-border-light);
}

/* ============================================================================
   RESPONSIVE
   ============================================================================ */

@media (max-width: 640px) {
  .r-filter-chips__list {
    justify-content: flex-start;
  }

  .r-filter-chips__label {
    width: 100%;
    margin-bottom: var(--spacing-1);
  }
}
</style>
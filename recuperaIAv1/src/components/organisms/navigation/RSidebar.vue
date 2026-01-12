<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import RLogo from '@components/atoms/icons/RLogo.vue'
import RIcon from '@components/atoms/icons/RIcon.vue'
import RButton from '@components/atoms/buttons/RButton.vue'

const props = defineProps({
  user: { type: Object, default: null },
  collapsed: { type: Boolean, default: false },
  menuItems: { type: Array, default: () => [] }
})

const emit = defineEmits(['toggle', 'item-click'])
const route = useRoute()

const isActive = (path) => route.path.startsWith(path)
</script>

<template>
  <aside :class="['r-sidebar', { 'r-sidebar--collapsed': collapsed }]">
    <div class="r-sidebar__header">
      <RLogo :icon-only="collapsed" />
      <button class="r-sidebar__toggle" @click="$emit('toggle')">
        <RIcon :name="collapsed ? 'chevron-right' : 'chevron-left'" size="20" />
      </button>
    </div>

    <nav class="r-sidebar__nav">
      <ul class="r-sidebar__list">
        <li v-for="item in menuItems" :key="item.to">
          <router-link
            :to="item.to"
            :class="['r-sidebar__link', { 'r-sidebar__link--active': isActive(item.to) }]"
            @click="$emit('item-click', item)"
          >
            <RIcon :name="item.icon" size="20" />
            <span v-if="!collapsed" class="r-sidebar__label">{{ item.label }}</span>
            <div v-if="isActive(item.to)" class="r-sidebar__indicator" />
          </router-link>
        </li>
      </ul>
    </nav>

    <div v-if="user" class="r-sidebar__footer">
      <slot name="footer" />
    </div>
  </aside>
</template>

<style scoped>
.r-sidebar {
  width: 260px;
  height: 100vh;
  background: var(--color-bg-primary);
  border-right: 1px solid var(--color-border-light);
  display: flex;
  flex-direction: column;
  transition: width var(--transition-normal);
}
.r-sidebar--collapsed { width: 72px; }
.r-sidebar__header {
  padding: var(--spacing-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border-light);
}
.r-sidebar__toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-2);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
}
.r-sidebar__toggle:hover {
  background: var(--color-bg-secondary);
}
.r-sidebar__nav {
  flex: 1;
  padding: var(--spacing-2);
  overflow-y: auto;
}
.r-sidebar__list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.r-sidebar__link {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  position: relative;
}
.r-sidebar__link:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}
.r-sidebar__link--active {
  background: var(--color-primary-50);
  color: var(--color-primary);
}
.r-sidebar__indicator {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: var(--color-primary);
  border-radius: var(--radius-full);
}
.r-sidebar__footer {
  padding: var(--spacing-4);
  border-top: 1px solid var(--color-border-light);
}
</style>
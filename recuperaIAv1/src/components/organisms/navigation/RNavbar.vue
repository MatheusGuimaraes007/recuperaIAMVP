<script setup>
import { ref } from 'vue'
import RButton from '@components/atoms/buttons/RButton.vue'
import RIconButton from '@components/atoms/buttons/RIconButton.vue'
import RBadge from '@components/atoms/feedback/RBadge.vue'

const props = defineProps({
  title: { type: String, default: '' },
  showNotifications: { type: Boolean, default: true },
  notificationsCount: { type: Number, default: 0 },
  showSearch: { type: Boolean, default: true }
})

const emit = defineEmits(['search', 'notifications', 'menu-toggle'])

const showMobileMenu = ref(false)
</script>

<template>
  <header class="r-navbar">
    <div class="r-navbar__left">
      <RIconButton
        icon="menu"
        variant="ghost"
        class="r-navbar__mobile-toggle"
        @click="$emit('menu-toggle')"
      />
      <h1 class="r-navbar__title">{{ title }}</h1>
    </div>

    <div class="r-navbar__center">
      <slot name="center" />
    </div>

    <div class="r-navbar__right">
      <slot name="actions" />
      <RIconButton
        v-if="showNotifications"
        icon="bell"
        variant="ghost"
        @click="$emit('notifications')"
      >
        <RBadge v-if="notificationsCount > 0" :label="String(notificationsCount)" variant="error" />
      </RIconButton>
      <slot name="user" />
    </div>
  </header>
</template>

<style scoped>
.r-navbar {
  height: 64px;
  background: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-4);
  gap: var(--spacing-4);
}
.r-navbar__left,
.r-navbar__right {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}
.r-navbar__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
}
.r-navbar__center {
  flex: 1;
  display: flex;
  justify-content: center;
}
.r-navbar__mobile-toggle {
  display: none;
}
@media (max-width: 768px) {
  .r-navbar__mobile-toggle {
    display: flex;
  }
}
</style>
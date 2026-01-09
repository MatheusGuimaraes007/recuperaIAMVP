<script setup>
import RLogo from '@components/atoms/icons/RLogo.vue'
import RIconButton from '@components/atoms/buttons/RIconButton.vue'
import RSearchBar from '@components/molecules/forms/RSearchBar.vue'
import RUserCard from '@components/molecules/cards/RUserCard.vue'

defineProps({
  user: { type: Object, default: () => ({ name: 'Usuário', role: 'Admin' }) }
})

const emit = defineEmits(['toggle-sidebar', 'logout'])
</script>

<template>
  <nav class="r-navbar">
    <div class="r-navbar__start">
      <RIconButton
        icon="menu"
        variant="ghost"
        class="lg:hidden"
        @click="$emit('toggle-sidebar')"
      />
      <div class="r-navbar__brand lg:hidden">
        <RLogo />
      </div>
    </div>

    <div class="r-navbar__center">
      <RSearchBar
        placeholder="Buscar clientes, oportunidades..."
        class="r-navbar__search"
      />
    </div>

    <div class="r-navbar__end">
      <RIconButton icon="bell" variant="ghost" aria-label="Notificações" />
      <RIconButton icon="help-circle" variant="ghost" aria-label="Ajuda" />

      <div class="r-navbar__divider"></div>

      <div class="r-navbar__profile">
        <RUserCard
          :name="user.name"
          :role="user.role"
          :avatar-url="user.avatarUrl"
          size="sm"
        />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.r-navbar {
  height: 64px;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-4);
  position: sticky;
  top: 0;
  z-index: 40;
}

.r-navbar__start, .r-navbar__end {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.r-navbar__center {
  flex: 1;
  max-width: 480px;
  margin: 0 var(--spacing-4);
  display: none;
}

@media (min-width: 768px) {
  .r-navbar__center { display: block; }
}

.r-navbar__divider {
  width: 1px;
  height: 24px;
  background-color: var(--border-light);
  margin: 0 var(--spacing-2);
}

.r-navbar__profile {
  cursor: pointer;
}
</style>
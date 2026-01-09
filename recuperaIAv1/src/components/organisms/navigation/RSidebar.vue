<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import RLogo from '@components/atoms/icons/RLogo.vue'
import RIcon from '@components/atoms/icons/RIcon.vue'
import RUserCard from '@components/molecules/cards/RUserCard.vue'
import RButton from '@components/atoms/buttons/RButton.vue'

const props = defineProps({
  user: { type: Object, required: true },
  collapsed: { type: Boolean, default: false }
})

const emit = defineEmits(['logout', 'toggle-collapse'])

const route = useRoute()
const router = useRouter()

const menuItems = [
  { label: 'Dashboard', icon: 'layout-dashboard', to: '/dashboard' },
  { label: 'Oportunidades', icon: 'briefcase', to: '/oportunidades' }, //
  { label: 'Clientes', icon: 'users', to: '/clientes' }, //
  { label: 'Agentes IA', icon: 'bot', to: '/agentes' }, //
  { label: 'Produtos', icon: 'package', to: '/produtos' },
  { label: 'Configurações', icon: 'settings', to: '/configuracoes' },
]

const isActive = (path) => route.path.startsWith(path)
</script>

<template>
  <aside :class="['r-sidebar', { 'r-sidebar--collapsed': collapsed }]">
    <div class="r-sidebar__header">
      <RLogo :icon-only="collapsed" />
      <button class="r-sidebar__toggle" @click="$emit('toggle-collapse')">
        <RIcon :name="collapsed ? 'chevron-right' : 'chevron-left'" size="20" />
      </button>
    </div>

    <nav class="r-sidebar__nav">
      <ul class="r-sidebar__list">
        <li v-for="item in menuItems" :key="item.to">
          <router-link
            :to="item.to"
            class="r-sidebar__link"
            :class="{ 'r-sidebar__link--active': isActive(item.to) }"
          >
            <RIcon :name="item.icon" size="20" />
            <span v-if="!collapsed" class="r-sidebar__label">{{ item.label }}</span>
            <div v-if="isActive(item.to)" class="r-sidebar__active-indicator"></div>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="r-sidebar__footer">
      <RUserCard
        v-if="!collapsed"
        :name="user.name"
        :role="user.role === 'admin' ? 'Administrador' : 'Usuário'"
        :avatar-url="user.avatar_url"
        size="sm"
      />
      <div v-else class="r-sidebar__avatar-only">
        </div>

      <RButton
        variant="ghost"
        icon-left="log-out"
        class="r-sidebar__logout"
        :class="{ 'px-0 justify-center': collapsed }"
        @click="$emit('logout')"
      >
        <span v-if="!collapsed">Sair</span>
      </RButton>
    </div>
  </aside>
</template>

<style scoped>
.r-sidebar {
  width: 280px;
  height: 100vh;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  padding: var(--spacing-4);
}

.r-sidebar--collapsed {
  width: 80px;
}

.r-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-8);
  height: 48px;
}

.r-sidebar__toggle {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
}

.r-sidebar__nav { flex: 1; }
.r-sidebar__list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--spacing-2); }

.r-sidebar__link {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
}

.r-sidebar__link:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.r-sidebar__link--active {
  background-color: var(--color-primary-50); /* Ajustar opacidade conforme token */
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.r-sidebar__active-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background-color: var(--color-primary);
  border-radius: 0 4px 4px 0;
}

.r-sidebar__footer {
  border-top: 1px solid var(--border-light);
  padding-top: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.r-sidebar__logout {
  color: var(--color-error);
  width: 100%;
  justify-content: flex-start;
}

.r-sidebar__logout:hover {
  background-color: var(--color-error-50);
}
</style>
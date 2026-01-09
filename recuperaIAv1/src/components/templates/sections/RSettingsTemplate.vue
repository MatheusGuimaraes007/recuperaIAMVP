<script setup>
import RPageHeader from '@/components/organisms/headers/RPageHeader.vue'
import RCard from '@/components/atoms/layout/RCard.vue'

defineProps({
  title: { type: String, default: 'Configurações' },
  menuItems: { type: Array, required: true } // [{ label: 'Perfil', to: '/settings/profile', icon: 'user' }]
})
</script>

<template>
  <div class="space-y-6">
    <RPageHeader :title="title" />

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="md:col-span-1">
        <RCard padding="sm">
          <nav class="flex flex-col space-y-1">
            <router-link
                v-for="item in menuItems"
                :key="item.to"
                :to="item.to"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="bg-primary-50 text-primary"
                class="text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
            >
              <span>{{ item.label }}</span>
            </router-link>
          </nav>
        </RCard>
      </div>

      <div class="md:col-span-3">
        <RCard>
          <slot />
        </RCard>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core' // Assumindo uso de VueUse ou implementação manual
import RAvatar from '@/components/atoms/feedback/RAvatar.vue'
import RText from '@/components/atoms/typography/RText.vue'
import RIcon from '@/components/atoms/icons/RIcon.vue'

defineProps({
  user: { type: Object, required: true } // { name, email, avatar_url, role }
})

const emit = defineEmits(['logout', 'profile', 'settings'])

const isOpen = ref(false)
const target = ref(null)

onClickOutside(target, () => isOpen.value = false)

const toggle = () => isOpen.value = !isOpen.value
</script>

<template>
  <div ref="target" class="relative">
    <button
        class="flex items-center gap-3 p-1 rounded-lg hover:bg-bg-tertiary transition-colors"
        @click="toggle"
    >
      <div class="text-right hidden md:block">
        <RText size="sm" weight="medium">{{ user.name }}</RText>
        <RText size="xs" color="secondary">{{ user.role }}</RText>
      </div>
      <RAvatar :name="user.name" :src="user.avatar_url" size="sm" />
      <RIcon name="chevron-down" size="16" class="text-text-tertiary" />
    </button>

    <Transition name="fade">
      <div
          v-if="isOpen"
          class="absolute right-0 top-full mt-2 w-56 bg-bg-primary border border-border-light rounded-lg shadow-xl z-50 overflow-hidden"
      >
        <div class="p-4 border-b border-border-light md:hidden">
          <RText weight="medium">{{ user.name }}</RText>
          <RText size="xs" color="secondary">{{ user.email }}</RText>
        </div>

        <ul class="py-1">
          <li>
            <button class="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary" @click="$emit('profile')">
              <RIcon name="user" size="16" /> Meu Perfil
            </button>
          </li>
          <li>
            <button class="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary" @click="$emit('settings')">
              <RIcon name="settings" size="16" /> Configurações
            </button>
          </li>
        </ul>

        <div class="border-t border-border-light py-1">
          <button
              class="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error-50"
              @click="$emit('logout')"
          >
            <RIcon name="log-out" size="16" /> Sair
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-5px); }
</style>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown, LogOut, User, Settings } from 'lucide-vue-next'
import {Tooltip} from "../../atoms/Tooltip/index.js";
import UserAvatar from "../../atoms/Avatar/UserAvatar.vue";

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['logout'])

const router = useRouter()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleLogout = () => {
  closeMenu()
  emit('logout')
}

const goToProfile = () => {
  closeMenu()
  router.push('/perfil')
}

const goToSettings = () => {
  closeMenu()
  router.push('/configuracoes')
}
</script>

<template>
  <div class="relative">
    <!-- User Button -->
    <button
        @click="toggleMenu"
        class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
    >
      <div class="text-right hidden sm:block">
        <p class="text-sm font-medium text-white leading-tight">
          {{ user.name }}
        </p>
        <p class="text-xs text-gray-400">
          {{ user.email }}
        </p>
      </div>

      <Tooltip :content="user.name">
        <UserAvatar
            :name="user.name"
            :url="user.avatar"
            size="md"
        />
      </Tooltip>

      <ChevronDown
          :size="16"
          class="text-gray-400 transition-transform"
          :class="{ 'rotate-180': isMenuOpen }"
      />
    </button>

    <Transition
        enter-active-class="transition-all duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
    >
      <div
          v-if="isMenuOpen"
          v-click-outside="closeMenu"
          class="absolute right-0 top-full mt-2 w-56 bg-background-card border border-border rounded-xl shadow-xl py-2 z-50"
      >
        <div class="px-4 py-3 border-b border-border sm:hidden">
          <p class="text-sm font-medium text-white">{{ user.name }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ user.email }}</p>
        </div>

        <div v-if="isAdmin" class="px-4 py-2">
          <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
            <span>Administrador</span>
          </span>
        </div>

        <button
            @click="goToProfile"
            class="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
        >
          <User :size="18" />
          <span class="text-sm">Meu Perfil</span>
        </button>

        <button
            @click="goToSettings"
            class="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
        >
          <Settings :size="18" />
          <span class="text-sm">Configurações</span>
        </button>

        <div class="h-px bg-border my-2" />

        <button
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
        >
          <LogOut :size="18" />
          <span class="text-sm font-medium">Sair</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  directives: {
    clickOutside: {
      mounted(el, binding) {
        el.clickOutsideEvent = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value()
          }
        }
        document.addEventListener('click', el.clickOutsideEvent)
      },
      unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  }
}
</script>

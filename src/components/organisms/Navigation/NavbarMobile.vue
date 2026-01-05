<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Menu, X } from 'lucide-vue-next'
import * as Icons from 'lucide-vue-next'

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

const router = useRouter()
const route = useRoute()
const isOpen = ref(false)

const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const navigate = (path) => {
  router.push(path)
  isOpen.value = false
}

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const getIcon = (iconName) => {
  return Icons[iconName] || Icons.Circle
}
</script>

<template>
  <div class="md:hidden">
    <button
        @click="toggleMenu"
        class="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
    >
      <component :is="isOpen ? X : Menu" :size="24" />
    </button>

    <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div
          v-if="isOpen"
          class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          @click="isOpen = false"
      />
    </Transition>

    <Transition
        enter-active-class="transition-transform duration-200"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-150"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
    >
      <div
          v-if="isOpen"
          class="fixed inset-y-0 left-0 w-64 bg-background-card border-r border-border z-50 p-4 overflow-y-auto"
      >
        <nav class="space-y-1">
          <button
              v-for="item in items"
              :key="item.path"
              @click="navigate(item.path)"
              :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all',
              'hover:bg-white/5',
              isActive(item.path)
                ? 'bg-primary/10 text-primary'
                : 'text-gray-400 hover:text-white'
            ]"
          >
            <component :is="getIcon(item.icon)" :size="20" />
            <span>{{ item.name }}</span>
          </button>
        </nav>
      </div>
    </Transition>
  </div>
</template>

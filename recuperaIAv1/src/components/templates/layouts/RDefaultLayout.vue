<script setup>
import { ref } from 'vue'
import RSidebar from '@/components/organisms/navigation/RSidebar.vue'
import RNavbar from '@/components/organisms/navigation/RNavbar.vue'

// Estado da Sidebar (Colapsada ou não)
const isSidebarCollapsed = ref(false)
const isMobileSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

// Mock user - na aplicação real viria de uma store (useAuth)
const user = {
  name: 'Admin User',
  role: 'admin',
  avatar_url: null
}
</script>

<template>
  <div class="flex h-screen bg-bg-base overflow-hidden">
    <div class="hidden lg:block shrink-0 transition-all duration-300" :style="{ width: isSidebarCollapsed ? '80px' : '280px' }">
      <RSidebar
        :user="user"
        :collapsed="isSidebarCollapsed"
        @toggle-collapse="toggleSidebar"
      />
    </div>

    <div v-if="isMobileSidebarOpen" class="fixed inset-0 z-50 lg:hidden">
      <div class="absolute inset-0 bg-black/50" @click="toggleMobileSidebar"></div>
      <div class="absolute inset-y-0 left-0 w-64 bg-bg-secondary shadow-xl transform transition-transform duration-300">
        <RSidebar :user="user" :collapsed="false" />
      </div>
    </div>

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <RNavbar
        :user="user"
        @toggle-sidebar="toggleMobileSidebar"
      />

      <main class="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
        <div class="max-w-[1600px] mx-auto w-full">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
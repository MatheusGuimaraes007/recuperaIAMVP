<script setup>

import { useRouter } from 'vue-router'
import NavbarLogo from './NavbarLogo.vue'
import NavbarDesktop from './NavbarDesktop.vue'
import NavbarMobile from './NavbarMobile.vue'
import NavbarUserMenu from './NavbarUserMenu.vue'
import {useAuth} from "../../../composables/useAuth.js";
import {useNavItems} from "../../../composables/utils/useNavItems.js";
import {useToast} from "../../../composables/utils/useToast.js";

const { user, isAdmin, logout } = useAuth()
const { navItems } = useNavItems()
const router = useRouter()
const { success } = useToast()

const handleLogout = async () => {
  const result = await logout()
  if (result.success) {
    success('Logout realizado com sucesso!')
    router.push('/login')
  }
}
</script>

<template>
  <header class="sticky top-0 z-40 w-full border-b border-border bg-background-card/95 backdrop-blur supports-[backdrop-filter]:bg-background-card/75">
    <div class="container mx-auto px-4">
      <div class="flex h-16 items-center justify-between">
        <NavbarLogo :is-admin="isAdmin" />

        <NavbarDesktop :items="navItems" />

        <NavbarUserMenu
            :user="user"
            :is-admin="isAdmin"
            @logout="handleLogout"
        />

        <NavbarMobile :items="navItems" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import RIconButton from '@/components/atoms/buttons/RIconButton.vue'
import RText from '@/components/atoms/typography/RText.vue'
import RButton from '@/components/atoms/buttons/RButton.vue'
import RNotificationList from '@/components/organisms/lists/RNotificationList.vue' // Vamos criar abaixo

const props = defineProps({
  notifications: { type: Array, default: () => [] },
  unreadCount: { type: Number, default: 0 }
})

const emit = defineEmits(['mark-all-read', 'view-all', 'click-item'])

const isOpen = ref(false)
const target = ref(null)

onClickOutside(target, () => isOpen.value = false)
</script>

<template>
  <div ref="target" class="relative">
    <div class="relative">
      <RIconButton
          icon="bell"
          variant="ghost"
          @click="isOpen = !isOpen"
          aria-label=""/>
      <span
          v-if="unreadCount > 0"
          class="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-bg-primary"
      ></span>
    </div>

    <Transition name="fade">
      <div
          v-if="isOpen"
          class="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-bg-primary border border-border-light rounded-lg shadow-xl z-50 flex flex-col max-h-[80vh]"
      >
        <div class="flex items-center justify-between p-4 border-b border-border-light">
          <RText weight="semibold">Notificações</RText>
          <RButton
              v-if="unreadCount > 0"
              variant="ghost"
              size="sm"
              class="text-xs"
              @click="$emit('mark-all-read')"
          >
            Marcar lidas
          </RButton>
        </div>

        <div class="flex-1 overflow-y-auto">
          <RNotificationList
              :notifications="notifications"
              compact
              @click-item="$emit('click-item', $event)"
          />
        </div>

        <div class="p-3 border-t border-border-light text-center bg-bg-secondary rounded-b-lg">
          <RButton variant="ghost" size="sm" full-width @click="$emit('view-all')">
            Ver todas
          </RButton>
        </div>
      </div>
    </Transition>
  </div>
</template>
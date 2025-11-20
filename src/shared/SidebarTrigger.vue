<script setup>
import { ref } from 'vue';

defineProps({
  icon: {
    type: String,
    default: 'shield'
  },
  label: {
    type: String,
    required: true
  },
  position: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right'].includes(value)
  },
  width: {
    type: String,
    default: '420px'
  }
});

const isOpen = ref(false);

const icons = {
  shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  notification: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  menu: 'M4 6h16M4 12h16M4 18h16',
  chat: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
};
</script>

<template>
  <div
      class="sidebar-trigger-wrapper"
      :class="[position]"
      @mouseenter="isOpen = true"
      @mouseleave="isOpen = false"
  >
    <!-- Botão de Trigger -->
    <div class="trigger-button" :class="{ 'open': isOpen }">
      <div class="trigger-inner">
        <svg class="trigger-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icons[icon]" />
        </svg>
        <span class="trigger-label">{{ label }}</span>
      </div>

      <!-- Indicador de pulso -->
      <div class="pulse-indicator"></div>
    </div>

    <!-- Panel Expansível -->
    <transition name="slide">
      <div v-if="isOpen" class="sidebar-panel" :style="{ width }">
        <slot />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.sidebar-trigger-wrapper {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
}

.sidebar-trigger-wrapper.left {
  left: 0;
  flex-direction: row;
}

.sidebar-trigger-wrapper.right {
  right: 0;
  flex-direction: row-reverse;
}

.trigger-button {
  position: relative;
  width: 52px;
  height: 180px;
  background: linear-gradient(135deg, rgba(124, 186, 16, 0.2) 0%, rgba(124, 186, 16, 0.08) 100%);
  border: 1px solid rgba(124, 186, 16, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(12px);
  overflow: hidden;
}

.left .trigger-button {
  border-left: none;
  border-radius: 0 16px 16px 0;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.4);
}

.right .trigger-button {
  border-right: none;
  border-radius: 16px 0 0 16px;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.4);
}

.trigger-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(124, 186, 16, 0.15) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.trigger-button:hover::before,
.trigger-button.open::before {
  opacity: 1;
}

.trigger-button:hover,
.trigger-button.open {
  width: 60px;
  background: linear-gradient(135deg, rgba(124, 186, 16, 0.3) 0%, rgba(124, 186, 16, 0.12) 100%);
  border-color: rgba(124, 186, 16, 0.6);
}

.trigger-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 1;
}

.trigger-icon {
  width: 28px;
  height: 28px;
  color: var(--color-text1);
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));
  transition: transform 0.3s ease;
}

.trigger-button:hover .trigger-icon,
.trigger-button.open .trigger-icon {
  transform: scale(1.1);
}

.trigger-label {
  font-size: 11px;
  font-weight: 700;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--color-text1);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.pulse-indicator {
  position: absolute;
  top: 12px;
  width: 8px;
  height: 8px;
  background: var(--color-text1);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.left .pulse-indicator {
  right: 12px;
}

.right .pulse-indicator {
  left: 12px;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

.sidebar-panel {
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
  background: linear-gradient(to bottom, var(--color-background3), rgba(15, 15, 20, 0.98));
  border: 1px solid rgba(124, 186, 16, 0.25);
  backdrop-filter: blur(16px);
}

.left .sidebar-panel {
  border-left: none;
  border-radius: 0 20px 20px 0;
  box-shadow: 6px 0 30px rgba(0, 0, 0, 0.6);
}

.right .sidebar-panel {
  border-right: none;
  border-radius: 20px 0 0 20px;
  box-shadow: -6px 0 30px rgba(0, 0, 0, 0.6);
}

.sidebar-panel::-webkit-scrollbar {
  width: 6px;
}

.sidebar-panel::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-panel::-webkit-scrollbar-thumb {
  background: rgba(124, 186, 16, 0.3);
  border-radius: 10px;
  transition: background 0.2s ease;
}

.sidebar-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(124, 186, 16, 0.5);
}

/* Animações */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.left .slide-enter-from,
.left .slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.right .slide-enter-from,
.right .slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Responsividade */
@media (max-width: 768px) {
  .sidebar-panel {
    width: calc(100vw - 70px) !important;
    max-width: 380px;
  }

  .trigger-button {
    width: 44px;
    height: 160px;
  }

  .trigger-button:hover,
  .trigger-button.open {
    width: 48px;
  }

  .trigger-icon {
    width: 24px;
    height: 24px;
  }

  .trigger-label {
    font-size: 10px;
    letter-spacing: 1.5px;
  }
}
</style>
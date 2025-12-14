<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  MessageCircle,
  X,
  Wrench,
  CreditCard,
  Sparkles,
  MessageSquare,
  ExternalLink
} from 'lucide-vue-next';
import {
  SUPPORT_WHATSAPP,
  SUPPORT_MESSAGES,
  isSupportOnline
} from '../utils/supportButton.js';

// --- Props ---
const props = defineProps({
  whatsappNumber: { type: String, default: SUPPORT_WHATSAPP },
  defaultMessage: { type: String, default: SUPPORT_MESSAGES.default },
  position: {
    type: String,
    default: 'bottom-right',
    validator: (v) => ['bottom-right', 'bottom-left', 'top-right', 'top-left'].includes(v)
  },
  showTooltip: { type: Boolean, default: true },
  tooltipText: { type: String, default: 'Falar com Suporte' },
  showOnlineIndicator: { type: Boolean, default: true }
});

// --- State ---
const showMenu = ref(false);
const isOnline = ref(false);
let onlineCheckInterval = null;

// --- Lifecycle ---
onMounted(() => {
  checkOnlineStatus();
  onlineCheckInterval = setInterval(checkOnlineStatus, 60000); // Check every minute
});

onUnmounted(() => {
  if (onlineCheckInterval) clearInterval(onlineCheckInterval);
});

// --- Methods ---
const checkOnlineStatus = () => {
  isOnline.value = isSupportOnline();
};

const handleOpenWhatsApp = (customMessage = null) => {
  const message = customMessage || props.defaultMessage;
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${props.whatsappNumber}?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
  showMenu.value = false;
};

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const handleQuickAction = (actionKey) => {
  const message = SUPPORT_MESSAGES[actionKey] || SUPPORT_MESSAGES.general;
  handleOpenWhatsApp(message);
};

// --- Computed Styles ---
const positionClasses = computed(() => ({
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6'
}[props.position]));

const tooltipPositionClasses = computed(() => ({
  'bottom-right': 'bottom-full right-0 mb-3 origin-bottom-right',
  'bottom-left': 'bottom-full left-0 mb-3 origin-bottom-left',
  'top-right': 'top-full right-0 mt-3 origin-top-right',
  'top-left': 'top-full left-0 mt-3 origin-top-left'
}[props.position]));

// --- Data for Loop ---
const menuOptions = [
  {
    key: 'technical',
    label: 'Problema Técnico',
    sub: 'Erro ou bug na plataforma',
    icon: Wrench,
    colorClass: 'text-red-500 bg-red-500/10 group-hover:bg-red-500/20'
  },
  {
    key: 'billing',
    label: 'Financeiro',
    sub: 'Dúvidas sobre cobrança',
    icon: CreditCard,
    colorClass: 'text-orange-500 bg-orange-500/10 group-hover:bg-orange-500/20'
  },
  {
    key: 'features',
    label: 'Funcionalidades',
    sub: 'Como usar a ferramenta',
    icon: Sparkles,
    colorClass: 'text-blue-500 bg-blue-500/10 group-hover:bg-blue-500/20'
  },
  {
    key: 'general',
    label: 'Outro Assunto',
    sub: 'Falar com atendente',
    icon: MessageSquare,
    colorClass: 'text-purple-500 bg-purple-500/10 group-hover:bg-purple-500/20'
  },
];
</script>

<template>
  <div class="fixed z-50 flex flex-col items-end" :class="positionClasses">

    <Transition name="scale-fade">
      <div
          v-if="showMenu"
          class="absolute w-72 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95"
          :class="tooltipPositionClasses"
      >
        <div class="p-4 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-bold text-slate-800 dark:text-white">Central de Ajuda</h3>
            <button
                @click="showMenu = false"
                class="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X :size="16" class="text-slate-500 dark:text-slate-400" />
            </button>
          </div>

          <div class="flex items-center gap-2 text-xs">
            <span class="relative flex h-2 w-2">
              <span v-if="isOnline" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2" :class="isOnline ? 'bg-emerald-500' : 'bg-slate-400'"></span>
            </span>
            <span class="font-medium" :class="isOnline ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'">
              {{ isOnline ? 'Suporte Online' : 'Fora do Horário' }}
            </span>
            <span v-if="!isOnline" class="text-slate-400 ml-auto">• 09h às 18h</span>
          </div>
        </div>

        <div class="p-2 space-y-1">
          <button
              v-for="option in menuOptions"
              :key="option.key"
              @click="handleQuickAction(option.key)"
              class="w-full px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group flex items-center gap-3"
          >
            <div
                class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors shrink-0"
                :class="option.colorClass"
            >
              <component :is="option.icon" :size="20" />
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">
                {{ option.label }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ option.sub }}</p>
            </div>
          </button>
        </div>

        <div class="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
          <button
              @click="handleOpenWhatsApp()"
              class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm hover:shadow-md"
          >
            <MessageCircle :size="18" />
            Iniciar conversa no WhatsApp
            <ExternalLink :size="14" class="opacity-70" />
          </button>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div
          v-if="showTooltip && !showMenu"
          class="absolute px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-medium shadow-lg whitespace-nowrap mb-2 mr-2 pointer-events-none"
          :class="{
            'bottom-0 right-16 mr-2': position === 'bottom-right',
            'bottom-0 left-16 ml-2': position === 'bottom-left',
            'top-0 right-16 mr-2': position === 'top-right',
            'top-0 left-16 ml-2': position === 'top-left'
        }"
      >
        {{ tooltipText }}
      </div>
    </Transition>

    <button
        @click="toggleMenu"
        class="relative w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center z-50 overflow-hidden"
        :class="showMenu ? 'bg-slate-700 rotate-90' : 'bg-emerald-600'"
        :aria-label="showMenu ? 'Fechar menu de suporte' : 'Abrir menu de suporte'"
    >
      <div class="relative w-full h-full flex items-center justify-center">
        <Transition name="rotate-icon" mode="out-in">
          <X v-if="showMenu" class="text-white" :size="24" />
          <MessageCircle v-else class="text-white" :size="28" />
        </Transition>
      </div>

      <span
          v-if="showOnlineIndicator && !showMenu && isOnline"
          class="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-emerald-600"
      ></span>
    </button>
  </div>
</template>

<style scoped>
/* Transitions */
.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.scale-fade-enter-from,
.scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Icon Rotation inside button */
.rotate-icon-enter-active,
.rotate-icon-leave-active {
  transition: all 0.2s ease;
}

.rotate-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

.rotate-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}
</style>
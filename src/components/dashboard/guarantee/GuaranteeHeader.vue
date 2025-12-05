<script setup>
import { computed } from 'vue';
import { Shield, Info, CheckCircle } from 'lucide-vue-next';

const props = defineProps({
  guarantee: { type: Object, required: true },
  guaranteeStatusConfig: { type: Object, required: true },
  statusMessage: { type: String, required: true },
  isCritical: { type: Boolean, default: false },
  isInAlert: { type: Boolean, default: false },
  isGracePeriod: { type: Boolean, default: false }
});

const headerClasses = computed(() => {
  if (props.isGracePeriod && props.guarantee.status === 'achieved') {
    return 'bg-gradient-to-br from-status-success/20 to-status-success/5 border-status-success/20';
  }
  if (props.isCritical) return 'bg-gradient-to-br from-status-error/20 to-status-error/5 border-status-error/20';
  if (props.isInAlert) return 'bg-gradient-to-br from-status-warning/20 to-status-warning/5 border-status-warning/20';
  return 'bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20';
});

const statusBadgeStyle = computed(() => ({
  backgroundColor: props.guaranteeStatusConfig.bgColor,
  color: props.guaranteeStatusConfig.color,
  boxShadow: `0 4px 12px ${props.guaranteeStatusConfig.bgColor}`
}));

const messageClasses = computed(() => {
  if (props.isGracePeriod && props.guarantee.status === 'achieved') {
    return 'bg-status-success/10 border-l-status-success text-status-success';
  }
  if (props.isCritical) return 'bg-status-error/10 border-l-status-error text-status-error animate-pulse';
  if (props.isInAlert) return 'bg-status-warning/10 border-l-status-warning text-status-warning';
  return 'bg-primary/10 border-l-primary text-primary';
});

const statusIcon = computed(() => {
  if (props.isGracePeriod && props.guarantee.status === 'achieved') {
    return CheckCircle;
  }
  return Info;
});
</script>

<template>
  <div class="p-6 border-b" :class="headerClasses">
    <div class="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5">
      <div class="flex gap-3 flex-1 min-w-0">
        <div class="w-14 h-14 bg-primary/15 rounded-xl flex items-center justify-center flex-shrink-0">
          <Shield :size="28" class="text-primary" />
        </div>
        <div>
          <h3 class="text-2xl font-bold text-white leading-tight mb-1">
            {{ guarantee.model_name }}
          </h3>
          <p class="text-sm font-medium text-gray-400">Garantia de Resultados</p>
        </div>
      </div>

      <div
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold backdrop-blur-sm self-start sm:self-auto"
          :style="statusBadgeStyle"
      >
        <span class="text-lg leading-none">{{ guaranteeStatusConfig.icon }}</span>
        <span>{{ guaranteeStatusConfig.label }}</span>
      </div>
    </div>

    <div class="flex items-start gap-3 p-4 border-l-4 rounded-xl transition-all" :class="messageClasses">
      <component :is="statusIcon" :size="20" class="mt-0.5 flex-shrink-0" />
      <p class="text-sm font-medium leading-relaxed">{{ statusMessage }}</p>
    </div>
  </div>
</template>
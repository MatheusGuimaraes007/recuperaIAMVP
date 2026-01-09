<script setup>
import RCard from '@/components/atoms/layout/RCard.vue'
import RAvatar from '@/components/atoms/feedback/RAvatar.vue'
import RText from '@/components/atoms/typography/RText.vue'
import { formatDate } from '@/utils/formatters'

defineProps({
  activities: { type: Array, default: () => [] } // { id, user, action, target, date }
})
</script>

<template>
  <RCard title="Atividades Recentes" class="r-activity-feed">
    <ul class="space-y-4">
      <li v-for="activity in activities" :key="activity.id" class="flex gap-3">
        <div class="relative">
          <RAvatar :name="activity.user.name" :src="activity.user.avatar" size="sm" />
          <div class="absolute top-8 left-1/2 w-px h-full bg-border-light -z-10" v-if="activity !== activities[activities.length - 1]"></div>
        </div>
        <div class="flex-1 pb-4 border-b border-border-light last:border-0 last:pb-0">
          <div class="flex justify-between items-start">
            <RText size="sm">
              <span class="font-medium text-text-primary">{{ activity.user.name }}</span>
              <span class="text-text-secondary"> {{ activity.action }} </span>
              <span class="font-medium text-text-primary">{{ activity.target }}</span>
            </RText>
            <span class="text-xs text-text-tertiary whitespace-nowrap ml-2">
              {{ formatDate(activity.date, 'HH:mm') }}
            </span>
          </div>
          <RText v-if="activity.description" size="xs" color="tertiary" class="mt-1">
            {{ activity.description }}
          </RText>
        </div>
      </li>
    </ul>
  </RCard>
</template>
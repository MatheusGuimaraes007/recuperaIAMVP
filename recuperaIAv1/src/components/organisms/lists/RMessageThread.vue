<script setup>
import { ref, nextTick, watch } from 'vue'
import RAvatar from '@/components/atoms/feedback/RAvatar.vue'
import RText from '@/components/atoms/typography/RText.vue'
import RInput from '@/components/atoms/inputs/RInput.vue'
import RIconButton from '@/components/atoms/buttons/RIconButton.vue'

const props = defineProps({
  messages: { type: Array, default: () => [] }, // { id, content, sender: 'user'|'agent'|'contact', timestamp }
  contactName: String
})

const emit = defineEmits(['send'])
const newMessage = ref('')
const messagesContainer = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

watch(() => props.messages, scrollToBottom, { deep: true })

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  emit('send', newMessage.value)
  newMessage.value = ''
}
</script>

<template>
  <div class="flex flex-col h-[500px] border border-border-light rounded-lg bg-bg-primary">
    <div class="p-4 border-b border-border-light flex justify-between items-center">
      <RText weight="medium">Chat com {{ contactName }}</RText>
    </div>

    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
      <div
          v-for="msg in messages"
          :key="msg.id"
          class="flex gap-3"
          :class="{ 'flex-row-reverse': msg.sender !== 'contact' }"
      >
        <RAvatar
            size="xs"
            :name="msg.sender === 'contact' ? contactName : 'Agent'"
            :class="msg.sender === 'contact' ? 'bg-gray-500' : 'bg-primary'"
        />

        <div
            class="max-w-[70%] p-3 rounded-lg text-sm"
            :class="msg.sender === 'contact' ? 'bg-bg-tertiary text-text-primary' : 'bg-primary-100 text-primary-900'"
        >
          {{ msg.content }}
          <div class="text-[10px] opacity-70 mt-1 text-right">
            {{ msg.timestamp }}
          </div>
        </div>
      </div>
    </div>

    <div class="p-3 border-t border-border-light flex gap-2">
      <RInput
          v-model="newMessage"
          placeholder="Digite uma mensagem..."
          class="flex-1"
          @keydown.enter="sendMessage"
      />
      <RIconButton icon="send" variant="primary" @click="sendMessage"  aria-label=""/>
    </div>
  </div>
</template>
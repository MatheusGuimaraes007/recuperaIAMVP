<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useAgents as useAgentsComposable } from '@/composables/data/useAgents'

// Templates & Organisms
import RFormTemplate from '@/components/templates/sections/RFormTemplate.vue'
import RAgentForm from '@/components/organisms/forms/RAgentForm.vue'

// Molecules
import RAlertBanner from '@/components/molecules/feedback/RAlertBanner.vue'
import RLoadingState from '@/components/molecules/feedback/RLoadingState.vue'

// Atoms
import RButton from '@/components/atoms/buttons/RButton.vue'

const route = useRoute()
const router = useRouter()

const agentId = computed(() => route.params.id)

// Composable
const { useAgent, useUpdateAgent } = useAgentsComposable()

// Queries
const { data: agent, isLoading } = useAgent(agentId)
const updateMutation = useUpdateAgent()

// Estado local
const formError = ref(null)
const initialValues = ref(null)

// Watch agent data para popular form
watch(agent, (newAgent) => {
  if (newAgent) {
    initialValues.value = {
      name: newAgent.name,
      function: newAgent.function || '',
      ai_model: newAgent.ai_model,
      tone_of_voice: newAgent.tone_of_voice,
      prompt: newAgent.prompt,
      // WhatsApp (se existir)
      official_whatsapp: newAgent.official_whatsapp || {
        phone_number: '',
        phone_number_id: '',
        display_name: '',
        waba_id: '',
        api_token: ''
      }
    }
  }
}, { immediate: true })

// Breadcrumb
const breadcrumb = computed(() => [
  { label: 'Admin', to: '/admin/dashboard' },
  { label: 'Agentes', to: '/admin/agents' },
  { label: agent.value?.name || 'Editar', to: `/admin/agents/${agentId.value}/editar` }
])

// Handlers
const handleSubmit = async (values) => {
  formError.value = null

  try {
    await updateMutation.mutateAsync({
      agentId: agentId.value,
      updates: values
    })

    toast.success('Agente atualizado com sucesso!')
    router.push(`/admin/agents/${agentId.value}`)
  } catch (error) {
    formError.value = error.message || 'Erro ao atualizar agente'
    toast.error(formError.value)
  }
}

const handleCancel = () => {
  router.push(`/admin/agents/${agentId.value}`)
}
</script>

<template>
  <RFormTemplate
    :title="`Editar: ${agent?.name || 'Agente'}`"
    subtitle="Atualize as configurações do agente"
    :breadcrumb="breadcrumb"
    :loading="isLoading"
  >
    <!-- Header Actions -->
    <template #header-actions>
      <RButton variant="ghost" icon-left="x" @click="handleCancel">
        Cancelar
      </RButton>
    </template>

    <!-- Loading State -->
    <RLoadingState v-if="isLoading" message="Carregando dados do agente..." />

    <!-- Form -->
    <template v-else-if="initialValues">
      <!-- Error Banner -->
      <RAlertBanner
        v-if="formError"
        type="error"
        :message="formError"
        class="mb-6"
        dismissible
        @dismiss="formError = null"
      />

      <RAgentForm
        :initial-values="initialValues"
        :loading="updateMutation.isPending.value"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </template>
  </RFormTemplate>
</template>
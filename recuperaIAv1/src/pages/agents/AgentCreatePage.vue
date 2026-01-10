<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useAgents as useAgentsComposable } from '@/composables/data/useAgents'

// Templates & Organisms
import RFormTemplate from '@/components/templates/sections/RFormTemplate.vue'
import RAgentForm from '@/components/organisms/forms/RAgentForm.vue'

// Molecules
import RAlertBanner from '@/components/molecules/feedback/RAlertBanner.vue'

// Atoms
import RButton from '@/components/atoms/buttons/RButton.vue'

const router = useRouter()

// Composable
const { useCreateAgent } = useAgentsComposable()

// Mutation
const createMutation = useCreateAgent()

// Estado local
const formError = ref(null)

// Breadcrumb
const breadcrumb = [
  { label: 'Admin', to: '/admin/dashboard' },
  { label: 'Agentes', to: '/admin/agents' },
  { label: 'Novo Agente', to: '/admin/agents/novo' }
]

// Valores iniciais do form
const initialValues = {
  name: '',
  function: '',
  ai_model: 'gpt-4',
  tone_of_voice: 'professional',
  prompt: '',
  // WhatsApp (opcional na criação)
  official_whatsapp: {
    phone_number: '',
    phone_number_id: '',
    display_name: '',
    waba_id: '',
    api_token: ''
  }
}

// Handlers
const handleSubmit = async (values) => {
  formError.value = null

  try {
    await createMutation.mutateAsync(values)

    toast.success('Agente criado com sucesso!')
    router.push('/admin/agents')
  } catch (error) {
    formError.value = error.message || 'Erro ao criar agente'
    toast.error(formError.value)
  }
}

const handleCancel = () => {
  router.push('/admin/agents')
}
</script>

<template>
  <RFormTemplate
    title="Novo Agente IA"
    subtitle="Configure seu assistente virtual"
    :breadcrumb="breadcrumb"
  >
    <!-- Header Actions -->
    <template #header-actions>
      <RButton variant="ghost" icon-left="x" @click="handleCancel">
        Cancelar
      </RButton>
    </template>

    <!-- Error Banner -->
    <RAlertBanner
      v-if="formError"
      type="error"
      :message="formError"
      class="mb-6"
      dismissible
      @dismiss="formError = null"
    />

    <!-- Form -->
    <RAgentForm
      :initial-values="initialValues"
      :loading="createMutation.isPending.value"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </RFormTemplate>
</template>
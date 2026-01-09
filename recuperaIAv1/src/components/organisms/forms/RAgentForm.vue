<script setup>
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import RFormField from '@/components/molecules/forms/RFormField.vue'
import RSelect from '@/components/atoms/inputs/RSelect.vue'
import RSwitch from '@/components/atoms/inputs/RSwitch.vue'
import RButton from '@/components/atoms/buttons/RButton.vue'
import RTextarea from '@/components/atoms/inputs/RTextarea.vue'

const props = defineProps({
  initialValues: {
    type: Object,
    default: () => ({
      name: '',
      role: 'sales',
      model: 'gpt-4',
      active: true,
      instructions: ''
    })
  },
  loading: Boolean
})

const emit = defineEmits(['submit', 'cancel'])

const schema = yup.object({
  name: yup.string().required('Nome do agente é obrigatório'),
  role: yup.string().required('Função é obrigatória'),
  model: yup.string().required('Modelo de IA é obrigatório'),
  instructions: yup.string().max(2000, 'Máximo 2000 caracteres')
})

const { handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: props.initialValues
})

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})

const roleOptions = [
  { label: 'Vendas & Negociação', value: 'sales' },
  { label: 'Suporte ao Cliente', value: 'support' },
  { label: 'Cobrança & Recuperação', value: 'recovery' },
  { label: 'Triagem (SDR)', value: 'sdr' }
]

const modelOptions = [
  { label: 'GPT-4 Turbo (Recomendado)', value: 'gpt-4-turbo' },
  { label: 'GPT-3.5 Turbo (Rápido)', value: 'gpt-3.5-turbo' },
  { label: 'Claude 3 Opus (Complexo)', value: 'claude-3-opus' }
]
</script>

<template>
  <form @submit="onSubmit" class="space-y-5">
    <RFormField
      name="name"
      label="Nome do Agente"
      placeholder="Ex: Ana - Recuperação"
      icon-left="bot"
      help-text="Nome visível internamente e nos relatórios."
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <RFormField name="role" v-slot="{ field, errorMessage }">
        <RSelect
          v-bind="field"
          label="Função Principal"
          :options="roleOptions"
          :error="errorMessage"
        />
      </RFormField>

      <RFormField name="model" v-slot="{ field, errorMessage }">
        <RSelect
          v-bind="field"
          label="Modelo de IA"
          :options="modelOptions"
          :error="errorMessage"
        />
      </RFormField>
    </div>

    <RFormField name="instructions" v-slot="{ field, errorMessage }">
      <RTextarea
        v-bind="field"
        label="Prompt do Sistema (Instruções)"
        placeholder="Você é um assistente especialista em recuperação de vendas. Seu tom deve ser empático..."
        rows="6"
        :error="errorMessage"
        help-text="Defina a personalidade e as regras de negócio do agente."
      />
    </RFormField>

    <div class="bg-bg-secondary p-4 rounded-lg border border-border-light">
      <RFormField name="active" v-slot="{ field }">
        <RSwitch
          :model-value="field.value"
          @update:model-value="field.handleChange"
          label="Agente Ativo"
          description="Se desativado, o agente não responderá a novas mensagens."
        />
      </RFormField>
    </div>

    <div class="flex justify-end gap-3 pt-4">
      <RButton variant="ghost" type="button" @click="$emit('cancel')">Cancelar</RButton>
      <RButton variant="primary" type="submit" :loading="loading" icon-left="check">Salvar Agente</RButton>
    </div>
  </form>
</template>
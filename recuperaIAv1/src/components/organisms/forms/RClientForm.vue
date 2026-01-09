<script setup>
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import RFormField from '@/components/molecules/forms/RFormField.vue'
import RPhoneInput from '@/components/molecules/forms/RPhoneInput.vue'
import RSelect from '@/components/atoms/inputs/RSelect.vue'
import RButton from '@/components/atoms/buttons/RButton.vue'
import RHeading from '@/components/atoms/typography/RHeading.vue'

const props = defineProps({
  initialValues: {
    type: Object,
    default: () => ({
      name: '',
      email: '',
      phone: '',
      status: 'active',
      plan: 'basic'
    })
  },
  loading: Boolean,
  isEdit: Boolean
})

const emit = defineEmits(['submit', 'cancel'])

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório').min(3, 'Mínimo 3 caracteres'),
  email: yup.string().required('E-mail é obrigatório').email('E-mail inválido'),
  phone: yup.string().required('Telefone é obrigatório'),
  status: yup.string().required('Status é obrigatório'),
  plan: yup.string().required('Plano é obrigatório')
})

const { handleSubmit, setValues } = useForm({
  validationSchema: schema,
  initialValues: props.initialValues
})

// Atualiza o formulário se os dados iniciais mudarem (ex: fetch na edição)
watch(() => props.initialValues, (newVal) => {
  setValues(newVal)
}, { deep: true })

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})

const statusOptions = [
  { label: 'Ativo', value: 'active' },
  { label: 'Trial', value: 'trial' },
  { label: 'Suspenso', value: 'suspended' },
  { label: 'Cancelado', value: 'canceled' }
]

const planOptions = [
  { label: 'Básico', value: 'basic' },
  { label: 'Profissional', value: 'pro' },
  { label: 'Enterprise', value: 'enterprise' }
]
</script>

<template>
  <form @submit="onSubmit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="col-span-1 md:col-span-2">
        <RHeading level="5" class="mb-4 text-gray-400 uppercase text-xs font-bold tracking-wider">Dados Principais</RHeading>
      </div>

      <RFormField
        name="name"
        label="Nome Completo / Empresa"
        placeholder="Ex: Tech Solutions Ltda"
        icon-left="user"
      />

      <RFormField
        name="email"
        label="E-mail Corporativo"
        type="email"
        placeholder="contato@empresa.com"
        icon-left="mail"
      />

      <RFormField name="phone" v-slot="{ field, errorMessage }">
        <RPhoneInput
          v-bind="field"
          label="Telefone / WhatsApp"
          :error="errorMessage"
        />
      </RFormField>

      <div class="col-span-1 md:col-span-2 mt-2">
        <RHeading level="5" class="mb-4 text-gray-400 uppercase text-xs font-bold tracking-wider">Configurações da Conta</RHeading>
      </div>

      <RFormField name="status" v-slot="{ field, errorMessage }">
        <RSelect
          v-bind="field"
          label="Status da Conta"
          :options="statusOptions"
          :error="errorMessage"
        />
      </RFormField>

      <RFormField name="plan" v-slot="{ field, errorMessage }">
        <RSelect
          v-bind="field"
          label="Plano Contratado"
          :options="planOptions"
          :error="errorMessage"
        />
      </RFormField>
    </div>

    <div class="flex justify-end gap-3 pt-6 border-t border-border-light">
      <RButton
        type="button"
        variant="ghost"
        :disabled="loading"
        @click="$emit('cancel')"
      >
        Cancelar
      </RButton>
      <RButton
        type="submit"
        variant="primary"
        :loading="loading"
        icon-left="save"
      >
        {{ isEdit ? 'Salvar Alterações' : 'Cadastrar Cliente' }}
      </RButton>
    </div>
  </form>
</template>
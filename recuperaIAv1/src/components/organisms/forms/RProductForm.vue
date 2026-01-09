<script setup>
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import RFormField from '@/components/molecules/forms/RFormField.vue'
import RCurrencyInput from '@/components/molecules/forms/RCurrencyInput.vue'
import RTextarea from '@/components/atoms/inputs/RTextarea.vue'
import RSwitch from '@/components/atoms/inputs/RSwitch.vue'
import RButton from '@/components/atoms/buttons/RButton.vue'

const props = defineProps({
  initialValues: {
    type: Object,
    default: () => ({ name: '', price: 0, description: '', active: true, sku: '' })
  },
  loading: Boolean
})

const emit = defineEmits(['submit', 'cancel'])

const schema = yup.object({
  name: yup.string().required('Nome do produto é obrigatório'),
  price: yup.number().required('Preço é obrigatório').min(0, 'Valor inválido'),
  sku: yup.string().optional(),
  description: yup.string().max(500, 'Máximo 500 caracteres')
})

const { handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: props.initialValues
})

const onSubmit = handleSubmit((values) => emit('submit', values))
</script>

<template>
  <form @submit="onSubmit" class="space-y-5">
    <RFormField
        name="name"
        label="Nome do Produto"
        placeholder="Ex: Consultoria Premium"
        icon-left="package"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <RFormField name="price" v-slot="{ field, errorMessage }">
        <RCurrencyInput
            v-bind="field"
            label="Preço de Venda"
            :error="errorMessage"
        />
      </RFormField>

      <RFormField
          name="sku"
          label="SKU / Código (Opcional)"
          placeholder="PROD-001"
          icon-left="barcode"
      />
    </div>

    <RFormField name="description" v-slot="{ field, errorMessage }">
      <RTextarea
          v-bind="field"
          label="Descrição"
          placeholder="Detalhes do produto..."
          rows="3"
          :error="errorMessage"
      />
    </RFormField>

    <RFormField name="active" v-slot="{ field }">
      <RSwitch
          :model-value="field.value"
          @update:model-value="field.handleChange"
          label="Produto Ativo"
      />
    </RFormField>

    <div class="flex justify-end gap-3 pt-4 border-t border-border-light">
      <RButton variant="ghost" type="button" @click="$emit('cancel')">Cancelar</RButton>
      <RButton variant="primary" type="submit" :loading="loading">Salvar Produto</RButton>
    </div>
  </form>
</template>
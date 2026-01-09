<script setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import RFormField from '@/components/molecules/forms/RFormField.vue'
import RTextarea from '@/components/atoms/inputs/RTextarea.vue'
import RButton from '@/components/atoms/buttons/RButton.vue'
import RFileUpload from '@/components/atoms/inputs/RFileUpload.vue'
import RIcon from '@/components/atoms/icons/RIcon.vue'

const props = defineProps({
  initialValues: { type: Object, default: () => ({ title: '', content: '', type: 'text' }) },
  loading: Boolean
})

const emit = defineEmits(['submit', 'cancel'])

const schema = yup.object({
  title: yup.string().required('Título é obrigatório'),
  content: yup.string().when('type', {
    is: 'text',
    then: () => yup.string().required('Conteúdo é obrigatório'),
    otherwise: () => yup.string().nullable()
  })
})

const { handleSubmit } = useForm({ validationSchema: schema, initialValues: props.initialValues })
const activeTab = ref('text') // text | file

const onSubmit = handleSubmit((values) => {
  emit('submit', { ...values, type: activeTab.value })
})
</script>

<template>
  <form @submit="onSubmit" class="space-y-6">
    <RFormField name="title" label="Título do Documento" placeholder="Ex: Política de Reembolso" />

    <div class="flex border-b border-border-light mb-4">
      <button
          type="button"
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === 'text' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'"
          @click="activeTab = 'text'"
      >
        Editor de Texto
      </button>
      <button
          type="button"
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === 'file' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'"
          @click="activeTab = 'file'"
      >
        Upload de Arquivo
      </button>
    </div>

    <div v-if="activeTab === 'text'">
      <RFormField name="content" v-slot="{ field, errorMessage }">
        <RTextarea
            v-bind="field"
            label="Conteúdo"
            rows="10"
            placeholder="Digite o conteúdo que a IA deve aprender..."
            :error="errorMessage"
        />
      </RFormField>
    </div>

    <div v-else class="p-8 border-2 border-dashed border-border-light rounded-lg text-center bg-bg-secondary">
      <RIcon name="upload-cloud" size="32" class="mx-auto text-text-tertiary mb-2" />
      <p class="text-sm text-text-secondary">Arraste arquivos PDF, DOCX ou TXT aqui.</p>
      <RButton variant="ghost" size="sm" class="mt-4">Selecionar Arquivo</RButton>
    </div>

    <div class="flex justify-end gap-3 pt-4 border-t border-border-light">
      <RButton variant="ghost" type="button" @click="$emit('cancel')">Cancelar</RButton>
      <RButton variant="primary" type="submit" :loading="loading">Salvar Conhecimento</RButton>
    </div>
  </form>
</template>
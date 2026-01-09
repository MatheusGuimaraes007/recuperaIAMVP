<script setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import RFormField from '@components/molecules/forms/RFormField.vue'
import RPasswordInput from '@components/molecules/forms/RPasswordInput.vue'
import RButton from '@components/atoms/buttons/RButton.vue'
import RLink from '@components/atoms/typography/RLink.vue'

const emit = defineEmits(['submit', 'forgot-password'])

const schema = yup.object({
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup.string().required('Senha obrigatória').min(6, 'Mínimo 6 caracteres')
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema
})

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})
</script>

<template>
  <form @submit="onSubmit" class="r-login-form">
    <RFormField
      name="email"
      label="E-mail"
      placeholder="seu@email.com"
      type="email"
      icon-left="mail"
      class="mb-4"
    />

    <div class="mb-6">
      <RFormField name="password" v-slot="{ field, errorMessage }">
        <RPasswordInput
          v-bind="field"
          label="Senha"
          :error="errorMessage"
        />
      </RFormField>
      <div class="text-right mt-1">
        <RLink @click="$emit('forgot-password')" size="sm" color="secondary">
          Esqueceu a senha?
        </RLink>
      </div>
    </div>

    <RButton
      type="submit"
      variant="primary"
      full-width
      size="lg"
      :loading="isSubmitting"
    >
      Entrar na Plataforma
    </RButton>
  </form>
</template>

<style scoped>
.r-login-form { width: 100%; }
.mb-4 { margin-bottom: var(--spacing-4); }
.mb-6 { margin-bottom: var(--spacing-6); }
.mt-1 { margin-top: var(--spacing-1); }
</style>
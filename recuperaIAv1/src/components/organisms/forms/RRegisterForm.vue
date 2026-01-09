<script setup>
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import RFormField from '@/components/molecules/forms/RFormField.vue'
import RPasswordInput from '@/components/molecules/forms/RPasswordInput.vue'
import RButton from '@/components/atoms/buttons/RButton.vue'
import RLink from '@/components/atoms/typography/RLink.vue'

const emit = defineEmits(['submit', 'login'])

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().required('E-mail é obrigatório').email('E-mail inválido'),
  password: yup.string().required('Senha é obrigatória').min(8, 'Mínimo 8 caracteres'),
  confirmPassword: yup.string()
      .oneOf([yup.ref('password')], 'Senhas não conferem')
      .required('Confirmação obrigatória')
})

const { handleSubmit, isSubmitting } = useForm({ validationSchema: schema })

const onSubmit = handleSubmit((values) => emit('submit', values))
</script>

<template>
  <form @submit="onSubmit" class="space-y-4">
    <RFormField name="name" label="Nome Completo" placeholder="Seu nome" icon-left="user" />
    <RFormField name="email" label="E-mail" placeholder="seu@email.com" type="email" icon-left="mail" />

    <RFormField name="password" v-slot="{ field, errorMessage }">
      <RPasswordInput v-bind="field" label="Senha" :error="errorMessage" />
    </RFormField>

    <RFormField name="confirmPassword" v-slot="{ field, errorMessage }">
      <RPasswordInput v-bind="field" label="Confirmar Senha" :error="errorMessage" />
    </RFormField>

    <div class="pt-2">
      <RButton type="submit" variant="primary" full-width size="lg" :loading="isSubmitting">
        Criar Conta Grátis
      </RButton>
    </div>

    <div class="text-center text-sm text-text-secondary mt-4">
      Já tem uma conta?
      <RLink @click="$emit('login')" color="primary" weight="medium">Faça Login</RLink>
    </div>
  </form>
</template>
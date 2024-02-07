<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2" data-testid="signup-page">
    <form @submit.prevent="submit" data-testid="form-sign-up" v-if="!successMessage">
      <Card>
        <template v-slot:header>
          <h1>{{ $t('signUp') }}</h1>
        </template>
        <template v-slot:body>
          <AppInput
            id="username"
            data-testid="username"
            :label="$t('username')"
            type="text"
            :help="errors.username"
            v-model="formState.username"
          />
          <AppInput
            id="email"
            :label="$t('email')"
            data-testid="email"
            type="text"
            :help="errors.email"
            v-model="formState.email"
          />
          <AppInput
            id="password"
            :label="$t('password')"
            data-testid="password"
            type="password"
            :help="errors.password"
            v-model="formState.password"
          />
          <AppInput
            id="passwordRepeat"
            :label="$t('passwordRepeat')"
            data-testid="passwordRepeat"
            type="password"
            :help="passwordMismatchError"
            v-model="formState.passwordRepeat"
          />

          <Alert v-if="errorMessage" varient="danger">{{ errorMessage }}</Alert>
          <div class="text-center">
            <AppButton :is-disabled="isDisabled" :api-progress="apiProgress">
              {{ $t('signUp') }}
            </AppButton>
          </div>
        </template>
      </Card>
    </form>
    <Alert v-else>
      {{ successMessage }}
    </Alert>
  </div>
</template>

<script setup>
import { reactive, computed, ref, watch } from 'vue'
import { Alert, AppInput, AppButton, Card } from '@/components'
import { useI18n } from 'vue-i18n'
import { signUp } from './api'

const { t, locale } = useI18n()

const formState = reactive({
  username: '',
  email: '',
  password: '',
  passwordRepeat: ''
})

const apiProgress = ref(false)
const successMessage = ref()
const errorMessage = ref()
const errors = ref({})

const submit = async () => {
  apiProgress.value = true
  errorMessage.value = undefined
  const { passwordRepeat, ...body } = formState
  try {
    const response = await signUp(body)
    successMessage.value = response.data.message
  } catch (apiError) {
    if (apiError.response?.status == 400) {
      errors.value = apiError.response.data.validationErrors
    } else {
      errorMessage.value = t('genericError')
    }
  } finally {
    apiProgress.value = false
  }
}

const isDisabled = computed(() => {
  return formState.password || formState.passwordRepeat
    ? formState.password !== formState.passwordRepeat
    : true
})

const passwordMismatchError = computed(() => {
  return formState.password != formState.passwordRepeat ? t('passwordMismatch') : undefined
})

watch(
  () => formState.username,
  () => {
    delete errors.value.username
  }
)
watch(
  () => formState.email,
  () => {
    delete errors.value.email
  }
)
watch(
  () => formState.password,
  () => {
    delete errors.value.password
  }
)
</script>

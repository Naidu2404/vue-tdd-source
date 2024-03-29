<template>
  <div class="col-lg-6 offset-lg-3 col-sm-8 offset-sm-2" data-testid="password-reset-set-page">
    <form @submit.prevent="submit">
      <Card>
        <template v-slot:header>
          <h1>{{ $t('passwordReset.set') }}</h1>
        </template>
        <template v-slot:body>
          <AppInput
            id="password"
            :label="$t('password')"
            :help="errors.password"
            v-model="password"
            type="password"
          />
          <AppInput
            id="passwordRepeat"
            :label="$t('passwordRepeat')"
            :help="passwordMatchError"
            v-model="passwordRepeat"
            type="password"
          />
          <Alert v-if="errorMessage" variant="danger">{{ errorMessage }}</Alert>
          <div class="text-center">
            <AppButton :isDisabled="isDisabled" :api-progress="apiProgress">
              {{ $t('passwordReset.set') }}
            </AppButton>
          </div>
        </template>
      </Card>
    </form>
  </div>
</template>
<script setup>
import { AppInput, AppButton, Alert, Card } from '@/components'
import { computed, ref, watch } from 'vue'
import { passwordSet } from './api'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
const { t } = useI18n()
const route = useRoute()

const router = useRouter()

const password = ref('')
const passwordRepeat = ref('')
const apiProgress = ref(false)
const errorMessage = ref()
const errors = ref({})
const submit = async () => {
  apiProgress.value = true
  errorMessage.value = undefined
  try {
    await passwordSet(route.query.tk, { password: password.value })
    router.push('/login')
  } catch (apiError) {
    if (apiError.response?.data?.validationErrors) {
      errors.value = apiError.response.data.validationErrors
    } else if (apiError.response?.data?.message) {
      errorMessage.value = apiError.response.data.message
    } else {
      errorMessage.value = t('genericError')
    }
  } finally {
    apiProgress.value = false
  }
}
watch(
  () => password.value,
  () => {
    delete errors.value.password
  }
)
const isDisabled = computed(() => {
  return password.value || passwordRepeat.value ? password.value !== passwordRepeat.value : true
})
const passwordMatchError = computed(() => {
  return password.value !== passwordRepeat.value ? t('passwordMismatch') : ''
})
</script>

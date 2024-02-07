import { ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

export default function useRouteParamApiRequest(apiFn, routeVariable) {
  const { t } = useI18n()
  const route = useRoute()

  const error = ref()
  const data = ref()
  const status = ref()

  watchEffect(async () => {
    status.value = 'loading'
    try {
      const response = await apiFn(route.params[routeVariable])
      data.value = response.data
      status.value = 'success'
    } catch (apiError) {
      if (apiError.response?.data?.message) {
        error.value = apiError.response.data.message
      } else {
        error.value = t('genericError')
      }
      status.value = 'fail'
    }
  })

  return { status, data, error }
}

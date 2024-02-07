<template>
  <img
    src="https://flagcdn.com/16x12/tr.png"
    data-testid="language-tr-selector"
    @click="setLanguage('tr')"
    role="button"
  />
  <span class="m-1"></span>
  <img
    src="https://flagcdn.com/16x12/us.png"
    data-testid="language-en-selector"
    @click="setLanguage('en')"
    role="button"
  />
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const setLanguage = (language) => {
  localStorage.setItem('app-lang', language)
  locale.value = language
}
</script>

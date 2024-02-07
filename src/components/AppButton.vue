<template>
  <button :class="`btn btn-${varient}`" :disabled="isDisabled || apiProgress">
    <Spinner v-if="apiProgress" />
    <slot></slot>
  </button>
</template>

<script setup>
import Spinner from './Spinner.vue'
defineProps({
  varient: {
    type: String,
    default: 'primary'
  },
  isDisabled: Boolean,
  apiProgress: Boolean
})
</script>

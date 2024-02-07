<template>
  <div :class="`alert alert-${varient} ${center ? 'text-center' : ''}`">
    <slot></slot>
  </div>
</template>
<script setup>
defineProps({
  varient: {
    type: String,
    default: 'success'
  },
  center: {
    type: Boolean,
    default: false
  }
})
</script>

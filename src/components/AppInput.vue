<template>
  <div class="mb-3">
    <label class="form-label" :for="id">{{ label }}</label>
    <input
      class="form-control"
      :class="{ 'is-invalid': help }"
      :type="type"
      :id="id"
      @input="$emit('update:modelValue', $event.target.value)"
      :value="modelValue"
      @change="$emit('change', $event)"
    />
    <span v-if="help" class="invalid-feedback">{{ help }}</span>
  </div>
</template>
<script setup>
defineProps({
  label: String,
  id: String,
  help: String,
  modelValue: String,
  type: String
})
defineEmits(['update:modelValue', 'change'])
</script>

<template>
  <v-text-field
    density="compact"
    clearable
    variant="outlined"
    :label="label"
    :prepend-inner-icon="icon"
    :rules="rules"
    :type="type"
    :placeholder="placeholder"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import type { ValidationRule } from '@/interfaces'
defineProps<{
  label: string
  icon?: string
  rules?: ValidationRule[]
  type?: string
  placeholder?: string
  modelValue?: string | number | undefined
}>()

defineEmits(['update:modelValue'])
</script>

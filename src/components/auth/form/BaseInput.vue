<template>
  <v-text-field
    density="compact"
    clearable
    variant="outlined"
    :label="label"
    :prepend-inner-icon="icon"
    :rules="rules"
    :type="type"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  ></v-text-field>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, PropType } from 'vue'

// Definir las props y sus valores predeterminados
defineProps({
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '',
  },
  rules: {
    type: Array as PropType<((value: string | number) => string | boolean)[]>,
    default: () => [],
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
})

// Definir el evento para la actualización del valor del modelo
defineEmits(['update:modelValue'])

// Emitir el evento de actualización
</script>

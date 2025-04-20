<template>
  <v-btn
    :style="{
      background: theme.current.value.colors.primary,
      color: theme.current.value.colors['on-primary'],
    }"
    elevation="0"
    v-bind="$attrs"
    @click="$emit('click')"
  >
    <slot>{{ text }}</slot>
  </v-btn>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'

const { global: theme } = useTheme()
defineProps({ text: String })
defineEmits(['click'])
</script>

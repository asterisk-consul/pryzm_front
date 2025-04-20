<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-expand-x-transition>
    <v-snackbar
      transition="scale-transition"
      v-model="alert.show"
      :color="alert.type"
      :timeout="timeout"
      location="top"
      class="d-flex justify-center"
    >
      {{ alert.message }}
      <!-- Botón de acción dentro del slot predeterminado -->
      <template v-slot:actions>
        <v-btn append-icon="mdi-close" size="xs" @click="cerrarSnackbar"></v-btn>
      </template>
    </v-snackbar>
  </v-expand-x-transition>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

// Definir la interfaz para la prop 'alert'
interface Alert {
  show: boolean
  type: string
  message: string
}

// Definir las propiedades
const props = defineProps<{
  alert: Alert
  timeout: number
}>()

// Emitir eventos
const emit = defineEmits<{
  (e: 'update:alert', alert: Alert): void
}>()

// Función para cerrar el snackbar
const cerrarSnackbar = () => {
  // Emitir el evento para actualizar la prop 'alert' en el componente padre
  emit('update:alert', { ...props.alert, show: false })
}
</script>

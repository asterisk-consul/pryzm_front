<template>
  <v-card
    :style="{
      color: theme.global.current.value.colors['on-surface'],
      backgroundColor: theme.global.current.value.colors.background,
    }"
  >
    <v-toolbar flat height="50px" tile dark color="primary">
      <v-btn icon dark @click="closeDialog">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Eliminar Tratamiento</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <p class="text-h6 font-weight-bold ma-4">
        ¿Estás seguro de que deseas eliminar el tratamiento
        {{ tratamientoActivo?.nombre }}?
      </p>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="blue darken-1"
        :style="{
          color: theme.global.current.value.colors.info,
          backgroundColor: theme.global.current.value.colors['background-list'],
        }"
        text
        @click="closeDialog"
        >Cancelar</v-btn
      >
      <v-btn
        color="red darken-1"
        :style="{
          color: theme.global.current.value.colors.info,
          backgroundColor: theme.global.current.value.colors['background-list'],
        }"
        text
        @click="confirmarEliminacionTratamiento"
        >Eliminar</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { defineEmits, toRefs } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()

import type { Tratamiento } from '@/interfaces/tratamientosInterface'

const props = defineProps<{
  tratamientoActivo: Tratamiento
}>()
const emit = defineEmits(['cerrar-dialogo', 'confirmarEliminacion'])

const { tratamientoActivo } = toRefs(props)

const closeDialog = () => {
  emit('cerrar-dialogo')
}
const confirmarEliminacionTratamiento = () => {
  emit('confirmarEliminacion')
}
</script>

<style scoped></style>

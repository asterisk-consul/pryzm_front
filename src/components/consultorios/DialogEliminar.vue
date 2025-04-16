import { Consultorio } from '../../interfaces/consultorioInterface';
<template>
  <v-card
    :style="{
      color: theme.global.current.value.colors['on-surface'],
      backgroundColor: theme.global.current.value.colors.background,
    }"
  >
    <v-toolbar flat height="50px" tile dark color="primary">
      <v-btn icon dark @click="cerrarDialogo">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Eliminar Consultorio</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <p class="text-h6 font-weight-bold ma-4">
        ¿Estás seguro de que deseas eliminar el consultorio
        {{ consultorioActivo?.nombre_consultorio }}?
      </p>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        :style="{
          color: theme.global.current.value.colors.info,
          backgroundColor: theme.global.current.value.colors['background-list'],
        }"
        text
        @click="cerrarDialogo"
        >Cancelar</v-btn
      >
      <v-btn
        :style="{
          color: theme.global.current.value.colors.error,
          backgroundColor: theme.global.current.value.colors['background-list'],
        }"
        text
        @click="confirmarEliminacion"
        >Eliminar</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()

import type { Consultorio } from '@/interfaces/consultorioInterface'

defineProps<{
  consultorioActivo: Consultorio
}>()

const emit = defineEmits<{
  (e: 'confirmarEliminacion'): void
  (e: 'cerrar-dialogo'): void
}>()

const confirmarEliminacion = () => {
  emit('confirmarEliminacion')
}

const cerrarDialogo = () => {
  emit('cerrar-dialogo')
}
</script>

<style scoped></style>

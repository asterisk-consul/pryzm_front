<template>
  <v-card
    :style="{
      color: theme.global.current.value.colors['on-surface'],
      backgroundColor: theme.global.current.value.colors.background,
    }"
  >
    <v-toolbar
      color="primary"
      :title="`Tratamientos de ${consultorioActivo?.nombre_consultorio || ''}`"
    >
      <v-btn icon dark @click="closeDialog">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card-text class="pa-4">
      <div v-if="consultorioActivo.tratamientos.length">
        <v-chip
          v-for="tratamiento in consultorioActivo.tratamientos"
          :key="tratamiento.id_tratamiento"
          :color="tratamiento.color"
          text-color="black"
          class="mb-2 mr-2"
        >
          <strong>{{ tratamiento.nombre }}</strong> - {{ tratamiento.descripcion }} ({{
            tratamiento.duracion
          }})
        </v-chip>
      </div>
      <div v-else>No hay tratamientos para mostrar</div>
    </v-card-text>
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
  (e: 'close-dialog'): void
}>()

const closeDialog = () => {
  emit('close-dialog')
}
</script>

<style scoped></style>

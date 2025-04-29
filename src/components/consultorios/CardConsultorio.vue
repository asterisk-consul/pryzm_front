<template>
  <v-hover v-slot:default="{ isHovering, props }">
    <v-card
      :color="
        isSelected
          ? theme.global.current.value.colors.primary
          : theme.global.current.value.colors['background-list']
      "
      @click="toggle"
      class="mb-2 position-relative pa-5"
      :class="{ 'on-hover': isHovering }"
      v-bind="props"
      :style="{
        background: theme.global.current.value.colors.background,
        color: theme.global.current.value.colors['on-background'],
        border: `1px solid ${theme.global.current.value.colors['border']}`,
        transition: 'border-color 0.3s ease-in-out',
        maxWidth: '300px',
        marginLeft: '10px',
      }"
      elevation="0"
      outlined
    >
      <!-- Nombre del consultorio -->
      <v-card-title class="text-h6">
        {{ consultorio.nombre_consultorio }}
      </v-card-title>

      <!-- Listado de tratamientos en un solo card - VERSIÓN CORREGIDA -->
      <v-card-text>
        <div v-if="consultorio.tratamientos && consultorio.tratamientos.length > 0">
          <!-- Contenedor principal de chips -->
          <div style="display: flex; flex-direction: column; gap: 8px">
            <!-- Chips de tratamientos (3 primeros) -->
            <div style="display: flex; flex-wrap: wrap; gap: 8px">
              <v-chip
                v-for="tratamiento in consultorio.tratamientos.slice(0, 3)"
                :key="tratamiento.id_tratamiento"
                :color="tratamiento.color"
                text-color="black"
                style="min-width: 120px; justify-content: start; flex-grow: 1"
              >
                <strong>{{ tratamiento.nombre }}</strong> ({{ tratamiento.duracion }})
              </v-chip>
            </div>

            <!-- Chip "Ver más" (debajo y centrado) -->
            <div
              v-if="consultorio.tratamientos.length > 3"
              style="display: flex; justify-content: start"
            >
              <v-chip
                color="primary"
                @click="abrirDialogoTratamientos(consultorio)"
                style="min-width: 120px; justify-content: center"
              >
                +{{ consultorio.tratamientos.length - 3 }} más
              </v-chip>
            </div>
          </div>
        </div>
        <div v-else style="padding: 8px 0">No hay tratamientos asociados.</div>
      </v-card-text>
      <!-- Botones de edición/borrado -->
      <div
        class="pa-2 transition-swing"
        style="
          z-index: 10;
          position: absolute;
          right: 0;
          top: 0;
          transition: opacity 0.3s ease-in-out;
        "
        :style="{ opacity: isHovering ? 1 : 0 }"
      >
        <v-btn
          icon
          small
          class="mt-2"
          :style="{
            color: theme.global.current.value.colors.info,
            background: theme.global.current.value.colors['background-list'],
            transition: 'color 0.3s ease-in-out',
            width: '30px',
            height: '30px',
          }"
          @click="editarConsultorio(consultorio)"
        >
          <v-icon :size="20">mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          icon
          small
          class="ml-2 mr-5 mt-2"
          :style="{
            color: theme.global.current.value.colors.error,
            background: theme.global.current.value.colors['background-list'],
            transition: 'color 0.3s ease-in-out',
            width: '30px',
            height: '30px',
          }"
          @click="borrarConsultorio(consultorio)"
        >
          <v-icon :size="20">mdi-delete</v-icon>
        </v-btn>
      </div>
    </v-card>
  </v-hover>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'
import { useTheme } from 'vuetify'
import type { Consultorio } from '@/interfaces/consultorioInterface'

const theme = useTheme()

defineProps<{
  consultorio: Consultorio
  isSelected?: boolean
  toggle: () => void
}>()

const emit = defineEmits<{
  (e: 'abrir-dialogo-eliminar', consultorio: Consultorio): void
  (e: 'abrir-dialogo-editar', consultorio: Consultorio): void
  (e: 'abrir-dialogo-tratamientos', consultorio: Consultorio): void
}>()

const borrarConsultorio = (consultorio: Consultorio) => {
  emit('abrir-dialogo-eliminar', consultorio)
}

const editarConsultorio = (consultorio: Consultorio) => {
  emit('abrir-dialogo-editar', consultorio)
}

const abrirDialogoTratamientos = (consultorio: Consultorio) => {
  emit('abrir-dialogo-tratamientos', consultorio)
}
</script>

<style scoped></style>

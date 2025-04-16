<template>
  <v-hover
    v-for="tratamiento in tipoTratamientos"
    :key="tratamiento.id_tratamiento"
    v-slot:default="{ isHovering, props }"
  >
    <v-card
      v-bind="props"
      :color="tratamiento.color"
      class="ma-2 pa-2 d-flex flex-column justify-center align-center"
      style="position: relative"
    >
      <v-card-title class="text-h6 font-weight-bold ma-0 pa-0">{{
        tratamiento.nombre.toUpperCase()
      }}</v-card-title>

      <v-card-subtitle class="text-subtitle-1 ma-0 pa-0">{{
        tratamiento.descripcion
      }}</v-card-subtitle>

      <v-card-subtitle class="text-subtitle-1 ma-0 pa-0">
        {{ tratamiento.duracion }} min
      </v-card-subtitle>

      <v-card-title class="text-subtitle-1 ma-0 pa-0">$ {{ tratamiento.costo }}</v-card-title>

      <!-- Botones que aparecen al pasar el mouse -->
      <div
        class="pa-2 transition-ease-in-out"
        style="z-index: 10; position: absolute; right: 0; top: 0"
        :style="{ opacity: isHovering ? 1 : 0 }"
      >
        <v-btn
          color="#222222"
          icon
          small
          class="mt-2"
          @click="editarTratamiento(tratamiento)"
          :style="{
            transition: 'color 0.3s ease-in-out',
            width: '30px',
            height: '30px',
          }"
        >
          <v-icon :size="20">mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          color="#222222"
          icon
          small
          class="ml-2 mr-5 mt-2"
          @click="borrarTratamiento(tratamiento)"
          :style="{
            transition: 'color 0.3s ease-in-out',
            width: '30px',
            height: '30px',
          }"
        >
          <v-icon :size="20">mdi-delete</v-icon>
        </v-btn>
      </div>
    </v-card>
  </v-hover>
</template>

<script setup lang="ts">
import { defineEmits, toRefs } from 'vue'

import type { Tratamiento } from '@/interfaces/tratamientosInterface'

const props = defineProps<{
  tipoTratamientos: Array<Tratamiento>
}>()

const { tipoTratamientos } = toRefs(props)

const emit = defineEmits(['editar-tratamiento', 'borrar-tratamiento'])

const editarTratamiento = (tratamiento: Tratamiento) => {
  emit('editar-tratamiento', tratamiento)
}

const borrarTratamiento = (tratamiento: Tratamiento) => {
  emit('borrar-tratamiento', tratamiento)
}
</script>

<style scoped></style>

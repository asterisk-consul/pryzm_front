<template>
  <v-row justify="space-between" class="mx-4 my-2">
    <h3>Listado de Tratamientos</h3>
    <CrearButton @click="handleCreateTratamiento" text="+ Agregar Tratamiento" />
  </v-row>
  <v-row cols="12" md="4">
    <CardTratamientos
      :tipo-tratamientos="tratamientos"
      @editar-tratamiento="abrirDialogEditar"
      @borrar-tratamiento="abrirDialogborrar"
    />
  </v-row>
  <!--dialog para editar/crear Tratamiento-->
  <v-dialog
    v-model="dialogs.tratamientos"
    scrollable
    width="35vw"
    persistent
    transition="slide-x-transition"
  >
    <DialogCrearEditar
      :tratamiento="tratamientoActivo || {}"
      :is-edit="isEdit"
      @close-dialog="dialogs.tratamientos = false"
      @create-tratamiento="createTratamiento"
    />
  </v-dialog>
  <!--  dialog para eliminar tratamiento-->
  <v-dialog
    v-model="dialogs.eliminar"
    scrollable
    persistent
    :overlay="false"
    max-width="500px"
    transition="dialog-transition"
  >
    <DialogEliminar
      :tratamiento-activo="tratamientoActivo || {}"
      @confirmar-eliminacion="confirmarEliminacion"
      @cerrar-dialogo="dialogs.eliminar = false"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'

// Pinia
import { useConsultoriosStore } from '@/stores/consultoriosStores'
const store = useConsultoriosStore()

// Interfaces
import type { Tratamiento } from '@/interfaces/tratamientosInterface'
// import type { Consultorio } from '@/interfaces/consultorioInterface'

// Servicios
import { useServiceTratamientos } from '@/services/tratamientosServices'
const { addTratamiento, eliminarTratamiento, updateTratamiento } = useServiceTratamientos()

// Componentes
import CardTratamientos from './CardTratamientos.vue'
import DialogCrearEditar from './DialogCrearEditar.vue'
import DialogEliminar from './DialogEliminar.vue'
import CrearButton from '../buttons/CrearButton.vue'

// Propiedades
const props = defineProps<{
  tratamientos: Array<Tratamiento>
}>()

const { tratamientos } = toRefs(props)

// Variables
const dialogs = ref({
  tratamientos: false,
  eliminar: false,
})
const isEdit = ref<boolean>(false)
const tratamientoActivo = ref<Tratamiento | null>(null)

// Funciones
const handleCreateTratamiento = () => {
  dialogs.value.tratamientos = !dialogs.value.tratamientos
  isEdit.value = false
}

const abrirDialogborrar = (tratamiento: Tratamiento) => {
  tratamientoActivo.value = tratamiento
  dialogs.value.eliminar = true
}
const abrirDialogEditar = async (tratamiento: Tratamiento) => {
  tratamientoActivo.value = tratamiento
  isEdit.value = true
  dialogs.value.tratamientos = true
}

const confirmarEliminacion = async () => {
  await eliminarTratamiento(tratamientoActivo.value as Tratamiento)
  dialogs.value.eliminar = false
  await store.cargarDatos()
}

const createTratamiento = async (tratamiento: Tratamiento) => {
  const { nombre, descripcion, costo, duracion, color } = tratamiento
  if (isEdit.value) {
    // Modo edición: Actualizar el consultorio existente
    await updateTratamiento(tratamiento)
    await store.cargarDatos()
  } else {
    // Modo creación: Crear un nuevo consultorio
    await addTratamiento(
      nombre || '',
      descripcion || '',
      costo || 0,
      Number(duracion) || 0,
      color || '',
    )
    await store.cargarDatos()
  }
  dialogs.value.tratamientos = false // Cerrar el diálogo
}
</script>

<style scoped></style>

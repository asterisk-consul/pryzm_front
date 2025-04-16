<template>
  <v-data-table
    :key="pacientes.length"
    :headers="headers"
    :items="pacientes"
    class="elevation-2"
    no-data-text="No hay pacientes registrados."
    :style="{
      backgroundColor: theme.global.current.value.colors.background,
      color: theme.global.current.value.colors['on-background'],
      border: `1px solid ${theme.global.current.value.colors.border}`,
    }"
  >
    <template v-slot:item.actions="{ item }">
      <!-- Botón para editar y eliminar -->
      <v-icon class="me-2" size="small" @click="abrirDialogEditar(item)">mdi-pencil</v-icon>
      <v-icon size="small" @click="abrirDialogEliminar(item)">mdi-delete</v-icon>
    </template>
  </v-data-table>

  <!-- Diálogo de Confirmación -->
  <v-dialog v-model="dialogVisible" max-width="900">
    <DialogoConfirmacion
      :paciente="pacienteSeleccionado"
      @confirmar="confirmarEliminar"
      @cancelar="cerrarDialog"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { headers } from './constants/headers'
import { useTheme } from 'vuetify'
import DialogoConfirmacion from './DialogoConfirmacion.vue'

const theme = useTheme()
// Define el tipo de "pacientes" que es un arreglo de objetos
interface Paciente {
  id_paciente: number
  nombre: string
  edad: number
  direccion: string
  telefono: string
}

defineProps({
  pacientes: {
    type: Array as () => Paciente[],
    required: true,
  },
})

const emit = defineEmits(['abrir-dialog-editar', 'eliminar-paciente'])

const dialogVisible = ref(false)
const pacienteSeleccionado = ref<Paciente | null>(null)

const abrirDialogEditar = (item: Paciente) => {
  emit('abrir-dialog-editar', item)
}

const abrirDialogEliminar = (item: Paciente) => {
  pacienteSeleccionado.value = item
  dialogVisible.value = true
}

const confirmarEliminar = () => {
  if (pacienteSeleccionado.value) {
    emit('eliminar-paciente', pacienteSeleccionado.value.id_paciente)
  }
  cerrarDialog()
}

const cerrarDialog = () => {
  dialogVisible.value = false
  pacienteSeleccionado.value = null
}
</script>

<style scoped>
/* Estilos para los iconos y las celdas */
.v-data-table td {
  padding: 10px;
}
.v-icon {
  cursor: pointer;
}
:deep(.v-data-table__th) {
  background-color: v-bind('theme.global.current.value.colors.surface');
  color: v-bind('theme.global.current.value.colors["on-background"]') !important;
}
</style>

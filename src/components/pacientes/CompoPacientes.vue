<template>
  <v-container>
    <v-row>
      <v-toolbar
        :style="{
          backgroundColor: theme.global.current.value.colors.surface,
          color: theme.global.current.value.colors['on-background'],
          border: `1px solid ${theme.global.current.value.colors.border}`,
          borderRadius: '0.5rem 0.5rem 0 0',
        }"
        class="pa-5"
      >
        <v-toolbar-title class="text-h5">Gestión de Pacientes</v-toolbar-title>
        <v-btn
          icon="mdi-account-plus"
          class="ml-2 mr-7"
          @click="abrirDialogAgregar"
          :style="{
            backgroundColor: theme.global.current.value.colors.primary,
            color: theme.global.current.value.colors['on-primary'],
          }"
        ></v-btn>
      </v-toolbar>
    </v-row>
    <v-row>
      <TablaPacientes
        :pacientes="pacientes"
        @abrir-dialog-editar="abrirDialogEditar"
        @eliminar-paciente="eliminar"
      />
    </v-row>
    <!-- v-dialog para mostrar la ventana emergente -->
    <DialogPaciente
      :dialog="dialog"
      :isEdit="isEdit"
      :pacienteEditar="pacienteSeleccionado"
      @paciente-agregado="agregarPaciente"
      @paciente-editado="actualizarPaciente"
      @close-dialog="cerrarDialogPaciente"
    />
  </v-container>
</template>

<script lang="ts" setup>
import { isAxiosError } from 'axios'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { useTheme } from 'vuetify'

import type { Paciente } from '@/interfaces'

const theme = useTheme()

// Importar los componentes
import TablaPacientes from './TablaPacientes.vue'
import DialogPaciente from './DialogPacientes.vue'

import { usePacientesStore } from '@/stores/pacientesStores'
// import { fetchPacientes } from './services/pacientesService'

const pacientesStore = usePacientesStore()

const { pacientes } = storeToRefs(pacientesStore)

const { fetchPacientes, savePaciente, deletePaciente, updatePaciente } = pacientesStore

const dialog = ref(false)
const isEdit = ref(false)
const pacienteSeleccionado = ref<Paciente | null>(null)

const abrirDialogAgregar = () => {
  dialog.value = true
}

const cerrarDialogPaciente = () => {
  dialog.value = false
  isEdit.value = false
}

const abrirDialogEditar = (paciente: Paciente) => {
  pacienteSeleccionado.value = paciente
  isEdit.value = true
  dialog.value = true // Pasar los datos del paciente al abrir el diálogo
}

const agregarPaciente = async (nuevo: Paciente) => {
  try {
    // Llamada asíncrona para guardar el paciente en el servidor
    await savePaciente(nuevo)
    dialog.value = false
  } catch (error) {
    console.error('Error al agregar el paciente:', error)
  }
}
// Función para actualizar un paciente editado
const actualizarPaciente = async (paciente: Paciente) => {
  try {
    await updatePaciente(paciente)
    dialog.value = false
  } catch (error) {
    console.error('Error al actualizar el paciente:', error)
  }
}
// Función para eliminar un paciente
const eliminar = async (item: Paciente) => {
  try {
    await deletePaciente(item.id_paciente)

    // Elimina el paciente de la lista localmente
    const index = pacientes.value.findIndex((p) => p.id_paciente === Number(item))

    if (index !== -1) {
      pacientes.value = [...pacientes.value.slice(0, index), ...pacientes.value.slice(index + 1)] // Eliminar el paciente de la lista
      pacientes.value = [...pacientes.value]
    }
  } catch (error) {
    console.error('Error al eliminar el paciente:', error)

    // Verificación de tipo segura
    if (isAxiosError(error) && error.response?.status === 400) {
      alert('No se puede eliminar el paciente porque tiene turnos asociados.')
    } else {
      alert('Hubo un error al eliminar el paciente. Inténtalo nuevamente.')
    }
  }
}

onMounted(() => {
  fetchPacientes()
})

// // Importar los servicios
// import {
//   fetchPacientes,
//   // fetchPacienteId,
//   savePaciente,
//   deletePaciente,
//   updatePaciente,
// } from './services/pacientesService'

// Definir la lista de pacientes
// const pacientes = ref([])

// Función para cargar pacientes
// const cargarPacientes = async () => {
//   try {
//     const pacientesData = await fetchPacientes()
//     pacientes.value = pacientesData || []
//   } catch (error) {
//     console.error('Error al cargar pacientes:', error)
//     pacientes.value = []
//   }
// }

// const {
//   dialog: dialogPaciente,
//   data: pacienteData,
//   abrirDialog,
//   cerrarDialog,
//   cancelDialog: cerrarDialogPaciente,
// } = useDialog()

//Metodos

// Función para agregar un nuevo paciente
</script>

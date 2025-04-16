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
    <v-dialog v-model="dialogPaciente" max-width="1000px">
      <DialogPaciente
        :isEdit="!!pacienteData"
        :pacienteEditar="pacienteData"
        @paciente-agregado="agregarPaciente"
        @paciente-editado="actualizarPaciente"
        @close-dialog="cerrarDialogPaciente"
      />
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useDialog } from '../../composables/useDialog'
import { useTheme } from 'vuetify'

const theme = useTheme()

// Importar los componentes
import TablaPacientes from './TablaPacientes.vue'
import DialogPaciente from './DialogPaciente.vue'

// Importar los servicios
import {
  fetchPacientes,
  // fetchPacienteId,
  savePaciente,
  deletePaciente,
  updatePaciente,
} from './services/pacientesService'

// Definir la lista de pacientes
const pacientes = ref([])

// Función para cargar pacientes
const cargarPacientes = async () => {
  try {
    const pacientesData = await fetchPacientes()
    pacientes.value = pacientesData || []
  } catch (error) {
    console.error('Error al cargar pacientes:', error)
    pacientes.value = []
  }
}

const {
  dialog: dialogPaciente,
  data: pacienteData,
  abrirDialog,
  cerrarDialog,
  cancelDialog: cerrarDialogPaciente,
} = useDialog()

//Metodos
const abrirDialogAgregar = () => {
  abrirDialog() // Pasar los datos del paciente al abrir el diálogo
}

const abrirDialogEditar = (paciente) => {
  pacienteData.value = paciente
  abrirDialog(pacienteData.value) // Pasar los datos del paciente al abrir el diálogo
}
// Función para agregar un nuevo paciente
const agregarPaciente = async (nuevoPaciente) => {
  try {
    // Llamar al backend para guardar el paciente
    const pacienteGuardado = await savePaciente(nuevoPaciente)

    pacientes.value.push(pacienteGuardado)
    pacientes.value.sort((a, b) => {
      // Ordenar según el campo que desees, por ejemplo, por 'id_paciente'
      return a.id_paciente - b.id_paciente // Ascendente
    })

    cerrarDialog() // Cierra el diálogo después de que Vue haya actualizado el DOM
    // Cerrar el diálogo después de agregar el paciente
  } catch (error) {
    console.error('Error al agregar el paciente:', error)
  }
}
// Función para actualizar un paciente editado
const actualizarPaciente = async (pacienteEditado) => {
  try {
    // Llamada asíncrona para actualizar el paciente en el servidor
    await updatePaciente(pacienteEditado.id_paciente, pacienteEditado)

    // Buscar el índice del paciente en el array
    const index = pacientes.value.findIndex((p) => p.id_paciente === pacienteEditado.id_paciente)

    if (index !== -1) {
      // Actualizar solo las propiedades del paciente en el array local sin moverlo
      pacientes.value[index] = {
        ...pacientes.value[index],
        ...pacienteEditado,
      }
    } else {
      console.error('Paciente no encontrado en la lista.')
    }

    cerrarDialog() // Cerrar el diálogo después de la edición
  } catch (error) {
    console.error('Error al actualizar el paciente:', error)
  }
}
// Función para eliminar un paciente
const eliminar = async (item) => {
  try {
    // Elimina el paciente en el servidor usando la API
    console.log('Paciente eliminado:', item)
    console.log('Pacientes:', pacientes.value)
    await deletePaciente(item)

    // Elimina el paciente de la lista localmente
    const index = pacientes.value.findIndex((p) => p.id_paciente === Number(item))

    if (index !== -1) {
      pacientes.value = [...pacientes.value.slice(0, index), ...pacientes.value.slice(index + 1)] // Eliminar el paciente de la lista
      pacientes.value = [...pacientes.value]
    }
  } catch (error) {
    console.error('Error al eliminar el paciente:', error)
    // Verificar si el error es un error específico de relación
    if (error.response && error.response.status === 400) {
      alert('No se puede eliminar el paciente porque tiene turnos asociados.')
    } else {
      alert('Hubo un error al eliminar el paciente. Inténtalo nuevamente.')
    }
  }
}

onMounted(() => {
  cargarPacientes()
})
</script>

<template>
  <v-col cols="12">
    <v-row justify="space-between" class="mx-4 my-2">
      <h3>Listado de Consultorios</h3>
      <CrearButton @click="abrirDialogoCrear" text="+ Agregar Consultorio" />
    </v-row>
    <v-row justify="center" width="100%">
      <v-slide-group v-model="model" class="pa-4" show-arrows>
        <v-slide-group-item
          v-for="consultorio in consultorios"
          :key="consultorio.id_consultorio"
          v-slot="{ isSelected, toggle }"
          ><!-- Contenedor principal de consultorios -->
          <CardConsultorio
            :consultorio="consultorio"
            :isSelected="isSelected"
            :toggle="toggle"
            @abrir-dialogo-eliminar="abrirDialogoBorrar"
            @abrir-dialogo-editar="editarConsultorio"
            @abrir-dialogo-tratamientos="abrirDialogoTratamientos"
          />
        </v-slide-group-item>
      </v-slide-group>
    </v-row>
  </v-col>

  <v-dialog
    v-model="dialogs.editar"
    scrollable
    width="35vw"
    persistent
    transition="slide-x-transition"
  >
    <DialogCrearEditar
      :is-edit="isEdit"
      :consultorio="consultorioActivo"
      :Tratamientos="Tratamientos"
      @submit="createConsultorio"
      @close="dialogs.editar = false"
    />
  </v-dialog>
  <!--  dialog para eliminar-->
  <ConfirmDialog
    v-model="dialogs.eliminar"
    :entity="consultorioActivo"
    entity-name="el consultorio"
    title="Eliminar Consultorio"
    confirm-text="Confirmar"
    @confirm="confirmarEliminacion"
  />
  <v-dialog
    v-model="dialogs.tratamientos"
    scrollable
    :overlay="false"
    max-width="500px"
    transition="dialog-transition"
  >
    <DialogTratamientos
      :consultorioActivo="consultorioActivo"
      @close-dialog="dialogs.tratamientos = false"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, toRefs } from 'vue'

// Pinia
import { useConsultoriosStore } from '@/stores/consultoriosStores'
const store = useConsultoriosStore()

// Interfaces
import type { Consultorio } from '@/interfaces/consultorioInterface'
import type { Tratamiento } from '@/interfaces/tratamientosInterface'

//Servicios
import { useServiceConsultorios } from '@/services/consultoriosServices'

const { addConsultorio, updateConsultorio, deleteConsultorio, fetchConsultoriosyTratamientos } =
  useServiceConsultorios()

// Componentes
// import { useTheme } from 'vuetify'
import CardConsultorio from './CardConsultorio.vue'
import DialogTratamientos from './DialogTratamientos.vue'
import DialogCrearEditar from './DialogCrearEditar.vue'
import CrearButton from '../buttons/CrearButton.vue'
import ConfirmDialog from '@/components/Dialogs/DialogEliminar.vue'
// import { formatDate } from '../../utils/formatDateTime'
// const theme = useTheme()

// Propiedades
const props = defineProps<{
  consultorios: Consultorio[]
  Tratamientos: Tratamiento[]
}>()

const { consultorios } = toRefs(props)

const dialogs = ref({
  eliminar: false,
  editar: false,
  tratamientos: false,
})

const isEdit = ref(false)

const consultorioActivo = ref<Consultorio>({
  id_consultorio: 0,
  nombre_consultorio: '',
  tratamientos: [],
})
const newConsultorio = ref('')
const selectedTratamientos = ref<Tratamiento[]>([])
// const consultorioToEdit = ref<number | null>(null)
const model = ref(null)

// Abre el diálogo según la acción
const abrirDialogoTratamientos = (consultorio: Consultorio) => {
  consultorioActivo.value = consultorio
  dialogs.value.tratamientos = true
}

const abrirDialogoBorrar = (consultorio: Consultorio) => {
  consultorioActivo.value = consultorio
  dialogs.value.eliminar = true
  console.log('Consultorio a eliminar:', dialogs.value.eliminar)
}

const abrirDialogoCrear = () => {
  consultorioActivo.value = {
    nombre_consultorio: '',
    tratamientos: [],
  }
  isEdit.value = false
  dialogs.value.editar = true
}

const editarConsultorio = (consultorio: Consultorio) => {
  isEdit.value = true
  consultorioActivo.value = consultorio
  dialogs.value.editar = true
  newConsultorio.value = consultorio.nombre_consultorio

  // Asigna los tratamientos completos (con nombre y color)
  selectedTratamientos.value =
    consultorio.tratamientos.length > 0
      ? consultorio.tratamientos.map((t: Tratamiento) => ({
          id_tratamiento: t.id_tratamiento,
          nombre: t.nombre,
          color: t.color, // Si `color` es opcional, usa un valor por defecto
          descripcion: t.descripcion ?? '', // Si falta, proporciona un valo
          duracion: t.duracion?.toString() ?? '0', // Si falta, usa 0
          costo: t.costo ?? 0, // Si falta, usa 0
        }))
      : []
}

const createConsultorio = async (formData: Consultorio) => {
  if (isEdit.value) {
    // Modo edición: Actualizar el consultorio existente
    await updateConsultorio(formData)
    await store.cargarDatos()
  } else {
    // Asegurar que pasamos los tratamientos como array de IDs

    await addConsultorio(formData.nombre_consultorio, formData.tratamientos)
    await store.cargarDatos()
  }
  dialogs.value.editar = false
}

const confirmarEliminacion = async () => {
  try {
    await deleteConsultorio(consultorioActivo.value as Consultorio)
    await fetchConsultoriosyTratamientos(consultorios)
    dialogs.value.eliminar = false
    await store.cargarDatos()
  } catch (error) {
    // Show user-friendly error message
    alert(error + 'No se pudo eliminar el consultorio. Puede que tenga tratamientos asociados.')
  }
}
</script>

<style scoped>
.v-slide-group__content {
  gap: 16px !important; /* Separación entre cards */
  padding: 8px 0 !important;
}

.v-card {
  transition: all 0.3s ease !important;
}

.v-card.on-hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}
.v-select__content {
  background-color: #222 !important; /* Usa tu color de fondo */
}
</style>

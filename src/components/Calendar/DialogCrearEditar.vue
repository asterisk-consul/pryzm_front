<template>
  <v-dialog
    v-model="modelValue"
    scrollable
    :overlay="false"
    max-width="500px"
    transition="dialog-transition"
    @click:outside="cerrarDialog"
  >
    <v-card>
      <v-toolbar flat height="50px" tile dark color="primary">
        <v-btn icon dark @click="cerrarDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn v-if="isEdit" @click="deleteTurno" icon dark>
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-toolbar-title>{{ isEdit ? 'Editar Turno' : 'Nuevo Turno' }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-4">
        <!-- Selector de Paciente -->
        <v-autocomplete
          label="Paciente"
          v-model="nuevoTurno.id_paciente"
          :items="pacientes"
          :item-title="formatearNombrePaciente"
          item-value="id_paciente"
          outlined
          dense
          required
        >
        </v-autocomplete>
        <!-- Selector de Consultorio -->
        <v-select
          label="Consultorio"
          :items="consultorios"
          item-title="nombre_consultorio"
          item-value="id_consultorio"
          v-model="nuevoTurno.id_consultorio"
          @update:model-value="cargarTratamientosPorConsultorio"
          outlined
          dense
          required
        >
        </v-select>
        <!-- Selector de Tratamientos -->
        <v-select
          label="Tratamiento"
          :items="tratamientosDisponibles"
          item-title="nombre"
          item-value="id_tratamiento"
          v-model="nuevoTurno.id_tratamiento"
          @update:model-value="actualizarDetallesTratamiento"
          outlined
          dense
          required
        >
          <template v-slot:item="{ props, item }">
            <v-list-item
              v-bind="props"
              :title="item.raw.nombre"
              :prepend-avatar="item.raw.color || undefined"
            >
              <template v-slot:prepend>
                <v-avatar :color="item.raw.color || undefined" size="12" class="mr-2"></v-avatar>
              </template>
            </v-list-item>
          </template>
        </v-select>

        <!-- Selector de Fecha -->
        <v-menu
          ref="menuFecha"
          @update:modelValue="cerrarMenuFecha"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template #activator="{ props }">
            <v-text-field
              v-model="fechaFormateada"
              label="Fecha"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="props"
              outlined
              dense
              required
            />
          </template>
          <v-date-picker
            no-title
            v-model="nuevoTurno.fecha"
            locale="es"
            :header-date-format="formatHeaderDate"
            @update:modelValue="cerrarMenuFecha"
          ></v-date-picker>
        </v-menu>

        <!-- Selector de Hora -->
        <v-menu ref="menuHora" transition="scale-transition" offset-y min-width="auto">
          <template v-slot:activator="{ props }">
            <v-text-field
              v-bind="props"
              v-model="horaFormateada"
              label="Seleccionar hora"
              prepend-icon="mdi-clock-time-four-outline"
              suffix="HH:MM"
              outlined
              dense
              required
            ></v-text-field>
          </template>
          <v-time-picker
            v-model="nuevoTurno.hora"
            @input="menuHora = false"
            format="24hr"
          ></v-time-picker>
        </v-menu>

        <!-- Duración y Costo del Tratamiento -->
        <v-text-field
          label="Duración del Tratamiento"
          v-model="tratamientoSeleccionado.duracion"
          outlined
          dense
          readonly
          suffix="minutos"
        ></v-text-field>
        <v-text-field
          label="Costo del Tratamiento"
          v-model="tratamientoSeleccionado.costo"
          prefix="$"
          outlined
          dense
          readonly
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          :style="{ background: theme.global.current.value.colors['background-list'] }"
          @click="guardarTurno"
        >
          {{ isEdit ? 'Guardar Cambios' : 'Guardar Turno' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'

import { storeToRefs } from 'pinia'
import type { Turno, Consultorio, Tratamiento, Paciente } from '@/interfaces'
import { ref, computed, toRefs, onMounted, watch } from 'vue'

import { formatDisplayDate, formatHeaderDate } from '@/utils/formatDateTime'

import { useConsultoriosStore } from '@/stores/consultoriosStores'

const theme = useTheme()

const consultoriosStore = useConsultoriosStore()
const { tratamientosPorConsultorio } = storeToRefs(consultoriosStore)

const props = defineProps<{
  modelValue: boolean
  isEdit: boolean
  consultorios: Consultorio[]
  pacientes: Paciente[]
  turnoActivo?: Turno
}>()

const tratamientosDisponibles = ref<Tratamiento[]>([])
const nuevoTurno = ref<Turno>({
  id_turno: null,
  id_paciente: null,
  id_consultorio: null,
  id_tratamiento: null,
  fecha: '',
  hora: '',
  nombre_consultorio: '', // Valor predeterminado
  nombre_tratamiento: '',
  duracion_tratamiento: null, // Valor predeterminado
  estado: '', // Valor predeterminado
  nombre_paciente: '', // Valor predeterminado
  apellido_paciente: '', // Valor predeterminado
  costo_tratamiento: null, // Valor predeterminado
  color_tratamiento: '', // Valor predeterminado
})
const menuFecha = ref(false)
const menuHora = ref(false)
const tratamientoSeleccionado = ref<Tratamiento>({
  duracion: null,
  costo: null,
})

const { modelValue, isEdit, consultorios } = toRefs(props)

const emit = defineEmits(['update:modelValue', 'create-turno', 'deleteTurno'])

const cerrarMenuFecha = () => {
  menuFecha.value = false // Simplemente cambia el estado a false
}

const cerrarDialog = () => {
  emit('update:modelValue', false)
  resetForm()
}

const guardarTurno = () => {
  emit('create-turno', nuevoTurno.value)
  cerrarDialog()
}

const deleteTurno = () => {
  emit('deleteTurno', nuevoTurno.value)
  cerrarDialog()
}

const formatearNombrePaciente = (paciente: Paciente) => {
  return `${paciente.nombre} ${paciente.apellido}`
}

const fechaFormateada = computed(() => {
  return formatDisplayDate(nuevoTurno.value.fecha)
})

const cargarTratamientosPorConsultorio = async (id_consultorio: number) => {
  try {
    // Usamos el store para cargar los tratamientos
    await consultoriosStore.cargarTratamientosPorConsultorio(id_consultorio)

    // Actualizamos los tratamientos disponibles
    tratamientosDisponibles.value = tratamientosPorConsultorio.value[id_consultorio] || []

    if (isEdit.value && nuevoTurno.value.id_tratamiento) {
      actualizarDetallesTratamiento(nuevoTurno.value.id_tratamiento)
    } else {
      nuevoTurno.value.id_tratamiento = null
      tratamientoSeleccionado.value = { duracion: null, costo: null }
    }
  } catch (error) {
    console.error('Error al cargar tratamientos:', error)
    tratamientosDisponibles.value = []
  }
}

const actualizarDetallesTratamiento = (id_tratamiento: number) => {
  const tratamiento = tratamientosDisponibles.value.find((t) => t.id_tratamiento === id_tratamiento)

  if (tratamiento) {
    tratamientoSeleccionado.value = {
      duracion: tratamiento.duracion,
      costo: tratamiento.costo,
    }
  } else {
    tratamientoSeleccionado.value = { duracion: null, costo: null }
  }
}

const resetForm = () => {
  nuevoTurno.value = {
    id_turno: null,
    id_paciente: null,
    id_consultorio: null,
    id_tratamiento: null,
    fecha: '',
    hora: '',
    nombre_consultorio: '', // Valor predeterminado
    nombre_tratamiento: '',
    duracion_tratamiento: null, // Valor predeterminado
    estado: '', // Valor predeterminado
    nombre_paciente: '', // Valor predeterminado
    apellido_paciente: '', // Valor predeterminado
    costo_tratamiento: null, // Valor predeterminado
    color_tratamiento: '', // Valor predeterminado
  }
  tratamientoSeleccionado.value = { duracion: null, costo: null }
  tratamientosDisponibles.value = []
}

watch(
  () => props.turnoActivo,
  (newTurno) => {
    if (newTurno && props.isEdit) {
      // Copiar datos del turno activo
      nuevoTurno.value = { ...newTurno }

      // Cargar tratamientos para el consultorio del turno activo
      if (newTurno.id_consultorio) {
        cargarTratamientosPorConsultorio(newTurno.id_consultorio)
      }
    } else {
      resetForm()
    }
  },
  { immediate: true },
)

// Watcher para isEdit
watch(
  () => props.isEdit,
  (newVal) => {
    if (!newVal) {
      resetForm()
    }
  },
)

const horaFormateada = computed(() => {
  if (!nuevoTurno.value.hora) return ''
  return nuevoTurno.value.hora
})

onMounted(() => {
  if (isEdit.value && nuevoTurno.value.id_consultorio !== null) {
    cargarTratamientosPorConsultorio(nuevoTurno.value.id_consultorio)
  }
})
</script>

<style scoped></style>

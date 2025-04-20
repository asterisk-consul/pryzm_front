<template>
  <!-- Sección para Filtrar Turnos -->
  <v-row class="mt-5">
    <v-col cols="12" md="6">
      <v-menu
        v-model="menuFechaFiltro"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ props }">
          <v-text-field
            :model-value="filtroFechaFormateada"
            label="Filtrar por Fecha"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="props"
            clearable
            @click="menuFechaFiltro = true"
            variant="outlined"
            density="compact"
          />
        </template>
        <v-date-picker
          v-model="filtroFecha"
          @update:modelValue="aplicarFiltro"
          color="primary"
          :theme="currentTheme.dark ? 'dark' : 'light'"
          locale="es"
        >
        </v-date-picker>
      </v-menu>
    </v-col>

    <v-col cols="12" md="6" class="d-flex align-center justify-center">
      <v-btn color="primary" @click="cargarTurnos" :disabled="!filtroFecha"> Filtrar Turnos </v-btn>
    </v-col>
  </v-row>

  <!-- Sección para Mostrar Turnos Programados -->
  <v-card
    :style="{
      background: theme.global.current.value.colors.background,
      color: theme.global.current.value.colors['on-background'],
      border: `1px solid ${theme.global.current.value.colors['border']}`,
    }"
  >
    <v-card-title class="text-h5">Turnos Programados</v-card-title>

    <v-data-table
      :style="{
        background: theme.global.current.value.colors.background,
        color: theme.global.current.value.colors['on-background'],
        border: `1px solid ${theme.global.current.value.colors['border']}`,
      }"
      :headers="headers"
      :items="turnos"
      item-value="id_turno"
      show-select
      v-model="turnosSeleccionados"
      class="elevation-1"
    >
      <!-- Personalización de columnas -->
      <template v-slot:item.nombre_paciente="{ item }">
        <strong>{{ item.nombre_paciente }} {{ item.apellido_paciente }}</strong>
      </template>

      <template v-slot:item.telefono="{ item }">
        <a
          target="_blank"
          :style="{ color: theme.global.current.value.colors['on-background'] }"
          :href="`tel:${item.telefono}`"
        >
          {{ item.telefono }}
        </a>
      </template>
    </v-data-table>
  </v-card>

  <!-- Sección para Escribir el Mensaje -->
  <v-card
    class="mt-5"
    :style="{
      background: theme.global.current.value.colors.background,
      color: theme.global.current.value.colors['on-background'],
      border: `1px solid ${theme.global.current.value.colors['border']}`,
    }"
  >
    <v-card-title class="text-h5">Escribir Mensaje</v-card-title>
    <v-card-text
      :style="{
        background: theme.global.current.value.colors.background,
        color: theme.global.current.value.colors['on-background'],
        border: `1px solid ${theme.global.current.value.colors['border']}`,
      }"
    >
      <v-textarea
        class="mt-3"
        v-model="mensaje"
        label="Escribe el mensaje para enviar por WhatsApp"
        outlined
        dense
        rows="4"
        required
      />
      <v-alert type="info" class="mt-3">
        Puedes usar los siguientes marcadores en el mensaje para personalizarlo:
        <ul>
          <li><b>{PACIENTE}</b>: Nombre del paciente</li>
          <li><b>{CONSULTORIO}</b>: Nombre del consultorio</li>
          <li><b>{TRATAMIENTO}</b>: Tratamiento asignado</li>
          <li><b>{FECHA}</b>: Fecha del turno</li>
          <li><b>{HORA}</b>: Hora del turno</li>
        </ul>
      </v-alert>
    </v-card-text>
    <v-card-actions>
      <v-btn
        @click="enviarNotificaciones"
        :style="{
          color: theme.global.current.value.colors['on-background'],
          backgroundColor: theme.global.current.value.colors.primary,
        }"
      >
        Enviar Notificaciones
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTheme } from 'vuetify'
import axios from '../../config/axios'

const theme = useTheme()

// Estados reactivos
const menuFechaFiltro = ref(false)
const filtroFecha = ref(null)
const turnos = ref([])
const turnosSeleccionados = ref([])
const mensaje = ref('')

const headers = ref([
  { title: 'Paciente', key: 'nombre_paciente' },
  { title: 'Consultorio', key: 'consultorio' },
  { title: 'Fecha', key: 'fecha' },
  { title: 'Hora', key: 'hora' },
  { title: 'Teléfono', key: 'telefono' },
])

const filtroFechaFormateada = computed(() => {
  if (!filtroFecha.value) return ''
  const fecha = new Date(filtroFecha.value)
  return fecha.toLocaleDateString('es-AR') // Formato para Argentina
})
const currentTheme = computed(() => theme.global.current.value)
const aplicarFiltro = (fecha) => {
  filtroFecha.value = fecha // Vuetify maneja fechas como 'YYYY-MM-DD'
}

// Métodos
const cargarTurnos = async () => {
  try {
    const response = await axios.get('/turnos/calendario', {
      params: { fecha: filtroFecha.value },
    })
    turnos.value = response.data
    console.log('Turnos cargados:', turnos.value)
  } catch (error) {
    console.error('Error al cargar turnos:', error)
    // toast.error('Error al cargar los turnos.')
  }
}

const enviarNotificaciones = async () => {
  try {
    const turnosConTelefono = turnos.value
      .filter((turno) => turnosSeleccionados.value.includes(turno.id_turno))
      .map((turno) => ({
        idTurno: turno.id_turno,
        numero: turno.telefono,
      }))

    const response = await axios.post('/enviar-notificaciones', {
      turnos: turnosConTelefono,
      mensajeBase: mensaje.value,
    })
    console.log(response)

    // toast.success('Notificaciones enviadas con éxito.')
    turnosSeleccionados.value = []
    mensaje.value = ''
  } catch (error) {
    console.error('Error al enviar notificaciones:', error)
    // toast.error('Error al enviar las notificaciones.')
  }
}

// Hook de ciclo de vida
onMounted(() => {
  cargarTurnos()
})
</script>

<style scoped>
/* Estilos opcionales */
</style>

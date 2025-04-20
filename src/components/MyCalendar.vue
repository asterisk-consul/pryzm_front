<template>
  <v-row class="fill-height ma-0 px-12">
    <v-col
      cols="12"
      class="ma-0 d-flex align-lg-center justify-space-between"
      style="border: #8e8e8e 0.3px solid; border-radius: 0.2rem; height: 50px"
    >
      <v-card-title cols="9" card-title primary-title class="text-h5"
        >📅 Calendario de turnos</v-card-title
      >
      <div cols="3" class="d-flex align-center">
        <v-col class="d-flex flex-column align-center pa-6">
          <v-btn color="primary" class="ma-3" style="width: 100%" @click="handleCreateTurno"
            >+ Nuevo Turno</v-btn
          >
        </v-col>
        <v-col class="d-flex flex-column align-center pa-6">
          <v-btn @click="configCob = !configCob" icon class="ma-3">
            <v-icon>mdi-cog-outline</v-icon>
          </v-btn>
        </v-col>
      </div>
    </v-col>
    <v-col
      cols="12"
      class="ma-0 d-flex align-lg-center justify-space-between"
      style="position: relative; border: #8e8e8e 0.3px solid; border-radius: 0.2rem; height: 70px"
    >
      <v-col cols="5">
        <div class="d-flex align-center">
          <v-btn class="ma-1" height="20px" small outlined @click="prev">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn class="ma-2" height="20px" small outlined @click="next">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>

          <v-toolbar-title
            v-if="$refs.calendar && $refs.calendar.title"
            class="text-capitalize text-subtitle-1"
          >
            {{ $refs.calendar.title.toUpperCase() }}
          </v-toolbar-title>
        </div>
      </v-col>
      <section style="display: flex; justify-content: space-between; margin: 10px 50px">
        <v-btn-toggle v-model="type" outlined class="d-flex">
          <v-btn value="month" height="35px" class="text-capitalize text-subtitle-2">
            <span class="hidden-sm-and-down">Mes</span>
          </v-btn>
          <v-btn
            @click="setToCurrentDate"
            value="week"
            height="35px"
            class="text-capitalize text-subtitle-2"
          >
            <span class="hidden-sm-and-down">Semana</span>
          </v-btn>
          <v-btn
            @click="setToCurrentDate"
            value="day"
            height="35px"
            class="text-capitalize text-subtitle-2"
          >
            <span class="hidden-sm-and-down">Diario</span>
          </v-btn>
          <v-btn value="list" height="35px" class="text-capitalize text-subtitle-2">
            <span class="hidden-sm-and-down">Agenda</span>
          </v-btn>
        </v-btn-toggle>
      </section>
    </v-col>
    <!--calendario-->
    <v-col
      cols="12"
      class="pa-0 border-b-lg"
      style="border: #8e8e8e 0.3px solid; border-radius: 0.2rem"
    >
      <v-sheet height="fill-height" width="99.9%">
        <v-container v-show="type === 'list'">
          <v-card class="mt-4">
            <v-card-title>Eventos del mes</v-card-title>
            <v-list class="overflow-y-auto" style="max-height: 400px">
              <template v-if="Object.keys(groupedEventsByDay).length === 0">
                <!-- Si no hay eventos, mostrar el alert -->
                <v-list-item>
                  <v-list-item-content>
                    <v-alert type="info" dense class="mb-0">
                      No hay eventos para este mes.
                    </v-alert>
                  </v-list-item-content>
                </v-list-item>
              </template>

              <template v-else>
                <transition-group name="list" tag="div">
                  <template v-for="(events, date) in groupedEventsByDay" :key="date">
                    <v-list-item-group class="pa-2">
                      <v-subheader
                        color="primary"
                        style="background-color: #c1c1c1; border: 1px solid #8e8e8e"
                        class="text-uppercase text-h6 font-weight-bold"
                      >
                        {{
                          new Intl.DateTimeFormat('es-ES', {
                            weekday: 'long',
                            day: 'numeric',
                            timeZone: 'UTC',
                          }).format(new Date(date + 'T00:00:00Z'))
                        }}
                      </v-subheader>

                      <template v-if="events.length > 0">
                        <v-list-item
                          v-for="(event, idx) in events"
                          :key="`event-${date}-${idx}`"
                          style="cursor: pointer; border-bottom: 1px solid #8e8e8e"
                          @click="showEvent({ event: event })"
                        >
                          <v-list-item-content>
                            <v-list-item-title style="font-size: 0.8rem">
                              <span
                                :style="{
                                  display: 'inline-block',
                                  width: '10px',
                                  height: '10px',
                                  borderRadius: '50%',
                                  backgroundColor: event.color,
                                  marginRight: '8px',
                                }"
                              ></span>
                              <span class="font-weight-bold" style="font-size: 1rem">
                                {{
                                  new Date(event.start).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                }}
                              </span>
                              <span class="font-weight-bold"> {{ event.category }} </span>-
                              <span
                                class="font-weight-bold"
                                :style="{
                                  color: event.color,
                                }"
                              >
                                {{ event.nombre_tratamiento }}
                              </span>
                              -
                              {{ event.name }} {{ event.apellido_paciente }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>

                      <template v-else>
                        <v-list-item>
                          <v-list-item-content>
                            <v-alert type="info" dense class="mb-0">
                              No hay actividades este día.
                            </v-alert>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-list-item-group>
                  </template>
                </transition-group>
              </template>
            </v-list>
          </v-card>
        </v-container>
        <v-calendar
          v-show="type !== 'list'"
          ref="calendar"
          v-model="value"
          :weekdays="weekday"
          :view-mode="calendarType"
          :events="events"
          :event-overlap-mode="'column'"
          :event-overlap-threshold="60"
          :event-color="getEventColor"
          @change="onCalendarChange"
          @click:event="showEvent"
          @click:more="handleClickMore"
          :interval-height="60"
          :interval-count="intervalCount"
          :interval-minutes="intervalMinutes"
          :first-interval="7"
          theme="dark"
          locale="es"
        >
          <template v-slot:event="{ event }">
            <v-tooltip
              top
              content-class="custom-tooltip"
              :style="{
                '--tooltip-border-color': event.color, // Define una variable CSS
                '--tooltip-bg-color': event.colorLigth,
              }"
              open-delay="150"
            >
              <template v-slot:activator="{ props }">
                <div
                  v-if="calendarType === 'week'"
                  class="text-center"
                  :style="{
                    backgroundColor: event.colorLigth,
                    color: event.colorDark,
                  }"
                  v-bind="props"
                >
                  <!-- Información mínima -->
                  <strong>{{ event.category }}</strong>
                  <br />
                  <strong>{{ event.name }}</strong>
                </div>
                <div
                  v-else
                  v-bind="props"
                  class="text-center"
                  :style="{
                    color: event.colorDark,
                  }"
                >
                  <!-- Información mínima para otras vistas -->
                  <span class="font-weight-bold"
                    >{{
                      new Date(event.start).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })
                    }}
                    {{ event.name }} {{ event.apellido_paciente }}</span
                  >
                  <br />
                  <strong>{{ event.nombre_tratamiento }}</strong>
                </div>
              </template>
              <!-- Contenido del tooltip -->
              <v-card
                :color="event.colorLigth"
                elevation="0"
                :style="{
                  border: `2px solid ${event.color}`,
                }"
              >
                <v-card-text class="text-lg-subtitle-1" :style="{ color: event.colorDark }">
                  <div><strong>Consultorio:</strong> {{ event.category }}</div>
                  <div>
                    <strong>Tratamiento:</strong>
                    {{ event.nombre_tratamiento }}
                  </div>
                  <div>
                    <strong>Hora:</strong>
                    {{ formatTime(event.start) }} -
                    {{ formatTime(event.end) }}
                  </div>
                  <div>
                    <strong>Duración: </strong>
                    {{ event.duracion_tratamiento }} min
                  </div>
                  <div><strong>Nombre:</strong> {{ event.name }}</div>
                  <div><strong>Apellido:</strong> {{ event.apellido_paciente }}</div>
                </v-card-text>
              </v-card>
            </v-tooltip>
          </template>
        </v-calendar>
      </v-sheet>
    </v-col>
  </v-row>
  <!--nuevo turno dialog-->
  <v-dialog
    v-model="dialog"
    scrollable
    :overlay="false"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-toolbar flat height="50px" tile dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn v-if="isEdit" @click="handleEliminarTurno" icon dark>
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
          :item-text="(paciente) => `${paciente.nombre} ${paciente.apellido}`"
          item-value="id_paciente"
          outlined
          dense
          required
        />
        <!-- Selector de Consultorio -->
        <v-select
          label="Consultorio"
          :items="consultorios"
          item-text="nombre"
          item-value="id_consultorio"
          v-model="nuevoTurno.id_consultorio"
          @change="cargarTratamientosPorConsultorio"
          outlined
          dense
          required
        >
          <template v-slot:item="{ item }">
            <div style="display: flex; align-items: center">
              <div
                :style="{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: item.color || '#ccc',
                  marginRight: '8px',
                }"
              ></div>
              <span>{{ item.nombre }}</span>
            </div>
          </template>
        </v-select>
        <!-- Selector de Tratamientos -->
        <v-select
          label="Tratamiento"
          :items="tratamientosDisponibles"
          item-text="nombre_tratamiento"
          item-value="id_tratamiento"
          v-model="nuevoTurno.id_tratamiento"
          @change="actualizarDetallesTratamiento"
          outlined
          dense
          required
        >
          <template v-slot:item="{ item }">
            <div style="display: flex; align-items: center">
              <div
                :style="{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: item.raw.color,
                  marginRight: '8px',
                }"
              ></div>
              <span>{{ item.raw.nombre_tratamiento }}</span>
            </div>
          </template>
        </v-select>

        <!-- Selector de Fecha -->
        <v-menu
          ref="menuFecha"
          v-model="menuFecha"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template #activator="{ props }">
            <v-text-field
              v-model="nuevoTurno.fecha"
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
            @input="menuFecha = false"
            locale="es"
            :header-date-format="formatHeaderDate"
          ></v-date-picker>
        </v-menu>

        <!-- Selector de Hora -->
        <v-menu
          ref="menuHora"
          v-model="menuHora"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
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
        <v-btn color="success" @click="guardarTurno">
          {{ isEdit ? 'Guardar Cambios' : 'Guardar Turno' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Diálogo para mostrar todos los turnos del día -->
  <v-dialog v-model="dialogDia" max-width="600">
    <v-card>
      <v-card-title> Turnos del día: {{ selectedDate }} </v-card-title>
      <v-card-text>
        <!-- Lista de eventos del día -->
        <v-list>
          <v-list-item v-for="(event, index) in eventsOfDay" :key="index">
            <v-list-item-content>
              <v-list-item-title>
                {{ event.nombre_paciente }} {{ event.apellido_paciente }}
              </v-list-item-title>
              <v-list-item-subtitle>
                <strong>Tratamiento:</strong> {{ event.nombre_tratamiento }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                <strong>Hora:</strong> {{ formatTime(event.start) }} -
                {{ formatTime(event.end) }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                <strong>Consultorio:</strong>
                {{ event.nombre_consultorio || 'Sin consultorio' }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-chip
                :color="event.colorLigth"
                :style="{
                  color: event.colorDark,
                }"
                dark
                small
              >
                {{ event.nombre_tratamiento }}
              </v-chip>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="dialogDia = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="elimiarTurno" max-width="600">
    <v-card>
      <v-toolbar flat height="50px" tile dark color="red">
        <v-toolbar-title> Eliminar Turno </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="text-h6 font-weight-bold my-2">
        ¿Estás seguro de que deseas eliminar este turno?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="elimiarTurno = false">Cancelar</v-btn>
        <v-btn color="green" text @click="eliminarTurno">Aceptar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Diálogo para mostrar todos los turnos del día -->
  <v-dialog v-model="dialogDia" max-width="600">
    <v-card>
      <v-card-title> Turnos del día: {{ selectedDate }} </v-card-title>
      <v-card-text>
        <!-- Lista de eventos del día -->
        <v-list>
          <v-list-item v-for="(event, index) in eventsOfDay" :key="index">
            <v-list-item-content>
              <v-list-item-title>
                {{ event.nombre_paciente }} {{ event.apellido_paciente }}
              </v-list-item-title>
              <v-list-item-subtitle>
                <strong>Tratamiento:</strong> {{ event.nombre_tratamiento }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                <strong>Hora:</strong> {{ formatTime(event.start) }} -
                {{ formatTime(event.end) }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                <strong>Consultorio:</strong>
                {{ event.nombre_consultorio || 'Sin consultorio' }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-chip
                :color="event.colorLigth"
                :style="{
                  color: event.colorDark,
                }"
                dark
                small
              >
                {{ event.nombre_tratamiento }}
              </v-chip>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="dialogDia = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="elimiarTurno" max-width="600">
    <v-card>
      <v-toolbar flat height="50px" tile dark color="red">
        <v-toolbar-title> Eliminar Turno </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="text-h6 font-weight-bold my-2">
        ¿Estás seguro de que deseas eliminar este turno?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="elimiarTurno = false">Cancelar</v-btn>
        <v-btn color="green" text @click="eliminarTurno">Aceptar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-navigation-drawer
    v-model="configCob"
    :hide-overlay="true"
    right
    absolute
    temporary
    width="350"
  >
    <v-toolbar flat height="50px" tile dark color="primary">
      <v-btn icon dark @click="configCob = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-toolbar-title>Configura la vista</v-toolbar-title>
    </v-toolbar>
    <div class="pa-4">
      <div class="font-weight-bold my-4">Dias de la semana a mostrar</div>
      <v-select v-model="weekday" :items="weekdays" dense outlined hide-details></v-select>
      <hr class="my-4" style="border-color: #ccc; width: 100%" />
      <div class="font-weight-bold my-4">Intervalos de hora</div>
      <v-slider
        v-model="intervalMinutes"
        :min="15"
        :max="60"
        :step="15"
        label="Cada x minutos"
        thumb-label="always"
      />
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import axios from '../config/axios'
import type { Ref } from 'vue'

// Interfaces
interface Turno {
  id_turno?: number
  id_paciente: number | null
  fecha: string
  hora: string
  estado: string
  id_consultorio: number | null
  id_tratamiento: number | null
  [key: string]: any
}

interface Evento {
  id_turno: number
  id_paciente: number
  id_consultorio: number
  id_tratamiento: number
  nombre_tratamiento: string
  name: string
  apellido_paciente: string
  duracion_tratamiento: number
  start: Date
  end: Date
  color: string
  colorDark: string | null
  colorLigth: string | null
  timed: boolean
  category: string
}

interface Consultorio {
  id_consultorio: number
  nombre: string
  tratamiento: Tratamiento[]
  displayText: string
}

interface Tratamiento {
  id_tratamiento: number
  nombre: string
  descripcion: string
  costo: number
  duracion: number
  color: string
}

interface ViewType {
  text: string
  value: string
}

interface WeekdayOption {
  text: string
  value: number[]
}

// Datos reactivos
const turnos: Ref<any[]> = ref([])
const intervalMinutes = ref(parseInt(localStorage.getItem('intervalMinutes') || '30'))
const type = ref(localStorage.getItem('defaultView') || 'day')
const today = ref(new Date().toISOString().slice(0, 10))
const weekday = ref(JSON.parse(localStorage.getItem('weekday') || '[1, 2, 3, 4, 5, 6, 0]'))
const value = ref(new Date())
const currentMonth = ref<number | null>(null)
const currentYear = ref<number | null>(null)
const picker = ref(
  new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
)
const events = ref<Evento[]>([])
const dialog = ref(false)

const dialogDia = ref(false)
const elimiarTurno = ref(false)
const configCob = ref(false)
const isEdit = ref(false)
const pacientes = ref<any[]>([])
const consultorios = ref<Consultorio[]>([])
const tratamientosDisponibles = ref<Tratamiento[]>([])
const tratamientoSeleccionado = ref({
  duracion: null as number | null,
  costo: null as number | null,
})
const nuevoTurno = ref<Turno>({
  id_paciente: null,
  fecha: '',
  hora: '',
  estado: 'pendiente',
  id_consultorio: null,
  id_tratamiento: null,
})
const menuFecha = ref(false)
const menuFechaFiltro = ref(false)
const filtroFecha = ref('')
const menuHora = ref(false)
const categories = ref<string[]>([])
const selectedDate = ref<string | null>(null)
const eventsOfDay = ref<Evento[]>([])

// Constantes
const types: ViewType[] = [
  { text: 'Mes', value: 'month' },
  { text: 'Semana', value: 'week' },
  { text: 'Día', value: 'day' },
  { text: 'Lista', value: 'list' },
]

const weekdays: WeekdayOption[] = [
  { text: 'Lun - Vie', value: [1, 2, 3, 4, 5] },
  { text: 'Lun - Sab', value: [1, 2, 3, 4, 5, 6] },
  { text: 'Lun - Dom', value: [1, 2, 3, 4, 5, 6, 0] },
]

// Computed
const calendarType = computed(() => {
  if (type.value === 'list') return 'month'
  return type.value === 'day' ? 'day' : type.value
})

const intervalCount = computed(() => {
  switch (intervalMinutes.value) {
    case 15:
      return 64
    case 30:
      return 32
    case 45:
      return 24
    case 60:
      return 16
    default:
      return 32
  }
})

const groupedEventsByDay = computed(() => {
  if (currentMonth.value === null || currentYear.value === null) return {}

  const grouped = events.value.reduce((acc: Record<string, Evento[]>, event) => {
    const eventDate = new Date(event.start)
    const eventMonth = eventDate.getUTCMonth()
    const eventYear = eventDate.getUTCFullYear()

    if (eventMonth === currentMonth.value && eventYear === currentYear.value) {
      const dateKey = `${eventYear}-${(eventMonth + 1).toString().padStart(2, '0')}-${eventDate
        .getUTCDate()
        .toString()
        .padStart(2, '0')}`

      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(event)
    }
    return acc
  }, {})

  // Ordenar las fechas
  return Object.keys(grouped)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .reduce(
      (sorted, key) => {
        sorted[key] = grouped[key]
        return sorted
      },
      {} as Record<string, Evento[]>,
    )
})

const horaFormateada = computed(() => {
  if (!nuevoTurno.value.hora) return ''
  return nuevoTurno.value.hora
})

const validarDatosTurno = computed(() => {
  return (
    !!nuevoTurno.value.id_paciente &&
    !!nuevoTurno.value.id_consultorio &&
    !!nuevoTurno.value.id_tratamiento &&
    !!nuevoTurno.value.fecha &&
    !!nuevoTurno.value.hora &&
    nuevoTurno.value.fecha.trim() !== '' &&
    nuevoTurno.value.hora.trim() !== ''
  )
})

// Métodos
const handleConfigCob = () => {
  configCob.value = true
}

const handleEliminarTurno = () => {
  elimiarTurno.value = true
}

const handleClickMore = ({ date }: { date: string }) => {
  const selectedDateObj = new Date(date)
  eventsOfDay.value = events.value.filter((event) => {
    const eventDate = event.start.toISOString().split('T')[0]
    return eventDate === selectedDateObj.toISOString().split('T')[0]
  })
  selectedDate.value = selectedDateObj.toLocaleDateString()
  dialogDia.value = true
}

const setToCurrentDate = () => {
  value.value = new Date().toISOString().split('T')[0]
  updateCategories()
  getEvents()
}

const updateCategories = () => {
  const selectedDate = value.value
  const consultoriosConTurnos = consultorios.value.filter((consultorio) =>
    events.value.some((event) => {
      const eventDate = new Date(event.start).toISOString().split('T')[0]
      return eventDate === selectedDate && event.category === consultorio.nombre
    }),
  )
  categories.value = consultoriosConTurnos.map((c) => c.nombre)
}

const formatHeaderDate = (date: string | Date) => {
  if (typeof date === 'string' && date.match(/^\d{4}-\d{2}$/)) {
    const [year, month] = date.split('-')
    date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1)
  }

  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'FECHA INVÁLIDA'
  }

  const monthName = new Intl.DateTimeFormat('es', { month: 'long' }).format(date)
  const yearValue = date.getFullYear()
  return `${monthName.toUpperCase()} ${yearValue}`
}

const cargarTurnos = async () => {
  try {
    const response = await axios.get('/turnos/calendario')
    turnos.value = response.data
  } catch (error) {
    console.error('Error al cargar turnos:', error)
  }
}

const getEvents = () => {
  events.value = turnos.value
    .map((turno) => {
      const fechaHoraInicio = new Date(`${turno.fecha}T${turno.hora}`)
      const duracion = turno.duracion_tratamiento
      const fechaHoraFin = new Date(fechaHoraInicio.getTime() + duracion * 60000)

      const colorDark = isValidHexColor(turno.color_tratamiento)
        ? darkenColor(turno.color_tratamiento, 0.6)
        : null
      const colorLigth = isValidHexColor(turno.color_tratamiento)
        ? lightenColor(turno.color_tratamiento, 0.4)
        : null

      const nombreConsultorio = turno.nombre_consultorio || 'Sin consultorio'

      return {
        id_turno: turno.id_turno,
        id_paciente: turno.id_paciente,
        id_consultorio: turno.id_consultorio,
        id_tratamiento: turno.id_tratamiento,
        nombre_tratamiento: turno.nombre_tratamiento,
        name: turno.nombre_paciente,
        apellido_paciente: turno.apellido_paciente,
        duracion_tratamiento: duracion,
        start: fechaHoraInicio,
        end: fechaHoraFin,
        color: turno.color_tratamiento,
        colorDark,
        colorLigth,
        timed: true,
        category: nombreConsultorio,
      }
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime())
}

const darkenColor = (hex: string, factor = 0.2): string => {
  if (!isValidHexColor(hex)) {
    console.warn('Color no válido:', hex)
    return hex
  }

  hex = hex.replace('#', '')

  if (hex.length === 8) {
    hex = hex.substring(0, 6)
  }
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  const darkerR = Math.floor(r * (1 - factor))
  const darkerG = Math.floor(g * (1 - factor))
  const darkerB = Math.floor(b * (1 - factor))

  const toHex = (value: number) => value.toString(16).padStart(2, '0')
  return `#${toHex(darkerR)}${toHex(darkerG)}${toHex(darkerB)}`
}

const lightenColor = (hex: string, factor = 0.2): string => {
  if (!isValidHexColor(hex)) {
    console.warn('Color no válido:', hex)
    return hex
  }

  hex = hex.replace('#', '')
  if (hex.length === 8) {
    hex = hex.substring(0, 6)
  }
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  const lighterR = Math.min(255, r + Math.floor((255 - r) * factor))
  const lighterG = Math.min(255, g + Math.floor((255 - g) * factor))
  const lighterB = Math.min(255, b + Math.floor((255 - b) * factor))

  const toHex = (value: number) => value.toString(16).padStart(2, '0')
  return `#${toHex(lighterR)}${toHex(lighterG)}${toHex(lighterB)}`
}

const isValidHexColor = (hex: string): boolean => {
  return /^#([A-Fa-f0-9]{6}([A-Fa-f0-9]{2})?|[A-Fa-f0-9]{3})$/.test(hex)
}

const onCalendarChange = ({ start }: { start: { date: string | Date } }) => {
  const date = new Date(start.date)
  if (isNaN(date.getTime())) {
    console.error('Fecha inválida recibida:', start.date)
    return
  }

  currentMonth.value = date.getUTCMonth()
  currentYear.value = date.getUTCFullYear()
  value.value = date.toISOString().split('T')[0]
  updateCategories()
  getEvents()
}

const getEventColor = (event: Evento) => {
  return event.colorLigth
}

const handleCreateTurno = () => {
  isEdit.value = false
  dialog.value = true
}

const showEvent = ({ event }: { event: Evento }) => {
  dialog.value = true
  isEdit.value = true

  nuevoTurno.value = {
    id_turno: event.id_turno,
    id_paciente: event.id_paciente,
    fecha: formatDate(event.start),
    hora: formatTime(event.start),
    estado: 'pendiente',
    id_consultorio: event.id_consultorio,
    id_tratamiento: event.id_tratamiento,
  }

  if (event.id_consultorio) {
    cargarTratamientosPorConsultorio(event.id_consultorio)
  }

  if (event.id_tratamiento) {
    actualizarDetallesTratamiento(event.id_tratamiento)
  }
}

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

const cargarPacientes = async () => {
  try {
    const response = await axios.get('/pacientes')
    pacientes.value = response.data
  } catch (error) {
    console.error('Error al cargar pacientes:', error)
  }
}

// const fetchConsultoriosyTratamientos = async () => {
//   try {
//     const response = await axios.get('/consultorios/tratamientos')
//     consultorios.value = response.data
//       .map((consultorio: any) => ({
//         id_consultorio: consultorio.id_consultorio,
//         nombre: consultorio.nombre_consultorio,
//         tratamiento: consultorio.id_tratamiento
//           ? [
//               {
//                 id_tratamiento: consultorio.id_tratamiento,
//                 nombre: consultorio.nombre_tratamiento,
//                 descripcion: consultorio.descripcion_tratamiento,
//                 costo: consultorio.costo_tratamiento,
//                 duracion: consultorio.duracion_tratamiento,
//                 color: consultorio.color_tratamiento,
//               },
//             ]
//           : [],
//         displayText: `${consultorio.nombre_consultorio} - ${
//           consultorio.id_tratamiento ? consultorio.nombre_tratamiento : 'Sin tratamiento'
//         }`,
//       }))
//       .sort((a, b) => a.id_consultorio - b.id_consultorio)
//   } catch (error) {
//     console.error('Error fetching consultorios and tratamientos:', error)
//   }
// }

const cargarTratamientosPorConsultorio = async (id_consultorio: number) => {
  try {
    const response = await axios.get(`/tratamientos/tratamientosconsul/${id_consultorio}`)
    tratamientosDisponibles.value = response.data || []

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

const guardarTurno = () => {
  if (isEdit.value) {
    updateTurno(nuevoTurno.value)
  } else {
    createTurno(nuevoTurno.value)
  }
}

const createTurno = async (turno: Turno) => {
  try {
    await axios.post('/turnos', turno)
    await cargarTurnos()
    dialog.value = false
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Error al crear el turno.'
    console.error(errorMessage)
  }
}

const updateTurno = async (turno: Turno) => {
  try {
    await axios.put(`/turnos/${turno.id_turno}`, turno)
    await cargarTurnos()
    dialog.value = false
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Error al actualizar el turno.'
    console.error(errorMessage)
  }
}

const eliminarTurno = async () => {
  if (nuevoTurno.value.id_turno) {
    try {
      await axios.delete(`/turnos/${nuevoTurno.value.id_turno}`)
      await cargarTurnos()
      dialog.value = false
    } catch (error) {
      console.error('Error al eliminar el turno:', error)
    }
  }
  elimiarTurno.value = false
}

const onDateChange = (newDate: string) => {
  picker.value = newDate
}

// Watchers
watch(intervalMinutes, (newVal) => {
  localStorage.setItem('intervalMinutes', newVal.toString())
})

watch(value, (newValue) => {
  localStorage.setItem('selectedDate', newValue)
  updateCategories()
})

watch(type, (newType) => {
  localStorage.setItem('defaultView', newType)
})

watch(weekday, (newWeekday) => {
  localStorage.setItem('weekday', JSON.stringify(newWeekday))
})

watch(dialog, (val) => {
  if (!val) {
    nuevoTurno.value = {
      id_paciente: null,
      fecha: '',
      hora: '',
      estado: 'pendiente',
      id_consultorio: null,
      id_tratamiento: null,
    }
  }
})

watch(turnos, () => {
  getEvents()
})

// Hooks del ciclo de vida
onMounted(async () => {
  const savedDate = localStorage.getItem('selectedDate')
  const savedWeekday = localStorage.getItem('weekday')
  const savedView = localStorage.getItem('defaultView')

  if (savedDate) {
    value.value = savedDate
  } else {
    value.value = new Date().toISOString().split('T')[0]
  }

  if (savedWeekday) {
    weekday.value = JSON.parse(savedWeekday)
  }

  if (savedView) {
    type.value = savedView
  }

  await fetchConsultoriosyTratamientos()
  await cargarTurnos()
  await cargarPacientes()
  getEvents()
  updateCategories()

  const date = new Date(value.value)
  currentMonth.value = date.getUTCMonth()
  currentYear.value = date.getUTCFullYear()
})
</script>

<style scoped>
.custom-tooltip {
  background-color: var(--tooltip-bg-color) !important;
  opacity: 1 !important;
}
</style>

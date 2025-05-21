<template>
  <div>
  <v-card-title class="d-flex align-center pe-2">
    <v-text-field
      v-model="search"
      density="compact"
      label="Buscar Paciente, Tratamiento o Estado"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      flat
      hide-details
      single-line
      class="mb-4"
   
    />
  </v-card-title>

    <VCard>
      <v-data-table
        :headers="headers"
        :items="userData"
        :loading="store.turnos.length === 0"
        item-value="id_turno"
        class="text-no-wrap"
        :search="search"
      >

   
        <!-- Celda personalizada para Paciente -->
        <template #item.paciente="{ item }">
          <div class="d-flex flex-column">
            <h6 class="text-h6 font-weight-medium user-list-name">
              {{ item.paciente }} 
            </h6>
          </div>
        </template>

        <!-- Celda personalizada para Estado -->
        <template #item.estado="{ item }">
          <VChip
            :color="item.estado === 'finalizado' ? 'success' : item.estado === 'pendiente' ? 'warning' : 'default'"
            size="small"
            class="text-capitalize"
          >
            {{ item.estado }}
          </VChip>
        </template>

        <!-- Celda personalizada para Tratamiento -->
        <template #item.tratamiento="{ item }">
          <div class="d-flex flex-column">
            <h6 class="text-h6 font-weight-medium user-list-name">
              {{ item.nombre_tratamiento }}
            </h6>
          </div>
        </template>


        <!-- Celda personalizada para Costo -->
        <template #item.costo="{ item }">
          <div class="d-flex flex-column">
            <h6 class="text-h6 font-weight-medium user-list-name">
              {{ item.costo_tratamiento }}
            </h6>
          </div>
        </template>

        <template #item.fecha="{ item }">
        <div class="d-flex flex-column">
          <h6 class="text-h6 font-weight-medium user-list-name">
            {{ item.fecha }}
          </h6>
        </div>
      </template>
      </v-data-table>
    </VCard>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useCalendarEventsStore } from '@/stores/calendarEventsStore'
import { headers } from '@/components/dashboard/headers/TurnosHeaders'
import { Turno } from '@/interfaces'

const store = useCalendarEventsStore()
const search = ref('')

onMounted(async () => {
  try {
    await store.fetchTurnos()
    console.log(store.turnos)
  } catch (error) {
    console.error('Error cargando turnos:', error)
  }
})


const customFilter = (value: any, search: string, item: any) => {
  // Si no hay búsqueda, mostramos todo
  if (!search) return true

  const searchTerm = search.toLowerCase()

  // Buscamos en paciente, tratamiento y estado
  return (
    (item.paciente && item.paciente.toLowerCase().includes(searchTerm)) ||
    (item.nombre_tratamiento && item.nombre_tratamiento.toLowerCase().includes(searchTerm)) ||
    (item.estado && item.estado.toLowerCase().includes(searchTerm))
  )
}

const userData = computed(() => 
  store.turnos.map(t => ({
    id_turno: t.id_turno,
    id_paciente: t.id_paciente,
    id_consultorio: t.id_consultorio,
    id_tratamiento: t.id_tratamiento,
    fecha: t.fecha,
    hora: t.hora,
    nombre_consultorio: t.nombre_consultorio,
    nombre_tratamiento: t.nombre_tratamiento,
    duracion_tratamiento: t.duracion_tratamiento,
    estado: t.estado,
    nombre_paciente: t.nombre_paciente,
    apellido_paciente: t.apellido_paciente,
    paciente: `${t.nombre_paciente} ${t.apellido_paciente}`, // 🔥 agregado esto
    costo_tratamiento: t.costo_tratamiento,
    color_tratamiento: t.color_tratamiento,
  }))
)

</script>

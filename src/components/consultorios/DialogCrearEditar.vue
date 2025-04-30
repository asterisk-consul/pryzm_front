<template>
  <v-card>
    <v-toolbar flat height="50px" tile dark color="primary">
      <v-btn icon dark @click="closeDialog">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>{{ isEdit ? 'Editar Consultorio' : 'Agregar Consultorio' }}</v-toolbar-title>
    </v-toolbar>
    <v-card-text
      :style="{
        height: 'calc(100vh - 50px)',
        backgroundColor: theme.global.current.value.colors.background,
        color: theme.global.current.value.colors['on-background'],
      }"
    >
      <!-- Campo para el nombre del consultorio -->
      <v-text-field v-model="nombreConsultorio" label="Nombre del Consultorio"></v-text-field>

      <!-- Selector de tratamientos (permite selección múltiple) -->
      <v-select
        v-model="selectedTratamientos"
        label="Tratamientos"
        :items="Tratamientos"
        item-title="nombre"
        item-value="id_tratamiento"
        multiple
        required
      >
        <template v-slot:selection="{ item }">
          <v-chip
            :color="item.raw.color || ''"
            closable
            @click:close="removeTratamiento(item.raw.id_tratamiento as number)"
          >
            {{ item.title }}
          </v-chip>
        </template>
        <!-- Slot para items en el dropdown -->
        <template v-slot:item="{ props, item }">
          <v-list-item
            v-bind="props"
            :title="item.raw.nombre"
            :prepend-avatar="item.raw.color || undefined"
            tile
            :style="{
              color: theme.global.current.value.colors['on-background'],
              backgroundColor: theme.global.current.value.colors.background,
              margin: '0 !important',
              minHeight: '36px',
            }"
          >
            <template v-slot:prepend>
              <v-avatar :color="item.raw.color || undefined" size="12" class="mr-2"></v-avatar>
            </template>
          </v-list-item>
        </template>
      </v-select>
    </v-card-text>
    <v-card-actions
      :style="{
        backgroundColor: theme.global.current.value.colors.background,
        color: theme.global.current.value.colors['on-background'],
      }"
    >
      <v-spacer></v-spacer>
      <v-btn
        text
        @click="closeDialog"
        :style="{
          color: theme.global.current.value.colors.error,
          backgroundColor: theme.global.current.value.colors['background-list'],
        }"
        >Cancelar</v-btn
      >
      <v-btn
        :style="{
          color: theme.global.current.value.colors.info,
          backgroundColor: theme.global.current.value.colors['background-list'],
        }"
        text
        @click="createConsultorio"
        >{{ isEdit ? 'Editar' : 'Guardar' }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTheme } from 'vuetify'
import type { Consultorio } from '@/interfaces/consultorioInterface'
import type { Tratamiento } from '@/interfaces/tratamientosInterface'

const theme = useTheme()

const props = defineProps<{
  isEdit: boolean
  consultorio?: Consultorio // Hacerlo opcional para modo creación
  Tratamientos: Tratamiento[]
}>()

const emit = defineEmits(['submit', 'close'])

// Datos del formulario
const nombreConsultorio = ref(props.consultorio?.nombre_consultorio || '')
const selectedTratamientos = ref<Tratamiento[]>(props.consultorio?.tratamientos || [])

// Preparar datos para enviar
const formData = computed(() => ({
  nombre_consultorio: nombreConsultorio.value,
  tratamientos: selectedTratamientos.value,
  ...(props.isEdit &&
    props.consultorio && {
      id_consultorio: props.consultorio.id_consultorio,
    }),
}))

const createConsultorio = () => {
  // console.log('Datos del formulario:', formData.value)
  emit('submit', formData.value)
}

const closeDialog = () => {
  emit('close')
}

const removeTratamiento = (id: number) => {
  selectedTratamientos.value = selectedTratamientos.value.filter((t) => t.id_tratamiento !== id)
}

const resetForm = () => {
  nombreConsultorio.value = ''
  selectedTratamientos.value = []
}

// Resetear al montar si no hay consultorio (modo creación)
if (!props.consultorio) {
  resetForm()
}

// Watcher para cuando cambia el modo (edición/creación)
watch(
  () => props.isEdit,
  (newVal) => {
    if (!newVal) {
      resetForm()
    }
  },
)

// Watcher para el consultorio (por si cambia)
watch(
  () => props.consultorio,
  (newVal) => {
    nombreConsultorio.value = newVal?.nombre_consultorio || ''
    selectedTratamientos.value = newVal?.tratamientos || []
  },
  { immediate: true },
)
</script>

<style scoped></style>

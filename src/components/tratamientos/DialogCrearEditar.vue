<template>
  <v-card
    :style="{
      color: theme.global.current.value.colors['on-surface'],
      backgroundColor: theme.global.current.value.colors.background,
    }"
  >
    <v-toolbar flat height="50px" tile dark color="primary">
      <v-btn icon dark @click="closeDialog">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>{{ isEdit ? 'Editar Tratamiento' : 'Agregar Tratamiento' }}</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-text-field v-model="nombre" label="Nombre del Tratamiento"></v-text-field>
      <v-text-field v-model="descripcion" label="Descripción"></v-text-field>
      <v-text-field v-model="costo" type="number" label="Precio"></v-text-field>
      <v-text-field
        v-model="duracion"
        type="number"
        label="Duración"
        suffix="minutos"
      ></v-text-field>
    </v-card-text>
    <span class="font-weight-bold ma-2 text-h6">Color:</span>
    <div class="d-flex justify-lg-space-around">
      <!-- Botones con colores predefinidos -->
      <v-btn
        v-for="(btnColor, index) in buttonColors"
        :key="index"
        small
        outlined
        :value="btnColor"
        :color="isColorSelected(btnColor) ? btnColor : '#989898'"
        @click="selectColor(btnColor)"
        class="d-flex justify-center align-center"
        style="padding: 10px 5px; position: relative; overflow: hidden"
        :style="{
          borderColor: isColorSelected(btnColor) ? btnColor : '#989898',
        }"
      >
        <div
          :style="{
            backgroundColor: btnColor,
            width: '90%',
            height: '60%',
            borderRadius: '0.3rem',
            aspectRatio: '16 / 9',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }"
        >
          <v-icon icon="mdi-palette" size="30"></v-icon>
        </div>
      </v-btn>

      <!-- Botón que abre el Color Picker -->
      <v-menu v-model="menu" :close-on-content-click="false" offset-y>
        <template v-slot:activator="{ props }">
          <v-btn
            small
            outlined
            :color="iconColor"
            class="d-flex justify-center align-center"
            style="padding: 10px 5px; position: relative; overflow: hidden"
            v-bind="props"
          >
            <v-icon icon="mdi-palette" size="30"></v-icon>
          </v-btn>
        </template>

        <!-- Contenido del menú -->
        <v-card>
          <v-card-text>
            <!-- Selector de color personalizado -->
            <v-color-picker
              v-model="selectedColor"
              mode="hexa"
              show-swatches
              swatches-max-height="200"
              @input="selectColor"
            ></v-color-picker>
          </v-card-text>
        </v-card>
      </v-menu>
    </div>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="red darken-1"
        :style="{
          color: theme.global.current.value.colors.info,
          backgroundColor: theme.global.current.value.colors['background-list'],
        }"
        text
        @click="closeDialog"
        >Cancelar</v-btn
      >
      <v-btn
        color="green darken-1"
        :style="{
          color: theme.global.current.value.colors.info,
          backgroundColor: theme.global.current.value.colors['background-list'],
        }"
        text
        @click="createTratamiento"
        >{{ isEdit ? 'Editar' : 'Guardar' }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { defineEmits, ref, toRefs, computed, watch } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()

const props = defineProps({
  isEdit: Boolean,
  tratamiento: Object,
})

const { isEdit, tratamiento } = toRefs(props)

const nombre = ref(tratamiento.value?.nombre || '')
const descripcion = ref(tratamiento.value?.descripcion || '')
const costo = ref(tratamiento.value?.costo || 0)
const duracion = ref(tratamiento.value?.duracion || 0)
const selectedColor = ref(tratamiento.value?.color || '#989898')
const menu = ref(false)
const buttonColors = ref(['#8c57ff', '#0d9394', '#ffb400', '#ff4c51', '#16b1ff'])

const emit = defineEmits(['create-tratamiento', 'close-dialog'])

const selectColor = (color: string) => {
  selectedColor.value = color // Actualiza el color seleccionado
  menu.value = false // Cierra el menú después de seleccionar un color
}
// Verifica si el color está seleccionado
const isColorSelected = (btnColor) => {
  return selectedColor.value === btnColor || !buttonColors.value.includes(selectedColor.value)
}
const iconColor = computed(() => {
  // If selected color exists and isn't in predefined colors, use selected color
  if (selectedColor.value && !buttonColors.value.includes(selectedColor.value)) {
    return selectedColor.value
  }
  // Otherwise use default gray color
  return '#989898'
})

// const openColorPicker = () => {
//   colorPicker.value?.click()
// }

const formData = computed(() => ({
  id_tratamiento: tratamiento.value?.id_tratamiento,
  nombre: nombre.value,
  descripcion: descripcion.value,
  costo: costo.value,
  duracion: duracion.value,
  color: selectedColor.value,
}))

const closeDialog = () => {
  emit('close-dialog')
}
const createTratamiento = () => {
  console.log('Datos del formulario:', formData.value)
  emit('create-tratamiento', formData.value)
}

const resetForm = () => {
  nombre.value = ''
  descripcion.value = ''
  costo.value = 0
  duracion.value = 0
  selectedColor.value = '#989898'
}

if (!props.tratamiento) {
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
  () => props.tratamiento,
  (newVal) => {
    nombre.value = newVal?.nombre || ''
    descripcion.value = newVal?.descripcion || ''
    costo.value = newVal?.costo || 0
    duracion.value = newVal?.duracion || 0
    selectedColor.value = newVal?.color || '#989898'
  },
  { immediate: true },
)
</script>

<style scoped></style>

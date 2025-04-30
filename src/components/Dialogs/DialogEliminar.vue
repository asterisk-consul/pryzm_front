<template>
  <v-dialog
    v-model="dialog"
    :max-width="maxWidth"
    :persistent="persistent"
    :scrollable="scrollable"
    :transition="transition"
  >
    <v-card
      :style="{
        color: theme.global.current.value.colors['on-surface'],
        backgroundColor: theme.global.current.value.colors.background,
      }"
    >
      <v-toolbar flat height="50px" tile dark :color="headerColor">
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <p class="text-h6 font-weight-bold ma-4">
          {{
            message ||
            `¿Estás seguro de que deseas ${actionType} ${entityName}${entityDisplayName ? ` "${entityDisplayName}"` : ''}?`
          }}
        </p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :color="cancelColor"
          :style="{
            color: theme.global.current.value.colors.info,
            backgroundColor: theme.global.current.value.colors['background-list'],
          }"
          text
          @click="close"
        >
          {{ cancelText }}
        </v-btn>
        <v-btn
          :color="confirmColor"
          :style="{
            color: theme.global.current.value.colors.error,
            backgroundColor: theme.global.current.value.colors['background-list'],
          }"
          text
          @click="confirm"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'
import { computed } from 'vue'
// import type { Consultorio, Paciente, Turno } from '@/interfaces'

const theme = useTheme()

// type Entity = Consultorio | Paciente | Turno // Todas tus entidades posibles

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    entity: object
    entityName?: string
    title?: string
    message?: string
    actionType?: string
    cancelText?: string
    confirmText?: string
    maxWidth?: string
    persistent?: boolean
    scrollable?: boolean
    transition?: string
    headerColor?: string
    cancelColor?: string
    confirmColor?: string
    nameFields?: string[]
  }>(),
  {
    entityName: 'el elemento',
    title: 'Confirmar acción',
    actionType: 'eliminar',
    cancelText: 'Cancelar',
    confirmText: 'Confirmar',
    maxWidth: '500px',
    persistent: true,
    scrollable: false,
    transition: 'dialog-transition',
    headerColor: 'primary',
    cancelColor: 'blue darken-1',
    confirmColor: 'red darken-1',
    nameFields: () => [
      'nombre',
      'name',
      'descripcion',
      'displayText',
      'title',
      'nombre_consultorio',
      'nombre_tratamiento',
    ],
  },
)

const emit = defineEmits(['update:modelValue', 'confirm', 'close'])

const entityDisplayName = computed(() => {
  if (!props.entity) return ''

  const entity = props.entity as Record<string, unknown>

  for (const field of props.nameFields) {
    const value = entity[field]
    if (typeof value === 'string') return value
  }

  return ''
})

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const close = () => {
  dialog.value = false
  emit('close')
}

const confirm = () => {
  emit('confirm')
  close()
}
</script>

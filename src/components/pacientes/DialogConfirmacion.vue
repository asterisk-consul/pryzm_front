<template>
  <v-dialog v-model="dialog" max-width="fit-content">
    <v-card class="pa-8">
      <v-card-title class="text-h5 mt-2 mb-10">
        ¿ Estas seguro de eliminar a {{ paciente?.nombre }} con sus turnos ?
      </v-card-title>
      <v-card-actions>
        <v-btn
          :style="{
            color: theme.global.current.value.colors.info,
            marginRight: '15px',
            fontWeight: 'bold',
          }"
          variant="tonal"
          @click="confirmar"
        >
          Sí
        </v-btn>
        <v-btn
          :style="{ color: theme.global.current.value.colors.error, fontWeight: 'bold' }"
          variant="tonal"
          @click="cancelar"
        >
          No
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { useTheme } from 'vuetify'
import type { Paciente } from '@/interfaces'
const emit = defineEmits(['confirmar', 'cancelar'])

const theme = useTheme()

const props = defineProps<{
  dialog: boolean
  paciente?: Paciente | null
}>()

const { dialog, paciente } = toRefs(props)

const confirmar = () => {
  emit('confirmar')
}

const cancelar = () => {
  emit('cancelar')
}
</script>

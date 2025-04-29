<template>
  <v-navigation-drawer
    v-model="dialog"
    :hide-overlay="true"
    absolute
    temporary
    location="right"
    expand-on-hover
    close-delay="100"
    scrim="#00000000"
    width="500"
    transition="slide-x-reverse-transition"
    height="100vh"
    :style="{ overflow: 'visible', zIndex: '2000', top: '0', height: '100%' }"
  >
    <v-toolbar
      :style="{
        backgroundColor: theme.global.current.value.colors.background,
        borderBottom: `1px solid ${theme.global.current.value.colors.border}`,
        paddingLeft: '15px',
        paddingTop: '5px',
        height: '70px',
        width: '100%',
      }"
    >
      <div class="d-flex align-center justify-lg-space-around" style="width: 100%">
        <div class="mr-1">
          <span
            :style="{ color: theme.global.current.value.colors['on-background'], fontSize: '20px' }"
            >Configurar calendario</span
          >
          <br />
          <span
            :style="{ color: theme.global.current.value.colors['on-background'], fontSize: '14px' }"
            >Personalizar y Previsualizar en Tiempo Real</span
          >
        </div>
        <v-btn icon dark @click="cancelar">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </v-toolbar>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field
          v-model="paciente.nombre"
          label="Nombre"
          :rules="[rules.required]"
          required
        ></v-text-field>
        <v-text-field
          v-model="paciente.apellido"
          label="Apellido"
          :rules="[rules.required]"
          required
        ></v-text-field>
        <v-text-field
          v-model="paciente.fecha_nacimiento"
          label="Fecha de Nacimiento"
          type="date"
          :rules="[rules.required]"
          required
        ></v-text-field>
        <v-radio-group v-model="paciente.genero" row label="Género" :rules="[rules.required]">
          <v-radio label="Masculino" value="M"></v-radio>
          <v-radio label="Femenino" value="F"></v-radio>
        </v-radio-group>
        <v-text-field
          v-model="paciente.telefono"
          label="Teléfono"
          type="tel"
          :rules="[rules.required]"
          required
        ></v-text-field>
        <v-text-field
          v-model="paciente.email"
          label="Correo Electrónico"
          type="email"
          :rules="[rules.required]"
          required
        ></v-text-field>
        <v-text-field
          v-model="paciente.direccion"
          label="Dirección"
          :rules="[rules.required]"
          required
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red" type="submit" @click="cancelar">Cancelar</v-btn>
      <v-btn color="green" text @click="guardarPaciente">{{
        isEdit ? 'Modificar' : 'Agregar'
      }}</v-btn>
    </v-card-actions>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'
import { defineProps, defineEmits } from 'vue'
import type { Paciente } from '@/interfaces'
import { useTheme } from 'vuetify'
const theme = useTheme()

// Props y eventos
const emit = defineEmits(['paciente-editado', 'paciente-agregado', 'close-dialog'])

const props = defineProps<{
  isEdit: boolean // Determina si estamos editando o agregando un paciente
  pacienteEditar?: Paciente | null // Información del paciente a editar
  dialog: boolean
}>()

const { isEdit, dialog } = toRefs(props)

const paciente = ref({
  nombre: '',
  apellido: '',
  fecha_nacimiento: '',
  genero: '',
  telefono: '',
  email: '',
  direccion: '',
})

// Si estamos en modo edición, cargamos los datos del paciente a editar
watch(
  () => props.pacienteEditar,
  (newPaciente) => {
    if (newPaciente) {
      paciente.value = { ...newPaciente } // Cargar datos del paciente si estamos en modo edición
    } else {
      paciente.value = {
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        genero: '',
        telefono: '',
        email: '',
        direccion: '',
      } // Limpiar formulario si no hay datos (agregar paciente)
    }
  },
  { immediate: true },
)

const valid = ref(true)

const rules = {
  required: (value: boolean) => !!value || 'Campo requerido',
}

// Función para cancelar la operación
const cancelar = () => {
  emit('close-dialog') // Emitir evento para cerrar el diálogo
}

const guardarPaciente = () => {
  if (props.isEdit) {
    emit('paciente-editado', paciente.value) // Emitir evento de paciente editado
  } else {
    emit('paciente-agregado', paciente.value) // Emitir evento de paciente agregado
  }
}
</script>

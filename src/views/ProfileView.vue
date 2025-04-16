<template>
  <v-row justify="center">
    <v-col md="6" sm="6">
      <v-card
        :style="{
          background: theme.global.current.value.colors.background,
          color: theme.global.current.value.colors['on-background'],
          border: `1px solid ${theme.global.current.value.colors['border']}`,
        }"
        class="pa-5"
      >
        <v-img
          src="https://randomuser.me/api/portraits/men/1.jpg"
          class="mx-auto"
          max-width="150"
          max-height="150"
          alt="User Image"
          rounded="circle"
        />

        <v-card-title> Nombre: {{ user.nombre || 'Usuario no disponible' }} </v-card-title>
        <v-card-text>
          <h2>{{ user.email || 'Correo no disponible' }}</h2>
          <h4>{{ user.telefono || 'Teléfono no disponible' }}</h4>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()

const user = ref({
  nombre: '',
  email: '',
  telefono: '',
})

onMounted(() => {
  // Intenta obtener los datos del sessionStorage
  const sessionData = sessionStorage.getItem('session')
  if (sessionData) {
    try {
      const parsedData = JSON.parse(sessionData)
      user.value = {
        nombre: parsedData.nombre || 'Usuario no disponible',
        email: parsedData.email || 'Correo no disponible',
        telefono: parsedData.telefono || 'Teléfono no disponible', // Asignación de telefono
      }
    } catch (error) {
      console.error('Error al parsear sessionStorage: ', error)
    }
  } else {
    console.warn('No se encontró información en sessionStorage.')
  }
})
</script>

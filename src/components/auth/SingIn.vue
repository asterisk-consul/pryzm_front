<template>
  <v-container>
    <MyAlerts v-model:alert="alert" :timeout="3000" />

    <v-card
      class="rounded"
      :style="{
        backgroundColor: theme.global.current.value.colors.surface,
        color: theme.global.current.value.colors['on-background'] /* Y lo mismo con textColor */,
        height: 'auto',
        width: '450px' /* Limita el ancho en pantallas grandes */,
        margin: '0 auto',
        display: 'grid',
        justifyContent: 'center',
        alignContent: 'center',
        gap: '2rem',
        padding: '2rem 1.5rem',
      }"
    >
      <v-card-title class="text-h5">Bienvenido a GestionApp 👋</v-card-title>
      <v-card-subtitle>Por favor ingresa tu cuenta y comienza la aventura</v-card-subtitle>
      <v-card-text class="d-flex flex-column justify-lg-space-evenly">
        <v-form ref="signinForm" @submit.prevent="signin" lazy-validation>
          <!-- Campo Email -->
          <v-text-field
            variant="outlined"
            clearable
            label="E-mail"
            class="w-100"
            density="compact"
            :rules="emailRules"
            v-model="user.email"
          />

          <!-- Campo Contraseña -->
          <v-text-field
            v-model="user.password"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            :rules="passwordRules"
            density="compact"
            label="Password"
            variant="outlined"
            @click:append-inner="visible = !visible"
          />
          <v-row class="d-flex justify-space-between align-center">
            <v-checkbox
              label="Recordarme"
              class="mr-2 custom-label"
              hide-details
              :style="{ color: theme.global.current.value.colors.secondary }"
            />
            <router-link
              :style="{
                color: theme.global.current.value.colors.primary,
                textDecoration: 'none',
                marginLeft: '10px',
                display: 'flex',
                alignItems: 'center',
              }"
              to="/forgot-password"
            >
              ¿Olvidaste tu contraseña?
            </router-link>
          </v-row>

          <v-btn color="primary" block class="primary mt-3" type="submit">Iniciar Sesión </v-btn>
        </v-form>
        <p class="text-center mt-8">
          No tienes una cuenta?
          <router-link
            :style="{
              color: theme.global.current.value.colors.primary,
              textDecoration: 'none',
            }"
            to="/createuser"
            >Registrate</router-link
          >
        </p>
      </v-card-text>
    </v-card>

    <!-- Componente de alerta -->
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useTheme } from 'vuetify'
import { emailRules, passwordRules } from '@/utils/validationRules'
import MyAlerts from '@/components/Alertas/MyAlerts.vue'
import axiosInstance from '@/config/axios'
import { isAxiosError } from 'axios'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

// Importar las interfaces de autenticación
import type { User, Alert } from '@/interfaces'

const theme = useTheme()

const visible = ref(false)

// Referencias a la forma y datos del usuario
const signinForm = ref<{ validate: () => boolean } | null>(null)
const user = ref<User>({
  email: '',
  password: '',
})
const alert = ref<Alert>({
  show: false,
  type: 'info',
  message: '',
})

const { login } = useAuth()
const router = useRouter() // Instancia del router para la redirección

// Método de inicio de sesión
const signin = async () => {
  const valid = signinForm.value?.validate() // Validación del formulario
  if (valid) {
    try {
      const res = await axiosInstance.post('/signin', user.value)

      if (res.data.NotFound) {
        alert.value = {
          show: true,
          type: 'error',
          message: 'Usuario no encontrado.',
        }
      } else {
        console.log(res.data)
        // Llamo al login
        login(res.data)

        router.push('/home')
        alert.value = {
          show: true,
          type: 'success',
          message: 'Bienvenido',
        }
      }
    } catch (error) {
      // Verificamos si es un error de Axios
      if (isAxiosError(error)) {
        alert.value = {
          show: true,
          type: 'error',
          message: error.response?.data?.message || 'Error en la solicitud',
        }
      } else {
        // Si no es un error de Axios (ej: error de red, sintaxis, etc.)
        alert.value = {
          show: true,
          type: 'error',
          message: 'Ocurrió un error inesperado',
        }
      }
    }
  }
}
</script>

<style>
.custom-label .v-label {
  font-size: 0.9rem;
}
@media (max-width: 600px) {
  .custom-label .v-label {
    font-size: 0.8rem; /* Texto más pequeño en móvil */
  }

  .v-card {
    padding: 1rem !important; /* Reduce padding */
    gap: 1rem !important;
  }

  .v-btn {
    font-size: 0.9rem; /* Hace que el botón sea más pequeño */
  }
}
</style>

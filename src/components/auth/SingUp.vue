<template>
  <v-container>
    <MyAlerts v-model:alert="alert" :timeout="3000" />
    <v-card
      :style="{
        backgroundColor: theme.global.current.value.colors.surface,
        color: theme.global.current.value.colors['on-background'],
        overflow: 'auto',
        width: '450px' /* Limita el ancho en pantallas grandes */,
        margin: '0 auto',
        display: 'grid',
        justifyContent: 'center',
        alignContent: 'center',
        padding: '2rem',
      }"
    >
      <v-card-title class="text-h5">La aventura empieza aquí 🚀</v-card-title>
      <v-card-subtitle class="text-subtitle-1">
        ¡Haz que la gestión de tus aplicaciones sea fácil y divertida!
      </v-card-subtitle>

      <v-card-text>
        <v-form class="ma-3" @submit.prevent="signup" ref="signupForm">
          <!-- Campos de entrada -->
          <BaseInput
            v-for="(field, index) in fields"
            :key="index"
            :label="field.label"
            :icon="field.icon"
            :rules="field.rules"
            :model-value="user[field.name]"
            @update:model-value="(value) => (user[field.name] = value)"
            variant="outlined"
          />
          <v-text-field
            v-model="user.password"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            :rules="passwordRules"
            prepend-inner-icon="mdi-lock"
            density="compact"
            label="Password"
            variant="outlined"
            @click:append-inner="visible = !visible"
          />

          <v-btn block color="primary" class="mt-3" type="submit">Crear cuenta</v-btn>
          <p class="text-center mt-8">
            ¿Ya tienes una cuenta?
            <router-link
              :style="{
                color: theme.global.current.value.colors.primary,
                textDecoration: 'none',
              }"
              to="/"
              >Iniciar sesión</router-link
            >
          </p>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import MyAlerts from '../Alertas/MyAlerts.vue'
import BaseInput from './form/BaseInput.vue'
import { signupFields } from './form/logic/formSingUp'
import axios from 'axios'
import { useTheme } from 'vuetify'
import { passwordRules } from '../../utils/validationRules'

const visible = ref(false)

const theme = useTheme()

// Datos del usuario
const user = ref({
  nombre: '',
  email: '',
  telefono: '',
  ciudad: '',
  direccion: '',
  pais: '',
  password: '',
  rol_id: 2,
})

const fields = signupFields // Definición de campos
const alert = ref({
  show: false,
  type: '',
  message: '',
})

// Referencia al formulario
const form = ref()

// Método para registrar usuario
const signup = async () => {
  if (!form.value) return

  const { valid } = await form.value.validate() // Asegurar validación

  if (!valid) {
    alert.value = {
      show: true,
      type: 'error',
      message: 'Por favor complete todos los campos correctamente.',
    }
    return
  }

  try {
    await axios.post('/signup', user.value)
    form.value.reset()
    alert.value = {
      show: true,
      type: 'success',
      message: 'Registro exitoso!',
    }
  } catch (err) {
    alert.value = {
      show: true,
      type: 'error',
      message: 'Ocurrió un error en el registro: ' + err,
    }
  }
}
</script>

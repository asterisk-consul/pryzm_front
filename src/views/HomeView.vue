<template>
  <v-row justify="center" class="text-center">
    <v-col
      md="8"
      :style="{
        color: theme.global.current.value.colors['on-background'],
        background: theme.global.current.value.colors.background,
      }"
    >
      <h1>Bienvenido a Esthelume</h1>
      <p class="subheading">
        Tu solución avanzada para la gestión de citas y servicios en clínicas de estética.
      </p>

      <v-card
        class="mt-5"
        :style="{
          color: theme.global.current.value.colors['on-background'],
          background: theme.global.current.value.colors.background,
          border: `1px solid ${theme.global.current.value.colors['border']}`,
        }"
      >
        <v-card-title>¿Qué deseas hacer hoy?</v-card-title>
        <v-card-text>
          <v-btn color="primary" block class="mt-3" @click="navigateTo('turnos')"
            >Gestionar Citas</v-btn
          >
          <v-btn color="secondary" block class="mt-3" @click="navigateTo('notifi')"
            >Ver Notificaciones</v-btn
          >
          <v-btn color="info" block class="mt-3" @click="navigateTo('profile')"
            >Gestionar Perfil</v-btn
          >
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

const theme = useTheme()

const router = useRouter()
const navigateTo = (route: string) => {
  router.push({ name: route })
}
</script>

<style scoped>
.home-view {
  padding: 20px;
}

.subheading {
  font-size: 1.2rem;
  margin-bottom: 20px;
}
</style>

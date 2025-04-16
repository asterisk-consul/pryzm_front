<template>
  <v-row class="background">
    <v-col md="12" sm="6">
      <SingIn v-if="suForm" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { Ref, ref, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import SingIn from '../components/auth/SingIn.vue'

const theme = useTheme()
const suForm: Ref<boolean> = ref(true)

// Función para alternar el tema y guardarlo en localStorage
// function toggleTheme() {
//   const newTheme = theme.global.current.value.dark ? 'light' : 'dark'
//   theme.global.name.value = newTheme
//   localStorage.setItem('theme', newTheme) // Guardar en localStorage
// }

// Al montar el componente, recuperar el tema de localStorage
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    theme.global.name.value = savedTheme
  }
})
</script>

<style scoped>
.background {
  margin: 0;
  background: rgb(107, 89, 214);
  background: radial-gradient(
    circle at 50% 100%,
    rgba(107, 89, 214, 1) 0%,
    rgba(73, 62, 136, 1) 27%,
    rgba(63, 54, 114, 1) 52%,
    rgba(54, 47, 94, 1) 73%,
    rgba(40, 36, 61, 1) 100%
  );
  min-height: 100vh; /* Altura mínima del viewport */
  width: 100vw; /* Ancho completo */
  display: flex;
  justify-content: center; /* Centrado horizontal */
  align-items: center; /* Centrado vertical */
}
</style>

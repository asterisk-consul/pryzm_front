<template>
  <v-app-bar :style="navbarStyle" app dark elevation="0">
    <!-- Barra de búsqueda -->
    <v-text-field
      :style="{
        width: '50px !important', // Ajusta el tamaño que quieras
        minWidth: 'unset', // Evita restricciones de Vuetify
      }"
      class="small-text-field"
      append-inner-icon="mdi-magnify"
      density="compact"
      label="Search templates"
      variant="outlined"
      hide-details
    ></v-text-field>

    <v-spacer></v-spacer>

    <!-- Iconos a la derecha -->
    <v-btn icon>
      <v-icon>mdi-translate</v-icon>
    </v-btn>

    <TogleTheme />

    <v-btn icon>
      <v-icon>mdi-star-outline</v-icon>
    </v-btn>
    <v-btn icon>
      <v-badge dot color="red">
        <v-icon>mdi-bell-outline</v-icon>
      </v-badge>
    </v-btn>

    <!-- Avatar de usuario -->
    <v-avatar size="36">
      <v-img src="https://randomuser.me/api/portraits/men/1.jpg"></v-img>
    </v-avatar>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import TogleTheme from './TogleTheme.vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const isScrolled = ref(false)

// Detecta el scroll y actualiza la variable
const onScroll = () => {
  isScrolled.value = window.scrollY > 10
}

// Computed property para aplicar estilos dinámicos
const navbarStyle = computed(() => ({
  width: isScrolled.value ? '93vw' : '95vw',
  margin: isScrolled.value ? '0 0.7rem' : '0',
  border: isScrolled.value ? `1px solid ${theme.global.current.value.colors.border}` : 'none',
  borderBottomLeftRadius: isScrolled.value ? '16px' : '0px',
  borderBottomRightRadius: isScrolled.value ? '16px' : '0px',
  transition: 'all 0.3s ease-in-out',
  padding: '0 1rem',
  color: theme.global.current.value.colors['on-background'],
  backgroundColor: theme.global.current.value.colors.background,
}))

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.small-text-field {
  max-width: 150px !important;
  min-width: 50px !important;
  width: 100px !important;
}
</style>

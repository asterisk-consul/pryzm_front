<template>
  <v-app
    :theme="themeStore.currentTheme"
    :style="{
      backgroundColor: theme.global.current.value.colors.background,
      color: theme.global.current.value.colors['on-background'],
    }"
  >
    <!-- Mostrar NavBar solo si hay sesión activa -->
    <NavBar v-if="isAuthenticated" />
    <TopBar v-if="isAuthenticated" />

    <!-- Contenido principal -->
    <v-main class="background">
      <transition name="fade">
        <router-view />
      </transition>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import NavBar from './components/sidebar/NavBar.vue'
import { useAuth } from './composables/useAuth'
import TopBar from './components/TopBar/TopBar.vue'
import { useTheme } from 'vuetify'
import { useThemeStore } from '@/stores/themeStore'

const theme = useTheme()
const themeStore = useThemeStore()

const { isAuthenticated } = useAuth()
</script>

<style>
body {
  font-family: 'Roboto Flex', sans-serif;
}
</style>

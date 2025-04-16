<template>
  <v-menu v-model="menu" open-on-click offset-y>
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-icon>{{ selectedThemeIcon }}</v-icon>
      </v-btn>
    </template>

    <v-list
      class="mx-auto rounded pa-0"
      width="150"
      max-width="200"
      :style="{
        backgroundColor: theme.global.current.value.colors.surface,
        color: theme.global.current.value.colors['on-background'],
      }"
    >
      <v-list-item
        v-for="option in themeOptions"
        :key="option.value"
        @click="setTheme(option.value)"
        :style="{
          backgroundColor:
            selectedTheme === option.value
              ? theme.global.current.value.colors['background-list']
              : 'transparent',
          color:
            selectedTheme === option.value
              ? theme.global.current.value.colors.primary
              : theme.global.current.value.colors['on-background'],
          borderRadius: '4px',
        }"
      >
        <v-list-item-title>
          <v-icon>{{ option.icon }}</v-icon> {{ option.label }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import { useThemeStore } from '@/stores/themeStore' // Importa el store

const menu = ref(false)
const theme = useTheme()
const themeStore = useThemeStore()

// Opciones de tema (pueden venir del store si prefieres centralizarlas)
const themeOptions = [
  { label: 'Light', value: 'light', icon: 'mdi-weather-sunny' },
  { label: 'Dark', value: 'dark', icon: 'mdi-weather-night' },
  { label: 'Sistema', value: 'system', icon: 'mdi-laptop' },
]

// Tema seleccionado (reactivo desde el store)
const selectedTheme = computed(() => themeStore.selectedTheme)

// Cambiar tema
const setTheme = (newTheme: string) => {
  themeStore.setTheme(newTheme)
  menu.value = false
}

// Ícono según tema actual
const selectedThemeIcon = computed(() => {
  return themeOptions.find((option) => option.value === selectedTheme.value)?.icon || 'mdi-laptop'
})
</script>

<style scoped></style>

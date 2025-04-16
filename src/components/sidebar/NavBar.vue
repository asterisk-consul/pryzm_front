<template>
  <v-navigation-drawer
    v-model="drawer"
    expand-on-hover
    rail
    :mini-variant="isMini"
    @mouseenter="isMini = false"
    @mouseleave="isMini = true"
    :style="{
      backgroundColor: theme.global.current.value.colors.background,
      color: theme.global.current.value.colors['on-background'],
      borderRight: `1px solid ${theme.global.current.value.colors.border}`,
    }"
  >
    <v-list class="mt-10" nav>
      <v-list-item
        v-for="(item, i) in menuItems"
        :key="i"
        :to="item.to"
        :value="item"
        :prepend-icon="item.icon"
        :title="item.title"
        exact
      >
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <div class="pa-2">
        <transition name="fade">
          <v-btn block @click="handleClick">
            <span v-if="isMini"><v-icon color="primary">mdi-logout</v-icon></span>
            <span v-else>Logout</span>
          </v-btn>
        </transition>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getMenuItems } from './logic/menuItems.ts'
import { useAuth } from '../../composables/useAuth.ts'
import { useTheme } from 'vuetify'

const theme = useTheme()

const { logout } = useAuth()

// define var reactivas
const menuItems = ref(getMenuItems())

const router = useRouter()

const drawer = ref(true) // Controla la apertura/cierre del drawer
const isMini = ref(true) // Controla si el drawer está en modo mini

// Logout funcion
const handleClick = () => {
  logout()
  router.push('/') // Redirect to login or main page
}
</script>

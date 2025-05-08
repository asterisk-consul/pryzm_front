<template>
  <v-row :class="backgroundClass">
    <v-col md="12" sm="6">
      <SingIn v-if="suForm" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import type { Ref } from 'vue'
import { useTheme } from 'vuetify'
import SingIn from '../components/auth/SingIn.vue'

const theme = useTheme()
const suForm: Ref<boolean> = ref(true)

// Clase dinámica según el tema
const backgroundClass = computed(() =>
  theme.global.current.value.dark ? 'background-dark' : 'background-light',
)

// Recuperar tema guardado
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    theme.global.name.value = savedTheme
  }
})
</script>

<style scoped>
.background-dark {
  margin: 0;
  background: radial-gradient(
    circle at 50% 100%,
    rgba(107, 89, 214, 1) 0%,
    rgba(73, 62, 136, 1) 27%,
    rgba(63, 54, 114, 1) 52%,
    rgba(54, 47, 94, 1) 73%,
    rgba(40, 36, 61, 1) 100%
  );
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.background-light {
  margin: 0;
  background: radial-gradient(
    circle at 50% 100%,
    #eeeeee 0%,
    #cccccc 30%,
    #bbbbbb 60%,
    #999999 100%
  );
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

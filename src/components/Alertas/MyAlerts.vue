<template>
  <v-expand-x-transition>
    <v-snackbar
      transition="scale-transition"
      v-model="alert.show"
      :color="alert.type"
      :timeout="alert.timeout || timeout"
      :location="alert.position || 'top'"
      class="d-flex justify-center notification-container"
      @mouseenter="pauseTimeout"
      @mouseleave="resumeTimeout"
    >
      <div class="d-flex flex-column w-100">
        <!-- Progress Bar -->
        <v-progress-linear
          v-if="showProgressBar"
          :model-value="progressValue"
          :color="progressColor"
          height="4"
          class="progress-bar"
          :indeterminate="alert.timeout === 0"
        ></v-progress-linear>

        <!-- Contenido -->
        <div class="d-flex align-center content">
          <v-icon v-if="alert.icon" :icon="alert.icon" class="mr-2"></v-icon>
          <div>
            <strong v-if="alert.title">{{ alert.title }}</strong>
            {{ alert.message }}
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <template v-slot:actions>
        <v-btn
          v-if="!alert.actions"
          append-icon="mdi-close"
          size="xs"
          @click="cerrarSnackbar"
        ></v-btn>

        <template v-for="(action, index) in alert.actions" :key="index">
          <v-btn
            :color="action.color || 'white'"
            size="xs"
            @click="handleAction(action)"
            class="ml-2"
          >
            {{ action.text }}
          </v-btn>
        </template>
      </template>
    </v-snackbar>
  </v-expand-x-transition>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue'
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

interface AlertAction {
  text: string
  color?: string
  handler: () => void
}

interface Alert {
  show: boolean
  type: 'success' | 'error' | 'warning' | 'info' | string
  message: string
  title?: string
  icon?: string
  timeout?: number
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center'
  actions?: AlertAction[]
  showProgress?: boolean
  pauseOnHover?: boolean
}

const props = withDefaults(
  defineProps<{
    alert: Alert
    timeout?: number
  }>(),
  {
    timeout: 3000,
  },
)

const { alert } = toRefs(props)

const emit = defineEmits<{
  (e: 'update:alert', alert: Alert): void
}>()

// Control de progreso
const progressValue = ref(100)
const remainingTime = ref(props.alert.timeout || props.timeout)
const startTime = ref(Date.now())
const timer = ref<ReturnType<typeof setInterval>>()

const isPaused = ref(false)

const showProgressBar = computed(() => {
  return props.alert.showProgress ?? true
})

const progressColor = computed(() => {
  return props.alert.type === 'error'
    ? 'red-darken-2'
    : props.alert.type === 'warning'
      ? 'amber-darken-2'
      : props.alert.type === 'info'
        ? 'blue-darken-2'
        : 'green-darken-2'
})

// Iniciar temporizador
const startTimer = () => {
  if (props.alert.timeout === 0) return

  clearInterval(timer.value)
  startTime.value = Date.now()
  remainingTime.value = props.alert.timeout || props.timeout

  timer.value = setInterval(() => {
    if (!isPaused.value) {
      const elapsed = Date.now() - startTime.value
      remainingTime.value = (props.alert.timeout || props.timeout) - elapsed
      progressValue.value = (remainingTime.value / (props.alert.timeout || props.timeout)) * 100

      if (remainingTime.value <= 0) {
        cerrarSnackbar()
      }
    }
  }, 50)
}

// Pausar al hacer hover
const pauseTimeout = () => {
  if (props.alert.pauseOnHover !== false && props.alert.timeout !== 0) {
    isPaused.value = true
    clearInterval(timer.value)
  }
}

// Reanudar al salir
const resumeTimeout = () => {
  if (props.alert.pauseOnHover !== false && props.alert.timeout !== 0) {
    isPaused.value = false
    startTime.value = Date.now() - ((props.alert.timeout || props.timeout) - remainingTime.value)
    startTimer()
  }
}

const cerrarSnackbar = () => {
  clearInterval(timer.value)
  emit('update:alert', {
    show: false,
    type: props.alert.type,
    message: props.alert.message,
    title: props.alert.title,
    icon: props.alert.icon,
    timeout: props.alert.timeout,
    position: props.alert.position,
    actions: props.alert.actions,
    showProgress: props.alert.showProgress,
    pauseOnHover: props.alert.pauseOnHover,
  })
}

const handleAction = (action: AlertAction) => {
  action.handler()
  cerrarSnackbar()
}

// Watchers y lifecycle hooks
watch(
  () => props.alert.show,
  (newVal) => {
    if (newVal) {
      startTimer()
    } else {
      clearInterval(timer.value)
    }
  },
)

onMounted(() => {
  if (props.alert.show) {
    startTimer()
  }
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
})
</script>

<style scoped>
.notification-container {
  position: relative;
  overflow: hidden;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  width: 100%;
}

.content {
  padding-top: 8px; /* Espacio para el progress bar */
}
</style>

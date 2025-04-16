<template>
  <div
    class="checklist-filtro"
    :style="{
      background: theme.global.current.value.colors.background,
    }"
  >
    <div class="text-caption mb-2" :style="{ color: theme.global.current.value.colors.primary }">
      Filtrar por consultorio
    </div>
    <div class="checklist-container">
      <v-checkbox
        v-for="item in items"
        :key="item.value"
        v-model="modelValue"
        :label="item.text"
        :value="item.value"
        density="comfortable"
        hide-details
        multiple
        class="checklist-item"
        :color="getColorForItem(item.value)"
      >
        <template #label>
          <div class="checkbox-label">
            {{ item.text }}
          </div>
        </template>
      </v-checkbox>
    </div>
    <div class="actions mt-2">
      <v-btn size="x-small" variant="text" @click="selectAll" class="text-caption"> Todos </v-btn>
      <v-btn size="x-small" variant="text" @click="clearAll" class="text-caption"> Ninguno </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTheme } from 'vuetify'
import { getColorForItem } from '@/utils/colorUtils'

const theme = useTheme()

const props = defineProps({
  items: {
    type: Array as () => Array<{ text: string; value: string }>,
    required: true,
  },
  modelValue: {
    type: Array as () => string[],
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const modelValue = ref<string[]>(props.modelValue)

watch(
  modelValue,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true },
)

const selectAll = () => {
  modelValue.value = props.items.map((item) => item.value)
}

const clearAll = () => {
  modelValue.value = []
}
</script>

<style scoped>
.checklist-filtro {
  padding: 4px 8px;
  background: rgba(var(--v-theme-background), 0.8);
}

.checklist-container {
  display: flex;
  flex-direction: column;
  max-height: 70vh;
  overflow-y: auto;
}

.checklist-item {
  margin: 0;
  font-size: 0.8rem;
}

.checklist-item :deep(.v-label) {
  display: flex;
  align-items: center;
}

.actions {
  display: flex;
  gap: 8px;
}

.checkbox-label {
  display: flex;
  font-size: 0.875rem;
  align-items: center;
}
</style>

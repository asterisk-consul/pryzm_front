<template>
  <section class="d-flex flex-column align-center">
    <h1 class="text-h4 my-6">Gestionar Consultorios</h1>
    <!--listado de consultorios-->
    <v-row
      :style="{
        width: '90%',
        margin: '0 auto',
      }"
    >
      <CarrouselConsultorios
        :consultorios="consultoriosStore.consultorios"
        :Tratamientos="consultoriosStore.tratamientos"
      />
    </v-row>
    <!--listado de tratamientos-->
    <v-row
      class="ma-11 d-flex justify-lg-space-around"
      :style="{
        width: '90%',
        margin: '0 auto',
      }"
    >
      <GridTratamientos :tratamientos="consultoriosStore.tratamientos" />
    </v-row>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// Pinia para actualizar el componente padre
import { useConsultoriosStore } from '@/stores/consultoriosStores'
const consultoriosStore = useConsultoriosStore()

// Components
import CarrouselConsultorios from '@/components/consultorios/CarrouselConsultorios.vue'
import GridTratamientos from '@/components/tratamientos/GridTratamientos.vue'

onMounted(async () => {
  await consultoriosStore.cargarDatos()
})
</script>

<style scoped></style>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="4">
        <!-- Botón que abre el diálogo -->
        <v-btn color="primary" @click="dialog = true">Abrir Caja</v-btn>

        <!-- Diálogo con el formulario -->
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h6">Apertura de Caja</span>
            </v-card-title>

            <v-card-text>
              <v-form @submit.prevent="abrirCaja" ref="formRef">
                <v-text-field
                  v-model="form.caja_id"
                  label="Caja ID"
                  type="number"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="form.monto_inicial"
                  label="Monto inicial"
                  type="number"
                  required
                ></v-text-field>

                <v-textarea
                  v-model="form.observaciones"
                  label="Observaciones"
                  rows="3"
                ></v-textarea>

                <v-card-actions class="justify-end">
                  <v-btn text @click="dialog = false">Cancelar</v-btn>
                  <v-btn color="primary" type="submit">Abrir</v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>

      <v-col cols="12" md="8">
        <div class="pa-4">
          <h2>Contenido Principal</h2>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useCajaStore } from '@/stores/cajaStores'

const store = useCajaStore()

const dialog = ref(false)

const form = ref({
  caja_id: 1,
  usuario_id: 1,
  monto_inicial: 0,
  observaciones: ''
})

const formRef = ref()

const abrirCaja = async () => {
  if (formRef.value?.validate()) {
    await store.abrirCaja(form.value)
    dialog.value = false
  }
}
</script>

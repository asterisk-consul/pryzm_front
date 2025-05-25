<template>
  <VContainer fluid>
    <!-- Caja y resumen -->
    <VRow>
      <VCol cols="12" md="4">
        <VCard class="pa-4">
          <h4 class="text-h5">📦 Estado de Caja</h4>
          <div class="text-subtitle-1">Estado: <strong>{{ cajaAbierta ? '🟢 Abierta' : '🔴 Cerrada' }}</strong></div>
          <div class="mt-2">💵 Total en Caja: <strong>${{ totalCaja }}</strong></div>
          <div class="mt-2">🧾 Total Facturado Hoy: <strong>${{ totalFacturado }}</strong></div>

          <div class="mt-4 d-flex gap-2">
            <VBtn v-if="!cajaAbierta" color="primary" @click="dialogAbrir = true">🔓 Abrir Caja</VBtn>
            <VBtn v-if="cajaAbierta" color="error" @click="cerrarCaja">🔐 Cerrar Caja</VBtn>
          </div>
        </VCard>

        <!-- Productos rápidos -->
        <VCard class="mt-4 pa-4">
          <h5 class="text-h6 mb-2">⚡ Productos Rápidos</h5>
          <div class="d-flex flex-wrap gap-2">
            <VBtn
              v-for="p in productosRapidos"
              :key="p.id"
              color="secondary"
              @click="agregarProducto(p)"
            >
              {{ p.nombre }} - ${{ p.precio }}
            </VBtn>
          </div>
        </VCard>

        <!-- Combos -->
        <VCard class="mt-4 pa-4">
          <h5 class="text-h6 mb-2">🍔 Combos</h5>
          <div class="d-flex flex-wrap gap-2">
            <VBtn
              v-for="c in combos"
              :key="c.id"
              color="info"
              @click="agregarCombo(c)"
            >
              {{ c.nombre }} - ${{ c.precio }}
            </VBtn>
          </div>
        </VCard>
      </VCol>

      <!-- Panel de ventas -->
      <VCol cols="12" md="8">
        <VCard class="pa-4">
          <h4 class="text-h5 mb-4">🛒 Facturación</h4>

          <!-- Buscar y agregar producto -->
          <VTextField v-model="productoBuscado" label="🔍 Buscar producto..." @keyup.enter="buscarProducto" />

          <VBtn class="mt-2" @click="buscarProducto">Agregar producto</VBtn>

          <!-- Lista de productos agregados -->
          <VList class="mt-4">
            <VListItem
              v-for="(item, index) in carrito"
              :key="index"
              class="d-flex justify-between"
            >
              <div>{{ item.nombre }} (x{{ item.cantidad }})</div>
              <div>${{ item.precio * item.cantidad }}</div>
            </VListItem>
          </VList>

          <!-- Total -->
          <div class="mt-4 text-right">
            <h3>Total actual 🧮: ${{ totalCarrito }}</h3>
          </div>

          <div class="mt-2 text-right">
            <VBtn color="success" @click="facturar">✅ Facturar y Emitir Ticket</VBtn>
          </div>
        </VCard>
      </VCol>
    </VRow>

    <!-- Diálogo Apertura -->
    <VDialog v-model="dialogAbrir" max-width="500px">
      <VCard>
        <VCardTitle><span class="text-h6">🟢 Apertura de Caja</span></VCardTitle>
        <VCardText>
          <VForm @submit.prevent="abrirCaja" ref="formRef">
            <VTextField v-model="form.caja_id" label="🆔 Caja ID" type="number" required />
            <VTextField v-model="form.monto_inicial" label="💵 Monto Inicial" type="number" required />
            <VTextarea v-model="form.observaciones" label="✍️ Observaciones" rows="2" />
            <VCardActions class="justify-end">
              <VBtn text @click="dialogAbrir = false">Cancelar</VBtn>
              <VBtn color="primary" type="submit">Abrir</VBtn>
            </VCardActions>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>
  </VContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dialogAbrir = ref(false)
const cajaAbierta = ref(false)
const totalCaja = ref(0)
const totalFacturado = ref(0)
const totalCarrito = ref(0)

const productoBuscado = ref('')
const carrito = ref([])

const productosRapidos = [
  { id: 1, nombre: 'Agua', precio: 500 },
  { id: 2, nombre: 'Café', precio: 1200 },
  { id: 3, nombre: 'Pan', precio: 300 }
]

const combos = [
  { id: 1, nombre: 'Combo Desayuno', precio: 2500 },
  { id: 2, nombre: 'Combo Almuerzo', precio: 4000 }
]

const formRef = ref()
const form = ref({
  caja_id: 1,
  usuario_id: 1,
  monto_inicial: 0,
  observaciones: ''
})

const abrirCaja = () => {
  if (formRef.value?.validate()) {
    cajaAbierta.value = true
    totalCaja.value = form.value.monto_inicial
    dialogAbrir.value = false
  }
}

const cerrarCaja = () => {
  cajaAbierta.value = false
  alert(`🔐 Caja cerrada. Total en caja: $${totalCaja.value}`)
}

const buscarProducto = () => {
  if (productoBuscado.value.trim() === '') return
  const producto = { nombre: productoBuscado.value, precio: 1000, cantidad: 1 }
  agregarProducto(producto)
  productoBuscado.value = ''
}

const agregarProducto = (producto: any) => {
  const existente = carrito.value.find((p: any) => p.nombre === producto.nombre)
  if (existente) {
    existente.cantidad += 1
  } else {
    carrito.value.push({ ...producto, cantidad: 1 })
  }
  calcularTotal()
}

const agregarCombo = (combo: any) => {
  carrito.value.push({ ...combo, cantidad: 1 })
  calcularTotal()
}

const calcularTotal = () => {
  totalCarrito.value = carrito.value.reduce((acc, p) => acc + p.precio * p.cantidad, 0)
}

const facturar = () => {
  if (!carrito.value.length) return
  totalCaja.value += totalCarrito.value
  totalFacturado.value += totalCarrito.value
  carrito.value = []
  totalCarrito.value = 0
  alert('🎟️ Ticket emitido')
}
</script>

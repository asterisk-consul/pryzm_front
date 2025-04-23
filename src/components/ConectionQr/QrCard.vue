<template>
  <section class="d-flex align-center justify-center">
    <v-card
      class="d-flex align-center justify-center border-sm border-primary rounded-xl width-100 height-1000"
    >
      <v-card-item>
        <v-card-title class="font-weight-regular text-h4 text-primary pb-0">
          Conecta tu cuenta de WhatsApp
        </v-card-title>
        <v-card-subtitle class="text-h6 text-primary font-weight-bold text-primary">
          Envia mesajes privavos a tus clientes a traves de la App</v-card-subtitle
        >
        <v-list>
          <v-list-item>1. Abre WhatsApp en tu telefono</v-list-item>
          <v-list-item
            >2. Toca Menú <v-icon>mdi-dots-vertical</v-icon> en Android o
            <v-icon>
              <svg
                width="800px"
                height="800px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >     
                <path
                  d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"
                  stroke="#000000"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M18 12H12M9 6.80273L12 12M12 12L9 17.1973"
                  stroke="#000000"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19Z"
                  stroke="#000000"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-dasharray="1 3"
                />
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="#000000"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                  stroke="#000000"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >en iPhone</v-icon
            ></v-list-item
          >
          <v-list-item
            >3. Toca Dispositivos vinculados y, luego, Vincular un dispositivo.</v-list-item
          >
          <v-list-item
            >4. Apunta tu teléfono hacia la pantalla para escanear el código QR</v-list-item
          >
        </v-list>
      </v-card-item>
      <v-vard-item> QR </v-vard-item>
    </v-card>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
section {
  height: 100vh;

  .container {
    padding: 20px;
    border: 1px solid black;
    border-radius: 1.8rem;
    width: 90%;
    height: 80%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .title {
      font-size: 2.4rem;
      font-weight: 300;
    }
  }
}
</style>

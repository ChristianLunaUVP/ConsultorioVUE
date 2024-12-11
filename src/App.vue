<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Nav from '@/components/Nav.vue'
</script>

<template>
  <div id="app">
    <Nav />
    <div class="container-fluid">
      <RouterView />
    </div>
  </div>
</template>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

nav.navbar {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
}

.container-fluid {
  margin-top: 0px; /* Altura de la barra de navegación */
}
</style>
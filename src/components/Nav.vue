<script setup>
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
    <div class="container-fluid">
      <a class="navbar-brand fw-bold" href="#">
        <i class="fas fa-clinic-medical me-2"></i>Consultorio
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <!-- Mostrar las categorías solo si el usuario está autenticado -->
        <ul class="navbar-nav" v-if="authStore.authuser">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/citas">Citas</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/doctores">Doctores</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/expedientes">Expedientes</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/pacientes">Pacientes</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/tratamientos">Tratamientos</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/grafica">Gráfica</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/reports">Reportes</router-link>
          </li>
        </ul>

        <!-- Mostrar Login/Logout dependiendo del estado de autenticación -->
        <ul class="navbar-nav ms-auto">
          <li class="nav-item" v-if="!authStore.authuser">
            <router-link class="nav-link" to="/login">
              <i class="fas fa-sign-in-alt me-2"></i>Login
            </router-link>
          </li>
          <li class="nav-item" v-if="authStore.authuser">
            <a class="nav-link" href="#" @click.prevent="authStore.logout">
              <i class="fas fa-sign-out-alt me-2"></i>Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style>
.navbar {
  border-radius: 0.5rem;
}

.navbar-dark .navbar-brand {
  font-size: 1.25rem;
}

.navbar-dark .nav-link {
  font-size: 1rem;
  color: #ffffff !important;
}

.navbar-dark .nav-link:hover {
  color: #d1e8ff !important;
}

.navbar-toggler {
  border-color: rgba(255, 255, 255, 0.5);
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 30 30'%3E%3Cpath stroke='rgba%280, 0, 0, 0.5%29' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
}
</style>

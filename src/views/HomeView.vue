<script setup>
import { ref } from 'vue';

// Datos dinámicos para personalización
const consultorioName = "Consultorio Médico ABC";
const welcomeMessage = "Bienvenido a nuestro Consultorio";
const description =
  "En el Consultorio Médico ABC nos dedicamos a cuidar de tu salud con un equipo de profesionales altamente capacitados. Ofrecemos tratamientos personalizados y atención de calidad.";
const featuredImage = "/images/consultorio.jpg"; // Cambia esto a la URL de tu imagen destacada
</script>

<template>
  <main class="home-page">
    <!-- Sección de bienvenida -->
    <section class="welcome-section text-center py-5 bg-primary text-white mt-5">
      <div class="container">
        <h1 class="display-4 fw-bold">{{ welcomeMessage }}</h1>
        <p class="lead">{{ consultorioName }}</p>
      </div>
    </section>

    <!-- Sección de descripción -->
    <section class="description-section py-5">
      <div class="container">
        <div class="row align-items-center">
          <!-- Imagen destacada -->
          <div class="col-md-6">
            <img
              :src="featuredImage"
              alt="Consultorio Médico"
              class="img-fluid rounded shadow-sm"
            />
          </div>
          <!-- Texto descriptivo -->
          <div class="col-md-6">
            <h2 class="fw-bold text-primary">¿Por qué elegirnos?</h2>
            <p class="text-muted">{{ description }}</p>
            <div class="mt-4">
              <router-link to="/citas" class="btn btn-primary btn-lg me-3">
                <i class="fas fa-calendar-check"></i> Agendar Cita
              </router-link>
              <button class="btn btn-outline-primary btn-lg">
                <i class="fas fa-info-circle"></i> Conoce Más
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style>
/* Estilos para la página de inicio */
.home-page {
  font-family: 'Poppins', sans-serif;
}

.welcome-section {
  background: linear-gradient(to right, #007bff, #6c63ff);
  color: white;
}

.description-section {
  background-color: #f8f9fa;
}

.description-section h2 {
  margin-bottom: 1rem;
}

.img-fluid {
  border-radius: 8px;
}
</style>
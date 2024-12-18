<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const doctorId = route.params.id;

const doctor = ref({
  nombre: '',
  apellido: '',
  especialidad: '',
  telefono: '',
  email: '',
  direccion: '',
});

const loadDoctor = async () => {
  try {
    const response = await axios.get(`/api/doctores/${doctorId}`);
    doctor.value = response.data.data;
  } catch (error) {
    console.error('Error al cargar el doctor:', error);
    alert('No se pudo cargar el doctor.');
    router.push('/doctores');
  }
};

const save = async () => {
  try {
    await axios.put(`/api/doctores/${doctorId}`, doctor.value);
    alert('Doctor actualizado con éxito.');
    router.push('/doctores');
  } catch (error) {
    console.error('Error al actualizar el doctor:', error);
    alert('No se pudo actualizar el doctor.');
  }
};

onMounted(() => {
  loadDoctor();
});
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="col-md-6">
      <div class="card shadow-sm border-0 rounded">
        <div class="card-header bg-primary text-white text-center">
          <h4><i class="fas fa-user-md me-2"></i>Editar Doctor</h4>
        </div>
        <div class="card-body p-4">
          <form @submit.prevent="save">
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre</label>
              <input
                type="text"
                class="form-control"
                id="nombre"
                v-model="doctor.nombre"
                placeholder="Ingrese el nombre"
                required
              />
            </div>
            <div class="mb-3">
              <label for="apellido" class="form-label">Apellido</label>
              <input
                type="text"
                class="form-control"
                id="apellido"
                v-model="doctor.apellido"
                placeholder="Ingrese el apellido"
                required
              />
            </div>
            <div class="mb-3">
              <label for="especialidad" class="form-label">Especialidad</label>
              <input
                type="text"
                class="form-control"
                id="especialidad"
                v-model="doctor.especialidad"
                placeholder="Ingrese la especialidad"
                required
              />
            </div>
            <div class="mb-3">
              <label for="telefono" class="form-label">Teléfono</label>
              <input
                type="text"
                class="form-control"
                id="telefono"
                v-model="doctor.telefono"
                placeholder="Ingrese el teléfono"
                required
              />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="doctor.email"
                placeholder="Ingrese el correo electrónico"
                required
              />
            </div>
            <div class="mb-3">
              <label for="direccion" class="form-label">Dirección</label>
              <textarea
                class="form-control"
                id="direccion"
                v-model="doctor.direccion"
                rows="3"
                placeholder="Ingrese la dirección"
              ></textarea>
            </div>
            <button type="submit" class="btn btn-primary w-100 rounded-btn">
              <i class="fas fa-save me-2"></i>Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.vh-100 {
  min-height: 100vh;
}
.bg-light {
  background-color: #f8f9fa !important;
}
.card {
  border-radius: 0.75rem;
}
.card-header {
  font-size: 1.25rem;
}
.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}
.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}
.rounded-btn {
  border-radius: 0.375rem; /* Botón rectangular con bordes redondeados */
}
</style>

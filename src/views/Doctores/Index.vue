<script setup>
import { ref, onMounted } from 'vue';
import { confirmation } from '../../functions';
import { useAuthStore } from '../../stores/auth';
import axios from 'axios';

const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.authtoken}`;

const doctores = ref([]);
const load = ref(false);

const getDoctores = async () => {
  load.value = true;
  try {
    const response = await axios.get('/api/doctores');
    doctores.value = response.data;
  } catch (error) {
    console.log(error);
  }
  load.value = false;
};

const deletedoctor = (id, nombre) => {
  confirmation(`¿Desea eliminar al doctor ${nombre}?`, `/api/doctores/${id}`, getDoctores)
    .then(() => {
      getDoctores();
    })
    .catch((error) => {
      console.log(error);
    });
};

onMounted(() => {
  getDoctores();
});
</script>

<template>
  <div class="container py-4 mt-5">
    <!-- Botón Agregar Doctor -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-primary fw-bold">Listado de Doctores</h2>
      <router-link to="/create" class="btn btn-primary shadow rounded-circle">
        <i class="fas fa-plus"></i>
      </router-link>
    </div>

    <div v-if="load" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else>
      <div class="table-responsive rounded shadow-sm">
        <table class="table table-hover align-middle">
          <thead class="table-dark text-center">
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Especialidad</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="doctor in doctores" :key="doctor.id">
              <td>{{ doctor.nombre }}</td>
              <td>{{ doctor.apellido }}</td>
              <td>{{ doctor.especialidad }}</td>
              <td>{{ doctor.telefono }}</td>
              <td>{{ doctor.email }}</td>
              <td>{{ doctor.direccion }}</td>
              <td class="text-center">
                <router-link :to="`/doctores/edit/${doctor.id}`" class="btn btn-sm btn-outline-primary me-2">
  <i class="fas fa-edit"></i>
</router-link>
                <button 
                  class="btn btn-sm btn-outline-danger" 
                  @click="deletedoctor(doctor.id, doctor.nombre)">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style>
.container {
  max-width: 1200px;
  margin: auto;
}
.table {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.table thead {
  background-color: #343a40;
  color: #ffffff;
}
.table tbody tr {
  transition: background-color 0.3s ease;
}
.table tbody tr:hover {
  background-color: rgba(52, 58, 64, 0.1);
}
.btn {
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-outline-primary {
  color: #007bff;
  border-color: #007bff;
}
.btn-outline-primary:hover {
  background-color: #007bff;
  color: #fff;
}
.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
}
.btn-outline-danger:hover {
  background-color: #dc3545;
  color: #fff;
}
.shadow {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { confirmation } from '../../functions';
import { useAuthStore } from '../../stores/auth';
import Swal from 'sweetalert2';
import axios from 'axios';

const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.authtoken}`;

const tratamientos = ref([]);
const doctores = ref([]); // Para mostrar doctores en un dropdown
const load = ref(false);
const modalVisible = ref(false);
const isEditing = ref(false);
const selectedTratamiento = ref({
  tipo_tratamiento: '',
  costo: '',
  duración: '', // Usar el campo tal como lo devuelve la API
  doctor_id: '',
});

const getTratamientos = async () => {
  load.value = true;
  try {
    const response = await axios.get('/api/tratamientos');
    tratamientos.value = response.data;
    console.log('Tratamientos cargados:', tratamientos.value);
  } catch (error) {
    console.log(error);
  }
  load.value = false;
};

const getDoctores = async () => {
  try {
    const response = await axios.get('/api/doctores');
    doctores.value = response.data;
    console.log('Doctores cargados:', doctores.value);
  } catch (error) {
    console.log(error);
  }
};

const deleteTratamiento = (id, tipo_tratamiento) => {
  confirmation(`¿Desea eliminar el tratamiento ${tipo_tratamiento}?`, `/api/tratamientos/${id}`, getTratamientos)
    .then(() => {
      getTratamientos();
    })
    .catch((error) => {
      console.log(error);
    });
};

const openModal = (tratamiento = null) => {
  if (tratamiento) {
    isEditing.value = true;
    selectedTratamiento.value = { ...tratamiento };
  } else {
    isEditing.value = false;
    selectedTratamiento.value = {
      tipo_tratamiento: '',
      costo: '',
      duración: '',
      doctor_id: '',
    };
  }
  modalVisible.value = true;
};

const closeModal = () => {
  modalVisible.value = false;
};

const saveTratamiento = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`/api/tratamientos/${selectedTratamiento.value.id}`, selectedTratamiento.value);
      Swal.fire({
        title: '¡Éxito!',
        text: 'Tratamiento actualizado con éxito.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    } else {
      await axios.post('/api/tratamientos', selectedTratamiento.value);
      Swal.fire({
        title: '¡Éxito!',
        text: 'Tratamiento agregado con éxito.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    }
    closeModal();
    getTratamientos();
  } catch (error) {
    console.error('Error al guardar el tratamiento:', error);
    Swal.fire({
      title: 'Error',
      text: 'No se pudo guardar el tratamiento.',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
  }
};

const getDoctorName = (doctor_id) => {
  const doctor = doctores.value.find(d => d.id === doctor_id);
  return doctor ? doctor.nombre : 'Desconocido';
};

onMounted(async () => {
  await getDoctores();
  await getTratamientos();
});
</script>

<template>
  <div class="container-wrapper">
    <div class="container py-4 mt-5" :class="{ 'blur-background': modalVisible }">
      <!-- Botón Agregar Tratamiento -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="text-primary fw-bold">Listado de Tratamientos</h2>
        <button class="btn btn-primary shadow" @click="openModal()">
          <i class="fas fa-plus me-2"></i>Agregar Tratamiento
        </button>
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
                <th>Tipo de Tratamiento</th>
                <th>Costo</th>
                <th>Duración</th>
                <th>Doctor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tratamiento in tratamientos" :key="tratamiento.id">
                <td>{{ tratamiento.tipo_tratamiento }}</td>
                <td>{{ tratamiento.costo }}</td>
                <td>{{ tratamiento.duración }} días</td>
                <td>{{ getDoctorName(tratamiento.doctor_id) }}</td>
                <td class="text-center">
                  <button class="btn btn-sm btn-outline-primary me-2" @click="openModal(tratamiento)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteTratamiento(tratamiento.id, tratamiento.tipo_tratamiento)">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade show d-block" tabindex="-1" role="dialog" v-if="modalVisible">
      <div class="modal-backdrop"></div>
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">{{ isEditing ? 'Editar Tratamiento' : 'Agregar Tratamiento' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveTratamiento">
              <div class="mb-3">
                <label for="tipo_tratamiento" class="form-label">Tipo de Tratamiento</label>
                <input type="text" class="form-control" id="tipo_tratamiento" v-model="selectedTratamiento.tipo_tratamiento" required />
              </div>
              <div class="mb-3">
                <label for="costo" class="form-label">Costo</label>
                <input type="number" class="form-control" id="costo" v-model="selectedTratamiento.costo" required />
              </div>
              <div class="mb-3">
                <label for="duración" class="form-label">Duración (días)</label>
                <input type="number" class="form-control" id="duración" v-model="selectedTratamiento.duración" required />
              </div>
              <div class="mb-3">
                <label for="doctor_id" class="form-label">Doctor</label>
                <select class="form-control" id="doctor_id" v-model="selectedTratamiento.doctor_id" required>
                  <option v-for="doctor in doctores" :key="doctor.id" :value="doctor.id">
                    {{ doctor.nombre }}
                  </option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary w-100">
                {{ isEditing ? 'Guardar Cambios' : 'Agregar Tratamiento' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.container-wrapper {
  position: relative;
}
.container {
  max-width: 1200px;
  margin: auto;
  transition: filter 0.3s ease;
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
.modal-content {
  z-index: 1050;
  border-radius: 0.75rem;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}
.blur-background {
  filter: blur(5px);
}
</style>
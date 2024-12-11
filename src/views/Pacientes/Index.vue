<script setup>
import { ref, onMounted } from 'vue';
import { confirmation } from '../../functions';
import { useAuthStore } from '../../stores/auth';
import Swal from 'sweetalert2';
import axios from 'axios';

const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.authtoken}`;

const pacientes = ref([]);
const load = ref(false);
const modalVisible = ref(false);
const isEditing = ref(false);
const selectedPaciente = ref({
  nombre: '',
  apellido: '',
  edad: '',
  telefono: '',
  email: '',
  direccion: '',
});

const getPacientes = async () => {
  load.value = true;
  try {
    const response = await axios.get('/api/pacientes');
    pacientes.value = response.data;
  } catch (error) {
    console.log(error);
  }
  load.value = false;
};

const deletePaciente = (id, nombre) => {
  confirmation(`¿Desea eliminar al paciente ${nombre}?`, `/api/pacientes/${id}`, getPacientes)
    .then(() => {
      getPacientes();
    })
    .catch((error) => {
      console.log(error);
    });
};

const openModal = (paciente = null) => {
  if (paciente) {
    isEditing.value = true;
    selectedPaciente.value = { ...paciente };
  } else {
    isEditing.value = false;
    selectedPaciente.value = {
      nombre: '',
      apellido: '',
      edad: '',
      telefono: '',
      email: '',
      direccion: '',
    };
  }
  modalVisible.value = true;
};

const closeModal = () => {
  modalVisible.value = false;
};

const savePaciente = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`/api/pacientes/${selectedPaciente.value.id}`, selectedPaciente.value);
      Swal.fire({
        title: '¡Éxito!',
        text: 'Paciente actualizado con éxito.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    } else {
      await axios.post('/api/pacientes', selectedPaciente.value);
      Swal.fire({
        title: '¡Éxito!',
        text: 'Paciente agregado con éxito.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    }
    closeModal();
    getPacientes();
  } catch (error) {
    console.error('Error al guardar el paciente:', error);
    Swal.fire({
      title: 'Error',
      text: 'No se pudo guardar el paciente.',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
  }
};

onMounted(() => {
  getPacientes();
});
</script>

<template>
  <div class="container-wrapper">
    <div class="container py-4 mt-5" :class="{ 'blur-background': modalVisible }">
      <!-- Botón Agregar Paciente -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="text-primary fw-bold">Listado de Pacientes</h2>
        <button class="btn btn-primary shadow" @click="openModal()">
          <i class="fas fa-plus me-2"></i>Agregar Paciente
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
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Edad</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="paciente in pacientes" :key="paciente.id">
                <td>{{ paciente.nombre }}</td>
                <td>{{ paciente.apellido }}</td>
                <td>{{ paciente.edad }}</td>
                <td>{{ paciente.telefono }}</td>
                <td>{{ paciente.email }}</td>
                <td>{{ paciente.direccion }}</td>
                <td class="text-center">
                  <button class="btn btn-sm btn-outline-primary me-2" @click="openModal(paciente)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deletePaciente(paciente.id, paciente.nombre)">
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
            <h5 class="modal-title">{{ isEditing ? 'Editar Paciente' : 'Agregar Paciente' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="savePaciente">
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" class="form-control" id="nombre" v-model="selectedPaciente.nombre" required />
              </div>
              <div class="mb-3">
                <label for="apellido" class="form-label">Apellido</label>
                <input type="text" class="form-control" id="apellido" v-model="selectedPaciente.apellido" required />
              </div>
              <div class="mb-3">
                <label for="edad" class="form-label">Edad</label>
                <input type="number" class="form-control" id="edad" v-model="selectedPaciente.edad" required />
              </div>
              <div class="mb-3">
                <label for="telefono" class="form-label">Teléfono</label>
                <input type="text" class="form-control" id="telefono" v-model="selectedPaciente.telefono" required />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" v-model="selectedPaciente.email" required />
              </div>
              <div class="mb-3">
                <label for="direccion" class="form-label">Dirección</label>
                <textarea class="form-control" id="direccion" v-model="selectedPaciente.direccion" rows="3"></textarea>
              </div>
              <button type="submit" class="btn btn-primary w-100">
                {{ isEditing ? 'Guardar Cambios' : 'Agregar Paciente' }}
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

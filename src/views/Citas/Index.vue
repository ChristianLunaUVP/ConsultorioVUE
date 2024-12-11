<script setup>
import { ref, onMounted } from 'vue';
import { confirmation } from '../../functions';
import { useAuthStore } from '../../stores/auth';
import Swal from 'sweetalert2';
import axios from 'axios';

const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.authtoken}`;

const citas = ref([]);
const load = ref(false);
const modalVisible = ref(false);
const isEditing = ref(false);
const selectedCita = ref({
  doctor_id: '',
  paciente_id: '',
  fecha: '',
  hora: '',
  motivo: '',
});

const getCitas = async () => {
  load.value = true;
  try {
    const response = await axios.get('/api/citas');
    citas.value = response.data;
  } catch (error) {
    console.log(error);
  }
  load.value = false;
};

const deleteCita = (id) => {
  confirmation('¿Desea eliminar esta cita?', `/api/citas/${id}`, getCitas)
    .then(() => {
      getCitas();
    })
    .catch((error) => {
      console.log(error);
    });
};

const openModal = (cita = null) => {
  if (cita) {
    isEditing.value = true;
    selectedCita.value = { ...cita };
  } else {
    isEditing.value = false;
    selectedCita.value = {
      doctor_id: '',
      paciente_id: '',
      fecha: '',
      hora: '',
      motivo: '',
    };
  }
  modalVisible.value = true;
};

const closeModal = () => {
  modalVisible.value = false;
};

const saveCita = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`/api/citas/${selectedCita.value.id}`, selectedCita.value);
      Swal.fire({
        title: '¡Éxito!',
        text: 'Cita actualizada con éxito.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    } else {
      await axios.post('/api/citas', selectedCita.value);
      Swal.fire({
        title: '¡Éxito!',
        text: 'Cita agregada con éxito.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    }
    closeModal();
    getCitas();
  } catch (error) {
    console.error('Error al guardar la cita:', error);
    Swal.fire({
      title: 'Error',
      text: 'No se pudo guardar la cita.',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
  }
};

onMounted(() => {
  getCitas();
});
</script>

<template>
  <div class="container-wrapper">
    <div class="container py-4 mt-5" :class="{ 'blur-background': modalVisible }">
      <!-- Botón Agregar Cita -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="text-primary fw-bold">Listado de Citas</h2>
        <button class="btn btn-primary shadow" @click="openModal()">
          <i class="fas fa-plus me-2"></i>Agregar Cita
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
                <th>Doctor</th>
                <th>Paciente</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Motivo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cita in citas" :key="cita.id">
                <td>{{ cita.doctor_id }}</td>
                <td>{{ cita.paciente_id }}</td>
                <td>{{ cita.fecha }}</td>
                <td>{{ cita.hora }}</td>
                <td>{{ cita.motivo }}</td>
                <td class="text-center">
                  <button class="btn btn-sm btn-outline-primary me-2" @click="openModal(cita)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteCita(cita.id)">
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
            <h5 class="modal-title">{{ isEditing ? 'Editar Cita' : 'Agregar Cita' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCita">
              <div class="mb-3">
                <label for="doctor_id" class="form-label">Doctor ID</label>
                <input type="number" class="form-control" id="doctor_id" v-model="selectedCita.doctor_id" required />
              </div>
              <div class="mb-3">
                <label for="paciente_id" class="form-label">Paciente ID</label>
                <input type="number" class="form-control" id="paciente_id" v-model="selectedCita.paciente_id" required />
              </div>
              <div class="mb-3">
                <label for="fecha" class="form-label">Fecha</label>
                <input type="date" class="form-control" id="fecha" v-model="selectedCita.fecha" required />
              </div>
              <div class="mb-3">
                <label for="hora" class="form-label">Hora</label>
                <input type="time" class="form-control" id="hora" v-model="selectedCita.hora" required />
              </div>
              <div class="mb-3">
                <label for="motivo" class="form-label">Motivo</label>
                <textarea class="form-control" id="motivo" v-model="selectedCita.motivo" rows="3"></textarea>
              </div>
              <button type="submit" class="btn btn-primary w-100">
                {{ isEditing ? 'Guardar Cambios' : 'Agregar Cita' }}
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

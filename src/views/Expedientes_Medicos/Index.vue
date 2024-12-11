<script setup>
import { ref, onMounted } from 'vue';
import { confirmation } from '../../functions';
import { useAuthStore } from '../../stores/auth';
import Swal from 'sweetalert2';
import axios from 'axios';

const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.authtoken}`;

const expedientes = ref([]);
const doctores = ref([]); // Para mostrar doctores en un dropdown
const load = ref(false);
const modalVisible = ref(false);
const isEditing = ref(false);
const currentPage = ref(1); // Página actual
const totalPages = ref(0); // Total de páginas
const selectedExpediente = ref({
  imagen: '',
  diagnostico: '',
  fecha: '',
  doctor_id: '',
});
const imagePreview = ref(''); // Previsualización de la imagen

const getExpedientes = async (page = 1) => {
  load.value = true;
  try {
    const response = await axios.get(`/api/expedientes?page=${page}`);
    if (response.data && Array.isArray(response.data.data)) {
      expedientes.value = response.data.data.filter(expediente => expediente !== null);
      currentPage.value = response.data.current_page || 1;
      totalPages.value = response.data.last_page || 1;
    } else {
      console.error('La respuesta de la API no contiene un array en la propiedad data:', response.data);
    }
    console.log('Expedientes cargados:', expedientes.value);
  } catch (error) {
    console.error('Error al cargar expedientes:', error);
  }
  load.value = false;
};

const getDoctores = async () => {
  try {
    const response = await axios.get('/api/doctores');
    if (Array.isArray(response.data)) {
      doctores.value = response.data.filter(doctor => doctor !== null);
    } else {
      console.error('La respuesta de la API no es un array:', response.data);
    }
    console.log('Doctores cargados:', doctores.value);
  } catch (error) {
    console.error('Error al cargar doctores:', error);
  }
};

const deleteExpediente = (id, diagnostico) => {
  confirmation(`¿Desea eliminar el expediente ${diagnostico}?`, `/api/expedientes/${id}`, getExpedientes)
    .then(() => {
      getExpedientes(currentPage.value);
    })
    .catch((error) => {
      console.error('Error al eliminar expediente:', error);
    });
};

const openModal = (expediente = null) => {
  if (expediente) {
    isEditing.value = true;
    selectedExpediente.value = { ...expediente };
    imagePreview.value = expediente.imagen; // Mostrar la imagen existente
  } else {
    isEditing.value = false;
    selectedExpediente.value = {
      imagen: '',
      diagnostico: '',
      fecha: '',
      doctor_id: '',
    };
    imagePreview.value = ''; // Restablecer la previsualización
  }
  modalVisible.value = true;
};

const closeModal = () => {
  modalVisible.value = false;
};

const saveExpediente = async () => {
  try {
    const formData = new FormData();
    formData.append('imagen', selectedExpediente.value.imagen);
    formData.append('diagnostico', selectedExpediente.value.diagnostico);
    formData.append('fecha', selectedExpediente.value.fecha);
    formData.append('doctor_id', selectedExpediente.value.doctor_id);

    if (isEditing.value) {
      formData.append('_method', 'PUT');
      await axios.post(`/api/expedientes/${selectedExpediente.value.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire({
        title: '¡Éxito!',
        text: 'Expediente actualizado con éxito.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    } else {
      await axios.post('/api/expedientes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire({
        title: '¡Éxito!',
        text: 'Expediente agregado con éxito.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    }
    closeModal();
    getExpedientes(currentPage.value);
  } catch (error) {
    console.error('Error al guardar el expediente:', error);
    Swal.fire({
      title: 'Error',
      text: 'No se pudo guardar el expediente.',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
  }
};

const handleImagePreview = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
    selectedExpediente.value.imagen = file; // Guardar el archivo en el expediente
  }
};

const getDoctorName = (doctor_id) => {
  const doctor = doctores.value.find(d => d.id === doctor_id);
  return doctor ? doctor.nombre : 'Desconocido';
};

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    getExpedientes(page);
  }
};

const getPageNumbers = () => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages;
};

onMounted(async () => {
  await getDoctores();
  await getExpedientes();
});
</script>

<template>
  <div class="container-wrapper">
    <div class="container py-4 mt-5" :class="{ 'blur-background': modalVisible }">
      <!-- Botón Agregar Expediente -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="text-primary fw-bold">Listado de Expedientes Médicos</h2>
        <button class="btn btn-primary shadow" @click="openModal()">
          <i class="fas fa-plus me-2"></i>Agregar Expediente
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
                <th>Imagen</th>
                <th>Diagnóstico</th>
                <th>Fecha</th>
                <th>Doctor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="expediente in expedientes" :key="expediente.id">
                <td>
                  <img
                    :src="expediente.imagen"
                    alt="Imagen"
                    class="img-thumbnail"
                    style="max-width: 100px;"
                  />
                </td>
                <td>{{ expediente.diagnostico }}</td>
                <td>{{ expediente.fecha }}</td>
                <td>{{ getDoctorName(expediente.doctor_id) }}</td>
                <td class="text-center">
                  <button
                    class="btn btn-sm btn-outline-primary me-2"
                    @click="openModal(expediente)"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="deleteExpediente(expediente.id, expediente.diagnostico)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Paginación -->
        <div class="d-flex justify-content-center align-items-center mt-3">
          <button
            v-for="page in getPageNumbers()"
            :key="page"
            class="btn btn-outline-primary mx-1"
            :class="{ 'btn-primary': currentPage === page }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade show d-block" tabindex="-1" role="dialog" v-if="modalVisible">
      <div class="modal-backdrop"></div>
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              {{ isEditing ? 'Editar Expediente' : 'Agregar Expediente' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <!-- Columna del formulario -->
              <div class="col-md-6">
                <form @submit.prevent="saveExpediente">
                  <div class="mb-3">
                    <label for="imagen" class="form-label">Imagen</label>
                    <input
                      type="file"
                      class="form-control"
                      id="imagen"
                      accept="image/*"
                      @change="handleImagePreview"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="diagnostico" class="form-label">Diagnóstico</label>
                    <input
                      type="text"
                      class="form-control"
                      id="diagnostico"
                      v-model="selectedExpediente.diagnostico"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="fecha" class="form-label">Fecha</label>
                    <input
                      type="date"
                      class="form-control"
                      id="fecha"
                      v-model="selectedExpediente.fecha"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="doctor_id" class="form-label">Doctor</label>
                    <select
                      class="form-control"
                      id="doctor_id"
                      v-model="selectedExpediente.doctor_id"
                      required
                    >
                      <option v-for="doctor in doctores" :key="doctor.id" :value="doctor.id">
                        {{ doctor.nombre }}
                      </option>
                    </select>
                  </div>
                  <button type="submit" class="btn btn-primary w-100">
                    {{ isEditing ? 'Guardar Cambios' : 'Agregar Expediente' }}
                  </button>
                </form>
              </div>
              <!-- Columna de previsualización -->
              <div class="col-md-6 d-flex align-items-center justify-content-center">
                <div v-if="imagePreview" class="image-preview">
                  <img
                    :src="imagePreview"
                    alt="Previsualización"
                    class="img-fluid rounded"
                  />
                </div>
                <div v-else class="text-muted">
                  <p>No se ha seleccionado ninguna imagen.</p>
                </div>
              </div>
            </div>
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
.image-preview {
  max-width: 100%;
  max-height: 300px;
  border: 2px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.image-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>

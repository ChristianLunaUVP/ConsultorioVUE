<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import axios from 'axios';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Legend,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js';
ChartJS.register(Title, Legend, Tooltip, BarElement, CategoryScale, LinearScale, ArcElement);

const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.authtoken}`;

// Refs para datos
const expedientespordoctor = ref([]);
const chartData = ref({
  labels: [],
  datasets: [],
});
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        font: {
          family: "'Poppins', sans-serif",
          size: 14,
        },
        color: '#333',
      },
    },
    tooltip: {
      bodyFont: {
        family: "'Poppins', sans-serif",
        size: 14,
      },
      backgroundColor: '#f8f9fa',
      borderColor: '#6c757d',
      borderWidth: 1,
      titleColor: '#495057',
      bodyColor: '#495057',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          family: "'Poppins', sans-serif",
          size: 12,
        },
        color: '#495057',
      },
      grid: {
        color: '#e9ecef',
      },
    },
    x: {
      ticks: {
        font: {
          family: "'Poppins', sans-serif",
          size: 12,
        },
        color: '#495057',
      },
      grid: {
        color: '#e9ecef',
      },
    },
  },
});

// Función para obtener datos de la API
const fetchExpedientesPorDoctor = async () => {
  try {
    const response = await axios.get('/api/expedientespordoctor');
    if (Array.isArray(response.data)) {
      expedientespordoctor.value = response.data;
      prepareChartData(
        'Expedientes por Doctor',
        expedientespordoctor.value.map((e) => e.nombre), // Nombres de los doctores
        expedientespordoctor.value.map((e) => e.count)  // Número de expedientes por doctor
      );
    }
  } catch (error) {
    console.error('Error al obtener datos de expedientes por doctor:', error);
  }
};

// Función para preparar los datos de la gráfica
const prepareChartData = (label, labels, data) => {
  chartData.value = {
    labels,
    datasets: [
      {
        label,
        data,
        backgroundColor: data.map(() => `rgba(${random()}, ${random()}, ${random()}, 0.7)`),
        borderColor: data.map(() => `rgba(${random()}, ${random()}, ${random()}, 1)`),
        borderWidth: 1,
        hoverBackgroundColor: data.map(() => `rgba(${random()}, ${random()}, ${random()}, 0.9)`),
      },
    ],
  };
};

// Generador de colores aleatorios
const random = () => Math.floor(Math.random() * 255);

// Cargar datos iniciales
onMounted(() => {
  fetchExpedientesPorDoctor();
});
</script>

<template>
  <div class="container py-4 mt-5">
    <!-- Contenedor para la gráfica -->
    <div class="chart-container rounded shadow-sm bg-white p-4">
      <Bar
        v-if="chartData.value && chartData.value.datasets && chartData.value.datasets.length"
        :data="chartData"
        :options="chartOptions"
      />
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
.chart-container {
  position: relative;
  margin: auto;
  width: 100%;
  height: 400px;
}
</style>
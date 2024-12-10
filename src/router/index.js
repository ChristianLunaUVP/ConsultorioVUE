import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue'),
    },
    {
      path: '/citas',
      name: 'citas',
      component: () => import('../views/Citas/Index.vue'),
    },
    {
      path: 'doctores',
      name: 'doctores',
      component: () => import('../views/Doctores/Index.vue'),
    },
    {
      path: '/edit',
      name: 'edit',
      component: () => import('../views/Doctores/Edit.vue'),
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('../views/Doctores/Create.vue'),
    },
    {
      path: '/expedientes',
      name: 'expedientes',
      component: () => import('../views/Expedientes_Medicos/Index.vue'),
    },
    {
      path: '/historial',
      name: 'historial',
      component: () => import('../views/Historial_Tratamientos/Index.vue'),
    },
    {
      path: '/pacientes',
      name: 'pacientes',
      component: () => import('../views/Pacientes/Index.vue'),
    },
    {
      path: '/editPaciente',
      name: 'editPaciente',
      component: () => import('../views/Pacientes/Edit.vue'),
    },
    {
      path: '/createPaciente',
      name: 'createPaciente',
      component: () => import('../views/Pacientes/Create.vue'),
    },
    {
      path: '/tratamientos',
      name: 'tratamientos',
      component: () => import('../views/Tratamientos/Index.vue'),
    }
  ],
})

export default router

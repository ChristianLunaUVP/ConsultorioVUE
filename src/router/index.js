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
      path: '/doctores',
      name: 'doctores',
      component: () => import('../views/Doctores/Index.vue'),
    },
    {
      path: '/doctores/edit/:id',
      name: 'editDoctor',
      component: () => import('../views/Doctores/Edit.vue'),
      props: true, // Esto pasa el parámetro `id` como prop al componente
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
      path: '/tratamientos',
      name: 'tratamientos',
      component: () => import('../views/Tratamientos/Index.vue'),
    },
    {
      path: '/grafica',
      name: 'grafica',
      component: () => import('../views/Pacientes/Graphic.vue'),
    },
    {
      path: '/reportes',
      name: 'reportes',
      component: () => import('../views/Historial_Tratamientos/Reports.vue'),
    }
  ],
})

router.beforeEach(async (to) => {
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)
  const auth = useAuthStore()
  if (authRequired && !auth.authuser) {
    auth.returnUrl = to.fullPath;
    return '/login';
  }
})

export default router
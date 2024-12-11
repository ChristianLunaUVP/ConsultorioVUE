<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const form = ref({
  email: '',
  password: ''
})

const login = async () => {
  try {
    await authStore.login(form.value, router)
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="col-md-5">
      <div class="card shadow-sm border-0 rounded">
        <div class="card-header bg-primary text-white text-center">
          <h4><i class="fas fa-user-circle me-2"></i>Iniciar Sesión</h4>
        </div>
        <div class="card-body p-4">
          <form @submit.prevent="login">
            <div class="mb-4">
              <label for="email" class="form-label text-secondary">Correo Electrónico</label>
              <div class="input-group">
                <span class="input-group-text bg-primary text-white">
                  <i class="fas fa-envelope"></i>
                </span>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="form.email"
                  placeholder="Ingresa tu correo"
                  required
                />
              </div>
            </div>
            <div class="mb-4">
              <label for="password" class="form-label text-secondary">Contraseña</label>
              <div class="input-group">
                <span class="input-group-text bg-primary text-white">
                  <i class="fas fa-lock"></i>
                </span>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="form.password"
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>
            </div>
            <button type="submit" class="btn btn-primary w-100">
              <i class="fas fa-sign-in-alt me-2"></i>Ingresar
            </button>
          </form>
        </div>
        <div class="card-footer bg-light text-center">
          <small class="text-secondary">
            ¿No tienes una cuenta? 
            <router-link to="/register" class="text-primary">Regístrate aquí</router-link>
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.vh-100 {
  height: 100vh;
}
</style>
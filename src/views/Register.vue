<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const register = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    console.error('Passwords do not match')
    return
  }
  try {
    await authStore.register(form.value, router)
  } catch (error) {
    console.error('Error al registrar:', error)
  }
}
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="col-md-5">
      <div class="card shadow-sm border-0 rounded">
        <div class="card-header bg-primary text-white text-center">
          <h4><i class="fas fa-user-circle me-2"></i>Regístrate</h4>
        </div>
        <div class="card-body p-4">
          <form @submit.prevent="register">
            <div class="mb-4">
              <label for="name" class="form-label text-secondary">Nombre</label>
              <div class="input-group">
                <span class="input-group-text bg-primary text-white">
                  <i class="fas fa-user"></i>
                </span>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="form.name"
                  placeholder="Ingresa tu nombre"
                  required
                />
              </div>
            </div>
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
            <div class="mb-4">
              <label for="confirmPassword" class="form-label text-secondary">Confirmar Contraseña</label>
              <div class="input-group">
                <span class="input-group-text bg-primary text-white">
                  <i class="fas fa-lock"></i>
                </span>
                <input
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  placeholder="Confirma tu contraseña"
                  required
                />
              </div>
            </div>
            <button type="submit" class="btn btn-primary w-100">
              <i class="fas fa-user-plus me-2"></i>Regístrate
            </button>
          </form>
        </div>
        <div class="card-footer bg-light text-center">
          <small class="text-secondary">
            ¿Ya tienes una cuenta? 
            <router-link to="/login" class="text-primary">Inicia sesión aquí</router-link>
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
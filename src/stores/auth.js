import { defineStore } from 'pinia'
import axios from 'axios'
import { show_alerta } from '@/functions'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authuser: null,
    authtoken: null,
  }),
  actions: {
    async getToken() {
      try {
        await axios.get('/sanctum/csrf-cookie')
      } catch (error) {
        console.error('Error getting CSRF token:', error)
      }
    },
    async login(form, router) {
      await this.getToken()
      try {
        const res = await axios.post('/api/auth/login', form)
        this.authuser = res.data.user
        this.authtoken = res.data.token
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.authtoken}`
        router.push('/doctores')
      } catch (error) {
        let desc = ''
        if (error.response && error.response.data.errors) {
          error.response.data.errors.forEach(e => {
            desc += ` ${e}`
          })
        } else {
          desc = error.message
        }
        show_alerta(desc, 'error', '')
      }
    },
    async register(form, router) {
      await this.getToken()
      try {
        const res = await axios.post('/api/auth/register', form)
        show_alerta(res.data.message, 'success', '')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } catch (error) {
        let desc = ''
        if (error.response && error.response.data.errors) {
          error.response.data.errors.forEach(e => {
            desc += ` ${e}`
          })
        } else {
          desc = error.message
        }
        show_alerta(desc, 'error', '')
      }
    },
    async logout(router) {
      try {
        await axios.get('/api/auth/logout', {
          headers: {
            Authorization: `Bearer ${this.authtoken}`
          }
        })
        this.authtoken = null
        this.authuser = null
        delete axios.defaults.headers.common['Authorization']
        router.push('/login')
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }
  },
  persist: true,
})
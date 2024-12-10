import './assets/main.css'

import { createApp, markRaw } from 'vue'
import App from './App.vue'
import router from './router'
import createPersistedState from 'pinia-plugin-persistedstate'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import axios from 'axios'

window.axios = axios

window.axios.defults.baseURL = 'consultorioapi.vonluna.istigen23.com/public'
window.axios.defults.header.common['Accept'] = 'application/json'
window.axios.defults.header.common['Content-Type'] = 'application/json'
window.axios.defults.header.common['X-Requested-With'] = 'XMLHttpRequest'
window.axios.defults.withCredentials = true

const pinia = createPinia()
pinia.use(({store }) => {
    store.router = markRaw(router)
})
pinia.use(createPersistedState)

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')

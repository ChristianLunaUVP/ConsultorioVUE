import Swal from 'sweetalert2'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export function show_alerta(message, icon, position = 'center') {
    Swal.fire({
        position: position,
        icon: icon,
        title: message,
        showConfirmButton: false,
        timer: 1500,
        buttonsStyling: true,
    })
}

export function confirmation(name, url, redirect) {
    const alert = Swal.mixin({ buttonsStyling: true })
    return alert.fire({
        title: `¿Estás seguro de eliminar ${name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
    }).then((result) => {
        if (result.isConfirmed) {
            return sendRequest('delete', {}, url, redirect)
        }
    })
}

export async function sendRequest(method, params, url, redirect = '') {
    const auth = useAuthStore()
    axios.defaults.headers.common['Authorization'] = `Bearer ${auth.authtoken}`
    let res
    try {
        const response = await axios({ method: method, url: url, data: params })
        res = response.data.status
        show_alerta(response.data.message, 'success', '')
        setTimeout(() => {
            if (redirect !== '') {
                redirect()
            }
        }, 2000)
    } catch (error) {
        show_alerta(error.message, 'error', '')
    }
}
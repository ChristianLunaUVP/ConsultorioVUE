import Swal from "sweetalert2";
import { nextTick } from "vue";

export function show_alerta(mjs,icon,focus){
    if(focus !== ''){
        nextTick(() => focus.value.focus());
    }
    Swal.fire({
        title: mjs,
        icon: icon,
        buttonsStyling: true,

    });
}

export function confirmation(name,url,redirect){
    const alert = Swal.mixin({buttonsStyling: true,});
    alert.fire({
        title: `¿Estás seguro de eliminar ${name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
    }).then((result) => {
        if (result.isConfirmed) {
            //Send Request
        }
    });
}

export async function sendRequest(methdo,params,url,redirect=''){

}
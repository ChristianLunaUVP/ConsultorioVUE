import { defineStore } from 'pinia'
import { show_alerta } from '@/functions'
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        authuser: null,
        authtoken: null,
    }),
    getters:{
        user: (state) => state.authuser,
        token: (state) => state.authtoken,
    },
    actions:{
        async getToken(){
            await axios.get('/sanctum/csrf-cookie');
        },
        async login(form){
            await this.getToken();
            await axios.post('/api/auth/login',form).then(
                (res) => {
                    this.authuser = res.data.data;
                    this.authtoken = res.data.token;
                    this.router.push('/doctores');
                }
            ).catch(
                (errors) => {
                    let desc = '';
                    errors.response.data.errors.map(
                        (e) => {desc = desc + ' ' +e}
                    )
                    show_alerta(desc,'error','');
                }
            )
        },
        async register(form){
            await this.getToken();
            await axios.post('/api/auth/register',form).then(
                (res) => {
                    show_alerta(res.data.message,'success','');
                    setTimeout(() => {
                        this.router.push('/login');
                    }, 2000);
                }
            ).catch(
                (errors) => {
                    let desc = '';
                    errors.response.data.errors.map(
                        (e) => {desc = desc + ' ' +e}
                    )
                    show_alerta(desc,'error','');
                }
            )
        },
        async logout(){
            await axios.get('/api/auth/logout',this.authtoken);
                this.authtoken = null;
                this.authuser = null;
                this.router.push('/login');
        }

    },
    persist:true,
});
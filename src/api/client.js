import axios from "axios";
import { store } from "../store";

const api = axios.create({
    baseURL: "https://www.tatd.in/app-api/driver/",
    timeout: 10000,
});

// https://www.tatd.in/app-api/driver/login/driver-login.php
api.interceptors.response.use(
    (res) => res,
    (error) => {
        const msg = error.response?.data?.message || "something went wrong";
        return Promise.reject(msg);
    }
)

api.interceptors.request.use(
    config =>{
        const token = store.getState().auth.token;
        console.log('token check>>', store.getState())
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error=> Promise.reject({message: 'Request setup Failed'})
)

export default api;
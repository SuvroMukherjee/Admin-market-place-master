

import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_BASE;

export async function AdminLogin(formData) {
    try {
        const response = await axios.post(apiUrl + "/admin/login", formData) 
        return response;
    } catch (error) {
        return error
    }
}


export async function createRole(formData){
    try {
        const response = await axios.post(apiUrl + "/role/create", formData) 
        return response;
    } catch (error) {
        return error
    }
}

export async function allRoleList(){
    try {
        const response = await axios.get(apiUrl + "/role/list") 
        return response;
    } catch (error) {
        return error
    }
}
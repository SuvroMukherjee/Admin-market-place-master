

import axios from 'axios'
import useAuth from '../hooks/useAuth';

const apiUrl = import.meta.env.VITE_API_BASE;


const authString = localStorage.getItem('auth');
const auth = JSON.parse(authString);
const accessToken = auth.accessToken;
console.log(accessToken);

function setAuthHeader() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + accessToken
    }
}

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

{/*** roles api */}
export async function allRoleList(){
    try {
        const response = await axios.get(apiUrl + "/role/list") 
        return response;
    } catch (error) {
        return error
    }
}

export async function updateRole(id,formData){
    try {
        const response = await axios.patch(apiUrl + `/role/update/${id}`,formData) 
        return response;
    } catch (error) {
        return error
    }
}

export async function updateStatusRole(id,formData){
    try {
        const response = await axios.patch(apiUrl + `/role/status-update/${id}`,formData) 
        return response;
    } catch (error) {
        return error
    }
}

export async function deleteApiRole(id){
    try {
        const response = await axios.delete(apiUrl + `/role/delete/${id}`) 
        return response;
    } catch (error) {
        return error
    }
}

{/** Admin api */}
export async function AdminCreateUserList(){
    try {
        const response = await axios.get(apiUrl + "/admin/list")
        return response;
    } catch (error) {
        return error
    }
}

export async function StaffCreateByAdmin(formData){
    try {
        const response = await axios.post(apiUrl + "/admin/staff-add", formData)
        return response;
    } catch (error) {
        return error
    }
}

export async function StaffStatusUpdateByAdmin(id,formData){
    try {
        const response = await axios.patch(apiUrl + `/admin/status-update/${id}`, formData)
        return response;
    } catch (error) {
        return error
    }
}

export async function StaffDetails(id) {
    try {
        const response = await axios.get(apiUrl + `/admin/detail/${id}`)
        return response;
    } catch (error) {
        return error
    }
}

export async function StaffUpdatedDetails(id,formData) {
    try {
        const response = await axios.patch(apiUrl + `/admin/update/${id}`, formData)
        return response;
    } catch (error) {
        return error
    }
}


/** Category Apis */
export async function allCategoryList(){
    try {
        const response = await axios.get(apiUrl + "/category/list")
        return response;
    } catch (error) {
        return error
    }
}

export async function AddProductCategory(formData){
    try {
        const response = await axios.post(apiUrl + "/category/create",formData)
        return response;
    } catch (error) {
        return error
    }
}


export async function UpdateProductCategory(formData,id){
    try {
        const response = await axios.patch(apiUrl + `/category/update/${id}`,formData)
        return response;
    } catch (error) {
        return error
    }
}

export async function UpdateStatusProductCategory(formData,id){
    try {
        const response = await axios.patch(apiUrl + `/category/status-update/${id}`,formData)
        return response;
    } catch (error) {
        return error
    }
}

export async function DeleteProductCategory(id){
    try {
        const response = await axios.delete(apiUrl + `/category/delete/${id}`)
        return response;
    } catch (error) {
        return error
    }
}

/** Sub-Category Apis */
export async function allSubCategoryList(){
    try {
        const response = await axios.get(apiUrl + "/sub-category/list")
        return response;
    } catch (error) {
        return error
    }
}

export async function AddProductSubCategory(formData){
    try {
        const response = await axios.post(apiUrl + "/sub-category/create",formData)
        return response;
    } catch (error) {
        return error
    }
}


export async function UpdateProductSubCategory(formData,id){
    try {
        const response = await axios.patch(apiUrl + `/sub-category/update/${id}`,formData)
        return response;
    } catch (error) {
        return error
    }
}

export async function UpdateStatusProductSubCategory(formData,id){
    try {
        const response = await axios.patch(apiUrl + `/sub-category/status-update/${id}`,formData)
        return response;
    } catch (error) {
        return error
    }
}

export async function DeleteProductSubCategory(id){
    try {
        const response = await axios.delete(apiUrl + `/sub-category/${id}`)
        return response;
    } catch (error) {
        return error
    }
}

/** Brand Apis */

export async function allBrandList(){
    try {
        const response = await axios.get(apiUrl + "/brand/list")
        return response;
    } catch (error) {
        return error
    }
}

export async function AddBrand(formData){
    try {
        const response = await axios.post(apiUrl + "/brand/create",formData)
        return response;
    } catch (error) {
        return error
    }
}


export async function EditBrand(formData,id){
    try {
        const response = await axios.patch(apiUrl + `/brand/update/${id}`,formData)
        return response;
    } catch (error) {
        return error
    }
}

export async function UpdateStatusBrand(formData,id){
    try {
        const response = await axios.patch(apiUrl + `/brand/status-update/${id}`,formData)
        return response;
    } catch (error) {
        return error
    }
}

export async function deleteBrand(id){
    try {
        const response = await axios.delete(apiUrl + `/brand/delete/${id}`)
        return response;
    } catch (error) {
        return error
    }
}

{/** File upload api */}


export async function FileUpload(formData) {
    try {
        const response = await axios.post(apiUrl + `/file/upload`, formData);
        return response;
    } catch (error) {
        return error
    }
}

{/** Product Apis */}

export async function allProductList(){
    try {
        const response = await axios.get(apiUrl + "/product/list",{ headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}


export async function AddNewProduct(formData) {
    try {
        const response = await axios.post(apiUrl + "/product/create", formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}
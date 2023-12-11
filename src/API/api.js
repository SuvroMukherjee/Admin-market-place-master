

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

{/** Product Apis */}

export async function allProductList(){
    try {
        const response = await axios.get(apiUrl + "/product/list")
        return response;
    } catch (error) {
        return error
    }
}

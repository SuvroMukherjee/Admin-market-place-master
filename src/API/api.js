

import axios from 'axios'
import useAuth from '../hooks/useAuth';

const apiUrl = import.meta.env.VITE_API_BASE;
const zipcodekey = import.meta.env.ZIPCODE_BASE_KEY || "7d89a9a0-b6a0-11ee-bda0-153e0d1683dc";

console.log({ zipcodekey })


function setAuthHeader() {

    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + JSON.parse(localStorage.getItem('ACCESS_TOKEN'))
    }
}

function setAuthHeaderForRapi() {
    return {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': '14fcfc6491msh621de8d149e4f32p1d0e1ajsn7d2f562a41a4',
        'X-RapidAPI-Host': 'pincode.p.rapidapi.com'
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


export async function createRole(formData) {
    try {
        const response = await axios.post(apiUrl + "/role/create", formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

{/*** roles api */ }
export async function allRoleList() {
    try {
        const response = await axios.get(apiUrl + "/role/list", { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function updateRole(id, formData) {
    try {
        const response = await axios.patch(apiUrl + `/role/update/${id}`, formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function updateStatusRole(id, formData) {
    try {
        const response = await axios.patch(apiUrl + `/role/status-update/${id}`, formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function deleteApiRole(id) {
    try {
        const response = await axios.delete(apiUrl + `/role/delete/${id}`, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

{/** Admin api */ }
export async function AdminCreateUserList() {
    try {
        const response = await axios.get(apiUrl + "/admin/list", { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function StaffCreateByAdmin(formData) {
    try {
        const response = await axios.post(apiUrl + "/admin/staff-add", formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function StaffStatusUpdateByAdmin(id, formData) {
    try {
        const response = await axios.patch(apiUrl + `/admin/status-update/${id}`, formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function StaffDetails(id) {
    try {
        const response = await axios.get(apiUrl + `/admin/detail/${id}`, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function StaffUpdatedDetails(id, formData) {
    try {
        const response = await axios.patch(apiUrl + `/admin/update/${id}`, formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

{/** Admin seller */ }

export async function AdminSellerLists() {
    try {
        const response = await axios.get(apiUrl + "/seller/all-list", { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function AdminSellerProductLists() {
    try {
        const response = await axios.get(apiUrl + "/seller-new-product/list", { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}


export async function AdminSellerProductStatus(id, formData) {
    try {
        const response = await axios.patch(apiUrl + `/seller-new-product/update-status/${id}`, formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}


/** Category Apis */
export async function allCategoryList() {
    try {
        const response = await axios.get(apiUrl + "/category/list", { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function AddProductCategory(formData) {
    try {
        const response = await axios.post(apiUrl + "/category/create", formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}


export async function UpdateProductCategory(formData, id) {
    try {
        const response = await axios.patch(apiUrl + `/category/update/${id}`, formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function UpdateStatusProductCategory(formData, id) {
    try {
        const response = await axios.patch(apiUrl + `/category/status-update/${id}`, formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function DeleteProductCategory(id) {
    try {
        const response = await axios.delete(apiUrl + `/category/delete/${id}`, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

/** Sub-Category Apis */
export async function allSubCategoryList() {
    try {
        const response = await axios.get(apiUrl + "/sub-category/list", { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function AddProductSubCategory(formData) {
    try {
        const response = await axios.post(apiUrl + "/sub-category/create", formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}


export async function UpdateProductSubCategory(formData, id) {
    try {
        const response = await axios.patch(apiUrl + `/sub-category/update/${id}`, formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function UpdateStatusProductSubCategory(formData, id) {
    try {
        const response = await axios.patch(apiUrl + `/sub-category/status-update/${id}`, formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function DeleteProductSubCategory(id) {
    try {
        const response = await axios.delete(apiUrl + `/sub-category/delete/${id}`, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

/** Brand Apis */

export async function allBrandList() {
    try {
        const response = await axios.get(apiUrl + "/brand/list", { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function AddBrand(formData) {
    try {
        const response = await axios.post(apiUrl + "/brand/create", formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}


export async function EditBrand(formData, id) {
    try {
        const response = await axios.patch(apiUrl + `/brand/update/${id}`, formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function UpdateStatusBrand(formData, id) {
    try {
        const response = await axios.patch(apiUrl + `/brand/status-update/${id}`, formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function deleteBrand(id) {
    try {
        const response = await axios.delete(apiUrl + `/brand/delete/${id}`, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

{/** File upload api */ }


export async function FileUpload(formData) {
    try {
        const response = await axios.post(apiUrl + `/file/upload`, formData);
        return response;
    } catch (error) {
        return error
    }
}

{/** Product Apis */ }

export async function allProductList() {
    try {
        const response = await axios.get(apiUrl + "/product/list")
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

export async function GetProductDetails(id) {
    try {
        const response = await axios.get(apiUrl + `/product/detail/${id}`, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function getSubCategoryByCategory(id) {
    try {
        const response = await axios.get(apiUrl + `/sub-category/list-by-catId/${id}`, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function StatusUpdateProduct(id, fromData) {
    try {
        const response = await axios.patch(apiUrl + `/product/status-update/${id}`, fromData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function UpdateProduct(id, fromData) {
    try {
        const response = await axios.patch(apiUrl + `/product/update/${id}`, fromData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}


export async function deleteProduct(id) {
    try {
        const response = await axios.delete(apiUrl + `/product/delete/${id}`, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function BulkProductUpload(formData) {
    try {
        const response = await axios.post(apiUrl + "/file/product-csv-upload/Product", formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}



export async function ProductSpecificationCreate(formData) {
    try {
        const response = await axios.post(apiUrl + "/specification/create", formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}


export async function UpdateProductSpecification(formData, id) {
    try {
        const response = await axios.patch(apiUrl + `/specification/update/${id}`, formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}


{/**key manager apis */ }

export async function allSellerList() {
    try {
        const response = await axios.get(apiUrl + "/seller/list", { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function addNewsSeller(fromData) {
    try {
        const response = await axios.post(apiUrl + "/seller/create", fromData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function sellerDetails(id) {
    try {
        const response = await axios.get(apiUrl + `/seller/detail/${id}`, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function UpdateSellerData(id, fromData) {
    try {
        const response = await axios.patch(apiUrl + `/seller/update/${id}`, fromData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function UpdateSellerStatus(id, fromData) {
    try {
        const response = await axios.patch(apiUrl + `/seller/status-update/${id}`, fromData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}


export async function setAttendenceLogin(formData){
    try {
        const response = await axios.post(apiUrl + `/attandance/create`, formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}


export async function setAttendenceLogout(formData,id) {
    try {
        const response = await axios.patch(apiUrl + `/attandance/update/${id}`, formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}


export async function attendenceList(id){
    try {
        const response = await axios.get(apiUrl + `/attandance/list/${id}`)
        return response;
    } catch (error) {
        return error
    }
}

{/** seller api */ }

export async function SellerLogin(fromData) {
    try {
        const response = await axios.post(apiUrl + `/seller/login`, fromData)
        return response;
    } catch (error) {
        return error
    }
}


export async function SellerProductAdd(fromData) {
    try {
        const response = await axios.post(apiUrl + `/seller-product/create`, fromData)
        return response;
    } catch (error) {
        return error
    }
}


export async function SellerProductList(id) {
    try {
        const response = await axios.get(apiUrl + `/seller-product/list-by-seller/${id}`)
        return response;
    } catch (error) {
        return error
    }
}

export async function SellerCreateOwn(fromData) {
    try {
        const response = await axios.post(apiUrl + `/seller-new-product/create`, fromData)
        return response;
    } catch (error) {
        return error
    }
}

export async function OwnProductSellerList(id) {
    try {
        const response = await axios.get(apiUrl + `/seller-new-product/list-by-seller/${id}`)
        return response;
    } catch (error) {
        return error
    }
}

export async function SellerOwnProductDetails(id) {
    try {
        const response = await axios.get(apiUrl + `/seller-new-product/detail/${id}`)
        return response;
    } catch (error) {
        return error
    }
}

export async function EditSellerOwnProduct(id, formData) {
    try {
        const response = await axios.patch(apiUrl + `/seller-new-product/update/${id}`, formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function creteBannerType(formData) {
    try {
        const response = await axios.post(apiUrl + `/banner-type/create`, formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}
export async function bannerTypeList() {
    try {
        const response = await axios.get(apiUrl + `/banner-type/list`, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function createBannerImages(formData) {
    try {
        const response = await axios.post(apiUrl + `/banner/create`, formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function updateBannerImages(formData, id) {
    try {
        const response = await axios.patch(apiUrl + `/banner/update/${id}`, formData, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function BannerImagesLists() {
    try {
        const response = await axios.get(apiUrl + `/banner/list`, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function DeleteBanner(id) {
    try {
        const response = await axios.delete(apiUrl + `/banner/delete/${id}`, { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

export async function UpdateSellerProduct(id,fromData) {
    try {
        const response = await axios.patch(apiUrl + `/seller-product/update/${id}`, fromData , { headers: setAuthHeader() })
        return response;
    } catch (error) {
        return error
    }
}

{/** commission create  */ } 

export async function createCommission(fromData) {
    try {
        const response = await axios.post(apiUrl + `/commission/create`, fromData)
        return response;
    } catch (error) {
        return error
    }
}


export async function getCommission(id) {
    try {
        const response = await axios.get(apiUrl + `/commission/list-by-sellerId/${id}`)
        return response;
    } catch (error) {
        return error
    }
}


export async function sellerStockoutlist(id){
    try {
        const response = await axios.get(apiUrl + `/seller-product/order-list/${id}`)
        return response;
    } catch (error) {
        return error
    }
}


export async function sellerOrderLists(id){
    try {
        const response = await axios.get(apiUrl + `/order/list-by-sellerId/${id}`)
        return response;
    } catch (error) {
        return error
    }
}

export async function sellerProductDeatils(id) {
    try {
        const response = await axios.get(apiUrl + `/seller-product/detail/${id}`)
        return response;
    } catch (error) {
        return error
    }
}


{/**location api -Rapid apis(free) */ }


export async function getLocation() {
    let formData = {
        "searchBy": "pincode",
        "value": 110001
    }
    try {
        const response = await axios.get(apiUrl + `/banner/list`, formData, { headers: setAuthHeaderForRapi() })
        return response;
    } catch (error) {
        return error
    }
}




{/** zip code base apis.. */ }

export async function getLocationByZipCoder(pincode) {
    try {
        const response = await axios.get(`https://app.zipcodebase.com/api/v1/search?apikey=${zipcodekey}&codes=${pincode}`)
        return response;
    } catch (error) {
        return error
    }
}


{/** free apis... */ }


{/*** Rapid apis */ }


{/** get location data from lat,long  */ }

export async function getUserLoginLocation(latitude, longitude) {
    try{
        const response = await axios.get(` http://api.weatherapi.com/v1/current.json?key=5e07887c5e3f4e1cbcc45540241501&q=${latitude},${longitude}&aqi=yes`)
        return response;
    } catch (error) {
        return error
    }
}


export async function orderStatusUpdate(fromdata,id){
    try {
        const response = await axios.patch(apiUrl + `/order/status-update/${id}`, fromdata)
        return response;
    } catch (error) {
        return error
    }
}
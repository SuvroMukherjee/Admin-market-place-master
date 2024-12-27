import axios from "axios";
import useAuth from "../hooks/useAuth";

const apiUrl = import.meta.env.VITE_API_BASE;
const zipcodekey =
  import.meta.env.ZIPCODE_BASE_KEY || "7d89a9a0-b6a0-11ee-bda0-153e0d1683dc";

console.log({ zipcodekey });

function setAuthHeader() {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + JSON.parse(localStorage.getItem("ACCESS_TOKEN")),
  };
}

function setAuthHeaderForRapi() {
  return {
    "content-type": "application/json",
    "Content-Type": "application/json",
    "X-RapidAPI-Key": "14fcfc6491msh621de8d149e4f32p1d0e1ajsn7d2f562a41a4",
    "X-RapidAPI-Host": "pincode.p.rapidapi.com",
  };
}

export async function AdminLogin(formData) {
  try {
    const response = await axios.post(apiUrl + "/admin/login", formData);
    return response;
  } catch (error) {
    return error;
  }
}

export async function createRole(formData) {
  try {
    const response = await axios.post(apiUrl + "/role/create", formData, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

{
  /*** roles api */
}
export async function allRoleList() {
  try {
    const response = await axios.get(apiUrl + "/role/list", {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function updateRole(id, formData) {
  try {
    const response = await axios.patch(
      apiUrl + `/role/update/${id}`,
      formData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function updateStatusRole(id, formData) {
  try {
    const response = await axios.patch(
      apiUrl + `/role/status-update/${id}`,
      formData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function deleteApiRole(id) {
  try {
    const response = await axios.delete(apiUrl + `/role/delete/${id}`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

{
  /** Admin api */
}
export async function AdminCreateUserList() {
  try {
    const response = await axios.get(apiUrl + "/admin/list", {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function StaffCreateByAdmin(formData) {
  try {
    const response = await axios.post(apiUrl + "/admin/staff-add", formData, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function StaffStatusUpdateByAdmin(id, formData) {
  try {
    const response = await axios.patch(
      apiUrl + `/admin/status-update/${id}`,
      formData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function StaffDetails(id) {
  try {
    const response = await axios.get(apiUrl + `/admin/detail/${id}`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function StaffUpdatedDetails(id, formData) {
  try {
    const response = await axios.patch(
      apiUrl + `/admin/update/${id}`,
      formData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

{
  /** Admin seller */
}

export async function AdminSellerLists() {
  try {
    const response = await axios.get(apiUrl + "/seller/all-list", {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function AdminSellerProductLists() {
  try {
    const response = await axios.get(apiUrl + "/seller-new-product/list", {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function AdminSellerProductStatus(id, formData) {
  try {
    const response = await axios.patch(
      apiUrl + `/seller-new-product/update-status/${id}`,
      formData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

/** Category Apis */
export async function allCategoryList() {
  try {
    const response = await axios.get(apiUrl + "/category/list", {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function AddProductCategory(formData) {
  try {
    const response = await axios.post(apiUrl + "/category/create", formData, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function UpdateProductCategory(formData, id) {
  try {
    const response = await axios.patch(
      apiUrl + `/category/update/${id}`,
      formData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function UpdateStatusProductCategory(formData, id) {
  try {
    const response = await axios.patch(
      apiUrl + `/category/status-update/${id}`,
      formData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function DeleteProductCategory(id) {
  try {
    const response = await axios.delete(apiUrl + `/category/delete/${id}`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

/********* Sub-Category Apis *********/

export async function allSubCategoryList() {
  try {
    const response = await axios.get(apiUrl + "/sub-category/list", {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function AddProductSubCategory(formData) {
  try {
    const response = await axios.post(
      apiUrl + "/sub-category/create",
      formData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function UpdateProductSubCategory(formData, id) {
  try {
    const response = await axios.patch(
      apiUrl + `/sub-category/update/${id}`,
      formData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function UpdateStatusProductSubCategory(formData, id) {
  try {
    const response = await axios.patch(
      apiUrl + `/sub-category/status-update/${id}`,
      formData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function DeleteProductSubCategory(id) {
  try {
    const response = await axios.delete(apiUrl + `/sub-category/delete/${id}`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function getSubCategoryByCategory(id) {
  try {
    const response = await axios.get(
      apiUrl + `/sub-category/list-by-catId/${id}`,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function subCategoryReqList() {
  try {
    const response = await axios.get(apiUrl + `/sub-category/subcat-list`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function getSubCategoryDetails(id) {
  try {
    const response = await axios.get(apiUrl + `/sub-category/detail/${id}`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

/********* Brand Apis ***********/

export async function allBrandList() {
  try {
    const response = await axios.get(apiUrl + "/brand/list", {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function BrandDetails(id) {
  try {
    const response = await axios.get(apiUrl + `/brand/detail/${id}`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function AddBrand(formData) {
  try {
    const response = await axios.post(apiUrl + "/brand/create", formData, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function EditBrand(formData, id) {
  try {
    const response = await axios.patch(
      apiUrl + `/brand/update/${id}`,
      formData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function UpdateStatusBrand(formData, id) {
  try {
    const response = await axios.patch(
      apiUrl + `/brand/status-update/${id}`,
      formData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function deleteBrand(id) {
  try {
    const response = await axios.delete(apiUrl + `/brand/delete/${id}`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

{
  /** File upload api */
}

export async function FileUpload(formData) {
  try {
    const response = await axios.post(apiUrl + `/file/upload`, formData);
    return response;
  } catch (error) {
    return error;
  }
}

{
  /** Product Apis */
}

export async function allProductList() {
  try {
    const response = await axios.get(apiUrl + "/product/list");
    return response;
  } catch (error) {
    return error;
  }
}

export async function AddNewProduct(formData) {
  try {
    const response = await axios.post(apiUrl + "/product/create", formData, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function GetProductDetails(id) {
  try {
    const response = await axios.get(apiUrl + `/product/detail/${id}`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function StatusUpdateProduct(id, fromData) {
  try {
    const response = await axios.patch(
      apiUrl + `/product/status-update/${id}`,
      fromData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

// export async function UpdateProduct(id, fromData) {
//   try {
//     const response = await axios.patch(
//       apiUrl + `/product/update/${id}`,
//       fromData,
//       { headers: setAuthHeader() }
//     );
//     return response;
//   } catch (error) {
//     return error;
//   }
// }

export async function UpdateProduct(id, fromData) {
  try {
    const response = await axios.patch(
      apiUrl + `/product/update-data/${id}`,
      fromData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function deleteProduct(id) {
  try {
    const response = await axios.delete(apiUrl + `/product/delete/${id}`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function BulkProductUpload(formData) {
  try {
    const response = await axios.post(
      apiUrl + "/file/product-csv-upload/Product",
      formData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function SpecBulkProductUpload(formData) {
  try {
    const response = await axios.post(
      apiUrl + "/file/product-csv-upload/spec",
      formData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function ProductSpecificationCreate(formData) {
  try {
    const response = await axios.post(
      apiUrl + "/specification/create",
      formData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function UpdateProductSpecification(id, formData) {
  console.log(id, formData, "id, formData");
  try {
    const response = await axios.patch(
      apiUrl + `/specification/update/${id}`,
      formData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function DeleteProductSpecification(id) {
  try {
    const response = await axios.delete(apiUrl + `/specification/delete/${id}`);
    return response;
  } catch (error) {
    return error;
  }
}

{
  /**key manager apis */
}

export async function allSellerList() {
  try {
    const response = await axios.get(apiUrl + "/seller/list", {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function addNewsSeller(fromData) {
  try {
    const response = await axios.post(apiUrl + "/seller/create", fromData, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function sellerDetails(id) {
  try {
    const response = await axios.get(apiUrl + `/seller/detail/${id}`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function UpdateSellerData(id, fromData) {
  try {
    const response = await axios.patch(
      apiUrl + `/seller/update/${id}`,
      fromData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function UpdateSellerStatus(id, fromData) {
  try {
    const response = await axios.patch(
      apiUrl + `/seller/status-update/${id}`,
      fromData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function setAttendenceLogin(formData) {
  try {
    const response = await axios.post(apiUrl + `/attandance/create`, formData, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function setAttendenceLogout(formData, id) {
  try {
    const response = await axios.patch(
      apiUrl + `/attandance/update/${id}`,
      formData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function attendenceList(id) {
  try {
    const response = await axios.get(apiUrl + `/attandance/list/${id}`);
    return response;
  } catch (error) {
    return error;
  }
}

{
  /********** Seller api ***********/
}

export async function SellerLogin(fromData) {
  try {
    const response = await axios.post(apiUrl + `/seller/login`, fromData);
    return response;
  } catch (error) {
    return error;
  }
}

export async function SellerProductAdd(fromData) {
  try {
    const response = await axios.post(
      apiUrl + `/seller-product/create`,
      fromData
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function SellerAllProductList() {
  try {
    const response = await axios.get(apiUrl + `/seller-product/list`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function listBySellerPaginated(sellerId, query) {
  try {
    const response = await axios.get(
      apiUrl + `/seller-product/list-by-seller-paginated/${sellerId}`,
      { params: query }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function SellerProductList(id) {
  try {
    const response = await axios.get(
      apiUrl + `/seller-product/list-by-seller/${id}`
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function SellerCreateOwn(fromData) {
  try {
    const response = await axios.post(
      apiUrl + `/seller-new-product/create`,
      fromData
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function OwnProductSellerList(id) {
  try {
    const response = await axios.get(
      apiUrl + `/seller-new-product/list-by-seller/${id}`
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function SellerOwnProductDetails(id) {
  try {
    const response = await axios.get(
      apiUrl + `/seller-new-product/detail/${id}`
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function EditSellerOwnProduct(id, formData) {
  try {
    const response = await axios.patch(
      apiUrl + `/seller-new-product/update/${id}`,
      formData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function UpdateSellerProductDataStatus(id, formData) {
  try {
    const response = await axios.patch(
      apiUrl + `/seller-product/status-update/${id}`,
      formData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function creteBannerType(formData) {
  try {
    const response = await axios.post(
      apiUrl + `/banner-type/create`,
      formData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}
export async function bannerTypeList() {
  try {
    const response = await axios.get(apiUrl + `/banner-type/list`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function createBannerImages(formData) {
  try {
    const response = await axios.post(apiUrl + `/banner/create`, formData, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function updateBannerImages(formData, id) {
  try {
    const response = await axios.patch(
      apiUrl + `/banner/update/${id}`,
      formData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function BannerImagesLists() {
  try {
    const response = await axios.get(apiUrl + `/banner/list`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function DeleteBanner(id) {
  try {
    const response = await axios.delete(apiUrl + `/banner/delete/${id}`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function UpdateSellerProduct(id, fromData) {
  try {
    const response = await axios.patch(
      apiUrl + `/seller-product/update/${id}`,
      fromData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function PasswordReset(id, fromData) {
  try {
    const response = await axios.patch(
      apiUrl + `/seller/change-password/${id}`,
      fromData
    );
    return response;
  } catch (error) {
    return error;
  }
}

{
  /****** Commission api  *******/
}

export async function createCommission(fromData) {
  try {
    const response = await axios.post(apiUrl + `/commission/create`, fromData);
    return response;
  } catch (error) {
    return error;
  }
}

export async function deleteCommission(id) {
  try {
    const response = await axios.delete(apiUrl + `/commission/delete/${id}`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function updateCommission(fromData, id) {
  try {
    const response = await axios.patch(
      apiUrl + `/commission/update/${id}`,
      fromData
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function getCommission(id) {
  try {
    const response = await axios.get(
      apiUrl + `/commission/list-by-sellerId/${id}`
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function sellerStockoutlist(id) {
  try {
    const response = await axios.get(
      apiUrl + `/seller-product/order-list/${id}`
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function AllOrderListsByAdmin() {
  try {
    const response = await axios.get(apiUrl + `/seller-report/all-report`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function sellerOrderLists(id) {
  try {
    const response = await axios.get(apiUrl + `/order/list-by-sellerId/${id}`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function sellerReturnRequestList() {
  try {
    const response = await axios.get(
      apiUrl + `/product-return/list-by-sellerId`,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function sellerProductDeatils(id) {
  try {
    const response = await axios.get(apiUrl + `/seller-product/detail/${id}`);
    return response;
  } catch (error) {
    return error;
  }
}

{
  /**location api -Rapid apis(free) */
}

export async function getLocation() {
  let formData = {
    searchBy: "pincode",
    value: 110001,
  };
  try {
    const response = await axios.get(apiUrl + `/banner/list`, formData, {
      headers: setAuthHeaderForRapi(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

{
  /** zip code base apis.. */
}

export async function getLocationByZipCoder(pincode) {
  try {
    const response = await axios.get(
      `https://app.zipcodebase.com/api/v1/search?apikey=${zipcodekey}&codes=${pincode}`
    );
    return response;
  } catch (error) {
    return error;
  }
}

{
  /** free apis... */
}

{
  /*** Rapid apis */
}

{
  /** get location data from lat,long  */
}

export async function getUserLoginLocation(latitude, longitude) {
  try {
    const response = await axios.get(
      ` http://api.weatherapi.com/v1/current.json?key=5e07887c5e3f4e1cbcc45540241501&q=${latitude},${longitude}&aqi=yes`
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function orderStatusUpdate(fromdata, id) {
  try {
    const response = await axios.patch(
      apiUrl + `/order/status-update/${id}`,
      fromdata,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function sellerOwnRegistrationForm(formData, id) {
  try {
    const response = await axios.post(apiUrl + `/seller/self-create`, formData);
    return response;
  } catch (error) {
    return error;
  }
}

export async function UpdatesellerOwnRegistrationForm(formData, id) {
  try {
    const response = await axios.patch(
      apiUrl + `/seller/update/${id}`,
      formData
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function allcatList() {
  try {
    const response = await axios.get(apiUrl + `/category/all-list`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function categoryDetails(id) {
  try {
    const response = await axios.get(apiUrl + `/category/detail/${id}`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function allCommissionList() {
  try {
    const response = await axios.get(apiUrl + `/commission/list`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function allIndiaCities() {
  try {
    const response = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/states",
      {
        country: "India",
      }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function commandOnOrder(id, formData) {
  try {
    const response = await axios.patch(
      apiUrl + `/order/update/${id}`,
      formData
    );
    return response;
  } catch (error) {
    return error;
  }
}

//seller requests apis

export async function allCategoryeqList() {
  try {
    const response = await axios.get(apiUrl + `/category/cat-list`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}
export async function topCatList() {
  try {
    const response = await axios.get(apiUrl + `/category/topcat-list`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function allBrandreqList() {
  try {
    const response = await axios.get(apiUrl + `/brand/brand-list`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function categoryApproval(formdata, id) {
  try {
    const response = await axios.patch(
      apiUrl + `/category/approval-update/${id}`,
      formdata,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function SubcategoryApproval(formdata, id) {
  try {
    const response = await axios.patch(
      apiUrl + `/sub-category/approval-update/${id}`,
      formdata,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function BrandApproval(formdata, id) {
  try {
    const response = await axios.patch(
      apiUrl + `/brand/approval-update/${id}`,
      formdata,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function sellerCategoryRequestList() {
  try {
    const response = await axios.get(apiUrl + `/category/list-approval`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function sellerBrandRequestList() {
  try {
    const response = await axios.get(apiUrl + `/brand/list-approval`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}
export async function deleteSellerOwnProduct(id) {
  try {
    const response = await axios.delete(
      apiUrl + `/seller-new-product/delete/${id}`
    );
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function sellerNewAddedProductDtails(id) {
  try {
    const response = await axios.get(
      apiUrl + `/seller-new-product/detail/${id}`,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function offerTypeCreate(formData) {
  try {
    const response = await axios.post(apiUrl + `/offer-type/create`, formData, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function offerTypeList() {
  try {
    const response = await axios.get(apiUrl + `/offer-type/list`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function offerCreate(formData) {
  try {
    const response = await axios.post(apiUrl + `/offer/create`, formData, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function getLowestPriceProdut(id) {
  try {
    const response = await axios.get(
      apiUrl + `/seller-product/lowest-prod/${id}`,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

{
  /** advertising */
}

export async function getAllCampaignList() {
  try {
    const response = await axios.get(apiUrl + `/campaign-type/list`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function campaignCreate(formData) {
  try {
    const response = await axios.post(apiUrl + `/campaign/create`, formData, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function getAllCampaignSellerList() {
  try {
    const response = await axios.get(apiUrl + `/campaign/list`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function sellerProductBulkUpload(formData) {
  try {
    const response = await axios.post(
      apiUrl + `/file/seller-new-product-csv-upload/Product`,
      formData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function sellerVariationsBulkUpload(formData) {
  try {
    const response = await axios.post(
      apiUrl + `/file/seller-new-product-csv-upload/spec`,
      formData,
      { headers: setAuthHeader() }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function ReportLists() {
  try {
    const response = await axios.get(apiUrl + `/seller-report/report-list`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function ReportListsWithDate(startDate, endDate) {
  try {
    const response = await axios.get(apiUrl + "/seller-report/report-list", {
      headers: setAuthHeader(),
      params: {
        startDate: startDate,
        endDate: endDate,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function getReportListBySellerId(id) {
  try {
    const response = await axios.get(
      apiUrl + `/seller-report/report-list/${id}`,
      {
        headers: setAuthHeader(),
      }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function getReportListBySellerIdWithDate(id, startDate, endDate) {
  try {
    const response = await axios.get(
      apiUrl + `/seller-report/report-list/${id}`,
      {
        headers: setAuthHeader(),
        params: {
          startDate: startDate,
          endDate: endDate,
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function deleteSellerById(sellerId) {
  try {
    const response = await axios.delete(apiUrl + `/seller/delete/` + sellerId, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function getAdminNotification() {
  try {
    const response = await axios.get(apiUrl + `/notification/list`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function makeSeenNotification(id) {
  try {
    const response = await axios.get(apiUrl + `/notification/update/${id}`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function makeAllSeenNotification() {
  try {
    const response = await axios.get(apiUrl + `/notification/markallasread`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function EmailSendForgotSeler(payload) {
  try {
    const response = await axios.post(
      apiUrl + `/seller/forget-password`,
      payload
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function SellerVerifyOtp(payload) {
  try {
    const response = await axios.post(apiUrl + `/seller/verify-otp`, payload);
    return response;
  } catch (error) {
    return error;
  }
}

export async function SellerResetPassword(payload) {
  try {
    const response = await axios.patch(
      apiUrl + `/seller/reset-password`,
      payload
    );
    return response;
  } catch (error) {
    return error;
  }
}

//

export async function EmailSendForgotUser(payload) {
  try {
    const response = await axios.post(
      apiUrl + `/admin/forget-password`,
      payload
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function UserVerifyOtp(payload) {
  try {
    const response = await axios.post(apiUrl + `/admin/verify-otp`, payload);
    return response;
  } catch (error) {
    return error;
  }
}

export async function UserResetPassword(payload) {
  try {
    const response = await axios.patch(
      apiUrl + `/admin/reset-password`,
      payload
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function fetchTestimonialList() {
  try {
    const response = await axios.get(apiUrl + `/testimonial/list`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function deleteTestimonial(id) {
  try {
    const response = await axios.delete(apiUrl + `/testimonial/delete/${id}`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function editTestimonial(id, formData) {
  try {
    const response = await axios.patch(
      apiUrl + `/testimonial/update/${id}`,
      formData
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function fetchSingleTestimonial(id) {
  try {
    const response = await axios.get(apiUrl + `/testimonial/detail/${id}`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function addTestimonial(formData) {
  try {
    const response = await axios.post(apiUrl + `/testimonial/create`, formData);
    return response;
  } catch (error) {
    return error;
  }
}

// new-banner
export async function bannerTypesdata() {
  try {
    const response = await axios.get(apiUrl + `/video-type/list`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function creteBannerTypeNew(payload) {
  try {
    const response = await axios.post(apiUrl + `/video-type/create`, payload, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function DeleteVideoType(id) {
  try {
    const response = await axios.delete(apiUrl + `/video-type/delete/${id}`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function VideoByTypeList(id) {
  try {
    const response = await axios.get(apiUrl + `/video/list-by-typeId/${id}`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function UpdateVideoData(id, payload) {
  try {
    const response = await axios.patch(
      apiUrl + `/video/update/${id}`,
      payload,
      {
        headers: setAuthHeader(),
      }
    );
    return response;
  } catch (error) {
    return error;
  }
}

// payment update api for ordered product
export async function PaymentUpdate(id, formData) {
  try {
    const response = await axios.patch(
      apiUrl + `/order/payment-update/${id}`,
      formData
    );
    return response;
  } catch (error) {
    return error;
  }
}

// Best seller apis
export async function GetBestSellerProductList() {
  try {
    const response = await axios.get(
      apiUrl + `/seller-product/bestseller-list`
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function BestSellerProductUpdate(id, formData) {
  try {
    const response = await axios.patch(
      apiUrl + `/seller-product/bestsell-update/${id}`,
      formData,
      {
        headers: setAuthHeader(),
      }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function GetAllServices() {
  try {
    const response = await axios.get(apiUrl + `/product-service/list`);
    return response;
  } catch (error) {
    return error;
  }
}
export async function addProductService(formData) {
  try {
    const response = await axios.post(
      apiUrl + `/product-service/create`,
      formData
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function deleteProductService(id) {
  try {
    const response = await axios.delete(
      apiUrl + `/product-service/delete/${id}`
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function addSerivices(id, formData) {
  try {
    const response = await axios.get(
      apiUrl + `/product-service/list/${id}`,
      formData
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function editProductService(id, fromData) {
  try {
    const response = await axios.patch(
      apiUrl + `/product-service/update/${id}`,
      fromData
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function fetchSingleProductService(id) {
  try {
    const response = await axios.get(apiUrl + `/product-service/detail/${id}`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function fetchProductServiceList() {
  try {
    const response = await axios.get(apiUrl + `/product-service/list`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function MakePopularProduct(formData, id) {
  try {
    const response = await axios.patch(
      apiUrl + `/seller-product/bestsell-update/${id}`,
      formData,
      {
        headers: setAuthHeader(),
      }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function productWithPagination(page, limit) {
  try {
    const response = await axios.get(
      apiUrl + `/product/all-list?page=${page}&limit=${limit}`
    );
    return response;
  } catch (error) {
    return error;
  }
}
export async function allTransactionList(page, limit) {
  try {
    const response = await axios.get(
      apiUrl + `/product/all-list?page=${page}&limit=${limit}`
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function razorpayPaymentDetailsData(paymentId) {
  try {
    const response = await axios.get(
      apiUrl + `/payment/details?paymentId=${paymentId}`
    );
    return response;
  } catch (error) {
    throw new Error(error?.message);
  }
}

export async function createRefundRequest(formData) {
  try {
    const response = await axios.post(
      apiUrl + `/refund-request/create`,
      formData,
      {
        headers: setAuthHeader(),
      }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function sellerRefurnRequestList() {
  try {
    const response = await axios.get(apiUrl + `/refund-request/seller-list`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}
export async function AdminRefundRequestList(query) {
  try {
    const response = await axios.get(apiUrl + `/refund-request/list`, {
      params: query,
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function updateReturnStatus(formData, ordId, Proid) {
  try {
    const response = await axios.put(
      apiUrl + `/product-return/update-return-status/${ordId}/${Proid}`,
      formData,
      {
        headers: setAuthHeader(),
      }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function getRefundRequestCreate(formData) {
  try {
    const response = await axios.post(
      apiUrl + `/refund-request/create`,
      formData,
      {
        headers: setAuthHeader(),
      }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function updateRefundRequest(id, formData) {
  try {
    const response = await axios.patch(
      apiUrl + `/refund-request/update/${id}`,
      formData,
      {
        headers: setAuthHeader(),
      }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function RazorpayRefundRequest(formData) {
  try {
    const response = await axios.post(apiUrl + `/payment/refund`, formData, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createPayment(formData) {
  try {
    const response = await axios.post(apiUrl + `/ledger/create`, formData, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function getSearcKeyword(id) {
  try {
    const response = await axios.get(
      apiUrl + `/seller-product/get-keyword-search/${id}`
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function addCategoryKeyword(id, formdata) {
  try {
    const response = await axios.patch(
      apiUrl + `/category/add-keyword/${id}`,
      formdata
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function removeCategoryKeyword(id, formdata) {
  try {
    const response = await axios.patch(
      apiUrl + `/category/remove-keyword/${id}`,
      formdata
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function allCustomersList(query) {
  try {
    const response = await axios.get(
      apiUrl +
        `/customer/customer-list?page=${query.page}&limit=${query.limit}`,
      {
        headers: setAuthHeader(),
      }
    );
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
// "help/create" post
// "help/get-all-list" get
// "help/get-by-id/:id" get
// "help/update-by-id/:id" patch
// "help/delete-by-id/:id" delete

export async function createHelpDesk(formData) {
  try {
    const response = await axios.post(apiUrl + `/help/create`, formData);
    return response;
  } catch (error) {
    return error;
  }
}

export async function getAllHelpDeskList() {
  try {
    const response = await axios.get(apiUrl + `/help/get-all-list`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function getHelpDeskById(id) {
  try {
    const response = await axios.get(apiUrl + `/help/get-by-id/${id}`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function updateHelpDeskById(id, formData) {
  try {
    const response = await axios.patch(
      apiUrl + `/help/update-by-id/${id}`,
      formData
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function deleteHelpDeskById(id) {
  try {
    const response = await axios.delete(apiUrl + `/help/delete-by-id/${id}`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function offerTypeDelete(id) {
  try {
    const response = await axios.delete(apiUrl + `/offer/delete/${id}`);
    return response;
  } catch (error) {
    return error;
  }
}

// Updated offer api's based on category and brand

export async function newOfferCreate(formData) {
  try {
    const response = await axios.post(
      apiUrl + `/offer-management/create`,
      formData
    );
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function allOfferList() {
  try {
    const response = await axios.get(apiUrl + `/offer-management/all-list`, {
      headers: setAuthHeader(),
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function AdminOfferDelete(id) {
  try {
    const response = await axios.delete(
      apiUrl + `/offer-management/delete/${id}`
    );
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
export async function AdminOfferUpdate(id, formData) {
  try {
    const response = await axios.patch(
      apiUrl + `/offer-management/update/${id}`,
      formData
    );
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

{
  /** {{base_url}}/seller/verify-both-otp */
}

export async function verifyOTP(payload) {
  try {
    const response = await axios.post(
      apiUrl + `/seller/verify-both-otp`,
      payload
    );
    return response;
  } catch (error) {
    return error;
  }
}

/** seller/resend-otp */

export async function resendOtp(payload) {
  try {
    const response = await axios.post(apiUrl + `/seller/resend-otp`, payload);
    return response;
  } catch (error) {
    return error;
  }
}

///seller/request-edit-otp
export async function EditVerification(payload) {
  try {
    const response = await axios.post(
      apiUrl + `/seller/request-edit-otp`,
      payload
    );
    return response;
  } catch (error) {
    return error;
  }
}

//seller/verify-edit-otp

export async function VerifyEditOtp(payload) {
  try {
    const response = await axios.post(
      apiUrl + `/seller/verify-edit-otp`,
      payload
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function getOffers(brandId, categoryId) {
  try {
    const response = await axios.get(
      apiUrl + `/offer-management/list?brand=${brandId}&category=${categoryId}`
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function getAllBrandsBycat(categoryId) {
  try {
    const response = await axios.get(
      apiUrl + `/brand/master-brand-with-product-count?categoryId=${categoryId}`
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function getAllCategoryBybrand(brandId) {
  try {
    const response = await axios.get(
      apiUrl + `/category/master-category-with-product-count?brandId=${brandId}`
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function SellersgetAllBrandsBycat(categoryId) {
  try {
    const response = await axios.get(
      apiUrl + `/brand/brand-with-product-count?categoryId=${categoryId}`
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function SellergetAllCategoryBybrand(brandId) {
  try {
    const response = await axios.get(
      apiUrl + `/category/category-with-product-count?brandId=${brandId}`
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function createNewSellerPermission(formData) {
  try {
    const response = await axios.post(
      apiUrl +
        `/seller-permission-request/create-map-seller-category-brand-request`,
      formData,
      {
        headers: setAuthHeader(),
      }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function getPermittedCatalogue(sellerId) {
  try {
    const response = await axios.get(
      apiUrl + `/seller-permission/get-seller-category-brand-map/${sellerId}`,
      {
        headers: setAuthHeader(),
      }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function getSellerCategoryRequest() {
  try {
    const response = await axios.get(
      apiUrl +
        `/seller-permission-request/get-map-seller-category-brand-request`,
      {
        headers: setAuthHeader(),
      }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function UpdateSellerCategoryRequestList(formData) {
  try {
    const response = await axios.patch(
      apiUrl +
        `/seller-permission-request/update-map-seller-category-brand-request`,
      formData,
      {
        headers: setAuthHeader(),
      }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function UpdateSellerPermission(formData) {
  try {
    const response = await axios.post(
      apiUrl + `/seller-permission/map-seller-category-brand`,
      formData,
      {
        headers: setAuthHeader(),
      }
    );
    return response;
  } catch (error) {
    return error;
  }
}

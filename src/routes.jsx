import { Navigate, useRoutes } from "react-router-dom";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import useAuth from "./hooks/useAuth";
import AdminLayout from "./Layouts/AdminLayout";
import FrontPage from "./Layouts/FrontPage/FrontPage";
import LoginPage from "./Login/LoginPage";
import SellerLoginPage from "./Login/SellerLoginPage";
import AddUser from "./Pages/AddUser/AddUser";
import BannerManagment from "./Pages/BannerManagemnt/BannerManagment";
import Home from "./Pages/Home/Home";
import AttendenceComp from "./Pages/KeyManager/Dashboard/AttendenceComp";
import Dashboard from "./Pages/KeyManager/Dashboard/Dashboard";
import Addseller from "./Pages/KeyManager/Seller/Addseller";
import ListSeller from "./Pages/KeyManager/Seller/ListSeller";
import KeySellerdetails from "./Pages/KeyManager/Seller/Registration/KeySellerdetails";
import SellerEditForm from "./Pages/KeyManager/Seller/SellerEditForm";
import AddBrandPage from "./Pages/ProductManagement/Brand/AddBrandPage";
import BrandReqList from "./Pages/ProductManagement/Brand/BrandReqList";
import ListBrand from "./Pages/ProductManagement/Brand/ListBrand";
import AddCategory from "./Pages/ProductManagement/Category/AddCategory";
import CategoryComissions from "./Pages/ProductManagement/Category/CategoryComissions";
import CatReqList from "./Pages/ProductManagement/Category/CatReqList";
import ListCategory from "./Pages/ProductManagement/Category/ListCategory";
import Imageconverter from "./Pages/ProductManagement/ImageConverter/Imageconverter";
import Offer from "./Pages/ProductManagement/Offer/Offer";
import ProductOffer from "./Pages/ProductManagement/Offer/ProductOffer";
import AddProduct from "./Pages/ProductManagement/Product/AddProduct";
import EditProduct from "./Pages/ProductManagement/Product/EditProduct";
import ListProduct from "./Pages/ProductManagement/Product/ListProduct";
import AddSubCategory from "./Pages/ProductManagement/SubCategory/AddSubCategory";
import ListSubCategory from "./Pages/ProductManagement/SubCategory/ListSubCategory";
import { Roles } from "./Pages/Roles/Roles";
import SellerDetails from "./Pages/SellerManagment/SellerDetails";
import SellerListManage from "./Pages/SellerManagment/SellerListManage";
import SellerReport from "./Pages/SellerManagment/SellerReport";
import SellerSalesReport from "./Pages/SellerManagment/SellerSalesReport";
import ProductListBySeller from "./Pages/SellerProductManagment/ProductListBySeller";
import SellerProductManagment from "./Pages/SellerProductManagment/SellerProductManagment";
import SellerRegistrationPage from "./Pages/SellerRegistration/SellerRegistrationPage";
import EditOwnProduct from "./Pages/StoreSeller/EditOwnProduct";
import AdvertisingProduct from "./Pages/StoreSeller/Layout/AdvertisingProduct";
import BulkUploadProduct from "./Pages/StoreSeller/Layout/BulkUploadProduct";
import CampaignDetails from "./Pages/StoreSeller/Layout/CampaignDetails";
import Customerfeedback from "./Pages/StoreSeller/Layout/Customerfeedback";
import DisplayCampaign from "./Pages/StoreSeller/Layout/DisplayCampaign";
import ManageOrders from "./Pages/StoreSeller/Layout/ManageOrders";
import NewAddProduct from "./Pages/StoreSeller/Layout/NewAddProduct";
import NewSellerDashboard from "./Pages/StoreSeller/Layout/NewSellerDashboard";
import OrderList from "./Pages/StoreSeller/Layout/OrderList";
import ProfilePage from "./Pages/StoreSeller/Layout/ProfilePage";
import Report from "./Pages/StoreSeller/Layout/Report";
import ResetPassComp from "./Pages/StoreSeller/Layout/ResetPassComp";
import ReturnOrderList from "./Pages/StoreSeller/Layout/ReturnOrderList";
import ReturnOrderRequestList from "./Pages/StoreSeller/Layout/ReturnOrderRequestList";
import SellerInventory from "./Pages/StoreSeller/Layout/SellerInventory";
import SellerLayout from "./Pages/StoreSeller/Layout/SellerLayout";
import SellerProductDetails from "./Pages/StoreSeller/Layout/SellerProductDetails";
import ServicesFeedback from "./Pages/StoreSeller/Layout/ServicesFeedback";
import ApprovalPendingList from "./Pages/StoreSeller/NewProductAddition/ApprovalPendingList";
import BrandRequest from "./Pages/StoreSeller/NewProductAddition/BrandRequest";
import CategoryRequest from "./Pages/StoreSeller/NewProductAddition/CategoryRequest";
import EditBrandRequest from "./Pages/StoreSeller/NewProductAddition/EditBrandRequest";
import EditCategoryRequest from "./Pages/StoreSeller/NewProductAddition/EditCategoryRequest";
import EditSubCategoryRequest from "./Pages/StoreSeller/NewProductAddition/EditSubCategoryRequest";
import NewAddLayout from "./Pages/StoreSeller/NewProductAddition/NewAddLayout";
import NewCustomization from "./Pages/StoreSeller/NewProductAddition/NewCustomization";
import NewDescription from "./Pages/StoreSeller/NewProductAddition/NewDescription";
import NewOffers from "./Pages/StoreSeller/NewProductAddition/NewOffers";
import NewProductAdd from "./Pages/StoreSeller/NewProductAddition/NewProductAdd";
import NewVariations from "./Pages/StoreSeller/NewProductAddition/NewVariations";
import EditLayout from "./Pages/StoreSeller/ProductEditPage/EditLayout";
import ManageVariationImages from "./Pages/StoreSeller/ProductEditPage/ManageVariationImages";
import NewProductVariation from "./Pages/StoreSeller/ProductEditPage/NewProductVariation";
import EditUser from "./Pages/UserList/EditUser";
import UserList from "./Pages/UserList/UserList";
import { SellerNotification } from "./Pages/Notification/SellerNotification";

export default function Router() {
  const { auth } = useAuth();

  // For authenticated routes
  const authenticatedRoutes = [
    {
      path: "/",
      element: <AdminLayout />,
      children: [
        {
          path: "/",
          element: <RequireAuth allowedRoles={["Admin"]} />,
          children: [
            { path: "/", element: <Home /> },
            { path: "roles", element: <Roles /> },
            { path: "users", element: <UserList /> },
            { path: "AddUser", element: <AddUser /> },
            { path: "EditUser/:id", element: <EditUser /> },
            { path: "SellerManagment", element: <SellerListManage /> },
            {
              path: "SellerProductManagment",
              element: <SellerProductManagment />,
            },
            { path: "SellerReport", element: <SellerReport /> },
            { path: "SellerDetails/:id", element: <SellerDetails /> },
            {
              path: "/Seller/ProductList/:id",
              element: <ProductListBySeller />,
            },
            { path: "/Seller/SalesReport/:id", element: <SellerSalesReport /> },
            { path: "bannermanagment", element: <BannerManagment /> },
            { path: "image-convert", element: <Imageconverter /> },
          ],
        },
        {
          path: "/Admin",
          element: <RequireAuth allowedRoles={["Admin"]} />,
          children: [
            { path: "category", element: <ListCategory /> },
            { path: "category-request", element: <CatReqList /> },
            { path: "category-commission", element: <CategoryComissions /> },
            { path: "AddCategory", element: <AddCategory /> },
            { path: "subcategory", element: <ListSubCategory /> },
            { path: "Addsubcategory", element: <AddSubCategory /> },
            { path: "brand", element: <ListBrand /> },
            { path: "brand-request", element: <BrandReqList /> },
            { path: "Addbrand", element: <AddBrandPage /> },
            { path: "product", element: <ListProduct /> },
            { path: "Addproduct", element: <AddProduct /> },
            { path: "Editproduct/:id", element: <EditProduct /> },
            { path: "product-offer", element: <ProductOffer /> },
            { path: "offer/:id", element: <Offer /> },
          ],
        },
      ],
    },
    {
      path: "/key",
      element: <AdminLayout />,
      children: [
        {
          element: <RequireAuth allowedRoles={["Key Account Maneger"]} />,
          children: [
            { path: "dashboard", element: <Dashboard /> }, // Remove the absolute path '/key'
            { path: "attencdence", element: <AttendenceComp /> },
            { path: "seller", element: <ListSeller /> },
            { path: "AddSeller", element: <Addseller /> },
            { path: "keysellerdetails/:id", element: <KeySellerdetails /> },
            // { path: 'EditSeller/:id', element: <EditSeller /> },
            { path: "EditSeller/:id", element: <SellerEditForm /> },
          ],
        },
      ],
    },
    {
      path: "/seller",
      // element: <AdminLayout />,
      element: <SellerLayout />,
      children: [
        {
          element: <RequireAuth allowedRoles={["Seller"]} />,
          children: [
            { path: "seller-dashboard", element: <NewSellerDashboard /> },
            {
              path: "seller-ownproduct-status",
              element: <NewAddLayout />,
              children: [
                { path: "new-add", element: <NewProductAdd /> },
                { path: "new-variations/:id?", element: <NewVariations /> },
                { path: "new-description/:id?", element: <NewDescription /> },
                {
                  path: "new-customization/:id?",
                  element: <NewCustomization />,
                },
              ],
            },
            {
              path: "seller-product-edit/:id?",
              element: <EditLayout />,
              children: [
                { path: "new-offers/:id?", element: <NewOffers /> },
                {
                  path: "new-mainVariants/:id?",
                  element: <NewProductVariation />,
                },
                {
                  path: "manage-images/:id?",
                  element: <ManageVariationImages />,
                },
              ],
            },
            { path: "category-request", element: <CategoryRequest /> },
            {
              path: "category-request-edit/:id",
              element: <EditCategoryRequest />,
            },
            { path: "brand-request-edit/:id", element: <EditBrandRequest /> },
            {
              path: "subcategory-request-edit/:id",
              element: <EditSubCategoryRequest />,
            },
            { path: "brand-request", element: <BrandRequest /> },
            { path: "approval-request-list", element: <ApprovalPendingList /> },
            { path: "seller-editownproduct/:id", element: <EditOwnProduct /> },
            { path: "seller-addproduct", element: <NewAddProduct /> },
            { path: "seller-productList", element: <SellerInventory /> },
            { path: "notification", element: <SellerNotification />},
            { path: "product-deatils/:id", element: <SellerProductDetails /> },
            { path: "seller-orderlist", element: <OrderList /> },
            {
              path: "seller-return-order-request-list",
              element: <ReturnOrderRequestList />,
            },
            { path: "seller-return-order-list", element: <ReturnOrderList /> },
            { path: "manage-orders", element: <ManageOrders /> },
            { path: "add-ofers/:id", element: <NewOffers /> },
            { path: "customer-feedback", element: <Customerfeedback /> },
            { path: "service-feedback", element: <ServicesFeedback /> },
            { path: "advertising-campaign", element: <AdvertisingProduct /> },
            { path: "select-campaign/:id?", element: <CampaignDetails /> },
            { path: "display-campaign/:id?", element: <DisplayCampaign /> },
            { path: "bulk-product-upload", element: <BulkUploadProduct /> },
            { path: "seller-report", element: <Report /> },
            { path: "reset", element: <ResetPassComp /> },
            { path: "profile", element: <ProfilePage /> },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ];

  // For unauthenticated route (Login Page)
  const unauthenticatedRoute = [
    {
      path: "/",
      element: <FrontPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/seller-login",
      element: <SellerLoginPage />,
    },
    {
      path: "/seller-registration",
      element: <SellerRegistrationPage />,
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ];

  const allRoutes = auth ? authenticatedRoutes : unauthenticatedRoute;

  return useRoutes(allRoutes);
}

import { Navigate, useRoutes } from "react-router-dom";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import useAuth from "./hooks/useAuth";
import AdminLayout from "./Layouts/AdminLayout";
import FrontPage from "./Layouts/FrontPage/FrontPage";
import ForgotPassword from "./Login/ForgotPassword";
import LoginPage from "./Login/LoginPage";
import SellerForgotPassword from "./Login/SellerForgotPassword";
import SellerLoginPage from "./Login/SellerLoginPage";
import AddUser from "./Pages/AddUser/AddUser";
import AdminPaymnets from "./Pages/AdminPaymnets/AdminPaymnets";
import AdminTransaction from "./Pages/AdminTransactions/AdminTransaction";
import NewBannermanager from "./Pages/BannerManagemnt/NewBannermanager";
import Customers from "./Pages/CustomerList/Customers";
import EcommerceReport from "./Pages/EcommerceReport/EcommerceReport";
import RefundOrderAdmin from "./Pages/EcommerceReport/RefundOrderAdmin";
import AdminViewHelpDesk from "./Pages/HelpDesk/AdminViewHelpDesk";
import HelpDesk from "./Pages/HelpDesk/HelpDesk";
import ViewHelpDesk from "./Pages/HelpDesk/ViewHelpDesk";
import Home from "./Pages/Home/Home";
import AttendenceComp from "./Pages/KeyManager/Dashboard/AttendenceComp";
import Dashboard from "./Pages/KeyManager/Dashboard/Dashboard";
import Addseller from "./Pages/KeyManager/Seller/Addseller";
import ListSeller from "./Pages/KeyManager/Seller/ListSeller";
import KeySellerdetails from "./Pages/KeyManager/Seller/Registration/KeySellerdetails";
import SellerEditForm from "./Pages/KeyManager/Seller/SellerEditForm";
import LivePreview from "./Pages/livePreview/LivePreview";
import { SellerNotification } from "./Pages/Notification/SellerNotification";
import SellerChoose from "./Pages/OfferManagment/SellerChoose";
import SellingProductOffer from "./Pages/OfferManagment/SellingProductOffer";
import AddBrandPage from "./Pages/ProductManagement/Brand/AddBrandPage";
import BrandReqList from "./Pages/ProductManagement/Brand/BrandReqList";
import ListBrand from "./Pages/ProductManagement/Brand/ListBrand";
import AddCategory from "./Pages/ProductManagement/Category/AddCategory";
import CategoryComissions from "./Pages/ProductManagement/Category/CategoryComissions";
import CatReqList from "./Pages/ProductManagement/Category/CatReqList";
import ListCategory from "./Pages/ProductManagement/Category/ListCategory";
import Imageconverter from "./Pages/ProductManagement/ImageConverter/Imageconverter";
import TempleteUploader from "./Pages/ProductManagement/ImageConverter/TempleteUploader";
import Offer from "./Pages/ProductManagement/Offer/Offer";
import ProductOffer from "./Pages/ProductManagement/Offer/ProductOffer";
import AddProduct from "./Pages/ProductManagement/Product/AddProduct";
import BestSeller from "./Pages/ProductManagement/Product/BestSeller";
import BulkAdminUpload from "./Pages/ProductManagement/Product/BulkAdminUpload";
import EditProduct from "./Pages/ProductManagement/Product/EditProduct";
import PList from "./Pages/ProductManagement/Product/PList";
import { ProductServices } from "./Pages/ProductManagement/Product/ProductServices";
import AddSubCategory from "./Pages/ProductManagement/SubCategory/AddSubCategory";
import ListSubCategory from "./Pages/ProductManagement/SubCategory/ListSubCategory";
import SubCatReqList from "./Pages/ProductManagement/SubCategory/SubCatReqList";
import { Roles } from "./Pages/Roles/Roles";
import SellerDetails from "./Pages/SellerManagment/SellerDetails";
import SellerListManage from "./Pages/SellerManagment/SellerListManage";
import SellerReport from "./Pages/SellerManagment/SellerReport";
import SellerSalesReport from "./Pages/SellerManagment/SellerSalesReport";
import SellerProductManagment from "./Pages/SellerProductManagment/SellerProductManagment";
import SPList from "./Pages/SellerProductManagment/SPList";
import SellerRegistrationPage from "./Pages/SellerRegistration/SellerRegistrationPage";
import AllTransaction from "./Pages/StoreSeller/AllTransaction";
import EditOwnProduct from "./Pages/StoreSeller/EditOwnProduct";
import AdvertisingProduct from "./Pages/StoreSeller/Layout/AdvertisingProduct";
import BulkUpload from "./Pages/StoreSeller/Layout/BulkUpload";
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
import SubCategoryRequest from "./Pages/StoreSeller/NewProductAddition/SubCategoryRequest";
import SellerPayments from "./Pages/StoreSeller/payments/SellerPayments";
import EditLayout from "./Pages/StoreSeller/ProductEditPage/EditLayout";
import ManageVariationImages from "./Pages/StoreSeller/ProductEditPage/ManageVariationImages";
import NewProductVariation from "./Pages/StoreSeller/ProductEditPage/NewProductVariation";
import RefundOrderSeller from "./Pages/StoreSeller/RefundOrderSeller";
import SellerRequestPanel from "./Pages/StoreSeller/RequestPanel/SellerRequestPanel";
import { Testimonial } from "./Pages/Testimonials/Testimonial";
import EditUser from "./Pages/UserList/EditUser";
import UserList from "./Pages/UserList/UserList";
import AdminApplications from "./Pages/AdminApplications/AdminApplications";
import OfferManagment from "./Pages/ProductManagement/Product/OfferManagment";
import Permission from "./Pages/StoreSeller/CataloguePermissions/Permission";
import CataloguePermissions from "./Pages/SellerManagment/CataloguePermissions";
import CouponsManagment from "./Pages/CouponsManagment/CouponsManagment";

export default function Router({ socket }) {
  const { auth } = useAuth();

  // For authenticated routes
  const authenticatedRoutes = [
    {
      path: "/",
      element: <AdminLayout socket={socket} />,
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
            { path: "Customers", element: <Customers /> },
            {
              path: "SellerProductManagment",
              element: <SellerProductManagment />,
            },
            { path: "SellerReport", element: <SellerReport /> },
            { path: "BestSeller", element: <BestSeller /> },
            { path: "EcommerceReport", element: <EcommerceReport /> },
            { path: "all-transactions", element: <AdminTransaction /> },
            { path: "SellerDetails/:id", element: <SellerDetails /> },
            // {
            //   path: "/Seller/ProductList/:id",
            //   element: <ProductListBySeller />,
            // },
            {
              path: "/Seller/ProductList/:id",
              element: <SPList />,
            },
            { path: "/Seller/SalesReport/:id", element: <SellerSalesReport /> },
            { path: "bannermanagment", element: <NewBannermanager /> },
            { path: "image-convert", element: <Imageconverter /> },
            { path: "templete-upload", element: <TempleteUploader /> },
            { path: "/helpdesk", element: <HelpDesk /> },
          ],
        },
        {
          path: "/Admin",
          element: <RequireAuth allowedRoles={["Admin"]} />,
          children: [
            { path: "category", element: <ListCategory /> },
            { path: "AdminApplications", element: <AdminApplications /> },
            { path: "category-request", element: <CatReqList /> },
            { path: "category-commission", element: <CategoryComissions /> },
            { path: "AddCategory", element: <AddCategory /> },
            { path: "subcategory", element: <ListSubCategory /> },
            { path: "subcategory-request", element: <SubCatReqList /> },
            { path: "Addsubcategory", element: <AddSubCategory /> },
            { path: "brand", element: <ListBrand /> },
            { path: "brand-request", element: <BrandReqList /> },
            { path: "Addbrand", element: <AddBrandPage /> },
            // { path: "product", element: <ListProduct /> },
            { path: "product", element: <PList /> },
            { path: "product-services", element: <ProductServices /> },
            { path: "Addproduct", element: <AddProduct /> },
            { path: "uploadbulk", element: <BulkAdminUpload /> },
            { path: "Editproduct/:id", element: <EditProduct /> },
            { path: "product-offer-sellerchoose", element: <SellerChoose /> },
            {
              path: "product-offer-productchoose/:id",
              element: <SellingProductOffer />,
            },
            { path: "product-offer", element: <ProductOffer /> },
            { path: "testimonial", element: <Testimonial /> },
            { path: "offer/:id", element: <Offer /> },
            { path: "admin-refund-order-list", element: <RefundOrderAdmin /> },
            { path: "paymnets", element: <AdminPaymnets /> },
            { path: "view-helpdesk", element: <AdminViewHelpDesk /> },
            { path: "offer-managment", element: <OfferManagment /> },
            {
              path: "catalogue-permissions",
              element: <CataloguePermissions />,
            },
            { path: "coupon-managment", element: <CouponsManagment /> },

            // { path: "live-preview/:id", element: <LivePreview /> },
          ],
        },
      ],
    },
    {
      path: "/key",
      element: <AdminLayout />,
      children: [
        {
          element: <RequireAuth allowedRoles={["Key Account Manager"]} />,
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
      element: <SellerLayout socket={socket} />,
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
              path: "payments",
              element: <SellerPayments />,
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
            { path: "subcategory-request", element: <SubCategoryRequest /> },

            { path: "brand-request-edit/:id", element: <EditBrandRequest /> },
            {
              path: "subcategory-request-edit/:id",
              element: <EditSubCategoryRequest />,
            },
            { path: "brand-request", element: <BrandRequest /> },
            { path: "approval-request-list", element: <ApprovalPendingList /> },
            { path: "seller-editownproduct/:id", element: <EditOwnProduct /> },
            { path: "seller-addproduct", element: <NewAddProduct /> },
            { path: "seller-request", element: <SellerRequestPanel /> },
            { path: "seller-productList", element: <SellerInventory /> },
            { path: "notification", element: <SellerNotification /> },
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
            { path: "bulk-product-upload", element: <BulkUpload /> },
            { path: "seller-report", element: <Report /> },
            { path: "reset", element: <ResetPassComp /> },
            { path: "profile/:id", element: <ProfilePage /> },
            { path: "trasactions", element: <AllTransaction /> },
            { path: "refund-orders-list", element: <RefundOrderSeller /> },
            { path: "helpdesk", element: <ViewHelpDesk /> },
            { path: "Seller-permission", element: <Permission /> },
          ],
        },
      ],
    },
    { path: "live-preview/:id", element: <LivePreview /> },
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
      path: "/admin/login",
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
      path: "/forgot",
      element: <ForgotPassword />,
    },
    {
      path: "/seller-login/forgot",
      element: <SellerForgotPassword />,
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
    { path: "live-preview/:id", element: <LivePreview /> },
  ];

  const allRoutes = auth ? authenticatedRoutes : unauthenticatedRoute;

  return useRoutes(allRoutes);
}

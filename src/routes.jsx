import { Navigate, useRoutes } from 'react-router-dom';
import AdminLayout from './Layouts/AdminLayout';
import LoginPage from './Login/LoginPage';
import AddUser from './Pages/AddUser/AddUser';
import Home from './Pages/Home/Home';
import { Roles } from './Pages/Roles/Roles';
import UserList from './Pages/UserList/UserList';
import useAuth from './hooks/useAuth';
import RequireAuth from './components/RequireAuth/RequireAuth'
import ListCategory from './Pages/ProductManagement/Category/ListCategory';
import ListSubCategory from './Pages/ProductManagement/SubCategory/ListSubCategory';
import ListBrand from './Pages/ProductManagement/Brand/ListBrand';
import ListProduct from './Pages/ProductManagement/Product/ListProduct';
import AddCategory from './Pages/ProductManagement/Category/AddCategory';
import AddSubCategory from './Pages/ProductManagement/SubCategory/AddSubCategory';
import AddBrandPage from './Pages/ProductManagement/Brand/AddBrandPage';
import EditUser from './Pages/UserList/EditUser';
import AddProduct from './Pages/ProductManagement/Product/AddProduct';
import EditProduct from './Pages/ProductManagement/Product/EditProduct';
import Dashboard from './Pages/KeyManager/Dashboard/Dashboard';
import ListSeller from './Pages/KeyManager/Seller/ListSeller';
import Addseller from './Pages/KeyManager/Seller/Addseller';
import EditSeller from './Pages/KeyManager/Seller/EditSeller';
import SellerListManage from './Pages/SellerManagment/SellerListManage';
import SellerDashboard from './Pages/StoreSeller/SellerDashboard';
import SellerOwnProduct from './Pages/StoreSeller/SellerOwnProduct';
import SellerAddProduct from './Pages/StoreSeller/SellerAddProduct';
import SellerProductList from './Pages/StoreSeller/SellerProductList';
import SellerProductManagment from './Pages/SellerProductManagment/SellerProductManagment';
import EditOwnProduct from './Pages/StoreSeller/EditOwnProduct';
import BannerManagment from './Pages/BannerManagemnt/BannerManagment';
import AttendenceComp from './Pages/KeyManager/Dashboard/AttendenceComp';
import SellerLayout from './Pages/StoreSeller/Layout/SellerLayout';
import NewAddProduct from './Pages/StoreSeller/Layout/NewAddProduct';
import SellerInventory from './Pages/StoreSeller/Layout/SellerInventory';
import NewSellerDashboard from './Pages/StoreSeller/Layout/NewSellerDashboard';
import OrderList from './Pages/StoreSeller/Layout/OrderList';
import SellerProductDetails from './Pages/StoreSeller/Layout/SellerProductDetails';
import ManageOrders from './Pages/StoreSeller/Layout/ManageOrders';
import OwnproductStatus from './Pages/StoreSeller/Layout/OwnproductStatus';
import Imageconverter from './Pages/ProductManagement/ImageConverter/Imageconverter';
import Customerfeedback from './Pages/StoreSeller/Layout/Customerfeedback';
import ResetPassComp from './Pages/StoreSeller/Layout/ResetPassComp';
import SellerRegistrationPage from './Pages/SellerRegistration/SellerRegistrationPage';
import ProfilePage from './Pages/StoreSeller/Layout/ProfilePage';
import SellerDetails from './Pages/SellerManagment/SellerDetails';
import KeySellerdetails from './Pages/KeyManager/Seller/Registration/KeySellerdetails';
import ServicesFeedback from './Pages/StoreSeller/Layout/ServicesFeedback';
import FrontPage from './Layouts/FrontPage/FrontPage';
import SellerLoginPage from './Login/SellerLoginPage';
import CategoryComissions from './Pages/ProductManagement/Category/CategoryComissions';
import NewProductAdd from './Pages/StoreSeller/NewProductAddition/NewProductAdd';
import NewAddLayout from './Pages/StoreSeller/NewProductAddition/NewAddLayout';
import CategoryRequest from './Pages/StoreSeller/NewProductAddition/CategoryRequest';
import ApprovalPendingList from './Pages/StoreSeller/NewProductAddition/ApprovalPendingList';
import CatReqList from './Pages/ProductManagement/Category/CatReqList';
import BrandRequest from './Pages/StoreSeller/NewProductAddition/BrandRequest';
import BrandReqList from './Pages/ProductManagement/Brand/BrandReqList';
import NewVariations from './Pages/StoreSeller/NewProductAddition/NewVariations';
import NewDescription from './Pages/StoreSeller/NewProductAddition/NewDescription';
import NewOffers from './Pages/StoreSeller/NewProductAddition/NewOffers';
import NewCustomization from './Pages/StoreSeller/NewProductAddition/NewCustomization';
import EditLayout from './Pages/StoreSeller/ProductEditPage/EditLayout';
import AdvertisingProduct from './Pages/StoreSeller/Layout/AdvertisingProduct';
import CampaignDetails from './Pages/StoreSeller/Layout/CampaignDetails';
import NewProductVariation from './Pages/StoreSeller/ProductEditPage/NewProductVariation';
import ManageVariationImages from './Pages/StoreSeller/ProductEditPage/ManageVariationImages';
import BulkUploadProduct from './Pages/StoreSeller/Layout/BulkUploadProduct';
import EditCategoryRequest from './Pages/StoreSeller/NewProductAddition/EditCategoryRequest';
import EditSubCategoryRequest from './Pages/StoreSeller/NewProductAddition/EditSubCategoryRequest';
import DisplayCampaign from './Pages/StoreSeller/Layout/DisplayCampaign';






export default function Router() {

  const { auth } = useAuth();

  // For authenticated routes
  const authenticatedRoutes = [
    {
      path: '/',
      element: <AdminLayout />,
      children: [
        {
          path: '/',
          element: <RequireAuth allowedRoles={['Admin']} />,
          children: [
            { path: '/', element: <Home /> },
            { path: 'roles', element: <Roles /> },
            { path: 'users', element: <UserList /> },
            { path: 'AddUser', element: <AddUser /> },
            { path: 'EditUser/:id', element: <EditUser /> },
            { path: 'SellerManagment', element: <SellerListManage /> },
            { path: 'SellerProductManagment', element: <SellerProductManagment /> },
            { path: 'SellerDetails/:id', element: <SellerDetails /> },
            { path: 'bannermanagment', element: <BannerManagment /> },
            { path: 'image-convert', element: <Imageconverter /> }
          ],
        },
        {
          path: '/Admin',
          element: <RequireAuth allowedRoles={['Admin']} />,
          children: [
            { path: 'category', element: <ListCategory /> },
            { path: 'category-request', element: <CatReqList /> },
            { path: 'category-commission', element: <CategoryComissions /> },
            { path: 'AddCategory', element: <AddCategory /> },
            { path: 'subcategory', element: <ListSubCategory /> },
            { path: 'Addsubcategory', element: <AddSubCategory /> },
            { path: 'brand', element: <ListBrand /> },
            { path: 'brand-request', element: <BrandReqList /> },
            { path: 'Addbrand', element: <AddBrandPage /> },
            { path: 'product', element: <ListProduct /> },
            { path: 'Addproduct', element: <AddProduct /> },
            { path: 'Editproduct/:id', element: <EditProduct /> },
          ],
        },
      ],
    },
    {
      path: '/key',
      element: <AdminLayout />,
      children: [
        {
          element: <RequireAuth allowedRoles={['Key Account Maneger']} />,
          children: [
            { path: 'dashboard', element: <Dashboard /> }, // Remove the absolute path '/key'
            { path: 'attencdence', element: <AttendenceComp /> },
            { path: 'seller', element: <ListSeller /> },
            { path: 'AddSeller', element: <Addseller /> },
            { path: 'keysellerdetails/:id', element: <KeySellerdetails /> },
            { path: 'EditSeller/:id', element: <EditSeller /> },
          ],
        },
      ],
    },
    {
      path: '/seller',
      // element: <AdminLayout />,
      element : <SellerLayout/>,
      children: [
        {
          element: <RequireAuth allowedRoles={['Seller']} />,
          children: [
            { path: 'seller-dashboard', element: <NewSellerDashboard /> },
            {
              path: 'seller-ownproduct-status', element: <NewAddLayout />,
              children : [
                { path: 'new-add',element:<NewProductAdd/>},
                { path: 'new-variations/:id?', element: <NewVariations /> },
                { path: 'new-description/:id?', element: <NewDescription /> },
                { path: 'new-customization/:id?', element: <NewCustomization /> },
                
              ]
            },
            {
              path: 'seller-product-edit/:id?', element: <EditLayout />,
              children: [
                { path: 'new-offers/:id?', element: <NewOffers /> },
                { path: 'new-mainVariants/:id?', element: <NewProductVariation /> },
                { path: 'manage-images/:id?', element: <ManageVariationImages /> },

              ]
            },
            {path : 'category-request',element: <CategoryRequest/>},
            { path: 'category-request-edit/:id', element: <EditCategoryRequest /> },
            { path: 'subcategory-request-edit/:id', element: <EditSubCategoryRequest /> },
            { path: 'brand-request', element: <BrandRequest /> },
            { path: 'approval-request-list', element: <ApprovalPendingList /> },
            { path: 'seller-editownproduct/:id', element: <EditOwnProduct /> },
            { path: 'seller-addproduct', element: <NewAddProduct /> },
            { path: 'seller-productList', element: <SellerInventory /> },
            { path: 'product-deatils/:id', element: <SellerProductDetails /> },
            { path: 'seller-orderlist', element: <OrderList /> },
            { path: 'manage-orders', element: <ManageOrders /> },
            { path: 'add-ofers/:id', element: <NewOffers /> },
            { path: 'customer-feedback', element: <Customerfeedback /> },
            { path: 'service-feedback', element: <ServicesFeedback /> },
            { path: 'advertising-campaign', element: <AdvertisingProduct /> },
            { path: 'select-campaign/:id?', element: <CampaignDetails /> },
            { path: 'display-campaign/:id?', element: <DisplayCampaign /> },
            { path: 'bulk-product-upload', element: <BulkUploadProduct /> },
            { path: 'reset', element: <ResetPassComp /> },
            { path: 'profile', element: <ProfilePage /> },

          ],
        },

      ],
    },
    {
      path: '*',
      element: <Navigate to="/" />
    }
  ];

  // For unauthenticated route (Login Page)
  const unauthenticatedRoute = [
    {
      path: '/',
      element: <FrontPage />,
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/seller-login',
      element: <SellerLoginPage />,
    },
    {
      path: '/seller-registration',
      element: <SellerRegistrationPage />,
    },
    {
      path: '*',
      element: <Navigate to="/" />
    },
  ]


  const allRoutes = auth ? authenticatedRoutes : unauthenticatedRoute;

  return useRoutes(allRoutes);
}

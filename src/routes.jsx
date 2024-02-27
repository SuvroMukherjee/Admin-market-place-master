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
            { path: 'bannermanagment', element: <BannerManagment /> },
            { path: 'image-convert', element: <Imageconverter /> }
          ],
        },
        {
          path: '/Admin',
          element: <RequireAuth allowedRoles={['Admin']} />,
          children: [
            { path: 'category', element: <ListCategory /> },
            { path: 'AddCategory', element: <AddCategory /> },
            { path: 'subcategory', element: <ListSubCategory /> },
            { path: 'Addsubcategory', element: <AddSubCategory /> },
            { path: 'brand', element: <ListBrand /> },
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
            // { path: 'seller-dashboard', element: <SellerDashboard /> },
            { path: 'seller-dashboard', element: <NewSellerDashboard /> },
            { path: 'seller-ownproduct', element: <SellerOwnProduct /> },
            { path: 'seller-ownproduct-status', element: <OwnproductStatus /> },
            { path: 'seller-editownproduct/:id', element: <EditOwnProduct /> },
            // { path: 'seller-addproduct', element: <SellerAddProduct /> },
            { path: 'seller-addproduct', element: <NewAddProduct /> },
            // { path: 'seller-productList', element: <SellerProductList /> }, /SellerInventory
            { path: 'seller-productList', element: <SellerInventory /> },
            { path: 'product-deatils/:id', element: <SellerProductDetails /> },
            { path: 'seller-orderlist', element: <OrderList /> },
            { path: 'manage-orders', element: <ManageOrders /> },
            { path: 'customer-feedback', element: <Customerfeedback /> },
            // { path: 'change-password', element: <ChangePassword /> },
            { path: 'reset', element: <ResetPassComp /> },

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
      element: <LoginPage />,
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

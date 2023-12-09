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
          ],
        },
        {
          path: '/Admin',
          element: <RequireAuth allowedRoles={['Admin']} />,
          children: [
            { path: 'category', element: <ListCategory /> },
            { path: 'AddCategory', element: <AddCategory /> },
            { path: 'subcategory', element: <ListSubCategory /> },
            { path: 'brand', element: <ListBrand /> },
            { path: 'product', element: <ListProduct /> },
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
      path: '*',
      element: <Navigate to="/" />
    },
  ]


  const allRoutes = auth ? authenticatedRoutes : unauthenticatedRoute;

  return useRoutes(allRoutes);
}

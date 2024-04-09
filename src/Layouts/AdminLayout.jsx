import { Outlet } from "react-router-dom";
import { ScrollToTop } from "../components/scrollToTop/ScrollToTop";
import Sidebar from "../components/Sidebar/Sidebar";
const AdminLayout = () => {
  return (
    <div>
      <div className="containerLayout">
        <ScrollToTop />
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

import { Outlet } from "react-router-dom";
import { ScrollToTop } from "../components/scrollToTop/ScrollToTop";
import Sidebar from "../components/Sidebar/Sidebar";
import { useEffect, useState } from "react";
const AdminLayout = ({ socket }) => {

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (socket){
      socket.on("getNotification", (data) => {
        console.log(data, 'getNotification')
        setNotifications((prev) => [...prev, data]);
      });
    }
  }, [socket]);

  return (
    <div>
      <div className="containerLayout">
        <ScrollToTop />
        <Sidebar notifications={notifications}/>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

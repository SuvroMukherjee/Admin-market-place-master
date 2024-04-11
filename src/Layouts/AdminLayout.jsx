import { Outlet } from "react-router-dom";
import { ScrollToTop } from "../components/scrollToTop/ScrollToTop";
import Sidebar from "../components/Sidebar/Sidebar";
import { useEffect, useState } from "react";
import { getAdminNotification } from "../API/api";
import { ToastContainer, toast } from 'react-toastify';

const AdminLayout = ({ socket }) => {

  const [notifications, setNotifications] = useState([]);

  useEffect(()=>{
    getAdminNotificationHandler();
  },[])

  async function getAdminNotificationHandler(){
    let res = await getAdminNotification();
    console.log(res?.data?.data,'notice')
    setNotifications(res?.data?.data)
  }

  useEffect(() => {
    if (socket) {
      const handleAdminNotification = (data) => {
        console.log(data, 'ADMIN_NOTIFICATION')
        toast.info(data)
        getAdminNotificationHandler();
      };

      socket.on("ADMIN_NOTIFICATION", handleAdminNotification);

      return () => {
        socket.off("ADMIN_NOTIFICATION", handleAdminNotification);
      };
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

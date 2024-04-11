import { Outlet } from "react-router-dom";
import { ScrollToTop } from "../components/scrollToTop/ScrollToTop";
import Sidebar from "../components/Sidebar/Sidebar";
import { useEffect, useState } from "react";
import { getAdminNotification } from "../API/api";
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
    if (socket){
      socket.on("ADMIN_NOTIFICATION", (data) => {
        console.log(data, 'ADMIN_NOTIFICATION')
        getAdminNotificationHandler();
      });
    }
  }, [socket, notifications]);

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

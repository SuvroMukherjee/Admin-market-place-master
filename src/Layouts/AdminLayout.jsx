import { Outlet } from "react-router-dom";
import { ScrollToTop } from "../components/scrollToTop/ScrollToTop";
import Sidebar from "../components/Sidebar/Sidebar";
import { useContext, useEffect, useState } from "react";
import { getAdminNotification } from "../API/api";
import { toast } from "react-toastify";
import notificationSoundTone from "../assets/notification.wav";
import { notificationContext } from "../context/context";


const AdminLayout = ({ socket }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getAdminNotificationHandler();
  }, []);

  async function getAdminNotificationHandler() {
    let res = await getAdminNotification();
    console.log(res?.data?.data, "notice");
    setNotifications(res?.data?.data);
    console.log(notifications);
    
  }

  const { adminNotification } = useContext(notificationContext);
  

  useEffect(() => {
    if (socket) {
      const handleAdminNotification = (data) => {
        console.log(data, "ADMIN_NOTIFICATION");

        if (adminNotification) {
          // Assuming this code is inside a function that is triggered by a user interaction, such as a click event
          try {
            const notificationSound = new Audio(notificationSoundTone);
            notificationSound.play();
            console.log("New Notification from seller!");
          } catch {
            console.log("Error in playing sound");
          }
        }

        setTimeout(() => {
          // toast.info(data);
          toast.info("New Notification");
        }, 1000);
        getAdminNotificationHandler();
      };

      socket.on("ADMIN_NOTIFICATION", handleAdminNotification);

      return () => {
        socket.off("ADMIN_NOTIFICATION", handleAdminNotification);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return (
    <div>
      <div className="containerLayout">
        <ScrollToTop />
        <Sidebar
          notifications={notifications}
          getAdminNotificationHandler={getAdminNotificationHandler}
        />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

import { useState } from "react";
import { notificationContext } from "./context";

export const NotificationProvider = ({ children }) => {
  const [adminNotification, setAdminNotification] = useState(
    localStorage.getItem("notifications")
      ? JSON.parse(localStorage.getItem("notifications")).adminNotification
      : true
  );


  const setAdminNotificationCustom = (value) => {
    setAdminNotification(value);
    localStorage.setItem(
      "notifications",
      JSON.stringify({
        adminNotification: value,
      })
    );
  };


  return (
    <notificationContext.Provider
      value={{
        adminNotification,
        setAdminNotificationCustom,
      }}
    >
      {children}
    </notificationContext.Provider>
  );
};

import React from "react";
import { useNotification } from "../../context/NotificationContext";
import Notification from "./Notification";

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </>
  );
};

export default NotificationContainer;

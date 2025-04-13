// components/NotificationToast.tsx

import React from "react";
import { MdNotificationsActive } from "react-icons/md";

type NotificationToastProps = {
  username: string;
  planetName: string;
};

const NotificationToast: React.FC<NotificationToastProps> = ({ username, planetName }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <MdNotificationsActive size={24} color="#000" />
      <span
        style={{
          fontFamily: "Jura",
          fontWeight: 700,
          fontSize: "20px",
          lineHeight: "100%",
          letterSpacing: "0%",
          color: "#000",
        }}
      >
        User {username} has just uploaded a new exoplanet: {planetName}
      </span>
    </div>
  );
};

export default NotificationToast;

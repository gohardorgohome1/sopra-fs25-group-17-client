// components/NotificationToast.tsx
"use client"; 
import React from "react";
import { MdNotificationsActive } from "react-icons/md";
import { useRouter } from "next/navigation";

type NotificationToastProps = {
  username: string;
  planetName: string;
  exoplanetId: string;
};

const NotificationToast: React.FC<NotificationToastProps> = ({ username, planetName, exoplanetId }) => {
    const router = useRouter();
    return (
    <div onClick={() => router.push(`/exoplanets/${exoplanetId}`)}
    style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <MdNotificationsActive size={50} color="#000" />
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
        {username} has just uploaded a new exoplanet: {planetName}
      </span>
    </div>
  );
};

export default NotificationToast;

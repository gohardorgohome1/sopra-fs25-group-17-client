// components/NotificationToast.tsx
"use client"; 
import React from "react";
import { MdNotificationsActive } from "react-icons/md";
import { useRouter } from "next/navigation";

type NotificationToastProps = {
  type?: "upload" | "comment"; // optional, default to "upload"
  username: string;
  planetName: string;
  exoplanetId: string;
};

const NotificationToast: React.FC<NotificationToastProps> = ({ type = "upload", username, planetName, exoplanetId }) => {
    const router = useRouter();

    let message = "";

    if (type === "comment") {
      message = `${username} commented on your exoplanet: ${planetName}`;
    } else {
      message = `${username} has just uploaded a new exoplanet: ${planetName}`;
    }


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
        {message}
      </span>
    </div>
  );
};

export default NotificationToast;

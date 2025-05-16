// components/NotificationToast.tsx
"use client"; 
import React from "react";
import { MdNotificationsActive } from "react-icons/md";
import { useRouter } from "next/navigation";

type NotificationToastProps = {
  type?: "upload" | "comment" | "nudge";
  username: string;
  planetName?: string;
  exoplanetId?: string;
  userId?: string;
};

const NotificationToast: React.FC<NotificationToastProps> = ({ type = "upload", username, planetName, exoplanetId, userId, }) => {
    const router = useRouter();

    let message = "";

    let onClickHandler = () => {};

    if (type === "comment") {
      message = `${username} commented on your exoplanet: ${planetName}`;
      onClickHandler = () => router.push(`/exoplanets/${exoplanetId}`);
    } else if (type === "nudge") {
      message = `${username} nudged you! 👋`;
      onClickHandler = () => {
        if (userId) {
          router.push(`/users/${userId}`);
        }
      };
    } else {
      message = `${username} has just uploaded a new exoplanet: ${planetName}`;
      onClickHandler = () => router.push(`/exoplanets/${exoplanetId}`);
    }


    return (
    <div
      onClick={onClickHandler}
      style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
    >
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

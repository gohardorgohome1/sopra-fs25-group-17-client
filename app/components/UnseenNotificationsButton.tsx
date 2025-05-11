"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react"; // Icon
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";

interface Notification {
    userId: string;
    uploaderUsername: string;
    exoplanetId: string;
    planetName: string;
    seen: boolean;
    createdAt: string; // ISO date string (from LocalDateTime in backend)
  }

export default function UnseenNotificationsButton() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const apiService = useApi();
    const {
    } = useLocalStorage<string>("token", "");
  
  const [hasUnseen, setHasUnseen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const checkUnseenNotifications = async () => {
      if (!userId) return;

      try {
        const res = await apiService.get<Notification>(`/notifications?userId=${userId}`);
        if (Array.isArray(res) && res.length > 0) {
            setHasUnseen(true);
            setNotifications(res); // Store the notifications
          }
      } catch (err) {
        console.error("Failed to fetch unseen notifications", err);
      }
    };

    checkUnseenNotifications();
  }, [apiService]);

  if (!hasUnseen) return null;

  return (
    <div style={{ position: "absolute", top: "3vh", right: "22vw", zIndex: 9999 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
        title="You have unseen notifications"
      >
        <Bell color="#FFAE00" size={35} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "2.5rem",
            right: 0,
            width: "300px",
            maxHeight: "400px",
            background: "#1a1a1a",
            border: "1px solid #444",
            borderRadius: "8px",
            overflowY: "auto",
            boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
            zIndex: 1000,
            padding: "0.5rem",
          }}
        >
          <h4 style={{ color: "#fff", margin: "0 0 0.5rem 0" }}>Notifications you missed when you were offline</h4>
          {notifications.map((notif, index) => (
            <div
              key={index}
              style={{
                padding: "0.5rem",
                marginBottom: "0.3rem",
                backgroundColor: "#2a2a2a",
                borderRadius: "4px",
                color: "#ccc",
                fontSize: "0.9rem",
              }}
            >
              📡 <strong>Exoplanet: {notif.planetName}</strong> has been uploaded by <em>{notif.uploaderUsername}</em>
              <br />
              <small style={{ color: "#888" }}>{notif.createdAt 
                    ? new Date(notif.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })
                : "Just now"}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import NotificationToast from "@/components/NotificationToast";
import { useApi } from "@/hooks/useApi";

export default function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const apiService = useApi();

  const disabledPaths = ["/login", "/register"];

  useEffect(() => {
    if (disabledPaths.includes(pathname)) {
      return; // Do not activate WebSocket on login or register pages
    }

    const client = new Client({
      webSocketFactory: () =>
        new SockJS("https://sopra-fs25-group-17-server.oa.r.appspot.com/ws"),
      // Put this for testing locally: "http://localhost:8080/ws"
      // Put this for deployed app: "https://sopra-fs25-group-17-server.oa.r.appspot.com/ws"
      connectHeaders: {},
      onConnect: () => {
        client.subscribe("/topic/exoplanets", async (message) => {
          const payload = JSON.parse(message.body);
          const username = payload.user.username;
          const planetName = payload.exoplanet.planetName;
          const exoplanetId = payload.exoplanet.id;

          toast(
            <NotificationToast 
            type="upload"
            username={username} 
            planetName={planetName} 
            exoplanetId={exoplanetId} />);

          const userId = localStorage.getItem("userId");
          // Mark this specific notification as seen
          try {
            if (userId && exoplanetId) {
              await apiService.put<void>("/notifications/mark-seen-single", {
                userId,
                exoplanetId,
              });
            }
          } catch (error) {
            console.error("Failed to mark real-time notification as seen:", error);
          }

        });

        // Comment Notification
        client.subscribe("/topic/comments", (message) => {
          const payload = JSON.parse(message.body);
          const userId = localStorage.getItem("userId");

          if (payload.ownerId === userId) {
            const commenterUsername = payload.commenterUsername;
            const planetName = payload.planetName;
            const exoplanetId = payload.exoplanetId;

            toast(
              <NotificationToast
                type="comment"
                username={commenterUsername}
                planetName={planetName}
                exoplanetId={exoplanetId}
              />
            );
          }
        });


      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [pathname]); // Re-run if route changes

  return (
    <>
      {children}
      {/* Toast Container needed for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={true}
        toastStyle={{
          backgroundColor: "#FFAE00",
          color: "#000",
          fontFamily: "Jura",
          fontWeight: 700,
          fontSize: "20px",
          lineHeight: "100%",
          letterSpacing: "0%",
        }}
      />
    </>
  );
}

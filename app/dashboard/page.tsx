"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering 

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Button, Card } from "antd";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationToast from "@/components/NotificationToast";
import StarMap from "../components/starMap";
import ExoplanetRanking from "../components/exoplanetRanking";
import { FaUserAstronaut } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const {
    value: token,
    clear: clearToken,
  } = useLocalStorage<string>("token", "");

  const handleLogout = async (): Promise<void> => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      await apiService.put<void>(`/users/${userId}/logout`, {});
    } catch (error) {
      console.error("Logout failed:", error);
    }

    clearToken();
    router.push("/login");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
  }, [token, apiService, router]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () =>
        new SockJS("https://sopra-fs25-group-17-server.oa.r.appspot.com/ws"),
      connectHeaders: {},
      onConnect: () => {
        client.subscribe("/topic/exoplanets", (message) => {
          const payload = JSON.parse(message.body);
          const username = payload.user.username;
          const planetName = payload.exoplanet.planetName;
          const exoplanetId = payload.exoplanet.id;

          toast(<NotificationToast username={username} planetName={planetName} exoplanetId={exoplanetId} />);
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
  }, []);

  return (
    <div className="dashboard-container">

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

      <Button
        onClick={() => router.push(`/users/68120b172087224081e02480`)} // provisorisch
        type="primary"
        style={{
          position: "absolute",
          alignItems: 'center',
          left: "1vw",
          top: "4vh",
          fontSize: "8vh",

          background: "transparent",
          border: "none",
          color: 'white',

          cursor: 'pointer',
        }}
      >
        <FaUserAstronaut />
      </Button>

      {/* Logout Button */}
      <Button
        onClick={handleLogout}
        type="primary"
        className="logout-button"
        style={{
          position: "absolute",
          top: "2vh",
          right: "2vw",
          width: "8vw",
          height: "3vw",
          background: "#202343",
          borderRadius: "0.8vw",
          textAlign: "center",
          color: "#FFFFFF",
          fontSize: "1.4vw",
          fontFamily: "Jura",
          fontWeight: "700",
          boxShadow: "none",
          zIndex: 1,
        }}
      >
        <span>Logout</span>
      </Button>

      {/* AI Assistant Button */}
      <Button
        onClick={() => router.push("/openai")}
        type="primary"
        className="logout-button"
        style={{
          position: "absolute",
          bottom: "2vh",
          left: "2vw",
          width: "10vw",
          height: "3vw",
          background: "#202343",
          borderRadius: "0.8vw",
          textAlign: "center",
          color: "#FFFFFF",
          fontSize: "1.4vw",
          fontFamily: "Jura",
          fontWeight: "700",
          boxShadow: "none",
          zIndex: 9999,
        }}
      >
        <span>AI Assistant</span>
      </Button>

      {/* Header */}
      <div
        style={{
          width: "60vw",
          height: "12vh",
          top: "3vh",
          left: "1vh",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            position: "relative",
            fontSize: "5vw",
            fontFamily: "Koulen",
            fontWeight: "400",
            color: "#D0E0F3",
            zIndex: 1,
          }}
        >
          EXOPLANET DASHBOARD
        </h1>
      </div>

      {/* Main Card */}
      <Card
        className="dashboard-container"
        style={{
          position: "relative",
          marginTop: "1vh",
          marginLeft: "auto",
          marginRight: "auto",
          height: "100vh",
          width: "97vw",
          maxWidth: "1500px",
          background: "#000000",
          border: "none",
          borderRadius: "1vw",
          overflow: "hidden",
          zIndex: 1,
        }}
        styles={{ body: { padding: "0", backgroundColor: "black" } }}
      >
        {/* Flex Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "0.5vw",
            height: "80vh",
            width: "100%",
            flex: 1,
          }}
        >
          {/* Left Side */}
          <div
            style={{
              flex: 2,
              backgroundColor: "black",
              borderRadius: "1.5vw",
              padding: "0vh 0vw",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "Jura",
                background: "linear-gradient(90deg, #FFFFFF 0%, #0058B6 100%)",
                WebkitBackgroundClip: "text",
                color: "transparent",
                fontWeight: "700",
                fontSize: "2vw",
                lineHeight: "1.2",
                letterSpacing: "0em",
                textAlign: "center",
              }}
            >
              Exoplanet Populations
            </h2>
            <div
              style={{
                flexGrow: 1,
                height: "100%",
                width: "100%",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "#888",
              }}
            >
              <StarMap />
            </div>
          </div>

          {/* Right Side */}
          <div
            style={{
              flex: 1,
              backgroundColor: "black",
              borderRadius: "1.5vw",
              padding: "0vh 0vw",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "Jura",
                background: "linear-gradient(90deg, #FFFFFF 0%, #0058B6 100%)",
                WebkitBackgroundClip: "text",
                color: "transparent",
                fontWeight: "700",
                fontSize: "2vw",
                lineHeight: "1.2",
                letterSpacing: "0em",
                textAlign: "center",
              }}
            >
              Earth Similarity Ranking
            </h2>
            <div
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#888",
              }}
            >
              <ExoplanetRanking />
            </div>

            <Button
              onClick={() => router.push("/exoplanets/upload")}
              type="primary"
              style={{
                alignSelf: "flex-end",
                backgroundColor: "#A5ADFF",
                border: "none",
                boxShadow: "0 0 20px rgba(127, 135, 255, 0.6)",
                color: "#FFFFFF",
                fontFamily: "Jura",
                fontWeight: "700",
                fontSize: "1.7vw",
                borderRadius: "0.8vw",
                padding: "0.6vw 2.5vw",
                marginTop: "1vh",
              }}
            >
              Analyze and add exoplanet
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

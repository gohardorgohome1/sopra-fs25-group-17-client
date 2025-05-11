"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Button, Card } from "antd";
import {
  LogoutOutlined,
  RobotOutlined,
  PlusOutlined,
  UserOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import "react-toastify/dist/ReactToastify.css";
import UnseenNotificationsButton from "../components/UnseenNotificationsButton";
import StarMap from "../components/starMap";
import ExoplanetRanking from "../components/exoplanetRanking";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const {
    value: token,
    clear: clearToken,
  } = useLocalStorage<string>("token", "");
  const [currentUserId, setCurrentUserId] = useState("");

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
    const storedId = localStorage.getItem("userId");
    if (storedId != null) {
      setCurrentUserId(storedId);
    }
  }, [token, apiService, router]);

  return (
    <div className="dashboard-container" style={{ position: "relative" }}>
      <UnseenNotificationsButton />

      {/* Sidebar Navigation */}
      <div
        style={{
          position: "fixed",
          top: "2vh",
          left: "1vw",
          width: "14vw",
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
          borderRadius: "1vw",
          padding: "2vh 1vw",
          display: "flex",
          flexDirection: "column",
          gap: "1.5vh",
          zIndex: 10000,
          boxShadow: "0 0 10px rgba(0,0,0,0.7)",
        }}
      >
        <div
          style={{
            color: "#D0E0F3",
            fontSize: "1.3vw",
            fontFamily: "Jura",
            fontWeight: "600",
            textAlign: "center",
            marginBottom: "1vh",
            letterSpacing: "0.05em",
          }}
        >
          MENU
        </div>

        <Button
          icon={<RobotOutlined />}
          onClick={() => router.push("/openai")}
          type="primary"
          block
          style={{
            backgroundColor: "#202343",
            border: "none",
            color: "#D0E0F3",
            fontSize: "1vw",
            fontWeight: "600",
            fontFamily: "Jura",
            textAlign: "left",
            padding: "0.8vw 1vw",
            borderRadius: "0.7vw",
          }}
        >
          AI Assistant
        </Button>

        <Button
          icon={<PlusOutlined />}
          onClick={() => router.push("/exoplanets/upload")}
          type="primary"
          block
          style={{
            backgroundColor: "#202343",
            border: "none",
            color: "#D0E0F3",
            fontSize: "1vw",
            fontWeight: "600",
            fontFamily: "Jura",
            textAlign: "left",
            padding: "0.8vw 1vw",
            borderRadius: "0.7vw",
          }}
        >
          Add Exoplanet
        </Button>

        <Button
          icon={<UserOutlined />}
          onClick={() => router.push(`/users/${currentUserId}`)}
          type="primary"
          block
          style={{
            backgroundColor: "#202343",
            border: "none",
            color: "#D0E0F3",
            fontSize: "1vw",
            fontWeight: "600",
            fontFamily: "Jura",
            textAlign: "left",
            padding: "0.8vw 1vw",
            borderRadius: "0.7vw",
          }}
        >
          Profile
        </Button>

        <Button
          icon={<QuestionCircleOutlined />}
          onClick={() => {}}
          type="primary"
          block
          style={{
            backgroundColor: "#202343",
            border: "none",
            color: "#D0E0F3",
            fontSize: "1vw",
            fontWeight: "600",
            fontFamily: "Jura",
            textAlign: "left",
            padding: "0.8vw 1vw",
            borderRadius: "0.7vw",
          }}
        >
          Help
        </Button>

        <Button
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          type="primary"
          danger
          block
          style={{
            backgroundColor: "#442929",
            border: "none",
            color: "#FFD6D6",
            fontSize: "1vw",
            fontWeight: "600",
            fontFamily: "Jura",
            textAlign: "left",
            padding: "0.8vw 1vw",
            borderRadius: "0.7vw",
          }}
        >
          Logout
        </Button>
      </div>

      {/* Header */}
      <div
        style={{
          width: "60vw",
          height: "12vh",
          marginLeft: "16vw",
          textAlign: "left",
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
          marginLeft: "16vw",
          height: "auto",
          width: "82vw",
          maxWidth: "1500px",
          background: "rgba(10, 10, 10, 0.4)",
          border: "none",
          borderRadius: "1vw",
          overflow: "hidden",
          zIndex: 1,
        }}
        styles={{ body: { padding: "2vh", backgroundColor: "black" } }}
      >
        {/* Flex Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1.5vw",
            minHeight: "75vh",
            width: "100%",
          }}
        >
          {/* Left Side */}
          <div
            style={{
              flex: 2,
              backgroundColor: "rgba(10, 10, 10, 0.4)",
              borderRadius: "1.5vw",
              padding: "2vh 1vw",
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <h2
              style={{
                fontFamily: "Jura",
                background: "linear-gradient(90deg, #FFFFFF 0%,rgb(134, 185, 239) 100%)",
                WebkitBackgroundClip: "text",
                color: "transparent",
                fontWeight: "700",
                fontSize: "2vw",
                lineHeight: "1.2",
                marginBottom: "2vh",
              }}
            >
              Exoplanet Populations
            </h2>
            <div style={{ width: "100%", height: "100%", position: "relative" }}>
              <StarMap />
            </div>
          </div>

          {/* Right Side */}
          <div
            style={{
              flex: 1,
              backgroundColor: "rgba(10, 10, 10, 0.4)",
              borderRadius: "1.5vw",
              padding: "2vh 1vw",
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <h2
              style={{
                fontFamily: "Jura",
                background: "linear-gradient(90deg, #FFFFFF 0%,rgb(178, 214, 253) 100%)",
                WebkitBackgroundClip: "text",
                color: "transparent",
                fontWeight: "700",
                fontSize: "2vw",
                lineHeight: "1.2",
                marginBottom: "2vh",
              }}
            >
              Earth Similarity Ranking
            </h2>
            <div style={{ width: "100%" }}>
              <ExoplanetRanking />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

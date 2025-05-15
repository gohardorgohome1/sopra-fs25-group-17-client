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
  TeamOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import "react-toastify/dist/ReactToastify.css";
import UnseenNotificationsButton from "../components/UnseenNotificationsButton";
import StarMap from "../components/starMap";
import InfoTooltip from "../components/infoToolTip"; 
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
          icon={<TeamOutlined />}
          onClick={() => router.push(`/users`)}
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
          Users Page
        </Button>

        <InfoTooltip
          content={
            <div style={{
              fontSize: "16px",
              lineHeight: "1.6",
              fontFamily: "Jura, sans-serif",
              textAlign: "left",
              color: "#FFD9D9"
            }}>
              <h3 style={{
                textAlign: "center",
                fontSize: "22px",
                marginBottom: "20px",
                fontWeight: "bold"
              }}>
                🪐 About the Exoplanet Hunting Platform 🪐
              </h3>
        
              <p>
                This platform is designed to support the search for potentially habitable exoplanets
                by analyzing light from distant stars. Our main focus is the study of <strong>planetary transits</strong> — events where an exoplanet crosses in front of its host star, as seen from Earth.
              </p>
        
              <p>
                During a transit, the star&apos;s light slightly dims. This change in brightness is
                recorded as a <em>photometric curve</em>, which users can upload to our system.
                From this curve, the platform calculates the percentage drop in brightness and,
                using additional data from NASA&apos;s Exoplanet Archive API, estimates key planetary characteristics.
              </p>
        
              <p>These include:</p>
        
              <ul style={{
                paddingLeft: "25px",
                marginBottom: "16px",
                listStyleType: "disc"
              }}>
                <li>Mass, radius, and orbital period</li>
                <li>Density and surface gravity</li>
                <li>Theoretical surface temperature</li>
                <li>Earth Similarity Index (ESI)</li>
              </ul>
        
              <p>
                The <strong>ESI</strong> is especially important because it measures how similar an exoplanet
                is to Earth, helping identify planets that may support life.
              </p>
        
              <p style={{ marginTop: "14px" }}>
                This tool aims to automate and simplify exoplanet analysis,
                making the science behind planetary habitability more accessible for students,
                researchers, and space enthusiasts alike.
              </p>
        
              <p style={{ marginTop: "14px" }}>
                By offering a visual, intuitive interface for analyzing and comparing exoplanets,
                this platform helps bridge the gap between raw scientific data and human understanding, 
                empowering users to contribute to space exploration in a hands-on, interactive app.
              </p>
            </div>
          }
        >
          <Button
            icon={<QuestionCircleOutlined />}
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
        </InfoTooltip>



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
        <div
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "0.6vw",
            padding: "0.8vh 1.2vw",
            color: "#D0E0F3",
            fontFamily: "Jura, sans-serif",
            fontSize: "0.95vw",
            fontWeight: 500,
            boxShadow: "0 0 12px rgba(0,0,0,0.4)",
            maxWidth: "13vw",
            lineHeight: "1.5",
            textAlign: "center",
            transform: "translateY(280px) translateX(-215px)"
          }}
        >
          You can view an exoplanet’s profile <br /> by clicking on it in the plot or the ranking.
        </div>
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
              <InfoTooltip
                tooltipStyle={{
                  maxWidth: "1000px",
                  width: "80vw",
                  padding: "30px 40px",
                  fontSize: "16px",
                  textAlign: "left",
                  lineHeight: "1.6",
                  color: "#FFD9D9",
                }}
                content={
                  <div>
                    <h3 style={{ textAlign: "center", fontSize: "20px", marginBottom: "18px", fontWeight: "bold" }}>
                      About Exoplanet Population Types
                    </h3>
                    <p>
                      Most of the discovered exoplanets with the transit method fall into the <strong>Hot Jupiters</strong> category, as these are large gas giants
                      that orbit very close to their stars. Their size and short orbital period make their transits a lot easier to detect, as there is a larger drop in
                      luminosity when the exoplanet is in front of the star.
                    </p>
                    <p>
                      What do the categories in the diagram represent?
                    </p>
                    <ul style={{ paddingLeft: "20px" }}>
                      <li><strong>Hot Jupiters:</strong> Large gas giants with short orbital periods and high temperatures.</li>
                      <li><strong>Cold Gas Giants:</strong> Similar to Jupiter or Saturn, but orbit farther from their star.</li>
                      <li><strong>Ocean Worlds & Ice Giants:</strong> Mid-sized planets, possibly rich in water or ice.</li>
                      <li><strong>Rocky Planets:</strong> Terrestrial planets with solid surfaces. Some may be Earth-like.</li>
                      <li><strong>Lava Worlds:</strong> Rocky planets extremely close to their stars, likely with molten surfaces.</li>
                      <li><strong>Earth-Like Planets:</strong> Similar size and orbit to Earth, but much harder to detect.</li>
                    </ul>
                    <p style={{ marginTop: "14px" }}>
                      Detection bias plays a big role: small or distant planets create weaker signals,
                      so we tend to find the big, hot ones first.
                    </p>
                  </div>
                }
              >
                <span
                  style={{
                    backgroundColor: "#E0FFFF",
                    color: "#000",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    fontSize: "12px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    userSelect: "none",
                    cursor: "pointer",
                    transform: "translateY(-8px)"
                  }}
                >
                  i
                </span>
              </InfoTooltip>
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
              <InfoTooltip
                tooltipStyle={{
                  maxWidth: "1000px",
                  width: "80vw",
                  padding: "30px 40px",
                  fontSize: "16px",
                  textAlign: "left",
                  lineHeight: "1.6",
                  color: "#FFD9D9"
                }}
                content={
                  <div>
                    <h3 style={{ textAlign: "center", fontSize: "20px", marginBottom: "18px", fontWeight: "bold" }}>
                      About the Earth Similarity Ranking
                    </h3>
                    <p>
                      This ranking shows the top exoplanets that most closely resemble Earth, based on the
                      <strong> Earth Similarity Index (ESI)</strong>. The ESI considers parameters like
                      radius, temperature, density, and gravity to estimate how similar a planet is to Earth.
                    </p>

                    <p>
                      The higher the percentage, the closer the planet is to Earth-like conditions.
                      While these values are calculated scientifically, they are meant to be a <strong>guiding</strong> tool rather
                      than an absolute truth about habitability.
                    </p>

                    <p style={{ marginTop: "14px" }}>
                      All planets ranked here are uploaded by users of the platform, so that they are more prone to seek for new
                      discoveries and contributions, making the exploration of potentially habitable exoplanets more accessible and interactive.
                    </p>
                  </div>
                }
              >
                <span
                  style={{
                    backgroundColor: "#E0FFFF", 
                    color: "#000",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    fontSize: "12px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    userSelect: "none",
                    cursor: "pointer",
                    transform: "translateY(-8px)"
                  }}
                >
                  i
                </span>
              </InfoTooltip>
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

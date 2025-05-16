"use client";

import React, { useEffect, useState } from "react";
import { Card, Button } from "antd";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi"; // Make sure this hook is correctly implemented
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import InfoTooltip from "../components/infoToolTip"; 
// import { FaHandPaper } from "react-icons/fa";
// import { PiHandWaving } from "react-icons/pi";
import { MdWavingHand } from "react-icons/md";


interface User {
  id: string;
  username: string;
  creation_date: string;
}

interface Exoplanet {
  id: string;
  ownerId: string;
}

const AllUsersPage = () => {
  const router = useRouter();
  const apiService = useApi();

  const [users, setUsers] = useState<User[]>([]);
  const [exoplanets, setExoplanets] = useState<Exoplanet[]>([]);  
  const [searchTerm, setSearchTerm] = useState("");
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserRank = (count: number) => {
    if (count === 0) return { label: "Novice", color: "#999", bg: "rgba(136, 136, 136, 0.2)" };
    if (count <= 2) return { label: "Explorer", color: "#cd7f32", bg: "rgba(205, 127, 50, 0.2)" }; // bronze
    if (count <= 5) return { label: "Veteran", color: "#c0c0c0", bg: "rgba(192, 192, 192, 0.2)" }; // silver
    return { label: "Professional", color: "#ffd700", bg: "rgba(255, 215, 0, 0.2)" }; // gold
  };  

  useEffect(() => {
    const fetchUsersAndExoplanets = async () => {
      try {
        const usersResponse = await apiService.get<User[]>("/users");
        const exoplanetsResponse = await apiService.get<Exoplanet[]>("/exoplanets");
        setUsers(usersResponse);
        setExoplanets(exoplanetsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchUsersAndExoplanets();
  }, [apiService]);

    const sendNudge = async (toUserId: string) => {
      const fromUserId = localStorage.getItem("userId");
      if (!fromUserId) return;

      try {
        await apiService.post("/notifications/nudge", {
          fromUserId,
          toUserId,
        });
      } catch (error) {
        console.error("Failed to send nudge:", error);
      }
    };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: 'white', overflow: 'hidden' }}>
      <div className="exoplanet-background" style={{
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -10,
      }}>

        <div
          style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Card
            style={{
              width: "95vw",
              height: "95vh",
              background: "black",
              border: "none",
              borderRadius: 98,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1,
              position: "relative",
              marginTop: "2vh", 
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "4vw",
                top: "4vh",
                width: "60vw",
                fontSize: "7vh",
                fontFamily: "Koulen",
                fontWeight: "400",
                background: "linear-gradient(90deg, #FFD9D9, #00b4b4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              All Users
            </div>

            <div
              style={{
                position: "absolute",
                top: "3vh",      
                right: "4vw",   
                zIndex: 3,
              }}
            >
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
                      🏅 User Rank System 🏅
                    </h3>

                    <p>Each user is assigned a rank based on the number of exoplanets they’ve discovered:</p>

                    <ul style={{ paddingLeft: "25px", marginBottom: "16px", listStyleType: "disc" }}>
                      <li><strong>Novice</strong>: 0 exoplanets — <span style={{ color: "#999" }}>gray badge</span></li>
                      <li><strong>Explorer</strong>: 1–2 exoplanets — <span style={{ color: "#cd7f32" }}>bronze badge</span></li>
                      <li><strong>Veteran</strong>: 3–5 exoplanets — <span style={{ color: "#c0c0c0" }}>silver badge</span></li>
                      <li><strong>Professional</strong>: 6+ exoplanets — <span style={{ color: "#ffd700" }}>gold badge</span></li>
                    </ul>

                    <p>These ranks highlight user engagement and contribution to the exoplanet database.</p>
                  </div>
                }
              >
                    <div
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        borderRadius: "12px",
                        boxShadow: "0 0 20px rgba(115, 203, 201, 0.4)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        transition: "background-color 0.3s ease",
                      }}
                    >
                      <span
                        style={{
                          cursor: "pointer",
                          fontFamily: "Karantina",
                          fontSize: "26px",
                          background: "linear-gradient(90deg, #FFD9D9, #73CBC9)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        User Ranks
                      </span>
                    </div>
              </InfoTooltip>
            </div>


            <Card
              style={{
                width: "92vw",
                height: "75vh",
                top: "10vh",
                position: "relative",
                background: "black",
                border: "none",
                borderRadius: 98,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                zIndex: 2,
                padding: "2rem",
              }}
            >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "92%", // aligns with card width
                margin: "-2rem auto 2rem auto",
              }}
            >
              <Input
                placeholder="Search by username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                prefix={<SearchOutlined style={{ color: "#73CBC9", marginRight: 8 }} />}
                style={{
                  width: "60%",
                  fontFamily: "Jura",
                  fontSize: "16px",
                  borderRadius: "24px",
                  padding: "10px 16px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                  border: "1px solid #73CBC9",
                  boxShadow: "0 0 10px rgba(115, 203, 201, 0.4)",
                }}
              />

              <div
                style={{
                  fontSize: "2.8vh",
                  fontFamily: "Karantina",
                  fontWeight: "700",
                  marginLeft: "2rem",
                  background: "linear-gradient(90deg, #FFD9D9, #73CBC9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  whiteSpace: "nowrap",
                }}
              >
                Click a user to view their profile
              </div>
            </div>


              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "2rem",
                  justifyContent: "center",
                }}
              >
                {filteredUsers.map((user) => {
                  const count = exoplanets.filter(planet => planet.ownerId === user.id).length;
                  const rank = getUserRank(count);

                  return (
                    <Button
                      key={user.id}
                      onClick={() => router.push(`/users/${user.id}`)}
                      style={{
                        width: "25vw",
                        height: "12vh",
                        borderRadius: 48,
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        border: "none",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                        <span
                          style={{
                            fontSize: "24px",
                            fontFamily: "Jura",
                            fontWeight: "bold",
                            background: "linear-gradient(90deg, #73CBC9, #FFD9D9)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {user.username}
                        </span>

                        <MdWavingHand
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent navigation when clicking the icon
                            sendNudge(user.id);
                          }}
                          title="say hi!"
                          style={{
                            fontSize: "30px",
                            cursor: "pointer",
                            color:"rgb(255, 200, 66)",
                            transition: "transform 0.2s",
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.4)")}
                          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        />
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span
                          style={{
                            fontSize: "16px",
                            fontFamily: "Jura",
                            background: "linear-gradient(90deg, #FFD9D9, #73CBC9)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {user.creation_date.substring(0, 10)}
                        </span>

                        <span
                          style={{
                            fontSize: "12px",
                            fontFamily: "Jura",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            backgroundColor: rank.bg,
                            color: rank.color,
                            fontWeight: 600,
                          }}
                        >
                          {rank.label}
                        </span>
                      </div>
                    </Button>
                  );
                })}

              </div>
            </Card>

            <Button
              onClick={() => router.push("/dashboard")}
              type="primary"
              htmlType="button"
              style={{
                width: "10vw",
                height: "6vh",
                background: "black",
                borderRadius: 46,
                position: "absolute",
                left: "4vw",
                top: "87vh",
                textAlign: "center",
                color: "#8A5555",
                fontSize: "20px",
                fontFamily: "Karantina",
                fontWeight: "700",
                boxShadow: "0px 0px 40px 12px rgba(255, 0, 0, 0.25)",
                zIndex: 2,
              }}
            >
              <span
                style={{
                  background: "linear-gradient(90deg, #8A5555, #FFFFFF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  WebkitTextStrokeWidth: "1px",
                  WebkitTextStrokeColor: "#000000",
                }}
              >
                Back to Dashboard
              </span>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AllUsersPage;

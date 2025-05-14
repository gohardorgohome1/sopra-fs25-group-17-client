"use client";

import React, { useEffect, useState } from "react";
import { Card, Button } from "antd";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi"; // Make sure this hook is correctly implemented

interface User {
  id: string;
  username: string;
  creation_date: string;
}

const AllUsersPage = () => {
  const router = useRouter();
  const apiService = useApi();

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiService.get<User[]>("/users");
        setUsers(response);
      } catch (error) {
        if (error instanceof Error) {
          alert(`Failed to fetch users: ${error.message}`);
        } else {
          console.error("Unknown error fetching users");
        }
      }
    };

    fetchUsers();
  }, [apiService]);

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
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "4vw",
                top: "4vh",
                width: "60vw",
                fontSize: "10vh",
                fontFamily: "Koulen",
                fontWeight: "400",
                background: "linear-gradient(90deg, #FFD9D9, #00b4b4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              All Users
            </div>

            <Card
              style={{
                width: "92vw",
                height: "75vh",
                top: "14vh",
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
                  textAlign: "center",
                  fontSize: "4vh",
                  fontFamily: "Karantina",
                  fontWeight: "700",
                  marginBottom: "2rem",
                  background: "linear-gradient(90deg, #FFD9D9, #73CBC9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Click a user to view their profile
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "2rem",
                  justifyContent: "center",
                }}
              >
                {users.map((user) => (
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
                  </Button>
                ))}
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

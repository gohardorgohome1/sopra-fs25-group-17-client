"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // use NextJS router for navigation
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Button, Form, Input } from "antd";
// Optionally, you can import a CSS module or file for additional styling:
// import styles from "@/styles/page.module.css";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [users, setUsers] = useState<User[] | null>(null);
  const {
      value: token,
      clear: clearToken,
    } = useLocalStorage<string>("token", "");

  const handleLogout = async () : Promise<void> => {
    // Clear token using the returned function 'clear' from the hook
    try {
      const userId = localStorage.getItem("userId"); // Retrieve the logged-in user's ID
      if (!userId) return; // No ID? Skip request
      // await fetch(`/users/${userId}/logout`, { method: "PUT" });
      // const response = await apiService.put<void>(`/users/${userId}/logout`, {});
      await apiService.put<void>(`/dashboard/logout`, {});
    } catch (error) {
      console.error("Logout failed:", error);
    }

    clearToken();
    router.push("/login");
  };
  useEffect(() => {
      const storedToken = localStorage.getItem("token"); 
      if(!storedToken){
        router.push("/login");
        return;
      }
      const fetchUsers = async () => {
        
        try {
          // apiService.get<User[]> returns the parsed JSON object directly,
          // thus we can simply assign it to our users variable.
          const users: User[] = await apiService.get<User[]>("/users");
          setUsers(users);
          console.log("Fetched users:", users);
        } catch (error) {
          if (error instanceof Error) {
            alert(`Something went wrong while fetching users:\n${error.message}`);
          } else {
            console.error("An unknown error occurred while fetching users.");
          }
        }
      };
  
      fetchUsers();
    }, [token, apiService, router]);

  return (
    <div className="dashboard-container">
    
    <Button onClick={handleLogout}
      type="primary"
      className="logout-button"
      style={{
        position: "absolute", // position & size
        top: "15px",
        right: "20px",
        width: "130px", // button size & style
        height: "42px",
        background: "#202343",
        borderRadius: 13,

        textAlign: "center", // Text size & style
        color: "#FFFFFF",
        fontSize: "24px",
        fontFamily: "Jura", // imported fontFamily -> see top of globals.css
        fontWeight: "700",

        boxShadow: "none", // removes default green shadow of button
        zIndex: 1,
      }}
    >
    <span
    >
      Logout
    </span>
    </Button>

    <div
      style={{
        width: "800px",
        height: "168px",
        top: "35px",
        left: "30px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          position: "relative",
          fontSize: "80px",
          fontFamily: "Koulen",
          fontWeight: "400",
          color: "#D0E0F3",
          zIndex: 1,
        }}
      >
        EXOPLANET DASHBOARD
      </h1>
    </div>
    </div>
    
  );
};

export default Dashboard;

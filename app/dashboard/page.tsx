"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import React, { useEffect, useState} from "react";
// import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // use NextJS router for navigation
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
//import { User } from "@/types/user";
import { Button, Card } from "antd";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { ToastContainer, toast } from 'react-toastify';  // Importing toast functionality
import 'react-toastify/dist/ReactToastify.css';  // Importing styles for toast
import NotificationToast from "@/components/NotificationToast"; 
// Optionally, you can import a CSS module or file for additional styling:
// import styles from "@/styles/page.module.css";

import StarMap from "../components/starMap";  // Import the StarMap component
import ExoplanetRanking from "../components/exoplanetRanking";  // Import the ExoplanetRanking component


const Dashboard: React.FC = () => {
  const [exoplanets, setExoplanets] = useState([]);
  const router = useRouter();
  const apiService = useApi();
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
      await apiService.put<void>(`/users/${userId}/logout`, {});
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
      
    }, [token, apiService, router]);


  useEffect(() => {
    const client = new Client({
      webSocketFactory: () =>
        new SockJS("http://localhost:8080/ws"),
      // REAL SERVER: "https://sopra-fs25-group-17-server.oa.r.appspot.com/ws"
      // LOCAL SERVER: "http://localhost:8080/ws"
      connectHeaders: {},
      onConnect: () => {
        // Once connected, subscribe to the "/topic/exoplanets" topic
        client.subscribe("/topic/exoplanets", (message) => {
        const payload = JSON.parse(message.body);
        // Extract the username and exoplanet info from the payload
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

    <Button onClick={handleLogout}
      type="primary"
      className="logout-button"
      style={{
        position: "absolute", // position & size
        top: "2vh",
        right: "2vw",
        width: "8vw", // button size & style
        height: "3vw",
        background: "#202343",
        borderRadius: "0.8vw",

        textAlign: "center", // Text size & style
        color: "#FFFFFF",
        fontSize: "1.4vw",
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


    <Card //Card that contains interactive map and Earth Similarity Ranking
        className="dashboard-container"
        style={{
          position: "relative",
          marginTop: "1vh",       // pushes it down, adjust as needed
          marginLeft: "auto",     // centers horizontally
          marginRight: "auto",    // centers horizontally
          //padding: "0.5vw", // position & size
          //paddingTop: "0.5vh", // adjust to center vertically
          height: "100vh",
          width: "97vw",
          maxWidth: "1500px" ,
          background: "#000000",
          border: "none",
          borderRadius: "1vw",
          overflow: "hidden", // prevents children from spilling out
          zIndex: 1,  // foreground
          //outline: "1px solid lime",
        }}
        styles={{ body: { padding: "0", backgroundColor: "black" } }} // overrides antd Card setting

      >
      {/* Flexbox container for left and right side */}
      <div
            style={{
              display: "flex",
              flexDirection: "row", // Align children horizontally
              gap: "0.5vw", // Space between the sides
              height: "80vh", // Ensure it takes full height
              width: "100%",
              flex: 1,
            }}
          >
            {/* Left Side */}
            <div
              style={{
                flex: 2, // uses 2/3 of the space
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
                  background: "linear-gradient(90deg, #FFFFFF 0%, #0058B6 100%)", // Apply gradient to text
                  WebkitBackgroundClip: "text", // Clip the background to the text
                  color: "transparent", // Make the text color transparent so the gradient shows through
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
                flex: 1, // uses 1/3 of the space
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
                background: "linear-gradient(90deg, #FFFFFF 0%, #0058B6 100%)", // Apply gradient to text
                WebkitBackgroundClip: "text", // Clip the background to the text
                color: "transparent", // Make the text color transparent so the gradient shows through
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
                  backgroundColor:"#A5ADFF",
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

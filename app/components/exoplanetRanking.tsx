"use client";

import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { FaBars } from "react-icons/fa";

interface Exoplanet {
  id: string;
  planetName: string;
  earthSimilarityIndex: number;
  fractionalDepth: number;
  density: number;
  orbitalPeriod: number;
  radius: number;
  surfaceGravity: number;
  theoreticalTemperature: number;
  mass: number;
  escapeVelocity: number;
  ownerId: string;
  ownerUsername?: string;
}

interface User {
  id: string;
  username: string;
}

interface Props {
  filterKey: FilterKey;
  setFilterKey: React.Dispatch<React.SetStateAction<FilterKey>>;
}


type FilterKey =
  | "earthSimilarityIndex"
  | "density"
  | "mass"
  | "radius"
  | "surfaceGravity"
  | "theoreticalTemperature"
  | "orbitalPeriod"
  | "escapeVelocity"
  | "fractionalDepth";


const ExoplanetRanking: React.FC<Props> = ({ filterKey, setFilterKey }) => {
  const apiService = useApi();
  const router = useRouter();
  const [exoplanets, setExoplanets] = useState<Exoplanet[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchExoplanets = async () => {
      try {
        const planets: Exoplanet[] = await apiService.get<Exoplanet[]>("/exoplanets");

        const exoplanetPromises = planets.map(async (planet) => {
          if (planet.ownerId) {
            try {
              const user: User = await apiService.get<User>(`/users/${planet.ownerId}`);
              planet.ownerUsername = user?.username ?? "Unknown";
            } catch (error) {
              console.error(`Error fetching user for ownerId ${planet.ownerId}:`, error);
              planet.ownerUsername = "Unknown";
            }
          } else {
            planet.ownerUsername = "Unknown";
          }
          return planet;
        });

        const updatedExoplanets = await Promise.all(exoplanetPromises);
        setExoplanets(updatedExoplanets);
      } catch (error) {
        alert(`Error fetching exoplanets: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchExoplanets();
  }, [reloadKey]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("https://sopra-fs25-group-17-server.oa.r.appspot.com/ws"),
      connectHeaders: {},
      onConnect: () => {
        client.subscribe("/topic/exoplanets", () => {
          setReloadKey((prev) => prev + 1);
        });
      },
      onDisconnect: () => console.log("WebSocket disconnected"),
    });

    client.activate();
    return () => {
      client.deactivate();
    };
  }, []);

  if (loading) {
    return <div style={{ color: "#DADADA", fontFamily: "Jura, monospace" }}>Loading...</div>;
  }

  const sortedExoplanets = [...exoplanets].sort(
    (a, b) => (b[filterKey] as number) - (a[filterKey] as number)
  );

  const filterOptions: FilterKey[] = [
  "earthSimilarityIndex",
  "density",
  "mass",
  "radius",
  "surfaceGravity",
  "theoreticalTemperature",
  "orbitalPeriod",
  "escapeVelocity",
  "fractionalDepth",
];


  const insertSpacesBeforeCaps = (str: string) =>
    str.replace(/([a-z])([A-Z])/g, "$1 $2");

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(10, 10, 10, 0.4)",
        borderRadius: "16px",
        boxShadow: "0 0 10px rgba(255,255,255,0.08)",
        padding: "0px",
      }}
    >
      {/* Filter dropdown */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
        <div
          style={{
            backgroundColor: "#D9D9D9",
            borderRadius: "12px",
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            fontFamily: "Jura, monospace",
            fontWeight: "bold",
            fontSize: "16px",
            color: "#0A0A0A",
            gap: "8px",
            cursor: "pointer",
          }}
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          Filter by <FaBars color="#0A0A0A" size={18} />
        </div>

        <div style={{ position: "relative" }}>
          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "40px",
                left: 0,
                backgroundColor: "#101826",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                padding: "8px 0",
                zIndex: 1000,
              }}
            >
              {filterOptions.map((key) => (
                <div
                  key={key}
                  onClick={() => {
                    setFilterKey(key);
                    setDropdownOpen(false);
                  }}
                  style={{
                    padding: "8px 16px",
                    color: "#EDEDED",
                    fontFamily: "Jura, monospace",
                    fontSize: "16px",
                    cursor: "pointer",
                    textTransform: "capitalize",
                    whiteSpace: "nowrap",
                  }}
                >
                  {insertSpacesBeforeCaps(key)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ranking list */}
      {sortedExoplanets.length > 0 && (
        <div
          key={JSON.stringify(sortedExoplanets)}
          style={{
            display: "flex",
            flexDirection: "column",
            maxHeight: "60vh",
            overflowY: "auto",
            gap: "15px",
            padding: "20px",
            position: "relative",
          }}
        >
          {sortedExoplanets.map((exo, index) => {
            let value: string;
            if (filterKey === "earthSimilarityIndex") {
              value = ((exo[filterKey] as number) * 100).toFixed(0) + "%";
            } else if (filterKey === "fractionalDepth") {
              value = ((exo[filterKey] as number) * 100).toFixed(2) + "%";
            } else if (filterKey === "theoreticalTemperature") {
              value = (exo[filterKey] as number).toFixed(1);
            } else {
              value = (exo[filterKey] as number).toFixed(2);
            }

            return (
              <div
                key={exo.id}
                onClick={() => router.push(`/exoplanets/${exo.id}`)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontFamily: "Jura, monospace",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#EDEDED",
                }}
                onMouseEnter={(e) => {
                  const box = e.currentTarget.querySelector(".planet-box") as HTMLElement;
                  const hoverText = e.currentTarget.querySelector(".hover-text") as HTMLElement;
                  if (box) {
                    box.style.backgroundColor = "#2A2A2A";
                    box.style.color = "#FFFFFF";
                  }
                  if (hoverText) {
                    hoverText.style.display = "block";
                  }
                }}
                onMouseLeave={(e) => {
                  const box = e.currentTarget.querySelector(".planet-box") as HTMLElement;
                  const hoverText = e.currentTarget.querySelector(".hover-text") as HTMLElement;
                  if (box) {
                    box.style.backgroundColor = "#0F1D56";
                    box.style.color = "#EDEDED";
                  }
                  if (hoverText) {
                    hoverText.style.display = "none";
                  }
                }}
              >
                {/* Rank number */}
                <span style={{ minWidth: "20px", textAlign: "right" }}>{index + 1}.</span>

                {/* Name + value box */}
                <div
                  className="planet-box"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#0F1D56",
                    borderRadius: "8px",
                    height: "40px",
                    padding: "0 12px",
                    flexGrow: 1,
                    transition: "background-color 0.2s, color 0.2s",
                    position: "relative",
                  }}
                >
                  <span style={{ whiteSpace: "nowrap" }}>{exo.planetName}</span>
                  <span style={{ minWidth: "10vw", textAlign: "right" }}>{value}</span>
                  <div
                    className="hover-text"
                    style={{
                      display: "none",
                      position: "absolute",
                      backgroundColor: "#2A2A2A",
                      color: "#FFF",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      fontSize: "14px",
                      zIndex: 10,
                      top: "-10px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      whiteSpace: "nowrap",
                      fontWeight: "bold",
                    }}
                  >
                    Uploaded by {exo.ownerUsername}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExoplanetRanking;

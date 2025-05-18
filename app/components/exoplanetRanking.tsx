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
        const planets = await apiService.get<Exoplanet[]>("/exoplanets");

        const exoplanetPromises = planets.map(async (planet) => {
          if (planet.ownerId) {
            try {
              const user = await apiService.get<User>(`/users/${planet.ownerId}`);
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

  const maxValue = Math.max(...sortedExoplanets.map(p => p[filterKey] as number));

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

      {sortedExoplanets.length > 0 && (
        <div
          key={JSON.stringify(sortedExoplanets)}
          style={{
            display: "flex",
            flexDirection: "column",
            maxHeight: "60vh",
            overflowY: "auto",
            gap: "20px",
            padding: "20px 30px",
            position: "relative",
          }}
        >
          <style jsx>{`
            ::-webkit-scrollbar {
              width: 6px;
            }
            ::-webkit-scrollbar-thumb {
              background:rgb(32, 40, 54);
              border-radius: 3px;
            }
            ::-webkit-scrollbar-track {
              background: transparent;
            }
          `}</style>

          {sortedExoplanets.map((exo, index) => {
            const rawValue = exo[filterKey] as number;
            let value: string;
            if (filterKey === "earthSimilarityIndex") {
              value = (rawValue * 100).toFixed(0) + "%";
            } else if (filterKey === "fractionalDepth") {
              value = (rawValue * 100).toFixed(2) + "%";
            } else if (filterKey === "theoreticalTemperature") {
              value = rawValue.toFixed(1);
            } else {
              value = rawValue.toFixed(2);
            }

            const barWidth = (rawValue / maxValue) * 100;

            return (
              <div
                key={exo.id}
                onClick={() => router.push(`/exoplanets/${exo.id}`)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  fontFamily: "Jura, monospace",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#DDE4F0",
                }}
              >
                <span style={{ width: "140px", color: "#8DA3B7" }}>
                  {index + 1}. {exo.planetName}
                </span>
                <div
                  style={{
                    flexGrow: 1,
                    position: "relative",
                    height: "22px",
                    backgroundColor: "#12141A",
                    borderRadius: "4px",
                    overflow: "hidden",
                    marginLeft: "12px",
                  }}
                >
                  {barWidth > 20 ? (
                    <div
                      style={{
                        width: `${barWidth}%`,
                        height: "100%",
                        backgroundColor:  "#1B2A41",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        paddingRight: "8px",
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        transition: "width 0.4s ease-in-out",
                      }}
                    >
                      {value}
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          width: `${barWidth}%`,
                          height: "100%",
                          backgroundColor: "#1B2A41",
                          transition: "width 0.4s ease-in-out",
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          left: `calc(${barWidth}% + 8px)`,
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        {value}
                      </span>
                    </>
                  )}
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

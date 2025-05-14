"use client";
// ExoplanetRanking.tsx
import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
import type { Layout } from "plotly.js";
import { FaBars } from "react-icons/fa"; // Import the icon



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
}

// Define ExoplanetRanking as a React Functional Component
const ExoplanetRanking: React.FC = () => {
  const apiService = useApi();
  const router = useRouter();
  const [plotReady, setPlotReady] = useState(false);
  const [exoplanets, setExoplanets] = useState<Exoplanet[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);  
  const [filterKey, setFilterKey] = useState<keyof Exoplanet>("earthSimilarityIndex");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchExoplanets = async () => {
      try {
        const planets: Exoplanet[] = await apiService.get<Exoplanet[]>("/exoplanets");
        setExoplanets(planets);
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
          setReloadKey(prev => prev + 1);
        });
      },
      onDisconnect: () => console.log("WebSocket disconnected"),
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  useEffect(() => {
    if (!loading && exoplanets.length > 0) {
      setPlotReady(true);
    }
  }, [loading, exoplanets]);

  if (loading) {
    return <div style={{ color: "#DADADA", fontFamily: "Jura, monospace" }}>Loading...</div>;
  }

  //const uniqueExoplanets = Array.from(
  //  new Map(exoplanets.map(planet => [planet.planetName, planet])).values()
  //);
  
  const sortedExoplanets = [...exoplanets].sort((a, b) => (b[filterKey] as number) - (a[filterKey] as number))
  //.slice(0, 10);
  
  const totalTextWidth = 50;

  const text = sortedExoplanets.map((exoplanet) => {
    const planetName = exoplanet.planetName;
    let value: string;
    if (filterKey === "earthSimilarityIndex") {
      value = ((exoplanet[filterKey] as number) * 100).toFixed(0) + "%";
    }
    else if (filterKey === "fractionalDepth") {
      value = ((exoplanet[filterKey] as number) * 100).toFixed(2) + "%";
    }
    else if (filterKey === "theoreticalTemperature") {
      value = (exoplanet[filterKey] as number).toFixed(1);
    }
    else {
      value = (exoplanet[filterKey] as number).toFixed(2);
    }
    //const paddingLength = Math.max(1, totalTextWidth - planetName.length - value.length);
    //const spacer = " ".repeat(paddingLength);
  
    return `${value}`;
  });

  const data: Partial<Plotly.Data>[] = [{
    type: "bar",
    orientation: "h",
    x: sortedExoplanets.map((exo) => exo[filterKey] as number),
    y: sortedExoplanets.map((_, index) => index + 1),
    text: text,
    // x: Array(sortedExoplanets.length).fill(0.08),
    // y: sortedExoplanets.map((exoplanet, index) => index + 1),
    // text: text,
    //text: sortedExoplanets.map((exoplanet, index) => `${exoplanet.planetName} ${(exoplanet.earthSimilarityIndex * 100).toFixed(0)}%`),

    textposition: "auto",
    insidetextanchor: "end",
    marker: {
      color: "#101826",
    },
  }];

  const layout: Partial<Layout> = {
    yaxis: {
      autorange: "reversed",
      tickvals: sortedExoplanets.map((_, index) => index + 1),
      ticktext: sortedExoplanets.map((exo, index) => {
        const name = `${index + 1}. ${exo.planetName}`;
        return name.padEnd(20, " "); 
      }),
      tickfont: {
        family: "Jura, monospace",
        color: "#EDEDED",
        size: 20,
      },
      showline: false,
      showgrid: false,
      zeroline: false,
    },
    xaxis: {
      showticklabels: false,
      showgrid: false,
      zeroline: false,
      showline: false,
      range: [0, Math.max(...sortedExoplanets.map(exo => exo[filterKey] as number)) * 1.1],

    },
    width: 450,
    height: 500,
    paper_bgcolor: "#0A0A0A",
    plot_bgcolor: "#0A0A0A",
    font: {
      family: "Jura, monospace",
      color: "#EDEDED",
      size: 20,
    },
    bargap: 0.35,
    margin: {
      t: 20,
      b: 40,
      l: 200, 
      r: 20,
    },
  };

  const filterOptions: (keyof Exoplanet)[] = [
    "earthSimilarityIndex",
    "density",
    "mass",
    "radius",
    "surfaceGravity",
    "theoreticalTemperature",
    "orbitalPeriod",
    "escapeVelocity",
    "fractionalDepth"
  ];

  const insertSpacesBeforeCaps = (str: string) =>
    str.replace(/([a-z])([A-Z])/g, "$1 $2");

  return (
    <div style={{
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(10, 10, 10, 0.4)",
      borderRadius: "16px",
      boxShadow: "0 0 10px rgba(255,255,255,0.08)",
      padding: "0px",
    }}>
          
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0px" }}>
        <div style={{
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
          cursor: "pointer"
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

  
      {plotReady && sortedExoplanets.length > 0 && (
        <div key={JSON.stringify(sortedExoplanets)} style={{height: "60vh",  overflowY: "auto"  }}>
          <Plot
            data={data}
            layout={{ ...layout, height: sortedExoplanets.length * 50 }}
            useResizeHandler
            onClick={(event) => {
              const pointIndex = event.points?.[0]?.pointIndex;
              if (typeof pointIndex === 'number') {
                const clickedPlanet = sortedExoplanets[pointIndex];
                if (clickedPlanet?.id) {
                  router.push(`/exoplanets/${clickedPlanet.id}`);
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );  
};

export default ExoplanetRanking;

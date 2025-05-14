"use client";
// ExoplanetRanking.tsx
import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
import type { Layout } from "plotly.js";

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface Exoplanet {
  id: string;
  planetName: string;
  earthSimilarityIndex: number;
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
    const paddingLength = Math.max(1, totalTextWidth - planetName.length - value.length);
    const spacer = " ".repeat(paddingLength);
  
    return ` ${planetName}${spacer}${value}`;
  });

  const data = [{
    type: 'bar',
    orientation: 'h',
    x: Array(sortedExoplanets.length).fill(0.08),
    y: sortedExoplanets.map((exoplanet, index) => index + 1),
    text: text,
    //text: sortedExoplanets.map((exoplanet, index) => `${exoplanet.planetName} ${(exoplanet.earthSimilarityIndex * 100).toFixed(0)}%`),

    textposition: "inside",
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
        return name.padEnd(25, " "); 
      }),
      tickfont: {
        family: "Jura, monospace",
        color: "#EDEDED",
        size: 16,
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
      range: [0, 0.3],
    },
    width: 480,
    height: 520,
    paper_bgcolor: "#0A0A0A",
    plot_bgcolor: "#0A0A0A",
    font: {
      family: "Jura, monospace",
      color: "#EDEDED",
      size: 16,
    },
    bargap: 0.3,
    margin: {
      t: 20,
      b: 40,
      l: 170, 
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
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ marginBottom: 0, marginTop: 5 }}>
        <label
          style={{ fontFamily: "Jura, monospace", color: "#EDEDED" }}
        >
          Filter by:{" "}
        </label>
        <select
          value={filterKey}
          onChange={(e) => setFilterKey(e.target.value as keyof Exoplanet)}
          style={{
            backgroundColor: "#101826",
            color: "#EDEDED",
            fontFamily: "Jura, monospace",
            fontWeight: 550,
            fontSize: "16px",
            padding: "4px 4px",
            textTransform: "capitalize",
          }}
        >
          {filterOptions.map((key) => (
            <option key={key} value={key}>
              {insertSpacesBeforeCaps(key)}
            </option>
          ))}
        </select>
      </div>
  
      <div style={{ height: "600px", overflowY: "auto" }}>
        <Plot data={data} layout={{ ...layout, height: sortedExoplanets.length * 50 }} useResizeHandler />
      </div>
    </div>
  );  
};

export default ExoplanetRanking;

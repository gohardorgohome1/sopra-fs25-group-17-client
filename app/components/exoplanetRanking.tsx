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

const ExoplanetRanking: React.FC = () => {
  const apiService = useApi();
  const router = useRouter();
  const [plotReady, setPlotReady] = useState(false);
  const [exoplanets, setExoplanets] = useState<Exoplanet[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

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

  const uniqueExoplanets = Array.from(new Map(exoplanets.map(planet => [planet.planetName, planet])).values());
  const sortedExoplanets = [...uniqueExoplanets]
    .sort((a, b) => b.earthSimilarityIndex - a.earthSimilarityIndex)
    .slice(0, 10);

  const totalTextWidth = 50;
  const text = sortedExoplanets.map((exoplanet) => {
    const planetName = exoplanet.planetName;
    const percentage = (exoplanet.earthSimilarityIndex * 100).toFixed(0) + "%";
    const paddingLength = Math.max(1, totalTextWidth - planetName.length - percentage.length);
    return ` ${planetName}${" ".repeat(paddingLength)}${percentage}`;
  });

  const data: Partial<Plotly.Data>[] = [{
    type: "bar",
    orientation: "h",
    x: Array(sortedExoplanets.length).fill(0.08),
    y: sortedExoplanets.map((_, index) => index + 1),
    text: text,
    textposition: "inside",
    insidetextanchor: "start",
    marker: {
      color: "#101826",
    }
  }];

  const layout: Partial<Layout> = {
    yaxis: {
      autorange: "reversed",
      tickvals: sortedExoplanets.map((_, index) => index + 1),
      ticktext: sortedExoplanets.map((_, index) => `${index + 1}. `),
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
      l: 50,
      r: 20,
    },
  };

  return (
    <div style={{
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(10, 10, 10, 0.8)",
      borderRadius: "16px",
      boxShadow: "0 0 10px rgba(255,255,255,0.08)",
      padding: "20px",
    }}>
      {plotReady && sortedExoplanets.length > 0 && (
        <div key={JSON.stringify(sortedExoplanets)} style={{ width: "100%", height: "100%" }}>
          <Plot
            data={data}
            layout={layout}
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

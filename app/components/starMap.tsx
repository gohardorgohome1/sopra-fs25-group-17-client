import React, { useEffect, useState } from "react";
//import Plot from "react-plotly.js";

//import { useRouter } from "next/navigation";
//import apiService from "../services/apiService"; // Adjust the import based on your structure
import { useApi } from "@/hooks/useApi";

import dynamic from "next/dynamic";

// Dynamically import Plotly.js component with no SSR
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
import type { ScatterData } from "plotly.js";
import type { Layout } from "plotly.js";

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";


interface Exoplanet {
  planetName: string;
  orbitalPeriod: number;
  radius: number;
}

const StarMap: React.FC = () => {

  //const router = useRouter();
  const apiService = useApi();
  const [exoplanets, setExoplanets] = useState<Exoplanet[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const fetchExoplanets = async () => {
      setLoading(true);
      try {
        const planets: Exoplanet[] = await apiService.get<Exoplanet[]>("/exoplanets");
        setExoplanets(planets);
        console.log("Fetched exoplanets:", planets);
      } catch (error) {
        if (error instanceof Error) {
          alert(`Something went wrong while fetching exoplanets:\n${error.message}`);
        } else {
          console.error("Unknown error while fetching exoplanets.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExoplanets();
  }, [reloadKey]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () =>
        new SockJS("http://localhost:8080/ws"),
      // REAL SERVER: "https://sopra-fs25-group-17-server.oa.r.appspot.com/ws"
      // LOCAL SERVER: "http://localhost:8080/ws"
      connectHeaders: {},
      onConnect: () => {
        // Once connected, subscribe to the "/topic/exoplanets" topic
        client.subscribe("/topic/exoplanets", () => {
        // change the variable that triggers reload:
        setReloadKey(prev => prev + 1);
        
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

  if (loading) {
    return <div style={{ color: "white" }}>Loading...</div>;
  }


  

// create a manual point to test: 
  const manualPoint = {
    orbitalPeriod: 3.23469439654,
    radius: 13.31600225,
    planetName: "Test Planet",
  };
  
  // Combine fetched exoplanets with the test point
  const combinedPlanets = [...exoplanets, manualPoint];

  const data: Partial<ScatterData>[] = [
    {
      // x: exoplanets.map((p) => p.orbitalPeriod),
      // y: exoplanets.map((p) => p.radius),
      
      x: combinedPlanets.map((p) => p.orbitalPeriod),
      y: combinedPlanets.map((p) => p.radius),
      text: combinedPlanets.map((p, i) =>
        i === combinedPlanets.length - 1 ? "Test Planet" : p.planetName
      ),


      type: "scatter",
      mode: "markers",
      marker: {
        color: "yellow",
        size: 12,
        opacity: 5,
      },
    },
  ];

  const layout: Partial<Layout> = {
    autosize: true,
    // width: "100%",
    // height: "100vh",
    //width: 800, 
    //height: 600,
    paper_bgcolor: "black",
    plot_bgcolor: "black",
    xaxis: {
      title: { 
        text: "Orbital Period (Days)",
          font: {
            family: "Jura",  // You can change the font family if needed
            size: 15,
            color: "white"
          },
        },
      showline: true,
      linecolor: 'white',
      linewidth: 4, // Thicker line
      type: "log",
      color: "white",
      range: [Math.log10(0.18), Math.log10(1000)],
      showgrid: false,
      zeroline: false,
      tickmode: "array", // Manually set tick positions
      tickvals: [1, 10, 100, 1000], // Set specific ticks
      ticktext: [ "1", "10", "100", "1000"], // Corresponding labels
      tickangle: 0, // If you'd like to adjust label angle
      //ticks: "outside", // Optional: you can set it as "inside" for a different look
      scaleanchor: "y",
    },
    yaxis: {
      title: { 
        text: "Radius (Earth Units)",
          font: {
            family: "Jura",  // You can change the font family if needed
            size: 15,
            color: "white"
          },},
      showline: true,
      linecolor: 'white',
      linewidth: 4, // Thicker line
      type: "log",
      color: "white",
      range: [Math.log10(1.5), Math.log10(7)], 
      showgrid: false,
      zeroline: false,
      tickmode: "array", // Manually set tick positions
      tickvals: [1, 4, 10, 20], // Set specific ticks
      ticktext: ["1", "4", "10", "20"], // Corresponding labels
      tickangle: 0, // If you'd like to adjust label angle
      //ticks: "outside", // Optional: you can set it as "inside" for a different look
      scaleanchor: "x",
    },

    margin: {
      t: 10,  // Top margin - reduce it to give more space
      b: 40,  // Bottom margin
      l: 40,  // Left margin
      r: 10,  // Right margin
    },

    shapes: [
      {
        // Lava Worlds
        type: "rect",
        x0: 0.2, x1: 4,
        y0: 0.5, y1: 2.5,
        fillcolor: "#A42222",
        opacity: 0.45,
        line: { width: 0, color: "white", },
        layer: "below",
      },
      {
        // Rocky Planets
        type: "rect",
        x0: 4, x1: 140,
        y0: 0.35, y1: 3.5,
        fillcolor: "#AE6500",
        opacity: 0.5,
        line: { width: 0 },
        layer: "below",
      },
      {
        // Ocean Worlds & Ice Giants
        type: "rect",
        x0: 2, x1: 300,
        y0: 3.5, y1: 10,
        fillcolor: "#005AAE",
        opacity: 0.45,
        line: { width: 0 },
        layer: "below",
      },
      {
        // Hot Jupiters
        type: "rect",
        x0: 0.5, x1: 10,
        y0: 10, y1: 25,
        fillcolor: "#8A5555",
        opacity: 0.48,
        line: { width: 0 },
        layer: "below",
      },
      {
        // Cold Gas Giants
        type: "rect",
        x0: 140, x1: 1000,
        y0: 10, y1: 25,
        fillcolor: "#001670",
        opacity: 0.6,
        line: { width: 0 },
        layer: "below",
      },
      {
        // Earth-Like Planets
        type: "rect",
        x0: 140, x1: 700,
        y0: 0.8, y1: 1.8,
        fillcolor: "#22A45C",
        opacity: 0.6,
        line: { width: 0 },
        layer: "below",
      },
    ],
    
    annotations: [
      { x: 0.2, y: 0.38, text: "Lava Worlds", showarrow: false, 
        font: { family: "Jura", color: "white", size: 14 }, xref: "x", yref: "y", 
        xanchor: "right", yanchor: "top"},

      { x: 1.65, y: 0.52, text: "Rocky Planets", showarrow: false, 
        font: { family: "Jura", color: "white", size: 14 }, xref: "x", yref: "y", 
      xanchor: "right", yanchor: "top"},

      { x: 1.8, y: 0.98, text: "Ocean Worlds & Ice Giants", showarrow: false, 
        font: { family: "Jura", color: "white", size: 14 }, xref: "x", yref: "y", 
      xanchor: "right", yanchor: "top"},

      { x: 0.55, y: 1.39, text: "Hot Jupiters", showarrow: false, 
        font: { family: "Jura", color: "white", size: 14 }, xref: "x", yref: "y", 
      xanchor: "right", yanchor: "top"},

      { x: 2.8, y: 1.38, text: "Cold Gas Giants", showarrow: false, 
        font: { family: "Jura", color: "white", size: 14 }, xref: "x", yref: "y", 
      xanchor: "right", yanchor: "top"},

      { x: 2.75, y: 0.25, text: "Earth-Like Planets", showarrow: false, 
        font: { family: "Jura", color: "white", size: 14 }, xref: "x", yref: "y", 
      xanchor: "right", yanchor: "top"},
    ],
  };

  const config = {
    displayModeBar: false,
    scrollZoom: true,
    responsive: true,
  };

  return (
      <div style={{ width: "100%", height: "100%" }}> 
        <Plot 
          data={data}
          layout={layout}
          config={config}
          style={{ width: "100%", height: "100%" }}
          useResizeHandler
        />
      </div>
  );
};

export default StarMap;

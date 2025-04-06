import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

//import { useRouter } from "next/navigation";
//import apiService from "../services/apiService"; // Adjust the import based on your structure
import { useApi } from "@/hooks/useApi";


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

  useEffect(() => {
    const fetchExoplanets = async () => {
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
  }, []);

  if (loading) {
    return <div style={{ color: "white" }}>Loading...</div>;
  }

// create a manual point to test: 
  const manualPoint = {
    orbitalPeriod: 3.23469439654,
    radius: 13.31600225,
  };
  
  // Combine fetched exoplanets with the test point
  const combinedPlanets = [...exoplanets, manualPoint];

  const data = [
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

  const layout = {
    paper_bgcolor: "black",
    plot_bgcolor: "black",
    xaxis: {
      title: { 
        text: "Orbital Period (Days)",
          font: {
            family: "Jura",  // You can change the font family if needed
            size: 12,
            color: "white"
          },
        },
      type: "log",
      color: "white",
      range: [Math.log10(0.2), Math.log10(1000)], // 0.2 to 1000 days
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
            size: 12,
            color: "white"
          },},
      type: "log",
      color: "white",
      range: [Math.log10(0.3), Math.log10(25)], // 0.3 to 25 Earth radii
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
      t: 0,  // Top margin - reduce it to give more space
      b: 30,  // Bottom margin
      l: 30,  // Left margin
      r: 0,  // Right margin
    },

    shapes: [
      {
        // Lava Worlds
        type: "rect",
        x0: 0.2, x1: 4,
        y0: 0.5, y1: 2.5,
        fillcolor: "#4D0E13",
        opacity: 1,
        line: { width: 0, color: "white", shape: "round"},
        layer: "below",
      },
      {
        // Rocky Planets
        type: "rect",
        x0: 4, x1: 140,
        y0: 0.35, y1: 3.5,
        fillcolor: "#704214",
        opacity: 1,
        line: { width: 0 },
        layer: "below",
      },
      {
        // Ocean Worlds & Ice Giants
        type: "rect",
        x0: 2, x1: 300,
        y0: 3.5, y1: 10,
        fillcolor: "#0A2942",
        opacity: 1,
        line: { width: 0 },
        layer: "below",
      },
      {
        // Hot Jupiters
        type: "rect",
        x0: 0.5, x1: 10,
        y0: 10, y1: 25,
        fillcolor: "#422626",
        opacity: 1,
        line: { width: 0 },
        layer: "below",
      },
      {
        // Cold Gas Giants
        type: "rect",
        x0: 140, x1: 1000,
        y0: 10, y1: 25,
        fillcolor: "#001133",
        opacity: 1,
        line: { width: 0 },
        layer: "below",
      },
      {
        // Earth-Like Planets
        type: "rect",
        x0: 140, x1: 700,
        y0: 0.8, y1: 1.8,
        fillcolor: "#0B4F2D",
        opacity: 1,
        line: { width: 0 },
        layer: "below",
      },
    ],
    
    annotations: [
      { x: 0.2, y: 0.4, text: "Lava Worlds", showarrow: false, 
        font: { family: "Jura", color: "white", size: 14 }, xref: "x", yref: "y", 
        xanchor: "right", yanchor: "top"},

      { x: 1.65, y: 0.55, text: "Rocky Planets", showarrow: false, 
        font: { family: "Jura", color: "white", size: 14 }, xref: "x", yref: "y", 
      xanchor: "right", yanchor: "top"},

      { x: 1.8, y: 0.98, text: "Ocean Worlds & Ice Giants", showarrow: false, 
        font: { family: "Jura", color: "white", size: 14 }, xref: "x", yref: "y", 
      xanchor: "right", yanchor: "top"},

      { x: 0.55, y: 1.4, text: "Hot Jupiters", showarrow: false, 
        font: { family: "Jura", color: "white", size: 14 }, xref: "x", yref: "y", 
      xanchor: "right", yanchor: "top"},

      { x: 2.9, y: 1.4, text: "Cold Gas Giants", showarrow: false, 
        font: { family: "Jura", color: "white", size: 14 }, xref: "x", yref: "y", 
      xanchor: "right", yanchor: "top"},

      { x: 2.84, y: 0.25, text: "Earth-Like Planets", showarrow: false, 
        font: { family: "Jura", color: "white", size: 14 }, xref: "x", yref: "y", 
      xanchor: "right", yanchor: "top"},
    ],
  };

  const config = {
    displayModeBar: false,
    scrollZoom: true,
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

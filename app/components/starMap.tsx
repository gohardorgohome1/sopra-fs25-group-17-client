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
      title: "Orbital Period (Days)",
      type: "log",
      color: "white",
      range: [Math.log10(0.2), Math.log10(1000)], // 0.2 to 1000 days
      showgrid: false,
      zeroline: false,
      tickmode: "array", // Manually set tick positions
      tickvals: [0.2, 1, 10, 100, 1000], // Set specific ticks
      ticktext: ["0.2", "1", "10", "100", "1000"], // Corresponding labels
      tickangle: 0, // If you'd like to adjust label angle
      //ticks: "outside", // Optional: you can set it as "inside" for a different look
    },
    yaxis: {
      title: "Radius (Earth Units)",
      type: "log",
      color: "white",
      range: [Math.log10(0.3), Math.log10(25)], // 0.3 to 25 Earth radii
      showgrid: false,
      zeroline: false,
      tickmode: "array", // Manually set tick positions
      tickvals: [0.3, 1, 3, 10, 25], // Set specific ticks
      ticktext: ["0.3", "1", "3", "10", "25"], // Corresponding labels
      tickangle: 0, // If you'd like to adjust label angle
      //ticks: "outside", // Optional: you can set it as "inside" for a different look
    },
    shapes: [
      {
        // Lava Worlds
        type: "rect",
        x0: 0.2, x1: 4,
        y0: 0.5, y1: 3,
        fillcolor: "#4D0E13",
        opacity: 1,
        line: { width: 0 },
        layer: "below",
      },
      {
        // Rocky Planets
        type: "rect",
        x0: 2, x1: 50,
        y0: 0.8, y1: 3.5,
        fillcolor: "#704214",
        opacity: 1,
        line: { width: 0 },
        layer: "below",
      },
      {
        // Ocean Worlds & Ice Giants
        type: "rect",
        x0: 2, x1: 300,
        y0: 3.5, y1: 8,
        fillcolor: "#0A2942",
        opacity: 1,
        line: { width: 0 },
        layer: "below",
      },
      {
        // Hot Jupiters
        type: "rect",
        x0: 0.5, x1: 10,
        y0: 10, y1: 20,
        fillcolor: "#422626",
        opacity: 1,
        line: { width: 0 },
        layer: "below",
      },
      {
        // Cold Gas Giants
        type: "rect",
        x0: 100, x1: 1000,
        y0: 10, y1: 20,
        fillcolor: "#001133",
        opacity: 1,
        line: { width: 0 },
        layer: "below",
      },
      {
        // Earth-Like Planets
        type: "rect",
        x0: 100, x1: 300,
        y0: 0.8, y1: 1.5,
        fillcolor: "#0B4F2D",
        opacity: 1,
        line: { width: 0 },
        layer: "below",
      },
    ],
    annotations: [
      { x: 0.001, y: 0.1, text: "Lava Worlds", showarrow: false, font: { color: "white", size: 14 } , xref: "x", yref: "y",},
      { x: 10, y: 2.5, text: "Rocky Planets", showarrow: false, font: { color: "white" } },
      { x: 30, y: 5.5, text: "Ocean Worlds & Ice Giants", showarrow: false, font: { color: "white" } },
      { x: 3, y: 15, text: "Hot Jupiters", showarrow: false, font: { color: "white" } },
      { x: 400, y: 15, text: "Cold Gas Giants", showarrow: false, font: { color: "white" } },
      { x: 180, y: 1.1, text: "Earth-Like Planets", showarrow: false, font: { color: "white" } },
    ],
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Plot data={data} layout={layout} config={{ responsive: true }} />
    </div>
  );
};

export default StarMap;

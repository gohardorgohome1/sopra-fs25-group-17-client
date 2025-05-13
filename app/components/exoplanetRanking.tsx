// ExoplanetRanking.tsx
import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import dynamic from "next/dynamic";

// Dynamically import Plotly.js component with no SSR
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
import type { Layout } from "plotly.js";

interface Exoplanet {
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
  const [exoplanets, setExoplanets] = useState<Exoplanet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterKey, setFilterKey] = useState<keyof Exoplanet>("earthSimilarityIndex");


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
        weight: 700,
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
      },

      width: 450, 
      height: 500,
      paper_bgcolor: "black",
      plot_bgcolor: "black",
      font: {
        family: "Jura, monospace",
        color: "#EDEDED",
        weight: 700,
        size: 20,
      },
      bargap: 0.35,
      margin: {
        t: 10,  
        b: 50,
        l: 40,  
        r: 10,
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
"use client";
// ExoplanetRanking.tsx
import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Dynamically import Plotly.js component with no SSR
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
import type { Layout } from "plotly.js";

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

    // Wait for the component to fully load and router to be ready
  useEffect(() => {
    if (!loading && exoplanets.length > 0) {
      setPlotReady(true); // Ensure Plot is rendered only when exoplanets are ready
    }
  }, [loading, exoplanets]);
  

  if (loading) {
    return <div style={{ color: "white" }}>Loading...</div>;
  }

  const uniqueExoplanets = Array.from(
    new Map(exoplanets.map(planet => [planet.planetName, planet])).values()
  );
  const sortedExoplanets = [...uniqueExoplanets].sort((a, b) => b.earthSimilarityIndex - a.earthSimilarityIndex).slice(0, 10);

  const totalTextWidth = 50;

  const text = sortedExoplanets.map((exoplanet) => {
    const planetName = exoplanet.planetName;
    const percentage = (exoplanet.earthSimilarityIndex * 100).toFixed(0) + "%";
  
    const paddingLength = Math.max(1, totalTextWidth - planetName.length - percentage.length);
    const spacer = " ".repeat(paddingLength);
  
    return ` ${planetName}${spacer}${percentage}`;
  });

  const data: Partial<Plotly.Data>[]  = [{
    type: 'bar',
    orientation: 'h',
    x: Array(sortedExoplanets.length).fill(0.08),
    y: sortedExoplanets.map((exoplanet, index) => index + 1),
    text: text,
    //text: sortedExoplanets.map((exoplanet, index) => `${exoplanet.planetName} ${(exoplanet.earthSimilarityIndex * 100).toFixed(0)}%`),

    textposition: "inside",
    insidetextanchor: "start",
  
    marker: {
      color: '#0F1D56',
    }
  }];

  const layout: Partial<Layout> = {
      yaxis: {
      autorange: "reversed",
      tickvals: sortedExoplanets.map((_, index) => index + 1),
      ticktext: sortedExoplanets.map((_, index) => `${index + 1}. `),
      tickfont: {
        family: "Jura",
        color: "#FFFFFF",
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
        family: "Jura",
        color: "#FFFFFF",
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

  return (
    <div style={{ width: "100%", height: "100%" }}>
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
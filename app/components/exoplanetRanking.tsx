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
}

// Define ExoplanetRanking as a React Functional Component
const ExoplanetRanking: React.FC = () => {
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

  const sortedExoplanets = exoplanets.sort((a, b) => b.earthSimilarityIndex - a.earthSimilarityIndex).slice(0, 10);

  const data = [{
    type: 'bar',
    x: 100,
    y: sortedExoplanets.map(exoplanet => exoplanet.earthSimilarityIndex),
    orientation: 'h', // Horizontal bar chart
    text: [sortedExoplanets.map(exoplanet => exoplanet.planetName),
    sortedExoplanets.map(exoplanet => exoplanet.earthSimilarityIndex)],
    fontFamily: "Jura",
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: "32vw",
    lineHeight: "1.0",
    letterSpacing: "0",
    textAlign: "center",
    marker: {
      color: '#0F1D56',
    }
  }];

  const layout: Partial<Layout> = {
      autosize: true,
      width: 500, 
      height: 700,
      paper_bgcolor: "black",
      plot_bgcolor: "black",
      bargap: 0.01
      };

  return (
    <div style={{ width: "100%", height: "100%" }}> 
            <Plot 
                data={data}
                layout={layout}
                
                useResizeHandler
            />
        </div>
  );
};

export default ExoplanetRanking;
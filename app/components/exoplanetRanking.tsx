// ExoplanetRanking.tsx
import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";

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

  const sortedExoplanets = exoplanets.sort((a, b) => b.earthSimilarityIndex - a.earthSimilarityIndex);
  const topTenExoplanets = sortedExoplanets.slice(0, 10);

  function displayExoplanets(exoplanets: Exoplanet[]) {
    const chartContainer = document.getElementById("exoplanet-chart");
    if (chartContainer) {
    chartContainer.innerHTML = ""; // Vorherigen Inhalt löschen
    topTenExoplanets.forEach(exoplanet => {
    const row = document.createElement("div");
    row.className = "exoplanet-row";
    row.innerHTML = `<strong>${exoplanet.planetName}</strong>: ${exoplanet.earthSimilarityIndex}`;
    chartContainer.appendChild(row);
    });
    }
    }
    

  return (
    <div id = "exoplanet-chart">

    </div>
  );
};

export default ExoplanetRanking;
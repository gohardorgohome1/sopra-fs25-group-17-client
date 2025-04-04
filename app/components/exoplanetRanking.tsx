// ExoplanetRanking.tsx
import React from "react";

// Example of an Exoplanet Ranking List
const exoplanetData = [
  { rank: 1, name: "Exoplanet A", similarity: "0.95" },
  { rank: 2, name: "Exoplanet B", similarity: "0.92" },
  { rank: 3, name: "Exoplanet C", similarity: "0.90" },
  { rank: 4, name: "Exoplanet D", similarity: "0.88" },
  { rank: 5, name: "Exoplanet E", similarity: "0.85" },
];

const ExoplanetRanking = () => {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h3>Exoplanet Ranking</h3>
      <ul>
        {exoplanetData.map((planet) => (
          <li key={planet.rank}>
            <strong>Rank {planet.rank}:</strong> {planet.name} - Similarity: {planet.similarity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExoplanetRanking;

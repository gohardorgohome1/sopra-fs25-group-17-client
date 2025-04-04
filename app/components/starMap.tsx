// StarMap.tsx
import React from "react";
import Plot from "react-plotly.js"; // Import Plotly

const StarMap = () => {
  const data = [
    {
      type: "scattergeo",
      locationmode: "ISO-3",
      locations: ["USA", "CAN", "GBR", "AUS", "IND"], // Example data for locations
      color: [1, 2, 3, 4, 5],
      colorscale: "Viridis",
      size: [10, 20, 30, 40, 50],
    },
  ];

  const layout = {
    geo: {
      projection: {
        type: "natural earth",
      },
    },
    title: "Star Map Example",
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Plot data={data} layout={layout} />
    </div>
  );
};

export default StarMap;

import React, { useState } from "react";
import { createPortal } from "react-dom";

interface InfoTooltipProps {
  content: React.ReactNode;
  tooltipStyle?: React.CSSProperties;
  hoverAreaStyle?: React.CSSProperties;
  position?: "center" | "top-left" | "bottom-right";
  children: React.ReactNode;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  tooltipStyle = {},
  hoverAreaStyle = {},
  position = "center",
  children,
}) => {
  const [hover, setHover] = useState(false);

  const getPositionStyle = (): React.CSSProperties => {
    if (position === "center") {
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }
    return {};
  };

  const tooltip = hover ? (
    <div
      style={{
        ...getPositionStyle(),
        backgroundColor: "#1a1a1a",
        color: "#FFD9D9",
        padding: "40px 60px",
        borderRadius: "16px",
        fontSize: "20px",
        fontFamily: "Jura, sans-serif",
        boxShadow: "0 0 20px rgba(173, 216, 230, 0.15)",
        border: "1px solid rgba(255, 255, 255, 0.08)",        
        zIndex: 9999,
        width: "80vw",
        maxWidth: "1000px",
        pointerEvents: "none",
        textAlign: "left",
        lineHeight: "1.7",
        ...tooltipStyle,
      }}
    >
      {content}
    </div>
  ) : null;

  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: "inline-block", ...hoverAreaStyle }}
    >
      {children}
      {typeof window !== "undefined" && createPortal(tooltip, document.body)}
    </span>
  );
};

export default InfoTooltip;

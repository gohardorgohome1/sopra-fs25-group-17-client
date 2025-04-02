"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering
import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, Form, Input, Card } from "antd";

export default function Home() {
  const router = useRouter();

  return (
    <div
        className="exoplanet-background"
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
    >

      <Card // Card for upload
        className="exoplanet-container"
        style={{
          width: "95vw", // size
          height: "95vh",

          background: "black", // visuals
          border: "none",
          borderRadius: 98,
          backgroundColor: "rgba(0, 0, 0, 0.66)", // instead of opacity = 0.66 -> buttons etc. would inherit opacity

          zIndex: 1 // foreground
        }}
      >
        <div // Title: Exoplanet Transit Analysis
          style={{
            width: "50vw",
            height: "12vh",
            textAlign: 'center',
            color: '#FFD9D9',
            fontSize: 72,
            fontFamily: 'Koulen',
            fontWeight: '400',

            background: "linear-gradient(90deg, #FFD9D9, #73CBC9)", // color gradient
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            }}
          >
            Exoplanet Transit Analysis
          </div>
      </Card>

    </div>
  );
}

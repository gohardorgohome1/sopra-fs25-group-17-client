"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering
import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, Form, Input, Card } from "antd";
import { Span } from "next/dist/trace";

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
        className="uploadOuter-container"
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
          
          <div // This div makes sure the second card can be centered while the title is still at the top left
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "6vh"
            }}
          >
            <Card
              className="uploadInner-container"
              style={{
                width: "500px", // size
                height: "360px",

                background: "black", // visuals
                border: "none",
                borderRadius: 26,
                backgroundColor: "rgba(0, 0, 0, 0.66)", // instead of opacity = 0.66 -> buttons etc. would inherit opacity

                zIndex: 1 // foreground
              }}
            >
            </Card>
          </div>
          
          <Button // Button: Back to dashboard
            onClick={() => router.push("/dashboard")}
            type="primary"
            htmlType="button"
            style={{
              width: "160px", // button size & style
              height: "35px",
              background: "black",
              borderRadius: 46,
              //backdropFilter: "blur(10px)", // according to figma, we need this -> I don't think it is visible
              
              marginTop: "120px", // button position
              marginLeft: "60px",

              textAlign: "center", // Text size & style
              color: "#8A5555",
              fontSize: "20px",
              fontFamily: "Karantina", // imported fontFamily -> see top of globals.css
              fontWeight: "700",

              boxShadow: '0px 0px 40px 12px rgba(255, 0, 0, 0.25)', // red glow around button
            }}
            >
            <span
              style={{
                background: "linear-gradient(90deg, #8A5555, #FFFFFF)", // color gradient
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",

                WebkitTextStrokeWidth: "1px",   // Add black edge to text
                WebkitTextStrokeColor: "#000000",
              }}
            >
              Back to Dashboard
            </span>
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            type="primary"
            htmlType="button"
            style={{
              width: "160px", // button size & style
              height: "35px",
              background: "black",
              borderRadius: 46,
              //backdropFilter: "blur(10px)", // according to figma, we need this -> I don't think it is visible
              
              marginTop: "120px", // button position
              marginLeft: "60px",

              textAlign: "center", // Text size & style
              color: "#8A5555",
              fontSize: "20px",
              fontFamily: "Karantina", // imported fontFamily -> see top of globals.css
              fontWeight: "700",

              boxShadow: '0px 0px 40px 12px rgba(255, 0, 0, 0.25)', // red glow around button
            }}
            >
            <span
              style={{
                background: "linear-gradient(90deg, #8A5555, #FFFFFF)", // color gradient
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",

                WebkitTextStrokeWidth: "1px",   // Add black edge to text
                WebkitTextStrokeColor: "#000000",
              }}
            >
              Back to Dashboard
            </span>
          </Button>
      </Card>

    </div>
  );
}

"use client"; // Foor components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering
import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation";
import { Button } from "antd";
// import { BookOutlined, CodeOutlined, GlobalOutlined } from "@ant-design/icons";
// import styles from "@/styles/page.module.css";


export default function Home() {
  const router = useRouter();
  
  return (

    <div
        className="common-background"
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column", // Makes sure the title image (Exoplanet Hunting Platform) stays above the text
          justifyContent: "center",
          alignItems: "center",
        }}
      >

        <img // Title image: "Exoplanet Hunting Platform"
          style={{
            width: "80vw",
            height: "14vh",
            marginTop: "200px" // determines distance to the top of the window
            }}
          src="/title.png" // image under /public/title.png
        />

      <div
          style={{
            position: "relative", // position & size
            width: "800px",
            height: "168px",
            marginTop: "-10px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
        <h1 // Motivational text
          style={{
            position: "relative",
            fontSize: "32px",
            fontFamily: "Jura", // imported fontFamily -> see top of globals.css              fontWeight: "700",
            wordWrap: "break-word",

            background: "linear-gradient(90deg, #000000, #B60000)", // color gradient
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",

            zIndex: 1, // foreground
          }}
        >
          Take exoplanet collaborative research to the next level!
        </h1>
        <h1 // Shadow Exoplanet Hunting Platform
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            fontFamily: "Jura",
            fontSize: "32px",
            fontWeight: "700",
            wordWrap: "break-word",
            color: "transparent", // transparent text
            textShadow: "0px 4px 10.8px rgba(255, 255, 255, 1)", // White shadow behind text
                  // adjust this ^ to change strength of shadow
            zIndex: 0,
          }}
        >
          Take exoplanet collaborative research to the next level!
        </h1>
      </div>

      <div
        style={{
          position: "absolute", // position & size
          bottom: "40px",
          right: "40px",

          display: "flex", // These two lines ensure the buttons are stacked on top of each other
          flexDirection: "column",
        }}
      >
        <Button // Register button
          onClick={() => router.push("/register")}
          type="primary"
          htmlType="button"
          style={{
            width: "100px", // button size & style
            height: "35px",
            background: "black",
            borderRadius: 46,

            marginBottom: "10px", // Creates some distance between the two buttons

            textAlign: "center", // Text size & style
            color: "#8A5555",
            fontSize: "20px",
            fontFamily: "Karantina", // imported fontFamily -> see top of globals.css
            fontWeight: "700",

            boxShadow: "none", // removes default green shadow of button
          }}
        >
        <span
          style={{
            background: "linear-gradient(90deg, #8A5555, #830101)", // color gradient
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Register
        </span>
        </Button>

        <Button // Login button
          onClick={() => router.push("/login")}
          type="primary"
          htmlType="button"
          style={{
            width: "100px", // button size & style
            height: "35px",
            background: "black",
            borderRadius: 46,

            textAlign: "center", // Text size & style
            color: "#8A5555",
            fontSize: "20px",
            fontFamily: "Karantina", // imported fontFamily -> see top of globals.css
            fontWeight: "700",

            boxShadow: "none", // removes default green shadow of button
          }}
        >
        <span
          style={{
            background: "linear-gradient(90deg, #8A5555, #830101)", // color gradient
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Log in
        </span>
        </Button>
      </div>
    </div>
  );
}

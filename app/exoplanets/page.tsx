"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import React, { useEffect} from "react";
import { useRouter } from "next/navigation";
import { Button} from "antd";

const ExoplanetNonExistant: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
    return;
  }, []);

    return (
      <div className={"exoplanet-nonExistant"}>
        <Button
          onClick={() => router.push("/dashboard")}
          type="primary"
          htmlType="button"
          style={{
            width: "100vw",
            height: "100vh",
            background: "black",
          }}
        >
          Please wait to be redirected to the dashboard.
          If you are not automatically redirected, please click here
        </Button>
      </div>
    );
  };

export default ExoplanetNonExistant;
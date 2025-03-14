"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering
import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "antd";
import { BookOutlined, CodeOutlined, GlobalOutlined } from "@ant-design/icons";
import styles from "@/styles/page.module.css";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  return (
    

    <div className={styles.page}>
      <main className={styles.main}>

        <h1>Group 17 - Exoplanet Hunting</h1>
        <p>Group Leader: Jesse Koller</p>
        <h4>Group Members:</h4>
        <ul>
          <li>Lucía Cortés, lucia.cortespaes@uzh.ch, 24-744-112, @luciacortes063</li>
          <li>Alex Capilla, alex.capillamiralles@uzh.ch, 24-754-970, @AlexCapillaUZH</li>
          <li>Pascal Senn,pascal.senn2@uzh.ch, 23-938-723, @PascalSenn2</li>
          <li>Ayleen Rüegg, ayleenmona.rueegg@uzh.ch, 23-725-179, @ayleenmr</li>
          <li>Jesse Koller, jesse.koller@uzh.ch, 21-928-379, @gohardorgohome1</li>
        </ul>
        <p>
          Check out our project on <a href="https://github.com/gohardorgohome1/sopra-fs25-group-17-server" target="_blank" rel="noopener noreferrer">GitHub</a>.
        </p>

        <div className={styles.ctas}>
          <Button
            type="primary"
            variant="solid"
            onClick={() => router.push("/login")}
          >
            Go to login
          </Button>
          <Button
            type="primary"
            variant="solid"
            onClick={() => router.push("/register")}
          >
            Register
          </Button>
        </div>
      </main>
    </div>
  );
}

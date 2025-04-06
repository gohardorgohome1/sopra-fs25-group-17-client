"use client"; 

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
//import { Typography } from "antd";
//import dynamic from "next/dynamic";


//const { Title, Text } = Typography;

//const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface Exoplanet {
  id: string;
  planetName: string;
  ownerId: string;

  hostStarName: string;
  fractionalDepth: number;
  density: number;
  orbitalPeriod: number;
  radius: number;
  surfaceGravity: number;
  theoreticalTemperature: number;
  mass: number;
  escapeVelocity: number;
  ESI: number;

  photometricCurveId:string;
}

interface DataPoint {
  time: number;
  brightness: number;
  brightnessError?: number;
}

interface PhotometricCurve {
  id: string;
  fileName: string;
  exoplanetId: string;
  dataPoints: DataPoint[];
  metadata?: Record<string, string>;
}

const ExoplanetProfile: React.FC = () => {
  const router = useRouter();
  const { id } = useParams(); // Get user ID from the URL
  const apiService = useApi();
  const [exoplanet, setExoplanet] = useState<Exoplanet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lightCurveData, setLightCurveData] = useState<DataPoint[]>([]);


  const {
    // value: token, // is commented out because we dont need to know the token value for logout
    // set: setToken, // is commented out because we dont need to set or update the token value
    //clear: clearToken, // all we need in this scenario is a method to clear the token
  } = useLocalStorage<string>("token", ""); // if you wanted to select a different token, i.e "lobby", useLocalStorage<string>("lobby", "");

  
  useEffect(() => {
    if (!id) return;

    const fetchExoplanet = async () => {
      try {
        // Fetch exoplanet data
        const data: Exoplanet = await apiService.get(`/exoplanets/${id}`);
        setExoplanet(data);

        // Fetch photometric/light curve data
        const curve = await apiService.get(`/photometricCurves/${data.photometricCurveId}`);
        const typedCurve = curve as PhotometricCurve;
        setLightCurveData(typedCurve.dataPoints); // Assume format: [{ time, brightness, brightnesserror }]
      } catch (error) {
        console.error("Failed to fetch exoplanet data:", error);
        router.push("/exoplanets");
      } finally {
        setLoading(false);
      }
    };

    fetchExoplanet();
  }, [id, apiService]);
  if (loading) return <div>Loading...</div>;
  if (!exoplanet) return <div>Exoplanet not found.</div>;
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: 'white', overflow: 'hidden' }}>
      {<div style={{ 
        transform: 'scale(0.67)', 
        transformOrigin: 'top center', 
        width: '100%', 
        height: '100%', 
        overflow: 'auto' 
      }}>

        <div style={{width: '100%', height: '100%', position: 'relative', opacity: 0.87, background: 'white', overflow: 'hidden'}}>
      <div className="exoplanet-background" style={{ position: 'relative', overflow: 'hidden' }}></div>
    <div style={{width: 667, height: 113, left: 427, top: 984, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 20, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>100</div>
    <div style={{width: 1629, height: 1042, left: 49, top: 55, position: 'absolute', opacity: 0.66, background: 'black', boxShadow: '0px 0px 0px ', borderRadius: 98, filter: 'blur(0px)'}} />
    <div style={{width: 1524, height: 436, left: 136, top: 635, position: 'absolute', opacity: 0.66, background: 'black', boxShadow: '0px 0px 0px ', borderRadius: 26, filter: 'blur(0px)'}} />
    <div style={{width: 1495, height: 420, left: 136, top: 181, position: 'absolute', opacity: 0.66, background: 'black', boxShadow: '0px 0px 0px ', borderRadius: 14, filter: 'blur(0px)'}} />
    <div style={{width: 667, height: 113, left: 1178, top: 137, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>Host Star</div>
    <div style={{width: 667, height: 113, left: 1231, top: 567, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 16, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>User</div>
    <div style={{width: 667, height: 102, left: 1215, top: 544, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 16, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>Analyzed by:</div>
    <div style={{width: 667, height: 101, left: -105, top: 567, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 16, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>CSIC-IAC</div>
    <div style={{width: 667, height: 91, left: -98, top: 544, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 16, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>Research Group:</div>
    <div style={{width: 667, height: 113, left: -15, top: 713, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>Fractional Depth:</div>
    <div style={{width: 667, height: 113, left: 190, top: 713, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>{(exoplanet.fractionalDepth* 100).toFixed(2)}%</div>
    <div style={{width: 667, height: 113, left: 31, top: 833, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>{(exoplanet.radius).toFixed(2)} R⊕</div>
    <div style={{width: 667, height: 113, left: 6, top: 962, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>{(exoplanet.mass).toFixed(2)} M⊕</div>
    <div style={{width: 667, height: 113, left: 652, top: 839, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>{(exoplanet.surfaceGravity).toFixed(2)}m/s2</div>
    <div style={{width: 667, height: 113, left: 652, top: 967, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>{(exoplanet.escapeVelocity)} × vₑ⊕</div>
    <div style={{width: 667, height: 113, left: 1099, top: 715, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>{exoplanet.orbitalPeriod.toFixed(2)} days</div>
    <div style={{width: 667, height: 113, left: 546, top: 711, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>{exoplanet.density.toFixed(2)}× ρₑ </div>
    <div style={{width: 667, height: 113, left: 1250, top: 836, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>{exoplanet.theoreticalTemperature.toFixed(1)} K</div>
    <div style={{width: 667, height: 113, left: 1173, top: 967, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>{(exoplanet.ESI*100).toFixed(2)}%</div>
    <div style={{width: 667, height: 113, left: 372, top: 711, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>Density:</div>
    <div style={{width: 667, height: 113, left: 879, top: 715, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>Oribital Period:</div>
    <div style={{width: 667, height: 113, left: 968, top: 836, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>Theoretical Temperature:</div>
    <div style={{width: 667, height: 113, left: 947, top: 967, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>Earth Index Similarity:</div>
    <div style={{width: 667, height: 113, left: 432, top: 838, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>Surface Gravity:</div>
    <div style={{width: 667, height: 113, left: 432, top: 967, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>Escape velocity:</div>
    <div style={{width: 667, height: 113, left: -98, top: 833, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>Radius:</div>
    <div style={{width: 667, height: 113, left: -112, top: 963, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>Mass:</div>
    <div style={{width: 1001, height: 112, left: -124, top: 35, position: 'absolute', textAlign: 'center', color: '#FFD9D9', fontSize: 96, fontFamily: 'Koulen', fontWeight: '400', wordWrap: 'break-word'}}>{exoplanet.planetName}</div>
    <div style={{width: 1001, height: 78, left: 994, top: 59, position: 'absolute', textAlign: 'center', color: '#FFD9D9', fontSize: 64, fontFamily: 'Koulen', fontWeight: '400', wordWrap: 'break-word'}}>{exoplanet.hostStarName}</div>
    <div style={{width: 236, height: 49, left: 22, top: 1039, position: 'absolute', background: '#650808', boxShadow: '69.30000305175781px 69.30000305175781px 69.30000305175781px ', filter: 'blur(34.65px)'}} />
    <div style={{width: 173, height: 55, left: 64, top: 1029, position: 'absolute', background: 'black', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 46}} />
    <div style={{width: 317, height: 49, left: -9, top: 1044, position: 'absolute', textAlign: 'center', color: '#8A5555', fontSize: 24, fontFamily: 'Karantina', fontWeight: '700', wordWrap: 'break-word'}}>Back to Dashboard</div>
    {lightCurveData.length > 0 && (
      <div>
        <p>Light curve has {lightCurveData.length} points.</p>
      </div>
    )}
    </div>
</div>}
    </div>
  );
};

export default ExoplanetProfile;



"use client"; 

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import dynamic from 'next/dynamic';
import { Button, Modal, ConfigProvider } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import katex from "katex";
import "katex/dist/katex.min.css";


import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false
});
//import { Typography } from "antd";
//import dynamic from "next/dynamic";


//const { Title, Text } = Typography;

//const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
interface Comment {
  userId: string;
  message: string;
  createdAt: string;
}

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
  earthSimilarityIndex: number;

  photometricCurveId:string;
  comments: Comment[];
}

interface DataPoint {
  time: number;
  brightness: number;
  brightnessError: number;
}

interface PhotometricCurve {
  id: string;
  fileName: string;
  exoplanetId: string;
  dataPoints: DataPoint[];
  metadata?: Record<string, string>;
}

interface User {
  id: string;
  username:string
}

interface InfoTooltipProps {
  content: React.ReactNode;
  tooltipStyle?: React.CSSProperties; 
}
  
const { useModal } = Modal;

function renderKaTeX(latex: string) {
  return {
    __html: katex.renderToString(latex, {
      throwOnError: false,
    }),
  };
}

const ExoplanetProfile: React.FC = () => {
  const router = useRouter();
  const { id } = useParams(); // Get user ID from the URL
  const apiService = useApi();
  const [exoplanet, setExoplanet] = useState<Exoplanet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lightCurveData, setLightCurveData] = useState<DataPoint[]>([]);
  const [modal, contextHolder] = useModal();
  const [curveOwner, setCurveOwner] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [commentUsernames, setCommentUsernames] = useState<Record<string, string>>({});
  const [reloadKey, setReloadKey] = useState(0);
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);

  const {
    // value: token, // is commented out because we dont need to know the token value for logout
    // set: setToken, // is commented out because we dont need to set or update the token value
    //clear: clearToken, // all we need in this scenario is a method to clear the token
  } = useLocalStorage<string>("token", ""); // if you wanted to select a different token, i.e "lobby", useLocalStorage<string>("lobby", "");

  const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, tooltipStyle }) => {
    const [hover, setHover] = useState(false);
  
    return (
      <span
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: "relative",
          display: "inline-block",
          marginLeft: "6px",
          transform: "translateY(-18px) translateX(-10px)",
        }}
      >
        <span
          style={{
            backgroundColor: "#FFD9D9",
            color: "#000",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            fontSize: "12px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
            cursor: "pointer",
          }}
        >
          i
        </span>
        {hover && (
          <div
            style={{
              position: "fixed",
              bottom: "125%",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#1a1a1a",
              color: "#FFD9D9",
              padding: "10px",
              borderRadius: "6px",
              fontSize: "20px",
              maxWidth: "1000px", // ← wider now
              width: "max-content", // allows expanding horizontally
              whiteSpace: "normal",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              zIndex: 999999,
              textAlign: "left",
              pointerEvents: "auto",
              ...tooltipStyle, 
            }}
          >
            {content}
          </div>
        )}
      </span>
    );
  };
  
  
  const handleDeletion = (exoplanetId: string, exoplanetName: string) => { // Deleting an Exoplanet (confirmation prompt first)

    modal.confirm({
      title: "Are you sure you want to delete this exoplanet?",
      icon: <ExclamationCircleOutlined />,
      content: (<span style={{ color: "#ff5555" }}>Deleting an exoplanet cannot be undone!</span>),
      okText: `Delete ${exoplanetName}`,
      okType: "danger",
      cancelText: "Cancel",

      okButtonProps: { // Delete {exoplanetName} button
        style: {
          backgroundColor: "#ff4d4f",
          borderColor: "#ff4d4f",
          color: "#fff",
          fontWeight: "bold",
        },
      },
      cancelButtonProps: { // Cancel button
        style: {
          backgroundColor: "#444",
          borderColor: "#444",
          color: "#fff",
        },
      },
      
      onOk: async () => {
        try{
          await apiService.delete(`/exoplanets/${exoplanetId}`); // delete exoplanet
          router.push("/dashboard"); // redirect after successfull deletion
        } catch (error) {
          if (error instanceof Error) {
            if (error.message.includes("Exoplanet not found")) {
              Modal.error({
                title: "Exoplanet not found",
                content: "The Exoplanet you are trying to delete does not exist in the database!",
              });
            } else {
              Modal.error({
                title: "Deletion failed",
                content: `Deleting this exoplanet failed: ${error.message}`,
              });
            }
          } else {
            Modal.error({
              title: "Deletion failed",
              content: "An unknown error occurred while trying to delete this exoplanet.",
            });
          }
        }
      },
    });
  };

  const isOwner = (exoplanetOwnerId: string) => { // Checking whether the current User is the Owner of this exoplanet
    const userId = localStorage.getItem("userId");
    return (userId == exoplanetOwnerId);
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
  
    try {
      setSubmitting(true);
      await apiService.post(`/exoplanets/${id}/comments`, {
        message: newComment,
        userId: currentUserId
      });
      
      setCommentUsernames(prev => ({
        ...prev,
        [currentUserId!]: currentUserName ?? "You"
      }));
      const updatedExoplanet: Exoplanet = await apiService.get(`/exoplanets/${id}`);
      setExoplanet(updatedExoplanet);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setSubmitting(false);
    }
  };
  
  useEffect(() => {
    if (!id) return;

    const fetchExoplanet = async () => {
      try {
        // Fetch exoplanet data
        const data: Exoplanet = await apiService.get(`/exoplanets/${id}`);
        console.log(data);
        setExoplanet(data);
        const uniqueUserIds = [...new Set(data.comments.map(c => c.userId))];
        const usernamesMap: Record<string, string> = {};

        await Promise.all(
          uniqueUserIds.map(async (uid) => {
            try {
              const user = await apiService.get<User>(`/users/${uid}`);
              console.log("User response for comment:", user);
              usernamesMap[uid] = user.username;
            } catch (err) {
              console.error(`Failed to fetch user ${uid}`, err);
              usernamesMap[uid] = "Unknown";
            }
          })
        );

        setCommentUsernames(usernamesMap);

        // Fetch photometric/light curve data
        const curve = await apiService.get(`/photometric-curves/${data.photometricCurveId}`);
        const typedCurve = curve as PhotometricCurve;
        console.log(curve);
        setLightCurveData(typedCurve.dataPoints); // Assume format: [{ time, brightness, brightnesserror }]
        
        try {
          const user: User = await apiService.get(`/users/${data.ownerId}`);
          const curveowner = user?.username ?? "Unknown";
          setCurveOwner(curveowner);
        } catch (error) {
          console.error("Error fetching user:", error);
          setCurveOwner("Unknown");
        }
      } catch (error) {
        console.error("Failed to fetch exoplanet data:", error);
        router.push("/exoplanets");
      } finally {
        setLoading(false);
      }
    };

    const fetchCurrentUser = async () => {
      const storedId = localStorage.getItem("userId");
      if (storedId) {
        setCurrentUserId(storedId);
        try {
          const user: User = await apiService.get(`/users/${storedId}`);
          setCurrentUserName(user.username);
        } catch (error) {
          console.error("Failed to fetch current user", error);
        }
      }
    };

    fetchExoplanet();
    fetchCurrentUser();
   
  }, [id, apiService, reloadKey]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () =>
        new SockJS("https://sopra-fs25-group-17-server.oa.r.appspot.com/ws"),
      // REAL SERVER: "https://sopra-fs25-group-17-server.oa.r.appspot.com/ws"
      // LOCAL SERVER for testing: "http://localhost:8080/ws"
      connectHeaders: {},
      onConnect: () => {
        // Once connected, subscribe to the "/topic/exoplanets" topic
        client.subscribe(`/topic/comments/${id}`, () => {
        // change the variable that triggers reload:
        setReloadKey(prev => prev + 1);
        
        });
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
      },
    });
  
      client.activate();
  
      return () => {
        client.deactivate();
      };
    }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!exoplanet) return <div>Exoplanet not found.</div>;
  return (
    <ConfigProvider>
    <div style={{ width: '100%', height: '100%', position: 'relative', background: 'white', overflow: 'hidden' }}>
    <div className="exoplanet-background" style={{
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -10,
    }}>

{lightCurveData.length > 0 && (
            <div
            style={{
              position: 'absolute', // absolute positioning
              top: '100px',          // distance from the top
              left: '39%',          // center horizontally
              transform: 'translateX(-50%)', // perfect horizontal centering
              width: '80%',
              maxWidth: '600px',
              zIndex:1
            }}
          >
            <Plot
              data={[
                { x: lightCurveData.map(point => point.time),
                  y: lightCurveData.map(point => point.brightness),
                  error_y: {
                    type: 'data',
                    array: lightCurveData.map(point => point.brightnessError),
                    visible: true,
                    color: 'rgba(173, 216, 230, 0.5)', // lightblue with transparency
                    thickness: 0.5
                  },
                  type: 'scatter',
                  mode: 'lines+markers',
                  line: { shape: 'spline', smoothing: 1.3 }, // smooths the curve
                  marker: { color: '#00ffff', size: 4 }, // smaller, cleaner markers
                  name: 'Brightness'
                }
              ]}
              layout={{
                height: 310, 
                margin: {
                  l: 50, r: 20, t: 40, b: 50
                },
                title: `Light Curve of ${exoplanet.planetName}`,
                xaxis: {
                  title: {
                    text: 'Time',
                    font: {
                      size: 20,
                      color: 'white'
                    },
                    standoff: 10
                  },
                  showline: true,
                  linecolor: 'white',
                  linewidth: 4, // Thicker line
                  showgrid: false,
                  showticklabels: false, // Show labels
                  tickformat: '.5f',
                  ticks: '',
                  color: 'white'
                },
                yaxis: {
                  title: {
                    text: 'Brightness',
                    font: {
                      size: 20,
                      color: 'white'
                    },
                    standoff: 10
                  },
                  showline: true,
                  linecolor: 'white',
                  linewidth: 4, // Thicker line
                  showgrid: false,
                  showticklabels: false, 
                  ticks: '',
                  color: 'white'
                },
                paper_bgcolor: 'rgba(0, 0, 0, 0)',
                plot_bgcolor: 'rgba(0, 0, 0, 0)',
                font: {
                  color: 'white',
                  family: 'Jura, sans-serif'
                }
              }}
              
              config={{ responsive: true }}
            />
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100vh', backgroundColor: 'transparent' }}>

          {/* Left Section: Light Curve + Planet Info */}
          <div style={{ flex: '2', position: 'relative', padding: '20px' }}>
      {<div
        style={{
            transform: 'scale(0.67) translateX(40px)',
            transformOrigin: 'top left',          
            position: 'relative', // sets context for all your absolutely positioned elements
            top: '-30px',
            width: '1215px', // original full canvas width
            height: '800px', // original full canvas height
          }}
        >
    <div style={{width: 1629, height: 1042, left: 49, top: 55, position: 'absolute', opacity: 0.66, background: 'black', boxShadow: '0px 0px 0px ', borderRadius: 98, filter: 'blur(0px)'}} />
    <div style={{width: 1524, height: 436, left: 136, top: 635, position: 'absolute', opacity: 0.66, background: 'black', boxShadow: '0px 0px 0px ', borderRadius: 26, filter: 'blur(0px)'}} />
    <div style={{width: 1495, height: 420, left: 136, top: 181, position: 'absolute', opacity: 0.66, background: 'black', boxShadow: '0px 0px 0px ', borderRadius: 14, filter: 'blur(0px)'}} />
    <div style={{width: 667, height: 113, left: 1178, top: 137, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>Host Star</div>
    {/*<div style={{width: 667, height: 101, left: -105, top: 567, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 16, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>CSIC-IAC</div>
    <div style={{width: 667, height: 91, left: -98, top: 544, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 16, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>Research Group:</div>*/}
    <div style={{width: 667, height: 113, left: 190, top: 713, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>{(exoplanet.fractionalDepth* 100).toFixed(2)}%</div>
    <div style={{width: 667, height: 113, left: 372, top: 711, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>Density:</div>
    <div style={{width: 667, height: 113, left: -15, top: 713, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word', zIndex: 1}}>Fractional Depth:
    <InfoTooltip
      content={
        <div style={{ textAlign: "left" }}>
          <p style={{ marginBottom: "8px" }}>
            <strong>Fractional depth</strong> measures how much a star&apos;s brightness decreases when a planet transits in front of it.
          </p>

          <p style={{ marginBottom: "8px" }}>
            It estimates the area ratio between the planet and the star:
            a larger dip suggests a larger planet or a smaller star. This value is essential for calculating the other exoplanet&apos;s parameters.
          </p>

          <p style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span>Calculated as:</span>
            <span
              dangerouslySetInnerHTML={renderKaTeX(
                "\\text{Depth} = \\left(\\frac{R_p}{R_\\star}\\right)^2"
              )}
            />
          </p>
        </div>
      }
      tooltipStyle={{
        transform: "translateX(-50%) translateY(110%)",
        zIndex: 10
      }}
      
      
    />
    </div>
    <div style={{width: 667, height: 113, left: 65, top: 833, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>{(exoplanet.radius).toFixed(2)} R⊕</div>
    <div style={{width: 667, height: 113, left: 36, top: 962, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>{(exoplanet.mass).toFixed(2)} M⊕</div>
    <div style={{width: 667, height: 113, left: 652, top: 839, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>{(exoplanet.surfaceGravity).toFixed(2)} g</div>
    <div style={{width: 667, height: 113, left: 652, top: 967, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>{(exoplanet.escapeVelocity).toFixed(2)} × vₑ⊕</div>
    <div style={{width: 667, height: 113, left: 1099, top: 715, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>{exoplanet.orbitalPeriod.toFixed(2)} days</div>
    <div style={{width: 667, height: 113, left: 546, top: 711, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>{exoplanet.density.toFixed(2)}× ρₑ⊕ </div>
    <div style={{width: 667, height: 113, left: 1250, top: 836, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>{exoplanet.theoreticalTemperature.toFixed(1)} K</div>
    <div style={{width: 667, height: 113, left: 1193, top: 967, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>{(exoplanet.earthSimilarityIndex*100).toFixed(2)}%</div>
    <div style={{width: 667, height: 113, left: 879, top: 715, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>Oribital Period:
    <InfoTooltip
      content={
        <div style={{ textAlign: "left" }}>
          <p style={{ marginBottom: "8px" }}>
            <strong>Orbital period</strong> is the time a planet takes to complete one full orbit around its star.
            It is determined from the frequency of transits in the light curve.
          </p>
        </div>
      }
    />
    </div>
    <div style={{width: 667, height: 113, left: 968, top: 836, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>Theoretical Temperature:
    <InfoTooltip
      content={
        <div style={{textAlign: "left"}}>
          <p style={{ marginBottom: "8px" }}>
            <strong>Theoretical temperature</strong> is an estimate of the planet&apos;s surface temperature,
            assuming it behaves like a blackbody in thermal equilibrium with its star.
          </p>

          <p style={{ marginBottom: "8px" }}>
            <strong>Assumptions:</strong><br />
            • Planet behaves like a blackbody<br />
            • No atmosphere or greenhouse effect<br />
            • Uniform heat redistribution<br />
            • Star and orbital parameters known
          </p>

          <p style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span>Estimated with:</span>
            <span
              dangerouslySetInnerHTML={renderKaTeX(
                "T = T_\\star \\sqrt{\\frac{R_\\star}{2D}} (1 - A)^{1/4}"
              )}
            />
          </p>
        </div>
      }
      tooltipStyle={{}}
      
    />

    </div>
    <div style={{width: 667, height: 113, left: 947, top: 967, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>Earth Index Similarity:</div>
    <div style={{width: 667, height: 113, left: 432, top: 838, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>Surface Gravity:
    <InfoTooltip
      content={
        <div style={{ textAlign: "left" }}>
          <p>
            <strong>Surface gravity</strong> is the gravitational acceleration felt at the surface of a planet.
          </p>
          <p style={{ marginBottom: "8px" }}>
            It determines how heavy objects feel and affects atmospheric behavior.
          </p>

          <p style={{ marginBottom: "8px" }}>
            <strong>Assumptions:</strong><br />
            • Spherical planet<br />
            • Known mass and radius<br />
            • Classical Newtonian gravity
          </p>

          <p style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span>Calculated as:</span>
            <span
              dangerouslySetInnerHTML={renderKaTeX(
                "g = \\frac{GM}{R^2}"
              )}
            />
          </p>
        </div>
      }
    />
    </div>
    <div style={{width: 667, height: 113, left: 432, top: 967, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>Escape velocity:
      <InfoTooltip
        content={
          <div>
            <p style={{ marginBottom: "8px" }}>
              <strong>Escape velocity</strong> is the minimum speed required for an object to escape a planet&apos;s gravitational pull without further propulsion.
            </p>
            <p style={{ marginBottom: "8px" }}>
              <strong>Assumptions:</strong><br />
              • No atmosphere or drag<br />
              • Newtonian gravity<br />
              • Vacuum environment<br />
              • Escaping object is massless
            </p>
            <p style={{ marginBottom: "8px" }}>
              Derived using energy conservation:
            </p>
            <div style={{ textAlign: "center", marginTop: "6px" }}>
              <div 
                dangerouslySetInnerHTML={renderKaTeX(
                  "v = \\sqrt{\\frac{2GM}{R}}"
                )}
              />
            </div>
          </div>
        }
        tooltipStyle={{transform:"translateX(-25%)"}}
      />
    </div>
    <div style={{width: 667, height: 113, left: -98, top: 833, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>Radius:</div>
    <div style={{width: 667, height: 113, left: -112, top: 963, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 32, fontFamily: 'Jura', fontWeight: '700', wordWrap: 'break-word'}}>Mass:</div>
    <div style={{width: 1001, height: 112, left: -124, top: 35, position: 'absolute', textAlign: 'center', color: '#FFD9D9', fontSize: 96, fontFamily: 'Koulen', fontWeight: '400', wordWrap: 'break-word'}}>{exoplanet.planetName}</div>
    <div style={{width: 1001, height: 78, left: 994, top: 59, position: 'absolute', textAlign: 'center', color: '#FFD9D9', fontSize: 64, fontFamily: 'Koulen', fontWeight: '400', wordWrap: 'break-word'}}>{exoplanet.hostStarName}</div>
    <div style={{
        position: 'absolute',
        top: '300px',
        left: '13%',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        zIndex: 2
      }}>
        {['About the ESI', 'About the Curve', 'Units & Earth Values'].map((label) => (
          <div
            key={label}
            onMouseEnter={() => setHoveredInfo(label)}
            onMouseLeave={() => setHoveredInfo(null)}
            style={{
              backgroundColor: '#FFD9D9',
              color: '#000',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '20px',
              textAlign: 'center',
              cursor: 'default',
              userSelect: 'none',
              boxShadow: '0 0 8px rgba(255,255,255,0.2)',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {label}
          </div>
        ))}
      </div>
    {hoveredInfo && (
        <div
          style={{
            position: 'absolute',
            top: '635px', // adjust depending on plot position
            left: '898px',
            transform: 'translateX(-50%)',
            width: '1524px',
            height: 436,
            backgroundColor: '#1a1a1a',
            color: '#FFD9D9',
            padding: '20px',
            borderRadius: '26px',
            fontSize: '21px',
            fontFamily: 'Jura, sans-serif',
            boxShadow: '0 0 12px rgba(0,0,0,0.4)',
            zIndex: 2,
          }}
        >
          {hoveredInfo === 'About the ESI' && (
            <>
              <h3 style={{ marginTop: 0, textAlign: "center" }}>What is the ESI (Earth Similarity Index)?</h3>
              <p>The Earth Similarity Index is a measure that quantifies how similar an exoplanet is to Earth. It ranges from 0 (no similarity) to 1 (identical to Earth).</p>

              <p>It considers multiple planetary properties (like radius, temperature, escape velocity, etc.), and combines them with weights to form a single score using the following formula:</p>

              <div style={{ textAlign: "center", margin: "12px 0" }}
                  dangerouslySetInnerHTML={renderKaTeX(`
              ESI = \\prod_{i=1}^{n} \\left(1 - \\left| \\frac{x_i - x_{i0}}{x_i + x_{i0}} \\right|\\right)^{\\frac{w_i}{n}}
              `)} />

              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <ul style={{ display: "inline-block", textAlign: "left", paddingLeft: "20px" }}>
                  <li><strong>x<sub>i</sub></strong> = Value of the characteristic on the exoplanet (e.g., radius, temperature)</li>
                  <li><strong>x<sub>i0</sub></strong> = Value of the same characteristic on Earth (e.g., 288 K for temperature)</li>
                  <li><strong>w<sub>i</sub></strong> = Weight assigned to each characteristic (default values from the literature)</li>
                  <li><strong>n</strong> = Total number of characteristics being compared (typically 4)</li>
                </ul>
                <p style={{ marginTop: "10px" }}>
                  The symbol <span dangerouslySetInnerHTML={renderKaTeX(`\\prod_{i=1}^{n}`)} /> means that all the terms are multiplied together.
                </p>
              </div>
            </>
          )}
          {hoveredInfo === 'About the Curve' && (
            <>
              <h3 style={{ marginTop: 0, textAlign: "center" }}>What is a Photometric Curve?</h3>
              <p style={{ textAlign: 'left' }}>
                A photometric curve shows how a star&apos;s brightness changes over time. It is obtained by measuring the star&apos;s light at regular intervals.
                <br /><br />
                When a planet transits (passes in front of) its star, it causes a small dip in brightness, seen as a valley in the curve.
                <br /><br />
                From this dip, we calculate the fractional depth, which helps estimate the planet&apos;s size, orbital period, and other properties. Photometric curves are a key tool in detecting and analyzing exoplanets.
                <br /><br />
                Smaller planets are harder to detect, as their dips are shallow and noisy, with large error bars. This is why most transit-discovered exoplanets are large gas giants, with low a ESI value.
              </p>
            </>
          )}
          {hoveredInfo === 'Units & Earth Values' && (
            <>
              <div style={{ textAlign: "center" }}>
                <h3 style={{ marginTop: 0 }}>Units & Earth Reference Values</h3>
                <p style={{ textAlign: "left"}}>
                  All values are displayed relative to Earth&apos;s standard values. The reason for this choice is the ultimate purpose of the Earth Similarity Index:
                  to predict an exoplanet&apos;s habitability using the Earth as a reference. With this representation, it is easier to understand the exoplanet&apos;s parameters.
                </p>
                <p style={{ lineHeight: "1.8" }}>
                  • Radius: 1 R⊕ = 6,371.00 km<br />
                  • Mass: 1 M⊕ = 5.97 × 10²⁴ kg<br />
                  • Surface Gravity: 1 g = 9.80 m/s²<br />
                  • Escape Velocity: 1 vₑ⊕ = 11.20 km/s<br />
                  • Density: 1 ρₑ⊕ = 5.50 g/cm³<br />
                  • Theoretical Temperature: 1 T⊕ = 288.00 K<br />
                  • Orbital Period: 1 year = 365.25 days
                </p>
              </div>
            </>
          )}
        </div>
      )}
    <div onClick={() => router.push('/dashboard')} style={{ cursor: 'pointer'}}>
      <div style={{width: 236, height: 49, left: 22, top: 1039, position: 'absolute', background: '#650808', boxShadow: '69.30000305175781px 69.30000305175781px 69.30000305175781px ', filter: 'blur(34.65px)', zIndex: 312413242}} />
      <div style={{width: 173, height: 55, left: 64, top: 1029, position: 'absolute', background: 'black', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 46, zIndex: 312413242}} />
      <div style={{width: 317, height: 49, left: -9, top: 1044, position: 'absolute', textAlign: 'center', color: '#8A5555', fontSize: 24, fontFamily: 'Karantina', fontWeight: '700', wordWrap: 'break-word', zIndex: 312413242}}>Back to Dashboard</div>
    </div>

    <Button // Making the owner clickable to get to his profile page
      onClick={() => router.push(`/users/${exoplanet.ownerId}`)}
      onMouseEnter={(e) => e.currentTarget.style.color = "rgb(176, 248, 255)"}
      onMouseLeave={(e) => e.currentTarget.style.color = "white"}
      style={{
        width: 160,
        height: 60,
        left: 1470,
        top: 536,
        position: 'absolute',
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontFamily: 'Jura',
        fontWeight: '700',
        wordWrap: 'break-word',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        transition: "background-color 0.4s ease",
      }}
    >
      <span>
        Analyzed by:<br />
        {curveOwner}
      </span>
    </Button>
        
    {contextHolder}
    {isOwner(exoplanet.ownerId) && ( // Only show the button if the User is also the Owner of this exoplanet
    <Button // Delete Exoplanet Button
      onClick={() => handleDeletion(exoplanet.id, exoplanet.planetName)}
      type="primary"
      //disabled={!isOwner(exoplanet.ownerId)} // If the button should be shown but just not clickable, this would work
      style={{
        width: 173, // position
        height: 55,
        left: 1500,
        top: 1029,
        position: 'absolute',

        background: 'black', // Box
        boxShadow: '0px 0px 40px 12px rgba(255, 0, 0, 0.25)', // red glow
        borderRadius: 46,
        
        textAlign: 'center', // Text
        color: '#8A5555',
        fontSize: 24,
        fontFamily: 'Karantina',
        fontWeight: '700',
        wordWrap: 'break-word'
      }}
    >
      Delete Exoplanet
    </Button>
    )}

</div>}
        </div>
         {/* Right Section: Comments */}
        <div style={{
          flex: '1',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '20px',
          color: 'white',
          fontFamily: 'Jura, sans-serif',
          borderLeft: '1px solid #333',
          overflowY: 'auto'
        }}>
          <h2 style={{ color: '#FFD9D9', fontSize: '28px' }}>Comments</h2>

          <div style={{ maxHeight: '70vh', overflowY: 'auto', marginBottom: '20px' }}>
            {exoplanet.comments.length === 0 ? (
              <p>No comments yet. Be the first to leave one!</p>
            ) : (
              exoplanet.comments.map((comment, index) => (
                <div key={index} style={{
                  marginBottom: '15px',
                  padding: '10px',
                  backgroundColor: '#1a1a1a',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    {commentUsernames[comment.userId] || comment.userId}
                  </div>
                  <div style={{ fontSize: '14px' }}>{comment.message}</div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              placeholder="Write a comment..."
              style={{
                resize: 'none',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #555',
                marginBottom: '10px',
                backgroundColor: '#111',
                color: '#fff'
              }}
            />
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '10px',
                backgroundColor: submitting ? '#333' : '#FFD9D9',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
  </ConfigProvider>
  );
};

export default ExoplanetProfile;
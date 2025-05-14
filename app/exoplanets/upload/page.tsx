"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering
import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { Button, Form, Input, Card } from "antd";
import { useRef, useState, useEffect } from "react";
import { PhotometricCurve } from "@/types/photometricCurve";


function extractHostStarName(exoplanetName: string): string {
  return exoplanetName.trim().replace(/\s+[bcdefgh]$/i, "");
}

const Upload: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [showCurveInfo, setShowCurveInfo] = useState(false);


  const handleUpload = async (value: {  exoplanetName: string, hostStar: string }) => {
    if (!selectedFile) {
      alert("Please upload a .txt file.");
      return;
    }

    const formData = new FormData(); // Backend: PhotometricCurve curve = photometricCurveService.processAndSavePhotometricCurve(file, hostStar, exoplanet, ownerId);
    formData.append("file", selectedFile); // should be object of type: MultipartFile
    const hostStar = extractHostStarName(value.exoplanetName);
    formData.append("hostStar", hostStar)
    formData.append("exoplanet", value.exoplanetName);
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID not found. Please log before trying to upload.");
      return;
    }
    formData.append("ownerId", userId);

    try {
      const curve = await apiService.post<PhotometricCurve>("/photometric-curves/upload", formData);
      const exoplanetId = curve.exoplanetId;
      router.push(`/exoplanets/${exoplanetId}`);
    } catch (error) {
      if (error && typeof error === "object" && "status" in error && (error as { status: number }).status === 422) {
        const exoplanetName = form.getFieldValue("exoplanetName");
    
        try {
          const data = await apiService.post<{ reply: string }>("/openai/helper", exoplanetName);
          setAiSuggestion(data.reply);
        } catch (helperError) {
          console.error("Error calling /openai/helper", helperError);
          setAiSuggestion("Could not get a suggestion from the AI.");
        }
      } else if (error instanceof Error) {
        alert(`Something went wrong:\n${error.message}`);
      } else {
        console.error("Unknown error:", error);
      }
    }
    
    
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/plain") {
      alert("Please upload a .txt file.");
      return;
    }
    setSelectedFile(file);  // save new file
  };

  useEffect(() => { // Redirect User to login if he is not logged in
    const storedToken = localStorage.getItem("token"); 
    if(!storedToken){
      router.push("/login");
      return;
    }
  }, [apiService, router]);

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
          backgroundColor: "rgba(0, 0, 0, 0.5)", // instead of opacity = 0.66 -> buttons etc. would inherit opacity

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
          {aiSuggestion && (
          <div
            style={{
              position: "absolute",
              top: "43vh",
              right: "5vw",
              padding: "1vh",
              border: "2px solid #FFD9D9", 
              borderRadius: "16px",
              color: "#FFD9D9",
              fontFamily: "Jura",
              fontSize: "2vw",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              width: "27vw",
              textAlign: "center",
              zIndex: 1000,
            }}
          >
            {aiSuggestion}
          </div>
        )}

          
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
                width: "32vw", // size
                height: "52vh",

                display: "flex", // center items horizontally
                flexDirection: "column",
                alignItems: "center",

                background: "black", // visuals
                border: "none",
                borderRadius: 26,
                backgroundColor: "rgba(0, 0, 0, 0.5)", // instead of opacity = 0.66 -> buttons etc. would inherit opacity

                zIndex: 1 // foreground
              }}
            >
              <Form // Input field "Name of the Exoplanet" with label
                form={form}
                name="upload"
                size="large"
                variant="outlined"
                onFinish={handleUpload}
                layout="vertical" // Label on top by default
                requiredMark={false} // no star before label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center", // vertical center
                  height: "100%",           // fill the Card
                  width: "100%",            // prevent shrinking
                }}
              >
                <div // Text above button
                  style=
                  {{
                    textAlign: "center",
                    color: "#8A5555",
                    fontSize: "1.6vw",
                    fontFamily: "Jura", // imported fontFamily -> see top of globals.css
                    fontWeight: "700",
                    marginTop: '6vh',
                    background: "linear-gradient(90deg, #FFFFFF 0%, #D05C5C 63.9%, #B60000 100%)", // color gradient
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Upload a lightcurve file (.txt)
                </div>
                <div
                  style = {{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <input // Button to upload file
                    type="file"
                    accept=".txt"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{
                      display: "none",
                    }}
                  >
                  </input>
                  <Button
                    type="default"
                    onClick={() => fileInputRef.current?.click()}
                    style = {{
                      width: "28vw", // button size & style
                      height: "6vh",
                      background: "black",
                      borderRadius: 46,
                      marginTop: "1vh",
                      border: "none", // removes white border

                      textAlign: "center", // Text size & style
                      color: "#8A5555",
                      fontSize: "40px",
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
                      Upload file
                    </span>
                  </Button>
                  </div>                 
                
                {selectedFile && ( // This part is responsible for showing the name of the selected file
                  <div
                    style={{
                      marginTop: "1.2vh",
                      textAlign: "center",
                      color: "#8A5555",
                      fontSize: "0.8vw",
                      fontFamily: "Jura", // imported fontFamily -> see top of globals.css
                      fontWeight: "700",

                      background: "linear-gradient(90deg, #FFFFFF 0%, #D05C5C 63.9%, #B60000 100%)", // color gradient
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Selected file: <strong>{selectedFile.name}</strong>
                  </div>
                )}

                <Form.Item // Input exoplanet name field & Label
                  name="exoplanetName"
                  label={
                  <span
                    style={{
                      width: "32vw", // size
                      height: "8vh",
                      marginTop: "2vh",

                      textAlign: "center",
                      background: "linear-gradient(90deg, #FFFFFF 0%, #D05C5C 63.9%, #B60000 100%)", // color gradient
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: "1.6vw",
                      fontFamily: "Jura", // imported fontFamily -> see top of globals.css
                      fontWeight: "700",
                    }}
                  >
                    Name of the Exoplanet
                  </span>
                  }

                  rules={[{ required: true, message: "" }]} // For now, I did not manage to implement the message without creating
                                                            // a big improper looking gap between message and input field. 
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "-6vh",
                    }}
                  >
                    <Input
                    style={{
                      width: "24vw",
                      height: "6vh",
                      background: "white",
                      borderRadius: 46,
                      fontSize: "2vw",
                      fontFamily: "Jura",
                      color: "#000000"
                    }}
                    />
                  </div>
                </Form.Item>
                <div>
                  <div
                    onClick={() => setShowCurveInfo(true)}
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "0.6vw",
                      padding: "0.8vh 1.2vw",
                      color: "#D0E0F3",
                      fontFamily: "Jura, sans-serif",
                      fontSize: "1.2vw",
                      fontWeight: 500,
                      boxShadow: "0 0 12px rgba(0,0,0,0.4)",
                      maxWidth: "26vw",
                      lineHeight: "1.5",
                      textAlign: "center",
                      cursor: "pointer",
                      transform: "translateY(-10px)"
                    }}
                  >
                    How to download a photometric curve
                  </div>

                  {showCurveInfo && (
                    <div
                      style={{
                        position: "absolute",
                        top: "22vh",
                        left: "62vw",
                        width: "30vw",
                        maxHeight: "70vh",
                        overflowY: "auto",
                        background: "rgba(0, 0, 0, 0.85)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "0.6vw",
                        padding: "2vh 1.5vw",
                        color: "#FFD9D9",
                        fontFamily: "Jura, sans-serif",
                        fontSize: "0.95vw",
                        boxShadow: "0 0 20px rgba(0,0,0,0.6)",
                        zIndex: 9999,
                        transform: "translateX(-1420px) translateY(-180px)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1vh" }}>
                        <h3 style={{ fontSize: "1.1vw", fontWeight: "bold", margin: 0 }}>
                          📊 How to Get a Photometric Curve 📊
                        </h3>
                        <span
                          onClick={() => setShowCurveInfo(false)}
                          style={{
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "1.2vw",
                            color: "#FFAAAA"
                          }}
                        >
                          ❌
                        </span>
                      </div>
                      <p>You can download a photometric light curve from the NASA Exoplanet Archive or other astronomical databases.</p>
                      <ul style={{ paddingLeft: "1.2vw", lineHeight: "1.6" }}>
                        <li>
                          Go to the{" "}
                          <a
                            href="https://var.astro.cz/en/Exoplanets"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#87CEFA" }}
                          >
                            exoplanet transit database
                          </a>
                          .
                        </li>
                        <li>Search for your target star or exoplanet.</li>
                        <li>Look for downloadable light curve or transit data in <code>.txt</code> format.</li>
                        <li>Save the file and upload it using the form above.</li>
                      </ul>

                      <p style={{ marginTop: "10px" }}>
                        Keep in mind that you might not find a photometric curve for every known exoplanet. This can happen for several reasons:
                        the exoplanet might be too small, orbit too far from its star, or the signal may be too weak or noisy to detect reliably.
                        Additionally, not all exoplanets have been observed with the precision needed to generate public transit data.
                      </p>

                      <p style={{ marginTop: "10px" }}>
                        Make sure the file contains time and brightness values for correct analysis!
                      </p>
                    </div>
                  )}
                </div>

                <Form.Item
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "2vh"
                  }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      width: "32vw", // button size & style
                      height: "6vh",
                      background: "black",
                      borderRadius: 46,
                      //backdropFilter: "blur(10px)", // according to figma, we need this -> I don't think it is visible
                      
                      marginTop: "10vh", // button position

                      textAlign: "center", // Text size & style
                      color: "#8A5555",
                      fontSize: "32px",
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
                      Calculate
                    </span>
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
          <Button // Button: Back to dashboard
            onClick={() => router.push("/dashboard")}
            type="primary"
            htmlType="button"
            style={{
              width: "10vw", // button size & style
              height: "6vh",
              background: "black",
              borderRadius: 46,
              //backdropFilter: "blur(10px)", // according to figma, we need this -> I don't think it is visible
              
              marginLeft: "4vw", // button position
              marginTop: "11vh",

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

export default Upload;
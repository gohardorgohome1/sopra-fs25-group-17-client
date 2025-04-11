"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering
import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { Button, Form, Input, Card } from "antd";
import { useRef, useState } from "react";
import { PhotometricCurve } from "@/types/photometricCurve";

const Upload: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUpload = async (value: {  exoplanetName: string, hostStar: string }) => {
    if (!selectedFile) {
      alert("Please upload a .txt file.");
      return;
    }

    const formData = new FormData(); // Backend: PhotometricCurve curve = photometricCurveService.processAndSavePhotometricCurve(file, hostStar, exoplanet, ownerId);
    formData.append("file", selectedFile); // should be object of type: MultipartFile
    formData.append("hostStar", value.hostStar)
    formData.append("exoplanet", value.exoplanetName);
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID not found. Please log before trying to upload.");
      return;
    }
    formData.append("ownerId", userId);

    try {
      const curve = await apiService.post<PhotometricCurve>("/photometric-curves/upload",  formData ); // post request for Photometric Curve
      const exoplanetId = curve.exoplanetId; // Used to redirect the user to the correct page

      router.push(`/exoplanets/${exoplanetId}`);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Invalid photometric curve file or exoplanet name!")) {
          alert("Invalid photometric curve file or exoplanet name!");
        }
        else{
          alert(`Something went wrong during the upload of your photometric curve file:\n${error.message}`);
        }
        
      } else {
        console.error("An unknown error occurred during the upload of your photometric curve file!");
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
              >
                <div // Text above button
                  style=
                  {{
                    textAlign: "center",
                    color: "#8A5555",
                    fontSize: "1.6vw",
                    fontFamily: "Jura", // imported fontFamily -> see top of globals.css
                    fontWeight: "700",

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
                <Form.Item // Input hostStar name field & Label
                  name="hostStar"
                  style = {{
                    marginTop: "-4vh"
                  }}
                  label={
                  <span
                    style={{
                      width: "32vw", // size
                      height: "8vh",
                      marginTop: "-5vh",

                      textAlign: "center",
                      background: "linear-gradient(90deg, #FFFFFF 0%, #D05C5C 63.9%, #B60000 100%)", // color gradient
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: "1.6vw",
                      fontFamily: "Jura", // imported fontFamily -> see top of globals.css
                      fontWeight: "700",
                    }}
                  >
                    Name of the Host Star
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
                      color: "#000000",
                    }}
                    />
                  </div>
                </Form.Item>
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
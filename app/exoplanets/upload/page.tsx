"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering
import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { Button, Form, Input, Card } from "antd";
import { Span } from "next/dist/trace";

const Upload: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();

  const handleUpload = async (values: { exoplanetName: string }) => {
    return;
  }

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
                width: "36vw", // size
                height: "52vh",

                display: "flex", // center items horizontally
                flexDirection: "column",
                alignItems: "center",

                background: "black", // visuals
                border: "none",
                borderRadius: 26,
                backgroundColor: "rgba(0, 0, 0, 0.66)", // instead of opacity = 0.66 -> buttons etc. would inherit opacity

                zIndex: 1 // foreground
              }}
            >
              <span
                style=
                {{
                  display: "flex", // center text horizontally
                  flexDirection: "column",
                  alignItems: "center",

                  textAlign: "center",
                  color: "#8A5555",
                  fontSize: "2vw",
                  fontFamily: "Jura", // imported fontFamily -> see top of globals.css
                  fontWeight: "700",

                  background: "linear-gradient(90deg, #FFFFFF 0%, #D05C5C 63.9%, #B60000 100%)", // color gradient
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Upload a lightcurve file (.txt)
              </span>
              <Button
                type="primary"
                htmlType="submit"
                className="upload-button"
                style={{
                  width: "32vw", // button size & style
                  height: "8vh",
                  background: "black",
                  borderRadius: 46,
                  marginTop: "20px",

                  textAlign: "center", // Text size & style
                  color: "#8A5555",
                  fontSize: "40px",
                  fontFamily: "Karantina", // imported fontFamily -> see top of globals.css
                  fontWeight: "700",

                  boxShadow: "none", // removes default green shadow of button
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

              <Form // Input field "Name of the Exoplanet" with label
                form={form}
                name="upload"
                size="large"
                variant="outlined"
                onFinish={handleUpload}
                layout="vertical" // Label on top by default
                requiredMark={false} // no star before label
              >
                <Form.Item // Input exoplanet name field & Label
                  name="exoplanetName"
                  label={
                  <span
                    style={{
                      width: "32vw", // size
                      height: "8vh",
                      marginTop: "6vh",

                      textAlign: "center",
                      background: "linear-gradient(90deg, #FFFFFF 0%, #D05C5C 63.9%, #B60000 100%)", // color gradient
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: "2vw",
                      fontFamily: "Jura", // imported fontFamily -> see top of globals.css
                      fontWeight: "700",
                    }}
                  >
                    Name of the Exoplanet
                  </span>
                  }

                  rules={[{ required: true, message: "Please input the name of the Exoplanet!" }]}
                >
                  <Input
                  style={{
                    width: "32vw",
                    height: "8vh",
                    background: "white",
                    borderRadius: 46,
                    fontSize: "2vw",
                    fontFamily: "Jura",
                    color: "#000000"
                  }}
                  />
                </Form.Item>
              </Form>
            </Card>

            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "320px", // button size & style
                height: "35px",
                background: "black",
                borderRadius: 46,
                //backdropFilter: "blur(10px)", // according to figma, we need this -> I don't think it is visible
                
                marginTop: "6vh", // button position

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
              
              marginLeft: "60px", // button position
              marginTop: "20px",

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
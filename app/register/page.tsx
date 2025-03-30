"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import { useRouter } from "next/navigation"; // use NextJS router for navigation
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Button, Form, Input, Card } from "antd";
// Optionally, you can import a CSS module or file for additional styling:
// import styles from "@/styles/page.module.css";

const Register: React.FC = () => {
    const router = useRouter();
    const apiService = useApi();
    const [form] = Form.useForm();
  
    const { set: setToken } = useLocalStorage<string>("token", "");

    

    const handleRegister = async (values: { username: string; name: string; password: string }) => {
      try {
        const response = await apiService.post<User>("/users", values);
        
        if (response.token) {
          setToken(response.token);
          if (response.id != null){
            localStorage.setItem("userId", response.id.toString());
          }
        }
        
      } catch (error) {
        if (error instanceof Error) {
          alert(`Registration failed:\n${error.message}`);
        } else {
          console.error("An unknown error occurred during registration.");
        }
      }
      const response = await apiService.post<User>("/login",  values );
      // User = response type, /users = endpoint on server

      // Use the useLocalStorage hook that returned a setter function (setToken in line 41) to store the token if available
      if (response.token) {
        setToken(response.token);
        if(response.id != null){
          localStorage.setItem("userId", response.id.toString());
        }
      }

      // Navigate to the dashboard after successfull registration
      router.push("/dashboard");
      
    };
  
    return (
      <div
        className="register-container"
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column", // Makes sure the Text (Exoplanet Hunting Platform) stays above the Card
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img // Background image
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 1 // 0.96 according to figma
            }}
          src="/background1.png" // picture under /public/background1.png
        />

        <h1 // Text Exoplanet Hunting Platform
          style={{
            width: 1659, // position
            height: 96,
            
            color: "white", // font & text related
            fontSize: "2rem",
            textAlign: "center",
            marginBottom: "20px",

            zIndex: 1 // foreground
          }}
        >
          Exoplantet Hunting Platform
        </h1>
        <Card // Card for registration
        className="dashboard-container"
        style={{
          padding: "20px", // position
          height: "500px",
          width: "762px",

          background: 'black', // visuals
          border: "none",
          borderRadius: 98,
          backgroundColor: "rgba(0, 0, 0, 0.65)", // instead of opacity = 0.65 -> buttons etc. would inherit opacity

          zIndex: 1 // foreground
        }}
      >
        <Form // Registration
          form={form}
          name="register"
          size="large"
          variant="outlined"
          onFinish={handleRegister}
          layout="horizontal" // Label to the left by default
        >
          <Form.Item // Input username field & Label
            name="username"
            label={<span
              style={{
                width: 317, // size
                height: 49,

                textAlign: 'center', // font & text related
                color: '#8A5555',
                fontSize: 40,
                fontFamily: 'Karantina',
                fontWeight: '700',
              }}
            >
              Username
            </span>
            }
            labelCol={{ span: 8 }} // "maximum" width of the label
            wrapperCol={{ span: 18 }} // "maximum" width of the input field

            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
            placeholder="Enter username"
            style={{
              width: "353px",
              height: "52px",
              background: 'white',
              borderRadius: 46,
              fontSize: "16px"
            }}
            />
          </Form.Item>

          <Form.Item // Input password field & Label
            name="password"
            label={<span
              style={{
                width: 317, // size
                height: 49,

                textAlign: 'center', // font & text related
                color: '#8A5555',
                fontSize: 40,
                fontFamily: 'Karantina',
                fontWeight: '700',
              }}
            >
              Password
            </span>
            }
            labelCol={{ span: 8 }} // "maximum" width of the label
            wrapperCol={{ span: 18 }} // "maximum" width of the input field

            rules={[{ required: true, message: "Please input a password!" }]}
          >
            <Input.Password
            placeholder="Create password"
            style={{
              width: "353px",
              height: "52px",
              background: 'white',
              borderRadius: 46,
              fontSize: "16px"
            }}
            />
          </Form.Item>

          <Form.Item>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px"
              }}>
              <Button // Register button
                type="primary"
                htmlType="submit"
                className="register-button"
                style={{
                  width: "509px", // button size & style
                  height: "55px",
                  background: 'black',
                  borderRadius: 46,

                  textAlign: 'center', // Text size & style
                  color: '#8A5555',
                  fontSize: 40,
                  fontFamily: 'Karantina',
                  fontWeight: '700'
                }}
              >
                REGISTER
              </Button>
              <div
                style={{
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  gap: "10px"
                }}>
                <span
                  style=
                  {{
                    textAlign: 'center',
                    color: '#8A5555',
                    fontSize: 24,
                    fontFamily: 'Jura',
                    fontWeight: '700'
                  }}
                  >
                    Already registered? Then log in
                  </span>
                <Button // Login button
                  onClick={() => router.push("/login")}
                  type="primary"
                  htmlType="button"
                  style={{
                    width: "100px", // button size & style
                    height: "35px",
                    background: 'black',
                    borderRadius: 46,

                    textAlign: 'center', // Text size & style
                    color: '#8A5555',
                    fontSize: 20,
                    fontFamily: 'Karantina',
                    fontWeight: '700'
                  }}
                >
                  Log in
                  </Button>
                </div>
              </div>
          </Form.Item>
        </Form>
        </Card>
        <h1 // Text Exoplanet Hunting Platform
          style={{
            width: 943, // position
            height: 168,
            marginBottom: "20px",

            color: 'black', // font & text related
            textAlign: "center",
            fontSize: 40,
            fontFamily: 'Jura',
            fontWeight: '700',
            wordWrap: 'break-word',
            textShadow: '0px 4px 11px rgba(255, 255, 255, 1.00)',

            zIndex: 1 // foreground
          }}
        >
          Take exoplanet collaborative research to the next level
        </h1>
      </div>
    );
  };
  
  export default Register;
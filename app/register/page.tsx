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
          
           // Redirect to users overview after registration
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
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 1
            }}
          src="/background1.png"
        />
        <Card
        className="dashboard-container"
        style={{
          zIndex: 1, 
          padding: "20px",
          height: "500px",
          width: "762px",
          background: 'black',
          borderRadius: 98,
          opacity: 0.65
        }}
      >
        <Form
          form={form}
          name="register"
          size="large"
          variant="outlined"
          onFinish={handleRegister}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Enter a username" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input a password!" }]}
          >
            <Input.Password placeholder="Create password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="register-button">
              Register
            </Button>

            <Button
              onClick={() => router.push("/login")}
              type="primary"
              htmlType="button"
            >
              Log in
              </Button>
          </Form.Item>
        </Form>
        </Card>
      </div>
    );
  };
  
  export default Register;
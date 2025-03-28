// your code here for S2 to display a single user profile after having clicked on it
// each user has their own slug /[id] (/1, /2, /3, ...) and is displayed using this file
// try to leverage the component library from antd by utilizing "Card" to display the individual user
// import { Card } from "antd"; // similar to /app/users/page.tsx

"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Card, Typography, Button} from "antd";
// import type { TableProps } from "antd";


const { Title, Text } = Typography;

const UserProfile: React.FC = () => {
  const router = useRouter();
  const { id } = useParams(); // Get user ID from the URL
  const apiService = useApi();
  const [user, setUser] = useState<User | null>(null);
  //const [loading, setLoading] = useState<boolean>(true);
  //const [_, setLoading] = useState<boolean>(true);
  const setLoading = useState<boolean>(true)[1];


  const {
    // value: token, // is commented out because we dont need to know the token value for logout
    // set: setToken, // is commented out because we dont need to set or update the token value
    //clear: clearToken, // all we need in this scenario is a method to clear the token
  } = useLocalStorage<string>("token", ""); // if you wanted to select a different token, i.e "lobby", useLocalStorage<string>("lobby", "");

  useEffect(() => {
    const storedToken = localStorage.getItem("token"); 
    if(!storedToken){
      router.push("/login");
      return;
    }

    if (!id) return;

    const fetchUser = async () => {
      try {
        const userData: User = await apiService.get<User>(`/users/${id}`);
        setUser(userData);
        console.log("Fetched user:", userData)
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, apiService, router, setLoading]);
/*
  if (loading) {
    return <Text size="large" style={{ display: "block", margin: "20px auto" }} />;
  }

  if (!user) {
    return <Text type="danger">User not found.</Text>;
  }
*/
  return (
    <div className="user-profile"> 
    loading={!user}
    <Card title="User Profile" style={{ maxWidth: 600, margin: "20px auto" }}>
      
      { user && (
        <>
        <Title level={3}>{user.username}</Title>
        <Text strong>Name:</Text> <Text>{user.name}</Text>
        <br />
        <Text strong>Birth day:</Text> <Text>{user.birthday}</Text>
        <br />
        <Text strong>Creation Date:</Text> <Text>{user.creation_date}</Text>
        <br />
        <Text strong>Status:</Text> <Text>{user.status}</Text>
        <br />
        <Text strong>ID:</Text> <Text>{user.id}</Text>
        <br />
        </>
     ) }
        <Button
            type="primary"
            variant="solid"
            onClick={() => router.push("/users")}
          >
            users overview
          </Button>

    </Card>
     <div>
     
     </div>
    
    </div>
  );
};

export default UserProfile;



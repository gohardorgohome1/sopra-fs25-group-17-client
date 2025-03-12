// your code here for S2 to display a single user profile after having clicked on it
// each user has their own slug /[id] (/1, /2, /3, ...) and is displayed using this file
// try to leverage the component library from antd by utilizing "Card" to display the individual user
// import { Card } from "antd"; // similar to /app/users/page.tsx

"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import React, { useEffect, useState } from "react";
import {useRouter } from "next/navigation";
//import { useParams, useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Card, Button, Input, Typography, message } from "antd";
// import type { TableProps } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";


dayjs.extend(customParseFormat);


const {Text } = Typography;
// const { Title, Text } = Typography;

const UserProfile: React.FC = () => {
  const router = useRouter();
  //const { id } = useParams(); // Get user ID from the URL
  // const id = localStorage.getItem("userId");
  const apiService = useApi();
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  //const [_,setLoading] = useState<boolean>(true);
  //const [loading, setLoading] = useState<boolean>(true);
  const setLoading = useState<boolean>(true)[1];

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedBirthday, setEditedBirthday] = useState("");
  const [editedUsername, setEditedUsername] = useState("");

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

    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));}

    // if (!id) return;

    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const userData: User = await apiService.get<User>(`/users/${userId}`);
        setUser(userData);
        console.log("Fetched user:", userData)
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, apiService, router, setLoading]);

    // Function to validate date format (DD.MM.YYYY)
    const validateDate = (date: string) => {
      const parsedDate = dayjs(date, "DD.MM.YYYY", true); // 'true' ensures strict parsing
      return parsedDate.isValid();
    };

  const updateUser = async () => {
    if (!user) return;
    if (!validateDate(editedBirthday)) {
      message.error("Please enter a valid date in the format DD.MM.YYYY");
      return; 
    }

    const formattedBirthday = dayjs(editedBirthday, "DD.MM.YYYY").format("YYYY-MM-DD");
    try {
        const response: Response = await apiService.put(`/users/${user.id}`, {
        username: editedUsername,
        name: editedName,
        birthday: formattedBirthday
      });
      if (response.status === 204){
        console.info("Profile updated successfully!");

        // Fetch fresh user data from backend
        const updatedUser = await apiService.get<User>(`/users/${user.id}`);
        //const updatedUser: User = await updatedUserResponse.json();
        setUser(updatedUser);
        router.refresh();
        //setUser({ ...user, username: editedUsername, name: editedName, birthday: editedBirthday });
        setIsEditing(false);

      }
      
    } catch (error) {
      console.error("Failed to update profile.");
      console.error("Error updating user:", error);
    }
    
  };


  return (
    
    <div className="user-profile"> 
    loading={!user}
    <Card title="User Profile" style={{ maxWidth: 600, margin: "20px auto" }}>
      
      { user && (
        <>
        <Text strong>Username:</Text>
        {isEditing ? (
              <Input value={editedUsername} placeholder = "Enter new username" onChange={(e) => setEditedUsername(e.target.value)} />
            ) : (
              <Text> {user.username}</Text>
            )}

        <br />
        <Text strong>Name:</Text>
        {isEditing ? (
              <Input value={editedName} placeholder = "Enter new name"onChange={(e) => setEditedName(e.target.value)} />
            ) : (
              <Text> {user.name}</Text>
            )}
            <br />
        <Text strong>Birthday:</Text>
        {isEditing ? (
              <Input value={editedBirthday} placeholder="DD.MM.YYYY" onChange={(e) => setEditedBirthday(e.target.value)} />
            ) : (
              <Text> {user.birthday}</Text>
            )}
            

        <br />
        <Text strong>Creation Date:</Text> <Text>{user.creation_date}</Text>
        <br />
        <Text strong>Status:</Text> <Text>{user.status}</Text>
        <br />
        <Text strong>ID:</Text> <Text>{user.id}</Text>
        <br />
        <br/>


        {isEditing ? (
              <div style={{ marginTop: "10px" }}>
                <Button type="primary" onClick={updateUser}>Save Changes</Button>
                <Button style={{ marginLeft: "10px" }} onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            ) : (
              <Button type="primary" onClick={() => setIsEditing(true)}>Edit</Button>
            )}


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
    </div>
  );
};

export default UserProfile;



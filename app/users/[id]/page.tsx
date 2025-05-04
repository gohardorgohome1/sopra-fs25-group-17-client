"use client";

import React, { useEffect, useState } from "react";

import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import { Button, Card, Form, Input } from "antd";
import { useRouter } from "next/navigation";

const UserProfile = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params);
    const [user, setUser] = useState<User | null>(null);
    const apiService = useApi();
    const [usernameForm] = Form.useForm();
    const router = useRouter();
    const [isCorrectUser, setIsCorrectUser] = useState(false);

    /*const matchingTokens = async (token: string) => {
        try {
        const response = await apiService.get<{ token: string }>(`/users/${id}/token`);

        const cleanToken = token.replace("", "");

        if (response.token === cleanToken) {
            return true;
        } else {
            return false;
        }
        } catch (error) {
        if (error instanceof Error) {
            alert(
            `Something went wrong while getting the Token:\n${error.message}`,
            );
        } else {
            console.error(
            "An unknown error occurred while getting the Token.",
            );
            return false;
        }
        }
    };*/

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
        router.push("/login");
        return;
        }

        const storedId = localStorage.getItem("userId");

        const fetchUser = async () => {
        try {
            const user = await apiService.get<User>(`/users/${id}`);
            setIsCorrectUser(user?.id === storedId) // Check if the current user is the user this profile page is from
            setUser(user);
            console.log("Fetched user:", user);
            usernameForm.setFieldsValue({ username: user.username || "" });
        } catch (error) {
            if (error instanceof Error) {
            alert(`Something went wrong while fetching user:\n${error.message}`);
            } else {
            console.error("An unknown error occurred while fetching user.");
            }
        }
        };

        fetchUser();
    }, [id, usernameForm, apiService, router]);

    const setUsername = async (values: { username: string }) => {
        try {
        const response = await apiService.put(`/users/${id}/username`, {
            username: values.username,
        });
        console.log("Username updated successfully:", response);
        const updatedUserUsername = await apiService.get<User>(`/users/${id}`);
        setUser(updatedUserUsername);
        usernameForm.setFieldsValue({
            username: updatedUserUsername.username || "",
        });
        } catch (error) {
        if (error instanceof Error) {
            alert(
            `Something went wrong while updating the username:\n${error.message}`,
            );
        } else {
            console.error(
            "An unknown error occurred while udating the username.",
            );
        }
        }
    };

    const editProfile = async () => {
        /*const token = checkToken();
        const isAuthorized = await matchingTokens(token);

        if (isAuthorized) {
        setIsEditing(!isEditing);
        } else {
        alert(
            "You are not authorized to edit this profile.",
        );
        }*/
    };

        /*if (isEditing) {
        return (
        <div>
            <Card title="profile page">
            <h1>User Profile</h1>
            <p>ID: {user?.id ?? "user id not available"}</p>
            <p>username: {user?.username ?? "Username not available"}</p>
            <p>online status: {user?.status ?? "Status not available"}</p>
            <p>
                creation date: {user?.creationDate ?? "creation date not available"}
            </p>
            <p>birth date: {user?.birthDate ?? "birth date not available"}</p>
            <p>------------------------------------------</p>

            <Form
                form={birthDateForm}
                name="update birth date"
                size="large"
                variant="outlined"
                onFinish={setBirthDate}
                layout="vertical"
            >
                <Form.Item
                name="birthDate"
                label="Set/Change your birth date (optional)"
                rules={[{ required: false }]}
                >
                <Input placeholder="dd.MM.yyyy" />
                </Form.Item>
                <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="login-button"
                >
                    Set birth date
                </Button>
                </Form.Item>
            </Form>

            <Form
                form={usernameForm}
                name="update username"
                size="large"
                variant="outlined"
                onFinish={setUsername}
                layout="vertical"
            >
                <Form.Item
                name="username"
                label="change your username (optional)"
                rules={[{ required: false }]}
                >
                <Input placeholder="new_username" />
                </Form.Item>
                <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="login-button"
                >
                    Change username
                </Button>
                </Form.Item>
            </Form>

            <p>-----------------------------</p>

            <Button onClick={editProfile} type="primary">
                Edit profile (close)
            </Button>

            <p>-----------------------------</p>

            <Button onClick={() => router.push("/users")} type="primary">
                Back to user overview
            </Button>
            </Card>
        </div>
        );
    }*/ 
    return (
        <div
            className={"profile-background"}
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
            <Card
                style={{
                    width: "95vw", // size
                    height: "95vh",

                    position: "relative",
        
                    background: "black", // visuals
                    border: "none",
                    borderRadius: 98,
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // instead of opacity = 0.66 -> buttons etc. would inherit opacity
        
                    zIndex: 1 // foreground
                }}
                >
                <div // Title: Profile Page
                    style={{
                        marginLeft: "2vw",
                        width: "50vw",
                        height: "12vh",
                        textAlign: "left",
                        color: '#FFD9D9',
                        fontSize: 72,
                        fontFamily: 'Koulen',
                        fontWeight: '400',

                        background: "linear-gradient(90deg, #FFD9D9, #73CBC9)", // color gradient
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {user?.username ?? "Username not available"}
                </div>

                {isCorrectUser && ( // Only show the button if the current user is the correct one
                <Button // Button: Edit Profile
                    className="edit profile"
                    onClick={editProfile}
                    type="primary"
                    htmlType="button"
                    style={{
                    height: "4vh",
                    background: "transparent",
                    borderRadius: 46,
                    
                    marginLeft: "1vw",

                    textAlign: "center",
                    color: "#8A5555",
                    fontSize: "4vh",
                    fontFamily: "Karantina",
                    fontWeight: "700",

                    boxShadow: "none",
                    }}
                    >
                    <span
                    style={{
                        background: "linear-gradient(90deg, #FFD9D9,rgb(181, 205, 204))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",

                        WebkitTextStrokeWidth: "0.5px",
                        WebkitTextStrokeColor: "#000000",
                    }}
                    >
                    Edit Profile
                    </span>
                </Button>
                )}

                <Button // Button: Back to dashboard
                    onClick={() => router.push("/dashboard")}
                    type="primary"
                    htmlType="button"
                    style={{
                    width: "10vw",
                    height: "6vh",
                    background: "black",
                    borderRadius: 46,
                    
                    position: "absolute",
                    left: "4vw",
                    top: "84vh",

                    textAlign: "center",
                    color: "#8A5555",
                    fontSize: "20px",
                    fontFamily: "Karantina",
                    fontWeight: "700",

                    boxShadow: '0px 0px 40px 12px rgba(255, 0, 0, 0.25)',
                    }}
                    >
                    <span
                    style={{
                        background: "linear-gradient(90deg, #8A5555, #FFFFFF)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",

                        WebkitTextStrokeWidth: "1px",
                        WebkitTextStrokeColor: "#000000",
                    }}
                    >
                    Back to Dashboard
                    </span>
                </Button>
            </Card>
        </div>
    );
};

export default UserProfile;
"use client";

import React, { useEffect, useState } from "react";

import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import { Button, Card, Input, Modal } from "antd";
import { useRouter } from "next/navigation";

interface Exoplanet {
    id: string;
    planetName: string;
    ownerId: string;
    earthSimilarityIndex: string,
  }

const UserProfile = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params);
    const [user, setUser] = useState<User | null>(null);
    const apiService = useApi();
    const [thisUsername, setThisUsername] = useState("");
    const router = useRouter();
    const [isCorrectUser, setIsCorrectUser] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState(user?.username || "");
    const [exoplanets, setExoplanets] = useState<Exoplanet[]>([]);

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

                if (user.id) { // Only strings and no null value is passed to getMyExoplanets()
                    getMyExoplanets(user?.id); // Has to be called here to make sure it is executed AFTER the user is already fetched
                }

                setThisUsername( user.username || "" );
            } catch (error) {
                if (error instanceof Error) {
                alert(`Something went wrong while fetching user:\n${error.message}`);
                } else {
                console.error("An unknown error occurred while fetching user.");
                }
            }
        };

        const fetchExoplanets = async (): Promise<Exoplanet[]> => {
            try {
              const planets = await apiService.get<Exoplanet[]>("/exoplanets");
              console.log("Fetched exoplanets:", planets);
              return planets;
            } catch (error) {
              if (error instanceof Error) {
                alert(`Something went wrong while fetching the exoplanets:\n${error.message}`);
                return [];
              } else {
                console.error("Unknown error while fetching the exoplanets.");
                return [];
              }
            }
        };

        const getMyExoplanets = async (userId: string) => {
            const exoplanets = await fetchExoplanets();
            const myExoplanets: Exoplanet[] = [];
            if (exoplanets.length === 0) {
                setExoplanets([]);
                return;
            }
            for (let i = 0; i < exoplanets.length; i++) {
                const thisExoplanet = exoplanets[i];
                const thisExoplanetOwner = thisExoplanet.ownerId;
                if (thisExoplanetOwner == userId) {
                    myExoplanets.push(thisExoplanet);
                }
            }
            /*const exoplanets1 = exoplanets.length // Simulating additional exoplanets to test behaviour
            ? exoplanets
            : Array.from({ length: 20 }, (_, i) => ({
                id: `dummy-${i}`,
                planetName: `FakePlanet ${i + 1}`,
                ownerId: "test-user",
                }));*/
            setExoplanets(myExoplanets);// exoplanets1
        }

        fetchUser();
    }, [id, thisUsername, apiService, router]);

    const setUsername = async () => {
        try {
        const response = await apiService.put(`/users/${id}/username`, {
            username: newUsername,
        });
        console.log("Username updated successfully:", response);
        const updatedUserUsername = await apiService.get<User>(`/users/${id}`);
        setUser(updatedUserUsername);
        setThisUsername(
            updatedUserUsername.username || "",
        );
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

    const editProfile = () => {setIsEditing(true);};
    const handleSubmit = () => {
        setUsername();
        console.log("Successfully changed username to:", newUsername);
        setIsEditing(false);
      };
      const handleCancel = () => setIsEditing(false);

    return (
        <div
            className={"profile-background"}
            style={{
                position: "relative",
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
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
        
                    zIndex: 1 // before background but behind nested card and contents
                }}
                >

                <div // Title: Profile Page
                    style={{
                        position: "absolute",
                        left: "4vw",
                        top: "4vh",
                        width: "60vw",
                        height: "12vh",

                        textAlign: "left",
                        color: '#FFD9D9',
                        fontSize: "10vh",
                        fontFamily: 'Koulen',
                        fontWeight: '400',

                        background: "linear-gradient(90deg, #FFD9D9,rgb(0, 180, 180))", // Had to make right color much stronger to avoid having only white text when the username is short
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
                        position: "absolute",
                        left: "4vw",
                        top: "2vh",
                        width: "9vw",
                        height: "6vh",
                        padding: "0vw", // Makes the text align with the left edge of the button (avoids default padding of Buttons)
                        background: "transparent",

                        textAlign: "left",
                        color: "#8A5555",
                        fontSize: "4vh",
                        fontFamily: "Karantina",
                        fontWeight: "700",

                        boxShadow: "none",
                    }}
                    >
                    <span
                    style={{
                        display: "inline-block",
                        width: "100%",
                        textAlign: "left",

                        background: "linear-gradient(90deg, #FFD9D9,rgb(181, 205, 204))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                    >
                        Edit Username
                    </span>
                </Button>
                )}

                <div // creation date
                    style={{
                        position: "absolute",
                        right: "4vw",
                        top: "4vh",
                        width: "24vw",
                        height: "12vh",

                        textAlign: "right",
                        color: '#FFD9D9',
                        fontSize: "10vh",
                        fontFamily: 'Koulen',
                        fontWeight: '400',

                        background: "linear-gradient(90deg, #FFD9D9, #73CBC9)", // color gradient
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",

                        WebkitTextStrokeWidth: "0.5px",
                        WebkitTextStrokeColor: "#000000",
                    }}
                >
                    {user?.creation_date &&
                        `${user.creation_date.substring(0,10)}`
                    }
                </div>

                <div
                    style={{ // created on
                        position: "absolute",
                        right: "4vw",
                        top: "2vh",
                        width: "24vw", // keep it the same as the creationDate below it to have the same color gradient
                        height: "6vh",

                        textAlign: "right",
                        color: "#8A5555",
                        fontSize: "4vh",
                        fontFamily: "Karantina",
                        fontWeight: "700",

                        background: "linear-gradient(90deg, #FFD9D9, #73CBC9)", // color gradient
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    created on
                </div>

                <Card
                    style={{
                        width: "92vw", // size
                        height: "68vh",
                        
                        top: "14vh",
                        position: "relative",
            
                        background: "black", // visuals
                        border: "none",
                        borderRadius: 98,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",

                        display: "flex",
                        flexDirection: "column",
                        //overflow: "hidden", // needed for scrolling functionality
            
                        zIndex: 2 // foreground
                }}
                >
                    <div
                        style={{
                            textAlign: "center",
                            fontSize: "4vh",
                            fontFamily: "Karantina",
                            fontWeight: "700",

                            background: "linear-gradient(90deg, #FFD9D9, #73CBC9)", // color gradient
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Discovered exoplanets and their earth similarity index
                    </div>

                    <div
                        style={{
                            minHeight: 0,
                            flex: 1,
                            maxHeight: "100%",
                            overflowY: "auto",
                            padding: "2rem",
                            display: "flex",
                            gap: "1rem",
                          }}
                        >
                        {[0, 1].map(columnIndex => (
                            <div
                                key={columnIndex}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "1rem",
                                    flex: 1
                                }}
                            >
                                {exoplanets
                                    .filter((_, i) => i % 2 === columnIndex)
                                    .map((exoplanet) => (
                                    <Button
                                        key={exoplanet.id}
                                        className="Go to Exoplanet"
                                        onClick={() => router.push(`/exoplanets/${exoplanet.id}`)}
                                        type="primary"
                                        htmlType="button"
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(60, 60, 60, 0.8)"}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(0, 0, 0)"}
                                        style={{
                                            background: "rgb(0, 0, 0)",
                                            border: "none",
                                            boxShadow: "none",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            width: "100%", 
                                            height: "8vh",
                                            transition: "background-color 0.4s ease",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontFamily: "Jura",
                                                fontSize: "28px",
                                                background: "linear-gradient(90deg, #73CBC9, #FFD9D9)", // color gradient
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                            }}
                                        >
                                            {exoplanet.planetName}
                                        </span>
                                        <span
                                            style={{
                                                fontFamily: "Jura",
                                                fontSize: "28px",
                                                background: "linear-gradient(90deg, #73CBC9, #FFD9D9)", // color gradient
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                            }}
                                        >
                                            {(Number(exoplanet.earthSimilarityIndex) * 100).toFixed(1)} %
                                        </span>
                                    </Button>
                                ))}
                            </div>
                        ))}
                    </div>
                </Card>

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
                    top: "87vh",

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

            <Modal
                title={
                    <span
                        style={{
                            fontFamily: "Karantina",
                            fontSize: "40px",
                            WebkitTextStrokeWidth: "0.5px",
                            WebkitTextStrokeColor: "#000000",
                            background: "linear-gradient(90deg, #73CBC9, #FFD9D9)", // color gradient
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Edit Username
                      </span>
                }

                open={isEditing}
                onOk={handleSubmit}
                onCancel={handleCancel}
                
                okText="Save"
                okButtonProps={{
                    style: {
                      fontFamily: "Jura",
                      fontSize: "18px",
                      background: "linear-gradient(90deg, #73CBC9,rgb(40, 76, 75))",
                      border: "black",
                    }
                  }}

                  cancelText="Cancel"
                  cancelButtonProps={{
                    style: {
                      fontFamily: "Jura",
                      fontSize: "18px",
                      color: "black", // This prevents the font from turning green when hovering over it
                      background: "linear-gradient(90deg,rgb(216, 150, 150), #8A5555)",
                      border: "black",
                    }
                  }}
            >
                <Input
                    value={newUsername}
                    onChange={(inputString) => setNewUsername(inputString.target.value)}
                    placeholder="Enter your new username"
                    className="change-username"
                    style={{
                        fontFamily: "Jura",
                        fontSize: "18px",
                    }}
                />
            </Modal>
        </div>
    );
};

export default UserProfile;
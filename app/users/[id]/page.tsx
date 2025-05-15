"use client";

import React, { useEffect, useState } from "react";

import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import { Button, Card, Input, Modal } from "antd";
import { useRouter } from "next/navigation";
import { FaTrashAlt } from "react-icons/fa";
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface Exoplanet {
    id: string;
    planetName: string;
    ownerId: string;
    earthSimilarityIndex: string,
  }

const { useModal } = Modal;

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
    const [changedExoplanets, setChangedExoplanets] = useState(0);
    const [modal, contextHolder] = useModal();
    
    const [currentPage, setCurrentPage] = useState(0);
    const buttonsPerPage = 10;
    const pagedButtons = exoplanets.slice(
    currentPage * buttonsPerPage,
    (currentPage + 1) * buttonsPerPage
    );
    const totalPages = Math.ceil(exoplanets.length / buttonsPerPage);

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
    }, [id, thisUsername, apiService, router, changedExoplanets]);

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

    const deleteExoplanet = async (exoplanetId: string, exoplanetName: string) => {

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
          setChangedExoplanets(changedExoplanets + 1); // refreshes page (through useEffect()) when deleting an exoplanet
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
    }

    const isOwner = (exoplanetOwnerId: string) => {
        const userId = localStorage.getItem("userId");
        return (userId == exoplanetOwnerId);
    }

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
                        width: "110%",
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

                    {exoplanets.length === 0 && (
                    <div
                        style={{
                            textAlign: "center",
                            marginTop: "20vh",

                            fontFamily: "Jura",
                            fontSize: "28px",
                            background: "linear-gradient(90deg, #FFD9D9, #73CBC9)", // color gradient
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        This user has not discovered any Exoplanets yet!
                    </div>
                    )}

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
                        {contextHolder}
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
                                {pagedButtons
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
                                            padding: 0, // makes sure delete button is at the very right
                                        }}
                                    >
                                        <div // left part of the button (redirect to Exoplanet profile page)
                                            style={{
                                                display: "flex",
                                                flex: 5,
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                padding: "0 1rem",
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
                                        </div>

                                        {isOwner(exoplanet.ownerId) && ( // delete button only if user is the owner
                                        <div // right part of the button (delete Exoplanet)
                                            style={{
                                                borderRadius: 8, // ensures background red does not go over the button itself
                                                flex: 1,
                                                height: "100%",
                                                backgroundColor: "rgba(255, 0, 0, 0.16)",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                cursor: "pointer",
                                                color: "rgb(244, 244, 244)",
                                                }}
                                                onClick={(e) => {
                                                e.stopPropagation(); // stops redirecting user when clicking on trash bin
                                                deleteExoplanet(exoplanet.id, exoplanet.planetName);
                                                }}
                                        >
                                            {<FaTrashAlt />}
                                        </div>
                                        )}
                                    </Button>
                                ))}
                            </div>
                        ))}
                    </div>

                    {exoplanets.length !== 0 && ( // Disabled if there are no discovered exoplanets by this user
                    <div // Different pages for many discovered Exoplanets -> Show 10 buttons on each page
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "1vw",
                            position: "absolute",
                            top: "70vh",
                            }}
                        >
                        <Button
                            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                            style={{
                                background: "#FFD9D9",
                                color: "black",
                                border: "none",
                                fontFamily: "Jura",
                            }}
                        >
                            Previous
                        </Button>
                        <span
                        style={{
                            color: "white",
                            fontFamily: "Jura",
                            fontSize: "18px"
                            }}>
                            Page {currentPage + 1} of {totalPages}
                        </span>
                        <Button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={currentPage >= totalPages - 1}
                            style={{
                                background: "#73CBC9",
                                color: "black",
                                border: "none",
                                fontFamily: "Jura",
                            }}
                        >
                            Next
                        </Button>
                    </div>
                    )}
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
                    zIndex: 2,
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
                <Button // Button: Go to Users Page
                    onClick={() => router.push("/users")}
                    type="primary"
                    htmlType="button"
                    style={{
                        width: "10vw",
                        height: "6vh",
                        background: "black",
                        borderRadius: 46,

                        position: "absolute",
                        right: "4vw", // now on the right side
                        top: "87vh",  // same vertical alignment as the other button

                        textAlign: "center",
                        color: "#8A5555",
                        fontSize: "20px",
                        fontFamily: "Karantina",
                        fontWeight: "700",

                        boxShadow: "0px 0px 40px 12px rgba(0, 255, 255, 0.25)", // cyan glow
                        zIndex: 2,
                    }}
                    >
                    <span
                        style={{
                        background: "linear-gradient(90deg, #73CBC9, #FFFFFF)", // matching the theme
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",

                        WebkitTextStrokeWidth: "1px",
                        WebkitTextStrokeColor: "#000000",
                        }}
                    >
                        Users Page
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
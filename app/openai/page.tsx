"use client";

import { useEffect, useRef, useState } from "react";
import {
  Input,
  Button,
  Spin,
  Modal,
  Select,
  message as antdMessage,
} from "antd";
import {
  SendOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useApi } from "@/hooks/useApi";

const { Option } = Select;

interface Message {
  role: "user" | "assistant";
  content: string;
  senderName?: string;
}

interface Group {
  id: string;
  name: string;
  userIds: string[];
  createdAt: string;
}

interface User {
  id: string;
  username: string;
}

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newGroupUserIds, setNewGroupUserIds] = useState<string[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const apiService = useApi();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) return;
    setUserId(storedUserId);

    const fetchInitialData = async () => {
      try {
        const userData = await apiService.get<{ username: string }>(
          `/users/${storedUserId}`
        );
        setUsername(userData.username);

        const allUsers = await apiService.get<User[]>(`/users`);
        setUsers(allUsers);

        const userGroups = await apiService.get<Group[]>(
          `/openai/chat/groups/${storedUserId}`
        );
        setGroups(userGroups);
      } catch (err) {
        console.error("Error loading initial data", err);
      }
    };

    fetchInitialData();
  }, [apiService]);

  const loadMessagesForGroup = async (groupId: string) => {
    try {
      setSelectedGroupId(groupId);
      const chatData = await apiService.get<Message[]>(
        `/openai/chat/history/${groupId}`
      );
      setMessages(chatData);
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !userId || !username || !selectedGroupId) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, { ...userMessage, senderName: username }]);
    setInput("");
    setLoading(true);

    try {
      const data = await apiService.post<{ reply: string }>(`/openai/chat`, {
        userId,
        username,
        groupId: selectedGroupId,
        messages: [userMessage],
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error sending message", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!userId || !newGroupName.trim()) return;
    const groupData = {
      name: newGroupName,
      userIds: [userId, ...newGroupUserIds.filter((id) => id !== userId)],
    };

    try {
      const newGroup = await apiService.post<Group>(
        `/openai/chat/group`,
        groupData
      );
      setGroups((prev) => [...prev, newGroup]);
      setIsModalVisible(false);
      setNewGroupName("");
      setNewGroupUserIds([]);
    } catch (err) {
      console.error("Error creating group", err);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await apiService.delete(`/openai/chat/group/${groupId}`);
      setGroups(groups.filter((g) => g.id !== groupId));
      if (selectedGroupId === groupId) {
        setMessages([]);
        setSelectedGroupId(null);
      }
      antdMessage.success("Group deleted successfully");
    } catch (err) {
      console.error("Error deleting group", err);
    }
  };

  return (
    <div className="chat-background" style={{ height: "100vh", position: "relative", overflow: "hidden" }}>
      <div className="chat-container" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <h1 className="chat-title">Exoplanet AI Assistant</h1>

        <div
          style={{
            display: "flex",
            flex: 1,
            overflow: "hidden",
            height: "calc(100% - 70px)",
          }}
        >
          <div
            style={{
              width: 300,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              borderRadius: 30,
              padding: 20,
              marginRight: 20,
              overflowY: "auto",
            }}
          >
            <Button
              icon={<PlusOutlined />}
              style={{
                width: "100%",
                marginBottom: 16,
                backgroundColor: "#000",
                color: "#89e0dc",
                fontWeight: 600,
                borderRadius: 20,
                border: "none",
                boxShadow: "0 0 6px rgba(0,0,0,0.5)",
              }}
              onClick={() => setIsModalVisible(true)}
            >
              New Group Conversation
            </Button>

            {groups.map((group) => {
              const groupUsers = users.filter((u) =>
                group.userIds.includes(u.id)
              );
              return (
                <div
                  key={group.id}
                  onClick={() => loadMessagesForGroup(group.id)}
                  style={{
                    backgroundColor: "#000",
                    borderRadius: 20,
                    marginBottom: 12,
                    padding: "10px 14px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.6)",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#89e0dc", fontWeight: 600, fontSize: 16 }}>
                      {group.name}
                    </div>
                    <div style={{ color: "white", fontSize: 12, opacity: 0.8 }}>
                      {groupUsers.map((u) => u.username).join(", ")}
                    </div>
                  </div>
                  <DeleteOutlined
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGroup(group.id);
                    }}
                    style={{
                      color: "white",
                      backgroundColor: "#330000",
                      padding: 8,
                      borderRadius: 10,
                      fontSize: 16,
                      marginLeft: 12,
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div className="chat-section" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.role}`}>
                  <strong>
                    {msg.role === "user"
                      ? msg.senderName ?? "User"
                      : "AI Assistant"}
                    :
                  </strong>{" "}
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div className="loading">
                  <Spin />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
              <Input
                className="input-box"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPressEnter={sendMessage}
                placeholder="Type your message..."
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={sendMessage}
                className="send-button"
              />
            </div>
          </div>
        </div>

        <Modal
          title={
            <span style={{ fontFamily: "Jura", fontSize: 24 }}>
              Create New Group
            </span>
          }
          open={isModalVisible}
          onOk={handleCreateGroup}
          onCancel={() => setIsModalVisible(false)}
          okButtonProps={{
            style: {
              backgroundColor: "rgba(32, 40, 181, 0.95)",
              border: "none",
            },
          }}
        >
          <Input
            placeholder="Group Name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            style={{ marginBottom: 12, borderRadius: 20, padding: 10 }}
          />
          <Select
            mode="multiple"
            placeholder="Select users (Optional)"
            value={newGroupUserIds}
            onChange={(val) => setNewGroupUserIds(val)}
            style={{ width: "100%" }}
            dropdownStyle={{ backgroundColor: "#1a1a1a", color: "white" }}
            className="white-placeholder"
          >
            {users.map((u) => (
              <Option key={u.id} value={u.id} style={{ color: "white" }}>
                {u.username}
              </Option>
            ))}
          </Select>

        </Modal>

        {/* Dashboard button */}
        <Button
          className="dashboard-button"
          onClick={() => (window.location.href = "/dashboard")}
        >
          <span className="dashboard-text">Back to Dashboard</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatAssistant;

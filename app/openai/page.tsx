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
  const [aiEnabledGroups, setAiEnabledGroups] = useState<{ [groupId: string]: boolean }>({});
  const messagesEndRef = useRef<HTMLDivElement | null>(null);


  const apiService = useApi();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) return;
    setUserId(storedUserId);

    const fetchInitialData = async () => {
      try {
        const userData = await apiService.get<{ username: string }>(`/users/${storedUserId}`);
        setUsername(userData.username);

        const allUsers = await apiService.get<User[]>(`/users`);
        setUsers(allUsers);

        const userGroups = await apiService.get<Group[]>(`/openai/chat/groups/${storedUserId}`);
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
      const chatData = await apiService.get<Message[]>(`/openai/chat/history/${groupId}`);
      setMessages(chatData);
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const toggleAI = async () => {
  if (!selectedGroupId || !userId || !username) return;

  const isActive = aiEnabledGroups[selectedGroupId];


  if (!isActive) {
    const alreadyExists = messages.some(
      (msg) =>
        msg.role === "assistant" &&
        msg.content === "Hello, I am an exoplanet expert, please ask me your questions!"
    );

    if (!alreadyExists) {
      const assistantIntro: Message = {
        role: "assistant",
        content: "Hello, I am an exoplanet expert, please ask me your questions!",
      };

      setMessages((prev) => [...prev, assistantIntro]);

      try {
        await apiService.post(`/openai/chat`, {
          userId,
          username,
          groupId: selectedGroupId,
          messages: [assistantIntro],
          aiEnabled: false,
        });
      } catch (err) {
        console.error("Error saving assistant intro message", err);
      }
    }
  }

  setAiEnabledGroups((prev) => ({
    ...prev,
    [selectedGroupId]: !isActive,
  }));
};





  const sendMessage = async () => {
    if (!input.trim() || !userId || !username || !selectedGroupId) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, { ...userMessage, senderName: username }]);
    setInput("");

    const aiEnabled = aiEnabledGroups[selectedGroupId];

    setLoading(true);
    try {
      const data = await apiService.post<{ reply?: string }>(`/openai/chat`, {
        userId,
        username,
        groupId: selectedGroupId,
        messages: [userMessage],
        aiEnabled,
      });

      if (aiEnabled && data.reply) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.reply,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
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
      const newGroup = await apiService.post<Group>(`/openai/chat/group`, groupData);
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
      <h1 className="chat-title">AI Exoplanet Assistant and Collaborative Chat</h1>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "calc(100% - 70px)" }}>
        <div style={{ width: 300, backgroundColor: "rgba(0, 0, 0, 0.3)", borderRadius: 30, padding: 20, marginRight: 20, overflowY: "auto" }}>
          <Button
            icon={<PlusOutlined />}
            style={{ width: "100%", marginBottom: 16, backgroundColor: "#000", color: "#89e0dc", fontWeight: 600, borderRadius: 20, border: "none", boxShadow: "0 0 6px rgba(0,0,0,0.5)" }}
            onClick={() => setIsModalVisible(true)}
          >
            New Group Conversation
          </Button>

          {groups.map((group) => {
            const isSelected = selectedGroupId === group.id;
            const groupUsers = users.filter((u) => group.userIds.includes(u.id));
            return (
              <div
                key={group.id}
                onClick={() => loadMessagesForGroup(group.id)}
                style={{
                  backgroundColor: isSelected ? "#89e0dc" : "#000",
                  color: isSelected ? "#000" : "white",
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
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{group.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{groupUsers.map((u) => u.username).join(", ")}</div>
                </div>
                <DeleteOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteGroup(group.id);
                  }}
                  style={{ color: isSelected ? "#000" : "white", backgroundColor: "#330000", padding: 8, borderRadius: 10, fontSize: 16, marginLeft: 12 }}
                />
              </div>
            );
          })}
        </div>

        <div className="chat-section" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {selectedGroupId && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ color: "#89e0dc", fontSize: 20, fontWeight: 700 }}>
                {groups.find((g) => g.id === selectedGroupId)?.name}
              </div>
              <Button
                onClick={toggleAI}
                style={{
                  backgroundColor: aiEnabledGroups[selectedGroupId] ? "#3f3a82" : "#444",
                  color: "white",
                  border: "none",
                  borderRadius: 20,
                  fontWeight: 600,
                  boxShadow: "0 0 8px rgba(0,0,0,0.4)",
                }}
              >
                {aiEnabledGroups[selectedGroupId] ? "Deactivate AI" : "Activate AI"}
              </Button>
            </div>
          )}

          {selectedGroupId ? (
            <>
              <div className="chat-messages">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.role}`}>
                    <strong>{msg.role === "user" ? msg.senderName ?? "User" : "AI Assistant"}:</strong> {msg.content}
                  </div>
                ))}
                {loading && <div className="loading"><Spin /></div>}
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
            </>
          ) : (
            <div
  style={{
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 30,
    padding: 40,
    margin: 10,
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflowY: "auto",
  }}
>
  <div style={{ maxWidth: 700, lineHeight: 1.7, opacity: 0.85,  marginTop: 30 }}>
    <h3 style={{ color: "#89e0dc", marginBottom: 16 }}>
      Welcome to the <em>AI Exoplanet Assistant and Collaborative Chat</em> section!
    </h3>
    <p>
      To get started, please select a <strong>Group Conversation</strong> from the menu on the left, or create a new one by clicking
      <strong> +New Group Conversation</strong>.
    </p>
    <p>
      You can chat with other users to share knowledge and insights. You can also enable or disable the expert AI Assistant on exoplanets by clicking the
      <strong>&quot;Activate AI&quot;</strong> or <strong>&quot;Deactivate AI&quot;</strong> button that you will find in the Group Conversation. Once the assistant is activated, you can ask it questions—other members of the group will be able to see both your questions and the AI’s answers.
    </p>

    <h3 style={{ color: "#89e0dc", marginTop: 24 }}>How to create a Group Conversation:</h3>
    <ul style={{ paddingLeft: 20, marginTop: 8 }}>
      <li>Click on <strong>+New Group Conversation</strong>.</li>
      <li>Enter a group name and select the users you want to invite. A notification will be sent to let them know.</li>
      <li><em>Note: If you don’t select any users, you can still create a group for yourself and use the AI Assistant on your own!</em></li>
      <li>Select the group in the menu and start exchanging ideas!</li>
    </ul>

    <p style={{ marginTop: 24 }}>
      <strong>Note:</strong> The AI Exoplanet Assistant only responds to questions related to <em>exoplanets, astrophysics, and cosmology</em>.
      It is designed to help clarify theoretical questions and does not have access to rankings or specific exoplanet data analyzed on this platform.
    </p>

    <p style={{ marginTop: 16 }}>
      This chat aims to foster collaboration in exoplanet research and promote open knowledge-sharing within the scientific community.
    </p>
  </div>
</div>


          )}
        </div>
      </div>

      <Modal
        title={<span style={{ fontFamily: "Jura", fontSize: 24, color: "#89e0dc" }}>Create New Group</span>}
        open={isModalVisible}
        onOk={handleCreateGroup}
        onCancel={() => setIsModalVisible(false)}
        okButtonProps={{
          style: {
            backgroundColor: "rgba(32, 40, 181, 0.95)",
            border: "none",
            fontWeight: 600,
            borderRadius: 20,
          },
        }}
        bodyStyle={{
          maxHeight: "400px",
          overflowY: "auto",
          padding: 16,
          backgroundColor: "rgba(20, 20, 40, 0.8)",
          borderRadius: 20,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input
            placeholder="Group Name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            style={{
              borderRadius: 20,
              padding: "10px 16px",
              fontSize: 16,
              backgroundColor: "#1e1e2f",
              color: "white",
              border: "none",
            }}
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
        </div>
      </Modal>
    </div>

    {/* BACK TO DASHBOARD */}
    <Button
      onClick={() => (window.location.href = "/dashboard")}
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        backgroundColor: "#3f3a82",
        color: "white",
        border: "none",
        borderRadius: 20,
        fontWeight: 600,
        padding: "8px 20px",
        boxShadow: "0 0 8px rgba(0, 0, 0, 0.4)",
        zIndex: 999,
      }}
    >
      Back to Dashboard
    </Button>
  </div>
);

};

export default ChatAssistant;


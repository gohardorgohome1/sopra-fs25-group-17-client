"use client";

import { useEffect, useRef, useState } from "react";
import { Input, Button, Spin } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useApi } from "@/hooks/useApi"; 

interface Message {
  role: "user" | "assistant";
  content: string;
  senderName?: string;
}

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const apiService = useApi(); 

  useEffect(() => {
    const fetchData = async () => {
      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) return;
      setUserId(storedUserId);

      try {
       
        const userData = await apiService.get<{ username: string }>(`/users/${storedUserId}`);
        setUsername(userData.username);

        const chatData = await apiService.get<Message[]>(`/openai/chat/history`);

        const loadedMessages = chatData.map((msg) => ({
          role: msg.role,
          content: msg.content,
          senderName: msg.senderName,
        }));

        setMessages(loadedMessages);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [apiService]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    console.log("sending message");

    console.log("input:", input);
    console.log("userId:", userId);
    console.log("username:", username);

    if (!input.trim() || !userId || !username) {
      console.log("Missing input/userId/username");
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, { ...userMessage, senderName: username }]);
    setInput("");
    setLoading(true);

    try {

      const data = await apiService.post<{ reply: string }>(`/openai/chat`, {
        userId,
        username,
        messages: [userMessage],
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error: could not reach backend or OpenAI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-background">
      <div className="black-overlay">
        <h1 className="chat-title">Exoplanet AI Assistant</h1>
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={msg.role === "user" ? "message user" : "message assistant"}
              >
                <strong>
                  {msg.role === "user" ? msg.senderName ?? "User" : "AI Assistant"}:
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
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              placeholder="Type your message..."
              className="input-box"
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={sendMessage}
              className="send-button"
            />
          </div>
        </div>

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

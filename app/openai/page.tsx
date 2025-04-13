"use client";

import { useEffect, useRef, useState } from "react";
import { Input, Button, Spin } from "antd";
import { SendOutlined } from "@ant-design/icons";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/openai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await res.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error calling backend:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error: could not reach the backend or OpenAI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-background">
      <div className="black-overlay">
        <h1 className="chat-title">Generative AI Assistant</h1>
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={msg.role === "user" ? "message user" : "message assistant"}
              >
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
              onPressEnter={sendMessage}
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
      </div>
    </div>
  );
};

export default ChatAssistant;

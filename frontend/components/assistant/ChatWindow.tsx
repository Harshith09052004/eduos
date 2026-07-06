"use client";

import { useState, useRef, useEffect } from "react";
import { Trash2 } from "lucide-react";

import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import SuggestedPrompts from "./SuggestedPrompts";
import { sendChatMessage } from "@/services/assistant";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Hello! I'm EduOS AI Assistant.\n\nAsk me anything about Students, Faculty, Attendance, Departments or Placements.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: "user", content: text };
    const assistantMessage: Message = { role: "assistant", content: "" };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setLoading(true);

    const assistantIdx = messages.length + 1;

    try {
      const response = await sendChatMessage(text);
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[assistantIdx] = {
            role: "assistant",
            content: "Error: Could not read response stream.",
          };
          return updated;
        });
        setLoading(false);
        return;
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.token) {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[assistantIdx] = {
                    role: "assistant",
                    content: (updated[assistantIdx]?.content || "") + data.token,
                  };
                  return updated;
                });
              }
              if (data.done) {
                setLoading(false);
              }
            } catch {
              // ignore parse errors for partial chunks
            }
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[assistantIdx] = {
          role: "assistant",
          content: "Error: Failed to connect to the AI service. Make sure the backend server is running.",
        };
        return updated;
      });
      setLoading(false);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "👋 Hello! I'm EduOS AI Assistant.\n\nAsk me anything about Students, Faculty, Attendance, Departments or Placements.",
      },
    ]);
  };

  return (
    <div className="flex h-[85vh] w-full flex-col rounded-xl bg-white shadow">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <h1 className="text-2xl font-bold">EduOS AI Assistant</h1>
          <p className="text-sm text-slate-500">
            Your intelligent college assistant.
          </p>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 transition hover:border-red-400 hover:text-red-600"
          title="Clear chat"
        >
          <Trash2 size={16} />
          Clear
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {messages.map((msg, index) => (
          <MessageBubble key={index} role={msg.role} content={msg.content} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && !loading && (
        <SuggestedPrompts onSelect={handleSuggestedPrompt} />
      )}

      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
}

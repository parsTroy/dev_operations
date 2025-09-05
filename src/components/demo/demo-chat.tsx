"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Send, MessageCircle, Users } from "lucide-react";

interface DemoMessage {
  id: string;
  content: string;
  user: { name: string };
  createdAt: Date;
  userId: string;
}

interface DemoChatProps {
  messages: DemoMessage[];
  memberCount: number;
}

export function DemoChat({ messages, memberCount }: DemoChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const formatMessage = (content: string) => {
    return content.replace(/@(\w+)/g, '<span class="text-blue-600 font-medium">@$1</span>');
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Project Chat</h3>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users className="h-3 w-3" />
            <span>{memberCount}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="h-6 w-6 p-0"
        >
          ×
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.userId === "user-1" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.userId === "user-1"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                  {msg.user.name.charAt(0)}
                </div>
                <span className="text-xs font-medium">
                  {msg.user.name}
                </span>
                <span className="text-xs opacity-70">
                  {msg.createdAt.toLocaleTimeString()}
                </span>
              </div>
              <div
                className="text-sm"
                dangerouslySetInnerHTML={{
                  __html: formatMessage(msg.content),
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message... (use @username to mention)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            disabled
          />
          <Button
            disabled
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Demo mode - Sign up to start chatting!
        </p>
      </div>
    </div>
  );
}

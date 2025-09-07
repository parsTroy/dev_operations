"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { usePusher } from "~/hooks/use-pusher";
import { Button } from "~/components/ui/button";
import { Send, MessageCircle, Users } from "lucide-react";
import { MentionAutocomplete } from "./mention-autocomplete";

interface ChatWindowProps {
  projectId: string;
}

export function ChatWindow({ projectId }: ChatWindowProps) {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);
  const [showMentionAutocomplete, setShowMentionAutocomplete] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [cursorPosition, setCursorPosition] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pusher = usePusher();

  const { data: messages, isLoading } = api.chat.getMessages.useQuery({ projectId });
  const { data: members } = api.chat.getProjectMembers.useQuery({ projectId });

  const utils = api.useUtils();
  const sendMessage = api.chat.sendMessage.useMutation({
    onSuccess: async () => {
      await utils.chat.getMessages.invalidate({ projectId });
      setMessage("");
    },
  });

  // Track last message ID when messages load
  useEffect(() => {
    if (messages && messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      if (latestMessage && latestMessage.id !== lastMessageId) {
        setLastMessageId(latestMessage.id);
        // If chat is closed and this is a new message from someone else, increment unread count
        if (!isOpen && latestMessage.userId !== session?.user?.id) {
          setUnreadCount(prev => prev + 1);
        }
      }
    }
  }, [messages, lastMessageId, isOpen, session?.user?.id]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!pusher) return;

    const channel = pusher.subscribe(`project-${projectId}`);
    
    channel.bind("new-message", (data: { userId: string }) => {
      utils.chat.getMessages.invalidate({ projectId });
      // If chat is closed and message is from someone else, increment unread count
      if (!isOpen && data.userId !== session?.user?.id) {
        setUnreadCount(prev => prev + 1);
      }
    });

    return () => {
      pusher.unsubscribe(`project-${projectId}`);
    };
  }, [pusher, projectId, utils.chat, isOpen, session?.user?.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sendMessage.isPending) return;

    await sendMessage.mutateAsync({
      content: message.trim(),
      projectId,
    });
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    setUnreadCount(0); // Clear unread count when chat is opened
  };

  // Handle mention autocomplete
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart || 0;
    setMessage(value);
    setCursorPosition(cursorPos);

    // Check for @mention - improved regex to catch more cases
    const textBeforeCursor = value.substring(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@([a-zA-Z0-9_]*)$/);
    
    if (mentionMatch) {
      const query = mentionMatch[1] || "";
      setMentionQuery(query);
      
      // Filter members based on query
      const filteredMembers = members?.filter(member => {
        const name = member.user.name?.toLowerCase() || "";
        const email = member.user.email?.toLowerCase() || "";
        return name.includes(query.toLowerCase()) || email.includes(query.toLowerCase());
      }) || [];

      if (filteredMembers.length > 0) {
        setShowMentionAutocomplete(true);
        // Position the autocomplete dropdown
        if (inputRef.current) {
          const rect = inputRef.current.getBoundingClientRect();
          setMentionPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
          });
        }
      } else {
        setShowMentionAutocomplete(false);
      }
    } else {
      setShowMentionAutocomplete(false);
    }
  };

  const handleMentionSelect = (username: string) => {
    const textBeforeCursor = message.substring(0, cursorPosition);
    const textAfterCursor = message.substring(cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    
    if (mentionMatch) {
      const beforeMention = textBeforeCursor.substring(0, mentionMatch.index);
      const newMessage = beforeMention + `@${username} ` + textAfterCursor;
      setMessage(newMessage);
      
      // Set cursor position after the mention
      const newCursorPos = beforeMention.length + username.length + 2;
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
    
    setShowMentionAutocomplete(false);
    setMentionQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showMentionAutocomplete && (e.key === "Escape" || e.key === "Tab")) {
      e.preventDefault();
      setShowMentionAutocomplete(false);
      setMentionQuery("");
    }
  };

  const formatMessage = (content: string) => {
    // Simple mention highlighting
    return content.replace(/@(\w+)/g, '<span class="text-blue-600 font-medium">@$1</span>');
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={handleOpenChat}
          className="rounded-full h-14 w-14 shadow-lg relative"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          )}
        </Button>
      </div>
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
            <span>{members?.length || 0}</span>
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
        {isLoading ? (
          <div className="text-center text-gray-500">Loading messages...</div>
        ) : messages?.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet. Start the conversation!</div>
        ) : (
          messages?.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.userId === session?.user?.id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.userId === session?.user?.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {msg.user.image ? (
                    <img
                      src={msg.user.image}
                      alt={msg.user.name || "User"}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                      {msg.user.name?.charAt(0) || "?"}
                    </div>
                  )}
                  <span className="text-xs font-medium">
                    {msg.user.name || "Unknown User"}
                  </span>
                  <span className="text-xs opacity-70">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{
                    __html: formatMessage(msg.content),
                  }}
                />
                {msg.mentions.length > 0 && (
                  <div className="mt-1 text-xs opacity-70">
                    Mentioned: {msg.mentions.map((m) => m.user.name).join(", ")}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t relative">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (use @username to mention)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            disabled={sendMessage.isPending}
          />
          <Button
            type="submit"
            disabled={!message.trim() || sendMessage.isPending}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Use @username to mention team members
        </p>
        
        {/* Mention Autocomplete */}
        {showMentionAutocomplete && members && (
          <MentionAutocomplete
            members={members.filter(member => {
              const name = member.user.name?.toLowerCase() || "";
              const email = member.user.email?.toLowerCase() || "";
              return name.includes(mentionQuery.toLowerCase()) || email.includes(mentionQuery.toLowerCase());
            })}
            onSelect={handleMentionSelect}
            onClose={() => {
              setShowMentionAutocomplete(false);
              setMentionQuery("");
            }}
            position={mentionPosition}
          />
        )}
      </form>
    </div>
  );
}

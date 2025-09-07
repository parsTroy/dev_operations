"use client";

import { useState, useEffect, useRef } from "react";
import { User } from "lucide-react";

interface MentionAutocompleteProps {
  members: Array<{
    id: string;
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    };
  }>;
  onSelect: (username: string) => void;
  onClose: () => void;
  position: { top: number; left: number };
}

export function MentionAutocomplete({ members, onSelect, onClose, position }: MentionAutocompleteProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  console.log("MentionAutocomplete rendered:", { members: members.length, position });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % members.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + members.length) % members.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selectedMember = members[selectedIndex];
      if (selectedMember) {
        onSelect(selectedMember.user.name || selectedMember.user.email || "Unknown");
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, members]);

  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  return (
    <div
      ref={listRef}
      className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto min-w-48"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {members.map((member, index) => (
        <div
          key={member.id}
          className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 ${
            index === selectedIndex ? "bg-blue-50" : ""
          }`}
          onClick={() => onSelect(member.user.name || member.user.email || "Unknown")}
        >
          {member.user.image ? (
            <img
              src={member.user.image}
              alt={member.user.name || "User"}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
              {member.user.name?.charAt(0) || member.user.email?.charAt(0) || "?"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {member.user.name || "Unknown User"}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {member.user.email}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

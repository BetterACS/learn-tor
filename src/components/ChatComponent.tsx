"use client"
import { useState, useEffect } from "react";
import clsx from "clsx";
import ReactMarkdown from "react-markdown";

interface MarkdownComponentProps {
  content: string;
}

const MarkdownComponent = ({ content }: MarkdownComponentProps) => {
    return (
      <div className="prose max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  };

interface ChatMessage {
    role: string;
    content: string;
    time: string;
  }
const ChatComponent = ({ messages }: { messages: ChatMessage[] }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(messages);

  useEffect(() => {
    // console.log("messages from props:", messages);
    setChatMessages(messages);
  }, [messages]);
  
  console.log("chatMessages",chatMessages)
  return (
    <div>
      {chatMessages.map((msg:ChatMessage, index:number) => (
        <div
          key={index}
          className={clsx("flex items-start gap-2 w-full", {
            "justify-end": msg.role === "user",
            "justify-start": msg.role === "assistant",
          })}
        >
          {msg.role === "assistant" && (
            <img
              src="images/logofooter.avif"
              alt="assistant Logo"
              className="w-16 h-16 md:ml-32 lg:ml-56 mt-6"
            />
          )}
          <div
            className={clsx(
              "text-monochrome-950 text-body-large p-2 mt-10 rounded-lg max-w-[60%]",
              {
                "bg-monochrome-50": msg.role === "assistant",
                "bg-monochrome-100": msg.role === "user",
                "self-end break-words": msg.role === "user",
                "self-start": msg.role === "assistant",
                "md:mr-32 lg:mr-56": true,
              }
            )}
          >
            <MarkdownComponent content={msg.content || ""} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatComponent;

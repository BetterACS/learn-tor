"use client";
import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
interface MarkdownComponentProps {
  content: string;
}

const MarkdownComponent = ({ content }: MarkdownComponentProps) => {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({node, ...props}) => (
            <a 
              {...props} 
              className="text-primary-600 hover:text-primary-800 hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            />
          ),
          table: ({node, ...props}) => (
            <div className="overflow-x-auto">
              <table {...props} className="min-w-full border-collapse" />
            </div>
          ),
          th: ({node, ...props}) => (
            <th {...props} className="px-4 py-2 bg-monochrome-100 border border-monochrome-200" />
          ),
          td: ({node, ...props}) => (
            <td {...props} className="px-4 py-2 border border-monochrome-200" />
          ),
          span: ({node, className, ...props}) => {
            if (className?.includes('text-red-600')) {
              return <span className="text-red-600" {...props} />;
            }
            return <span {...props} />;
          }
        }}
      >
        {content}
      </ReactMarkdown>
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChatMessages(messages);
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end"
      });
    }, 60);
  };

  return (
    <div>
      {chatMessages.map((msg: ChatMessage, index: number) => (
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
              "text-monochrome-950 text-body-large p-2 mt-6 rounded-lg max-w-[60%]",
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
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatComponent;
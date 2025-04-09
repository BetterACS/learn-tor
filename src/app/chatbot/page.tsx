"use client";
import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navbar, ChatbotSidebar, AlertBox,ChatComponent } from '@/components/index';
import clsx from 'clsx';
import { trpc } from '@/app/_trpc/client';
import { set } from 'mongoose';

// เผื่อไว้ใช้
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();
  const isLoggedIn = !!session;
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; time: string }[]>([]);

  
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [chatId, setChatId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  const mutationQueryChat = trpc.queryChat.useMutation();
  const handleSidebarToggle = (isOpen: boolean) => setIsSidebarOpen(isOpen);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: "smooth"
        });
      }
    }, 100);
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  const handleSelectItem = (item: string) => {

    if(item === 'new-chat'){
      setMessages([]);
      setChatId('');
      return;
    }

    mutationQueryChat.mutate({ email: session?.user?.email as string, chatId: item },{
      onSuccess: (data) => {
        if(data){
          // console.log("data histroy",data.history);
          // setMessages(data.history.map((msg: any) => ({ role: msg.role, text: msg.content })));
          setMessages(data.history)
          // console.log("data",data)
          setChatId(item);
          // console.log("chatId",item);
        }
      },
      onError: (error) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'assistant', text: 'ขออภัย บริการของเรายังไม่เปิดใช้งานตอนนี้ กรุณาลองใหม่อีกครั้งในภายหลัง' ,time: new Date().toISOString()},
        ]);}})
  };
  const mutationChat = trpc.chatBot.useMutation();
  const handleSendMessage = () => {
    if (input.trim() === '' || isBotTyping) return;
    setMessages((prevMessages) => [...prevMessages, { role: 'user', content: input, time: new Date().toISOString() }]);
    // console.log("input",input)
    setInput('');
    setIsBotTyping(true);
    mutationChat.mutate({ email: session?.user?.email as string, content: input,chatId:chatId },{
      onSuccess: (data) => {
        if(data){
          
          if ('chat' in data) {
            // console.log("data in handleSendMessage",data.chat.history[data.chat.history.length-1]);
            setMessages((prevMessages) => [...prevMessages, data.chat.history[data.chat.history.length-1]]);
            setChatId(data.chat._id);
            setRefreshKey(prev => prev + 1);
          }
          setIsBotTyping(false);
        }
      },
      onError: (error) => {
        setMessages((prevMessages) => [
              ...prevMessages,
              { role: 'assistant', context: 'ขออภัย บริการของเรายังไม่เปิดใช้งานตอนนี้ กรุณาลองใหม่อีกครั้งในภายหลัง' ,time: new Date().toISOString()},
            ]);
        setIsBotTyping(false);
        
      }
    })

    // setTimeout(() => {
    //   setMessages((prevMessages) => [
    //     ...prevMessages,
    //     { role: 'assistant', context: 'ขออภัย บริการของเรายังไม่เปิดใช้งานตอนนี้ กรุณาลองใหม่อีกครั้งในภายหลัง' },
    //   ]);
    //   setIsBotTyping(false);
    // }, 1000*300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <ChatbotSidebar onToggleSidebar={handleSidebarToggle} onSelectItem={handleSelectItem} email={session?.user?.email as string} refreshKey={refreshKey}/>

      <div className={clsx('flex flex-col h-[calc(100vh-64px)] transition-all duration-300', {
        'lg:ml-[20%] md:ml-[26%] sm:ml-[0%]': isSidebarOpen,
        'ml-0': !isSidebarOpen,
      })}>
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto w-full px-4 pb-4"
        >
          {messages.length === 0 ? (
            <div className="grid h-full items-end justify-center">
             <div className="text-monochrome-950 text-headline-3 lg:text-headline-2 text-center animate-fadeInAndFloat">
              What can I help?
             </div>
            </div>
          ) : (
            <div className="w-full pt-4">
              <ChatComponent messages={messages}/>
              {isBotTyping && (
                <div className="flex justify-start gap-2 w-full pb-4">
                  <img src="images/logofooter.avif" alt="assistant Logo" className="w-16 h-16 md:ml-32 lg:ml-56 mt-6" />
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 4, ml: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                </div>
              )}
            </div>
          )}
        </div> 

        <div className="w-full bg-monochrome pt-4 pb-4">
          <div className="relative flex flex-col w-full lg:max-w-3xl md:max-w-xl px-4 mx-auto">
            <textarea
              placeholder="Text input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (!isLoggedIn) {
                  setShowAlert(true);
                }
              }}
              maxLength={500}
              className="h-[90px] p-3 bg-monochrome-100 border border-monochrome-100 rounded-xl text-monochrome-950
                         placeholder:text-monochrome-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600
                         resize-none box-border"
            />
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={isBotTyping || input.trim() === ''}
              className="absolute bottom-4 right-7 w-8 h-8 opacity-80 hover:opacity-100 transition-opacity duration-300"
            >
              <img src="images/feature/send.avif" alt="Send Icon" className="w-full h-full" />
            </button>
          </div>
          <div className="text-monochrome-500 text-body-small text-center mt-4">
            Learntor อาจมีข้อผิดพลาด ควรตรวจสอบข้อมูลสำคัญ
          </div>
        </div>
      </div>

      {showAlert && (
        <AlertBox
          alertType="warning"
          title="Warning"
          message="Please log in before using."
        />
      )}
    </div>
  );
}
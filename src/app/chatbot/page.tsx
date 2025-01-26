'use client';
import { useState } from 'react';
import { Navbar, ChatbotSidebar } from '@/components/index';

export default function Page() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSidebarToggle = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Navbar />
      <ChatbotSidebar onToggleSidebar={handleSidebarToggle} />

      <div
        className={`flex items-center justify-center h-full pt-20 transition-all duration-300 ${
          isSidebarOpen ? 'ml-[20%]' : 'ml-0'
        }`}
      >
        <div className="text-center w-full max-w-3xl">
          <div>
            <div className="text-monochrome-950 text-headline-2 mt-60">What can I help? </div>

            <div className="relative mt-4">
              <textarea
                placeholder="Text input"
                className="w-full h-[90px] p-3 bg-monochrome-100 border border-monochrome-100 rounded-xl text-monochrome-950 placeholder:text-monochrome-400 placeholder:text-start focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 resize-none"
              />
              <button
                type="button"
                className="absolute top-3 right-3 w-8 h-8 opacity-80 hover:opacity-100 transition-opacity duration-300"
              >
                <img
                  src="images/feature/send.avif"
                  alt="Send Icon"
                  className="w-full h-full"
                />
              </button>
            </div>

            <div className="text-monochrome-500 text-body-small mt-4">
              Learntor อาจมีข้อผิดพลาด ควรตรวจสอบข้อมูลสำคัญ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

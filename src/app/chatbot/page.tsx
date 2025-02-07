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
        className={`flex flex-col items-center justify-end h-full pt-20 transition-all duration-300 ${
          isSidebarOpen ? 'ml-[20%] md:ml-[15%] sm:ml-[10%]' : 'ml-0'
        }`}
      >
        <div className="text-center w-full max-w-3xl px-4 sm:px-2">
          <div>
            <div className="text-monochrome-950 text-headline-3 lg:text-headline-2">
              What can I help?
            </div>

          </div>
          <div className="relative flex mt-4 items-center">
            <textarea
              placeholder="Text input"
              className="w-full sm:w-full md:w-[100%] lg:w-[100%] h-[90px] p-3 bg-monochrome-100 border border-monochrome-100 rounded-xl text-monochrome-950 placeholder:text-monochrome-400 placeholder:text-start focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 resize-none box-border max-w-full mr-6"
            />
            <button
              type="button"
              className="absolute top-3 right-8 w-8 h-8 opacity-80 hover:opacity-100 transition-opacity duration-300"
            >
            <img
              src="images/feature/send.avif"
              alt="Send Icon"
              className="w-full h-full"
            />
            </button>
          </div>

          <div className="text-monochrome-500 text-body-small mt-4 mb-12">
            Learntor อาจมีข้อผิดพลาด ควรตรวจสอบข้อมูลสำคัญ
          </div>
        </div>
      </div>
    </div>
  );
}

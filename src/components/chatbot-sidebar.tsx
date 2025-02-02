'use client';
import { useState } from 'react';

export default function ChatbotSidebar({ onToggleSidebar }: { onToggleSidebar: (isOpen: boolean) => void }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleToggleSidebar = () => {
    const newSidebarState = !isSidebarOpen;
    setIsSidebarOpen(newSidebarState);
    onToggleSidebar(newSidebarState);
  };
  const handleSelectItem = (item: string) => setSelectedItem(item);

  const MenuItem = ({ item, label }: { item: string; label: string }) => (
    <div
      className={`text-headline-6 mt-8 ml-12 cursor-pointer transition-all duration-200 ${
        selectedItem === item
          ? 'bg-monochrome-200 text-monochrome-950 rounded-md mr-8 p-4' 
          : 'p-2'
      }`}
      onClick={() => handleSelectItem(item)}
    >
      {label}
    </div>
  );

  return (
    <div>
      <div
        className="absolute top-28 left-10 cursor-pointer z-50 flex items-center"
        onClick={handleToggleSidebar}
      >
        <img src="images/feature/hide.avif" alt="Hide Icon" className="w-10 h-10" />
        {!isSidebarOpen && (
          <img src="images/feature/new.avif" alt="NewChat Icon" className="w-10 h-10 ml-2" />
        )}
      </div>

      <div
        className={`fixed top-20 left-0 w-1/5 h-screen bg-monochrome-100 p-4 transition-all duration-300 ${
          isSidebarOpen ? 'block' : 'hidden'
        }`}
      >

        <div className="absolute top-8 right-10 cursor-pointer z-50">
          <img src="images/feature/new.avif" alt="NewChat Icon" className="w-10 h-10" />
        </div>

        <div className="text-headline-5 text-bold mt-24 ml-12 cursor-pointer" onClick={() => handleSelectItem('new-chat')}>
          New Chat
        </div>
        <div className="border-t border-monochrome-300 my-4 w-[calc(100%-32px)] mx-auto mt-8" />

        <div className="text-primary-600 text-body-large font-bold mt-12 ml-12">Today</div>
        <MenuItem item="Today-1" label="แนะนำรอบ Admission ให้หน่อย" />
        <div className="text-primary-600 text-body-large font-bold mt-12 ml-12">Previous 2 Days</div>
        <MenuItem item="Previous2-1" label="ใช้อะไรสมัครสอบเข้า" />
        <MenuItem item="Previous2-2" label="ทำยังไงให้สอบติด" />

        <div className="text-primary-600 text-body-large font-bold mt-12 ml-12">Previous 6 Days</div>
        <MenuItem item="Previous6-1" label="ค่าเทอมมหาลัยไหนแพงสุด" />
        <MenuItem item="Previous6-2" label="มจธ ดีไหม" />
      </div>
    </div>
  );
}

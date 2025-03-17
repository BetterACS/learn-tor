'use client';
import { useState, useRef, useEffect } from 'react';

export default function ChatbotSidebar({ onToggleSidebar, onSelectItem }: { onToggleSidebar: (isOpen: boolean) => void, onSelectItem: (item: string) => void }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const sidebarRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current && !sidebarRef.current.contains(event.target) &&
        menuRef.current && !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleSidebar = () => {
    const newSidebarState = !isSidebarOpen;
    setIsSidebarOpen(newSidebarState);
    onToggleSidebar(newSidebarState);
  };

  const handleSelectItem = (item: string) => {
    setSelectedItem(item);
    onSelectItem(item);
    setMenuOpen(null);
  };

  const handleNewChatClick = () => {
    setSelectedItem(null);
    onSelectItem('new-chat');
  };

  const handleMenuToggle = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(menuOpen === item ? null : item);
  };

  const handleRename = (item: string) => {
    const newName = prompt('กรุณาใส่ชื่อใหม่:', item);
    if (newName) {
      console.log(`เปลี่ยนชื่อ ${item} เป็น ${newName}`);
    }
    setMenuOpen(null);
  };

  const handleDelete = (item: string) => {
    if (confirm(`คุณต้องการลบ "${item}" ใช่ไหม?`)) {
      console.log(`ลบแชท: ${item}`);
    }
    setMenuOpen(null);
  };

  const MenuItem = ({ item, label }: { item: string; label: string }) => (
    <div
      className={`relative flex items-center justify-between p-2 pr-2 mt-1 ml-11 mr-6 cursor-pointer transition-all duration-200 rounded-md 
                  group ${selectedItem === item ? 'bg-monochrome-200' : 'hover:bg-monochrome-200'}`}
      onClick={() => handleSelectItem(item)}
    >
      <span className="text-headline-6">{label}</span>
      <button className="ml-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={(e) => handleMenuToggle(item, e)}>
        <img src="images/feature/dots.avif" alt="Menu" className="w-6 h-6" />
      </button>

      {menuOpen === item && (
      <div
        ref={menuRef}
        className="absolute right-0 mt-2 w-[130px] bg-monochrome-50 text-monochrome-950 text-headline-6 rounded shadow-lg overflow-hidden divide-y divide-monochrome-300"
      >
        <button
          className="w-full flex items-center justify-center px-5 py-4 hover:bg-monochrome-100 transition duration-150"
          onClick={() => handleRename(item)}
        >
          เปลี่ยนชื่อ
        </button>
        <button
          className="w-full flex items-center justify-center px-5 py-4 hover:bg-monochrome-100 transition duration-150 text-red-600"
          onClick={() => handleDelete(item)}
        >
          ลบ
        </button>
      </div>
    )}
    </div>
  );

  return (
    <div ref={sidebarRef}>
      <div className="absolute top-28 left-10 cursor-pointer z-20 flex" onClick={handleToggleSidebar}>
        <img src="images/feature/hide.avif" alt="Hide Icon" className="w-10 h-10" />
        {!isSidebarOpen && (
          <img src="images/feature/new.avif" alt="NewChat Icon" className="w-10 h-10 ml-2" onClick={handleNewChatClick} />
        )}
      </div>

      <div className={`fixed top-20 left-0 ${isSidebarOpen ? 'block' : 'hidden'} w-full sm:w-full md:w-1/4 lg:w-1/5 h-screen bg-monochrome-100 p-4 transition-all duration-300 z-10`}>
        <div className="absolute top-7 right-10 cursor-pointer z-20">
          <img src="images/feature/new.avif" alt="NewChat Icon" className="w-10 h-10" onClick={handleNewChatClick} />
        </div>

        <div className="text-headline-4 mt-24 cursor-pointer text-center" onClick={() => handleSelectItem('new-chat')}>
          New Chat
        </div>
        <div className="border-t border-monochrome-300 my-4 w-[calc(100%-32px)] mx-auto mt-8" />

        <div className="text-primary-600 text-body-large font-bold mt-10 ml-12">Today</div>
        <MenuItem item="Today-1" label="แนะนำรอบ Admission ให้หน่อย" />
        <div className="text-primary-600 text-body-large font-bold mt-10 ml-12">Previous 2 Days</div>
        <MenuItem item="Previous2-1" label="แนะนำรอบ Admission ให้หน่อย" />
      </div>
    </div>
  );
}

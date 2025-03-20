'use client';
import { useState, useRef, useEffect } from 'react';

interface Label {
  id: string;
  label: string;
  date: string;
}

interface ChatbotSidebarProps {
  onToggleSidebar: (isOpen: boolean) => void;
  onSelectItem: (item: string) => void;
}

export default function ChatbotSidebar({ onToggleSidebar, onSelectItem }: ChatbotSidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [tempLabel, setTempLabel] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [labels, setLabels] = useState<Label[]>([
    { id: 'Today-1', label: 'แนะนำรอบ Admission ให้หน่อย', date: 'Today' },
    { id: 'Previous2-1', label: 'แนะนำรอบ Admission ให้หน่อย', date: 'Previous 2 Days' },
    { id: 'Previous2-2', label: 'แนะนำรอบ Admission ให้หน่อย', date: 'Previous 2 Days' },
  ]);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current && !sidebarRef.current.contains(event.target as Node) &&
        menuRef.current && !menuRef.current.contains(event.target as Node)
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
    setEditingItem(item);
    const label = labels.find((label) => label.id === item)?.label || '';
    setTempLabel(label);
    setMenuOpen(null);
  };

  const handleDelete = (item: string) => {
    openDeleteModal(item);
  };

  const openDeleteModal = (item: string) => {
    setDeleteTarget(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      const newLabels = labels.filter((label) => label.id !== deleteTarget);
      setLabels(newLabels);

      // Only switch to a new chat if the deleted chat is the currently selected one
      if (selectedItem === deleteTarget) {
        setSelectedItem(null);
        onSelectItem('new-chat');
      }
    }
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    if (newLabel.length <= 40) {
      setTempLabel(newLabel);
    }
  };

  const handleSaveRename = (item: string) => {
    const originalLabel = labels.find((label) => label.id === item)?.label || '';
    if (tempLabel.trim() !== '') {
      const newLabels = labels.map((label) =>
        label.id === item ? { ...label, label: tempLabel } : label
      );
      setLabels(newLabels);
    } else {
      setTempLabel(originalLabel);
    }
    setEditingItem(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, item: string) => {
    if (e.key === 'Enter') {
      handleSaveRename(item);
    }
  };

  const MenuItem = ({ item }: { item: string }) => {
    const label = labels.find((label) => label.id === item);
    if (!label) return null;

    return (
      <div
        className={`relative flex items-center justify-between p-2 pr-2 mt-1 ml-11 mr-6 cursor-pointer transition-all duration-200 rounded-md 
                    group ${selectedItem === item ? 'bg-monochrome-200' : 'hover:bg-monochrome-200'}`}
        onClick={() => handleSelectItem(item)}
      >
        {editingItem === item ? (
          <input
            type="text"
            value={tempLabel}
            onChange={handleLabelChange}
            onBlur={() => handleSaveRename(item)}
            onKeyDown={(e) => handleKeyDown(e, item)}
            autoFocus
            className="text-headline-6 bg-transparent outline-none"
          />
        ) : (
          <span className="text-headline-6">{label.label}</span>
        )}
        <button
          className="ml-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={(e) => handleMenuToggle(item, e)}
          aria-label="Menu"
        >
          <img src="images/feature/dots.avif" alt="Menu" className="w-6 h-6" />
        </button>

        {menuOpen === item && (
          <div
            ref={menuRef}
            className="absolute z-20 right-0 mt-2 w-[130px] bg-monochrome-50 text-monochrome-950 text-headline-6 rounded shadow-lg overflow-hidden divide-y divide-monochrome-300"
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
  };

  const groupedLabels = labels.reduce((acc, label) => {
    if (!acc[label.date]) {
      acc[label.date] = [];
    }
    acc[label.date].push(label);
    return acc;
  }, {} as Record<string, Label[]>);

  return (
    <div ref={sidebarRef}>
      {/* Sidebar Toggle Button */}
      <div className="absolute top-28 left-10 cursor-pointer z-20 flex" onClick={handleToggleSidebar}>
        <img src="images/feature/hide.avif" alt="Hide Icon" className="w-10 h-10" />
        {!isSidebarOpen && (
          <img
            src="images/feature/new.avif"
            alt="NewChat Icon"
            className="w-10 h-10 ml-2"
            onClick={handleNewChatClick}
          />
        )}
      </div>

      {/* Sidebar Content */}
      <div
        className={`fixed top-20 left-0 ${isSidebarOpen ? 'block' : 'hidden'} w-full sm:w-full md:w-1/4 lg:w-1/5 h-screen bg-monochrome-100 p-4 transition-all duration-300 z-10`}
      >
        <div className="absolute top-7 right-10 cursor-pointer z-20">
          <img
            src="images/feature/new.avif"
            alt="NewChat Icon"
            className="w-10 h-10"
            onClick={handleNewChatClick}
          />
        </div>

        <div
          className="text-headline-4 mt-24 cursor-pointer text-center"
          onClick={() => handleSelectItem('new-chat')}
        >
          New Chat
        </div>
        <div className="border-t border-monochrome-300 my-4 w-[calc(100%-32px)] mx-auto mt-8" />

        {/* Grouped Chat Items */}
        {Object.entries(groupedLabels).map(([date, items]) => (
          <div key={date}>
            <div className="text-primary-600 text-body-large font-bold mt-10 ml-12">{date}</div>
            {items.map((item) => (
              <MenuItem key={item.id} item={item.id} />
            ))}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-monochrome-50 p-6 rounded-lg shadow-lg">
            <p className="text-headline-6 mb-6">
              คุณต้องการลบแชทนี้ใช่ไหม?<br/><br/>นี่จะเป็นการลบ{' '}
              <span className="text-red-500">
                {labels.find((label) => label.id === deleteTarget)?.label || 'this chat'}
              </span>
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-monochrome-200 rounded hover:bg-monochrome-300"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                ยกเลิก
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-chrome-50 rounded hover:bg-red-600"
                onClick={handleConfirmDelete}
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
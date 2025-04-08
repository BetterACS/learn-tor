'use client';
import { useState, useRef, useEffect } from 'react';
import { trpc } from '@/app/_trpc/client';
import { set } from 'mongoose';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AlertBox, ConfirmModule} from '@/components/index';
interface Conversation {
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

interface Label {
  _id: string;
  name: string;
  history: Conversation[];
}
dayjs.extend(relativeTime);
interface ChatbotSidebarProps {
  onToggleSidebar: (isOpen: boolean) => void;
  onSelectItem: (item: string) => void;
  email: string;
}

const getRelativeTime = (date: string) => {
  const currentDate = dayjs(); // Current date and time
  const targetDate = dayjs(date);
  const diffInDays = currentDate.diff(targetDate, 'day'); // เปลี่ยนเป็น currentDate.diff(targetDate)

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays/7)} weeks ago`;
  return `${Math.floor(diffInDays/30)} months ago`;
};

export default function ChatbotSidebar({ onToggleSidebar, onSelectItem,email }: ChatbotSidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [tempLabel, setTempLabel] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [labels, setLabels] = useState<Label[]>([]);
  const mutationChatRoom = trpc.userChatBot.useMutation();
  useEffect(() => {
    if (email) {
      mutationChatRoom.mutate({ email },{
        onSuccess: (data) => {
          // console.log(data);
          if (data.status === 200) {
            // console.log("data",data.data.allChat);
            const sortedData = data.data.allChat.sort((a, b) => {
              const timeA = a.history[0]?.time ? dayjs(a.history[0].time) : dayjs(0);
              const timeB = b.history[0]?.time ? dayjs(b.history[0].time) : dayjs(0);
              return timeB.diff(timeA); // เรียงจากใหม่ไปเก่า
            });
            setLabels(sortedData);
          }
          else if (data.status === 400) {
            // console.log(data.data.message);
            setError(data.data.message);
          }
        },
        onError: (error) => {
          // console.log(error);
          setError(error.message);
        }
      });
    }
  }, [email]);
  
  
  
  

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
    const label = labels.find((label) => label._id === item)?.name || '';
    // console.log("label",label);
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
  const mutationDeleteChat = trpc.deleteChat.useMutation();
  const handleConfirmDelete = () => {
    if (deleteTarget) {

      mutationDeleteChat.mutate({ email, chatId: deleteTarget },{
        onSuccess: (data) => {
          // console.log(data);
          if (data.status === 200) {
            const newLabels = labels.filter((label) => label._id !== deleteTarget);
            setLabels(newLabels);
            // Only switch to a new chat if the deleted chat is the currently selected one
            if (selectedItem === deleteTarget) {
              setSelectedItem(null);
              onSelectItem('new-chat');
            }
          }
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
        },
        onError: (error) => {
          // console.log(error);
          setError(error.message);
        }
      });

      
    }
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const groupedLabels = labels.reduce((acc, label) => {
    if (!label.history || label.history.length === 0) return acc;
    
    const relativeTimeKey = getRelativeTime(label.history[0]?.time || '');
    if (!acc[relativeTimeKey]) {
      acc[relativeTimeKey] = [];
    }
    acc[relativeTimeKey].push(label);
    return acc;
  }, {} as Record<string, Label[]>);
  
  // เรียงลำดับกลุ่มจากใหม่ไปเก่า
  const sortedGroupedLabels = Object.entries(groupedLabels)
    .sort(([a], [b]) => {
      // จัดลำดับกลุ่มตามความใหม่-เก่า
      const order = ['Today', 'Yesterday', 'days ago', 'weeks ago', 'months ago'];
      const aIndex = order.findIndex(o => a.includes(o));
      const bIndex = order.findIndex(o => b.includes(o));
      
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      
      // ถ้าไม่ตรงกับที่กำหนด ให้ใช้การเปรียบเทียบ string ธรรมดา
      return a.localeCompare(b);
    });

  const mutationEditRoom = trpc.editRoom.useMutation();
  const handleSaveRename = (item: string) => {
    const originalLabel = labels.find((label) => label._id === item)?.name || '';
    if (tempLabel.trim() !== '') {
      mutationEditRoom.mutate({ email, chatId: item, name: tempLabel },{
        onSuccess: (data) => {
          // console.log(data);
          if (data.status === 200) {
            const newLabels = labels.map((label) =>
              label._id === item ? { ...label, name: tempLabel } : label
            );
            setLabels(newLabels);
          }
        },
        onError: (error) => {
          // console.log(error);
          setError(error.message);
        }
      })
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
    const label = labels.find((label) => label._id === item);
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
          <span className="text-headline-6">{label.name}</span>
        )}
        <button
          className="ml-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={(e) => handleMenuToggle(item, e)}
          aria-label="Menu"
        >
          <img src="images/feature/dots.avif" alt="Menu" className="w-6 h-6" />
        </button>
        {error && 
                <AlertBox
                alertType="error"
                title="Error"
                message={error}
              />
              }
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

  return (
    <div ref={sidebarRef}>
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

    <div
      className={`fixed top-20 left-0 ${isSidebarOpen ? 'block' : 'hidden'} w-full sm:w-full md:w-1/4 lg:w-1/5 h-screen bg-monochrome-100 p-4 transition-all duration-300 z-10 flex flex-col`}
    >
      <div className="flex-none">
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
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-monochrome-300 scrollbar-track-monochrome-100 pb-4">
        {Object.entries(groupedLabels).map(([date, items]) => (
          <div key={date}>
            <div className="text-primary-600 text-body-large font-bold mt-4 ml-12 sticky top-0 bg-monochrome-100 py-2 z-10">
              {date}
            </div>
            {items
              .sort((a, b) => dayjs(b.history[0]?.time).diff(dayjs(a.history[0]?.time)))
              .map((item) => (
                <MenuItem key={item._id} item={item._id} />
              ))}
          </div>
        ))}
      </div>
    </div>

    {isDeleteModalOpen && (
        <ConfirmModule
          text="คุณต้องการลบแชทนี้ใช่ไหม?"
          description={`นี่จะเป็นการลบ "${labels.find((label) => label._id === deleteTarget)?.name || 'this chat'}"`}
          confirmText="ลบ"
          cancelText="ยกเลิก"
          confirmHandle={handleConfirmDelete}
          cancelHandle={() => setIsDeleteModalOpen(false)}
          state={isDeleteModalOpen}
        />
      )}
  </div>
);
}
'use client';
import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navbar, ChatbotSidebar, AlertBox } from '@/components/index';
import clsx from 'clsx';

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();
  const isLoggedIn = !!session;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSidebarToggle = (isOpen: boolean) => setIsSidebarOpen(isOpen);
  const handleSelectItem = (item: string) => {
    const presetMessages: Record<string, { sender: 'user' | 'bot'; text: string }[]> = {
      'new-chat': [],
      'Today-1': [
        { sender: 'user', text: 'แนะนำรอบ Admission ให้หน่อย' },
        { sender: 'bot', text: `รอบการรับสมัคร Admission สำหรับนักเรียนที่ต้องการศึกษาต่อในระดับอุดมศึกษาภายในประเทศไทยโดยใช้ระบบ TCAS
                (Thai University Central Admission System) จะมีหลายรอบที่เปิดรับสมัคร และแต่ละรอบมีคุณสมบัติและเกณฑ์การคัดเลือกที่แตกต่างกันไป
                - รอบที่ 1 รอบ Portfolio
                - รอบที่ 2 รอบ Quota
                - รอบที่ 3 รอบ Admission
                - รอบที่ 4 รอบ Direct Admission` },
      ],
      'Previous2-1': [
        { sender: 'user', text: 'ใช้อะไรสมัครสอบเข้า' },
        { sender: 'bot', text: `เอกสารที่มักใช้ในการสมัครสอบ
                ✅ บัตรประชาชน
                ✅ ใบ ปพ.1 (Transcript) หรือใบแสดงผลการเรียน
                ✅ คะแนนสอบต่าง ๆ (ถ้ามี)
                ✅ แฟ้มสะสมผลงาน (กรณีสมัครรอบ Portfolio)
                ✅ ใบรับรองคุณสมบัติพิเศษ (ถ้ามี) เช่น ใบประกาศการแข่งขัน` },
      ],
      'Previous2-2': [
        { sender: 'user', text: 'ทำยังไงให้สอบติด' },
        { sender: 'bot', text: `🔥 สรุปสูตรสอบติด
          ✅ เลือกคณะให้ชัด → ดูว่าต้องใช้คะแนนอะไร
          ✅ วางแผนอ่านหนังสือ & ฝึกทำข้อสอบเก่า
          ✅ กระจายความเสี่ยง → สมัครรอบที่มีโอกาสมากที่สุด
          ✅ เลือกอันดับ Admission ให้ฉลาด
          ✅ เตรียมสอบสัมภาษณ์ให้ดี` },
      ],
      'Previous6-1': [
        { sender: 'user', text: 'ค่าเทอมมหาลัยไหนแพงสุด' },
        { sender: 'bot', text: `แพงสุด: หลักสูตรแพทย์-ทันตแพทย์ นานาชาติ (ค่าเทอมหลักล้านบาท)
                 หลักสูตรอินเตอร์รัฐ: MUIC, จุฬาฯ BBA/INDA, ธรรมศาสตร์ BBA (~200,000 บาท/เทอม)
                 เอกชน: ABAC, สแตมฟอร์ด, ม.กรุงเทพ (~70,000 - 120,000 บาท/เทอม)` },
      ],
    };

    setMessages(presetMessages[item] || []);
  };

  const handleSendMessage = () => {
    if (!isLoggedIn) {
      router.push('/login');
      setShowAlert(true);
      return;
    }

    if (input.trim() === '' || isBotTyping) return;

    setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: input }]);
    setInput('');
    setIsBotTyping(true);

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: 'ขออภัย บริการของเรายังไม่เปิดใช้งานตอนนี้ กรุณาลองใหม่อีกครั้งในภายหลัง' },
      ]);
      setIsBotTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Navbar />
      <ChatbotSidebar onToggleSidebar={handleSidebarToggle} onSelectItem={handleSelectItem} />

      <div className={clsx('flex flex-col items-center justify-between h-full transition-all duration-300', {
        'ml-[40%] md:ml-[15%] sm:ml-[10%]': isSidebarOpen,
        'ml-0': !isSidebarOpen,
      })}>
        <div className="flex justify-center flex-col flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-monochrome-950 text-headline-3 lg:text-headline-2 text-center mt-auto mb-4">
              What can I help?
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-hidden">
              {messages.map((msg, index) => (
                <div key={index} className={clsx('flex items-center gap-1', {
                  'justify-end ml-auto': msg.sender === 'user',
                  'justify-start mr-auto': msg.sender === 'bot',
                })}>
                  {msg.sender === 'bot' && (
                    <img src="images/logofooter.avif" alt="Bot Logo" className="w-16 h-16 ml-1" />
                  )}
                  <div className={clsx('text-monochrome-950 text-body-large p-2 mt-10 rounded-lg', {
                    'bg-monochrome-50': msg.sender === 'bot',
                    'bg-monochrome-100': msg.sender === 'user',
                    'self-end break-words': msg.sender === 'user',
                    'self-start ml-1': msg.sender === 'bot',
                    'lg:max-w-[55%] sm:max-w-[70%] md:max-w-[65%]': true,
                  })}>
                    {msg.text.split('\n').map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="relative flex flex-col w-full max-w-3xl px-4 sm:px-2 mt-auto">
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
            className="h-[90px] p-3 bg-monochrome-100 border border-monochrome-100 rounded-xl text-monochrome-950
                       placeholder:text-monochrome-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600
                       resize-none box-border mr-4"
          />
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={isBotTyping || input.trim() === ''}
            className="absolute top-3 right-9 w-8 h-8 opacity-80 hover:opacity-100 transition-opacity duration-300"
          >
            <img src="images/feature/send.avif" alt="Send Icon" className="w-full h-full" />
          </button>
        </div>

        <div className="text-monochrome-500 text-body-small mt-4 mb-12">
          Learntor อาจมีข้อผิดพลาด ควรตรวจสอบข้อมูลสำคัญ
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

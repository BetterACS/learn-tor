'use client';
import { Navbar, Footer } from '@/components/index';

const faqs = [
  {
    question: "Learntor คืออะไร?",
    answer:
      "Learntor เป็นแพลตฟอร์มที่ช่วยให้ผู้ใช้สามารถเข้าถึงข้อมูลเกี่ยวกับ TCAS, เปรียบเทียบคอร์สเรียน, คำนวณคะแนน และพูดคุยกับ Chatbot เพื่อรับคำแนะนำเกี่ยวกับการศึกษาต่อ!",
  },
  {
    question: "ต้องสมัครสมาชิกหรือไม่ถึงจะใช้ Learntor ได้?",
    answer:
      "ไม่จำเป็น! ผู้ใช้สามารถดูข้อมูล TCAS, คำนวณคะแนน และเปรียบเทียบคอร์สเรียนได้โดยไม่ต้องสมัครสมาชิก แต่หากต้องการใช้งาน Forum หรือ Chatbot จะต้องสมัครสมาชิกก่อน",
  },
  {
    question: "การเปรียบเทียบคอร์สเรียนทำงานอย่างไร?",
    answer:
      "ระบบจะให้ผู้ใช้เลือกคอร์สเรียนจากมหาวิทยาลัยต่าง ๆ และแสดงข้อมูลเปรียบเทียบ เช่น ค่าเทอม, เงื่อนไขการรับสมัคร, รายวิชาที่เรียน และโอกาสทางอาชีพ เพื่อช่วยให้ตัดสินใจได้ง่ายขึ้น",
  },
  {
    question: "Learntor มีการรับรองความถูกต้องของข้อมูลหรือไม่?",
    answer:
      "ข้อมูลทั้งหมดใน Learntor อ้างอิงจากแหล่งข้อมูลที่เชื่อถือได้ เช่น เว็บไซต์ของมหาวิทยาลัย, สำนักงานทดสอบทางการศึกษา และเอกสารจากหน่วยงานที่เกี่ยวข้อง อย่างไรก็ตาม ผู้ใช้ควรตรวจสอบข้อมูลล่าสุดจากแหล่งทางการเสมอ",
  },
  {
    question: "สามารถติดต่อทีมงาน Learntor ได้อย่างไร?",
    answer: (
      <>
        สามารถติดต่อเราได้ผ่านอีเมลที่{" "}
        <a href="mailto:Learntor@example.gmail.com" className="text-primary-600 hover:underline">
          Learntor@example.gmail.com
        </a>
      </>
    ),
  },
];

function FAQItem({ question, answer }: { question: string; answer: React.ReactNode }) {
  return (
    <div className="border-b border-monochrome-300 pb-4">
      <p className="text-headline-5 font-semibold">{question}</p>
      <p className="text-monochrome-700 text-body-large">{answer}</p>
    </div>
  );
}

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <p className="text-primary-600 text-headline-2 font-bold text-center mb-6">FAQs</p>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

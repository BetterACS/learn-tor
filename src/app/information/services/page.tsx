'use client';
import { Navbar, Footer } from '@/components/index';

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <p className="text-primary-600 text-headline-2 font-bold text-center mb-6">
          Our Services
        </p>

        <section className="space-y-8">
          <article className="border-b pb-4">
            <p className="text-headline-5 font-semibold">📊 Compare Courses</p>
            <p className="text-monochrome-700 text-body-large">
              เปรียบเทียบหลักสูตรจากมหาวิทยาลัยต่าง ๆ ได้ง่ายและรวดเร็ว พร้อมข้อมูลสำคัญ
              เช่น ค่าเทอม รายวิชาที่เรียน โอกาสทางอาชีพ และเงื่อนไขการรับสมัคร
            </p>
          </article>

          <article className="border-b pb-4">
            <p className="text-headline-5 font-semibold">🤖 Chatbot</p>
            <p className="text-monochrome-700 text-body-large">
              แชตบอตอัจฉริยะที่ช่วยตอบคำถามเกี่ยวกับการเรียนต่อ
              ให้ข้อมูลเกี่ยวกับมหาวิทยาลัย TCAS และการเตรียมตัวสอบ
              ตอบกลับรวดเร็ว ช่วยให้คุณวางแผนการศึกษาต่อได้อย่างมั่นใจ
            </p>
          </article>

          <article className="border-b pb-4">
            <p className="text-headline-5 font-semibold">🧮 TCAS Calculate</p>
            <p className="text-monochrome-700 text-body-large">
              เครื่องมือคำนวณคะแนน TCAS ตามเกณฑ์ของแต่ละมหาวิทยาลัย วิเคราะห์โอกาสในการสอบติด
              และช่วยวางแผนกลยุทธ์การสมัครให้แม่นยำขึ้น
            </p>
          </article>

          <article className="pb-4">
            <p className="text-headline-5 font-semibold">💬 Forum</p>
            <p className="text-monochrome-700 text-body-large">
              พื้นที่สำหรับแลกเปลี่ยนประสบการณ์เกี่ยวกับการเตรียมตัวสอบ แชร์เทคนิคจากรุ่นพี่และผู้มีประสบการณ์
              เปิดโอกาสให้พูดคุยและรับคำปรึกษาจากชุมชนที่สนับสนุนการศึกษาต่อ
            </p>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}

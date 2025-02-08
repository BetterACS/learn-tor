'use client';
import { Navbar, Footer } from '@/components/index';

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <p className="text-primary-600 text-headline-2  font-bold text-center mb-6">About Us</p>

        <section className="mb-6">
          <p className="text-monochrome-700 text-body-large">
            <strong>Learntor</strong> คือแพลตฟอร์มที่รวบรวมข้อมูลสำคัญเกี่ยวกับการเตรียมตัวเข้าศึกษาต่อระดับปริญญาตรีในประเทศไทย
            เรามุ่งมั่นสร้างแหล่งข้อมูลที่ครอบคลุมและทันสมัยเกี่ยวกับระบบ <strong>TCAS</strong>,
            หลักสูตรจากมหาวิทยาลัยต่าง ๆ และแนวทางการศึกษาต่อ เพื่อช่วยให้นักเรียนมัธยมปลายลดความสับสนและตัดสินใจได้อย่างมั่นใจ
          </p>
        </section>

        <section className="mb-6">
          <p className="text-headline-5 font-semibold mb-3">เราให้บริการอะไรบ้าง?</p>
          <ul className="list-disc list-inside text-monochrome-700 text-body-large space-y-2">
            <li><strong>ข้อมูลหลักสูตรมหาวิทยาลัย</strong> – ค้นหาและเปรียบเทียบหลักสูตรจากมหาวิทยาลัยทั่วประเทศ</li>
            <li><strong>TCAS Guide</strong> – แนะนำขั้นตอนการสมัครและคำนวณโอกาสในการติดมหาวิทยาลัย</li>
            <li><strong>เครื่องมือช่วยตัดสินใจ</strong> – ระบบแนะนำคณะที่เหมาะสมตามความถนัดและความสนใจ</li>
            <li><strong>Forum พูดคุย & แชร์ประสบการณ์</strong> – พื้นที่สำหรับรุ่นพี่และผู้มีประสบการณ์ในการให้คำแนะนำ</li>
          </ul>
        </section>

        <section className="mb-6">
          <p className="text-headline-5 font-semibold mb-3">ใครคือผู้ใช้ของเรา?</p>
          <ul className="list-disc list-inside text-monochrome-700 text-body-large space-y-2">
            <li><strong>นักเรียนมัธยมปลาย</strong> – ผู้ที่กำลังวางแผนเข้าศึกษาต่อในระดับมหาวิทยาลัย</li>
            <li><strong>ผู้ที่สนใจศึกษาต่อระดับอุดมศึกษา</strong> – ต้องการข้อมูลเพื่อประกอบการตัดสินใจ</li>
            <li><strong>นักศึกษา & ผู้มีประสบการณ์</strong> – แบ่งปันความรู้และช่วยแนะแนวทางให้น้อง ๆ</li>
          </ul>
        </section>

        <section className="mb-6">
          <p className="text-headline-5 font-semibold mb-3">ข้อจำกัดของเรา</p>
          <ul className="list-disc list-inside text-monochrome-700 text-body-large space-y-2">
            <li><strong>ไม่ให้คำปรึกษาเชิงลึกแบบรายบุคคล</strong></li>
            <li><strong>ไม่รับประกันการตอบรับเข้าศึกษาจากมหาวิทยาลัย</strong></li>
          </ul>
          <p className="mt-4 text-monochrome-700 text-body-large">
            📌 <strong>Learntor แหล่งข้อมูลเพื่อช่วยให้ตัดสินใจได้อย่างมีประสิทธิภาพ!</strong>
          </p>
        </section>

        <p className="text-primary-600 text-body-large font-semibold text-center">
          Learntor – คู่มือการศึกษาที่คุณวางใจได้
        </p>
      </main>

      <Footer />
    </div>
  );
}

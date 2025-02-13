'use client';
import { Navbar, Footer } from '@/components/index';

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="text-primary-600 text-headline-3 font-bold text-center mt-5">
        Affiliate Program
      </div>

      <div className="max-w-3xl mx-auto px-4 py-3 bg-monochrome-50 rounded-lg">
        <div className="text-body-large mb-4 text-monochrome-700">
          ที่ Learntor เรามีแผนจะเปิดตัวโปรแกรมพันธมิตรในเร็ว ๆ นี้ เพื่อให้ผู้ใช้สามารถแนะนำบริการของเราและได้รับค่าคอมมิชชั่นจากการสมัครสมาชิกหรือการใช้งานต่าง ๆ โดยรายละเอียดของโปรแกรมและวิธีการเข้าร่วมจะประกาศในอนาคต
        </div>
        <div className="text-body-large mb-4 text-monochrome-700">
          โปรแกรมพันธมิตรนี้จะเปิดโอกาสให้คุณสร้างรายได้จากการแชร์ลิงก์และโปรโมทบริการของ Learntor ให้กับเพื่อนหรือผู้ที่สนใจ
        </div>
        <div className="text-body-large mb-8 text-monochrome-700 pb-32">
          โปรดติดตามข้อมูลเพิ่มเติมเกี่ยวกับโปรแกรมพันธมิตรจากเราในเร็ว ๆ นี้!
        </div>
      </div>

      <Footer />
    </div>
  );
}

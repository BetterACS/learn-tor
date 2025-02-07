'use client';
import { useState } from 'react';
import { Navbar, Footer, Questionbox  } from '@/components/index';

export default function Page() {
  const [selectedRound, setSelectedRound] = useState<string>('portfolio');

  const rounds = [
    { label: 'รอบ 1 Portfolio', value: 'portfolio' },
    { label: 'รอบ 2 โควตา', value: 'quota' },
    { label: 'รอบ 3 Admission', value: 'admission' },
    { label: 'รอบ 4 รับตรงอิสระ', value: 'direct-admission' },
  ];

  const roundDetails: Record<string, JSX.Element> = {
    portfolio: (
      <>
        <span className="text-primary-600 font-bold">รอบ Portfolio</span> เป็นการรับนักเรียน โดยเน้นคัดเลือกจากคุณสมบัติของผู้สมัคร และพิจารณาจากแฟ้มสะสมผลงาน (Portfolio), เกรดเฉลี่ย (GPAX) หรือคุณสมบัติอื่นๆ ที่มีความเกี่ยวข้องกับสาขานั้นๆ แต่ละคณะ/มหาวิทยาลัย จะกำหนดลักษณะหรือรูปแบบของแฟ้มสะสมผลงานที่แตกต่างกัน เช่น จำนวนผลงาน, ประเภทของผลงาน, ระดับการแข่งขันของผลงาน ไปจนถึงการเขียนเรียงความ อย่างไรก็ตามใน TCAS67 อาจมีบางแห่งนำคะแนนสอบส่วนกลางมาใช้ด้วย  
        <br /><br />
        <span className="text-primary-600 font-bold">ใช้เกรดกี่เทอม:</span> 4 - 5 เทอม
        <br /><br />
        <span className="text-primary-600 font-bold">องค์ประกอบ/คะแนนที่ใช้คัดเลือก:</span> Portfolio, GPAX, GPA, คะแนนทดสอบทางภาษา, ความสามารถพิเศษ, สอบสัมภาษณ์, คะแนนสอบอื่นๆ ที่คณะกำหนดใช้
      </>
    ),
    quota: (
      <>
        <span className="text-primary-600 font-bold">รอบโควตา</span> เน้นการรับสมัครนักเรียนที่มีคุณสมบัติเฉพาะ เช่น กลุ่มนักเรียนในเขตพื้นที่ กลุ่มนักเรียนในโควตาโรงเรียน, กลุ่มนักเรียนในภูมิภาค หรือกลุ่มนักเรียนที่มีความสามารถพิเศษ จะใช้คะแนนสอบส่วนกลางที่ ทปอ. เป็นผู้จัดสอบ เช่น TGAT/TPAT A-Level หรือ มหาวิทยาลัยจัดสอบวิชาเฉพาะของตนเอง รวมถึงอาจมีการใช้ GPAX และ GPA 6 เทอม ยังถือเป็นรอบที่มีเกณฑ์คัดเลือกที่หลากหลาย เพราะมหาวิทยาลัยเป็นผู้กำหนดเกณฑ์คัดเลือกเองเพื่อให้ได้นักเรียนที่ตรงตามความต้องการมากที่สุด  
        <br /><br />
        <span className="text-primary-600 font-bold">ใช้เกรดกี่เทอม:</span> 6 เทอม
        <br /><br />
        <span className="text-primary-600 font-bold">องค์ประกอบ/คะแนนที่ใช้คัดเลือก:</span> GPAX, GPA, TGAT/TPAT, A-Level, วิชาเฉพาะของมหาวิทยาลัย, ความสามารถพิเศษ, สอบสัมภาษณ์, คะแนนทดสอบภาษาอังกฤษ
      </>
    ),
    admission: (
      <>
        <span className="text-primary-600 font-bold">รอบ Admission</span> เป็นรอบสำคัญ ที่มหาวิทยาลัยในระบบ TCAS ทั่วประเทศ รวมทั้ง กสพท จะเปิดรับสมัครพร้อมกันผ่านระบบกลาง ทปอ. ที่เว็บไซต์ myTCAS โดยกำหนดการรับจะอยู่ในช่วงเดือนพฤษภาคม ซึ่งจำนวนที่เปิดรับในรอบนี้อาจมีการเปลี่ยนแปลงได้ หากในรอบ 1 และ 2 มหาวิทยาลัยนั้นๆ ได้จำนวนนักเรียนไม่ครบ ก็มีโอกาสที่จะเปิดรับเพิ่มในรอบ 3 Admission

        <br /><br />ปัจจุบัน เกณฑ์รอบ Admission จะเป็นเกณฑ์ที่มหาวิทยาลัยกำหนดเอง โดยจะเลือกใช้คะแนนจากข้อสอบกลาง TGAT/TPAT และ A-Level ตามสัดส่วนค่าน้ำหนักที่มหาวิทยาลัยต้องการ ดังนั้นสาขาเดียวกัน แต่ต่างมหาวิทยาลัยก็อาจจะใช้เกณฑ์ไม่เหมือนกัน

        โดยในการรับสมัคร ผู้สมัครแต่ละรายสามารถเลือกได้สูงสุด 10 อันดับ (แบบเรียงอันดับ) โดยสามารถเลือก กสพท รวมกับคณะอื่นๆ ได้ด้วย ค่าใช้จ่ายคิดตามจำนวนอันดับที่สมัคร สูงสุด 10 อันดับ 900 บาท แต่ล่าสุด มีนโยบายจากกระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม ให้สมัคร TCAS67 ฟรี และยังคงเลือกได้สูงสุด 10 อันดับเช่นเดิม <br /><br />รอบ Admission จะมีการประมวลผล 2 ครั้งเพื่อเพิ่มโอกาสสอบติด โดยหลังจากประกาศผลครั้งที่ 1 แล้ว หากผู้สมัครไม่ผ่านการคัดเลือกหรือไม่พอใจกับอันดับที่ผ่านการคัดเลือกสามารถยื่นขอประมวลผลครั้งที่ 2 ได้ โดยใช้ข้อมูลการสมัครเดิม หากอันดับนั้นๆ มีผู้สละสิทธิ์ ก็มีโอกาสได้รับการประมวลผลครั้งที่ 2 และสอบติดในอันดับที่สูงขึ้นได้ ซึ่งการประมวลผลครั้งที่ 2 นี้ จะไม่มีทางที่ได้ในอันดับที่แย่ลงกว่าเดิม

        การสละสิทธิ์ในรอบ 3 Admission จะต้องเป็นผู้ที่ยืนยันสิทธิ์รอบ 3 Admission และไม่เคยสละสิทธิ์มาก่อนเท่านั้น
        <br /><br />
        <span className="text-primary-600 font-bold">ใช้เกรดกี่เทอม:</span> 6 เทอม
        <br /><br />
        <span className="text-primary-600 font-bold">องค์ประกอบ/คะแนนที่ใช้คัดเลือก:</span> GPAX/GPA, TGAT/TPAT, A-Level, วิชาเฉพาะของมหาวิทยาลัย
      </>
    ),
    "direct-admission": (
      <>
        <span className="text-primary-600 font-bold">รอบ 4 Direct Admission หรือ รับตรงอิสระ</span> เป็นรอบที่มหาวิทยาลัยเปิดรับเองหลังจากประกาศผลการคัดเลือกในรอบ 3 Admission แล้ว ซึ่งเกณฑ์คัดเลือก อาจเหมือนหรือแตกต่างจากรอบก่อนๆ ก็ได้ เน้นรับกลุ่มนักเรียนที่ยังไม่ผ่านการคัดเลือกรอบต่างๆ หรือ นักเรียนที่สละสิทธิ์เพื่อมารอรอบถัดไป
        <br /><br />
        <span className="text-primary-600 font-bold">ใช้เกรดกี่เทอม:</span> 6 เทอม
        <br /><br />
        <span className="text-primary-600 font-bold">องค์ประกอบ/คะแนนที่ใช้คัดเลือก:</span> GPAX, GPA, TGAT/TPAT, A-Level, วิชาเฉพาะของมหาวิทยาลัย, Portfolio, สอบสัมภาษณ์
      </>
    ),
  };

  return (
    <>
      <Navbar />
      <div className="pt-10 px-20 py-10">
        <div className="text-primary-600 text-headline-4 font-semibold mb-6">TCAS คือ</div>
        <div className="text-monochrome-950 text-body-large leading-relaxed ml-8">
          TCAS ย่อมาจาก Thai University Central Admission System คือ ระบบการคัดเลือกสอบเข้ามหาวิทยาลัย โดยเปรียบเสมือนพื้นที่กลางที่มหาวิทยาลัยเข้าระบบมาเพื่อรับสมัครนักเรียน และนักเรียนก็สามารถเข้ามาหามหาวิทยาลัยที่ต้องการได้
          <br />
          <br />
          แม้ว่า TCASสามารถสมัครได้ทุกวุฒิทั้ง ม.6 สายอาชีพ เทียบเท่า และเทียบวุฒิ GED อย่างไรก็ตามต้องดูรายละเอียดคณะอีกครั้งว่ารับทุกวุฒิหรือไม่ ปัจจุบัน รูปแบบ TCAS67 แทบจะไม่แตกต่างจาก TCAS66 เลย ทั้งเรื่องระบบการจัดการ และข้อสอบ รวมถึงการคัดเลือกต่างๆ สำหรับ TCAS67 แบ่งการรับออกเป็น 4 รอบ ดังนี้
          <br />
          <br />
          <ul className="list-disc ml-8">
            <li>รอบที่ 1 รอบ Portfolio (ใช้แฟ้มสะสมผลงาน)</li>
            <li>รอบที่ 2 รอบ Quota (รอบโควตา)</li>
            <li>รอบที่ 3 รอบ Admission (รอบแอดมิชชั่น)</li>
            <li>รอบที่ 4 รอบ Direct Admission (รอบรับตรงอิสระ)</li>
          </ul>
          <br />
          TCAS แต่ละรอบมีจุดเด่นและรายละเอียดการรับสมัครที่แตกต่างกัน จำเป็นต้องศึกษาข้อมูลแต่ละรอบอย่างละเอียด
        </div>

        <div className="text-primary-600 text-headline-4 font-semibold mb-4 pt-10">ข้อมูลรอบรับ 67</div>
        <div className="flex justify-center space-x-6 md:space-x-10 lg:space-x-60 pt-10 relative w-full">
          {rounds.map((round) => {
            const roundNumber = round.label.split(' ')[1];
            return (
              <div
                key={round.value}
                className={`relative cursor-pointer text-headline-5 font-semibold pb-2 ${selectedRound === round.value ? 'text-primary-600 z-10' : 'text-monochrome-950'}`}
                onClick={() => setSelectedRound(round.value)}
              >
                <span className="block md:hidden font-bold">รอบ {roundNumber}</span>
                <span className="hidden md:block">{round.label}</span>
                <div className={`absolute bottom-0 left-0 w-full h-0.5 ${selectedRound === round.value ? 'bg-primary-600' : 'bg-transparent'}`}></div>
              </div>
            );
          })}
          <div className="absolute bottom-0 right-1 w-full h-0.5 bg-monochrome-300 z-0"></div>
        </div>

        <div className="text-monochrome-950 text-body-large leading-relaxed ml-8 whitespace-pre-line mt-6">
          {roundDetails[selectedRound] ? (
            roundDetails[selectedRound]
          ) : (
            <div className="text-monochrome-300 text-center">
              เลือกรอบที่ต้องการดูรายละเอียด . . .
            </div>
          )}
        </div>
      </div>
      <Questionbox />
      <Footer />
    </>
  );
}
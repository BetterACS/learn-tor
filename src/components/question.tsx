'use client';
import React, { useState, useRef } from 'react';

const mockData = [
  {
    id: 1,
    text: ' "ข้อสอบ TPAT4 เพิ่มจำนวนข้อจาก 40 เป็น 80 ข้อ, กสพท คณะทันตแพทยศาสตร์ สายศิลป์สามารถสมัครได้แล้ว ดังนั้นตอนนี้ทุกคณะที่สมัครผ่าน กสพท สายศิลป์สามารถสมัครได้ อย่างไรก็ตาม "ทันตะฯ ในรอบอื่นๆ ยังต้องยึดตามคุณสมบัติของคณะ คือ สมัครได้เฉพาะสายวิทย์เท่านั้น", ค่าสมัคร TCAS รอบ 3 Admission สมัครฟรีจากนโยบายของอว. ร่วมมือกับ ทปอ."',
    image: '/images/logofooter.avif',
    question: '1.TCAS67 มีอะไรเปลี่ยนไปจาก TCAS66 บ้าง?',
  },
  {
    id: 2,
    text: '"สมัครได้ เด็กซิ่วสามารถสมัครได้ทุกรอบใน TCAS67 แต่รายละเอียดอาจระบุเจาะจงเป็นรายโครงการ เช่น บางโควตาอาจสมัครได้แค่ ม.6 เท่านั้น วิธีการสังเกตว่าเด็กซิ่วสมัครได้หรือไม่ ให้ดูที่คุณสมบัติของผู้สมัคร หากกำหนดว่า สามารถสมัครได้ทั้ง ม.6 และผู้ที่สำเร็จการศึกษาระดับชั้น ม.6 หมายความว่าเด็กซิ่วสมัครได้ สำหรับอายุคะแนนสอบก็มีการเปลี่ยนแปลง โดยตอนนี้ ทั้ง TGAT/TPAT, A-Level และคะแนนวิชาเฉพาะ กสพท นั้น จะมีอายุเพียง 1 ปี หากต้องการสอบเข้า TCAS ในปีอื่นๆ ก็จะต้องสมัครใหม่ปีต่อปี"',
    image: '/images/logofooter.avif',
    question: '2.เด็กซิ่วยังสามารถสมัครใน TCAS67 ได้หรือไม่?',
  },
  {
    id: 3,
    text: ' "ตั้งแต่ TCAS64 เป็นต้นมา รอบ Admission จะมีระบบประมวลผล 2 ครั้งเพื่อช่วยให้นักเรียนมีโอกาสสอบติดมากขึ้น โดยหลักการคือ หลังจากที่ ทปอ.ประกาศผลการคัดเลือกครั้งที่ 1 แล้ว ผู้ที่ผ่านการคัดเลือกรอบ Admission ในอันดับที่ 2 - 10 หรือไม่ผ่านการคัดเลือกเลย จะมีโอกาสขอประมวลผลใหม่ได้อีกครั้ง ซึ่งการประมวลผลครั้งที่ 2 จะเป็นสาขาวิชาและอันดับเดิมที่สมัครไปตั้งแต่แรก แต่สามารถเลือกได้ว่า จะขอประมวลผลในสาขาวิชาใด อันดับใดบ้าง หากสาขาใดมีที่นั่งว่าง จึงจะมีการประมวลผลใหม่ในอันดับนั้น ซึ่งทำให้คนที่ขอประมวลผลใหม่ในอันดับนั้นมีโอกาสสอบติดเข้าไปแทนที่ คล้ายๆ กับการเรียกตัวสำรองขึ้นมา" ',
    image: '/images/logofooter.avif',
    question: '3.การประมวลผล 2 ครั้งในรอบแอดมิชชั่น คืออะไร',
  },
  {
    id: 4,
    text: `
      <ol class="list-decimal list-inside">
        <li>ไปที่เว็บไซต์ student.mytcas.com</li>
        <li>คลิกที่ลิงก์ "ลืมรหัสผ่าน?"</li>
        <li>ป้อนเลขบัตรประชาชนที่ลงทะเบียนไว้</li>
        <li>ระบบจะส่งรหัสผ่านใหม่ไปที่อีเมลที่ลงทะเบียนไว้</li>
        <li>รหัสผ่านต้องมีจำนวนไม่น้อยกว่า 8 ตัวอักษร ที่ประกอบด้วย อักษรตัวพิมพ์ใหญ่ อักษรตัวพิมพ์เล็ก และตัวเลขอย่างน้อยอย่างละ 1 ตัว</li>
      </ol>
    `,
    image: '/images/logofooter.avif',
    question: '4.ลืมรหัสผ่านเข้าระบบ myTCAS ทำอย่างไร?',
  },
  {
    id: 5,
    text: ' "ในระบบ TCAS ทุกคนจะสามารถสละสิทธิ์ได้เพียง 1 ครั้งเท่านั้น ซึ่งการสละสิทธิ์ในที่นี้คือ การยกเลิกการยืนยันสิทธิ์ในระบบ TCAS หากได้ทำการสละสิทธิ์ไปแล้ว เมื่อสอบติดและยืนยันสิทธิ์ในรอบถัดไป จะไม่สามารถสละสิทธิ์ได้อีก อย่างไรก็ตาม สำหรับผู้ที่สอบติดแต่ไม่ต้องการเรียนในคณะนั้นๆ สามารถเข้าไปกดไม่ใช้สิทธิ์หรือ ไม่ต้องเข้าไปทำรายการใดๆ ในระบบ myTCAS ก็จะถือว่าผู้สมัครไม่ประสงค์เรียนในคณะนั้นๆ ผลการสอบจะเป็นโมฆะทันที และจะไม่เสียสิทธิ์การสละสิทธิ์" ',
    image: '/images/logofooter.avif',
    question: '5.กฎสละสิทธิ์ครั้งเดียว คืออะไร?',
  },
  {
    id: 6,
    text: ' "ได้ เพราะการสมัคร TCAS และการสอบวิชาต่างๆ เป็นคนละส่วนกัน หากน้องๆ รู้ผลภายหลังว่าสอบติดรอบ Portfolio หรือ Quota หลังจากการสมัครสอบ TGAT/TPAT และ A-Level ก็ยังสามารถไปสอบได้ เพียงแต่จะไม่สามารถนำคะแนนไปยื่นสมัครในรอบอื่นได้ ถ้าสอบติดและยืนยันสิทธิ์ไปแล้ว" ',
    image: '/images/logofooter.avif',
    question: '6.หากสอบติดรอบ Portfolio แล้ว ยังสามารถสอบ TGAT/TPAT หรือ A-Level ได้มั้ย?',
  },
];

const question = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const totalSlides = Math.ceil(mockData.length / 3);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const moveX = e.clientX - startX;
    setTranslateX(moveX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (translateX > 100 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (translateX < -100 && currentIndex < totalSlides - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    setTranslateX(0);
  };

  return (
    <div>
      <div className="flex flex-col items-center gap-3 text-center mb-10 md:mb-20">
        <div className="text-primary-600 text-headline-3 font-semibold mb-6 pt-10">คำถามที่พบบ่อย</div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-12">
        <div
          className="relative overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            ref={sliderRef}
            id="slider"
            className="flex gap-4 transition-transform duration-300"
            style={{
              transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`,
            }}
          >
            {mockData.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 px-10 py-8 bg-primary-600 rounded-md text-white h-150"
                style={{ minWidth: 'calc(33.333% - 1rem)', flexBasis: 'calc(33.333% - 1rem)' }}
              >
                <div className="flex items-center gap-3">

                  <div className="text-headline-4">
                    <p>{item.question}</p>
                  </div>
                </div>
                <div
                  className="mt-4 text-headline-6"
                  dangerouslySetInnerHTML={{ __html: item.text }}
                ></div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default question;

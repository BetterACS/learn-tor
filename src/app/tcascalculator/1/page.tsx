'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Navbar, Footer, Calculator } from '@/components/index';

export default function Calculator1() {
  const [targets, setTargets] = useState<{ university: string; faculty: string; major: string; examType: string; }[]>([]);
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/tcascalculator');
  };

  const handleNextClick = () => {
    router.push('/tcascalculator/2');
  };

  const addTarget = () => {
    setTargets([
      ...targets,
      {
        university: "เลือกมหาวิทยาลัย",
        faculty: "เลือกคณะ",
        major: "เลือกสาขา",
        examType: "เลือกรูปแบบการรับ",
      },
    ]);
  };

  const updateTarget = (index: number, field: string, value: string) => {
    const updatedTargets = [...targets];
    updatedTargets[index] = { ...updatedTargets[index], [field]: value };
    setTargets(updatedTargets);
  };

  const removeTarget = (index: number) => {
    const updatedTargets = targets.filter((_, i) => i !== index);
    setTargets(updatedTargets);
  };

  return (
    <>
      <Navbar />
      <div className="relative h-screen flex flex-col items-center">
        {/* ปุ่มกลับ */}
        <button
          className="absolute top-20 left-20 flex items-center gap-2 transition text-lg font-medium group"
          onClick={handleBackClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6 text-black group-hover:text-primary-700 transition"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <div className="text-black text-headline-5 group-hover:text-primary-700 transition">กลับ</div>
        </button>

        {/* เส้น Step 1 */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-40">
          <div className="flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-monochrome-50 border-2 border-primary-600 shadow-md">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white text-2xl font-bold">
              1
            </span>
            <span className="text-headline-5 font-medium">เลือกเป้าหมาย</span>
          </div>
          <div className="h-1 w-72 bg-primary-600"></div>
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary-600 text-2xl font-bold border-2 border-primary-600">
            2
          </span>
          <div className="h-1 w-72 bg-primary-600"></div>
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary-600 text-2xl font-bold border-2 border-primary-600">
            3
          </span>
        </div>
            <div>
              {/* หัวข้อ Step 1: เลือกเป้าหมาย */}
              <div className="flex items-center gap-4 w-[800px] mb-4 mt-10">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white text-2xl font-bold">
                  1
                </span>
                <span className="text-headline-5 font-medium text-black">
                  เลือกเป้าหมาย
                </span>
              </div>

              {/* กล่องกรอกข้อมูลเป้าหมาย */}
              <div className="bg-white w-full max-w-[800px] p-6 rounded-lg shadow-lg border border-gray-300 mt-10">
                <h2 className="text-headline-5 font-semibold text-black mb-4">
                  คำนวณโอกาสสอบติดจากเป้าหมายที่เลือก
                </h2>
                {targets.map((target, index) => (
                  <div key={index} className="relative mb-4 p-4 bg-gray-100 rounded-lg border">
                    <button 
                      className="absolute top-2 right-4 text-primary-600 hover:text-red-800 transition"
                      onClick={() => removeTarget(index)}
                    >
                      <svg aria-hidden="true" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 laptop:h-6 laptop:w-6">
                        <path d="M177.1 48h93.7c2.7 0 5.2 1.3 6.7 3.6l19 28.4h-145l19-28.4c1.5-2.2 4-3.6 6.7-3.6zM354.2 80L317.5 24.9C307.1 9.4 289.6 0 270.9 0H177.1c-18.7 0-36.2 9.4-46.6 24.9L93.8 80H80.1 32 24C10.7 80 0 90.7 0 104s10.7 24 24 24H35.6L59.6 452.7c2.5 33.4 30.3 59.3 63.8 59.3H324.6c33.5 0 61.3-25.9 63.8-59.3L412.4 128H424c13.3 0 24-10.7 24-24s-10.7-24-24-24h-8H367.9 354.2z" fill="currentColor"></path>
                      </svg>
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-headline-6 font-semibold mb-2 block">มหาวิทยาลัย</label>
                        <select 
                          className="w-full p-2 border rounded-lg text-body-large "
                          value={target.university}
                          onChange={(e) => updateTarget(index, "university", e.target.value)}
                        >
                          <option>เลือกมหาวิทยาลัย</option>
                          <option>จุฬาลงกรณ์มหาวิทยาลัย</option>
                          <option>มหาวิทยาลัยธรรมศาสตร์</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-headline-6 mb-2 block">คณะ</label>
                        <select 
                          className="w-full p-2 border rounded-lg text-body-large"
                          value={target.faculty}
                          onChange={(e) => updateTarget(index, "faculty", e.target.value)}
                        >
                          <option>เลือกคณะ</option>
                          <option>วิศวกรรมศาสตร์</option>
                          <option>วิทยาศาสตร์</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-headline-6 font-semibold mb-2 block">สาขา</label>
                        <select 
                          className="w-full p-2 border rounded-lg text-body-large"
                          value={target.major}
                          onChange={(e) => updateTarget(index, "major", e.target.value)}
                        >
                          <option>เลือกสาขา</option>
                          <option>วิศวกรรมทั่วไป</option>
                          <option>วิศวกรรมคอมพิวเตอร์</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-headline-6 font-semibold mb-2 block">รูปแบบการรับ</label>
                        <select 
                          className="w-full p-2 border rounded-lg text-body-large"
                          value={target.examType}
                          onChange={(e) => updateTarget(index, "examType", e.target.value)}
                        >
                          <option>เลือกรูปแบบการรับ</option>
                          <option>เลือกสอบ TPAT3</option>
                          <option>เลือกสอบ GPAX</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                {targets.length < 2 && (
                    <div 
                        className="flex items-center border border-dashed border-gray-400 rounded-lg py-3 px-4 cursor-pointer text-primary-600 text-center mt-4"
                        onClick={addTarget}
                    >
                        <span className="mx-auto text-headline-6">+ เพิ่มเป้าหมายที่ต้องการเลือก</span>
                    </div>
                )}
              </div>

              {/* ปุ่ม "ขั้นตอนต่อไป" */}
              <div className="flex justify-center mt-6">
                <button 
                  className="mt-10 mb-10 bg-primary-600 text-white px-10 py-3 rounded-lg hover:bg-primary-700 transition text-big-button w-120"
                  onClick={handleNextClick}
                >
                  ขั้นตอนต่อไป
                </button>
              </div>
            </div>
      </div>
    </>
  );
}

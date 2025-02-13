'use client';
import React, { useState } from 'react';
import { Navbar, Footer, EditButtons, InputField, ScoreInput } from '@/components/index';


const Calculator = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // เก็บสถานะขั้นตอนปัจจุบัน
  const [targets, setTargets] = useState<{ university: string; faculty: string; major: string; examType: string; }[]>([]);

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

  const [formData, setFormData] = useState({
    username: 'Example.username',
    email: 'example@email.com',
    major: 'วิทย์-คณิต',
    talent: 'การเขียนโปรแกรมคอมพิวเตอร์',
    interests: 'สนใจทางด้าน AI และ Data Science',
    GPAX: '4.00',
    TGAT1: '5',
    TGAT2: '',
    TGAT3: '',
    TPAT2_1: '',
    TPAT2_2: '',
    TPAT2_3: '',
    TPAT3: '',
    TPAT4: '',
    TPAT5: '',
    A_MATH1: '',
    A_MATH2: '',
    A_SCIENCE: '',
    A_PHYSIC: '',
    A_BIOLOGY: '',
    A_CHEMISTRY: '',
    A_SOCIAL: '',
    A_THAI: '',
    A_ENGLISH: '',
    A_FRANCE: '',
    A_GERMANY: '',
    A_JAPAN: '',
    A_PALI: '',
    A_CHINESE: '',
    A_KOREAN: '',
    A_SPANISH: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [isEditing, setIsEditing] = React.useState(false);

  if (isClicked) {
    return (
      <div className="relative h-screen flex flex-col items-center">
        <button 
          className="absolute top-20 left-20 flex items-center gap-2 transition text-lg font-medium group" 
          onClick={() => {
            setIsClicked(false);
            setCurrentStep(1); // รีเซ็ตเป็น Step 1
          }}
          
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" 
            className="w-6 h-6 text-black group-hover:text-primary-700 transition">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <div className="text-black text-headline-5 group-hover:text-primary-700 transition">กลับ</div>
        </button>

        {/* Step Indicator */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-40">
          {currentStep === 1 ? (
            <div className="flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-monochrome-50 border-2 border-primary-600 shadow-md">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white text-2xl font-bold">1</span>
              <span className="text-headline-5 font-medium">เลือกเป้าหมาย</span>
            </div>
          ) : (
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary-600 text-2xl font-bold border-2 border-primary-600">1</span>
          )}
          <div className="h-1 w-72 bg-primary-600"></div>

          {currentStep === 2 ? (
            <div className="flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-monochrome-50 border-2 border-primary-600 shadow-md">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white text-2xl font-bold">2</span>
              <span className="text-headline-5 font-medium">กรอกคะแนนสอบ</span>
            </div>
          ) : (
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary-600 text-2xl font-bold border-2 border-primary-600">2</span>
          )}
          <div className="h-1 w-72 bg-primary-600"></div>

          {currentStep === 3 ? (
            <div className="flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-monochrome-50 border-2 border-primary-600 shadow-md">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white text-2xl font-bold">3</span>
              <span className="text-headline-5 font-medium">ดูผลและเป้าหมาย</span>
            </div>
          ) : (
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary-600 text-2xl font-bold border-2 border-primary-600">3</span>
          )}
        </div>

        {/* ส่วน Step 1 ด้านบนกล่องเลือกเป้าหมาย */}
          {currentStep === 1 && (
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
              <div className="bg-white w-[800px] p-6 rounded-lg shadow-lg border border-gray-300 mt-10">
                <h2 className="text-headline-5 font-semibold text-black mb-4">
                  คำนวณโอกาสสอบติดจากเป้าหมายที่เลือก (สูงสุด 3 เป้าหมาย)
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
                        <label className="text-sm font-semibold">มหาวิทยาลัย</label>
                        <select 
                          className="w-full p-2 border rounded-lg"
                          value={target.university}
                          onChange={(e) => updateTarget(index, "university", e.target.value)}
                        >
                          <option>เลือกมหาวิทยาลัย</option>
                          <option>จุฬาลงกรณ์มหาวิทยาลัย</option>
                          <option>มหาวิทยาลัยธรรมศาสตร์</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-semibold">คณะ</label>
                        <select 
                          className="w-full p-2 border rounded-lg"
                          value={target.faculty}
                          onChange={(e) => updateTarget(index, "faculty", e.target.value)}
                        >
                          <option>เลือกคณะ</option>
                          <option>วิศวกรรมศาสตร์</option>
                          <option>วิทยาศาสตร์</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-semibold">สาขา</label>
                        <select 
                          className="w-full p-2 border rounded-lg"
                          value={target.major}
                          onChange={(e) => updateTarget(index, "major", e.target.value)}
                        >
                          <option>เลือกสาขา</option>
                          <option>วิศวกรรมทั่วไป</option>
                          <option>วิศวกรรมคอมพิวเตอร์</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-semibold">รูปแบบการรับ</label>
                        <select 
                          className="w-full p-2 border rounded-lg"
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
                <div 
                  className="flex items-center border border-dashed border-gray-400 rounded-lg py-3 px-4 cursor-pointer text-primary-600 text-center mt-4"
                  onClick={addTarget}
                >
                  <span className="mx-auto text-headline-6">+ เพิ่มเป้าหมายที่ต้องการเลือก</span>
                </div>
              </div>

              {/* ปุ่ม "ขั้นตอนต่อไป" */}
              <div className="flex justify-center mt-6">
                <button 
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
                  onClick={() => setCurrentStep(2)} // อัปเดตเป็น Step 2
                >
                  ขั้นตอนต่อไป
                </button>
              </div>
            </div>
          )}


        {/* Step 2: กรอกคะแนนสอบ */}
        {currentStep === 2 && (
          <div> 
            <div className="flex items-center gap-4 w-[800px] mb-4 mt-10">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white text-2xl font-bold">
                2
              </span>
              <span className="text-headline-5 font-medium text-black">
                 กรอกคะแนนสอบ
              </span>
            </div>
            <div className="bg-white w-[1500px] p-6 rounded-lg shadow-lg border border-gray-300 mt-10">
              <div className="text-monochrome-300 text-headline-6 mt-3 relative flex items-center whitespace-nowrap">
                TGAT ความถนัดทั่วไป
                <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-6">
                <ScoreInput label="TGAT1 การสื่อสารภาษาอังกฤษ" value={formData.TGAT1} onChange={handleChange} isEditing={isEditing} name="TGAT1" />
                <ScoreInput label="TGAT2 การคิดอย่างมีเหตุผล" value={formData.TGAT2} onChange={handleChange} isEditing={isEditing} name="TGAT2" />
                <ScoreInput label="TGAT3 สมรรถนะการทำงานในอนาคต" value={formData.TGAT3} onChange={handleChange} isEditing={isEditing} name="TGAT3" />
              </div>
              <div className="text-monochrome-300 text-headline-6 mt-10 relative flex items-center whitespace-nowrap">
              TPAT ความถนัดทางวิชาชีพ
                <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-6">
                <ScoreInput label="TPAT2.1 ความถนัดศิลปกรรมศาสตร์ ทัศนศิลป์" value={formData.TPAT2_1} onChange={handleChange} isEditing={isEditing} name="TPAT2_1" />
                <ScoreInput label="TPAT2.2 ความถนัดศิลปกรรมศาสตร์ ดนตรี" value={formData.TPAT2_2} onChange={handleChange} isEditing={isEditing} name="TGPAT2_2" />
                <ScoreInput label="TPAT2.3 ความถนัดศิลปกรรมศาสตร์ นาฏศิลป์" value={formData.TPAT2_3} onChange={handleChange} isEditing={isEditing} name="TPAT2_3" />
                <ScoreInput label="TPAT3 ความถนัดด้านวิทยาศาสตร์ เทคโนโลยี และ.." value={formData.TPAT3} onChange={handleChange} isEditing={isEditing} name="TPAT3" />
                <ScoreInput label="TPAT4 ความถนัดทางสถาปัตยกรรม" value={formData.TPAT4} onChange={handleChange} isEditing={isEditing} name="TPAT4" />
                <ScoreInput label="TPAT5 ความถนัดครุศาสตร์-ศึกษาศาสตร์" value={formData.TPAT5} onChange={handleChange} isEditing={isEditing} name="TPAT5" />
              </div>
              <div className="text-monochrome-300 text-headline-6 mt-10 relative flex items-center whitespace-nowrap">
                A - Level
                <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-6">
                <ScoreInput label="A-Level คณิตศาสตร์ประยุกต์ 1" value={formData.A_MATH1} onChange={handleChange} isEditing={isEditing} name="A_MATH1" />
                <ScoreInput label="A-Level คณิตศาสตร์ประยุกต์ 2" value={formData.A_MATH2} onChange={handleChange} isEditing={isEditing} name="A_MATH2" />
                <ScoreInput label="A-Level วิทยาศาสตร์ประยุกต์" value={formData.A_SCIENCE} onChange={handleChange} isEditing={isEditing} name="A_SCIENCE" />
                <ScoreInput label="A-Level ฟิสิกส์" value={formData.A_PHYSIC} onChange={handleChange} isEditing={isEditing} name="A_PHYSIC" />
                <ScoreInput label="A-Level เคมี" value={formData.A_CHEMISTRY} onChange={handleChange} isEditing={isEditing} name="A_CHEMISTRY" />
                <ScoreInput label="A-Level ชีววิทยา" value={formData.A_BIOLOGY} onChange={handleChange} isEditing={isEditing} name="A_BIOLOGY" />
                <ScoreInput label="A-Level สังคมศึกษา" value={formData.A_SOCIAL} onChange={handleChange} isEditing={isEditing}  name="A_SOCIAL" />
                <ScoreInput label="A-Level ภาษาไทย" value={formData.A_THAI} onChange={handleChange} isEditing={isEditing}  name="A_THAI" />
                <ScoreInput label="A-Level ภาษาอังกฤษ" value={formData.A_ENGLISH} onChange={handleChange} isEditing={isEditing}  name="A_ENGLISH" />
                <ScoreInput label="A-Level ภาษาฝรั่งเศส" value={formData.A_FRANCE} onChange={handleChange} isEditing={isEditing}  name="A_FRANCE" />
                <ScoreInput label="A-Level ภาษาเยอรมัน" value={formData.A_GERMANY} onChange={handleChange} isEditing={isEditing}  name="A_GERMANY"/>
                <ScoreInput label="A-Level ภาษาญี่ปุ่น" value={formData.A_JAPAN} onChange={handleChange} isEditing={isEditing}  name="A_JAPAN" />
                <ScoreInput label="A-Level ภาษาเกาหลี" value={formData.A_KOREAN} onChange={handleChange} isEditing={isEditing}  name="A_KOREAN" />
                <ScoreInput label="A-Level ภาษาจีน" value={formData.A_CHINESE} onChange={handleChange} isEditing={isEditing}  name="A_CHINESE" />
                <ScoreInput label="A-Level ภาษาบาลี" value={formData.A_PALI} onChange={handleChange} isEditing={isEditing}  name="A_PALI" />
                <ScoreInput label="A-Level ภาษาสเปน" value={formData.A_SPANISH} onChange={handleChange} isEditing={isEditing}  name="A_SPANISH" />
              </div>
            </div>
            
            {/* ปุ่ม "ขั้นตอนต่อไป" */}
            <div className="flex justify-center mt-6">
                <button 
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
                  onClick={() => setCurrentStep(3)} // อัปเดตเป็น Step 3
                >
                  คำนวณคะแนน
                </button>
              </div>
          </div>
        )}

        {/* Step 3: กรอกคะแนนสอบ */}
        {currentStep === 3 && (
          <div> 
            <div className="flex items-center gap-4 w-[800px] mb-4 mt-10">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white text-2xl font-bold">
                3
              </span>
              <span className="text-headline-5 font-medium text-black">
                 ผลการคำนวณ
              </span>
            </div>
            <div className="bg-white w-[1500px] p-6 rounded-lg shadow-lg border border-gray-300 mt-10">
              {/* ด้านซ้าย: รายละเอียดคณะและคะแนน */}
            <div className="w-2/3">
              <div className="flex items-start">
                <div className="w-1 bg-primary-600 h-20 mr-2"></div> 
                <div className="w-2/3 ml-1.5">
                  <h2 className="text-xl font-bold text-primary-600">คณะวิศวกรรมศาสตร์</h2>
                  <p className="text-monochrome-700">จุฬาลงกรณ์มหาวิทยาลัย</p>
                  <p className="text-monochrome-700">วิศวกรรมทั่วไป</p>
                  <p className="text-monochrome-500 text-sm">คณะวิศวกรรมศาสตร์ สาขาวิชาวิศวกรรมทั่วไป</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                {/* จำนวนที่รับ */}
                <div className="flex items-center text-gray-700">
                  <span>จำนวนที่รับ :</span>
                  <span className="text-primary-600 font-bold ml-1">380</span>
                </div>

                {/* ปุ่มคุณสมบัติพื้นฐาน */}
                <button className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition">
                  <span>คุณสมบัติพื้นฐาน</span>
                </button>

                {/* ปุ่มเงื่อนไขคะแนนขั้นต่ำ */}
                <button className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition">
                  <span>เงื่อนไขคะแนนขั้นต่ำ</span>
                </button>
              </div>

              <div className="mt-6">
                    {/* หัวข้อพร้อมไอคอน */}
                    <div className="flex items-center w-full">
                      <h3 className="font-semibold text-lg text-gray-800 whitespace-nowrap">วิธีการคำนวณคะแนน</h3>
                      <div className="flex-grow border-b border-gray-300 ml-3"></div>
                    </div>

                    {/* รายการคะแนน */}
                    <ul className="text-gray-700 mt-3 space-y-5">
                      <li className="flex justify-between">
                        <span>TGAT1 การสื่อสารภาษาอังกฤษ</span>
                        <span className="font-medium">30 %</span>
                      </li>
                      <li className="flex justify-between">
                        <span>TGAT2 การคิดอย่างมีเหตุผล</span>
                        <span className="font-medium">10 %</span>
                      </li>
                      <li className="flex justify-between">
                        <span>TGAT3 สมรรถนะการทำงานในอนาคต</span>
                        <span className="font-medium">10 %</span>
                      </li>
                      <li className="flex justify-between">
                        <span>TPAT3 ความถนัดด้านวิทยาศาสตร์ เทคโนโลยี และวิศวกรรมศาสตร์</span>
                        <span className="font-medium">50 %</span>
                      </li>
                    </ul>
                </div>
            </div>

            </div>
            {/* ปุ่ม "ขั้นตอนต่อไป" */}
            <div className="flex justify-center mt-6">
                <button 
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
                  onClick={() => setCurrentStep(4)} // อัปเดตเป็น Step 3
                >
                  คกลง
                </button>
              </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="calculator-page">
      <div className="flex flex-col items-center bg-gray-50 py-10 px-4 rounded-lg shadow-md w-full border-b-2 border-primary-600">
        <div className="flex items-center gap-6 mb-8">
          <div className="logo w-64">
            <img src="/images/logofooter.avif" alt="Learntor Logo" className="" />
          </div>
          <div className="text-left" style={{ lineHeight: '1.8' }}>
            <h1 className="text-headline-2 font-bold text-monochrome-900">การคำนวณคะแนน TCAS</h1>
            <p className="text-headline-4 text-gray-600 mt-2">
              ฟีเจอร์ที่ช่วยคำนวณคะแนน และวิเคราะห์โอกาสสอบติด TCAS ให้กับน้อง ๆ
            </p>
          </div>
        </div>

        {/* แสดง Step Indicator */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
          <div className="flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-monochrome-50 border-2 border-primary-600 shadow-md">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white text-2xl font-bold">1</span>
            <span className="text-headline-5 font-medium">เลือกเป้าหมาย</span>
          </div>
          <div className="h-1 w-72 bg-primary-600"></div>
          <div className="flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-monochrome-50 border-2 border-primary-600 shadow-md">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white text-2xl font-bold">2</span>
            <span className="text-headline-5 font-medium">กรอกคะแนนสอบ</span>
          </div>
          <div className="h-1 w-72 bg-primary-600"></div>
          <div className="flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-monochrome-50 border-2 border-primary-600 shadow-md">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white text-2xl font-bold">3</span>
            <span className="text-headline-5 font-medium">ดูผลและเป้าหมาย</span>
          </div>
        </div>
      </div>

      {/* ส่วนของการคำนวณคะแนน */}
      <div className="flex flex-col w-full">
        <div className="text-headline-4 font-semibold text-monochrome-900 px-20 py-10 self-start">
          การคำนวณคะแนนของฉัน
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="bg-white w-[1500px] h-[300px] rounded-lg shadow-md flex flex-col items-center justify-center p-12 border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-20 h-20 mb-4 text-primary-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 014-4h10a4 4 0 014 4v1a4 4 0 01-4 4H7a4 4 0 01-4-4v-1z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>

            <p className="text-monochrome-500 text-center text-headline-5">
              ตอนนี้คุณยังไม่มีบันทึกการคำนวณคะแนน
            </p>
          </div>

          {/* ปุ่มที่กดแล้วเปลี่ยนเป็น "hello" */}
          <button 
            className="mt-10 bg-primary-600 text-white px-10 py-3 rounded-lg hover:bg-primary-700 transition text-big-button w-120"
            onClick={() => setIsClicked(true)}
          >
            คำนวณคะแนน TCAS
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;

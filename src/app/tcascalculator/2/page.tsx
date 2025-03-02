'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Navbar, Footer, Calculator, Inputcalculator } from '@/components/index';


export default function Calculator2(){
    const router = useRouter();

    const handleBackClick = () => {
      router.push('/tcascalculator/1');
    };
  
    const handleNextClick = () => {
      router.push('/tcascalculator/3');
    };

    const [formData, setFormData] = useState({
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
        A_MATH1: '50',
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
    
      // ฟังก์ชันอัปเดตคะแนน
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    };
    
    const [isEditing, setIsEditing] = React.useState(false);

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
            

            {/* เส้น Step 2 */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-40">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary-600 text-2xl font-bold border-2 border-primary-600">
                    1
                </span>
                <div className="h-1 w-72 bg-primary-600"></div>
                <div className="flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-monochrome-50 border-2 border-primary-600 shadow-md">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white text-2xl font-bold">
                    2
                    </span>
                    <span className="text-headline-5 font-medium">กรอกคะแนนสอบ</span>
                </div>
                <div className="h-1 w-72 bg-primary-600"></div>
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary-600 text-2xl font-bold border-2 border-primary-600">
                    3
                </span>
            </div>

            <div> 
                <div className="flex items-center gap-4 w-[800px] mb-4 mt-10">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white text-2xl font-bold">
                    2
                </span>
                <span className="text-headline-5 font-medium text-black">
                    กรอกคะแนนสอบ
                </span>
                </div>
                <div className="bg-white w-full max-w-screen-xl p-6 rounded-lg shadow-lg border border-gray-300 mt-10 overflow-x-auto">
                <div className="text-monochrome-800 text-headline-6 mt-3 relative flex items-center whitespace-nowrap">
                    TGAT ความถนัดทั่วไป
                    <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">
                    <Inputcalculator label="TGAT1 การสื่อสารภาษาอังกฤษ" value={formData.TGAT1} onChange={handleChange}  name="TGAT1" />
                    <Inputcalculator label="TGAT2 การคิดอย่างมีเหตุผล" value={formData.TGAT2} onChange={handleChange}  name="TGAT2" />
                    <Inputcalculator label="TGAT3 สมรรถนะการทำงานในอนาคต" value={formData.TGAT3} onChange={handleChange}  name="TGAT3" />
                </div>
                <div className="text-monochrome-800 text-headline-6 mt-10 relative flex items-center whitespace-nowrap">
                TPAT ความถนัดทางวิชาชีพ
                    <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">
                    <Inputcalculator label="TPAT2.1 ความถนัดศิลปกรรมศาสตร์ ทัศนศิลป์" value={formData.TPAT2_1} onChange={handleChange}  name="TPAT2_1" />
                    <Inputcalculator label="TPAT2.2 ความถนัดศิลปกรรมศาสตร์ ดนตรี" value={formData.TPAT2_2} onChange={handleChange}  name="TPAT2_2" />
                    <Inputcalculator label="TPAT2.3 ความถนัดศิลปกรรมศาสตร์ นาฏศิลป์" value={formData.TPAT2_3} onChange={handleChange}  name="TPAT2_3" />
                    <Inputcalculator label="TPAT3 ความถนัดด้านวิทยาศาสตร์ เทคโนโลยี และ.." value={formData.TPAT3} onChange={handleChange}  name="TPAT3" />
                    <Inputcalculator label="TPAT4 ความถนัดทางสถาปัตยกรรม" value={formData.TPAT4} onChange={handleChange}  name="TPAT4" />
                    <Inputcalculator label="TPAT5 ความถนัดครุศาสตร์-ศึกษาศาสตร์" value={formData.TPAT5} onChange={handleChange}  name="TPAT5" />
                </div>
                <div className="text-monochrome-800 text-headline-6 mt-10 relative flex items-center whitespace-nowrap">
                    A - Level
                    <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">
                    <Inputcalculator label="A-Level คณิตศาสตร์ประยุกต์ 1" value={formData.A_MATH1} onChange={handleChange}  name="A_MATH1" />
                    <Inputcalculator label="A-Level คณิตศาสตร์ประยุกต์ 2" value={formData.A_MATH2} onChange={handleChange}  name="A_MATH2" />
                    <Inputcalculator label="A-Level วิทยาศาสตร์ประยุกต์" value={formData.A_SCIENCE} onChange={handleChange}  name="A_SCIENCE" />
                    <Inputcalculator label="A-Level ฟิสิกส์" value={formData.A_PHYSIC} onChange={handleChange}  name="A_PHYSIC" />
                    <Inputcalculator label="A-Level เคมี" value={formData.A_CHEMISTRY} onChange={handleChange}  name="A_CHEMISTRY" />
                    <Inputcalculator label="A-Level ชีววิทยา" value={formData.A_BIOLOGY} onChange={handleChange}  name="A_BIOLOGY" />
                    <Inputcalculator label="A-Level สังคมศึกษา" value={formData.A_SOCIAL} onChange={handleChange}   name="A_SOCIAL" />
                    <Inputcalculator label="A-Level ภาษาไทย" value={formData.A_THAI} onChange={handleChange}   name="A_THAI" />
                    <Inputcalculator label="A-Level ภาษาอังกฤษ" value={formData.A_ENGLISH} onChange={handleChange}   name="A_ENGLISH" />
                    <Inputcalculator label="A-Level ภาษาฝรั่งเศส" value={formData.A_FRANCE} onChange={handleChange}   name="A_FRANCE" />
                    <Inputcalculator label="A-Level ภาษาเยอรมัน" value={formData.A_GERMANY} onChange={handleChange}   name="A_GERMANY"/>
                    <Inputcalculator label="A-Level ภาษาญี่ปุ่น" value={formData.A_JAPAN} onChange={handleChange}   name="A_JAPAN" />
                    <Inputcalculator label="A-Level ภาษาเกาหลี" value={formData.A_KOREAN} onChange={handleChange}   name="A_KOREAN" />
                    <Inputcalculator label="A-Level ภาษาจีน" value={formData.A_CHINESE} onChange={handleChange}   name="A_CHINESE" />
                    <Inputcalculator label="A-Level ภาษาบาลี" value={formData.A_PALI} onChange={handleChange}   name="A_PALI" />
                    <Inputcalculator label="A-Level ภาษาสเปน" value={formData.A_SPANISH} onChange={handleChange}   name="A_SPANISH" />
                </div>
                </div>
                
                {/* ปุ่ม "ขั้นตอนต่อไป" */}
                <div className="flex justify-center mt-6">
                    <button 
                    className="mt-10 mb-10 bg-primary-600 text-white px-10 py-3 rounded-lg hover:bg-primary-700 transition text-big-button w-120"
                    onClick={handleNextClick}
                    >
                    คำนวณคะแนน
                    </button>
                </div>
            </div>
            </div>
        </>
    );
}
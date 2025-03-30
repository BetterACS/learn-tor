'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Navbar, Footer, ScoreInput, EditButtons } from '@/components/index';
import { trpc } from '@/app/_trpc/client';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

interface CustomSession {
  user?: {
    id?: string;
    username?: string;
    email?: string;
  };
}

interface FormData {
  GPAX: string;
  TGAT1: string;
  TGAT2: string;
  TGAT3: string;
  TPAT2_1: string;
  TPAT2_2: string;
  TPAT2_3: string;
  TPAT3: string;
  TPAT4: string;
  TPAT5: string;
  A_MATH1: string;
  A_MATH2: string;
  A_SCIENCE: string;
  A_PHYSIC: string;
  A_BIOLOGY: string;
  A_CHEMISTRY: string;
  A_SOCIAL: string;
  A_THAI: string;
  A_ENGLISH: string;
  A_FRANCE: string;
  A_GERMANY: string;
  A_JAPAN: string;
  A_PALI: string;
  A_CHINESE: string;
  A_KOREAN: string;
  A_SPANISH: string;
}

const initialFormData: FormData = {
  GPAX: '',
  TGAT1: '',
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
};
  

export default function Calculator2() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { data: session } = useSession() as { data: CustomSession | null };
  const { data: scoreData, isLoading, error } = trpc.queryScore.useQuery(
    { email: session?.user?.email || '' },
    { enabled: !!session?.user?.email }
  );
  const [isEditing, setIsEditing] = useState(false);

  const searchParams = useSearchParams(); // ดึง search params จาก URL
  const university = searchParams.get('university');
  const campus = searchParams.get('campus');
  const faculty = searchParams.get('faculty');
  const major = searchParams.get('major');
  const language = searchParams.get('language');
  const examType = searchParams.get('examType');

  console.log(university, campus, faculty, major, language, examType); // เช็คค่าที่ดึงมา

  useEffect(() => {
    if (scoreData) {
      const { __v, _id, user_id, SPEACIAL, ...scores } = scoreData;
      setFormData((prev) => ({
        ...prev,
        ...scores,
      }));
    }
  }, [scoreData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const mutation = trpc.addScore.useMutation();

  const handleSaveClick = async () => {
    if (!session?.user?.email) {
      console.error('ไม่พบอีเมลของผู้ใช้');
      return;
    }
  
    try {
      const scoreResult = await mutation.mutateAsync({
        email: session.user.email,
        scores: formData,
      });
  
      console.log('Data saved successfully:', scoreResult);
    } catch (err) {
      console.error('Error saving data:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen flex flex-col items-center">
        <button
          className="absolute top-20 left-20 flex items-center gap-2 transition text-lg font-medium group"
          onClick={() => router.push('/tcascalculator/1')}
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

        {/* Step bar */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-40">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary-600 text-2xl font-bold border-2 border-primary-600">1</span>
          <div className="h-1 w-72 bg-primary-600"></div>
          <div className="flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-monochrome-50 border-2 border-primary-600 shadow-md">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white text-2xl font-bold">2</span>
            <span className="text-headline-5 font-medium">กรอกคะแนนสอบ</span>
          </div>
          <div className="h-1 w-72 bg-primary-600"></div>
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary-600 text-2xl font-bold border-2 border-primary-600">3</span>
        </div>

        <div className="w-full max-w-screen-xl mt-10 px-6">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 overflow-x-auto">
            <div className="text-monochrome-800 text-headline-6 mt-3 relative flex items-center whitespace-nowrap">
              TGAT ความถนัดทั่วไป
              <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">
              <ScoreInput label="TGAT1 การสื่อสารภาษาอังกฤษ" value={formData.TGAT1} onChange={handleChange} isEditing={isEditing} name="TGAT1" />
              <ScoreInput label="TGAT2 การคิดอย่างมีเหตุผล" value={formData.TGAT2} onChange={handleChange} isEditing={isEditing} name="TGAT2" />
              <ScoreInput label="TGAT3 สมรรถนะการทำงานในอนาคต" value={formData.TGAT3} onChange={handleChange} isEditing={isEditing} name="TGAT3" />
            </div>

            <div className="text-monochrome-800 text-headline-6 mt-10 relative flex items-center whitespace-nowrap">
              TPAT ความถนัดทางวิชาชีพ
              <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">
              <ScoreInput label="TPAT2.1 ความถนัดศิลปกรรมศาสตร์ ทัศนศิลป์" value={formData.TPAT2_1} onChange={handleChange} isEditing={isEditing} name="TPAT2_1" />
              <ScoreInput label="TPAT2.2 ความถนัดศิลปกรรมศาสตร์ ดนตรี" value={formData.TPAT2_2} onChange={handleChange} isEditing={isEditing} name="TPAT2_2" />
              <ScoreInput label="TPAT2.3 ความถนัดศิลปกรรมศาสตร์ นาฏศิลป์" value={formData.TPAT2_3} onChange={handleChange} isEditing={isEditing} name="TPAT2_3" />
              <ScoreInput label="TPAT3 ความถนัดด้านวิทยาศาสตร์ เทคโนโลยี และ.." value={formData.TPAT3} onChange={handleChange} isEditing={isEditing} name="TPAT3" />
              <ScoreInput label="TPAT4 ความถนัดทางสถาปัตยกรรม" value={formData.TPAT4} onChange={handleChange} isEditing={isEditing} name="TPAT4" />
              <ScoreInput label="TPAT5 ความถนัดครุศาสตร์-ศึกษาศาสตร์" value={formData.TPAT5} onChange={handleChange} isEditing={isEditing} name="TPAT5" />
            </div>

            <div className="text-monochrome-800 text-headline-6 mt-10 relative flex items-center whitespace-nowrap">
                A - Level
                <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">
              <ScoreInput label="A-Level คณิตศาสตร์ประยุกต์ 1" value={formData.A_MATH1} onChange={handleChange} isEditing={isEditing} name="A_MATH1" />
              <ScoreInput label="A-Level คณิตศาสตร์ประยุกต์ 2" value={formData.A_MATH2} onChange={handleChange} isEditing={isEditing} name="A_MATH2" />
              <ScoreInput label="A-Level วิทยาศาสตร์ประยุกต์" value={formData.A_SCIENCE} onChange={handleChange} isEditing={isEditing} name="A_SCIENCE" />
              <ScoreInput label="A-Level ฟิสิกส์" value={formData.A_PHYSIC} onChange={handleChange} isEditing={isEditing} name="A_PHYSIC" />
              <ScoreInput label="A-Level เคมี" value={formData.A_CHEMISTRY} onChange={handleChange} isEditing={isEditing} name="A_CHEMISTRY" />
              <ScoreInput label="A-Level ชีววิทยา" value={formData.A_BIOLOGY} onChange={handleChange} isEditing={isEditing} name="A_BIOLOGY" />
              <ScoreInput label="A-Level สังคมศึกษา" value={formData.A_SOCIAL} onChange={handleChange} isEditing={isEditing} name="A_SOCIAL" />
              <ScoreInput label="A-Level ภาษาไทย" value={formData.A_THAI} onChange={handleChange} isEditing={isEditing} name="A_THAI" />
              <ScoreInput label="A-Level ภาษาอังกฤษ" value={formData.A_ENGLISH} onChange={handleChange} isEditing={isEditing} name="A_ENGLISH" />
              <ScoreInput label="A-Level ภาษาฝรั่งเศส" value={formData.A_FRANCE} onChange={handleChange} isEditing={isEditing} name="A_FRANCE" />
              <ScoreInput label="A-Level ภาษาเยอรมัน" value={formData.A_GERMANY} onChange={handleChange} isEditing={isEditing} name="A_GERMANY" />
              <ScoreInput label="A-Level ภาษาญี่ปุ่น" value={formData.A_JAPAN} onChange={handleChange} isEditing={isEditing} name="A_JAPAN" />
              <ScoreInput label="A-Level ภาษาเกาหลี" value={formData.A_KOREAN} onChange={handleChange} isEditing={isEditing} name="A_KOREAN" />
              <ScoreInput label="A-Level ภาษาจีน" value={formData.A_CHINESE} onChange={handleChange} isEditing={isEditing} name="A_CHINESE" />
              <ScoreInput label="A-Level ภาษาบาลี" value={formData.A_PALI} onChange={handleChange} isEditing={isEditing} name="A_PALI" />
              <ScoreInput label="A-Level ภาษาสเปน" value={formData.A_SPANISH} onChange={handleChange} isEditing={isEditing} name="A_SPANISH" />
            </div>

          </div>

          <div className="flex justify-center mt-6">
            <div className="flex justify-center items-center m-10">
              <EditButtons isEditing={isEditing} onEditClick={handleEditClick} onCancelClick={handleCancelClick} onSaveClick={handleSaveClick} />
            </div>
            <button
              className="mt-16 bg-primary-600 text-white max-h-[43px] px-10 py-3 rounded-lg hover:bg-primary-700 transition text-big-button w-120"
              onClick={() => router.push('/tcascalculator/3')}
            >
              คำนวณคะแนน
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

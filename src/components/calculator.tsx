'use client';
import React, { useState, useEffect } from 'react';
import { ResultCalculator } from '@/components/index';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { trpc } from '@/app/_trpc/client';


const Calculator = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [showResult, setShowResult] = useState(false);

  const { data: resultData, isLoading, error } = trpc.queryResult.useQuery(
    { email: session?.user?.email || '' }, 
    { enabled: !!session?.user?.email } 
  );
  
  useEffect(() => {
    if (resultData?.data?.length) {
      setShowResult(true); 
    }
  }, [resultData]);

  const handleClick = () => {
    router.push('/tcascalculator/1');
  };

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
          {/* แสดงปุ่มคำนวณคะแนนก่อนถ้ามีผลลัพธ์ */}
          {showResult && (
            <button
              className="mt-6 mb-6 bg-primary-600 text-white px-10 py-3 rounded-lg hover:bg-primary-700 transition text-big-button w-120"
              onClick={handleClick}
            >
              คำนวณคะแนน TCAS
            </button>
          )}

          {/* แสดงผลลัพธ์การคำนวณคะแนน */}
          {showResult ? (
            resultData.data.map((result: any) => (
              <ResultCalculator key={result._id} resultId={result._id} hideConfirmButton={true} />
            ))
          ) : (
            <div className="bg-white w-full max-w-[1300px] h-auto md:h-[300px] rounded-lg shadow-md flex flex-col items-center justify-center p-6 md:p-12 border border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-20 h-20 mb-4 text-primary-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 014-4h10a4 4 0 014 4v1a4 4 0 01-4 4H7a4 4 0 01-4-4v-1z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>

              <p className="text-monochrome-500 text-center text-headline-5">
                ตอนนี้คุณยังไม่มีบันทึกการคำนวณคะแนน
              </p>
            </div>
          )}

          {/* แสดงปุ่มคำนวณคะแนนในกรณีที่ไม่มีผลลัพธ์ */}
          {!showResult && (
            <button 
              className="mt-10 mb-10 bg-primary-600 text-white px-10 py-3 rounded-lg hover:bg-primary-700 transition text-big-button w-120"
              onClick={handleClick}
            >
              คำนวณคะแนน TCAS
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;

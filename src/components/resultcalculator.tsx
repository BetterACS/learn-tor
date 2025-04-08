'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { trpc } from '@/app/_trpc/client';
import { AlertBox } from '@/components/index';

const SemiCircleProgressBar = ({ score }: { score: number }) => {
  const getGradientColor = (score: number) => {
    if (score <= 50) {
      const green = Math.floor((200 * score) / 50);
      return `rgb(200, ${green}, 0)`;
    } else {
      const red = Math.floor(200 - (200 * (score - 50)) / 50);
      return `rgb(${red}, 200, 0)`;
    }
  };

  return (
    <div className="relative w-full h-32 flex flex-col items-center">
      <svg viewBox="0 0 100 50" className="w-full h-full">
        <defs>
          <linearGradient id="gradient" gradientUnits="userSpaceOnUse" x1="10" y1="50" x2="90" y2="50">
            <stop offset="0%" stopColor={getGradientColor(score)} />
            <stop offset="100%" stopColor={getGradientColor(score)} />
          </linearGradient>
        </defs>
        <path
          d="M 10 50 A 40 40 0 1 1 90 50"
          fill="none"
          stroke="#ddd"
          strokeWidth="10"
        />
        <path
          d="M 10 50 A 40 40 0 1 1 90 50"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="10"
          strokeDasharray="126.92"
          strokeDashoffset={126.92 - (126.92 * score) / 100}
          strokeLinecap="round"
        />
        <text x="50" y="40" textAnchor="middle" fontSize="12" fontWeight="bold" fill={getGradientColor(score)}>
          {score.toFixed(2)}
        </text>
      </svg>
    </div>
  );
};

const RectangularProgressBar = ({ score, chance }: { score: number, chance: number }) => {
  const getGradientColor = (score: number) => {
    if (score <= 50) {
      const green = Math.floor((200 * score) / 50);
      return `rgb(200, ${green}, 0)`; 
    } else if (score <= 100) {
      const red = Math.floor(200 - (200 * (score - 50)) / 50);
      return `rgb(${red}, 200, 0)`;  
    } else {
      return `rgb(0, 205, 0)`; 
    }
  };

  return (
    <div className="relative w-full h-8 flex flex-col items-center">
      {/* ข้อความแสดงโอกาสสอบติด */}
      {/* <p className="mt-2 text-headline-5 font-bold text-center">
        คุณมีโอกาสสอบติด 
        <span className="text-primary-600 font-bold">
          {chance ? (chance * 100).toFixed(2) : "โอกาส"} %
        </span>
      </p> */}
      
      {/* กราฟแสดงผลคะแนน */}
      <div className="w-full h-6 bg-gray-300 rounded-lg">
        <div
          className="h-full rounded-lg"
          style={{
            width: `${score > 100 ? 100 : score}%`, 
            background: getGradientColor(score),
            transition: "width 0.5s ease-in-out", 
          }}
        />
      </div>
    </div>
  );
};

export default function ResultCalculator({ resultId, hideConfirmButton = false }: { resultId?: string, hideConfirmButton?: boolean }) {
  console.log("resultId ที่ส่งมา:", resultId);
  const router = useRouter();
  const [isBasicOpen, setIsBasicOpen] = useState(false);
  const [isScoreOpen, setIsScoreOpen] = useState(false);
  const [score, setScore] = useState(0); // เปลี่ยนค่าคะแนนได้
  const [chance, setChance] = useState(0);
  const [showDetails, setShowDetails] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [alertMessage, setAlertMessage] = useState('');

  const handleConfirmClick = () => {
    sessionStorage.setItem('calculationResult', 'true');
    router.replace('/tcascalculator');
  };

  const deleteResult = trpc.deleteResult.useMutation({
    onSuccess: () => {
      setIsDeleted(true);
    },
    onError: (error) => {
      console.error("Error deleting result:", error);
    },
  });

  const handleBackClick = () => {
    router.push('/tcascalculator/2');
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleDeleteClick = async () => {
    try {
      if (resultId) {
        // ลบผลลัพธ์จาก backend
        await deleteResult.mutateAsync({ result_id: resultId });

        setAlertType('success');
        setAlertMessage('ลบการคำนวณนี้สำเร็จ');
        setShowAlert(true);

        setTimeout(() => {
          window.location.reload(); // รีเฟรชหน้า
        }, 3000); 
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage('ไม่สามารถลบการคำนวณนี้ได้');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const showResult = trpc.showResult.useMutation();

  useEffect(() => {
    if (resultId) {
      showResult.mutate(
        { result_id: resultId },
        {
          onSuccess: (data) => {
            console.log("ได้ข้อมูลจาก tRPC:", data);
            if (data.status === 200) {
              setCalculationResult(data.data);

              if (data.data?.calculated_score) {
                const fixedScore = Number(data.data.calculated_score.toFixed(2));
                setScore(fixedScore);
              }

              if (data.data?.chance) {
                const fixedChance = Number(data.data.chance.toFixed(2));
                setChance(fixedChance);
              }
            }
          },
          onError: (err) => {
            console.error("เกิดข้อผิดพลาดตอนดึงข้อมูล result:", err);
          },
        }
      );
    }
  }, [resultId]);

  return (
    <>
      <div className="relative flex flex-col items-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4 w-[1100px]">
          </div>

          <div className="bg-white w-full max-w-screen-2xl p-10 rounded-lg shadow-lg border border-primary-600 mt-10 flex flex-col lg:flex-row">
            <div className="flex-grow">
              <div className="w-full lg:w-2/3">
                <div className="flex items-start">
                  <div className="w-1 bg-primary-600 h-24 mr-2"></div>
                  <div className="ml-1.5 space-y-1">
                    <h2 className="text-headline-5 font-bold text-primary-600">{calculationResult?.faculty || "ชื่อคณะ"}</h2>
                    <p className="text-headline-6 text-monochrome-700">{calculationResult?.institution || "ชื่อมหาวิทยาลัย"}</p>
                    <p className="text-headline-6 text-monochrome-700">{calculationResult?.program || "ภาควิชา"}</p>
                    <p className="text-body-large text-monochrome-500">{calculationResult?.admission_type|| "รูปแบบการรับ"}</p>
                  </div>
                </div>
                {!showDetails && (
                  <button
                    className="mt-10 bg-white text-primary-600 px-10 py-3 rounded-lg hover:bg-monochrome-100 transition text-big-button w-120 border border-primary-600"
                    onClick={handleDeleteClick}
                  >
                    ลบการคำนวณนี้
                  </button>
                )}
                {showDetails && (
                  <div className="flex items-center gap-8 mt-4">
                    <div className="flex items-center text-gray-700 text-headline-6">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-primary-600 mr-2">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 20c1-4 7-6 8-6s7 2 8 6" />
                      </svg>
                      <span>จำนวนที่รับ :</span>
                      <span className="text-primary-600 font-bold ml-2 ">{calculationResult?.admitted || "จำนวนรับ"}</span>
                    </div>

                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md border border-monochrome-200 bg-white text-gray-700 hover:bg-monochrome-100 transition"
                      onClick={() => setIsBasicOpen(true)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-gray-700">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      <span className='text-body-large'>คุณสมบัติพื้นฐาน</span>
                    </button>

                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md border border-monochrome-200 bg-white text-gray-700 hover:bg-monochrome-100 transition"
                      onClick={() => setIsScoreOpen(true)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-gray-700">
                        <text x="1" y="14" fontSize="10" fontWeight="bold" strokeWidth="0.5">100</text>
                        <line x1="1" y1="16" x2="18" y2="16" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      <span className='text-body-large'>เงื่อนไขคะแนนขั้นต่ำ</span>
                    </button>
                  </div>
                )}

                {showDetails && (
                  <div className="mt-6">
                    <div className="flex items-center w-full">
                      <h3 className="font-semibold text-monochrome-700 whitespace-nowrap text-headline-5">วิธีการคำนวณคะแนน</h3>
                      <div className="flex-grow border-b border-monochrome-300 ml-3"></div>
                    </div>

                    {calculationResult?.score_calculation_formula?.[0] && (
                      <ul className="text-monochrome-600 mt-6 space-y-5 text-headline-7">
                        {Object.entries(calculationResult.score_calculation_formula[0]).map(
                          ([subject, weight], index) => (
                            <li key={index} className="flex justify-between">
                              <span>{subject}</span>
                              <span className="font-medium">{weight}</span>
                            </li>
                          )
                        )}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-center mt-6">
                <button 
                className="mt-10 mb-10 ml-4 text-primary-600 px-10 py-3 rounded-lg hover:text-primary-900 transition text-big-button w-120"
                onClick={toggleDetails}>
                  {showDetails ? 'ซ่อนรายละเอียด' : 'แสดงรายละเอียด'}
                </button>
              </div>
            </div>

            {/* กล่องข้าง */}
            <div className="w-full lg:w-1/3 lg:max-w-sm bg-white p-6 rounded-lg shadow-lg border border-monochrome-200 mt-6 lg:mt-0 lg:ml-auto" style={{maxHeight: '500px', overflowY: 'auto'}}>
              <p className="mt-2 mb-2 text-[1.75rem] font-bold text-center">ผลการคำนวณคะแนน</p>
              <SemiCircleProgressBar score={score} />
              <p className="mt-6 mb-4 text-headline-7 text-center">คะแนนของคุณ: <span className='font-bold'>{calculationResult?.calculated_score.toFixed(2) || "คะแนน"}</span> / 100 คะแนน</p>
              <hr className="my-4 mt-6 border-monochrome-300" />
              <p className="mt-6 mb-4 text-headline-5 font-bold text-center">คุณมีโอกาสสอบติด <span className='text-primary-600 font-bold'>{calculationResult?.chance ? (calculationResult.chance * 100).toFixed(2) : "โอกาส"}</span> %</p>
              <RectangularProgressBar score={chance ? (chance * 100).toFixed(2) : 0} chance={chance}/>   
              {showDetails && (
                <>
                  <hr className="my-4 mt-6 border-monochrome-300" />
                  <h3 className="text-headline-5 font-bold text-center mb-4 mt-6">สถิติย้อนหลัง</h3>
                  <div className="space-y-4">
                    {[{
                      year: "67",
                      lowest: calculationResult?.min_score?.toFixed(2) || "-",
                      received: calculationResult?.admitted || "-"
                    }, {
                      year: "66",
                      lowest: calculationResult?.last_year_min_score?.toFixed(2) || "-",
                      received: calculationResult?.admitted || "-"
                    }].map((item, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-monochrome-700 text-body-large font-bold">ปี {item.year}</p>
                          </div>
                        </div>
                        <div className="flex justify-between border-t border-monochrome-300 mt-2 pt-2">
                          <div className="flex-1">
                            <p className="text-monochrome-500">ต่ำสุด:</p>
                            <p className="text-monochrome-500"><span className='text-primary-600 font-bold'>{item.lowest} </span>/100</p>
                          </div>
                          <div className="flex-1 border-l border-monochrome-300 ml-4 pl-4">
                            <p className="text-monochrome-500">จำนวนรับ:</p>
                            <p className="text-primary-600 font-bold">{item.received}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {!hideConfirmButton && (
            <div className="flex justify-center mt-6">
              <button 
                onClick={handleConfirmClick}
                className="mt-10 mb-10 bg-primary-600 text-white px-10 py-3 rounded-lg hover:bg-primary-700 transition text-big-button w-120">
                  ตกลง
              </button>
            </div>
          )}
        </div>

        {isBasicOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
              {calculationResult?.student_school_type && (
                <>
                  <h2 className="text-primary-600 text-headline-5 font-bold text-center mb-4">คุณสมบัติพื้นฐาน</h2>
                  <ul className="text-monochrome-800 text-body-large space-y-3 list-disc list-inside">
                    {calculationResult.student_school_type.map((type: string, index: number) => (
                      <li key={index}>รับผู้สมัครที่จบจาก {type}</li>
                    ))}
                  </ul>
                </>
              )}
              <div className="flex justify-center mt-6">
                <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition" onClick={() => setIsBasicOpen(false)}>
                  ตกลง
                </button>
              </div>
            </div>
          </div>
        )}

        {isScoreOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
              <h2 className="text-primary-600 text-headline-5 font-bold text-center mb-4">เงื่อนไขคะแนนขั้นต่ำ</h2>
              {calculationResult?.minimum_criteria?.[0] && (
                <ul className="text-monochrome-800 text-body-large space-y-3">
                  {Object.entries(calculationResult.minimum_criteria[0]).map(
                    ([label, value], index) => (
                      <li key={index}>
                        {label} <span className="text-primary-600 font-bold">≥</span>
                        <span className="text-primary-600 font-bold"> {value}</span>
                      </li>
                    )
                  )}
                </ul>
              )}
              <div className="flex justify-center mt-6">
                <button 
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition" onClick={() => setIsScoreOpen(false)}>
                  ตกลง
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {showAlert && (
        <AlertBox
          alertType={alertType}
          title={alertType === 'success' ? 'Success' : 'Error'}
          message={alertMessage}
        />
      )}
    </>
  );
}
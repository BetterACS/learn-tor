'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

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
          {score} / 100
        </text>
      </svg>
    </div>
  );
};

export default function ResultCalculator({ hideConfirmButton = false }) {
  const router = useRouter();
  const [isBasicOpen, setIsBasicOpen] = useState(false);
  const [isScoreOpen, setIsScoreOpen] = useState(false);
  const [score, setScore] = useState(100); // เปลี่ยนค่าคะแนนได้
  const [showDetails, setShowDetails] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleConfirmClick = () => {
    sessionStorage.setItem('calculationResult', 'true');
    router.replace('/tcascalculator'); // ใช้ replace เพื่อ refresh state ใหม่
  };

  const handleBackClick = () => {
    router.push('/tcascalculator/2');
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleDeleteClick = () => {
    sessionStorage.removeItem('calculationResult'); // ลบข้อมูลออกจาก sessionStorage
    setIsDeleted(true);
  };

  if (isDeleted) {
    return null;
  }

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
                  <div className="ml-1.5">
                    <h2 className="text-headline-5 font-bold text-primary-600">คณะวิศวกรรมศาสตร์</h2>
                    <p className="text-headline-6 text-monochrome-700">จุฬาลงกรณ์มหาวิทยาลัย</p>
                    <p className="text-headline-6 text-monochrome-700">วิศวกรรมทั่วไป</p>
                    <p className="text-body-large text-monochrome-500">คณะวิศวกรรมศาสตร์ สาขาวิชาวิศวกรรมทั่วไป</p>
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
                      <span className="text-primary-600 font-bold ml-2 ">380</span>
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

                    <ul className="text-monochrome-600 mt-6 space-y-5 text-headline-7">
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
              <p className="mt-2 mb-2 text-headline-6 font-bold text-center">ผลการคำนวณคะแนนของคุณ</p>
              <SemiCircleProgressBar score={score} />
              {showDetails && (
                <>
                  <hr className="my-4 mt-10 border-monochrome-300" />
                  <h3 className="text-primary-600 text-headline-5 font-bold text-center mb-4 mt-6">สถิติย้อนหลัง</h3>
                  <div className="space-y-4">
                    {[{
                      year: "67",
                      lowest: "-",
                      received: "380"
                    }, {
                      year: "66",
                      lowest: "54.5",
                      received: "360"
                    }, {
                      year: "65",
                      lowest: "54",
                      received: "360"
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
              <h2 className="text-primary-600 text-headline-5 font-bold text-center mb-4">คุณสมบัติพื้นฐาน</h2>
              <ul className="text-monochrome-800 text-body-large space-y-3 list-disc list-inside">
                <li>รับผู้สมัครที่จบจาก รร. หลักสูตรแกนกลาง</li>
                <li>รับผู้สมัครที่จบจาก รร. หลักสูตรนานาชาติ</li>
                <li>รับผู้สมัครที่จบจาก รร. หลักสูตรอาชีวะ</li>
                <li>รับผู้สมัครที่จบจาก รร. หลักสูตรตามอัธยาศัย</li>
                <li>รับผู้สมัครที่จบหลักสูตร GED</li>
              </ul>
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
              <ul className="text-monochrome-800 text-body-large space-y-3">
                <li>เกรดเฉลี่ยรวม 6 เทอม <span className="text-primary-600 font-bold">≥ 2.00</span></li>
                <li>คะแนนรวม <span className="text-primary-600 font-bold">≥ 51</span></li>
              </ul>
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
    </>
  );
}
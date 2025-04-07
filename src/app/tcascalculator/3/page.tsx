'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Navbar, ResultCalculator } from '@/components/index';
import { useSearchParams } from 'next/navigation';

export default function Calculator3() {
  const router = useRouter();
  const handleBackClick = () => {
    router.push('/tcascalculator/2');
  };
  const searchParams = useSearchParams();
  const rawData = searchParams.get('data');
  const parsedData = rawData ? JSON.parse(rawData) : null;

  console.log("ข้อมูลจากหน้า Calculator2:", parsedData);

  return (
    <>
      <Navbar />
        <div className="relative flex flex-col items-center">
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

          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-40">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary-600 text-2xl font-bold border-2 border-primary-600">
              1
            </span>
            <div className="h-1 w-72 bg-primary-600"></div>
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary-600 text-2xl font-bold border-2 border-primary-600">
              2
            </span>
            <div className="h-1 w-72 bg-primary-600"></div>
            <div className="flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-monochrome-50 border-2 border-primary-600 shadow-md">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white text-2xl font-bold">
                3
              </span>
              <span className="text-headline-5 font-medium">ผลการคำนวณคะแนน</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4 w-[1100px] mb-4 mt-10">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white text-2xl font-bold">
                3
              </span>
              <span className="text-headline-5 font-medium text-black">ผลการคำนวณ</span>
            </div>
          </div>
        </div>
      <ResultCalculator />
    </>
  );
}
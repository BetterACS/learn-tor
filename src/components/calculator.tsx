import React from 'react'

const calculator = () => {
  return (
    <div className="calculator-page">
      <div className="flex flex-col items-center bg-gray-50 py-10 px-4 rounded-lg shadow-md w-full">
        <div className="flex items-center gap-6 mb-8">
          <div className="logo w-64">
            <img src="/images/logofooter.avif" alt="Learntor Logo" className="" />
          </div>
          <div className="text-left" style={{ lineHeight: '1.8' }}>
            <h1 className="text-headline-2 font-bold text-gray-800">การคำนวณคะแนน Tcas</h1>
            <p className="text-headline-4 text-gray-600 mt-2">
              ฟีเจอร์ที่ช่วยคำนวณคะแนน และวิเคราะห์โอกาสสอบติด TCAS ให้กับน้อง ๆ
            </p>
          </div>
        </div>
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
        <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-10 w-full max-w-lg h-auto mt-10">
          <div className="text-center">
            <div className="text-primary-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-12 h-12 mx-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 014-4h10a4 4 0 014 4v1a4 4 0 01-4 4H7a4 4 0 01-4-4v-1z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-monochrome-600 text-headline-4 text-lg">ตอนนี้คุณยังไม่มีบันทึกการคำนวณคะแนน</p>
          </div>
          <button className="mt-6 bg-primary-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-headline-6">
            คำนวณคะแนน TCAS
          </button>
        </div>
      </div>
    </div>
  )
}

export default calculator
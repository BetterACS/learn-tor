'use client';

import React, { useRef } from 'react';

interface CalculatorinputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}

const Inputcalculator = ({ label, value, onChange, name }: CalculatorinputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === '') {
      onChange(e);
      return;
    }

    // ตรวจสอบเฉพาะตัวเลขที่อยู่ระหว่าง 0-100
    if (/^\d*$/.test(inputValue)) {
      const numericValue = parseInt(inputValue, 10);
      if (numericValue >= 0 && numericValue <= 100) {
        onChange(e);
      }
    }
  };

  return (
    <div
      className="flex items-center justify-between border border-monochrome-300 rounded-lg p-4 bg-monochrome-100"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Label ด้านซ้าย */}
      <label className="text-body-large font-regular mb-0 mr-4">
        {label}
      </label>

      {/* กล่องใส่คะแนน */}
      <div className="flex items-center">
        <input
          ref={inputRef}
          type="text"
          name={name}
          placeholder="-"
          value={value}
          onChange={handleInputChange}
          className="w-16 text-center py-2 rounded-lg bg-white border border-monochrome-300 focus:border-2 focus:border-primary-600 focus:outline-none"
        />
        <span className="px-4 text-monochrome-900">/100</span>
      </div>
    </div>
  );
};

export default Inputcalculator;

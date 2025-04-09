'use client';

import React, { useRef } from 'react';

interface SpecialInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
  name: string;
  maxValue: string;
  onMaxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SpecialInput = ({
  label,
  value,
  onChange,
  isEditing,
  name,
  maxValue,
  onMaxChange,
}: SpecialInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const maxRef = useRef<HTMLInputElement | null>(null);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // ถ้า target ไม่ใช่ input ข้างใน ค่อย focus
    if (e.target instanceof HTMLElement && e.target.tagName !== 'INPUT') {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '') {
      onChange(e);
      return;
    }

    if (/^\d*\.?\d{0,2}$/.test(value)) {
        const numericValue = parseFloat(value);
        const max = parseFloat(maxValue || '100');
        if (numericValue >= 0 && numericValue <= max) {
          onChange(e);
        }
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      onMaxChange(e);
    }
  };

  return (
    <div
      className={`flex items-center justify-between border border-monochrome-300 rounded-lg p-4 ${
        !isEditing ? 'bg-monochrome-100' : ''
      }`}
      onClick={handleContainerClick}
    >
      <label className="text-body-large font-regular mb-0 mr-4">{label}</label>
      <div className="flex items-center">
        <input
          ref={inputRef}
          type="text"
          name={name}
          placeholder="-"
          value={value}
          onChange={isEditing ? handleInputChange : undefined}
          className={`w-16 text-center py-2 rounded-lg bg-monochrome-100 ${
            isEditing
              ? 'focus:border-2 border-primary-600 focus:outline-none'
              : 'border border-monochrome-300 bg-monochrome-100'
          }`}
          disabled={!isEditing}
        />
        <span className="px-2">/</span>
        <input
          ref={maxRef}
          type="text"
          name={`${name}_max`}
          placeholder="-"
          value={maxValue}
          onChange={isEditing ? handleMaxInputChange : undefined}
          className={`w-16 text-center py-2 rounded-lg ${
            isEditing
              ? 'focus:border-2 border-primary-600 focus:outline-none bg-monochrome-100'
              : 'border border-monochrome-300 bg-monochrome-100 text-monochrome-900'
          }`}
          disabled={!isEditing}
        />
      </div>
    </div>
  );
};

export default SpecialInput;

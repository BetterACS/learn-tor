'use client';

import React, { useRef } from 'react';

interface ScoreInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
  name: string;
}

const ScoreInput = ({ label, value, onChange, isEditing, name }: ScoreInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (inputValue === '' || /^\d*\.?\d{0,3}$/.test(inputValue)) {
      if (inputValue === '') {
        onChange(e);
        return;
      }

      const parts = inputValue.split('.');
      if (parts.length > 2) return;

      const numericValue = parseFloat(inputValue);
      if (numericValue >= 0 && numericValue <= 100) {
        onChange(e);
      }
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
          inputMode="decimal"
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
        <span className={`px-4 ${!isEditing ? 'text-monochrome-900' : ''}`}>/100</span>
      </div>
    </div>
  );
};

export default ScoreInput;
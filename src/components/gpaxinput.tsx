'use client';

import React, { useRef } from 'react';

interface GpaxInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
  name: string;
}

const GpaxInput = ({ label, value, onChange, isEditing, name }: GpaxInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (newValue === '') {
      onChange(e);
      return;
    }

    if (/^\d*\.?\d{0,2}$/.test(newValue)) {
      const numericValue = parseFloat(newValue);
      if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 4) {
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
      </div>
    </div>
  );
};

export default GpaxInput;
'use client';

import React from 'react';

interface ScoreInputProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
}

const ScoreInput = ({ label, value, onChange, isEditing }: ScoreInputProps) => {
  return (
    <div
      className={`flex items-center justify-between border border-monochrome-300 rounded-lg p-4 ${
        !isEditing ? 'bg-monochrome-100' : ''
      }`}
    >
      <label className="text-body-large font-regular mb-0 mr-4">{label}</label>
      <div className="flex items-center">
        <input
          type="number"
          placeholder="-"
          min="1"
          max="100"
          value={value || ''}
          onChange={isEditing ? onChange : undefined}
          className={`w-16 text-center py-2 rounded-lg ${
            isEditing
              ? 'focus:border-2 focus:border-primary-600 border border-monochrome-300'
              : 'bg-monochrome-200'
          }`}
          disabled={!isEditing}
          style={{
            textAlign: 'center',
          }}
        />
        <span className={`px-4 ${!isEditing ? 'text-monochrome-900' : ''}`}>/100</span>
      </div>
    </div>
  );
};

export default ScoreInput;

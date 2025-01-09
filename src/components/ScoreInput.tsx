import React from 'react';

interface ScoreInputProps {
  label: string;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
}

const ScoreInput: React.FC<ScoreInputProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-monochrome-950 text-headline-6 mb-2">{label}</label>
      <div className="flex items-center border border-monochrome-300 rounded-lg">
        <input
          type="number"
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          className="w-16 text-center py-2 bg-monochrome-100 rounded-l-lg"
        />
        <span className="px-4">/ {max}</span>
      </div>
    </div>
  );
};

export default ScoreInput;

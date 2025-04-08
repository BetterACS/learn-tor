import React from 'react';

// components/SelectField.tsx
interface SelectPlanProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
    options: string[];
  }
  
  const SelectPlan = ({ label, name, value, onChange, disabled = false, options }: SelectPlanProps) => {
    return (
      <div>
        <label className="block text-monochrome-950 text-headline-6 mb-2">{label}</label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full border ${disabled ? 'border-monochrome-200 bg-monochrome-100 text-monochrome-950' : 'border-monochrome-200 bg-white'} rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600`}
        >
          <option value="">-- กรุณาเลือก --</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
  export default SelectPlan;
  
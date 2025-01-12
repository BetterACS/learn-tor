import React from 'react';

interface InputFieldProps {
  name: string;
  value: string;
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

const InputField: React.FC<InputFieldProps> = ({ name, value, disabled, onChange, label }) => {
  return (
    <div>
      <label className="block text-monochrome-950 text-headline-6 mb-2">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`w-full border ${disabled ? 'border-monochrome-200' : 'border-monochrome-200'} rounded-lg px-4 py-2 ${disabled ? 'bg-monochrome-100' : 'bg-white'} focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600`}
       />

    </div>
  );
};

export default InputField;

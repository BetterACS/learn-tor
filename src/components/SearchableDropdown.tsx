"use client";
import React, { useState, useEffect, useRef } from "react";

interface DropdownProps {
    value: string;
    onChange: (val: string) => void;
    options: string[];
    placeholder?: string;
    disabled?: boolean; 
}

export default function SearchableDropdown({ value, onChange, options, placeholder,disabled = false }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: string) => {
    onChange(option);
    setSearchTerm(option);
    setIsOpen(false);
  };

  const handleChange = (val: string) => {
    // เมื่อมีการเปลี่ยนแปลงค่า จะอัปเดตค่าของ target
    onChange(val);
    setSearchTerm(val);  // รีเฟรชค่าที่แสดงในช่องค้นหา
  };

  return (
    <div className="relative" ref={dropdownRef}>
        <div
            className={`flex items-center border rounded-md px-3 py-2 bg-white shadow-sm transition 
                ${disabled ? 'border-monochrome-200 bg-monochrome-50 cursor-not-allowed opacity-50' : 'border-monochrome-200 focus-within:ring-2 focus-within:ring-primary-500'}`}
            >
            <input
                value={searchTerm}
                disabled={disabled}
                onChange={(e) => {
                if (!disabled) {
                    handleChange(e.target.value);
                    setIsOpen(true);
                }
                }}
                onClick={() => {
                if (!disabled) setIsOpen(!isOpen);
                }}
                placeholder={placeholder || "เลือกตัวเลือก"}
                className="w-full bg-transparent outline-none text-monochrome-800"
            />
            {!disabled && (searchTerm ? (
                <div
                className="ml-2 cursor-pointer hover:opacity-70 transition"
                onClick={() => {
                    setSearchTerm('');
                    onChange('');
                    setIsOpen(false);
                }}
                >
                <img
                    src="https://img.icons8.com/?size=100&id=7FSknHLAHdnP&format=png&color=000000"
                    alt="Clear"
                    className="w-4 h-4"
                />
                </div>
            ) : (
                <div
                className="ml-2 cursor-pointer hover:opacity-70 transition"
                onClick={() => setIsOpen(!isOpen)}
                >
                <img
                    src="https://img.icons8.com/?size=100&id=60662&format=png&color=000000"
                    alt="Dropdown"
                    className="w-4 h-4"
                />
                </div>
            ))}
        </div>

        {isOpen && (
            <ul className="absolute z-10 w-full max-h-44 mt-1 overflow-y-scroll bg-white border border-gray-300 rounded-md shadow-lg">
            {filteredOptions.length ? (
                filteredOptions.map((option, idx) => (
                <li
                    key={idx}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSelect(option)}
                >
                    {option}
                </li>
                ))
            ) : (
                <li className="px-4 py-2 text-gray-500">ไม่พบข้อมูล</li>
            )}
            </ul>
        )}
    </div>
  );
}

'use client';

import React from "react";

interface ButtonProps {
  button_name: string;
  variant?: 
    "primary" | 
    "secondary" | 
    "red"
  onClick?: () => void;
}

export default function Button({ button_name, variant="primary", onClick }: ButtonProps) {
  const variantClasses = (() => {
    switch (variant) {
      case "primary":
        return "bg-primary-600 text-monochrome-50 border-primary-600 hover:bg-primary-700 hover:border-primary-700";
      case "secondary":
        return "text-primary-600 border-primary-600 hover:text-primary-700 hover:border-primary-700";
      case "red":
        return "text-red-700 border-red-700 hover:text-monochrome-50 hover:bg-red-700";
      default:
        return "";
    }
  })();

  return (
    <button 
      onClick={onClick}
      className={`h-auto w-fit px-[1.3rem] py-[0.7rem] ${variantClasses} rounded-lg flex justify-center items-center text-nowrap border text-button transition-color duration-200`}
    >
      <p>{button_name}</p>
    </button>
  );
}
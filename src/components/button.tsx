'use client';

import React, { useState, useEffect} from "react";

interface ButtonProps {
  button_name: string;
  pending_state_text?: string;
  variant?: 
    "primary" | 
    "secondary" | 
    "red"
  onClick?: () => void;
  pending?: boolean;
}

export default function Button({ button_name, pending_state_text, variant="primary", onClick, pending }: ButtonProps) {
  const variantClasses = (() => {
    switch (variant) {
      case "primary":
        return `text-monochrome-50 transition-color duration-100 ${pending && pending_state_text ? 'bg-primary-300 border-primary-300 animate-pulse cursor-default' : pending ? 'bg-primary-300 border-primary-300 cursor-default' : 'border-primary-600 hover:border-primary-700 bg-primary-600 hover:bg-primary-700'}`;
      case "secondary":
        return `transition-color duration-100 ${pending && pending_state_text ? 'text-primary-300 border-primary-300 cursor-default' : pending ? 'text-primary-300 border-primary-300 cursor-default' : 'text-primary-600 border-primary-600 hover:border-primary-700 hover:text-primary-700'}`;
      case "red":
        return `transition-color duration-100 ${pending && pending_state_text ? 'text-monochrome-50 bg-red-300 border-red-300 cursor-default' : pending ? 'text-red-300 border-red-300 cursor-default' : 'text-red-700 hover:text-monochrome-50 hover:bg-red-700 border-red-700'}`;
      default:
        return "";
    }
  })();

  return (
    <button 
      onClick={onClick}
      className={`h-auto w-fit px-[1.3rem] py-[0.7rem] ${variantClasses} rounded-lg flex justify-center items-center text-nowrap border text-button transition-color duration-200`}
    >
      <p>{pending ? pending_state_text || button_name : button_name}</p>
    </button>
  );
}
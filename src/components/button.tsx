'use client';

import React from "react";

interface ButtonProps {
  button_name: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

export default function Button({ button_name, variant="primary", onClick }: ButtonProps) {
  const variantClasses = 
    variant === "primary" 
      ? "bg-primary-600 text-monochrome-50" 
      : "bg-monochrome-50 text-primary-600";

  return (
    <button 
      onClick={onClick}
      className={`h-auto w-fit px-[1.3rem] py-[0.7rem] ${variantClasses} rounded-lg flex justify-center items-center border border-primary-600  text-button`}
    >
      <p>{button_name}</p>
    </button>
  );
}
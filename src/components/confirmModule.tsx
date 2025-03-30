'use client';

import { Button } from '@/components/index';
import { useRef, useEffect } from 'react';

interface ConfirmModuleProps {
  text: string;
  description: string;
  confirmText: string;
  cancleText: string;
  confirmHandle: () => void;
  cancleHandle: () => void;
}

export default function ConfirmModule ({ 
  text, 
  description, 
  confirmText,
  cancleText,
  confirmHandle,
  cancleHandle
}: ConfirmModuleProps) {
  const moduleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (moduleRef.current && !moduleRef.current.contains(event.target as Node)) {
      cancleHandle();
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-50 backdrop-filter backdrop-brightness-90 backdrop-blur-[2px] flex justify-center items-center">
      <div ref={moduleRef} className="w-[35vw] h-fit bg-monochrome-50 rounded-lg drop-shadow-xl">
        <div className="flex flex-col gap-4 py-10 px-10">
          <p className="font-bold text-3xl">{text}</p>
          {description && <p className="font-medium text-xl">{description}</p>}
          <div className="flex justify-end gap-4 mt-6">
            <Button button_name={confirmText} variant='red' onClick={confirmHandle} />
            <Button button_name={cancleText} variant='secondary' onClick={cancleHandle} />
          </div>
        </div>
      </div>
    </div>
  );
}
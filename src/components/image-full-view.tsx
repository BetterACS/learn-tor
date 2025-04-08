'use client';

import { useEffect, useState, useRef } from 'react';
import { trpc } from '@/app/_trpc/client';
import { StringExpressionOperatorReturningArray } from 'mongoose';

interface ImageFullViewProps {
  isImageFull: boolean;
  setIsImageFull: (isImageFull: boolean) => void;
  imgs: string[];
  clickedId: string;
}

export default function ImageFullView({ isImageFull, setIsImageFull, imgs, clickedId }: ImageFullViewProps) {
  const popupRef = useRef<HTMLDivElement | null>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isImageFull && Array.isArray(imgs) && imgs.length > 0) {
      const index = imgs.findIndex(img => img === clickedId);
      setCurrentIndex(index);
    }
  }, [isImageFull]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsImageFull(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown' , handleClickOutside);
    }
  }, [setIsImageFull]);

  const handleClickPrev = () => {
    setCurrentIndex((prev) => (imgs.length + prev-1)%imgs.length);
  };

  const handleClickForward = () => {
    setCurrentIndex((prev) => (prev+1)%imgs.length);
  };

  return (
    <div className={`fixed w-screen h-screen top-0 left-0 backdrop-filter backdrop-brightness-75 backdrop-blur-[2px] z-50 ${isImageFull ? 'visible opacity-100' : 'invisible opacity-0'} transition-all duration-100 flex justify-center items-center`}>
      <div ref={popupRef} className={`relative size-fit bg-monochrome-950 flex flex-col items-center ${isImageFull ? 'scale-100' : 'scale-90'} transition-transform duration-100`}>
        <button onClick={() => setIsImageFull(false)} className="absolute right-0 size-fit text-monochrome-50 flex justify-end m-6">
          <svg className="size-10" xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 15 15">
            <path fill="currentColor" fillRule="evenodd" d="M11.782 4.032a.575.575 0 1 0-.813-.814L7.5 6.687L4.032 3.218a.575.575 0 0 0-.814.814L6.687 7.5l-3.469 3.468a.575.575 0 0 0 .814.814L7.5 8.313l3.469 3.469a.575.575 0 0 0 .813-.814L8.313 7.5z" clipRule="evenodd"></path>
          </svg>
        </button>
        <button onClick={() => handleClickPrev()} className="absolute -left-[6rem] maxmd:min2sm:-left-[4.5rem] max2sm:-left-[3.5rem] size-fit text-monochrome-50 flex justify-end top-[50%]">
          <svg className="size-[4rem]" xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 48 48">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M31 36L19 24l12-12"></path>
          </svg>
        </button>
        <button onClick={() => handleClickForward()} className="absolute -right-[6rem] maxmd:min2sm:-right-[4.5rem] max2sm:-right-[3.5rem] size-fit text-monochrome-50 flex justify-end top-[50%]">
          <svg className="size-[4rem]" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
            <g fill="none" fillRule="evenodd">
              <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
              <path fill="currentColor" d="M15.707 11.293a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 1 1-1.414-1.414l4.95-4.95l-4.95-4.95a1 1 0 0 1 1.414-1.414z"></path>
            </g>
          </svg>
        </button>
        {imgs && imgs.length > 0 && (
          <>
            <img src={imgs[currentIndex] || '/'} alt="Image" className="size-[50rem] md:maxlg:size-[50rem] maxmd:min2sm:size-[35rem] max2sm:size-[25rem] object-contain" />
            <div className="absolute h-fit w-fit bg-monochrome-950 bg-opacity-30 -bottom-14 py-3 px-5 rounded-full">
              <p className="text-monochrome-50 text-headline-7">{currentIndex+1} / {imgs.length}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
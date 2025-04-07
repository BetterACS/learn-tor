'use client';

import { useEffect, useState, useRef } from 'react';
import { trpc } from '@/app/_trpc/client';

interface ImageFullViewProps {
  isImageFull: boolean;
  setIsImageFull: (isImageFull: boolean) => void;
  topicId: string;
}

export default function ImageFullView({ isImageFull, setIsImageFull, topicId }: ImageFullViewProps) {
  const popupRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isError } = trpc.queryImageById.useQuery({
    topicId: topicId
  });

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

  return (
    <div className={`fixed w-screen h-screen top-0 left-0 backdrop-filter backdrop-brightness-75 backdrop-blur-[2px] z-50 ${isImageFull ? 'visible opacity-100' : 'invisible opacity-0'} transition-all duration-100 flex justify-center items-center`}>
      <div ref={popupRef} className={`relative size-fit bg-monochrome-950 flex flex-col items-center ${isImageFull ? 'scale-100' : 'scale-90'} transition-transform duration-100`}>
        <button onClick={() => setIsImageFull(false)} className="absolute right-0 size-fit text-monochrome-50 flex justify-end m-6">
          <svg className="size-10" xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 15 15">
            <path fill="currentColor" fillRule="evenodd" d="M11.782 4.032a.575.575 0 1 0-.813-.814L7.5 6.687L4.032 3.218a.575.575 0 0 0-.814.814L6.687 7.5l-3.469 3.468a.575.575 0 0 0 .814.814L7.5 8.313l3.469 3.469a.575.575 0 0 0 .813-.814L8.313 7.5z" clipRule="evenodd"></path>
          </svg>
        </button>
        <img src={data?.data || '/'} alt="Image" className="size-[50rem] md:maxlg:size-[40rem] maxmd:size-[30rem] object-contain" />
      </div>
    </div>
  );
};
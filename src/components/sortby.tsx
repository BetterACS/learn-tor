'use client';

import { useRef, useEffect, useState } from 'react';

interface FilterProps {
  filters: string[];
  sortBy: string;
  setSortBy: (sortBy: string) => void;
}

export default function SortBy({ filters, sortBy, setSortBy }: FilterProps) {
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedFilter, setSelectedFilter] = useState("Newest");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  // const filters = ["Newest", "Oldest", "Most Likes"];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={sortDropdownRef} className="relative h-full flex w-fit gap-2 items-center">
      <button
        className="w-36 flex py-2 px-1 gap-1 items-center justify-between border-b border-monochrome-200 transition duration-100 hover:bg-monochrome-100"
        onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
      >
        <p className="text-headline-6 text-nowrap">
          {sortBy}
        </p>
        <svg className="size-6" xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><title>down_line</title><g id="down_line" fill='none' fillRule='evenodd'><path d='M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z'/><path fill='black' d='M12.707 15.707a1 1 0 0 1-1.414 0L5.636 10.05A1 1 0 1 1 7.05 8.636l4.95 4.95 4.95-4.95a1 1 0 0 1 1.414 1.414l-5.657 5.657Z'/></g></svg>
      </button>
      {sortDropdownOpen && (
        <div className="absolute w-[9rem] right-0 top-10 mt-2 bg-monochrome-50 text-monochrome-950 text-body-large text-nowrap rounded shadow-lg overflow-hidden text-center divide-y divide-monochrome-300 z-10">
          {filters.map((filter) => (
            <label key={filter} className={`flex px-5 py-4 items-center text-button hover:bg-monochrome-100 hover:cursor-pointer ${selectedFilter === filter ? "bg-monochrome-200" : ""}`}>
              <input
                type="radio"
                key={filter}
                onClick={() => {setSortBy(filter); setSortDropdownOpen(false);}}
                className="hidden"
              />                    
              <p className="text-headline-6">{filter}</p>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
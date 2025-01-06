'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
      profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)
    ) {
      setDropdownOpen(false);
      setProfileDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="h-[5.25rem] w-full sticky top-0 bg-primary-600 flex justify-between items-center px-14 py-3">
      <Link href="/" className="h-full w-16">
        <img src='/images/logo.png' alt="Logo" />
      </Link>
      <div className="flex gap-12 items-center text-big-button text-monochrome-50">

        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex gap-1 items-center">
            <p>Information</p> 
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
              <title>down_line</title>
              <g id="down_line" fill='none' fillRule='evenodd'>
                <path d='M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z'/>
                <path fill='white' d='M12.707 15.707a1 1 0 0 1-1.414 0L5.636 10.05A1 1 0 1 1 7.05 8.636l4.95 4.95 4.95-4.95a1 1 0 0 1 1.414 1.414l-5.657 5.657Z'/>
              </g>
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute w-full mt-2 bg-monochrome-50 text-monochrome-950 text-headline-6 rounded shadow-lg overflow-hidden text-center divide-y divide-monochrome-300">
              <Link href="/" className="block px-5 py-4 hover:bg-monochrome-100 transition duration-150">
                TCAS Info
              </Link>
              <Link href="/" className="block px-5 py-4 hover:bg-monochrome-100 transition duration-150">
                Courses
              </Link>
            </div>
          )}
        </div>

        <Link href="/forum">Forum</Link>
        <Link href="/">TCAS Calculate</Link>
        <Link href="/">Chatbot</Link>

        <div className="relative" ref={profileDropdownRef}>
          <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="rounded-full size-14">
            <img src='/images/profile.png' alt="Profile" />
          </button>
          {profileDropdownOpen && (
            <div className="absolute right-0.5 w-auto min-w-[12rem] mt-2 bg-monochrome-50 text-monochrome-950 text-headline-6 rounded shadow-lg overflow-hidden text-center divide-y divide-monochrome-300 z-10">
              <Link href="/profile" className="block px-5 py-4 hover:bg-monochrome-100 transition duration-150">
                Profile
              </Link>
              <Link href="/" className="block px-5 py-4 hover:bg-monochrome-100 transition duration-150">
                Log out
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

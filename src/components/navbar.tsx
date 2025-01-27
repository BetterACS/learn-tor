'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) &&
        (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) &&
        (menuRef.current && !menuRef.current.contains(e.target as Node))
      ) {
        setDropdownOpen(false);
        setProfileDropdownOpen(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    signOut({ callbackUrl: '/login' }); 
  };

  return (
    <div className="h-[5.25rem] w-full sticky top-0 bg-primary-600 flex justify-between items-center px-[3%] py-3 z-20 text-big-button">
      <Link href="/" className="h-full w-[4rem] min-w-[4rem]">
        <img src='/images/logo.avif' alt="Logo" />
      </Link>

      <div className="md:hidden flex items-center mr-6">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <img
            src={menuOpen ? '/images/close.avif' : '/images/burger-bar.avif'}
            className={menuOpen ? 'w-[1.5rem] h-[1.5rem]' : 'w-[2rem] h-[2rem]'}
            alt="Menu"
          />
        </button>
      </div>

      <div
        ref={menuRef}
        className={`flex w-full h-fit gap-[2%] items-center justify-end text-monochrome-50 text-nowrap ${menuOpen ? 'absolute top-[5.25rem] left-0 w-full bg-primary-600 py-8' : 'hidden md:flex'}`}
      >
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
            <div className="absolute w-full mt-6 bg-monochrome-50 text-monochrome-950 text-headline-6 rounded shadow-lg overflow-hidden text-center divide-y divide-monochrome-300">
              <Link href="/tcas-info" className="block px-5 py-4 hover:bg-monochrome-100 transition duration-150">
                TCAS Info
              </Link>
              <Link href="/compare-courses" className="block px-5 py-4 hover:bg-monochrome-100 transition duration-150">
                Courses
              </Link>
            </div>
          )}
        </div>

        <Link href="/forum" className="block px-5 py-4 transition duration-150">Forum</Link>
        <Link href="/tcascalculator" className="block px-5 py-4 transition duration-150">TCAS Calculate</Link>
        <Link href="/chatbot" className="block px-5 py-4 transition duration-150">Chatbot</Link>
        {status === "authenticated"  && (
        <div className="relative hidden md:block lg:block" ref={profileDropdownRef}>
          <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="rounded-full w-[3.5rem] min-w-[3.5rem]">
            <img src='/images/profile.avif' alt="Profile" />
          </button>
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-[130px] bg-monochrome-50 text-monochrome-950 text-headline-6 rounded shadow-lg overflow-hidden text-center divide-y divide-monochrome-300">
              <Link href="/profile" className="block px-5 py-4 hover:bg-monochrome-100 transition duration-150">
                Profile
              </Link>
              <Link href="#" onClick={handleSignOut} className="block px-5 py-4 hover:bg-monochrome-100 transition duration-150">
                Log out
              </Link>
            </div>
          )}
        </div>)}
      </div>

      {menuOpen && (
        <div className="lg:hidden absolute top-[5.25rem] left-0 w-full bg-primary-600 py-8">
          <div className="text-monochrome-50">
            <div className="flex flex-col gap-4">
              <div className="text-center px-5">
                <Link href="/profile">
                  <div className="flex justify-start items-center gap-2 cursor-pointer hover:bg-primary-700 transition duration-150">
                    <img src='/images/profile.avif' className="w-[3.5rem] h-[3.5rem] rounded-full" />
                    <span className="text-monochrome-50">Username</span>
                  </div>
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <Link href="/tcas-info" className="block px-5 py-4 hover:bg-primary-700 transition duration-150">
                  TCAS Info
                </Link>
                <Link href="/compare-courses" className="block px-5 py-4 hover:bg-primary-700 transition duration-150">
                  Courses
                </Link>
                <Link href="/forum" className="block px-5 py-4 hover:bg-primary-700 transition duration-150">
                  Forum
                </Link>
                <Link href="/tcascalculator" className="block px-5 py-4 hover:bg-primary-700 transition duration-150">
                  TCAS Calculate
                </Link>
                <Link href="/chatbot" className="block px-5 py-4 hover:bg-primary-700 transition duration-150">
                  Chatbot
                </Link>
                <Link href="/home" className="block px-5 py-4 hover:bg-primary-700 transition duration-150">
                  Log out
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

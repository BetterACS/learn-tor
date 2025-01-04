'use client';
import Link from 'next/link';

export default function Sidebar() {

  return (
    <div className="h-[calc(100vh-5.25rem)] w-full bg-monochrome-50 sticky top-[5.25rem] flex flex-col divide-y divide-monochrome-200 items-center px-8 py-4 border border-monochrome-400">

      <div className="w-full flex flex-col py-6 first:pt-0 items-start">
        <button className="w-full h-20 flex gap-3 items-center px-4 hover:bg-monochrome-100 transform duration-100 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          <p className="text-headline-5">Homepage</p>
        </button>
        <button className="w-full h-20 flex gap-3 items-center px-4 hover:bg-monochrome-100 transform duration-100 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M12 22c-4.97 0-9-2.582-9-7v-.088C3 12.794 4.338 11.1 6.375 10c1.949-1.052 3.101-2.99 2.813-5l-.563-3l2.086.795c3.757 1.43 6.886 3.912 8.914 7.066A8.5 8.5 0 0 1 21 14.464V15c0 1.562-.504 2.895-1.375 3.965"/><path d="M12 22c-1.657 0-3-1.433-3-3.2c0-1.4 1.016-2.521 1.91-3.548L12 14l1.09 1.252C13.984 16.28 15 17.4 15 18.8c0 1.767-1.343 3.2-3 3.2"/></g></svg>
          <p className="text-headline-5">Popular</p>
        </button>
      </div>

      <div className="w-full flex flex-row py-6 px-4 justify-between items-start gap-10 text-headline-5">
        <p>Create Topic</p>
        <Link href="/forum/create-topic">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2"/></svg>
        </Link>
      </div>

      <div className="w-full flex flex-col py-6 px-4 last:pb-0 items-start gap-6">
        <h1 className="text-headline-5">Forum</h1>
        <div className="flex flex-col pl-4 gap-4 text-headline-6">
          <Link href="/" className="hover:underline w-fit">Portfolio</Link>
          <Link href="/" className="hover:underline w-fit">TCAS</Link>
          <Link href="/" className="hover:underline w-fit">แนะนำคณะและมหาวิทยาลัย</Link>
          <Link href="/" className="hover:underline w-fit">การเตรียมตัวสอบ</Link>
          <Link href="/" className="hover:underline w-fit">ทุนการศึกษา</Link>
        </div>
      </div>
    </div>
  )
}
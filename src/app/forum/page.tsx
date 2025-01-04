'use client';
import Link from 'next/link';
import { Navbar, Sidebar, Test, TestMutation } from '@/components/index';

export default function Home() {
  return (
    <div className="h-screen w-full">
      <Navbar />
      <div className="w-full h-full grid grid-cols-5">
        {/* Left section */}
        <div className="w-full h-full flex justify-center">
          <Sidebar />
        </div>

        {/* Middle section */}
        <div className="w-full h-full col-span-3">
          <p>Middle Section</p>
          <Link href="/forum/1" className="text-headline-2 hover:underline">View Topic 1</Link>
        </div>

        {/* Right section */}
        <div className="w-full h-full border border-red-400">
          Right Section
        </div>
      </div>
    </div>
  )
}
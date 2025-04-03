import React from 'react'
import Link from 'next/link';
import { Navbar, Registerblock } from '@/components/index';

const Registerpage = () => {
  return (
    <div role="main" className="bg-regis-image bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
        <Navbar />
      <div className="relative z-10">
        <Registerblock />
      </div>
    </div>
  )
}

export default Registerpage

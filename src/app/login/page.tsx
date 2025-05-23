import React from 'react'
import Link from 'next/link';
import { Navbar, Loginblock } from '@/components/index';

const Loginpage = () => {
  return (
    <div className="bg-regis-image bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
        <Navbar />
      <div className="relative z-10">
        <Loginblock />
      </div>
    </div>
  )
}

export default Loginpage

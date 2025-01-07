import React from 'react'
import Link from 'next/link';
import { Navbar, Verifypassblock } from '@/components/index';

const Verificationpage = () => {
  return (
    <div className="bg-regis-image bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
        <Navbar />
      <div className="relative z-10">
        <Verifypassblock />
      </div>
    </div>
  )
}

export default Verificationpage


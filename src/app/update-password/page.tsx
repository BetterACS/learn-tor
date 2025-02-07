import React from 'react'
import Link from 'next/link';
import { Navbar, Updatepassblock } from '@/components/index';

const Updatepasspage = () => {
  return (
    <div className="bg-regis-image bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
        <Navbar />
      <div className="relative z-10">
        <Updatepassblock />
      </div>
    </div>
  )
}

export default Updatepasspage


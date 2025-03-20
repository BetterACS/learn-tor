'use client';
import React, { useState, useEffect } from 'react';
import {Loading, Navbar} from '@/components/index';

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 6000);
  }, []);

  return (
    <div>
      {isLoading ? <Loading /> : <div>โหลดเสร็จแล้ว!</div>}
    </div>
  );
};

export default Page;
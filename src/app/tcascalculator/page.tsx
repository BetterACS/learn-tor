'use client';

import React from 'react';
import { Navbar, Footer, Calculator } from '@/components/index';

const CalculatorPage = () => {
  return (
    <div className="calculator-page">
      <Navbar />
      <Calculator />
    </div>
  );
};

export default CalculatorPage;

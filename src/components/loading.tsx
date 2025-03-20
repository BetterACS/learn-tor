'use client';
import React from 'react';
import { RotatingLines } from 'react-loader-spinner';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <RotatingLines
        strokeColor="grey"
        strokeWidth="5"
        animationDuration="0.75"
        width="26"
        visible={true}
      />
    </div>
  );
};

export default Loading;
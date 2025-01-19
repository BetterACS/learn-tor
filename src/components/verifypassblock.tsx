'use client';
import Link from 'next/link';
import { trpc } from '@/app/_trpc/client';
import React, {useState, useEffect} from 'react';
const VerificationBlock: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!verificationCode) {
      setError('Please enter your verification code');
      return;
    }

    // mutation.mutate(
    //   { token: verificationCode, email: 'email' },
    //   {
    //     onSuccess: (data) => {
    //       if (data.status !== 200) {
    //         console.warn("Validation Error:", data.data.message);
    //         setError(data.data.message);
    //       } else if (data.status === 200) {
    //         console.log("Mutation Successful:", data);
    //         window.location.href = '';
    //       }
    //     }
    //   });

    }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex bg-white rounded-[25px] shadow-lg overflow-hidden w-[1200px] h-[600px]">
        {/* Left Section */}
        <div className="w-[55%] bg-primary-600 flex flex-col justify-center items-center text-white p-8">
          <img
            src="/images/Learntorbgg.png"
            className="w-full h-full object-contain"
            alt="Learntor Logo"
          />
        </div>

        {/* Right Section */}
        <div className="w-[45%] flex flex-col justify-center py-20 px-24">
          <div className="text-headline-3 font-bold mb-4 text-monochrome-800">
            Verification
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <p className="text-monochrome-500 mb-9">Enter your verification code</p>
          <form action="#">
            {/* Verification Code Input + Resent Button */}
            <div className="mb-8 flex items-center gap-5">
              <input
                type="text"
                placeholder="Verification Code"
                className="flex-1 border border-monochrome-1000 py-2 px-4 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-primary-600 h-[3.7rem]"
              />
              <button
                type="button"
                className="bg-primary-600 text-white py-2 px-4 rounded-[7px] hover:bg-primary-700 transition font-bold h-[3.7rem]"
              >
                Resent
              </button>
            </div>
            {/* Submit Button */}
            <Link href="/updatepass" passHref>
              <button className="w-full bg-primary-600 text-white text-headline-6 py-2 rounded-[7px] hover:bg-primary-700 transition h-[3.7rem] font-bold">
                reset password
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerificationBlock;

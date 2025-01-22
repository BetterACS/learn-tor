'use client';
import { trpc } from '@/app/_trpc/client';
import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const VerificationBlock: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const email = useSearchParams().get('email') || '';
  const router = useRouter();
  const mutation = trpc.verifiedMutation.useMutation();
  const reset = trpc.resetVerificationToken.useMutation();
  const token = trpc.getJWT.useMutation();
  const [error, setError] = useState('');
  const handleClick = async (e:React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Email is required');
      router.push('forget')
      return;
    }
    reset.mutate(
      { email: email },
      {
        onSuccess: (data) => {
          if (data.status !== 200) {
            console.warn('Verification Error:', data.data.message);
            setError(data.data.message);
          } else if (data.status === 200) {
            console.log('Verification Success:', data.data.message);
          }
        },
        onError: (error) => {
          console.error('Mutation Failed:', error);
          setError(error.message);
        },
      });
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Email is required');
      router.push('forget');
      return;
    }
  
    if (!verificationCode) {
      setError('Verification code is required');
      return;
    }
    else if (verificationCode.length !== 6) {
      setError('Verification code must be 6 characters');
      return;
    }

    mutation.mutate(
      { email, token: verificationCode },
      {
        onSuccess: (data) => {
          if (data.status !== 200) {
            console.warn('Verification Error:', data.data.message);
            setError(data.data.message);
          } else if (data.status === 200) {
            console.log('Verification Success:', data.data.message);

            token.mutate(
              { email: email },
              {
                onSuccess: (data) => {
                  if (data.status !== 200) {
                    console.warn('generate token Error:', data.data.message);
                    setError(data.data.message);
                  } else if (data.status === 200) {
                    console.log('generate token Success:', data.data.message);
                    
                    if ('token' in data.data) {
                      router.push('/update-password?email=' + email+'&token='+data.data.token);
                    }
                  }
                },
                onError: (error) => {
                  console.error('Mutation Failed:', error);
                  setError(error.message);
                },
              }
            )
            
          }
        },
        onError: (error) => {
          console.error('Mutation Failed:', error);
          setError(error.message);
        },
      }
    );
  };

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
          <p className="text-monochrome-500 mb-9">Enter your verification code</p>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form action="#" onSubmit={handleSubmit}>
            {/* Verification Code Input + Resend Button */}
            <div className="mb-8 flex items-center gap-5">
              <input
              type="text"
              placeholder="Verification Code"
              value={verificationCode}
              maxLength={6}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,6}$/.test(value)) {
                setVerificationCode(value);
                }
              }}
              className="flex-1 border border-monochrome-1000 py-2 px-4 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-primary-600 h-[3.7rem]"
              />
              <button
              type="button"
              className="bg-primary-600 text-white py-2 px-4 rounded-[7px] hover:bg-primary-700 transition font-bold h-[3.7rem]"
              onClick={handleClick}
              >
              Resend
              </button>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary-600 text-white text-headline-6 py-2 rounded-[7px] hover:bg-primary-700 transition h-[3.7rem] font-bold"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerificationBlock;

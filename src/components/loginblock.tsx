'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import {AlertBox} from '@/components/index';
const LoginBlock = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState('');
  const callbackUrl = searchParams.get('callbackUrl') || '/home';
  const [needVerify,setNeedVerify] = useState(searchParams.get('need-verify')||false);
  const [updated,setUpdated] = useState(searchParams.get('updated')||false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (!result?.ok) {
      // แก้ตรงนี้
      setError(result?.error || 'Login failed');
    } else {
      console.log("callbackUrl", callbackUrl);
      router.push(`${callbackUrl}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {updated && (
        <AlertBox
          alertType="success"
          title="Password Updated"
          message="Your password has been updated successfully"
        />
      )}
      {needVerify && (
        <AlertBox
        alertType="info"
        title="you need to verify your email"
        message="Please check your email to verify your account"
      />
      )}
      <div className="flex bg-white rounded-[25px] shadow-lg overflow-hidden w-[1200px] h-[600px]">
        {/* Left Section */}
        <div className="w-[55%] bg-primary-600 flex flex-col justify-center items-center text-white p-8">
          <img
            src="/images/Learntorbgg.avif"
            className="w-full h-full object-contain"
            alt="Learntor Logo"
          />
        </div>
        {/* Right Section */}
        <div className="w-[45%] flex flex-col justify-center py-20 px-24">
          <h2 className="text-headline-3 font-bold mb-4 text-monochrome-800">Login</h2>
          <p className="text-monochrome-500 mb-9">
            Please enter your login details to sign in
          </p>
          {error && 
            <AlertBox
              alertType="error"
              title="Error"
              message={error}
            />
          }
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-8">
              <input
                type="email"
                placeholder="Email Address"
                className="border border-monochrome-1000 py-2 px-4 w-full rounded-[7px] focus:outline-none focus:ring-2 focus:ring-primary-600 h-[3.7rem]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* Password Input */}
            <div className="mb-8">
              <input
                type="password"
                placeholder="Password"
                className="border border-monochrome-1000 py-2 px-4 w-full rounded-[7px] focus:outline-none focus:ring-2 focus:ring-primary-600 h-[3.7rem]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {/* Forgot Password */}
            <div className="mt-5 text-end mb-8">
              <Link href="/forget" className="text-primary-600 hover:text-primary-700 font-semibold">
                Forgot Password?
              </Link>
            </div>
            {/* Submit Button */}
            <button
              className="w-full bg-primary-600 text-white text-headline-6 py-2 rounded-[7px] hover:bg-primary-700 transition h-[3.7rem] font-bold"
              type="submit"
            >
              Log in
            </button>
          </form>
          {/* Register Link */}
          <div className="mt-5 text-center">
            <span className="text-monochrome-500">
              Do not have an account?{' '}
              <Link href="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                Sign up
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginBlock;

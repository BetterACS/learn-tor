'use client';
import Link from 'next/link';

const RegisterBlock = () => {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="flex bg-monochrome-50 rounded-[25px] shadow-lg overflow-hidden w-[1200px] h-[600px]">
        <div className="w-[55%] bg-primary-600 flex flex-col justify-center items-center text-monochrome-50 p-8">
        <img src='/images/Learntorbgg.png' className="w-full h-full object-contain" alt="Learntor Logo"/>
        </div>
        {/* Right Section */}
        <div className="w-[45%] py-20 px-24">
         <h2 className="text-headline-3 font-bold mb-4 text-monochrome-800">Sign up</h2>
          <p className="text-monochrome-500 mb-9">
            Create your account in seconds 
          </p>
          <form action="#">
            {/* Username */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="Username"
                className="border border-monochrome-1000 py-2 px-4 w-full rounded-[7px] focus:outline-none focus:ring-2 focus:ring-primary-600 h-[3.7rem]"
              />
            </div>
            {/* Email */}
            <div className="mb-8">
              <input
                type="email"
                placeholder="Email Address"
                className="border border-monochrome-1000 py-2 px-4 w-full rounded-[7px] focus:outline-none focus:ring-2 focus:ring-primary-600 h-[3.7rem]"
              />
            </div>
            {/* Password */}
            <div className="mb-8">
              <input
                type="password"
                placeholder="Password"
                className="border border-monochrome-1000 py-2 px-4 w-full rounded-[7px] focus:outline-none focus:ring-2 focus:ring-primary-600 h-[3.7rem]"
              />
            </div>
            {/* Confirm Password */}
            <div className="mb-8">
              <input
                type="password"
                placeholder="Confirm Password"
                className="border border-monochrome-1000 py-2 px-4 w-full rounded-[7px] focus:outline-none focus:ring-2 focus:ring-primary-600 h-[3.7rem]"
              />
            </div>
            {/* Submit Button */}
            <button 
              className="w-full bg-primary-600 text-white text-headline-6 py-2 rounded-[7px] hover:bg-primary-700 transition h-[3.7rem] font-bold">
              Create an account
            </button>
          </form>
          {/* Login Link */}
          <div className="mt-5 text-center">
            <span className="text-monochrome-500">
              Already have an account?{" "}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                Login
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterBlock;

'use client';
import Link from 'next/link';

const RegisterBlock = () => {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="flex bg-white rounded-[25px] shadow-lg overflow-hidden w-[1200px] h-[600px]">
        <div className="w-[55%] bg-primary-600 flex flex-col justify-center items-center text-white p-8">
        <img src='/images/Learntorbgg.png' className="w-full h-full object-contain" alt="Learntor Logo"/>
        </div>
        {/* Right Section */}
        <div className="w-[45%] py-20 px-24">
          <h2 className="text-[3rem] font-bold mb-4 text-gray-700">Sign up</h2>
          <p className="text-[#818181] mb-9">
            Create your account in seconds 
          </p>
          <form action="#">
            {/* Username */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="Username"
                className="border border-gray-300 py-2 px-4 w-full rounded-[7px] focus:outline-none focus:ring-2 focus:ring-[#0077C2] h-[3.7rem]"
              />
            </div>
            {/* Email */}
            <div className="mb-8">
              <input
                type="email"
                placeholder="Email Address"
                className="border border-gray-300 py-2 px-4 w-full rounded-[7px] focus:outline-none focus:ring-2 focus:ring-[#0077C2] h-[3.7rem]"
              />
            </div>
            {/* Password */}
            <div className="mb-8">
              <input
                type="password"
                placeholder="Password"
                className="border border-gray-300 py-2 px-4 w-full rounded-[7px] focus:outline-none focus:ring-2 focus:ring-[#0077C2] h-[3.7rem]"
              />
            </div>
            {/* Confirm Password */}
            <div className="mb-8">
              <input
                type="password"
                placeholder="Confirm Password"
                className="border border-gray-300 py-2 px-4 w-full rounded-[7px] focus:outline-none focus:ring-2 focus:ring-[#0077C2] h-[3.7rem]"
              />
            </div>
            {/* Submit Button */}
            <button 
              className="w-full bg-[#0077C2] text-white py-2 rounded-[7px] hover:bg-[#005fa3] transition h-[3.7rem] font-bold">
              Create an account
            </button>
          </form>
          {/* Login Link */}
          <div className="mt-5 text-center">
            <span className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-[#0077C2] hover:text-[#005fa3] font-semibold">
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

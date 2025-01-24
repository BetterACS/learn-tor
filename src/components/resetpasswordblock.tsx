'use client';
import Link from 'next/link';
import { useRouter } from "next/router";

const ResetBlock = () => {

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="flex bg-white rounded-[25px] shadow-lg overflow-hidden w-[1200px] h-[600px]">
        <div className="w-[55%] bg-primary-600 flex flex-col justify-center items-center text-white p-8">
        <img src='/images/Learntorbgg.png' className="w-full h-full object-contain" alt="Learntor Logo"/>
        </div>
        {/* Right Section */}
        <div className="w-[45%] flex flex-col justify-center py-20 px-24">
         <h2 className="text-headline-3 font-bold mb-4 text-monochrome-800">Reset Password</h2>
          <p className="text-monochrome-500 mb-9">
             We will send you an email with instructions to reset it.  
          </p>
          <form action="#">
            {/* Email/Username */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="Email Address / Username"
                className="border border-monochrome-1000 py-2 px-4 w-full rounded-[7px] focus:outline-none focus:ring-2 focus:ring-primary-600 h-[3.7rem]"
              />
            </div>
            {/* Submit Button */}
            <Link href="/verification" passHref>
                <button className="w-full bg-primary-600 text-white text-headline-6 py-2 rounded-[7px] hover:bg-primary-700 transition h-[3.7rem] font-bold">
                    Sent Verification Code
                </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetBlock;

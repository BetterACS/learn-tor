'use client';
import {trpc} from '@/app/_trpc/client'
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { AlertBox } from '@/components/index';
const ResetBlock = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const [error, setError] = useState('');
  const mutation = trpc.resetVerificationToken.useMutation();
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      mutation.mutate(
        { email: email},
        {
            onSuccess: (data) => {
                if (data.status !== 200) {
                    console.warn("verification Error:", data.data.message);
                    setError(data.data.message);
                } else if (data.status === 200) {
                    // sendToken(email,token,"Reset Password",false);
                    console.log("verification Success:", data.data.message);
                    router.push('/verification?email='+email);
                }
            },
            onError: (error) => {
                console.error("Mutation Failed:", error);
                setError(error.message);
            },
        });
    };


  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="flex bg-white rounded-[25px] shadow-lg overflow-hidden w-[1200px] h-[600px]">
        <div className="w-[55%] bg-primary-600 flex flex-col justify-center items-center text-white p-8">
        <img src='/images/Learntorbgg.avif' className="w-full h-full object-contain" alt="Learntor Logo"/>
        </div>
        {/* Right Section */}
        <div className="w-[45%] flex flex-col justify-center py-20 px-24">
         <h2 className="text-headline-3 font-bold mb-4 text-monochrome-800">Reset Password</h2>
         {error && <AlertBox
                       alertType="error"
                       title="Error"
                       message={error}
                     />}
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
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* Submit Button */}
            
            <button onClick={handleSubmit} className="w-full bg-primary-600 text-white text-headline-6 py-2 rounded-[7px] hover:bg-primary-700 transition h-[3.7rem] font-bold">
                Sent Verification Code
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetBlock;

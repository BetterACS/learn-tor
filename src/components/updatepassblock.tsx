'use client';
import { trpc } from '@/app/_trpc/client';
import React, { useState } from 'react';
import { useSearchParams,useRouter } from 'next/navigation';
import { AlertBox } from '@/components/index';
const UpdateBlock = () => {
  const [error, setError] = useState('');
  const mutation = trpc.editUser.useMutation();
  const router = useRouter();
  const [formValues, setFormValues] = useState({
      password: "",
      confirmPassword: "",
    });
  const email = useSearchParams().get('email') || '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const newFormValues = {
          ...formValues,
          [name]: value,
      };
      setFormValues(newFormValues);
    };  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Email is required');
      router.push('forget')
      return;
    }
    if (formValues.password !== formValues.confirmPassword) {
      setError('Passwords do not match');
      setFormValues((prevValues) => ({
        ...prevValues,
        password: '',
        confirmPassword: '',
      })
      );
      return;
    }
    
    mutation.mutate(
      {
        email: email,
        updates:{
          password: formValues.password,
        }
      },
      {
        onSuccess: (data) => {
          if (data.status !== 200) {
            console.warn('verification Error:', data.data.message);
            setError(data.data.message);
          } else if (data.status === 200) {
            console.log('verification Success:', data.data.message);
            router.push('/login?updated=true');
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
    <div className="flex items-center justify-center min-h-screen ">
      <div className="flex bg-white rounded-[25px] shadow-lg overflow-hidden w-[1200px] h-[600px]">
        <div className="w-[55%] bg-primary-600 flex flex-col justify-center items-center text-white p-8">
        <img src='/images/Learntorbgg.avif' className="w-full h-full object-contain" alt="Learntor Logo"/>
        </div>
        {/* Right Section */}
        <div className="w-[45%] flex flex-col justify-center py-20 px-24">
         <div className="text-headline-3 font-bold mb-4 text-monochrome-800">Update Password</div>
          {error && <AlertBox alertType="error" title="Error" message={error} />}
          <p className="text-monochrome-500 mb-9">
            Enter new password
          </p>
          <form action="#" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-8">
              <input
                type="password"
                placeholder="New Password"
                className="border border-monochrome-1000 py-2 px-4 w-full rounded-[7px] focus:outline-none focus:ring-2 focus:ring-primary-600 h-[3.7rem]"
                name="password"
                onChange={handleChange}
                value={formValues.password}
              />
            </div>
            {/* Password */}
            <div className="mb-8">
              <input
                type="password"
                placeholder="Confirm Password"
                className="border border-monochrome-1000 py-2 px-4 w-full rounded-[7px] focus:outline-none focus:ring-2 focus:ring-primary-600 h-[3.7rem]"
                name="confirmPassword"
                onChange={handleChange}
                value={formValues.confirmPassword}
              />
            </div>
            {/* Submit Button */}
            <button type="submit"
              className="w-full bg-primary-600 text-white text-headline-6 py-2 rounded-[7px] hover:bg-primary-700 transition h-[3.7rem] font-bold">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateBlock;

'use client';
import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import { trpc } from '@/app/_trpc/client';
import { AlertBox } from '@/components/index';
const RegisterBlock = () => {
  const [formValues, setFormValues] = useState({
    username:"",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState('');
  useEffect(() => {
    const storedValues = JSON.parse(localStorage.getItem("formValues") || "{}");
    setFormValues((prevValues) => ({
      ...prevValues,
      username: storedValues.username || '',
      email: storedValues.email || '',
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormValues = {
        ...formValues,
        [name]: value,
    };
    setFormValues(newFormValues);
    const { password,confirmPassword, ...valuesToStore } = newFormValues;
    localStorage.setItem('formValues', JSON.stringify(valuesToStore));
    console.log(localStorage.getItem('formValues'));
  };  

  const mutation = trpc.register.useMutation();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValues.password !== formValues.confirmPassword) {
      setError('Passwords do not match');
      setFormValues((prevValues) => ({
        ...prevValues,
        password: '',
        confirmPassword: '',
      }));
      return;
    }

    mutation.mutate(
      { email: formValues.email, password: formValues.password, username: formValues.username },
      {
          onSuccess: (data) => {
              if (data.status !== 200) {
                  console.warn("Validation Error:", data.data.message);
                  setError(data.data.message);
              } else if (data.status === 200) {
                  console.log("Mutation Successful:", data);
                  window.location.href = '/login?need-verify=true'; 
              }
          },
          onError: (error) => {
              console.error("Mutation Failed:", error);
              setError(error.message);
          },
      }
  );    
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="flex bg-monochrome-50 rounded-[25px] shadow-lg overflow-hidden w-[1200px] h-[600px]">
        <div className="w-[55%] bg-primary-600 flex flex-col justify-center items-center text-monochrome-50 p-8">
        <img src='/images/Learntorbgg.avif' className="w-full h-full object-contain" alt="Learntor Logo"/>
        </div>
        {/* Right Section */}
        <div className="w-[45%] py-20 px-24">
         <div className="text-headline-3 font-bold mb-4 text-monochrome-800">Sign up</div>
          <p className="text-monochrome-500 mb-9">
            Create your account in seconds 
          </p>
          <form onSubmit={handleSubmit} action="#">
            {error && <AlertBox
              alertType="error"
              title="Error"
              message={error}
            />}
            {/* Username */}
            <div className="mb-8">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formValues.username}
                onChange={handleChange}
                required
                className="border border-monochrome-1000 py-2 px-4 w-full rounded-[7px] focus:outline-none focus:ring-2 focus:ring-primary-600 h-[3.7rem]"
              />
            </div>
            {/* Email */}
            <div className="mb-8">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formValues.email}
                onChange={handleChange}
                required
                className="border border-monochrome-1000 py-2 px-4 w-full rounded-[7px] focus:outline-none focus:ring-2 focus:ring-primary-600 h-[3.7rem]"
              />
            </div>
            {/* Password */}
            <div className="mb-8">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formValues.password}
                onChange={handleChange}
                required
                className="border border-monochrome-1000 py-2 px-4 w-full rounded-[7px] focus:outline-none focus:ring-2 focus:ring-primary-600 h-[3.7rem]"
              />
            </div>
            {/* Confirm Password */}
            <div className="mb-8">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formValues.confirmPassword}
                onChange={handleChange}
                required
                className="border border-monochrome-1000 py-2 px-4 w-full rounded-[7px] focus:outline-none focus:ring-2 focus:ring-primary-600 h-[3.7rem]"
              />
            </div>
            {/* Submit Button */}
            <button 
              className="w-full bg-primary-600 text-white text-headline-6 py-2 rounded-[7px] hover:bg-primary-700 transition h-[3.7rem] font-bold"
              type="submit">
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

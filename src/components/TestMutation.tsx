"use client";
import { trpc } from '@/app/_trpc/client';
import { useState } from 'react';

export default function TestMutationComponent() {
    const [name, setName] = useState('');
    const mutation = trpc.testMutation.useMutation();

    const handleSubmit = () => {
        // เพิ่ม validation เพื่อไม่ให้ส่งข้อมูลว่าง
        if (!name.trim()) {
            return;
        }

        mutation.mutate(
            { name },
            {
                onSuccess: (data) => {
                    console.log("Mutation Successful:", data);
                    alert(data.message);
                },
                onError: (error) => {
                    console.error("Mutation Failed:", error);
                },
            }
        );
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='rounded-tl-lg bg-yellow-50 text-black' 
            />
            <button 
                onClick={handleSubmit} 
                disabled={mutation.status === "pending" || !name.trim()}
            >
                Submit
            </button>
            {mutation.status === "pending" && <p>Loading...</p>}
            {mutation.error && <p>Error: {mutation.error.message}</p>}
        </div>
    );
}
'use client';
import { trpc } from '@/app/_trpc/client';
import { useState } from 'react';

export default function Test() {
    const [name, setName] = useState<string>('');
    const [id, setId] = useState<number>(0);
    const { data, isLoading, error, refetch } = trpc.testQuery.useQuery(
      { name, id }, // Input parameters
      { enabled: false } // Prevent auto-fetching
    );
    const mutation = trpc.testMutation.useMutation();
    const handleSubmit = () => {
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
        refetch();
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
            <input
                type="text"
                placeholder="Enter your ID"
                value={id}
                onChange={(e) => setId(Number(e.target.value))}
                className='rounded-tl-lg bg-yellow-50 text-black' 
            />
            <button onClick={handleSubmit} disabled={mutation.status === "pending"}> {/*'"error" | "idle" | "pending" | "success"' and '"loading"'  แต่ loading มีเฉพาะ query */}
                Submit
            </button>
            {mutation.status === "pending" && <p>Loading...</p>}
            {mutation.error && <p>Error: {mutation.error.message}</p>}

            {isLoading && <p>Loading...</p>}
            {!isLoading && <p>{data?.message}</p>}
        </div>
    );
}

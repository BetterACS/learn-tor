"use client"
import {trpc} from '@/app/_trpc/client'

export default function Test() {
    const input = { id: 123, name: "ABCDEFG" };
    const { data, isLoading, error } = trpc.testQuery.useQuery(input)
    // console.log("data",data)
    // console.log("isLoading",isLoading)
    // console.log("error",error)
    const testEnv = process.env.NEXT_PUBLIC_TEST_ENV || "หาไม่เจอ";
    return (
        <div>
            {data?.message}
            <h3>{testEnv}</h3>
        </div>
    )
}
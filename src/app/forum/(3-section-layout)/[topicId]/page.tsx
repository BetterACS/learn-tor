'use client';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { CommentSection, CommentInput, PostInteractionBar } from '@/components/index';

export default function Topic() {
  const search_params = useSearchParams();
  const router = useRouter();
  const raw_data = search_params.keys().next().value;
  const data = raw_data ? JSON.parse(raw_data) : null;

  return (
    <div className="relative w-full h-full">
      {/* Back button */}
      <button onClick={() => router.back()} className="absolute top-1 -left-6 size-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="scale-[110%] fill-none stroke-black hover:stroke-primary-600 transition duration-100"
        >
          <g strokeLinejoin="round" strokeWidth={3}>
            <path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"></path>
            <path strokeLinecap="round" d="m27 33l-9-9l9-9"></path>
          </g>
        </svg>
      </button>
      <div className="w-full h-full flex flex-col px-[10%] gap-6">
        {/* Post username section */}
        <div className="flex content-center items-center gap-2">
          <div className="size-10">
            <img src='/images/profile.png' className="w-full h-full object-cover rounded-full"/>
          </div>
          <p className="text-headline-6 font-bold">
            Username
          </p>
          <p className="text-subtitle-small">•</p>
          <p className="text-subtitle-small text-monochrome-400">
            second ago
          </p>
        </div>
        {/* Post details */}
        <div className="w-full h-full flex flex-col items-center gap-2">
          <div className="w-full h-fit text-headline-4">{data.title}</div>
          {/* <div className="text-body-large">{data.body}</div> */}
          <div className="h-[25rem] w-full">
            <img src={data.img} className="w-full h-full object-cover"/>
          </div>
          <PostInteractionBar post={data} comment_enable={false} />
        </div>
        {/* Comment text area */}
        <div className="flex">
          <CommentInput topic_id={null} parent_id={null} />
        </div>
        <div>
          <CommentSection />
        </div>
      </div>
    </div>
  )
}
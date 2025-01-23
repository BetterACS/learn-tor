'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PostInteractionBar } from '@/components/index';

interface PostProps {
  post: { id: number, img: string, title: string, body: string };
}


export default function Post({ post }: PostProps) {
  const router = useRouter();

  // Not yet added comment auto focus functionality when redirect with comment button
  const onCommentClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    // event.preventDefault();
    // const query = JSON.stringify(post);
    // router.push(`/forum/${post.id}?${query}`);
  }

  return (
    <Link
    href={{ pathname: `/forum/${post.id}`,
    query: JSON.stringify(post)}}
    className="h-full w-full bg-monochrome-50 drop-shadow-[0_0_6px_rgba(0,0,0,0.1)] rounded-xl text-start pt-6 pb-3 px-8 flex flex-col gap-3"
    >
      {/* Username Section */}
      <div className="flex content-center items-center gap-2">
        <div className="size-10">
          <img src='/images/profile.png' className="w-full h-full object-cover rounded-full"/>
        </div>
        <p className="text-body-large font-bold">
          Username
        </p>
        <p className="text-subtitle-small">•</p>
        <p className="text-subtitle-small text-monochrome-400">
          second ago
        </p>
      </div>
      {/* Body */}
      <div className="flex flex-col gap-2">
        <p className="text-headline-5">
          {post.title}
        </p>
        <p className='text-body-large'>
          {post.body}
        </p>
      </div>
      <div className="h-[25rem] w-full">
        <img src={post.img} className="w-full h-full object-cover"/>
      </div>
      {/* Interaction Bar */}
      <PostInteractionBar post={post} comment_enable={true} onCommentClicked={onCommentClicked}/>
    </Link>
  )
}
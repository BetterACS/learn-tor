'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { trpc } from '@/app/_trpc/client';
import { useSession } from 'next-auth/react';
import { count } from 'console';

interface PostProps {
  post: { 
    id: string | undefined, 
    img: string | undefined, 
    title: string | undefined, 
    body: string | undefined, 
    like: number | undefined, 
    isLiked: boolean | undefined,
    n_comment: number | undefined,
  };
  comment_enable: boolean;
  onCommentClicked?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}


export default function PostInteractionBar({ post, comment_enable, onCommentClicked }: PostProps) {
  const {data: session} = useSession();

  const [isLiked, setIsLiked] = useState<boolean>();
  const [isSaved, setIsSaved] = useState<boolean>();
  const [countLike, setCountLike] = useState<number>();
  const checkLikeMutation = trpc.checkLike.useMutation();
  
  useEffect(() => {
    if (session?.user?.email && post?.id) {
      checkLikeMutation.mutate({
        topic_id: post.id,
        email: session.user.email,
      }, {
        onSuccess: (data) => {
          if (typeof data.data !== 'string') {
            setIsLiked(data.data.liked); // Set the like status (true or false)
            setIsSaved(data.data.saved);
            setCountLike(data.data.n_like);
          }
        },
        onError: (error) => {
          console.error("Error checking like status:", error);
        }
      });
    }
  }, [session, post]);

  const [buttonStates, setButtonStates] = useState<Record<string, { liked: boolean, isClicked: boolean }>>({
    like: { liked: isLiked ?? false, isClicked: false },
    save: { liked: isSaved ?? false, isClicked: false },
    share: { liked: false, isClicked: false },
  });

  useEffect(() => {
      if (isLiked !== undefined) {
        setButtonStates((prev) => ({
          ...prev,
          like: {
            liked: isLiked, // ตั้งค่า liked ตาม isLiked
            isClicked: false, // สถานะการคลิก reset
          },
        }));
      }
    }, [isLiked]);
  
    useEffect(() => {
      if (isSaved !== undefined) {
        setButtonStates((prev) => ({
          ...prev,
          save: {
            liked: isSaved, // ตั้งค่า liked ตาม isSaved
            isClicked: false, // สถานะการคลิก reset
          },
        }));
      }
    }, [isSaved]);

  const mutation = trpc.likeTopic.useMutation();

  // mockup like, save and share button animation
  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const buttonName = event.currentTarget.name as string;
    const type = buttonName as 'like' | 'save' | 'share';
    const status: boolean = !buttonStates[buttonName].liked;  // กำหนดประเภทเป็น boolean
    const topic_id = post.id?.toString();
    const email = session?.user?.email;
    if (!email) {
      alert("You must Login first.!")
      return
    }
    if (!topic_id) {
      console.error("Post ID is missing!")
      return
    }

    mutation.mutate(
      { 
        topic_id: topic_id,
        type: type,
        email: email,
        status: status,
      },
      {
        onSuccess: (data) => {
          if (data?.data?.n_like != null) {
            setCountLike((data as { data: { n_like: number } }).data.n_like);
          }
          
        },
        onError: (error) => {
          console.error("Mutation Failed:", error);
        }
        
      }
    );

    
    setButtonStates((prev) => {
      const currentButtonState = prev[buttonName];
      return {
        ...prev,
        [buttonName]: {
          liked: status,
          isClicked: true,
        },
      };
    });

    setTimeout(() => {
      setButtonStates((prev) => ({
        ...prev,
        [buttonName]: {
          ...prev[buttonName],
          isClicked: false,
        },
      }));
    }, 300);
    
  };
  return (
    <div className="flex gap-2 self-start">
      {/* Like */}
      <button type="button" name="like" onClick={handleClick} className={`text-button flex items-center gap-1 bg-monochrome-100 py-2 px-2 rounded-[1.5rem] transition duration-200 ${buttonStates.like.liked ? 'bg-primary-500 text-monochrome-50 hover:text-monochrome-50' : 'bg-monochrome-100 text-monochrome-950 hover:text-primary-500'}`}>
        <svg className={`size-6 transition-transform duration-200 ${buttonStates.like.isClicked ? 'scale-125' : 'scale-100'}`} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 1024 1024"><path fill="currentColor" d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7c0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4c47.6-20.3 78.3-66.8 78.3-118.4c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c-.2-12.6-2-25.1-5.6-37.1M184 852V568h81v284zm636.4-353l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5a44.1 44.1 0 0 1 42.2-32.3c7.6 0 15.1 2.2 21.1 6.7c9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43"></path></svg>
        <p>
          {countLike} Like
        </p>
      </button>
      {/* Comment */}
      {comment_enable &&
      <button 
        type="button" 
        name="comment"
        onClick={onCommentClicked}
        className={`text-button flex items-center gap-1 bg-monochrome-100 py-2 px-2 rounded-[1.5rem] group hover:text-primary-500 transition duration-200`}
      >
        <svg className="size-6" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path className="fill-current" d="M144 208C126.3 208 112 222.2 112 239.1C112 257.7 126.3 272 144 272s31.1-14.25 31.1-32S161.8 208 144 208zM256 207.1c-17.75 0-31.1 14.25-31.1 32s14.25 31.1 31.1 31.1s31.1-14.25 31.1-31.1S273.8 207.1 256 207.1zM368 208c-17.75 0-31.1 14.25-31.1 32s14.25 32 31.1 32c17.75 0 31.99-14.25 31.99-32C400 222.2 385.8 208 368 208zM256 31.1c-141.4 0-255.1 93.12-255.1 208c0 47.62 19.91 91.25 52.91 126.3c-14.87 39.5-45.87 72.88-46.37 73.25c-6.624 7-8.373 17.25-4.624 26C5.818 474.2 14.38 480 24 480c61.49 0 109.1-25.75 139.1-46.25c28.87 9 60.16 14.25 92.9 14.0c141.4 0 255.1-93.13 255.1-207.1S397.4 31.1 256 31.1zM256 400c-26.75 0-53.12-4.125-78.36-12.12l-22.75-7.125L135.4 394.5c-14.25 10.12-33.87 21.38-57.49 29c7.374-12.12 14.37-25.75 19.87-40.25l10.62-28l-20.62-21.87C69.81 314.1 48.06 282.2 48.06 240c0-88.25 93.24-160 207.1-160s207.1 71.75 207.1 160S370.8 400 256 400z"/></svg>
        <p className="text-nowrap">
          {post.n_comment} Comment
        </p>
      </button>
      }
      {/* Bookmark */}
      <button type="button" name="save" onClick={handleClick} className={`text-button flex items-center gap-1 bg-monochrome-100 py-2 px-2 rounded-[1.5rem] transition duration-200 ${buttonStates.save.liked ? 'bg-primary-500 text-monochrome-50 hover:text-monochrome-50' : 'bg-monochrome-100 text-monochrome-950 hover:text-primary-500'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className={`size-6 transition-transform duration-200 ${buttonStates.save.isClicked ? 'scale-125' : 'scale-100'}`}><path fill="currentColor" d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/></svg>
      </button>
      {/* Share */}
      <button type="button" name="share" onClick={handleClick} className={`text-button flex items-center gap-1 bg-monochrome-100 py-2 px-2 rounded-[1.5rem] hover:text-primary-500 transition duration-200`}>
        <svg className={`size-6 transition-transform duration-200`} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="m21.707 11.293l-8-8A1 1 0 0 0 12 4v3.545A11.015 11.015 0 0 0 2 18.5V20a1 1 0 0 0 1.784.62a11.46 11.46 0 0 1 7.887-4.049c.05-.006.175-.016.329-.026V20a1 1 0 0 0 1.707.707l8-8a1 1 0 0 0 0-1.414M14 17.586V15.5a1 1 0 0 0-1-1c-.255 0-1.296.05-1.562.085a14 14 0 0 0-7.386 2.948A9.013 9.013 0 0 1 13 9.5a1 1 0 0 0 1-1V6.414L19.586 12Z"></path></svg>
        <p>
          Share
        </p>
      </button>
    </div>
  )
} 
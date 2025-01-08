'use client';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { CommentSection } from '@/components/index';

export default function Topic() {
  const search_params = useSearchParams();
  const router = useRouter();
  const raw_data = search_params.keys().next().value;
  const data = raw_data ? JSON.parse(raw_data) : null;

  const [isCommentExpanded, setIsCommentExpanded] = useState(false);
  const [comment, setComment] = useState('');
  const [buttonStates, setButtonStates] = useState<Record<string, { liked: boolean, isClicked: boolean }>>({
    like: { liked: false, isClicked: false },
    save: { liked: false, isClicked: false },
    share: { liked: false, isClicked: false },
  });

  // mockup like, save and share button animation
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonName = event.currentTarget.name as string;

    if (buttonName) {
      setButtonStates((prev) => {
        const currentButtonState = prev[buttonName];

        return {
          ...prev,
          [buttonName]: {
            liked: !currentButtonState.liked,
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
    }
  };

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
          <div className="flex gap-2 self-start">
            {/* Like */}
            <button type="button" name="like" onClick={handleClick} className={`text-button flex items-center gap-1 bg-monochrome-100 py-2 px-2 rounded-[1.5rem] transition duration-200 ${buttonStates.like.liked ? 'bg-primary-500 text-monochrome-50 hover:text-monochrome-50' : 'bg-monochrome-100 text-monochrome-950 hover:text-primary-500'}`}>
              <svg className={`size-6 transition-transform duration-200 ${buttonStates.like.isClicked ? 'scale-125' : 'scale-100'}`} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 1024 1024"><path fill="currentColor" d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7c0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4c47.6-20.3 78.3-66.8 78.3-118.4c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c-.2-12.6-2-25.1-5.6-37.1M184 852V568h81v284zm636.4-353l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5a44.1 44.1 0 0 1 42.2-32.3c7.6 0 15.1 2.2 21.1 6.7c9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43"></path></svg>
              <p>
                Like
              </p>
            </button>
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
        </div>
        {/* Comment text area */}
        <div className="flex">
          <div className={`w-full h-fit rounded-[1.1rem] flex flex-col gap-2 px-3 py-3 border ${!isCommentExpanded ? "border-monochrome-500" : "border-primary-600"}`} onClick={() => !isCommentExpanded ? setIsCommentExpanded(true) : null}>
            <textarea 
              name="comment_text_area"
              value={comment}
              id=""
              placeholder="Add a comment"
              rows={!isCommentExpanded ? 1 : 2}
              onChange={(e) => setComment(e.target.value)}
              className={`w-full text-body-large text-monochrome-950 placeholder-monochrome-600 resize-none outline-none scrollbar-thin scrollbar-track-transparent scrollbar-thumb-monochrome-100 caret-monochrome-600`}
            ></textarea>
            {isCommentExpanded && (
              <div className="flex justify-end gap-1 text-button">
                <button 
                  className="px-3 py-3 rounded-[1.3rem] bg-monochrome-200"
                  onClick={() => {setIsCommentExpanded(false); setComment("");}}
                >
                  Cancle
                </button>
                <button className="px-3 py-3 rounded-[1.3rem] bg-primary-600 text-monochrome-50">
                  Comment
                </button>
              </div>
            )}
          </div>
        </div>
        <div>
          <CommentSection />
        </div>
      </div>
    </div>
  )
}
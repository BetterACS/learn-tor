'use client';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Topic() {
  const search_params = useSearchParams();
  const router = useRouter();
  const raw_data = search_params.keys().next().value;
  const data = raw_data ? JSON.parse(raw_data) : null;

  const [selectedFilter, setSelectedFilter] = useState("Newest");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [comment, setComment] = useState('');
  const [buttonStates, setButtonStates] = useState<Record<string, { liked: boolean, isClicked: boolean }>>({
    like: { liked: false, isClicked: false },
    save: { liked: false, isClicked: false },
    share: { liked: false, isClicked: false },
  });

  const filters = ["Newest", "Oldest", "Most Likes"];

  interface Comment {
    username: string;
    time: string; // You can use `number` if you store the time as a numeric value.
    text: string;
    likes: number;
  }
  
  // mockup comment data
  // // if there aren't any comment (sort by will not display)
  // const comments: Comment[] = [];

  // if there are comments
  const comments: Comment[] = [
    {
      username: "Dummy",
      time: "1",
      text: "มีการให้ทำงานเป็นโปรเจคจริงๆในแต่ละวิชา พี่แนะนำมากๆๆ",
      likes: 4
    },
    {
      username: "Username6",
      time: "1",
      text: "ผมกำลังเรียนอยู่ครับ อาจารย์ที่นี่ใจดี ให้คำปรึกษาได้ในหลายๆเรื่อง โดยรวมถือว่าชอบมากครับ",
      likes: 24
    }
  ];

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
        <div className="flex content-center items-center gap-2">
          <div className="size-10">
            <img src="https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&h=1280&q=80" className="w-full h-full object-cover rounded-full"/>
          </div>
          <div className="text-headline-6">
            Username
          </div>
          <div className="text-body-large">
            -
          </div>
          <div className="text-subtitle-small">
            second ago
          </div>
        </div>
        <div className="w-full h-full flex flex-col items-center gap-2">
          <div className="w-full h-fit text-headline-4">{data.title}</div>
          {/* <div className="text-body-large">{data.body}</div> */}
          <div className="h-[25rem] w-full">
            <img src={data.img} className="w-full h-full object-cover"/>
          </div>
          <div className="flex gap-2 self-start">
            <button type="button" name="like" onClick={handleClick} className={`text-button flex items-center gap-1 bg-monochrome-100 py-2 px-2 rounded-[1.5rem] transition duration-200 ${buttonStates.like.liked ? 'bg-primary-500 text-monochrome-50 hover:text-monochrome-50' : 'bg-monochrome-100 text-monochrome-950 hover:text-primary-500'}`}>
              <svg className={`size-6 transition-transform duration-200 ${buttonStates.like.isClicked ? 'scale-125' : 'scale-100'}`} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 1024 1024"><path fill="currentColor" d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7c0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4c47.6-20.3 78.3-66.8 78.3-118.4c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c-.2-12.6-2-25.1-5.6-37.1M184 852V568h81v284zm636.4-353l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5a44.1 44.1 0 0 1 42.2-32.3c7.6 0 15.1 2.2 21.1 6.7c9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43"></path></svg>
              <p>
                Like
              </p>
            </button>
            <button type="button" name="save" onClick={handleClick} className={`text-button flex items-center gap-1 bg-monochrome-100 py-2 px-2 rounded-[1.5rem] hover:text-primary-500 transition duration-200 ${buttonStates.save.liked ? 'bg-primary-500 text-monochrome-50 hover:text-monochrome-50' : 'bg-monochrome-100 text-monochrome-950 hover:text-primary-500'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className={`size-6 transition-transform duration-200 ${buttonStates.save.isClicked ? 'scale-125' : 'scale-100'}`}><path fill="currentColor" d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/></svg>
            </button>
            <button type="button" name="share" onClick={handleClick} className={`text-button flex items-center gap-1 bg-monochrome-100 py-2 px-2 rounded-[1.5rem] hover:text-primary-500 transition duration-200`}>
              <svg className={`size-6 transition-transform duration-200`} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="m21.707 11.293l-8-8A1 1 0 0 0 12 4v3.545A11.015 11.015 0 0 0 2 18.5V20a1 1 0 0 0 1.784.62a11.46 11.46 0 0 1 7.887-4.049c.05-.006.175-.016.329-.026V20a1 1 0 0 0 1.707.707l8-8a1 1 0 0 0 0-1.414M14 17.586V15.5a1 1 0 0 0-1-1c-.255 0-1.296.05-1.562.085a14 14 0 0 0-7.386 2.948A9.013 9.013 0 0 1 13 9.5a1 1 0 0 0 1-1V6.414L19.586 12Z"></path></svg>
              <p>
                Share
              </p>
            </button>
          </div>
        </div>
        <div className="flex">
          <div className={`w-full h-fit rounded-[1.1rem] flex flex-col gap-2 px-3 py-3 border ${!isExpanded ? "border-monochrome-500" : "border-primary-600"}`} onClick={() => !isExpanded ? setIsExpanded(true) : null}>
            <textarea 
              name="comment_section"
              value={comment}
              id=""
              placeholder="Add a comment"
              rows={!isExpanded ? 1 : 2}
              onChange={(e) => setComment(e.target.value)}
              className={`w-full text-body-large text-monochrome-950 placeholder-monochrome-600 resize-none outline-none scrollbar-thin scrollbar-track-transparent scrollbar-thumb-monochrome-100`}
            ></textarea>
            {isExpanded && (
              <div className="flex justify-end gap-1 text-button">
                <button 
                  className="px-3 py-3 rounded-[1.3rem] bg-monochrome-200"
                  onClick={() => {setIsExpanded(false); setComment("");}}
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
        {comments.length > 0 && 
        <div className="flex flex-col gap-6">
          <div className="relative flex w-fit gap-2 items-center">
            <p>
              Sort by: 
            </p>
            <button 
              className="w-32 flex py-2 px-1 gap-1 items-center justify-between border-b border-monochrome-200 transition duration-100"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <p>
                {selectedFilter}
              </p>
              <svg className="size-6" xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><title>down_line</title><g id="down_line" fill='none' fillRule='evenodd'><path d='M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z'/><path fill='black' d='M12.707 15.707a1 1 0 0 1-1.414 0L5.636 10.05A1 1 0 1 1 7.05 8.636l4.95 4.95 4.95-4.95a1 1 0 0 1 1.414 1.414l-5.657 5.657Z'/></g></svg>
            </button>
            {dropdownOpen && (
              <div className="absolute w-fit right-0 top-10 mt-2 bg-monochrome-50 text-monochrome-950 text-body-large text-nowrap rounded shadow-lg overflow-hidden text-center divide-y divide-monochrome-300">
                {filters.map((filter) => (
                  <label key={filter} className={`flex px-5 py-4 items-center text-button hover:bg-monochrome-100`}>
                    <input
                      type="radio"
                      key={filter}
                      onClick={() => {setSelectedFilter(filter); setDropdownOpen(false);}}
                      className="hidden"
                    />                    
                    <span>{filter}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Comment Section */}
          <div className="flex flex-col gap-8">
            {comments.map((comment, index) => (
              <div key={index} className="flex gap-1">
                <div className="rounded-full w-10 min-w-10">
                  <img src='/images/profile.png'/>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-3 items-center">
                    <p className="text-headline-6 font-bold">
                      {comment.username}
                    </p>
                    <p>-</p>
                    <p className="text-subtitle-small text-monochrome-400">
                      {comment.time} hr ago
                    </p>
                  </div>
                  <p className="text-headline-5">
                    {comment.text}
                  </p>
                  <div className="flex gap-1">
                    <button type="button" name="like" className={`text-button flex items-center gap-1 bg-monochrome-100 text-monochrome-950 hover:text-primary-500 py-2 px-2 rounded-[1.5rem] transition duration-200 `}>
                      <svg className={`size-6 transition-transform duration-200`} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 1024 1024"><path fill="currentColor" d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7c0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4c47.6-20.3 78.3-66.8 78.3-118.4c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c-.2-12.6-2-25.1-5.6-37.1M184 852V568h81v284zm636.4-353l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5a44.1 44.1 0 0 1 42.2-32.3c7.6 0 15.1 2.2 21.1 6.7c9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43"></path></svg>
                      <p>
                        {comment.likes} Likes
                      </p>
                    </button>
                    <button type="button" name="share" className={`text-button flex items-center gap-1 bg-monochrome-100 py-2 px-2 rounded-[1.5rem] group hover:text-primary-500 transition duration-200`}>
                      <svg className="size-6" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path className="fill-current" d="M144 208C126.3 208 112 222.2 112 239.1C112 257.7 126.3 272 144 272s31.1-14.25 31.1-32S161.8 208 144 208zM256 207.1c-17.75 0-31.1 14.25-31.1 32s14.25 31.1 31.1 31.1s31.1-14.25 31.1-31.1S273.8 207.1 256 207.1zM368 208c-17.75 0-31.1 14.25-31.1 32s14.25 32 31.1 32c17.75 0 31.99-14.25 31.99-32C400 222.2 385.8 208 368 208zM256 31.1c-141.4 0-255.1 93.12-255.1 208c0 47.62 19.91 91.25 52.91 126.3c-14.87 39.5-45.87 72.88-46.37 73.25c-6.624 7-8.373 17.25-4.624 26C5.818 474.2 14.38 480 24 480c61.49 0 109.1-25.75 139.1-46.25c28.87 9 60.16 14.25 92.9 14.25c141.4 0 255.1-93.13 255.1-207.1S397.4 31.1 256 31.1zM256 400c-26.75 0-53.12-4.125-78.36-12.12l-22.75-7.125L135.4 394.5c-14.25 10.12-33.87 21.38-57.49 29c7.374-12.12 14.37-25.75 19.87-40.25l10.62-28l-20.62-21.87C69.81 314.1 48.06 282.2 48.06 240c0-88.25 93.24-160 207.1-160s207.1 71.75 207.1 160S370.8 400 256 400z"/></svg>
                      <p>
                        Comment
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>}
      </div>
    </div>
  )
}
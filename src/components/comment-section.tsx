'use client';

import { useEffect, useState, useRef } from 'react';

interface Comment {
  username: string;
  time: string;
  text: string;
  likes: number;
  comments: Comment[];
  level?: number;
}

interface CommentProps {
  comment: Comment;
  level: number;
}


const CommentComponent = ({ comment, level }: CommentProps) => {

  return (
    <div className="flex flex-col item-start">
      <div className="flex content-center items-center gap-2">
        <div className="size-10">
          <img src='/images/profile.png' className="w-full h-full object-cover rounded-full"/>
        </div>
        <p className="text-headline-6 font-bold">
          {comment.username}
        </p>
        <p className="text-subtitle-small">•</p>
        <p className="text-subtitle-small text-monochrome-400">
          {comment.time} hr ago
        </p>
      </div>

      <div className="flex">
        <div className="flex justify-end w-12 pt-2">
          {comment.comments.length > 0 &&
            <div className={`h-full w-[18px] border-l-2 border-monochrome-200`}></div>
              
          }
        </div>
        <div className="w-full flex flex-col ml-0 gap-2">
          {/* Comment text */}
          <p className="w-full text-headline-5">
            {comment.text}
          </p>

          {/* Buttons */}
          <div className="flex gap-1">
            <button type="button" name="like" className={`text-button flex items-center gap-1 bg-monochrome-100 text-monochrome-950 hover:text-primary-500 py-2 px-2 rounded-[1.5rem] transition duration-200 `}>
              <svg className={`size-6 transition-transform duration-200`} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 1024 1024"><path fill="currentColor" d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7c0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4c47.6-20.3 78.3-66.8 78.3-118.4c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c-.2-12.6-2-25.1-5.6-37.1M184 852V568h81v284zm636.4-353l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5a44.1 44.1 0 0 1 42.2-32.3c7.6 0 15.1 2.2 21.1 6.7c9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43"></path></svg>
              <p>
                {comment.likes} Likes
              </p>
            </button>
            <button type="button" name="share" className={`text-button flex items-center gap-1 bg-monochrome-100 py-2 px-2 rounded-[1.5rem] group hover:text-primary-500 transition duration-200`}>
              <svg className="size-6" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path className="fill-current" d="M144 208C126.3 208 112 222.2 112 239.1C112 257.7 126.3 272 144 272s31.1-14.25 31.1-32S161.8 208 144 208zM256 207.1c-17.75 0-31.1 14.25-31.1 32s14.25 31.1 31.1 31.1s31.1-14.25 31.1-31.1S273.8 207.1 256 207.1zM368 208c-17.75 0-31.1 14.25-31.1 32s14.25 32 31.1 32c17.75 0 31.99-14.25 31.99-32C400 222.2 385.8 208 368 208zM256 31.1c-141.4 0-255.1 93.12-255.1 208c0 47.62 19.91 91.25 52.91 126.3c-14.87 39.5-45.87 72.88-46.37 73.25c-6.624 7-8.373 17.25-4.624 26C5.818 474.2 14.38 480 24 480c61.49 0 109.1-25.75 139.1-46.25c28.87 9 60.16 14.25 92.9 14.0c141.4 0 255.1-93.13 255.1-207.1S397.4 31.1 256 31.1zM256 400c-26.75 0-53.12-4.125-78.36-12.12l-22.75-7.125L135.4 394.5c-14.25 10.12-33.87 21.38-57.49 29c7.374-12.12 14.37-25.75 19.87-40.25l10.62-28l-20.62-21.87C69.81 314.1 48.06 282.2 48.06 240c0-88.25 93.24-160 207.1-160s207.1 71.75 207.1 160S370.8 400 256 400z"/></svg>
              <p>
                Comment
              </p>
            </button>
          </div>
        </div>
      </div>
      {/* Nested comments */}
      {comment.comments.length > 0 && (
        <div className="relative w-full flex">
          {/* Nested comments */}
          <div className="flex flex-col ml-10 gap-6 pt-4">
            {comment.comments.map((nestedComment, index) => {
              // Function to check if there is a next same-level comment
              const checkIfNextSameLevel = (comments: Comment[], index: number): boolean => {
                if (index < comments.length - 1) {
                  return comments[index].level === comments[index + 1].level;
                }
                return false;
              };

              // Check if the current comment has a sibling at the same level
              const hasNextSameLevel = checkIfNextSameLevel(comment.comments, index);

              return (
                <div key={index} className="relative flex">
                  {/* Connecting line to profile image */}
                  <div 
                    className={`absolute -left-[14.1px] -top-6 h-12 w-6 border-b-2 border-l-2 border-monochrome-200 rounded-bl-lg`}
                  ></div>
                  {/* <p>{level}</p> */}
                  {hasNextSameLevel &&
                    <div 
                      className={`absolute -left-[14.1px] top-0 h-full w-6 border-l-2 border-monochrome-200`}
                      ></div>
                  }
                  {/* Display the calculated parent level for the nested comment */}
                  {/* <p>{level}</p> */}
                  {/* Check and display if there is a next same-level comment */}
                  {/* <p>{hasNextSameLevel ? "Y" : "N"}</p> */}

                  {/* Recursively render nested comments with updated level */}
                  <CommentComponent comment={nestedComment} level={level + 1}/>
                </div>
              );
            })}
          </div>
        </div>
      )}
  </div>
)}

export default function CommentSection() {
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedFilter, setSelectedFilter] = useState("Newest");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const filters = ["Newest", "Oldest", "Most Likes"];

  // mockup comment data
  // // if there aren't any comment (sort by will not display)
  // const comments: Comment[] = [];

  // if there are comments
  const comments: Comment[] = [
    {
      username: "Dummy",
      time: "1",
      text: "มีการให้ทำงานเป็นโปรเจคจริงๆในแต่ละวิชา พี่แนะนำมากๆๆ",
      likes: 4,
      comments: [{
        username: "Test1",
        time: "1",
        text: "testsetsets set setsetesses",
        likes: 2,
        comments: []
      }]
    },
    {
      username: "Username6",
      time: "1",
      text: "ผมกำลังเรียนอยู่ครับ อาจารย์ที่นี่ใจดี ให้คำปรึกษาได้ในหลายๆเรื่อง โดยรวมถือว่าชอบมากครับ",
      likes: 24,
      comments: [{
        username: "Test22",
        time: "1",
        text: "ฟหกสฟาหก้ สา่ฟห้ก สา่้ฟห กสา่ฟห้ก",
        likes: 8,
        comments: [{
          username: "Test3",
          time: "1",
          text: "asdasd asd asd asd as as",
          likes: 2,
          comments: []
        }]
      },
      {
        username: "Test4",
        time: "1",
        text: "heheheheheh haha",
        likes: 1000,
        comments: [{
          username: "Test5",
          time: "1",
          text: "hohohohohohohohoh",
          likes: 5,
          comments: [{
            username: "Test6",
            time: "1",
            text: "aaaa a a a aaa a a aa a",
            likes: 10,
            comments: []
          },
          {
            username: "Test7",
            time: "1",
            text: "u ii a i uu iii a ii",
            likes: 10,
            comments: [{
              username: "Test9",
              time: "1",
              text: "u ii a i uu iii a ii a a a as dasd asd sa d",
              likes: 220,
              comments: []
            }]
          },
          {
            username: "Test10",
            time: "1",
            text: "u ii a i uu iii a ii",
            likes: 10,
            comments: [{
              username: "Test9",
              time: "1",
              text: "u ii a i uu iii a ii a a a as dasd asd sa d",
              likes: 220,
              comments: []
            }]
          }]
        },
        {
          username: "Test8",
          time: "1",
          text: "u ii a i uu iii a ii u ii a i uu iii a ii",
          likes: 20,
          comments: [{
            username: "Test10",
            time: "1",
            text: "haaaaaaaaaaaaaaaa hahaha",
            likes: 2,
            comments: []
          }]
        }]
      }]
    }
  ];

  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* Users comment area */}
      {/* Sort by */}
      {comments.length > 0 && 
      <div className="flex flex-col gap-6">
        <div className="flex w-fit gap-2 items-center">
          <p>
            Sort by: 
          </p>
          <div ref={sortDropdownRef} className="relative h-full flex w-fit gap-2 items-center">
            <button
              className="w-32 flex py-2 px-1 gap-1 items-center justify-between border-b border-monochrome-200 transition duration-100 hover:bg-monochrome-100"
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
            >
              <p>
                {selectedFilter}
              </p>
              <svg className="size-6" xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><title>down_line</title><g id="down_line" fill='none' fillRule='evenodd'><path d='M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z'/><path fill='black' d='M12.707 15.707a1 1 0 0 1-1.414 0L5.636 10.05A1 1 0 1 1 7.05 8.636l4.95 4.95 4.95-4.95a1 1 0 0 1 1.414 1.414l-5.657 5.657Z'/></g></svg>
            </button>
            {sortDropdownOpen && (
              <div className="absolute w-fit right-0 top-10 mt-2 bg-monochrome-50 text-monochrome-950 text-body-large text-nowrap rounded shadow-lg overflow-hidden text-center divide-y divide-monochrome-300">
                {filters.map((filter) => (
                  <label key={filter} className={`flex px-5 py-4 items-center text-button hover:bg-monochrome-100 hover:cursor-pointer ${selectedFilter === filter ? "bg-monochrome-200" : ""}`}>
                    <input
                      type="radio"
                      key={filter}
                      onClick={() => {setSelectedFilter(filter); setSortDropdownOpen(false);}}
                      className="hidden"
                    />                    
                    <span>{filter}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comments */}
        <div className="flex flex-col gap-8">
          {comments.map((comment, index) => (
            <CommentComponent key={index} comment={comment} level={1}/>
          ))}
        </div>
      </div>}
    </div>
  )
}